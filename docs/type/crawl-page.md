# crawlPage

## CrawlPageDetailTargetConfig

```ts
export interface CrawlPageDetailTargetConfig extends CrawlCommonConfig {
  url: string
  headers?: Object | null
  cookies?: PageCookies | null
  priority?: number
  viewport?: Viewport | null // Viewport comes from puppeteer
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

**default value**

- url: undefined
- headers: undefined
- cookies: undefined
- priority: undefined
- viewport: undefined
- fingerprint: undefined

**External type**

- Viewport: from puppeteer, viewport will be passed directly to page.setViewport to set the page size

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
  viewport?: Viewport // Viewport: from puppeteer

  onCrawlItemComplete?: (crawlPageSingleResult: CrawlPageSingleResult) => void
}
```

**default value**

- targets: undefined
- intervalTime: undefined
- fingerprints: undefined
- headers: undefined
- cookies: undefined
- viewport: undefined
- onCrawlItemComplete: undefined

**External type**

- Viewport: from puppeteer, viewport will be passed directly to page.setViewport to set the page size

## CrawlPageSingleResult

```ts
export interface CrawlPageSingleResult extends CrawlCommonResult {
  data: {
    browser: Browser // Browser comes from puppeteer
    response: HTTPResponse | null // HTTPResponse comes from puppeteer
    page: Page // Page from puppeteer
  }
}
```

**External type**

- Browser: from puppeteer, https://pptr.dev/api/puppeteer.browser
- HTTPResponse: from puppeteer, https://pptr.dev/api/puppeteer.httpresponse
- Page: from puppeteer, https://pptr.dev/api/puppeteer.page
