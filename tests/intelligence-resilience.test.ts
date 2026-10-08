import test from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID, randomBytes } from 'node:crypto';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { config } from 'dotenv';
import { neon } from '@neondatabase/serverless';
import { callSystemTool } from '../lib/intelligence/tools';
import { LocalIntelligenceClient } from '../lib/intelligence/local-client';
import { SystemError } from '../lib/intelligence/store';
import {
  takeSnapshot,
  encryptSnapshot,
  decryptSnapshot,
  restoreSnapshot,
  snapshotHash,
} from '../lib/intelligence/backup';
import { POST, GET } from '../app/api/intelligence/route';
import {
  GET as recoveryGet,
  POST as recoveryPost,
} from '../app/api/intelligence/recovery/route';
import { POST as mcpPost } from '../app/api/intelligence/mcp/route';
config({ path: '.env.intelligence.local', quiet: true });
config({ path: '.env.local', quiet: true });
const uuid = randomUUID();
const companyId = `test-${uuid}`;
const investigationId = `victoria:${companyId}`;
const prefix = `resilience-${uuid}`;
const discussion = (key: string, text = 'durable context') => ({
  requestId: `${prefix}-${key}`,
  kind: 'discussion',
  payload: {
    speaker: 'user',
    text,
    recordType: 'verbatim',
    sourceRef: 'automated-resilience-test',
  },
});
const call = (tool: string, args: Record<string, unknown>) =>
  callSystemTool(tool, args) as Promise<any>;

