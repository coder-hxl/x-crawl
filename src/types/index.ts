import { PuppeteerLaunchOptions } from 'puppeteer'
import {
  StartPollingConfig,
  IntervalTime,
  CrawlPageSingleRes,
  CrawlDataSingleRes,
  CrawlFileSingleRes,
  CrawlFileEnhanceConfig,
  CrawlFileDetailConfig,
  CrawlDataDetailConfig,
  CrawlDataEnhanceConfig,
  CrawlPageDetailConfig,
  CrawlPageEnhanceConfig,
  CrawlCommonConfig
} from './api'

export interface XCrawlConfig extends CrawlCommonConfig {
  baseUrl?: string
  intervalTime?: IntervalTime
  mode?: 'async' | 'sync'
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
      config: CrawlPageDetailConfig,
      callback?: (res: CrawlPageSingleRes) => void
    ): Promise<CrawlPageSingleRes>

    (
      config: (string | CrawlPageDetailConfig)[],
      callback?: (res: CrawlPageSingleRes) => void
    ): Promise<CrawlPageSingleRes[]>

    (
      config: CrawlPageEnhanceConfig,
      callback?: (res: CrawlPageSingleRes) => void
    ): Promise<CrawlPageSingleRes[]>
  }

  crawlData: {
    <T = any>(
      config: CrawlDataDetailConfig,
      callback?: (res: CrawlDataSingleRes<T>) => void
    ): Promise<CrawlDataSingleRes<T>>

    <T = any>(
      config: string,
      callback?: (res: CrawlDataSingleRes<T>) => void
    ): Promise<CrawlDataSingleRes<T>>

    <T = any>(
      config: (string | CrawlDataDetailConfig)[],
      callback?: (res: CrawlDataSingleRes<T>) => void
    ): Promise<CrawlDataSingleRes<T>[]>

    <T = any>(
      config: CrawlDataEnhanceConfig,
      callback?: (res: CrawlDataSingleRes<T>) => void
    ): Promise<CrawlDataSingleRes<T>[]>
  }

  crawlFile: {
    (
      config: CrawlFileDetailConfig,
      callback?: (res: CrawlFileSingleRes) => void
    ): Promise<CrawlFileSingleRes>

    (
      config: CrawlFileDetailConfig[],
      callback?: (res: CrawlFileSingleRes) => void
    ): Promise<CrawlFileSingleRes[]>

    (
      config: CrawlFileEnhanceConfig,
      callback?: (res: CrawlFileSingleRes) => void
    ): Promise<CrawlFileSingleRes[]>
  }

  startPolling: (
    config: StartPollingConfig,
    callback: (count: number, stopPolling: () => void) => void
  ) => void
}
