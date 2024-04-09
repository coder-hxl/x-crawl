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

**默认值**

- url: undefined
- headers: undefined
- cookies: undefined
- priority: undefined
- viewport: undefined
- fingerprint: undefined

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

**默认值**

- targets: undefined
- intervalTime: undefined
- fingerprints: undefined
- headers: undefined
- cookies: undefined
- viewport: undefined
- onCrawlItemComplete: undefined

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