test('atomic saves, correction races, lost acknowledgements, offline reads and authenticated restore', async (t) => {
  const sql = neon(process.env.DATABASE_URL!);
  const dir = await mkdtemp(join(tmpdir(), 'wch-outbox-test-'));
  try {
    await call('start_investigation', {
      city: 'victoria',
      companyId,
      companyName: 'Resilience test',
      goal: 'Verify recovery',
    });
    await t.test(
      'a failed last event rolls back the complete turn',
      async () => {
        await assert.rejects(
          call('save_turn', {
            investigationId,
            requestId: `${prefix}-failed-turn`,
            events: [
              discussion('rollback'),
              {
                requestId: `${prefix}-bad-output`,
                kind: 'output',
                payload: {
                  title: 'test',
                  format: 'voice_brief',
                  content: 'test',
                  sourceRequestIds: ['nonexistent-record'],
                  sourceRef: 'test',
                },
              },
            ],
          }),
          { status: 400 },
        );
        assert.equal(
          (await call('recall_investigation', { investigationId })).events
            .length,
          0,
        );
      },
    );
    await t.test(
      'atomic turn retries are idempotent and changed batches conflict',
      async () => {
        const turn = {
          investigationId,
          requestId: `${prefix}-turn`,
          events: [
            discussion('first'),
            {
              requestId: `${prefix}-output`,
              kind: 'output',
              payload: {
                title: 'Brief',
                format: 'voice_brief',
                content: 'Remembered context',
                sourceRequestIds: [`${prefix}-first`],
                sourceRef: 'test',
              },
            },
          ],
        };
        const responses = await Promise.all([
          call('save_turn', turn),
          call('save_turn', turn),
        ]);
        assert.equal(responses.filter((r) => r.repeated).length, 1);
        assert.equal(
          (await call('recall_investigation', { investigationId })).events
            .length,
          2,
        );
        await assert.rejects(
          call('save_turn', {
            ...turn,
            events: [...turn.events, discussion('changed-batch')],
          }),
          { status: 409 },
        );
        assert.equal(
          (await call('recall_investigation', { investigationId })).events
            .length,
          2,
        );
      },
    );
    await t.test(
      'competing corrections have one winner and current context excludes stale versions',
      async () => {
        const memory = {
          investigationId,
          requestId: `${prefix}-interest`,
          kind: 'interest',
          text: 'Old interest',
          provenance: 'user_stated',
          sourceRef: 'test',
        };
        await call('record_memory', memory);
        const results = await Promise.allSettled(
          [1, 2].map((n) =>
            call('record_memory', {
              ...memory,
              requestId: `${prefix}-correction-${n}`,
              text: `Current procurement interest ${n}`,
              supersedesRequestId: memory.requestId,
            }),
          ),
        );
        assert.equal(results.filter((r) => r.status === 'fulfilled').length, 1);
        const context = await call('get_investigation_context', {
          investigationId,
        });
        assert.equal(context.current.records.length, 1);
        assert.match(
          context.current.records[0].payload.text,
          /Current procurement/,
        );
        const record = await call('get_record', {
          requestId: memory.requestId,
        });
        assert.ok(record.superseded_by);
        const search = await call('search_memory', {
          investigationId,
          query: 'procurement',
        });
        assert.equal(search.records.length, 1);
      },
    );
    await t.test(
      'commit followed by lost acknowledgement survives local-client restart without duplicate',
      async () => {
        const event = discussion('lost-ack');
        const args = {
          investigationId,
          ...event.payload,
          requestId: event.requestId,
        };
        const failing = new LocalIntelligenceClient(
          dir,
          async (name, payload) => {
            await callSystemTool(name, payload);
            throw new SystemError(
              'Simulated connection lost after commit.',
              503,
            );
          },
        );
        const result = (await failing.call('record_discussion', args)) as any;
        assert.equal(result.saved, false);
        assert.equal(result.queued, true);
        const restarted = new LocalIntelligenceClient(dir);
        assert.equal((await restarted.flush()).pending, 0);
        const history = await call('recall_investigation', { investigationId });
        assert.equal(
          history.events.filter((e: any) => e.request_id === event.requestId)
            .length,
          1,
        );
        await assert.rejects(
          restarted.call('record_discussion', { ...args, text: 'changed' }),
          { status: 409 },
        );
      },
    );
    await t.test(
      'offline reads are labelled stale and health never claims cached readiness',
      async () => {
        const live = new LocalIntelligenceClient(dir);
        assert.equal(
          (
            (await live.call('get_investigation_context', {
              investigationId,
            })) as any
          ).availability,
          'live',
        );
        const offline = new LocalIntelligenceClient(dir, async () => {
          throw new SystemError('Simulated database outage.', 503);
        });
        const cached = (await offline.call('get_investigation_context', {
          investigationId,
        })) as any;
        const event = discussion('lost-ack');
        const retried = (await offline.call('record_discussion', {
          investigationId,
          ...event.payload,
          requestId: event.requestId,
        })) as any;
        assert.equal(retried.saved, false);
        assert.equal(retried.previouslyConfirmed, true);
        assert.equal((await live.flush()).pending, 0);
        assert.equal(cached.stale, true);
        assert.equal(cached.availability, 'cached');
        assert.ok(cached.cachedAt);
        await assert.rejects(offline.call('system_health', {}));
      },
    );
    await t.test(
      'body limits, origin rejection and private schema inventory',
      async () => {
        process.env.INTELLIGENCE_ACCESS_TOKEN = 'test-only-resilience';
        const headers = {
          authorization: 'Bearer test-only-resilience',
          'content-type': 'application/json',
        };
        assert.equal(
          (
            await POST(
              new Request('http://localhost/api/intelligence', {
                method: 'POST',
                headers,
                body: 'x'.repeat(200001),
              }),
            )
          ).status,
          413,
        );
        assert.equal(
          (
            await mcpPost(
              new Request('http://localhost/api/intelligence/mcp', {
                method: 'POST',
                headers: { ...headers, origin: 'https://untrusted.example' },
                body: '{}',
              }),
            )
          ).status,
          403,
        );
        const inventory = await GET(
          new Request('http://localhost/api/intelligence', { headers }),
        );
        assert.equal(inventory.status, 200);
        assert.equal((await inventory.json()).tools.length, 15);
        assert.match(inventory.headers.get('cache-control')!, /no-store/);
      },
    );
    await t.test(
      'encrypted backup authenticates, restores exactly, and refuses nonempty production target',
      async () => {
        const snapshot = await takeSnapshot();
        const key = randomBytes(32).toString('hex');
        const encoded = encryptSnapshot(snapshot, key);
        assert.ok(!encoded.includes('durable context'));
        const decoded = decryptSnapshot(encoded, key);
        assert.equal(snapshotHash(decoded), snapshotHash(snapshot));
        assert.throws(() =>
          decryptSnapshot(encoded, randomBytes(32).toString('hex')),
        );
        const damaged = JSON.parse(encoded);
        damaged.ciphertext = Buffer.from('damaged').toString('base64');
        assert.throws(() => decryptSnapshot(JSON.stringify(damaged), key));
        process.env.INTELLIGENCE_BACKUP_KEY = key;
        const headers = {
          authorization: 'Bearer test-only-resilience',
          'content-type': 'application/json',
        };
        assert.equal(
          (
            await recoveryGet(
              new Request('http://localhost/api/intelligence/recovery'),
            )
          ).status,
          401,
        );
        const exported = await recoveryGet(
          new Request('http://localhost/api/intelligence/recovery', {
            headers,
          }),
        );
        assert.equal(exported.status, 200);
        const backup = await exported.json();
        const verified = await recoveryPost(
          new Request('http://localhost/api/intelligence/recovery', {
            method: 'POST',
            headers,
            body: JSON.stringify({
              mode: 'verify',
              encryptedSnapshot: backup.encryptedSnapshot,
            }),
          }),
        );
        assert.equal(verified.status, 200);
        const rehearsal = await restoreSnapshot(decoded, true);
        assert.equal(rehearsal.verified, true);
        assert.equal(rehearsal.events, snapshot.events.length);
        await assert.rejects(restoreSnapshot(decoded, false));
        assert.ok(
          (await call('recall_investigation', { investigationId })).events
            .length > 0,
        );
      },
    );
  } finally {
    await sql`DELETE FROM wch_turns WHERE investigation_id=${investigationId}`;
    await sql`DELETE FROM wch_events WHERE investigation_id=${investigationId}`;
    await sql`DELETE FROM wch_investigations WHERE id=${investigationId}`;
    await rm(dir, { recursive: true, force: true });
  }
});
