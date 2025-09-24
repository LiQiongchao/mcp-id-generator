#!/usr/bin/env node

// 独立的ID生成器 - 直接使用相同的依赖包
import { createId } from '@paralleldrive/cuid2';
import { v4 as uuidv4 } from 'uuid';
import { nanoid } from 'nanoid';
import { ulid } from 'ulid';
import { Snowflake } from '@sapphire/snowflake';

// 初始化雪花算法实例，使用与MyBatis-Plus相同的epoch时间
const snowflake = new Snowflake(1288834974657n);

const args = process.argv.slice(2);
const algorithm = args[0] || 'cuid2';
const quantity = parseInt(args[1]) || 1;

const supportedAlgorithms = ['uuid', 'cuid2', 'nanoid', 'ulid', 'snowflake'];

if (args.includes('--help') || args.includes('-h')) {
  console.log(`
🆔 ID Generator 独立命令行工具

用法:
  node standalone-id-generator.js [算法] [数量]

支持的算法:
  uuid      - UUID v4 (例: 123e4567-e89b-12d3-a456-426614174000)
  cuid2     - CUID2 (例: clh3ppfqz0000jz0ggdlg7etk) [默认]
  nanoid    - NanoID (例: V1StGXR8_Z5jdHi6B-myT)
  ulid      - ULID (例: 01ARZ3NDEKTSV4RRFFQ69G5FAV)
  snowflake - Snowflake (例: 1970773878481358848，MyBatis-Plus兼容)

示例:
  node standalone-id-generator.js                    # 生成1个cuid2
  node standalone-id-generator.js uuid               # 生成1个UUID
  node standalone-id-generator.js snowflake 5        # 生成5个Snowflake ID
  node standalone-id-generator.js ulid 10            # 生成10个ULID
  node standalone-id-generator.js --help             # 显示帮助

特性:
  ✅ 无需启动MCP服务器
  ✅ 直接生成ID，快速响应
  ✅ 与MyBatis-Plus完全兼容的Snowflake算法
  ✅ 支持批量生成
`);
  process.exit(0);
}

if (!supportedAlgorithms.includes(algorithm)) {
  console.error(`❌ 不支持的算法: ${algorithm}`);
  console.error(`✅ 支持的算法: ${supportedAlgorithms.join(', ')}`);
  process.exit(1);
}

if (quantity < 1 || quantity > 1000) {
  console.error('❌ 数量必须在 1-1000 之间');
  process.exit(1);
}

function generateId(algo) {
  switch (algo) {
    case 'cuid2':
      return createId();
    case 'nanoid':
      return nanoid();
    case 'ulid':
      return ulid();
    case 'snowflake':
      return snowflake.generate().toString();
    case 'uuid':
    default:
      return uuidv4();
  }
}

try {
  console.log(`🔄 正在生成 ${quantity} 个 ${algorithm} 类型的ID...\n`);
  
  const ids = [];
  for (let i = 0; i < quantity; i++) {
    ids.push(generateId(algorithm));
  }
  
  console.log(`✅ 生成的 ${algorithm} ID${ids.length > 1 ? 's' : ''}:`);
  ids.forEach((id, index) => {
    console.log(`  ${(index + 1).toString().padStart(3, ' ')}. ${id}`);
  });
  
  console.log(`\n📋 复制用途 (逗号分隔): ${ids.join(',')}`);
  
} catch (error) {
  console.error('❌ 生成ID失败:', error.message);
  process.exit(1);
}