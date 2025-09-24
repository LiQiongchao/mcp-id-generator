#!/usr/bin/env node

// 测试MCP工具注册
import { spawn } from 'child_process';

console.log('🔧 测试MCP工具注册...\n');

const mcp = spawn('node', ['../build/index.js'], {
  stdio: ['pipe', 'pipe', 'pipe']
});

let requestId = 1;

function sendRequest(request) {
  const message = JSON.stringify(request) + '\n';
  console.log('📤 发送请求:', JSON.stringify(request, null, 2));
  mcp.stdin.write(message);
}

mcp.stdout.on('data', (data) => {
  const response = data.toString().trim();
  console.log('📥 服务器响应:', response);
  
  try {
    const parsed = JSON.parse(response);
    if (parsed.method === 'notifications/tools/list_changed') {
      console.log('🔔 收到工具列表变更通知');
    }
  } catch (e) {
    // 忽略解析错误
  }
});

mcp.stderr.on('data', (data) => {
  console.error('❌ 服务器错误:', data.toString());
});

// 1. 初始化握手
console.log('🤝 步骤1: 初始化握手');
sendRequest({
  jsonrpc: '2.0',
  id: requestId++,
  method: 'initialize',
  params: {
    protocolVersion: '2024-11-05',
    capabilities: {
      tools: {}
    },
    clientInfo: {
      name: 'tools-test',
      version: '1.0.0'
    }
  }
});

setTimeout(() => {
  // 2. 请求工具列表
  console.log('\n📋 步骤2: 请求工具列表');
  sendRequest({
    jsonrpc: '2.0',
    id: requestId++,
    method: 'tools/list',
    params: {}
  });
}, 1000);

setTimeout(() => {
  // 3. 测试工具调用
  console.log('\n🛠️ 步骤3: 测试工具调用');
  sendRequest({
    jsonrpc: '2.0',
    id: requestId++,
    method: 'tools/call',
    params: {
      name: 'generate-id',
      arguments: {
        algorithm: 'snowflake',
        quantity: 1
      }
    }
  });
}, 2000);

setTimeout(() => {
  console.log('\n✅ 测试完成');
  mcp.kill();
  process.exit(0);
}, 4000);