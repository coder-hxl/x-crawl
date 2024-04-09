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

**默认值**

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

**默认值**

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
    headers: IncomingHttpHeaders // IncomingHttpHeaders 来自于 node:http
    data: D
  } | null
}
```

**外部类型**

- IncomingHttpHeaders：来自于 nodejs 的 http
