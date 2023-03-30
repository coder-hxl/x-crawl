import {
  CrawlFileConfig,
  CrawlPageConfig,
  FileInfo,
  StartPollingConfig,
  IntervalTime,
  CrawlPageRes,
  CrawlRequestCommonRes,
  CrawlDataConfig
} from './api'

export interface XCrawlBaseConfig {
  baseUrl?: string
  timeout?: number
  intervalTime?: IntervalTime
  mode?: 'async' | 'sync'
  proxy?: string
  maxRetry?: number
}

export type LoaderXCrawlBaseConfig = XCrawlBaseConfig & {
  mode: 'async' | 'sync'
}

export interface XCrawlInstance {
  crawlPage: <T extends CrawlPageConfig>(
    config: T,
    callback?: ((res: CrawlPageRes) => void) | undefined
  ) => Promise<T extends any[] ? CrawlPageRes[] : CrawlPageRes>

  crawlData: <T = any>(
    config: CrawlDataConfig,
    callback?: ((res: CrawlRequestCommonRes<T>) => void) | undefined
  ) => Promise<CrawlRequestCommonRes<T>[]>

  crawlFile: (
    config: CrawlFileConfig,
    callback?: ((res: CrawlRequestCommonRes<FileInfo>) => void) | undefined
  ) => Promise<CrawlRequestCommonRes<FileInfo>[]>

  startPolling: (
    config: StartPollingConfig,
    callback: (count: number, stopPolling: () => void) => void
  ) => void
}
