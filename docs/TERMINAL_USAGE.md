# Terminal 使用指南

本文档介绍如何在本地 terminal 中使用 `@clancy_lee/mcp-id-generator` 包。

## 📦 安装方式

### 方式一：全局安装（推荐）
```bash
npm install -g @clancy_lee/mcp-id-generator
```

### 方式二：项目本地安装
```bash
npm install @clancy_lee/mcp-id-generator
```

## 🚀 使用方法

### 1. 作为 MCP 服务器使用（需要 MCP 客户端）

这是包的主要设计用途，用于与 AI 助手（如 Claude）集成：

```bash
# 使用全局安装的命令
id-generator

# 或使用 npx
npx @clancy_lee/mcp-id-generator
```

**注意**：这种方式启动的是 MCP 服务器，需要通过 JSON-RPC 协议进行通信，主要用于 AI 助手集成。

### 2. 使用独立命令行工具（推荐在 Terminal 中使用）

我们为你创建了一个独立的命令行工具 `bin/standalone-id-generator.js`，可以直接在 terminal 中生成 ID：

```bash
# 查看帮助
node bin/standalone-id-generator.js --help

# 生成默认ID（cuid2）
node bin/standalone-id-generator.js

# 生成指定类型的ID
node bin/standalone-id-generator.js uuid
node bin/standalone-id-generator.js snowflake
node bin/standalone-id-generator.js nanoid
node bin/standalone-id-generator.js ulid

# 批量生成ID
node bin/standalone-id-generator.js snowflake 10
node bin/standalone-id-generator.js uuid 5
```

## 🔧 支持的ID算法

| 算法 | 示例 | 特点 |
|------|------|------|
| `uuid` | `123e4567-e89b-12d3-a456-426614174000` | 标准UUID v4，128位唯一标识符 |
| `cuid2` | `clh3ppfqz0000jz0ggdlg7etk` | 抗冲突ID，适合水平扩展 |
| `nanoid` | `V1StGXR8_Z5jdHi6B-myT` | 小巧、安全、URL友好 |
| `ulid` | `01ARZ3NDEKTSV4RRFFQ69G5FAV` | 时间排序的唯一标识符 |
| `snowflake` | `1970791204404596736` | 64位整数，分布式系统，MyBatis-Plus兼容 |

## 📋 实际使用示例

### 1. 生成数据库主键（Snowflake）
```bash
# 生成单个Snowflake ID用作数据库主键
node bin/standalone-id-generator.js snowflake

# 批量生成用于数据初始化
node bin/standalone-id-generator.js snowflake 100
```

### 2. 生成API密钥或会话ID
```bash
# 生成安全的会话ID
node bin/standalone-id-generator.js nanoid

# 生成API密钥
node bin/standalone-id-generator.js cuid2
```

### 3. 生成文件名或临时标识符
```bash
# 生成时间排序的文件名
node bin/standalone-id-generator.js ulid

# 生成标准的唯一标识符
node bin/standalone-id-generator.js uuid
```

## 🛠️ 集成到脚本中

你可以在bash脚本中使用这些命令：

```bash
#!/bin/bash
# 示例：为新用户生成ID
USER_ID=$(node bin/standalone-id-generator.js snowflake | grep -o '[0-9]*' | tail -1)
echo "新用户ID: $USER_ID"

# 生成多个API密钥
echo "生成的API密钥："
for i in {1..5}; do
    API_KEY=$(node bin/standalone-id-generator.js nanoid | grep -o '[a-zA-Z0-9_-]*' | tail -1)
    echo "API_KEY_$i=$API_KEY"
done
```

## ⚡ 性能提示

- `bin/standalone-id-generator.js` 是直接生成，响应最快
- 支持批量生成，一次性生成多个ID更高效
- Snowflake算法生成的ID在同一毫秒内是递增的，适合排序需求

## 🔗 与 MyBatis-Plus 集成

生成的 Snowflake ID 与 MyBatis-Plus 完全兼容：

```java
// MyBatis-Plus 配置
@TableId(type = IdType.ASSIGN_ID)
private Long id;

// 使用生成的ID
Long generatedId = 1970791204404596736L; // 来自命令行工具
```

## 📚 更多信息

- 项目主页：https://github.com/liqiongchao/mcp-id-generator
- npm 包：https://www.npmjs.com/package/@clancy_lee/mcp-id-generator
- 技术支持：创建 GitHub Issue