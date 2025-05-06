#!/usr/bin/env node

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { createId } from '@paralleldrive/cuid2';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';

const version = '0.1.2';

const server = new McpServer({
  name: 'id-generator',
  version,
});

server.tool(
  'generate-id',
  {
    algorithm: z.enum(['cuid2', 'uuid']).default('cuid2'),
  },
  async ({ algorithm }) => {
    try {
      let id: string = '';
      
      if (algorithm === 'cuid2') {
        id = createId();
      } else {
        id = uuidv4();
      }

      if (!id) {
        throw new Error(`Failed to generate ${algorithm} ID`);
      }

      return {
        content: [
          { 
            type: 'text', 
            text: id
          }
        ]
      };
    } catch (err: unknown) {
      const error = err as Error;
      return {
        content: [
          {
            type: 'text',
            text: `Error: ${error.message}`
          }
        ],
        isError: true
      }
    }
  }
);

const transport = new StdioServerTransport();
await server.connect(transport);