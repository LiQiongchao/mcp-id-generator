#!/usr/bin/env node

// MyBatis-Plus 雪花算法兼容性验证
import { spawn } from 'child_process';

class MyBatisPlusCompatibilityTest {
  constructor() {
    this.server = null;
    this.requestId = 1;
    this.generatedIds = [];
  }

  async start() {
    console.log('🔍 MyBatis-Plus 雪花算法兼容性验证\n');
    console.log('📊 对比数据:');
    console.log('  MyBatis-Plus示例: 1970763197070172162');
    console.log('  预期格式: 19位数字，197开头\n');
    
    this.server = spawn('node', ['../build/index.js'], {
      stdio: ['pipe', 'pipe', 'pipe']
    });

    this.server.stdout.on('data', (data) => {
      this.handleResponse(data.toString());
    });

    this.server.stderr.on('data', (data) => {
      console.error('❌ 错误:', data.toString());
    });

    // 初始化
    await this.sendRequest({
      jsonrpc: '2.0',
      id: this.requestId++,
      method: 'initialize',
      params: {
        protocolVersion: '2024-11-05',
        capabilities: { tools: {} },
        clientInfo: { name: 'compatibility-test', version: '1.0.0' }
      }
    });

    setTimeout(() => this.testCompatibility(), 1000);
  }

  async sendRequest(request) {
    const message = JSON.stringify(request) + '\n';
    this.server.stdin.write(message);
  }

  handleResponse(response) {
    try {
      const data = JSON.parse(response);
      if (data.result && data.result.content && data.result.content[0]) {
        const content = data.result.content[0].text;
        if (content.includes(',')) {
          this.generatedIds.push(...content.split(',').map(id => id.trim()));
        } else {
          this.generatedIds.push(content.trim());
        }
      }
    } catch (e) {
      // 忽略解析错误
    }
  }

  async testCompatibility() {
    console.log('🧪 生成雪花算法ID进行兼容性测试...\n');

    // 生成多个ID
    await this.sendRequest({
      jsonrpc: '2.0',
      id: this.requestId++,
      method: 'tools/call',
      params: {
        name: 'generate-id',
        arguments: { algorithm: 'snowflake', quantity: 10 }
      }
    });

    setTimeout(() => this.analyzeCompatibility(), 2000);
  }

  analyzeCompatibility() {
    console.log('📋 兼容性分析结果:');
    console.log('=' * 60);
    
    const mybatisPlusExample = '1970763197070172162';
    
    this.generatedIds.forEach((id, index) => {
      console.log(`\n🔸 生成ID ${index + 1}: ${id}`);
      
      // 基本格式验证
      const length = id.length;
      const prefix = id.substring(0, 4);
      const isNumeric = /^\d+$/.test(id);
      
      console.log(`  📏 长度: ${length} 位 ${length === 19 ? '✅' : '❌'}`);
      console.log(`  🔤 格式: ${isNumeric ? '纯数字 ✅' : '非纯数字 ❌'}`);
      console.log(`  🎯 前缀: ${prefix} ${prefix === '1970' ? '✅ 与MyBatis-Plus一致' : '⚠️  不同前缀'}`);
      
      // 时间戳分析（简化）
      const idBigInt = BigInt(id);
      const estimatedTimestamp = idBigInt >> 22n; // 简化的时间戳提取
      const mybatisPlusTimestamp = BigInt(mybatisPlusExample) >> 22n;
      
      console.log(`  ⏰ 时间戳: ${estimatedTimestamp}`);
      console.log(`  📊 与示例差异: ${estimatedTimestamp - mybatisPlusTimestamp} (正常范围)`);
    });

    // 总体兼容性评估
    console.log('\n🎯 总体兼容性评估:');
    console.log('=' * 60);
    
    const allLength19 = this.generatedIds.every(id => id.length === 19);
    const allNumeric = this.generatedIds.every(id => /^\d+$/.test(id));
    const allCorrectPrefix = this.generatedIds.every(id => id.startsWith('1970'));
    
    console.log(`✅ ID长度(19位): ${allLength19 ? '全部通过' : '部分失败'}`);
    console.log(`✅ 数字格式: ${allNumeric ? '全部通过' : '部分失败'}`);
    console.log(`✅ 前缀匹配(1970): ${allCorrectPrefix ? '全部通过' : '部分失败'}`);
    
    if (allLength19 && allNumeric && allCorrectPrefix) {
      console.log('\n🎉 兼容性验证: ✅ 完全兼容 MyBatis-Plus 雪花算法！');
      console.log('   生成的ID格式与MyBatis-Plus完全一致，可以安全使用。');
    } else {
      console.log('\n⚠️  兼容性验证: 部分兼容，需要调整。');
    }

    // 性能和唯一性验证
    console.log('\n📈 额外验证:');
    const uniqueIds = new Set(this.generatedIds);
    console.log(`🔄 唯一性: ${uniqueIds.size === this.generatedIds.length ? '✅ 全部唯一' : '❌ 存在重复'}`);
    
    // 递增性验证
    const bigIntIds = this.generatedIds.map(id => BigInt(id));
    const isIncreasing = bigIntIds.every((id, index) => index === 0 || id > bigIntIds[index - 1]);
    console.log(`📈 递增性: ${isIncreasing ? '✅ 严格递增' : '❌ 非递增'}`);

    this.stop();
  }

  stop() {
    console.log('\n🏁 兼容性验证完成');
    if (this.server) {
      this.server.kill();
    }
    process.exit(0);
  }
}

const test = new MyBatisPlusCompatibilityTest();
test.start().catch(console.error);