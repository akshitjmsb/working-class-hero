import { config } from 'dotenv';
import { resolve } from 'node:path';
import { promises as fs } from 'node:fs';
import { publicError } from '../lib/intelligence/reliability';
import { LocalIntelligenceClient } from '../lib/intelligence/local-client';
import {
  takeSnapshot,
  encryptSnapshot,
  decryptSnapshot,
  restoreSnapshot,
} from '../lib/intelligence/backup';
const root = resolve(__dirname, '..');
config({ path: resolve(root, '.env.intelligence.local'), quiet: true });
config({ path: resolve(root, '.env.local'), quiet: true });
async function main() {
  const command = process.argv[2];
  const local = new LocalIntelligenceClient(resolve(root, '.wch-state'));
  if (command === 'flush') return local.flush();
  if (command === 'status') return local.status();
  if (command === 'backup') {
    const pending = await local.flush();
    const snapshot = await takeSnapshot();
    const folder = resolve(root, '.wch-state/backups');
    await fs.mkdir(folder, { recursive: true, mode: 0o700 });
    const path = resolve(
      folder,
      `${new Date().toISOString().replace(/[:.]/g, '-')}.wch.enc`,
    );
    const file = await fs.open(path, 'wx', 0o600);
    try {
      await file.writeFile(
        encryptSnapshot(snapshot, process.env.INTELLIGENCE_BACKUP_KEY ?? ''),
      );
      await file.sync();
    } finally {
      await file.close();
    }
    return {
      path,
      ...(await restoreSnapshot(
        decryptSnapshot(
          await fs.readFile(path, 'utf8'),
          process.env.INTELLIGENCE_BACKUP_KEY ?? '',
        ),
        true,
      )),
      outbox: pending,
      coverage:
        'Database snapshot only. Pending local saves are not included until confirmed.',
    };
  }
  if (command === 'restore' || command === 'verify-backup') {
    if (!process.argv[3]) throw Error('Backup path required.');
    const snapshot = decryptSnapshot(
      await fs.readFile(resolve(process.argv[3]), 'utf8'),
      process.env.INTELLIGENCE_BACKUP_KEY ?? '',
    );
    return restoreSnapshot(snapshot, command === 'verify-backup');
  }
  throw Error('Choose flush, status, backup, verify-backup or restore.');
}
main()
  .then((result) => console.log(JSON.stringify(result, null, 2)))
  .catch((error) => {
    console.error(publicError(error).message);
    process.exitCode = 1;
  });
