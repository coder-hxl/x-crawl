#createCrawl

## CreateCrawlConfig

```ts
export interface CreateCrawlConfig extends CrawlCommonConfig {
  mode?: 'async' | 'sync'
  enableRandomFingerprint?: boolean
  baseUrl?: string
  intervalTime?: IntervalTime
  log?:
    | {
        start?: boolean
        process?: boolean
        result?: boolean
      }
    | boolean
  crawlPage?: {
    puppeteerLaunchOptions?: PuppeteerLaunchOptions // PuppeteerLaunchOptions comes from puppeteer
  }
}
```

**default value**

- mode: 'async'
- enableRandomFingerprint: false
- baseUrl: undefined
- intervalTime: undefined
- log: { start: true, process: true, result: true }
- crawlPage: undefined

**External type**

- PuppeteerLaunchOptions: from puppeteer, crawlPage.puppeteerLaunchOptions will be passed directly to puppeteer.launch for creating browser instances

## CrawlApp

```ts
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
    (config: string): Promise<CrawlFileSingleResult>

    (config: CrawlFileDetailTargetConfig): Promise<CrawlFileSingleResult>

    (
      config: (string | CrawlFileDetailTargetConfig)[]
    ): Promise<CrawlFileSingleResult[]>

    (config: CrawlFileAdvancedConfig): Promise<CrawlFileSingleResult[]>
  }
}
```
