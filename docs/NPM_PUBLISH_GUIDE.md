# NPM 发布流程指南

## 📋 发布前准备

### 1. 注册npm账号
如果还没有npm账号，请访问 [npmjs.com](https://www.npmjs.com/) 注册：
- 用户名要求唯一
- 邮箱需要验证
- 建议开启两步验证（2FA）

### 2. 登录npm
```bash
npm login
```
输入用户名、密码和邮箱

### 3. 验证登录状态
```bash
npm whoami
```

## 🔧 项目配置检查

### 1. 检查package.json配置
确保以下字段正确配置：

```json
{
  "name": "@clancy_lee/mcp-id-generator",
  "version": "0.1.0",
  "description": "MCP server for generating IDs with different algorithms including Snowflake",
  "author": "Clancy Lee <clancylee.818@gmail.com>",
  "license": "MIT",
  "homepage": "https://github.com/liqiongchao/mcp-id-generator#readme",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/liqiongchao/mcp-id-generator.git"
  },
  "bugs": {
    "url": "https://github.com/liqiongchao/mcp-id-generator/issues"
  },
  "keywords": [
    "mcp",
    "id",
    "generator",
    "snowflake",
    "distributed-id",
    "mybatis-plus",
    "uuid",
    "cuid2",
    "nanoid",
    "ulid"
  ],
  "main": "build/index.js",
  "bin": {
    "id-generator": "./build/index.js"
  },
  "files": [
    "build/",
    "README.md",
    "LICENSE"
  ],
  "engines": {
    "node": ">=18.0.0"
  }
}
```

### 2. 检查.npmignore文件
确保只包含必要的文件：
```
# 当前.npmignore已正确配置
# 包含build/、README.md、LICENSE、package.json
# 排除src/、tests/、docs/等开发文件
```

### 3. 检查文件完整性
```bash
# 构建项目
npm run build

# 检查构建结果
ls -la build/

# 测试包内容
npm pack --dry-run
```

## 🚀 发布流程

### 1. 最终测试
```bash
# 运行所有测试
npm run test:all

# 手动测试MCP功能
npm test
```

### 2. 更新版本号
根据语义化版本规范：

```bash
# 补丁版本 (0.1.0 -> 0.1.1) - 修复bug
npm version patch

# 次要版本 (0.1.0 -> 0.2.0) - 新功能
npm version minor

# 主要版本 (0.1.0 -> 1.0.0) - 破坏性更改
npm version major
```

### 3. 发布到npm
```bash
# 首次发布（公开包）
npm publish --access public

# 后续更新
npm publish
```

### 4. 验证发布
```bash
# 检查包是否发布成功
npm view @clancy_lee/mcp-id-generator

# 在新目录测试安装
mkdir test-install && cd test-install
npm install @clancy_lee/mcp-id-generator
```

## 📦 发布后操作

### 1. 创建Git标签
```bash
git tag v0.1.0
git push origin v0.1.0
```

### 2. 创建GitHub Release
在GitHub仓库中：
1. 点击 "Releases"
2. 点击 "Create a new release"
3. 选择刚创建的标签
4. 填写发布说明
5. 发布Release

### 3. 更新文档
- 更新README中的安装说明
- 更新版本号相关文档
- 添加更新日志

## 🔄 版本管理策略

### 语义化版本(SemVer)
- **主版本号**: 不兼容的API修改
- **次版本号**: 向下兼容的功能性新增
- **修订号**: 向下兼容的问题修正

### 预发布版本
```bash
# 发布beta版本
npm version prerelease --preid=beta
npm publish --tag beta

# 安装beta版本
npm install @clancy_lee/mcp-id-generator@beta
```

## ⚠️ 注意事项

### 1. 包名规则
- 作用域包格式：`@username/package-name`
- 包名必须唯一
- 只能包含小写字母、数字、连字符、下划线

### 2. 发布权限
- 首次发布作用域包需要 `--access public`
- 私有包需要付费npm账户

### 3. 安全考虑
- 开启2FA（两步验证）
- 定期检查包的依赖安全性
- 不要在代码中包含敏感信息

### 4. 撤销发布
```bash
# 72小时内可以撤销
npm unpublish @clancy_lee/mcp-id-generator@0.1.0

# 过期后只能废弃
npm deprecate @clancy_lee/mcp-id-generator@0.1.0 "版本已废弃"
```

## 📊 发布清单

发布前请确认：

- [ ] 代码已提交到Git
- [ ] 所有测试通过
- [ ] README.md内容准确
- [ ] package.json信息正确
- [ ] .npmignore配置合理
- [ ] 版本号已更新
- [ ] 构建文件存在
- [ ] npm登录状态正常

发布后请确认：

- [ ] npm官网能搜索到包
- [ ] 安装测试成功
- [ ] 创建Git标签
- [ ] 发布GitHub Release
- [ ] 更新相关文档

## 🎯 快速发布命令

```bash
# 一键发布流程
npm run build && \
npm run test:all && \
npm version patch && \
npm publish --access public && \
git push && \
git push --tags
```

遵循以上流程，您就可以成功将包发布到npm公共仓库！