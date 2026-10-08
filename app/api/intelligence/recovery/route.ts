import * as z from 'zod/v4';
import { authorize, readBody, privateHeaders } from '@/lib/intelligence/http';
import {
  takeSnapshot,
  encryptSnapshot,
  decryptSnapshot,
  restoreSnapshot,
  snapshotHash,
} from '@/lib/intelligence/backup';
import { publicError } from '@/lib/intelligence/reliability';
import { SystemError } from '@/lib/intelligence/store';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;
const requestSchema = z
  .object({
    mode: z.enum(['verify', 'restore_empty']),
    encryptedSnapshot: z.string().min(1).max(1900000),
  })
  .strict();
async function handle(request: Request) {
  try {
    authorize(request);
    const key = process.env.INTELLIGENCE_BACKUP_KEY;
    if (!key) throw new SystemError('Recovery key is not configured.', 503);
    if (request.method === 'GET') {
      const snapshot = await takeSnapshot();
      return Response.json(
        {
          format: 'wch-recovery-export-v1',
          createdAt: snapshot.createdAt,
          sha256: snapshotHash(snapshot),
          encryptedSnapshot: encryptSnapshot(snapshot, key),
        },
        { headers: privateHeaders },
      );
    }
    const body = requestSchema.parse(
      JSON.parse(await readBody(request, 2000000)),
    );
    const snapshot = decryptSnapshot(body.encryptedSnapshot, key);
    // Restore is accepted only into empty intelligence tables. Existing company/resume data is never selected here.
    return Response.json(
      await restoreSnapshot(snapshot, body.mode === 'verify'),
      { headers: privateHeaders },
    );
  } catch (error) {
    const safe = publicError(error);
    return Response.json(
      { error: safe.message, retryable: safe.retryable },
      { status: safe.status, headers: privateHeaders },
    );
  }
}
export const GET = handle;
export const POST = handle;
