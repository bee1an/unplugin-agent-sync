# unplugin-agent-sync

[![NPM version](https://img.shields.io/npm/v/unplugin-agent-sync?color=a1b858&label=)](https://www.npmjs.com/package/unplugin-agent-sync)

English | [简体中文](./README.zh-CN.md)

AI agent file synchronization tool for maintaining content consistency across multiple AI assistant configuration files.

## Features

- 🔄 **Auto Sync**: Automatically sync files when AI agent files are modified
- 🛠️ **Multi-build Tool Support**: Works with Vite, Webpack, Rollup, and more

## Installation

```bash
npm i unplugin-agent-sync -D
```

## Usage

```typescript
// vite.config.ts
import AgentSync from 'unplugin-agent-sync/vite'

export default defineConfig({
  plugins: [
    AgentSync()
  ]
})
```

## Configuration

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `agentFiles` | `string[]` | `['AGENTS.md', 'CLAUDE.md', 'QWEN.md']` | Files to keep in sync |

## VSCode Configuration

For better file organization in VSCode, it's recommended to add the following configuration to your workspace or user settings:

```json
{
  "explorer.fileNesting.enabled": true,
  "explorer.fileNesting.patterns": {
    "AGENTS.md": "CLAUDE.md, QWEN.md, GEMINI.md, WARP.md"
  }
}
```

This will group the AI agent configuration files under AGENTS.md in the file explorer, making them easier to manage.

## Notes

- Sync is bidirectional - any file can trigger sync to others
