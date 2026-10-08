import { config } from 'dotenv';
import { resolve } from 'node:path';
import { LocalIntelligenceClient } from '../lib/intelligence/local-client';
import { SystemError } from '../lib/intelligence/store';

config({ path: resolve(__dirname, '../.env.intelligence.local'), quiet: true });
config({ path: resolve(__dirname, '../.env.local'), quiet: true });

async function main() {
  // JSON stdin avoids shell quoting mistakes and putting private discussion in argv.
  const chunks: Buffer[] = [];
  let size = 0;
  for await (const chunk of process.stdin) {
    size += Buffer.byteLength(chunk);
    if (size > 200000) throw new SystemError('Request too large.', 413);
    chunks.push(Buffer.from(chunk));
  }
  const request = JSON.parse(Buffer.concat(chunks).toString('utf8'));
  if (
    !request ||
    typeof request !== 'object' ||
    Array.isArray(request) ||
    typeof request.tool !== 'string'
  )
    throw new SystemError('Provide tool and arguments as JSON on stdin.');
  const result = await new LocalIntelligenceClient(
    resolve(__dirname, '../.wch-state'),
  ).call(request.tool, request.arguments ?? {});
  process.stdout.write(JSON.stringify(result, null, 2) + '\n');
}
main().catch((error) => {
  console.error(
    error instanceof SystemError
      ? error.message
      : 'System command failed. Check its input and private local configuration.',
  );
  process.exitCode = 1;
});
