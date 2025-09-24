# 🧪 MCP ID Generator 测试和配置完整指南

## 📋 目录
1. [本地测试](#本地测试)
2. [安装方式](#安装方式)
3. [客户端配置](#客户端配置)
4. [测试命令](#测试命令)

## 🧪 本地测试

### 1. 构建项目
```bash
npm install
npm run build
```

### 2. 直接测试功能
```bash
# 测试基础 ID 生成功能
node test-local.js
```

### 3. 测试 MCP 协议
```bash
# 完整 MCP 协议测试
node test-mcp.js
```

### 4. 交互式客户端测试
```bash
# 本地构建版本
node test-client.js local

# 全局安装版本
node test-client.js global

# NPX 版本
node test-client.js npx
```

## 📦 安装方式

### 方式 1: 本地开发模式
```bash
# 在项目目录下直接使用
npm run build
node build/index.js
```

### 方式 2: 全局安装 (推荐)
```bash
# 打包并全局安装
npm pack
npm install -g ./clancy_lee-mcp-id-generator-0.1.0.tgz

# 验证安装
which id-generator
```

### 方式 3: 从 NPM 安装 (如果已发布)
```bash
npm install -g @clancy_lee/mcp-id-generator
```

## ⚙️ 客户端配置

### Claude Desktop 配置
编辑 `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "id-generator": {
      "command": "id-generator",
      "args": []
    }
  }
}
```

### Cursor 配置
编辑 MCP 配置文件:

```json
{
  "mcpServers": {
    "id-generator": {
      "command": "npx",
      "args": ["@clancy_lee/mcp-id-generator"]
    }
  }
}
```

### 本地开发配置
```json
{
  "mcpServers": {
    "id-generator-dev": {
      "command": "node",
      "args": ["/path/to/your/project/build/index.js"],
      "env": {
        "NODE_ENV": "development"
      }
    }
  }
}
```

## 🔧 测试命令

### 基础功能测试
```bash
# 测试所有 ID 算法
node test-local.js
```

### MCP 协议测试
```bash
# 完整协议测试
node test-mcp.js
```

### 交互式测试
```bash
# 启动交互式客户端
node test-client.js global
```

在交互模式中：
- 输入 `1` - 生成默认 CUID2
- 输入 `2` - 生成 UUID
- 输入 `3` - 生成 3个 NanoID
- 输入 `4` - 生成 5个 ULID
- 输入 `5` - 自定义参数
- 输入 `q` - 退出

### 直接命令行测试
```bash
# 启动服务器 (后台运行)
id-generator &

# 或者使用 npx
npx @clancy_lee/mcp-id-generator &
```

## 🎯 验证清单

### ✅ 安装验证
- [ ] `npm run build` 成功
- [ ] `node build/index.js` 可以启动
- [ ] `which id-generator` 返回路径
- [ ] `node test-local.js` 生成各种 ID

### ✅ MCP 协议验证
- [ ] 初始化握手成功
- [ ] 工具调用返回正确结果
- [ ] 错误处理正常
- [ ] JSON-RPC 格式正确

### ✅ 客户端配置验证
- [ ] 配置文件语法正确
- [ ] 命令路径正确
- [ ] 环境变量设置正确
- [ ] 权限设置正确

## 🚨 常见问题

### 1. 找不到 id-generator 命令
```bash
# 检查全局安装
npm list -g @clancy_lee/mcp-id-generator

# 重新安装
npm install -g ./clancy_lee-mcp-id-generator-0.1.0.tgz
```

### 2. MCP 协议错误
- 检查 JSON-RPC 格式
- 验证协议版本兼容性
- 检查 stdio 通信

### 3. 权限问题
```bash
# 确保执行权限
chmod +x build/index.js
```

### 4. 依赖问题
```bash
# 重新安装依赖
rm -rf node_modules package-lock.json
npm install
```

## 📊 支持的 ID 类型

| 算法 | 示例 | 长度 | 特点 |
|------|------|------|------|
| UUID | `550e8400-e29b-41d4-a716-446655440000` | 36 | 标准格式，广泛支持 |
| CUID2 | `ckad5qrv90000qih7eqh0qp2k` | ~25 | 短小，抗冲突，性能好 |
| NanoID | `V1StGXR8_Z5jdHi6B-myT` | 21 | 紧凑，URL安全 |
| ULID | `01ARZ3NDEKTSV4RRFFQ69G5FAV` | 26 | 时间排序，字典序 |

使用这个指南，您可以完整地测试、安装和配置 MCP ID Generator！