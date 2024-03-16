import {
  createCrawlData,
  createCrawlFile,
  createCrawlHTML,
  createCrawlPage,
  createStartPolling
} from './api'

import { XCrawlConfig, XCrawlInstance, XCrawlInstanceConfig } from './types'
import { isBoolean, isObject } from './utils'

let id = 0

function createInstanceConfig(
  config: XCrawlConfig | undefined
): XCrawlInstanceConfig {
  const {
    mode,
    enableRandomFingerprint,
    baseUrl,
    intervalTime,
    log,
    crawlPage,
    timeout,
    proxy,
    maxRetry
  } = config ?? {}

  const xCrawlInstanceConfig: XCrawlInstanceConfig = {
    id: ++id,

    mode: mode ?? 'async',
    enableRandomFingerprint: enableRandomFingerprint ?? false,
    timeout: timeout ?? 10000,
    maxRetry: maxRetry ?? 0,
    logConfig: { start: true, process: true, result: true },

    baseUrl,
    intervalTime,
    proxy,
    crawlPage
  }

  // logConfig
  if (isObject(log)) {
    xCrawlInstanceConfig.logConfig = {
      ...xCrawlInstanceConfig.logConfig,
      ...log
    }
  } else if (isBoolean(log) && !log) {
    const keys = Object.keys(xCrawlInstanceConfig.logConfig) as [
      'start',
      'process',
      'result'
    ]

    keys.forEach((key) => (xCrawlInstanceConfig.logConfig[key] = false))
  }

  return xCrawlInstanceConfig
}

function createnInstance(
  xCrawlInstanceConfig: XCrawlInstanceConfig
): XCrawlInstance {
  const instance: XCrawlInstance = {
    crawlPage: createCrawlPage(xCrawlInstanceConfig),
    crawlHTML: createCrawlHTML(xCrawlInstanceConfig),
    crawlData: createCrawlData(xCrawlInstanceConfig),
    crawlFile: createCrawlFile(xCrawlInstanceConfig),
    startPolling: createStartPolling(xCrawlInstanceConfig)
  }

  return instance
}

export default function xCrawl(config?: XCrawlConfig): XCrawlInstance {
  const xCrawlInstanceConfig = createInstanceConfig(config)

  const instance = createnInstance(xCrawlInstanceConfig)

  return instance
}
