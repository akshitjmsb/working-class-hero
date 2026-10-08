import { hasBearerSecret } from '../cron-auth';
import { SystemError } from './store';
export const privateHeaders = {
  'Cache-Control': 'private, no-store, max-age=0',
  'X-Content-Type-Options': 'nosniff',
};
export function authorize(request: Request) {
  if (!hasBearerSecret(request, process.env.INTELLIGENCE_ACCESS_TOKEN))
    throw new SystemError('Owner authorization required.', 401);
  const origin = request.headers.get('origin');
  if (origin && origin !== new URL(request.url).origin)
    throw new SystemError('Origin not allowed.', 403);
}
export async function readBody(request: Request, maximum = 200000) {
  if (Number(request.headers.get('content-length') ?? 0) > maximum)
    throw new SystemError('Request too large.', 413);
  if (
    !request.headers
      .get('content-type')
      ?.toLowerCase()
      .startsWith('application/json')
  )
    throw new SystemError('Use application/json.', 415);
  const reader = request.body?.getReader();
  if (!reader) throw new SystemError('Request body required.');
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > maximum) throw new SystemError('Request too large.', 413);
      chunks.push(value);
    }
  } catch (error) {
    await reader.cancel().catch(() => {});
    throw error;
  }
  return Buffer.concat(chunks).toString('utf8');
}
