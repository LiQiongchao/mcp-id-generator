#!/usr/bin/env node

// 外部MCP调用验证脚本
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔌 验证MCP外部调用...\n');

// 使用绝对路径调用MCP服务器
const mcpPath = path.resolve(__dirname, '../build/index.js');
console.log(`📍 MCP路径: ${mcpPath}`);

const mcp = spawn('node', [mcpPath], {
  stdio: ['pipe', 'pipe', 'pipe']
});

let requestId = 1;

function sendRequest(request) {
  const message = JSON.stringify(request) + '\n';
  console.log('📤 发送请求:', JSON.stringify(request, null, 2));
  mcp.stdin.write(message);
}

mcp.stdout.on('data', (data) => {
  console.log('📥 响应:', data.toString().trim());
});

mcp.stderr.on('data', (data) => {
  console.error('❌ 错误:', data.toString());
});

// 初始化
sendRequest({
  jsonrpc: '2.0',
  id: requestId++,
  method: 'initialize',
  params: {
    protocolVersion: '2024-11-05',
    capabilities: { tools: {} },
    clientInfo: { name: 'external-test', version: '1.0.0' }
  }
});

// 等待1秒后测试雪花算法
setTimeout(() => {
  console.log('\n🌨️  测试雪花算法ID生成...');
  sendRequest({
    jsonrpc: '2.0',
    id: requestId++,
    method: 'tools/call',
    params: {
      name: 'generate-id',
      arguments: {
        algorithm: 'snowflake',
        quantity: 3
      }
    }
  });
}, 1000);

// 5秒后关闭
setTimeout(() => {
  console.log('\n✅ 外部调用验证完成');
  mcp.kill();
  process.exit(0);
}, 5000);