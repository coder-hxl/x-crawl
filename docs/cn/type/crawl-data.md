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

| 参数        | 类型                          | 默认值 | 描述       |
| ----------- | ----------------------------- | ------ | ---------- |
| url         | string                        | -      | url        |
| method      | Method                        | `GET`  | 方法       |
| headers     | Object \\| null               | -          | 请求头 |
| params      | IntervalTime                  | -      | Query 参数 |
| data        | any                           | -      | 请求体     |
| priority    | number                        | -      | 优先级     |
| fingerprint | DetailTargetFingerprintCommon | -      | 设备指纹   |

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

| 参数                | 类型                                                     | 默认值                         | 描述     |
| ------------------- | -------------------------------------------------------- | ------------------------------ | -------- | 
| targets             | (string \\| CrawlDataDetailTargetConfig)[] | -        | 目标 |
| intervalTime        | IntervalTime                                             | -                              | 间隔时间 |
| fingerprints        | DetailTargetFingerprintCommon[]                          | -                              | 设备指纹 |
| headers             | Object                                                   | -                              | 请求头   |
| onCrawlItemComplete | ( crawlDataSingleResult: CrawlDataSingleResult ) => void | -                              | 声明周期 |

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
