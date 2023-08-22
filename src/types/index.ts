import { PuppeteerLaunchOptions } from 'puppeteer'
import {
  StartPollingConfig,
  IntervalTime,
  CrawlPageSingleResult,
  CrawlDataSingleResult,
  CrawlFileSingleResult,
  CrawlFileAdvancedConfig,
  CrawlFileDetailTargetConfig,
  CrawlDataDetailTargetConfig,
  CrawlDataAdvancedConfig,
  CrawlPageDetailTargetConfig,
  CrawlPageAdvancedConfig,
  CrawlCommonConfig
} from './api'

export interface XCrawlConfig extends CrawlCommonConfig {
  mode?: 'async' | 'sync'
  enableRandomFingerprint?: boolean
  baseUrl?: string
  intervalTime?: IntervalTime
  crawlPage?: {
    puppeteerLaunch?: PuppeteerLaunchOptions
  }
}

export type LoaderXCrawlConfig = XCrawlConfig & {
  mode: 'async' | 'sync'
  enableRandomFingerprint: boolean
  timeout: number
  maxRetry: number
}

export interface XCrawlInstance {
  crawlPage: {
    (
      config: string,
      callback?: (result: CrawlPageSingleResult) => void
    ): Promise<CrawlPageSingleResult>

    (
      config: CrawlPageDetailTargetConfig,
      callback?: (result: CrawlPageSingleResult) => void
    ): Promise<CrawlPageSingleResult>

    (
      config: (string | CrawlPageDetailTargetConfig)[],
      callback?: (result: CrawlPageSingleResult[]) => void
    ): Promise<CrawlPageSingleResult[]>

    (
      config: CrawlPageAdvancedConfig,
      callback?: (result: CrawlPageSingleResult[]) => void
    ): Promise<CrawlPageSingleResult[]>
  }

  crawlData: {
    <T = any>(
      config: CrawlDataDetailTargetConfig,
      callback?: (result: CrawlDataSingleResult<T>) => void
    ): Promise<CrawlDataSingleResult<T>>

    <T = any>(
      config: string,
      callback?: (result: CrawlDataSingleResult<T>) => void
    ): Promise<CrawlDataSingleResult<T>>

    <T = any>(
      config: (string | CrawlDataDetailTargetConfig)[],
      callback?: (result: CrawlDataSingleResult<T>[]) => void
    ): Promise<CrawlDataSingleResult<T>[]>

    <T = any>(
      config: CrawlDataAdvancedConfig<T>,
      callback?: (result: CrawlDataSingleResult<T>[]) => void
    ): Promise<CrawlDataSingleResult<T>[]>
  }

  crawlFile: {
    (
      config: CrawlFileDetailTargetConfig,
      callback?: (result: CrawlFileSingleResult) => void
    ): Promise<CrawlFileSingleResult>

    (
      config: CrawlFileDetailTargetConfig[],
      callback?: (result: CrawlFileSingleResult[]) => void
    ): Promise<CrawlFileSingleResult[]>

    (
      config: CrawlFileAdvancedConfig,
      callback?: (result: CrawlFileSingleResult[]) => void
    ): Promise<CrawlFileSingleResult[]>
  }

  startPolling: (
    config: StartPollingConfig,
    callback: (count: number, stopPolling: () => void) => void
  ) => void
}
