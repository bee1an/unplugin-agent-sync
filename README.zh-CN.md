# unplugin-agent-sync

[![NPM version](https://img.shields.io/npm/v/unplugin-agent-sync?color=a1b858&label=)](https://www.npmjs.com/package/unplugin-agent-sync)

[English](./README.md) | 简体中文

一个基于unplugin的AI代理文件同步工具，用于在多个AI助手配置文件间保持内容一致。

## 功能特性

- 🔄 **文件同步**：自动将源文件内容同步到多个目标AI代理文件
- 👀 **实时监听**：监听源文件变化，自动触发同步操作
- 🔧 **灵活配置**：支持自定义源文件和目标文件数组
- 🛠️ **多构建工具支持**：基于unplugin，支持Vite、Webpack、Rollup等
- 📦 **TypeScript支持**：完整的类型定义和开发体验

## 核心功能

### AI代理文件同步

当您使用多个AI助手（如Claude、Qwen、GPT等）时，通常需要为每个助手维护相似的配置文件。本插件可以：

1. **自动同步**：当`AGENTS.md`文件修改后，自动更新其他AI代理文件
2. **实时监听**：支持文件变化监听，无需手动触发
3. **灵活配置**：可以指定任意目标文件数组

## 安装

```bash
npm i unplugin-agent-sync
```

## 快速开始

### 基本使用

```typescript
import UnpluginAgentSync from 'unplugin-agent-sync/vite'

export default defineConfig({
  plugins: [
    UnpluginAgentSync({
      sourceFile: 'AGENTS.md', // 源文件
      agentFiles: ['CLAUDE.md', 'QWEN.md'], // 目标文件数组
      watchMode: true // 启用自动监听
    })
  ]
})
```

### 手动同步

```typescript
import UnpluginAgentSync from 'unplugin-agent-sync'

const plugin = UnpluginAgentSync({
  sourceFile: 'AGENTS.md',
  agentFiles: ['CLAUDE.md', 'QWEN.md']
})

// 手动执行同步
await plugin.api.sync()
```

## 配置选项

| 选项 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `sourceFile` | `string` | `'AGENTS.md'` | 源文件路径，相对于项目根目录 |
| `agentFiles` | `string[]` | `[]` | 需要同步的目标AI代理文件数组 |
| `watchMode` | `boolean` | `false` | 是否启用自动监听文件变化 |

## 构建工具集成

<details>
<summary>Vite</summary><br>

```ts
// vite.config.ts
import UnpluginAgentSync from 'unplugin-agent-sync/vite'

export default defineConfig({
  plugins: [
    UnpluginAgentSync({
      sourceFile: 'AGENTS.md',
      agentFiles: ['CLAUDE.md', 'QWEN.md'],
      watchMode: true
    })
  ]
})
```

</details>

<details>
<summary>Rollup</summary><br>

```ts
// rollup.config.js
import UnpluginAgentSync from 'unplugin-agent-sync/rollup'

export default {
  plugins: [
    UnpluginAgentSync({
      sourceFile: 'AGENTS.md',
      agentFiles: ['CLAUDE.md', 'QWEN.md'],
      watchMode: true
    })
  ]
}
```

</details>

<details>
<summary>Webpack</summary><br>

```ts
// webpack.config.js
module.exports = {
  /* ... */
  plugins: [
    require('unplugin-agent-sync/webpack')({
      sourceFile: 'AGENTS.md',
      agentFiles: ['CLAUDE.md', 'QWEN.md'],
      watchMode: true
    })
  ]
}
```

</details>

<details>
<summary>Nuxt</summary><br>

```ts
// nuxt.config.js
export default defineNuxtConfig({
  modules: [
    [
      'unplugin-agent-sync/nuxt',
      {
        sourceFile: 'AGENTS.md',
        agentFiles: ['CLAUDE.md', 'QWEN.md'],
        watchMode: true
      }
    ]
  ]
})
```

> 此模块支持 Nuxt 2 和 [Nuxt Vite](https://github.com/nuxt/vite)

</details>

<details>
<summary>esbuild</summary><br>

```ts
// esbuild.config.js
import { build } from 'esbuild'
import UnpluginAgentSync from 'unplugin-agent-sync/esbuild'

build({
  plugins: [
    UnpluginAgentSync({
      sourceFile: 'AGENTS.md',
      agentFiles: ['CLAUDE.md', 'QWEN.md'],
      watchMode: true
    })
  ]
})
```

</details>

## 开发和测试

```bash
# 开发模式
pnpm run dev

# 构建项目
pnpm run build

# 运行测试
pnpm run test

# 测试同步功能
node test-sync.js

# 启动监听模式演示
node watch-demo.js
```

## 使用场景

1. **多AI助手管理**：保持Claude、Qwen、GPT等助手的配置一致性
2. **项目规范同步**：确保所有AI助手遵循相同的项目规范
3. **配置文件维护**：减少手动维护多个相似配置的工作量
4. **团队协作**：统一团队使用的AI助手配置标准

## 注意事项

- 确保源文件路径正确，相对于项目根目录
- 目标文件如果不存在，会自动创建
- 文件同步是完全覆盖式的，目标文件原有内容会被替换
- 启用监听模式时，进程会持续运行直到手动停止
