import {
  createCrawlData,
  createCrawlFile,
  createCrawlHTML,
  createCrawlPage
} from './api'

import { CreateCrawlConfig, CrawlApp, CrawlBaseConfig } from './types'
import { isBoolean, isObject } from '../shared'

let id = 0

function createBaseConfig(config: CreateCrawlConfig): CrawlBaseConfig {
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
  } = config

  const crawlBaseConfig: CrawlBaseConfig = {
    id: ++id,

    mode: mode ?? 'async',
    enableRandomFingerprint: enableRandomFingerprint ?? false,
    timeout: timeout ?? 10000,
    maxRetry: maxRetry ?? 0,
    logOptions: { start: true, process: true, result: true },

    baseUrl,
    intervalTime,
    proxy,
    crawlPage
  }

  // logOptions
  if (isObject(log)) {
    crawlBaseConfig.logOptions = {
      ...crawlBaseConfig.logOptions,
      ...log
    }
  } else if (isBoolean(log) && !log) {
    const keys = Object.keys(crawlBaseConfig.logOptions) as [
      'start',
      'process',
      'result'
    ]

    keys.forEach((key) => (crawlBaseConfig.logOptions[key] = false))
  }

  return crawlBaseConfig
}

function createnApp(crawlBaseConfig: CrawlBaseConfig): CrawlApp {
  const app: CrawlApp = {
    crawlPage: createCrawlPage(crawlBaseConfig),
    crawlHTML: createCrawlHTML(crawlBaseConfig),
    crawlData: createCrawlData(crawlBaseConfig),
    crawlFile: createCrawlFile(crawlBaseConfig)
  }

  return app
}

export function createCrawl(config: CreateCrawlConfig = {}): CrawlApp {
  const crawlBaseConfig = createBaseConfig(config)

  const app = createnApp(crawlBaseConfig)

  return app
}
