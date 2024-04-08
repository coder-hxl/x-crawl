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

**默认值**

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

**默认值**

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
    headers: IncomingHttpHeaders // IncomingHttpHeaders 来自于 node:http
    html: string
  } | null
}
```

**外部类型**

- IncomingHttpHeaders：来自于 nodejs 的 http
