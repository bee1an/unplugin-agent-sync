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

/**
 * 同步文件内容到其他所有文件
 */
async function syncFileToAll(changedFile: string, allFiles: string[]): Promise<void> {
  // 如果正在同步中，跳过以避免死循环
  if (isSyncing) {
    console.log(`[unplugin-agent-sync] 正在同步中，跳过文件变化: ${changedFile}`)
    return
  }

  // 检查是否在短时间内已经同步过
  const now = Date.now()
  if (now - lastSyncTime < SYNC_DELAY) {
    console.log(`[unplugin-agent-sync] 同步间隔过短，跳过文件变化: ${changedFile}`)
    return
  }

  try {
    isSyncing = true
    lastSyncTime = now

    // 读取变化的文件内容
    const changedPath = resolve(process.cwd(), changedFile)
    if (!existsSync(changedPath)) {
      console.warn(`[unplugin-agent-sync] 文件不存在: ${changedPath}`)
      return
    }

    const changedContent = await readFile(changedPath, 'utf-8')
    console.log(`[unplugin-agent-sync] 检测到文件变化: ${changedPath}`)

    // 同步到其他所有文件
    for (const targetFile of allFiles) {
      if (targetFile === changedFile) {
        continue // 跳过自身
      }

      const targetPath = resolve(process.cwd(), targetFile)
      try {
        await writeFile(targetPath, changedContent, 'utf-8')
        console.log(`[unplugin-agent-sync] 已同步内容到: ${targetPath}`)
      }
      catch (error) {
        console.error(`[unplugin-agent-sync] 写入文件失败 ${targetPath}:`, error)
      }
    }
  }
  catch (error) {
    console.error(`[unplugin-agent-sync] 同步文件失败:`, error)
  }
  finally {
    // 稍微延迟后重置同步标志
    setTimeout(() => {
      isSyncing = false
    }, SYNC_DELAY)
  }
}

/**
 * 为所有文件设置监听器
 */
function setupFileWatchers(agentFiles: string[]): void {
  const existingFiles: string[] = []

  // 检查所有文件是否存在
  for (const file of agentFiles) {
    const filePath = resolve(process.cwd(), file)
    if (existsSync(filePath)) {
      existingFiles.push(file)
    }
    else {
      console.warn(`[unplugin-agent-sync] 文件不存在: ${filePath}`)
    }
  }

  if (existingFiles.length === 0) {
    console.warn('[unplugin-agent-sync] 没有找到任何存在的文件')
    return
  }

  // 如果只有一个文件，不需要同步
  if (existingFiles.length === 1) {
    console.log(`[unplugin-agent-sync] 只有一个文件 ${existingFiles[0]}，无需同步`)
    return
  }

  console.log(`[unplugin-agent-sync] 开始监听以下文件的同步: ${existingFiles.join(', ')}`)

  // 为每个文件设置监听器
  const watchers: any[] = []
  for (const file of existingFiles) {
    const filePath = resolve(process.cwd(), file)
    const watcher = watch(filePath, { recursive: false }, (eventType) => {
      if (eventType === 'change') {
        syncFileToAll(file, existingFiles)
      }
    })
    watchers.push(watcher)
  }

  // 优雅关闭处理
  process.on('SIGINT', () => {
    watchers.forEach(watcher => watcher.close())
    console.log('[unplugin-agent-sync] 文件监听已停止')
    process.exit(0)
  })
}

export const unpluginFactory: UnpluginFactory<Options | undefined> = (options = {}) => {
  const {
    agentFiles = DEFAULT_AGENT_FILES, // 使用导出的默认同步文件列表
  } = options

  // 设置文件监听（默认开启）
  if (agentFiles.length > 0) {
    setupFileWatchers(agentFiles)
  }

  return {
    name: 'unplugin-agent-sync',
    enforce: 'pre',

    // 提供手动同步方法
    api: {
      syncAll: () => {
        // 如果有多个文件，使用第一个文件的内容同步到其他文件
        if (agentFiles.length > 1) {
          const firstFile = agentFiles[0]
          syncFileToAll(firstFile, agentFiles)
        }
      },
      // 提供获取当前配置的方法
      getConfig: () => ({ agentFiles }),
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
