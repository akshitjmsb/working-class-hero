import { McpServer } from '@modelcontextprotocol/server';
import { ROBBY_INSTRUCTIONS, systemTools, callSystemTool } from './tools';
import { publicError } from './reliability';

export function createIntelligenceServer(
  execute: (name: string, args: unknown) => Promise<unknown> = callSystemTool,
) {
  const server = new McpServer(
    { name: 'working-class-hero', version: '2.0.0' },
    { instructions: ROBBY_INSTRUCTIONS },
  );
  for (const tool of systemTools) {
    server.registerTool(
      tool.name,
      {
        description: tool.description,
        inputSchema: tool.schema,
        annotations: {
          readOnlyHint: tool.readOnly,
          destructiveHint: false,
          idempotentHint: true,
          openWorldHint: false,
        },
      },
      async (args) => {
        try {
          const result = await execute(tool.name, args);
          return { content: [{ type: 'text', text: JSON.stringify(result) }] };
        } catch (error) {
          // Never send database or credential-bearing diagnostics to the host.
          return {
            isError: true,
            content: [
              { type: 'text', text: JSON.stringify(publicError(error)) },
            ],
          };
        }
      },
    );
  }
  return server;
}
