# unplugin-agent-sync

[![NPM version](https://img.shields.io/npm/v/unplugin-agent-sync?color=a1b858&label=)](https://www.npmjs.com/package/unplugin-agent-sync)

[English](./README.md) | 简体中文

AI代理文件同步工具，用于在多个AI助手配置文件间保持内容一致。

## 功能特性

- 🔄 **自动同步**：当AI代理文件修改后，自动同步到其他文件
- 🛠️ **多构建工具支持**：支持Vite、Webpack、Rollup等

## 安装

```bash
npm i unplugin-agent-sync -D
```

## 使用方法

```typescript
// vite.config.ts
import AgentSync from 'unplugin-agent-sync/vite'

export default defineConfig({
  plugins: [
    AgentSync()
  ]
})
```

## 配置选项

| 选项 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `agentFiles` | `string[]` | `['AGENTS.md', 'CLAUDE.md', 'QWEN.md']` | 需要保持同步的文件数组 |

## 注意事项

- 同步是双向的 - 任何文件都可以触发同步到其他文件
