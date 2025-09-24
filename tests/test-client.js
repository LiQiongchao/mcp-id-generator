#!/usr/bin/env node

// 完整的 MCP 客户端测试脚本
import { spawn } from 'child_process';
import readline from 'readline';

class MCPClient {
  constructor(command, args = []) {
    this.command = command;
    this.args = args;
    this.server = null;
    this.requestId = 1;
    this.initialized = false;
  }

  async start() {
    console.log(`🚀 启动 MCP 客户端连接: ${this.command} ${this.args.join(' ')}\n`);
    
    this.server = spawn(this.command, this.args, {
      stdio: ['pipe', 'pipe', 'pipe']
    });

    this.server.stdout.on('data', (data) => {
      const lines = data.toString().trim().split('\n');
      lines.forEach(line => {
        if (line.trim()) {
          try {
            const response = JSON.parse(line);
            this.handleResponse(response);
          } catch (e) {
            console.log('📥 原始响应:', line);
          }
        }
      });
    });

    this.server.stderr.on('data', (data) => {
      console.error('❌ 服务器错误:', data.toString());
    });

    this.server.on('close', (code) => {
      console.log(`🛑 服务器退出，代码: ${code}`);
    });

    // 初始化握手
    await this.initialize();
  }

  async initialize() {
    const initRequest = {
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
    };

    this.sendRequest(initRequest);
  }

  handleResponse(response) {
    console.log('📥 服务器响应:', JSON.stringify(response, null, 2));
    
    if (response.method === 'initialize' || (response.id === 1 && response.result)) {
      this.initialized = true;
      console.log('✅ 初始化完成，可以开始测试工具调用\n');
      this.startInteractiveMode();
    }
  }

  sendRequest(request) {
    const message = JSON.stringify(request) + '\n';
    console.log('📤 发送请求:', JSON.stringify(request, null, 2));
    this.server.stdin.write(message);
  }

  async callTool(name, args = {}) {
    if (!this.initialized) {
      console.log('❌ 客户端未初始化');
      return;
    }

    const request = {
      jsonrpc: '2.0',
      id: this.requestId++,
      method: 'tools/call',
      params: {
        name,
        arguments: args
      }
    };

    this.sendRequest(request);
  }

  startInteractiveMode() {
    console.log('🎮 交互模式启动！');
    console.log('命令说明:');
    console.log('  1 - 生成默认 ID (cuid2)');
    console.log('  2 - 生成 UUID');
    console.log('  3 - 生成 3个 NanoID');
    console.log('  4 - 生成 5个 ULID');
    console.log('  5 - 自定义参数');
    console.log('  q - 退出\n');

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    const handleInput = (input) => {
      const cmd = input.trim();
      
      switch (cmd) {
        case '1':
          this.callTool('generate-id');
          break;
        case '2':
          this.callTool('generate-id', { algorithm: 'uuid' });
          break;
        case '3':
          this.callTool('generate-id', { algorithm: 'nanoid', quantity: 3 });
          break;
        case '4':
          this.callTool('generate-id', { algorithm: 'ulid', quantity: 5 });
          break;
        case '5':
          rl.question('算法 (cuid2/uuid/nanoid/ulid): ', (algo) => {
            rl.question('数量: ', (qty) => {
              this.callTool('generate-id', { 
                algorithm: algo, 
                quantity: parseInt(qty) || 1 
              });
              rl.prompt();
            });
          });
          return;
        case 'q':
          this.stop();
          return;
        default:
          console.log('❌ 未知命令');
      }
      
      rl.prompt();
    };

    rl.setPrompt('mcp> ');
    rl.prompt();
    rl.on('line', handleInput);
  }

  stop() {
    console.log('\n🛑 停止客户端');
    if (this.server) {
      this.server.kill();
    }
    process.exit(0);
  }
}

// 根据命令行参数选择连接方式
const mode = process.argv[2] || 'local';

let client;
switch (mode) {
  case 'local':
    client = new MCPClient('node', ['build/index.js']);
    break;
  case 'global':
    client = new MCPClient('id-generator');
    break;
  case 'npx':
    client = new MCPClient('npx', ['@clancy_lee/mcp-id-generator']);
    break;
  default:
    console.log('使用方法: node test-client.js [local|global|npx]');
    process.exit(1);
}

client.start().catch(console.error);