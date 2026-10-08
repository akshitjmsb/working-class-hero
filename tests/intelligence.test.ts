import test from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { config } from 'dotenv';
import { neon } from '@neondatabase/serverless';
import { Client } from '@modelcontextprotocol/client';
import { StdioClientTransport } from '@modelcontextprotocol/client/stdio';
import { callSystemTool } from '../lib/intelligence/tools';
import { POST, GET } from '../app/api/intelligence/route';
config({ path: '.env.intelligence.local', quiet: true });
config({ path: '.env.local', quiet: true });

const companyId = `test-${randomUUID()}`;
const investigationId = `montreal:${companyId}`;
const requestId = `test-${randomUUID()}`;
const args = { investigationId, requestId, speaker: 'user', text: 'Persistence test', recordType: 'verbatim', sourceRef: 'automated-test' };

async function connect() {
 const client = new Client({ name: 'system-test', version: '1.0.0' });
 await client.connect(new StdioClientTransport({ command: process.execPath, args: ['--import','tsx','scripts/intelligence-mcp.ts'], stderr: 'pipe' }));
 return client;
}

test('private durable company discussion with retry, correction, pagination and restarted MCP', async () => {
 const sql = neon(process.env.DATABASE_URL!);
 try {
  process.env.INTELLIGENCE_ACCESS_TOKEN = 'test-token-only';
  assert.equal((await GET(new Request('http://localhost/api/intelligence'))).status,401);
  assert.equal((await POST(new Request('http://localhost/api/intelligence',{method:'POST',headers:{authorization:'Bearer wrong'},body:'{}'}))).status,401);
  assert.equal((await POST(new Request('http://localhost/api/intelligence',{method:'POST',headers:{authorization:'Bearer test-token-only'},body:'null'}))).status,400);
  await callSystemTool('start_investigation',{city:'montreal',companyId,companyName:'Disposable test',goal:'Test durable memory'});
  const results = await Promise.all([callSystemTool('record_discussion',args),callSystemTool('record_discussion',args)]) as any[];
  assert.equal(results.filter(r => r.repeated).length,1);
  await assert.rejects(callSystemTool('record_discussion',{...args,text:'Different content'}),{status:409});
  await assert.rejects(callSystemTool('record_memory',{investigationId,requestId:`${requestId}-decision`,kind:'decision',text:'Not owner authorized',provenance:'robby_inferred',sourceRef:'test'}));
  await assert.rejects(callSystemTool('record_evidence',{investigationId,requestId:`${requestId}-fact`,claim:'Unsupported',evidenceType:'observed',sources:[],checkedAt:new Date().toISOString(),sourceRef:'test'}));
  const memory = {investigationId,requestId:`${requestId}-interest`,kind:'interest',text:'Operations',provenance:'user_stated',sourceRef:'test'};
  await callSystemTool('record_memory',memory);
  await callSystemTool('record_memory',{...memory,requestId:`${requestId}-correction`,text:'Procurement',supersedesRequestId:memory.requestId});
  await assert.rejects(callSystemTool('record_memory',{...memory,requestId:`${requestId}-invalid`,supersedesRequestId:requestId}));
  await assert.rejects(callSystemTool('record_output',{investigationId,requestId:`${requestId}-output`,title:'Test',format:'voice_brief',content:'test',sourceRequestIds:['missing-source-record'],sourceRef:'test'}));
  const first = await callSystemTool('recall_investigation',{investigationId,limit:2}) as any;
  assert.equal(first.events.length,2);
  const owner = await callSystemTool('recall_owner_context',{}) as any;
  assert.ok(owner.records.some((r: any) => r.request_id === memory.requestId));
  const saved = await callSystemTool('list_investigations',{}) as any;
  assert.ok(saved.investigations.some((r: any) => r.id === investigationId));
  const earlier = await callSystemTool('recall_investigation',{investigationId,limit:2,beforeSequence:first.nextBeforeSequence}) as any;
  assert.equal(earlier.events.length,1);
  assert.equal(earlier.events[0].request_id,requestId);
  let client = await connect();
  try {
   assert.equal((await client.listTools()).tools.length,10);
   const response = await client.callTool({name:'record_discussion',arguments:{...args,requestId:`${requestId}-mcp`,text:'Saved through MCP'}});
   assert.equal(response.isError,undefined);
  } finally { await client.close(); }
  client = await connect();
  try {
   const recalled = await client.callTool({name:'recall_investigation',arguments:{investigationId}});
   const data = JSON.parse((recalled.content as any[])[0].text);
   assert.equal(data.events.length,4);
   assert.equal(data.events.at(-1).payload.text,'Saved through MCP');
  } finally { await client.close(); }
 } finally {
  await sql`DELETE FROM wch_events WHERE investigation_id = ${investigationId}`;
  await sql`DELETE FROM wch_investigations WHERE id = ${investigationId}`;
 }
});
