#!/usr/bin/env node

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { createId } from '@paralleldrive/cuid2';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';

const version = '0.1.3';

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
        return {
          content: [
            {
              type: 'text',
              text: 'Failed to generate IDs'
            }
          ],
          isError: true
        }
      }

      return {
        content: [
          { 
            type: 'text', 
            text: ids.join(',')
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