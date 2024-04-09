# crawlHTML

## CrawlHTMLDetailTargetConfig

```ts
export interface CrawlHTMLDetailTargetConfig extends CrawlCommonConfig {
  url: string
  headers?: Object | null
  priority?: number
  fingerprint?: DetailTargetFingerprintCommon | null
}
```

**default value**

- url: undefined
- headers: undefined
- priority: undefined
- fingerprint: undefined

## CrawlHTMLAdvancedConfig

```ts
export interface CrawlHTMLAdvancedConfig extends CrawlCommonConfig {
  targets: (string | CrawlHTMLDetailTargetConfig)[]
  intervalTime?: IntervalTime
  fingerprints?: DetailTargetFingerprintCommon[]

  headers?: Object

  onCrawlItemComplete?: (crawlDataSingleResult: CrawlHTMLSingleResult) => void
}
```

**default value**

- targets: undefined
- intervalTime: undefined
- fingerprints: undefined
- headers: undefined
- onCrawlItemComplete: undefined

## CrawlHTMLSingleResult

```ts
export interface CrawlHTMLSingleResult extends CrawlCommonResult {
  data: {
    statusCode: number | undefined
    headers: IncomingHttpHeaders // IncomingHttpHeaders comes from node:http
    html: string
  } | null
}
```

**External type**

- IncomingHttpHeaders: http from nodejs
