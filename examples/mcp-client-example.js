#!/usr/bin/env node

// Terminal 使用示例 - 直接调用MCP服务器生成ID
import { spawn } from 'child_process';

console.log('🆔 ID Generator 命令行使用示例\n');

// 启动MCP服务器
const mcp = spawn('npx', ['@clancy_lee/mcp-id-generator'], {
  stdio: ['pipe', 'pipe', 'pipe']
});

let requestId = 1;

function sendRequest(request) {
  const message = JSON.stringify(request) + '\n';
  mcp.stdin.write(message);
}

function generateId(algorithm = 'cuid2', quantity = 1) {
  return new Promise((resolve) => {
    const currentRequestId = requestId++;
    
    // 监听响应
    const responseHandler = (data) => {
      try {
        const lines = data.toString().trim().split('\n');
        for (const line of lines) {
          if (line.trim()) {
            const response = JSON.parse(line);
            if (response.id === currentRequestId && response.result) {
              console.log(`✅ 生成的${algorithm}类型ID: ${response.result.content[0].text}`);
              mcp.stdout.off('data', responseHandler);
              resolve(response.result.content[0].text);
            }
          }
        }
      } catch (error) {
        console.error('❌ 解析响应失败:', error.message);
      }
    };
    
    mcp.stdout.on('data', responseHandler);
    
    // 发送生成ID请求
    sendRequest({
      jsonrpc: '2.0',
      id: currentRequestId,
      method: 'tools/call',
      params: {
        name: 'generate-id',
        arguments: { algorithm, quantity }
      }
    });
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
    clientInfo: { name: 'terminal-client', version: '1.0.0' }
  }
});

// 等待初始化完成后生成不同类型的ID
setTimeout(async () => {
  console.log('🚀 开始生成各种类型的ID...\n');
  
  await generateId('uuid', 1);
  await generateId('cuid2', 1);
  await generateId('nanoid', 1);
  await generateId('ulid', 1);
  await generateId('snowflake', 1);
  
  console.log('\n✨ 所有ID生成完成！');
  mcp.kill();
  process.exit(0);
}, 1000);

mcp.stderr.on('data', (data) => {
  console.error('❌ MCP服务器错误:', data.toString());
});