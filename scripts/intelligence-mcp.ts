import { config } from 'dotenv';
import { resolve } from 'node:path';
import { serveStdio } from '@modelcontextprotocol/server/stdio';
import { createIntelligenceServer } from '../lib/intelligence/mcp';

config({ path: resolve(__dirname, '../.env.intelligence.local'), quiet: true });
config({ path: resolve(__dirname, '../.env.local'), quiet: true });
void serveStdio(createIntelligenceServer);
