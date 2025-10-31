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

## VSCode 配置推荐

为了在VSCode中获得更好的文件组织体验，建议在你的工作区或用户设置中添加以下配置：

```json
{
  "explorer.fileNesting.enabled": true,
  "explorer.fileNesting.patterns": {
    "AGENTS.md": "CLAUDE.md, QWEN.md, GEMINI.md, WARP.md"
  }
}
```

这个配置会将AI代理配置文件在文件资源管理器中嵌套显示在AGENTS.md下，让它们更容易管理。

## 注意事项

- 同步是双向的 - 任何文件都可以触发同步到其他文件
