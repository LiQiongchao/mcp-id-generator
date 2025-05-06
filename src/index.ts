#!/usr/bin/env node

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { createId } from '@paralleldrive/cuid2';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';
import { CallToolResult } from '@modelcontextprotocol/sdk/types.js';

const version = '0.1.4';

const server = new McpServer({
  name: 'id-generator',
  version,
});

server.tool(
  'generate-id',
  {
    algorithm: z.enum(['cuid2', 'uuid']).default('cuid2'),
    quantity: z.number().default(1),
  },
  async ({ algorithm, quantity }) => {
    try {
      let ids: string[] = [];
      
      for (let i = 0; i < quantity; i++) {
        if (algorithm === 'cuid2') {
          ids.push(createId());
        } else {
          ids.push(uuidv4());
        }
      }

      if (ids.length === 0) {
        return respond('Failed to generate IDs', true);
      }

      return respond(ids.join(','));
    } catch (err: unknown) {
      const error = err as Error;
      return respond(`Error: ${error.message}`, true);
    }
  }
);

function respond(text: string, isError: boolean = false): CallToolResult {
  return {
    content: [
      {
        type: 'text' as const,
        text
      }
    ],
    isError
  };
}

const transport = new StdioServerTransport();
await server.connect(transport);