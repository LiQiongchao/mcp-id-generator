#!/usr/bin/env node

// MCP 客户端测试脚本
import { spawn } from 'child_process';
import { EventEmitter } from 'events';

class MCPTester extends EventEmitter {
  constructor() {
    super();
    this.server = null;
    this.requestId = 1;
  }

  async start() {
    console.log('🚀 启动 MCP 服务器测试...\n');
    
    this.server = spawn('node', ['../build/index.js'], {
      stdio: ['pipe', 'pipe', 'pipe']
    });

    this.server.stdout.on('data', (data) => {
      const response = data.toString();
      console.log('📥 服务器响应:', response);
    });

    this.server.stderr.on('data', (data) => {
      console.error('❌ 服务器错误:', data.toString());
    });

    // 初始化握手
    await this.sendRequest({
      jsonrpc: '2.0',
      id: this.requestId++,
      method: 'initialize',
      params: {
        protocolVersion: '2024-11-05',
        capabilities: {
          tools: {}
        },
        clientInfo: {
          name: 'test-client',
          version: '1.0.0'
        }
      }
    });

    // 等待一下然后测试工具调用
    setTimeout(() => this.testTools(), 1000);
  }

  async sendRequest(request) {
    const message = JSON.stringify(request) + '\n';
    console.log('📤 发送请求:', JSON.stringify(request, null, 2));
    this.server.stdin.write(message);
  }

  async testTools() {
    console.log('\n🔧 测试工具调用...\n');

    // 测试默认参数
    await this.sendRequest({
      jsonrpc: '2.0',
      id: this.requestId++,
      method: 'tools/call',
      params: {
        name: 'generate-id',
        arguments: {}
      }
    });

    // 测试UUID算法
    await this.sendRequest({
      jsonrpc: '2.0',
      id: this.requestId++,
      method: 'tools/call',
      params: {
        name: 'generate-id',
        arguments: {
          algorithm: 'uuid',
          quantity: 3
        }
      }
    });

    // 测试雪花算法
    await this.sendRequest({
      jsonrpc: '2.0',
      id: this.requestId++,
      method: 'tools/call',
      params: {
        name: 'generate-id',
        arguments: {
          algorithm: 'snowflake',
          quantity: 5
        }
      }
    });

    // 5秒后结束测试
    setTimeout(() => this.stop(), 5000);
  }

  stop() {
    console.log('\n🛑 停止测试');
    if (this.server) {
      this.server.kill();
    }
    process.exit(0);
  }
}

const tester = new MCPTester();
tester.start().catch(console.error);