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

| 参数        | 类型                          | 默认值 | 描述     |
| ----------- | ----------------------------- | ------ | -------- | 
| url         | string                        | -      | url      |
| headers     | Object \\| null   | -        | 请求头 |
| priority    | number                        | -      | 优先级   |
| fingerprint | DetailTargetFingerprintCommon | -      | 设备指纹 |

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

| 参数                | 类型                                                     | 默认值                         | 描述     |
| ------------------- | -------------------------------------------------------- | ------------------------------ | -------- |
| targets             | (string \\| CrawlDataDetailTargetConfig)[] | -        | 目标 |
| intervalTime        | IntervalTime                                             | -                              | 间隔时间 |
| fingerprints        | DetailTargetFingerprintCommon[]                          | -                              | 设备指纹 |
| headers             | Object                                                   | -                              | 请求头   |
| onCrawlItemComplete | ( crawlDataSingleResult: CrawlDataSingleResult ) => void | -                              | 声明周期 |

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
