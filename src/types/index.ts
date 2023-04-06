import {
  CrawlFileConfig,
  CrawlPageConfig,
  StartPollingConfig,
  IntervalTime,
  CrawlPageRes,
  CrawlDataConfig,
  CrawlPageSingleRes,
  CrawlDataRes,
  CrawlDataSingleRes,
  CrawlFileSingleRes,
  CrawlFileRes
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
  timeout: number
  maxRetry: number
}

export interface XCrawlInstance {
  crawlPage: <T extends CrawlPageConfig>(
    config: T,
    callback?: ((res: CrawlPageSingleRes) => void) | undefined
  ) => Promise<CrawlPageRes<T>>

  crawlData: <D = any, T extends CrawlDataConfig = CrawlDataConfig>(
    config: T,
    callback?: ((res: CrawlDataSingleRes<D>) => void) | undefined
  ) => Promise<CrawlDataRes<D, T>>

  crawlFile: <T extends CrawlFileConfig>(
    config: T,
    callback?: ((res: CrawlFileSingleRes) => void) | undefined
  ) => Promise<CrawlFileRes<T>>

  startPolling: (
    config: StartPollingConfig,
    callback: (count: number, stopPolling: () => void) => void
  ) => void
}
