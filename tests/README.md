# 测试目录

这个目录包含了MCP ID生成器的所有测试文件。

## 测试文件说明

| 文件 | 描述 | 用途 |
|------|------|------|
| `test-mcp.js` | MCP协议基础测试 | 验证MCP服务器基本功能和各种ID生成算法 |
| `test-snowflake.js` | 雪花算法专项测试 | 详细验证雪花算法的特性和性能 |
| `test-mybatis-plus-compatibility.js` | MyBatis-Plus兼容性测试 | 验证与MyBatis-Plus雪花算法的兼容性 |
| `test-external-call.js` | 外部调用测试 | 模拟外部MCP客户端调用 |
| `test-client.js` | 客户端测试 | 完整的客户端测试场景 |
| `test-local.js` | 本地测试 | 简单的本地功能测试 |
| `TESTING_GUIDE.md` | 测试指南 | 详细的测试说明文档 |

## 运行测试

### 前置条件
```bash
# 确保项目已构建
npm run build
```

### 单个测试
```bash
# 进入测试目录
cd tests

# 运行基础MCP测试
node test-mcp.js

# 运行雪花算法测试
node test-snowflake.js

# 运行兼容性测试
node test-mybatis-plus-compatibility.js

# 运行外部调用测试
node test-external-call.js
```

### 使用npm scripts
```bash
# 运行基础测试
npm test

# 运行雪花算法测试
npm run test:snowflake

# 运行兼容性测试
npm run test:compatibility

# 运行外部调用测试
npm run test:external

# 运行所有主要测试
npm run test:all
```

## 测试结果解读

### 成功标志
- ✅ 绿色对勾表示测试通过
- 📥 成功接收到MCP服务器响应
- 🎉 显示兼容性验证通过

### 失败标志
- ❌ 红色叉号表示测试失败
- 错误消息会显示具体的失败原因

## 添加新测试

1. 创建新的测试文件 `test-new-feature.js`
2. 参考现有测试文件的结构
3. 在package.json中添加对应的npm script
4. 更新本README文件

## 注意事项

- 所有测试文件都使用相对路径 `../build/index.js` 引用构建后的文件
- 测试前必须先运行 `npm run build` 构建项目
- 测试会启动独立的MCP服务器进程进行验证