import { config } from 'dotenv';
import { migrateSystem } from '../lib/intelligence/store';

config({ path: '.env.local', quiet: true });
async function main() {
  if (process.argv.includes('--on-deploy') && process.env.VERCEL_ENV !== 'production') return;
  await migrateSystem();
  console.log('Working Class Hero discussion memory schema ready.');
}
main().catch(() => { console.error('System memory migration failed.'); process.exitCode = 1; });
