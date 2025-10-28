/* eslint-disable no-console */
import type { UnpluginFactory } from 'unplugin'
import type { Options } from './types'
import { existsSync, watch } from 'node:fs'
import { readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import process from 'node:process'
import { createUnplugin } from 'unplugin'

// 防止死循环的标志位
let isSyncing = false
let lastSyncTime = 0
const SYNC_DELAY = 100 // 同步延迟，避免快速连续变化导致的死循环

// 默认同步文件列表
export const DEFAULT_AGENT_FILES = ['AGENTS.md', 'CLAUDE.md', 'QWEN.md']

// 文件监听器管理
let watchers: any[] = []
let existingFiles: string[] = []
let isWatching = false

/**
 * 同步文件内容到其他所有文件
 */
async function syncFileToAll(changedFile: string, allFiles: string[]): Promise<void> {
  // 如果正在同步中，跳过以避免死循环
  if (isSyncing) {
    return
  }

  // 检查是否在短时间内已经同步过
  const now = Date.now()
  if (now - lastSyncTime < SYNC_DELAY) {
    return
  }

  try {
    isSyncing = true
    lastSyncTime = now

    // 读取变化的文件内容
    const changedPath = resolve(process.cwd(), changedFile)
    if (!existsSync(changedPath)) {
      console.warn(`[unplugin-agent-sync] File not found: ${changedPath}`)
      return
    }

    const changedContent = await readFile(changedPath, 'utf-8')
    console.log(`[unplugin-agent-sync] File changed: ${changedPath}`)

    // 同步到其他所有文件
    for (const targetFile of allFiles) {
      if (targetFile === changedFile) {
        continue // 跳过自身
      }

      const targetPath = resolve(process.cwd(), targetFile)
      try {
        await writeFile(targetPath, changedContent, 'utf-8')
        console.log(`[unplugin-agent-sync] Synced content to: ${targetPath}`)
      }
      catch (error) {
        console.error(`[unplugin-agent-sync] Failed to write file ${targetPath}:`, error)
      }
    }
  }
  catch (error) {
    console.error(`[unplugin-agent-sync] Failed to sync files:`, error)
  }
  finally {
    // 稍微延迟后重置同步标志
    setTimeout(() => {
      isSyncing = false
    }, SYNC_DELAY)
  }
}

/**
 * 启动文件监听器
 */
function startFileWatchers(agentFiles: string[]): void {
  if (isWatching) {
    console.log('[unplugin-agent-sync] File monitoring already started')
    return
  }

  // 检查所有文件是否存在
  existingFiles = []
  for (const file of agentFiles) {
    const filePath = resolve(process.cwd(), file)
    if (existsSync(filePath)) {
      existingFiles.push(file)
    }
    else {
      console.warn(`[unplugin-agent-sync] File not found: ${filePath}`)
    }
  }

  if (existingFiles.length === 0) {
    console.warn('[unplugin-agent-sync] No existing files found')
    return
  }

  // 如果只有一个文件，不需要同步
  if (existingFiles.length === 1) {
    console.log(`[unplugin-agent-sync] Only one file found: ${existingFiles[0]}, no sync needed`)
    return
  }

  console.log(`[unplugin-agent-sync] Starting file monitoring: ${existingFiles.join(', ')}`)

  // 为每个文件设置监听器
  watchers = []
  for (const file of existingFiles) {
    const filePath = resolve(process.cwd(), file)
    const watcher = watch(filePath, { recursive: false }, (eventType) => {
      if (eventType === 'change') {
        syncFileToAll(file, existingFiles)
      }
    })
    watchers.push(watcher)
  }

  isWatching = true
  console.log('[unplugin-agent-sync] File monitoring started')
}

/**
 * 停止文件监听器
 */
function stopFileWatchers(): void {
  if (!isWatching) {
    return
  }

  console.log('[unplugin-agent-sync] Stopping file monitoring...')

  // 关闭所有监听器
  watchers.forEach((watcher) => {
    try {
      watcher.close()
    }
    catch (error) {
      console.error('[unplugin-agent-sync] Error closing watcher:', error)
    }
  })

  watchers = []
  existingFiles = []
  isWatching = false

  console.log('[unplugin-agent-sync] File monitoring stopped')
}

/**
 * 为所有文件设置监听器（保持向后兼容）
 */
function _setupFileWatchers(agentFiles: string[]): void {
  startFileWatchers(agentFiles)
}

export const unpluginFactory: UnpluginFactory<Options | undefined> = (options = {}) => {
  const {
    agentFiles = DEFAULT_AGENT_FILES, // 使用导出的默认同步文件列表
  } = options

  // 优雅关闭处理
  process.on('SIGINT', () => {
    stopFileWatchers()
    process.exit(0)
  })

  process.on('SIGTERM', () => {
    stopFileWatchers()
    process.exit(0)
  })

  return {
    name: 'unplugin-agent-sync',
    enforce: 'pre',

    // 开发服务器启动时启动文件监听
    watchChange(_id, _event) {
      // 在第一次文件变化时启动监听
      if (!isWatching && agentFiles.length > 0) {
        startFileWatchers(agentFiles)
      }
    },

    // 构建结束时停止文件监听
    buildEnd() {
      stopFileWatchers()
    },

    // 监听模式结束时停止文件监听
    watchEnd() {
      stopFileWatchers()
    },

    // 提供手动同步方法
    api: {
      syncAll: () => {
        // 如果有多个文件，使用第一个文件的内容同步到其他文件
        if (agentFiles.length > 1) {
          const firstFile = agentFiles[0]
          syncFileToAll(firstFile, agentFiles)
        }
      },
      // 提供启动监听的方法
      startWatching: () => {
        if (agentFiles.length > 0) {
          startFileWatchers(agentFiles)
        }
      },
      // 提供停止监听的方法
      stopWatching: () => {
        stopFileWatchers()
      },
      // 提供获取当前配置的方法
      getConfig: () => ({ agentFiles }),
      // 提供获取监听状态的方法
      getWatchingStatus: () => isWatching,
    },

    transformInclude(id) {
      return id.endsWith('main.ts')
    },

    transform(code) {
      return code.replace('__UNPLUGIN__', `Hello Unplugin! ${JSON.stringify(options)}`)
    },
  }
}

export const unplugin = /* #__PURE__ */ createUnplugin(unpluginFactory)

export default unplugin
