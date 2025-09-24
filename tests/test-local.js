#!/usr/bin/env node

// 本地测试脚本 - 直接测试 ID 生成功能
import { createId } from '@paralleldrive/cuid2';
import { v4 as uuidv4 } from 'uuid';
import { nanoid } from 'nanoid';
import { ulid } from 'ulid';

console.log('🧪 测试本地 ID 生成功能\n');

console.log('UUID (v4):', uuidv4());
console.log('CUID2:', createId());
console.log('NanoID:', nanoid());
console.log('ULID:', ulid());

console.log('\n📊 批量生成测试:');
console.log('5个 UUID:', Array.from({length: 5}, () => uuidv4()));
console.log('3个 CUID2:', Array.from({length: 3}, () => createId()));
console.log('2个 NanoID:', Array.from({length: 2}, () => nanoid()));
console.log('4个 ULID:', Array.from({length: 4}, () => ulid()));

console.log('\n✅ 本地功能测试完成');