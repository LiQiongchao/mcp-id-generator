# 命令行工具

本目录包含用于在 terminal 中直接使用的命令行工具。

## 文件说明

### `standalone-id-generator.js` ⭐ 推荐
独立的ID生成器，无需启动MCP服务器，直接生成ID。

**使用方式：**
```bash
# 生成单个ID
node bin/standalone-id-generator.js [算法] [数量]

# 示例
node bin/standalone-id-generator.js snowflake 5
node bin/standalone-id-generator.js uuid
node bin/standalone-id-generator.js --help
```

### `cli-wrapper.js`
MCP服务器的命令行包装器，通过JSON-RPC协议与MCP服务器通信。

**使用方式：**
```bash
node bin/cli-wrapper.js [算法] [数量]
```

## 快速开始

```bash
# 查看帮助
node bin/standalone-id-generator.js --help

# 生成Snowflake ID（推荐用于数据库主键）
node bin/standalone-id-generator.js snowflake

# 批量生成UUID
node bin/standalone-id-generator.js uuid 10
```

更多详细使用说明请查看：[../docs/TERMINAL_USAGE.md](../docs/TERMINAL_USAGE.md)