import { randomUUID } from 'node:crypto';
import * as z from 'zod/v4';
import { callSystemTool, systemTools } from '@/lib/intelligence/tools';
import { authorize, readBody, privateHeaders } from '@/lib/intelligence/http';
import { publicError } from '@/lib/intelligence/reliability';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;
const requestSchema = z
  .object({
    tool: z.string().min(1).max(100),
    arguments: z.record(z.string(), z.unknown()).default({}),
  })
  .strict();
async function handle(request: Request) {
  const requestId = randomUUID();
  const started = Date.now();
  const headers = { ...privateHeaders, 'X-Request-Id': requestId };
  try {
    authorize(request);
    if (request.method === 'GET')
      return Response.json(
        {
          system: 'Working Class Hero',
          version: 2,
          tools: systemTools.map(({ name, description, readOnly, schema }) => ({
            name,
            description,
            readOnly,
            inputSchema: z.toJSONSchema(schema),
          })),
        },
        { headers },
      );
    const body = requestSchema.parse(JSON.parse(await readBody(request)));
    const result = await callSystemTool(body.tool, body.arguments);
    console.info(
      JSON.stringify({
        system: 'wch',
        requestId,
        tool: body.tool,
        status: 200,
        durationMs: Date.now() - started,
      }),
    );
    return Response.json(result, { headers });
  } catch (error) {
    const safe = publicError(error);
    console.warn(
      JSON.stringify({
        system: 'wch',
        requestId,
        status: safe.status,
        durationMs: Date.now() - started,
      }),
    );
    return Response.json(
      { error: safe.message, retryable: safe.retryable, requestId },
      { status: safe.status, headers },
    );
  }
}
export const GET = handle;
export const POST = handle;
