# createCrawl

## CreateCrawlConfig

```ts
export interface CreateCrawlConfig extends CrawlCommonConfig {
  mode?: 'async' | 'sync'
  enableRandomFingerprint?: boolean
  baseUrl?: string
  intervalTime?: IntervalTime
  log?: LogOptions | boolean
  crawlPage?: {
    puppeteerLaunchOptions?: PuppeteerLaunchOptions
  }
}
```

| 参数 | 类型 | 默认值  | 描述 |
| -- | -- | -- | --  |
| mode                    | `async` \\| `sync`  | `async`                                  | 设置爬取模式 |
| enableRandomFingerprint | boolean                                         | false   | 是否启动随机设备指纹                     |
| baseUrl                 | string                                          | -       | 基础地址                                 |
| intervalTime            | IntervalTime                                    | -       | 间隔时间                                 |
| log                     | { start: true; process: true; result: true } \\| boolean | true                                     | 打印日志     |
| crawlPage               | PuppeteerLaunchOptions                          | -       | 传给 puppeteer.launch 用于创建浏览器实例 |

**外部类型**

- PuppeteerLaunchOptions：来自于 puppeteer ，crawlPage.puppeteerLaunchOptions 会直接传给 puppeteer.launch 用于创建浏览器实例

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
