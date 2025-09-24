#!/usr/bin/env node

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { createId } from '@paralleldrive/cuid2';
import { v4 as uuidv4 } from 'uuid';
import { nanoid } from 'nanoid';
import { ulid } from 'ulid';
import { Snowflake } from '@sapphire/snowflake';
import { z } from 'zod';
import { CallToolResult } from '@modelcontextprotocol/sdk/types.js';

const version = '0.1.0';

// 初始化雪花算法实例，使用与MyBatis-Plus相同的epoch时间（2010-11-04 01:42:54.657 UTC）
// 这确保生成的ID与MyBatis-Plus兼容
const snowflake = new Snowflake(1288834974657n);

const server = new McpServer({
  name: 'id-generator',
  version,
});

server.tool(
  'generate-id',
  {
    algorithm: z.enum(['cuid2', 'uuid', 'nanoid', 'ulid', 'snowflake']).default('cuid2'),
    quantity: z.number().default(1),
  },
  async ({ algorithm, quantity }) => {
    try {
      let ids: string[] = [];
      
      for (let i = 0; i < quantity; i++) {
        switch (algorithm) {
          case 'cuid2':
            ids.push(createId());
            break;
          case 'nanoid':
            ids.push(nanoid());
            break;
          case 'ulid':
            ids.push(ulid());
            break;
          case 'snowflake':
            ids.push(snowflake.generate().toString());
            break;
          case 'uuid':
          default:
            ids.push(uuidv4());
            break;
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