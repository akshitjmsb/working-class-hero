import { McpServer } from '@modelcontextprotocol/server';
import { ROBBY_INSTRUCTIONS, systemTools } from './tools';
import { SystemError } from './store';

export function createIntelligenceServer() {
  const server = new McpServer({ name: 'working-class-hero', version: '1.0.0' }, { instructions: ROBBY_INSTRUCTIONS });
  for (const tool of systemTools) {
    server.registerTool(tool.name, {
      description: tool.description, inputSchema: tool.schema,
      annotations: { readOnlyHint: tool.readOnly, destructiveHint: false, idempotentHint: true, openWorldHint: false },
    }, async args => {
      try {
        const result = await tool.execute(args);
        return { content: [{ type: 'text', text: JSON.stringify(result) }] };
      } catch (error) {
        // Never send database or credential-bearing diagnostics to the host.
        return { isError: true, content: [{ type: 'text', text: error instanceof SystemError ? error.message : 'System operation failed; no successful save is confirmed.' }] };
      }
    });
  }
  return server;
}
