# 示例文件

本目录包含各种使用示例和配置文件。

## 文件说明

### MCP 配置文件
- `mcp-config.json` - 基本MCP配置示例
- `mcp-config-global.json` - 全局安装的MCP配置
- `mcp-config-local.json` - 本地开发的MCP配置

### 示例脚本
- `mcp-client-example.js` - MCP客户端使用示例，展示如何通过JSON-RPC协议调用MCP服务器生成ID

## 使用说明

### 运行MCP客户端示例
```bash
node examples/mcp-client-example.js
```

这个示例展示了如何：
- 启动MCP服务器进程
- 通过JSON-RPC协议发送请求
- 生成不同类型的ID
- 处理响应结果

### 配置 Claude Desktop
将相应的配置文件内容添加到 Claude Desktop 的配置中：

**全局安装方式：**
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

**NPX方式：**
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

更多配置信息请参考主 README.md 文件。