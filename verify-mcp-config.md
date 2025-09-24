# MCP配置验证指南

## 🔍 问题排查步骤

### 1. 验证MCP服务器是否正常启动
```bash
# 全局安装方式测试
id-generator

# 本地路径方式测试  
node /Users/liqiongchao/code_workspace/openSource/liqiongchao/mcp-id-generator/build/index.js
```

### 2. 检查配置文件语法
确保JSON格式正确，没有语法错误：

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

### 3. 重启MCP客户端
配置更改后需要重启：
- Claude Desktop: 完全退出并重新打开
- Cursor: 重新加载窗口
- 其他: 按各自的重启方式

### 4. 查看客户端日志
大多数MCP客户端都有日志功能，查看是否有错误信息。

## ✅ 验证工具列表

在MCP客户端中，您应该看到：

**工具名称**: `generate-id`  
**支持的算法**: 
- `cuid2` (默认)
- `uuid` 
- `nanoid`
- `ulid`
- `snowflake` ⭐

**参数**:
- `algorithm`: 选择ID算法
- `quantity`: 生成数量 (默认为1)

## 🔧 常见问题解决

### 问题1: "找不到命令"
**解决**: 使用绝对路径配置

### 问题2: "没有可用工具"  
**解决**: 检查JSON语法，重启客户端

### 问题3: "权限错误"
**解决**: 确保文件有执行权限
```bash
chmod +x /path/to/build/index.js
```

### 问题4: "连接超时"
**解决**: 检查MCP服务器是否能独立启动

## 📞 获取帮助

如果问题仍然存在，请提供：
1. 使用的MCP客户端名称和版本
2. 完整的配置文件内容
3. 客户端错误日志
4. `id-generator` 命令的输出结果