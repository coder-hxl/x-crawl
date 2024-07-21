# crawlPage

## CrawlPageDetailTargetConfig

```ts
export interface CrawlPageDetailTargetConfig extends CrawlCommonConfig {
  url: string
  headers?: Object | null
  cookies?: PageCookies | null
  priority?: number
  viewport?: Viewport | null // Viewport 来自于 puppeteer
  fingerprint?:
    | (DetailTargetFingerprintCommon & {
        maxWidth?: number
        minWidth?: number
        maxHeight?: number
        minHidth?: number
      })
    | null
}
```

| 参数        | 类型 | 默认值 | 描述         |
| ----------- |  ---  | ------ | ------------ |
| url         | string | -      | url          |
| headers     | Object \\| null   | -            | 请求头  |
| cookies     | PageCookies \\| null   | - | cookies |
| priority    | number | -      | 优先级       | 
| viewport    | Viewport | -      | 设置视口大小 |
| fingerprint | DetailTargetFingerprintCommon & { maxWidth?: number; minWidth?: number; maxHeight?: number; minHidth?: number }) | - | 设备指纹     |

**外部类型**

- Viewport：来自于 puppeteer ，viewport 会直接传给 page.setViewport 用于设置页面大小

## CrawlPageAdvancedConfig

```ts
export interface CrawlPageAdvancedConfig extends CrawlCommonConfig {
  targets: (string | CrawlPageDetailTargetConfig)[]
  intervalTime?: IntervalTime
  fingerprints?: (DetailTargetFingerprintCommon & {
    maxWidth?: number
    minWidth?: number
    maxHeight?: number
    minHidth?: number
  })[]

  headers?: Object
  cookies?: PageCookies
  viewport?: Viewport // Viewport：来自于 puppeteer

  onCrawlItemComplete?: (crawlPageSingleResult: CrawlPageSingleResult) => void
}
```

| 参数                | 类型                                                     | 默认值                         | 描述         |
| ------------------- | -------------------------------------------------------- | ------------------------------ | ------------ |
| targets             | (string \\| CrawlDataDetailTargetConfig)[] | -            | 目标    |
| intervalTime        | IntervalTime                                             | -                              | 间隔时间     |
| fingerprints        | DetailTargetFingerprintCommon[]                          | -                              | 设备指纹     |
| headers             | Object                                                   | -                              | 请求头       |
| cookies             | PageCookies                                              | null                           | -            | cookies |
| viewport            | Viewport                                                 | -                              | 设置视口大小 |
| onCrawlItemComplete | ( crawlDataSingleResult: CrawlDataSingleResult ) => void | -                              | 声明周期     |

**外部类型**

- Viewport：来自于 puppeteer ，viewport 会直接传给 page.setViewport 用于设置页面大小

## CrawlPageSingleResult

```ts
export interface CrawlPageSingleResult extends CrawlCommonResult {
  data: {
    browser: Browser // Browser 来自于 puppeteer
    response: HTTPResponse | null // HTTPResponse 来自于 puppeteer
    page: Page // Page 自来于 puppeteer
  }
}
```

**外部类型**

- Browser：来自于 puppeteer ，https://pptr.dev/api/puppeteer.browser
- HTTPResponse：来自于 puppeteer ，https://pptr.dev/api/puppeteer.httpresponse
- Page：来自于 puppeteer ，https://pptr.dev/api/puppeteer.page
