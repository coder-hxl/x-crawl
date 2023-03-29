import {
  CrawlResCommonV1,
  CrawlResCommonArrV1,
  CrawlDataConfig,
  CrawlFileConfig,
  CrawlPage,
  CrawlPageConfig,
  FileInfo,
  StartPollingConfig,
  IntervalTime,
  CrawlBaseConfigV1
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
  maxRetry: number
}

export interface XCrawlInstance {
  crawlPage: <T extends CrawlPageConfig = CrawlPageConfig>(
    config: T,
    callback?: (res: CrawlPage) => void
  ) => Promise<
    T extends string[] | CrawlBaseConfigV1[] ? CrawlPage[] : CrawlPage
  >

  crawlData: <T = any>(
    config: CrawlDataConfig,
    callback?: (res: CrawlResCommonV1<T>) => void
  ) => Promise<CrawlResCommonArrV1<T>>

  crawlFile: (
    config: CrawlFileConfig,
    callback?: (res: CrawlResCommonV1<FileInfo>) => void
  ) => Promise<CrawlResCommonArrV1<FileInfo>>

  startPolling: (
    config: StartPollingConfig,
    callback: (count: number, stopPolling: () => void) => void
  ) => void
}
