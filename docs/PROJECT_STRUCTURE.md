# 项目目录结构

本项目采用标准的Node.js项目结构，各目录功能说明如下：

```
mcp-id-generator/
├── .github/                    # GitHub工作流和模板
├── .git/                      # Git版本控制
├── build/                     # 编译后的JavaScript文件
│   └── index.js              # 主入口文件
├── docs/                      # 项目文档
│   └── SNOWFLAKE_ID_GUIDE.md # 雪花算法详细文档
├── examples/                  # 配置示例
│   └── mcp-config.json       # MCP配置示例
├── src/                       # TypeScript源代码
│   ├── index.ts              # 主入口源文件
│   └── types/                # 类型声明文件
├── tests/                     # 测试文件
│   ├── TESTING_GUIDE.md      # 测试指南
│   ├── test-client.js        # 客户端测试
│   ├── test-external-call.js # 外部调用测试
│   ├── test-local.js         # 本地测试
│   ├── test-mcp.js           # MCP协议测试
│   ├── test-mybatis-plus-compatibility.js # MyBatis-Plus兼容性测试
│   └── test-snowflake.js     # 雪花算法专项测试
├── .gitignore                 # Git忽略文件
├── .npmignore                 # NPM发布忽略文件
├── Dockerfile                 # Docker构建文件
├── LICENSE                    # 开源许可证
├── package.json              # NPM包配置
├── package-lock.json         # NPM依赖锁定
├── README.md                 # 项目说明文档
├── smithery.yaml             # Smithery配置
└── tsconfig.json             # TypeScript配置
```

## 目录功能详解

### 📁 `src/` - 源代码目录
- 包含所有TypeScript源代码
- `index.ts` - MCP服务器主入口
- `types/` - 类型声明文件目录

### 📁 `build/` - 构建输出目录
- TypeScript编译后的JavaScript文件
- 生产环境运行的实际文件

### 📁 `tests/` - 测试目录
- 所有测试相关文件
- 包含各种测试场景和测试指南
- 运行测试时需要先构建项目

### 📁 `docs/` - 文档目录
- 项目技术文档
- API文档和使用指南
- 算法原理说明

### 📁 `examples/` - 示例目录
- 配置文件示例
- 使用示例代码

## 开发工作流

### 1. 开发阶段
```bash
# 修改源代码
vim src/index.ts

# 构建项目
npm run build

# 运行测试
cd tests && node test-mcp.js
```

### 2. 测试阶段
```bash
# 运行所有测试
cd tests
node test-mcp.js                    # 基础MCP测试
node test-snowflake.js              # 雪花算法测试
node test-mybatis-plus-compatibility.js  # 兼容性测试
```

### 3. 发布阶段
```bash
# 打包
npm pack

# 发布
npm publish
```

## 注意事项

1. **路径引用**: 测试文件中的路径都已调整为相对于tests目录的路径
2. **构建优先**: 运行测试前需要先执行 `npm run build`
3. **文档维护**: 修改功能后要同步更新docs目录中的文档