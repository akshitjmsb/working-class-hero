import { randomUUID } from 'node:crypto';
import { createMcpHandler } from '@modelcontextprotocol/server';
import { createIntelligenceServer } from '@/lib/intelligence/mcp';
import { authorize, readBody, privateHeaders } from '@/lib/intelligence/http';
import { publicError } from '@/lib/intelligence/reliability';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;
const handler = createMcpHandler(() => createIntelligenceServer());
async function handle(request: Request) {
  const requestId = randomUUID();
  try {
    authorize(request);
    const checked =
      request.method === 'POST'
        ? new Request(request.url, {
            method: 'POST',
            headers: request.headers,
            body: await readBody(request),
          })
        : request;
    const response = await handler.fetch(checked);
    for (const [key, value] of Object.entries(privateHeaders))
      response.headers.set(key, value);
    response.headers.set('X-Request-Id', requestId);
    console.info(
      JSON.stringify({ system: 'wch-mcp', requestId, status: response.status }),
    );
    return response;
  } catch (error) {
    const safe = publicError(error);
    console.warn(
      JSON.stringify({ system: 'wch-mcp', requestId, status: safe.status }),
    );
    return Response.json(
      { error: safe.message, retryable: safe.retryable, requestId },
      { status: safe.status, headers: privateHeaders },
    );
  }
}
export const GET = handle;
export const POST = handle;
export const DELETE = handle;
