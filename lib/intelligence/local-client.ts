import { createHash, randomUUID } from 'node:crypto';
import { promises as fs } from 'node:fs';
import { join } from 'node:path';
import { callSystemTool, systemTools } from './tools';
import { SystemError } from './store';
import { publicError } from './reliability';

export type ToolRequest = { tool: string; arguments: Record<string, unknown> };
type Entry = {
  version: 1;
  key: string;
  request: ToolRequest;
  createdAt: string;
  state: 'pending' | 'confirmed' | 'rejected';
  result?: unknown;
  error?: { status: number; message: string; retryable: boolean };
};
export type Executor = (tool: string, args: unknown) => Promise<unknown>;
const digest = (value: unknown) =>
  createHash('sha256').update(JSON.stringify(value)).digest('hex');

export async function durableWrite(
  path: string,
  value: unknown,
  exclusive = false,
) {
  const temporary = `${path}.${randomUUID()}.tmp`;
  const file = await fs.open(temporary, 'wx', 0o600);
  try {
    await file.writeFile(JSON.stringify(value));
    await file.sync();
  } finally {
    await file.close();
  }
  try {
    if (exclusive) await fs.link(temporary, path);
    else await fs.rename(temporary, path);
  } finally {
    await fs.unlink(temporary).catch(() => {});
  }
  const directory = await fs.open(join(path, '..'), 'r');
  try {
    await directory.sync();
  } finally {
    await directory.close();
  }
}

export class LocalIntelligenceClient {
  constructor(
    readonly directory: string,
    private execute: Executor = callSystemTool,
  ) {}
  private async ready() {
    for (const dir of ['pending', 'confirmed', 'rejected', 'cache'])
      await fs.mkdir(join(this.directory, dir), {
        recursive: true,
        mode: 0o700,
      });
  }
  private path(state: string, key: string) {
    return join(this.directory, state, `${digest(key)}.json`);
  }
  private async read(path: string) {
    try {
      return JSON.parse(await fs.readFile(path, 'utf8'));
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') return null;
      throw new SystemError(
        'Local system journal needs repair; no data was discarded.',
        503,
      );
    }
  }
  async status() {
    await this.ready();
    const counts: Record<string, number> = {};
    for (const state of ['pending', 'confirmed', 'rejected'])
      counts[state] = (await fs.readdir(join(this.directory, state))).filter(
        (name) => name.endsWith('.json'),
      ).length;
    return counts;
  }
  async flush() {
    await this.ready();
    const deadline = Date.now() + 15000;
    const names = (await fs.readdir(join(this.directory, 'pending'))).filter(
      (name) => name.endsWith('.json'),
    );
    const entries: Entry[] = [];
    for (const name of names) {
      const entry = await this.read(join(this.directory, 'pending', name));
      if (entry) entries.push(entry);
    }
    entries.sort(
      (a, b) =>
        a.createdAt.localeCompare(b.createdAt) || a.key.localeCompare(b.key),
    );
    for (const entry of entries.slice(0, 20)) {
      // Multiple processes may replay the same pending item. Database request IDs serialize/deduplicate them.
      try {
        const result = await this.execute(
          entry.request.tool,
          entry.request.arguments,
        );
        await durableWrite(this.path('confirmed', entry.key), {
          ...entry,
          state: 'confirmed',
          result,
        });
        await fs.unlink(this.path('pending', entry.key)).catch((error) => {
          if (error.code !== 'ENOENT') throw error;
        });
      } catch (error) {
        const safe = publicError(error);
        if (safe.retryable || safe.status === 404) break; // The prerequisite investigation may itself still be pending.
        await durableWrite(this.path('rejected', entry.key), {
          ...entry,
          state: 'rejected',
          error: safe,
        });
        await fs.unlink(this.path('pending', entry.key)).catch((error) => {
          if (error.code !== 'ENOENT') throw error;
        });
      }
      if (Date.now() >= deadline) break;
    }
    return this.status();
  }
  async call(tool: string, args: unknown) {
    const definition = systemTools.find((t) => t.name === tool);
    if (!definition) throw new SystemError('Unknown system tool.', 404);
    const parsed = definition.schema.parse(args) as Record<string, unknown>;
    const request = { tool, arguments: parsed };
    await this.ready();
    if (definition.readOnly) {
      const path = this.path('cache', digest(request));
      try {
        const result = await this.execute(tool, parsed);
        await durableWrite(path, {
          result,
          cachedAt: new Date().toISOString(),
        });
        return { result, availability: 'live', outbox: await this.status() };
      } catch (error) {
        if (tool === 'system_health' || !publicError(error).retryable)
          throw error;
        const cached = await this.read(path);
        if (!cached) throw error;
        return {
          ...cached,
          availability: 'cached',
          stale: true,
          warning:
            'Database unavailable. This is an earlier local snapshot; current state and freshness are unconfirmed.',
          outbox: await this.status(),
        };
      }
    }
    const key = String(parsed.requestId ?? `start:${digest(request)}`);
    for (const state of ['pending', 'confirmed', 'rejected']) {
      const existing = await this.read(this.path(state, key));
      if (existing && digest(existing.request) !== digest(request))
        throw new SystemError(
          'Local request ID belongs to different content. Use a new ID for changed content.',
          409,
        );
      if (existing && state === 'rejected')
        throw new SystemError(existing.error.message, existing.error.status);
    }
    const entry: Entry = {
      version: 1,
      key,
      request,
      createdAt: new Date().toISOString(),
      state: 'pending',
    };
    try {
      await durableWrite(this.path('pending', key), entry, true);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'EEXIST') throw error;
      const existing = await this.read(this.path('pending', key));
      if (existing && digest(existing.request) !== digest(request))
        throw new SystemError('Concurrent request ID conflict.', 409);
    }
    await this.flush();
    const rejected = await this.read(this.path('rejected', key));
    if (rejected)
      throw new SystemError(rejected.error.message, rejected.error.status);
    const pending = await this.read(this.path('pending', key));
    const confirmed = await this.read(this.path('confirmed', key));
    if (confirmed && digest(confirmed.request) !== digest(request))
      throw new SystemError('Concurrent request ID conflict.', 409);
    if (!pending && confirmed)
      return {
        saved: true,
        result: confirmed.result,
        outbox: await this.status(),
      };
    return {
      saved: false,
      queued: true,
      previouslyConfirmed: !!confirmed,
      requestId: key,
      message:
        'Saved to the private local outbox; current database confirmation is pending. Retry unchanged or run system:flush.',
      outbox: await this.status(),
    };
  }
}
