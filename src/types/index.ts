import {
  CrawlFileConfig,
  CrawlPageConfig,
  FileInfo,
  StartPollingConfig,
  IntervalTime,
  CrawlPageRes,
  CrawlRequestCommonRes,
  CrawlDataConfig,
  RequestPageConfig,
  CrawlPageConfigObject,
  CrawlRequestConfig
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
  ) => Promise<
    T extends string[] | RequestPageConfig[] | CrawlPageConfigObject
      ? CrawlPageRes[]
      : CrawlPageRes
  >

  crawlData: <T = any, R extends CrawlRequestConfig = CrawlRequestConfig>(
    config: CrawlDataConfig<R>,
    callback?: ((res: CrawlRequestCommonRes<T>) => void) | undefined
  ) => Promise<
    R extends any[] ? CrawlRequestCommonRes<T>[] : CrawlRequestCommonRes<T>
  >

  crawlFile: <R extends CrawlRequestConfig = CrawlRequestConfig>(
    config: CrawlFileConfig<R>,
    callback?: ((res: CrawlRequestCommonRes<FileInfo>) => void) | undefined
  ) => Promise<
    R extends any[]
      ? CrawlRequestCommonRes<FileInfo>[]
      : CrawlRequestCommonRes<FileInfo>
  >

  startPolling: (
    config: StartPollingConfig,
    callback: (count: number, stopPolling: () => void) => void
  ) => void
}
