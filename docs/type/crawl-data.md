# crawlData

## CrawlDataDetailTargetConfig

```ts
export interface CrawlDataDetailTargetConfig extends CrawlCommonConfig {
  url: string
  method?: Method
  headers?: Object | null
  params?: Object
  data?: any
  priority?: number
  fingerprint?: DetailTargetFingerprintCommon | null
}
```

**default value**

- url: undefined
- method: 'GET'
- headers: undefined
- params: undefined
- data: undefined
- priority: undefined
- fingerprint: undefined

## CrawlDataAdvancedConfig

```ts
export interface CrawlDataAdvancedConfig<T> extends CrawlCommonConfig {
  targets: (string | CrawlDataDetailTargetConfig)[]
  intervalTime?: IntervalTime
  fingerprints?: DetailTargetFingerprintCommon[]

  headers?: Object

  onCrawlItemComplete?: (
    crawlDataSingleResult: CrawlDataSingleResult<T>
  ) => void
}
```

**default value**

- targets: undefined
- intervalTime: undefined
- fingerprints: undefined
- headers: undefined
- onCrawlItemComplete: undefined

## CrawlDataSingleResult

```ts
export interface CrawlDataSingleResult<D> extends CrawlCommonResult {
  data: {
    statusCode: number | undefined
    headers: IncomingHttpHeaders // IncomingHttpHeaders comes from node:http
    data: D
  } | null
}
```

**External type**

- IncomingHttpHeaders: http from nodejs
