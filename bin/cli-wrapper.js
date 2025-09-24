#!/usr/bin/env node

// 简单的命令行包装器，用于快速生成ID
import { spawn } from 'child_process';

const args = process.argv.slice(2);
const algorithm = args[0] || 'cuid2';
const quantity = parseInt(args[1]) || 1;

const supportedAlgorithms = ['uuid', 'cuid2', 'nanoid', 'ulid', 'snowflake'];

if (args.includes('--help') || args.includes('-h')) {
  console.log(`
🆔 ID Generator 命令行工具

用法:
  node cli-wrapper.js [算法] [数量]

支持的算法:
  uuid      - UUID v4 (例: 123e4567-e89b-12d3-a456-426614174000)
  cuid2     - CUID2 (例: clh3ppfqz0000jz0ggdlg7etk) [默认]
  nanoid    - NanoID (例: V1StGXR8_Z5jdHi6B-myT)
  ulid      - ULID (例: 01ARZ3NDEKTSV4RRFFQ69G5FAV)
  snowflake - Snowflake (例: 1970773878481358848)

示例:
  node cli-wrapper.js                    # 生成1个cuid2
  node cli-wrapper.js uuid               # 生成1个UUID
  node cli-wrapper.js snowflake 5        # 生成5个Snowflake ID
  node cli-wrapper.js --help             # 显示帮助
`);
  process.exit(0);
}

if (!supportedAlgorithms.includes(algorithm)) {
  console.error(`❌ 不支持的算法: ${algorithm}`);
  console.error(`✅ 支持的算法: ${supportedAlgorithms.join(', ')}`);
  process.exit(1);
}

if (quantity < 1 || quantity > 100) {
  console.error('❌ 数量必须在 1-100 之间');
  process.exit(1);
}

console.log(`🔄 正在生成 ${quantity} 个 ${algorithm} 类型的ID...`);

// 启动MCP服务器
const mcp = spawn('npx', ['@clancy_lee/mcp-id-generator'], {
  stdio: ['pipe', 'pipe', 'pipe']
});

let requestId = 1;
let initialized = false;

function sendRequest(request) {
  const message = JSON.stringify(request) + '\n';
  mcp.stdin.write(message);
}

mcp.stdout.on('data', (data) => {
  try {
    const lines = data.toString().trim().split('\n');
    for (const line of lines) {
      if (line.trim()) {
        const response = JSON.parse(line);
        
        if (response.method === 'notifications/initialized') {
          initialized = true;
          generateIds();
        } else if (response.result && response.result.content) {
          const ids = response.result.content[0].text.split(',');
          console.log(`\n✅ 生成的ID${ids.length > 1 ? 's' : ''}:`);
          ids.forEach((id, index) => {
            console.log(`  ${index + 1}. ${id}`);
          });
          mcp.kill();
          process.exit(0);
        } else if (response.error) {
          console.error('❌ 生成ID失败:', response.error.message);
          mcp.kill();
          process.exit(1);
        }
      }
    }
  } catch (error) {
    // 忽略JSON解析错误，可能是部分数据
  }
});

mcp.stderr.on('data', (data) => {
  console.error('❌ 错误:', data.toString());
});

function generateIds() {
  sendRequest({
    jsonrpc: '2.0',
    id: requestId++,
    method: 'tools/call',
    params: {
      name: 'generate-id',
      arguments: { algorithm, quantity }
    }
  });
}

// 初始化MCP服务器
sendRequest({
  jsonrpc: '2.0',
  id: requestId++,
  method: 'initialize',
  params: {
    protocolVersion: '2024-11-05',
    capabilities: { tools: {} },
    clientInfo: { name: 'cli-wrapper', version: '1.0.0' }
  }
});

// 5秒超时
setTimeout(() => {
  console.error('❌ 操作超时');
  mcp.kill();
  process.exit(1);
}, 5000);