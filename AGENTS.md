# AGENTS.md

## 规范

总是使用中文回复

## 项目概述

`unplugin-agent-sync` 是一个基于unplugin框架的通用插件模板项目，旨在为开发者提供一个快速开发跨构建工具插件的起点。该项目通过unplugin的统一API，使插件能够在Vite、Webpack、Rollup、Nuxt等多种构建工具中运行，无需为每个工具单独编写适配代码。

## 核心功能

1. **代码转换**：插件当前提供一个简单的示例功能，将代码中的 `__UNPLUGIN__` 占位符替换为自定义文本
2. **构建工具无关**：基于unplugin框架，支持多种主流构建工具
3. **TypeScript支持**：完整支持TypeScript开发
4. **统一配置**：通过统一的选项接口，在不同构建工具中提供一致的功能

## 支持的构建工具

- **Vite** (3+)
- **Webpack** (4+ 和 5)
- **Rollup** (3+)
- **Nuxt** (支持Nuxt 2和Nuxt Vite)
- **Vue CLI**
- **esbuild**
- **Astro**
- **Farm**
- **Rspack**

## 开发指南

### 开发流程

- **本地开发**：
   ```bash
   pnpm run dev    # 监听模式，自动构建
   pnpm run play   # 运行playground示例
   ```

- **测试**：
   ```bash
   pnpm run test   # 运行vitest测试
   ```

- **构建**：
   ```bash
   pnpm run build  # 构建发布版本
   ```
- **检查并修复eslint错误**
   ```bash
   pnpm run lint --fix
   ```

- **类型检查**：
   ```bash
   pnpm run typecheck
   ```

## 项目结构

```
unplugin-agent-sync/
├── src/                    # 源代码目录
│   ├── index.ts           # 核心插件逻辑
│   ├── types.ts           # 类型定义
│   ├── vite.ts            # Vite适配器
│   ├── webpack.ts         # Webpack适配器
│   ├── rollup.ts          # Rollup适配器
│   └── ...                # 其他构建工具适配器
├── playground/            # 示例和测试目录
├── test/                  # 测试文件
└── dist/                  # 构建输出目录
```

## 代码规范

- **编码风格**：遵循项目中的eslint配置
- **TypeScript**：所有新代码应使用TypeScript编写
- **命名规范**：
   - 文件名使用kebab-case
   - 变量和函数使用camelCase
   - 类型和接口使用PascalCase
- **注释规范**：为复杂逻辑添加必要的中文注释

## 完成时

- 检查并修复eslint错误
- 类型检查

修复前两步命令的错误

- 非必要不要写测试
- 非必要不要新建md文件
