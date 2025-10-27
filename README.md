# unplugin-agent-sync

[![NPM version](https://img.shields.io/npm/v/unplugin-agent-sync?color=a1b858&label=)](https://www.npmjs.com/package/unplugin-agent-sync)

English | [简体中文](./README.zh-CN.md)

An unplugin-based AI agent file synchronization tool for maintaining content consistency across multiple AI assistant configuration files.

## Features

- 🔄 **File Synchronization**: Automatically sync source file content to multiple target AI agent files
- 👀 **Real-time Monitoring**: Monitor source file changes and automatically trigger sync operations
- 🔧 **Flexible Configuration**: Support for custom source files and target file arrays
- 🛠️ **Multi-build Tool Support**: Based on unplugin, supports Vite, Webpack, Rollup, and more
- 📦 **TypeScript Support**: Complete type definitions and development experience

## Core Functionality

### AI Agent File Synchronization

When you use multiple AI assistants (like Claude, Qwen, GPT, etc.), you typically need to maintain similar configuration files for each assistant. This plugin can:

1. **Auto Sync**: Automatically update other AI agent files when `AGENTS.md` is modified
2. **Real-time Monitoring**: Support file change monitoring without manual triggering
3. **Flexible Configuration**: Specify any target file array

## Installation

```bash
npm i unplugin-agent-sync
```

## Quick Start

### Basic Usage

```typescript
import UnpluginAgentSync from 'unplugin-agent-sync/vite'

export default defineConfig({
  plugins: [
    UnpluginAgentSync({
      sourceFile: 'AGENTS.md', // Source file
      agentFiles: ['CLAUDE.md', 'QWEN.md'], // Target file array
      watchMode: true // Enable auto monitoring
    })
  ]
})
```

### Manual Sync

```typescript
import UnpluginAgentSync from 'unplugin-agent-sync'

const plugin = UnpluginAgentSync({
  sourceFile: 'AGENTS.md',
  agentFiles: ['CLAUDE.md', 'QWEN.md']
})

// Manual sync execution
await plugin.api.sync()
```

## Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `sourceFile` | `string` | `'AGENTS.md'` | Source file path, relative to project root |
| `agentFiles` | `string[]` | `[]` | Array of target AI agent files to sync |
| `watchMode` | `boolean` | `false` | Whether to enable automatic file change monitoring |

## Build Tool Integration

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

> This module supports Nuxt 2 and [Nuxt Vite](https://github.com/nuxt/vite)

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

## Development and Testing

```bash
# Development mode
pnpm run dev

# Build project
pnpm run build

# Run tests
pnpm run test

# Test sync functionality
node test-sync.js

# Start watch mode demo
node watch-demo.js
```

## Use Cases

1. **Multi-AI Assistant Management**: Maintain configuration consistency across Claude, Qwen, GPT, and other assistants
2. **Project Standard Synchronization**: Ensure all AI assistants follow the same project standards
3. **Configuration File Maintenance**: Reduce the workload of manually maintaining multiple similar configurations
4. **Team Collaboration**: Unify AI assistant configuration standards used by the team

## Notes

- Ensure the source file path is correct, relative to the project root
- Target files will be automatically created if they don't exist
- File synchronization is completely overwriting; original content in target files will be replaced
- When watch mode is enabled, the process will continue running until manually stopped
