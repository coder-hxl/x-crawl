import {
  CrawlResCommonV1,
  CrawlResCommonArrV1,
  CrawlDataConfig,
  CrawlFileConfig,
  CrawlPage,
  CrawlPageConfig,
  FileInfo,
  StartPollingConfig,
  IntervalTime
} from './api'

export interface XCrawlBaseConfig {
  baseUrl?: string
  timeout?: number
  intervalTime?: IntervalTime
  mode?: 'async' | 'sync'
  proxy?: string
}

export type LoaderXCrawlBaseConfig = XCrawlBaseConfig & {
  mode: 'async' | 'sync'
}

export interface XCrawlInstance {
  crawlPage: (
    config: CrawlPageConfig,
    callback?: (res: CrawlPage) => void
  ) => Promise<CrawlPage>

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
