import { NextResponse } from 'next/server';
import { ZodError } from 'zod/v4';
import { hasBearerSecret } from '@/lib/cron-auth';
import { callSystemTool, systemTools } from '@/lib/intelligence/tools';
import { SystemError } from '@/lib/intelligence/store';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
const headers = { 'Cache-Control': 'private, no-store, max-age=0' };

function authorized(request: Request) {
  return hasBearerSecret(request, process.env.INTELLIGENCE_ACCESS_TOKEN);
}
export async function GET(request: Request) {
  if (!authorized(request)) return NextResponse.json({ error: 'Owner authorization required.' }, { status: 401, headers });
  return NextResponse.json({ system: 'Working Class Hero', tools: systemTools.map(({ name, description, readOnly }) => ({ name, description, readOnly })) }, { headers });
}
export async function POST(request: Request) {
  if (!authorized(request)) return NextResponse.json({ error: 'Owner authorization required.' }, { status: 401, headers });
  if (Number(request.headers.get('content-length') ?? 0) > 200000) return NextResponse.json({ error: 'Request too large.' }, { status: 413, headers });
  try {
    const raw = await request.text();
    if (Buffer.byteLength(raw) > 200000) return NextResponse.json({ error: 'Request too large.' }, { status: 413, headers });
    const body = JSON.parse(raw);
    if (!body || typeof body !== 'object' || Array.isArray(body) || typeof body.tool !== 'string') throw new SystemError('Provide tool and arguments.');
    return NextResponse.json(await callSystemTool(body.tool, body.arguments ?? {}), { headers });
  } catch (error) {
    const status = error instanceof SystemError ? error.status : error instanceof ZodError || error instanceof SyntaxError ? 400 : 503;
    const message = error instanceof SystemError ? error.message : status === 400 ? 'Invalid system request.' : 'System memory is temporarily unavailable; a save is not confirmed.';
    return NextResponse.json({ error: message }, { status, headers });
  }
}
