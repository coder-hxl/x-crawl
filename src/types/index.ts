import { PuppeteerLaunchOptions } from 'puppeteer'
import {
  StartPollingConfig,
  IntervalTime,
  CrawlPageSingleRes,
  CrawlDataSingleRes,
  CrawlFileSingleRes,
  CrawlFileConfigObject,
  FileRequestConfig,
  DataRequestConfig,
  CrawlDataConfigObject,
  PageRequestConfig,
  CrawlPageConfigObject
} from './api'

export interface XCrawlConfig {
  baseUrl?: string
  timeout?: number
  intervalTime?: IntervalTime
  mode?: 'async' | 'sync'
  proxy?: string
  maxRetry?: number
  crawlPage?: {
    launchBrowser?: PuppeteerLaunchOptions
  }
}

export type LoaderXCrawlConfig = XCrawlConfig & {
  mode: 'async' | 'sync'
  timeout: number
  maxRetry: number
}

export interface XCrawlInstance {
  crawlPage: {
    (
      config: string,
      callback?: (res: CrawlPageSingleRes) => void
    ): Promise<CrawlPageSingleRes>

    (
      config: PageRequestConfig,
      callback?: (res: CrawlPageSingleRes) => void
    ): Promise<CrawlPageSingleRes>

    (
      config: (string | PageRequestConfig)[],
      callback?: (res: CrawlPageSingleRes) => void
    ): Promise<CrawlPageSingleRes[]>

    (
      config: CrawlPageConfigObject,
      callback?: (res: CrawlPageSingleRes) => void
    ): Promise<CrawlPageSingleRes[]>
  }

  crawlData: {
    <T = any>(
      config: DataRequestConfig,
      callback?: (res: CrawlDataSingleRes<T>) => void
    ): Promise<CrawlDataSingleRes<T>>

    <T = any>(
      config: string,
      callback?: (res: CrawlDataSingleRes<T>) => void
    ): Promise<CrawlDataSingleRes<T>>

    <T = any>(
      config: (string | DataRequestConfig)[],
      callback?: (res: CrawlDataSingleRes<T>) => void
    ): Promise<CrawlDataSingleRes<T>[]>

    <T = any>(
      config: CrawlDataConfigObject,
      callback?: (res: CrawlDataSingleRes<T>) => void
    ): Promise<CrawlDataSingleRes<T>[]>
  }

  crawlFile: {
    (
      config: FileRequestConfig,
      callback?: (res: CrawlFileSingleRes) => void
    ): Promise<CrawlFileSingleRes>

    (
      config: FileRequestConfig[],
      callback?: (res: CrawlFileSingleRes) => void
    ): Promise<CrawlFileSingleRes[]>

    (
      config: CrawlFileConfigObject,
      callback?: (res: CrawlFileSingleRes) => void
    ): Promise<CrawlFileSingleRes[]>
  }

  startPolling: (
    config: StartPollingConfig,
    callback: (count: number, stopPolling: () => void) => void
  ) => void
}
