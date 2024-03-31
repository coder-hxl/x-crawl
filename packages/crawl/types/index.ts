import { PuppeteerLaunchOptions } from 'puppeteer'
import {
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
  CrawlCommonConfig,
  CrawlHTMLSingleResult,
  CrawlHTMLDetailTargetConfig,
  CrawlHTMLAdvancedConfig
} from './api'
import { MapTypeEmptyObject } from './common'

export interface LogOptions {
  start: boolean
  process: boolean
  result: boolean
}

export interface CreateCrawlConfig extends CrawlCommonConfig {
  mode?: 'async' | 'sync'
  enableRandomFingerprint?: boolean
  baseUrl?: string
  intervalTime?: IntervalTime
  log?: MapTypeEmptyObject<LogOptions> | boolean
  crawlPage?: {
    puppeteerLaunchOptions?: PuppeteerLaunchOptions
  }
}

export interface CrawlBaseConfig
  extends MapTypeEmptyObject<CreateCrawlConfig, 'log'> {
  id: number

  mode: 'async' | 'sync'
  enableRandomFingerprint: boolean
  timeout: number
  maxRetry: number
  logOptions: LogOptions
}

export interface CrawlApp {
  crawlPage: {
    (config: string): Promise<CrawlPageSingleResult>

    (config: CrawlPageDetailTargetConfig): Promise<CrawlPageSingleResult>

    (
      config: (string | CrawlPageDetailTargetConfig)[]
    ): Promise<CrawlPageSingleResult[]>

    (config: CrawlPageAdvancedConfig): Promise<CrawlPageSingleResult[]>
  }

  crawlHTML: {
    (config: string): Promise<CrawlHTMLSingleResult>

    (config: CrawlHTMLDetailTargetConfig): Promise<CrawlHTMLSingleResult>

    (
      config: (string | CrawlHTMLDetailTargetConfig)[]
    ): Promise<CrawlHTMLSingleResult[]>

    (config: CrawlHTMLAdvancedConfig): Promise<CrawlHTMLSingleResult[]>
  }

  crawlData: {
    <T = any>(config: string): Promise<CrawlDataSingleResult<T>>

    <T = any>(
      config: CrawlDataDetailTargetConfig
    ): Promise<CrawlDataSingleResult<T>>

    <T = any>(
      config: (string | CrawlDataDetailTargetConfig)[]
    ): Promise<CrawlDataSingleResult<T>[]>

    <T = any>(
      config: CrawlDataAdvancedConfig<T>
    ): Promise<CrawlDataSingleResult<T>[]>
  }

  crawlFile: {
    (config: CrawlFileDetailTargetConfig): Promise<CrawlFileSingleResult>

    (config: CrawlFileDetailTargetConfig[]): Promise<CrawlFileSingleResult[]>

    (config: CrawlFileAdvancedConfig): Promise<CrawlFileSingleResult[]>
  }
}
