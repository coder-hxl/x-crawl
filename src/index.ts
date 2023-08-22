import {
  createCrawlData,
  createCrawlFile,
  createCrawlPage,
  startPolling
} from './api'

import { LoaderXCrawlConfig, XCrawlConfig, XCrawlInstance } from './types'
import { isUndefined } from './utils'

const loaderBaseConfigDefault: LoaderXCrawlConfig = {
  mode: 'async',
  enableRandomFingerprint: true,
  timeout: 10000,
  maxRetry: 0
}

function loaderBaseConfig(
  baseConfig: XCrawlConfig | undefined
): LoaderXCrawlConfig {
  const loaderBaseConfig: any = baseConfig ? baseConfig : {}

  Object.keys(loaderBaseConfigDefault).forEach((key) => {
    if (isUndefined(loaderBaseConfig[key])) {
      loaderBaseConfig[key] =
        loaderBaseConfigDefault[key as keyof LoaderXCrawlConfig]
    }
  })

  return loaderBaseConfig as LoaderXCrawlConfig
}

function createnInstance(baseConfig: LoaderXCrawlConfig): XCrawlInstance {
  const instance: XCrawlInstance = {
    crawlPage: createCrawlPage(baseConfig),
    crawlData: createCrawlData(baseConfig),
    crawlFile: createCrawlFile(baseConfig),
    startPolling
  }

  return instance
}

export default function xCrawl(baseConfig?: XCrawlConfig): XCrawlInstance {
  const newBaseConfig = loaderBaseConfig(baseConfig)

  const instance = createnInstance(newBaseConfig)

  return instance
}
