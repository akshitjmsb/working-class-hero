import { config } from 'dotenv';
import { resolve } from 'node:path';
import { serveStdio } from '@modelcontextprotocol/server/stdio';
import { LocalIntelligenceClient } from '../lib/intelligence/local-client';
import { createIntelligenceServer } from '../lib/intelligence/mcp';

config({ path: resolve(__dirname, '../.env.intelligence.local'), quiet: true });
config({ path: resolve(__dirname, '../.env.local'), quiet: true });
const local = new LocalIntelligenceClient(
  process.env.INTELLIGENCE_STATE_DIR ?? resolve(__dirname, '../.wch-state'),
);
void serveStdio(() =>
  createIntelligenceServer((name, args) => local.call(name, args)),
);
