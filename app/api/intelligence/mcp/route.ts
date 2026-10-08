import { createMcpHandler } from '@modelcontextprotocol/server';
import { hasBearerSecret } from '@/lib/cron-auth';
import { createIntelligenceServer } from '@/lib/intelligence/mcp';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
const handler = createMcpHandler(createIntelligenceServer);

async function handle(request: Request) {
  if (!hasBearerSecret(request, process.env.INTELLIGENCE_ACCESS_TOKEN)) return Response.json({ error: 'Owner authorization required.' }, { status: 401, headers: { 'Cache-Control': 'private, no-store' } });
  const origin = request.headers.get('origin');
  if (origin && origin !== new URL(request.url).origin) return Response.json({ error: 'Origin not allowed.' }, { status: 403 });
  if (request.method === 'POST' && Buffer.byteLength(await request.clone().text()) > 200000) return Response.json({ error: 'Request too large.' }, { status: 413 });
  const response = await handler.fetch(request);
  response.headers.set('Cache-Control', 'private, no-store, max-age=0');
  return response;
}
export const GET = handle;
export const POST = handle;
export const DELETE = handle;
