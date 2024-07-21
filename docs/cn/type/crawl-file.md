# crawlFile

## CrawlFileDetailTargetConfig

```ts
export interface CrawlFileDetailTargetConfig extends CrawlCommonConfig {
  url: string
  headers?: Object | null
  priority?: number
  storeDir?: string | null
  fileName?: string | null
  extension?: string | null
  fingerprint?: DetailTargetFingerprintCommon | null
}
```

| 参数        | 类型                          | 默认值      | 描述     |
| ----------- | ----------------------------- | ----------- | -------- | 
| url         | string                        | -           | url      |
| headers     | Object \\| null        | -        | 请求头 |
| priority    | number                        | -           | 优先级   |
| storeDir    | string                        | \_\_dirname | 存储位置 |
| fileName    | string                        | -           | 文件名   |
| extension   | string                        | -           | 扩展名   |
| fingerprint | DetailTargetFingerprintCommon | -           | 设备指纹 |

## CrawlFileAdvancedConfig

```ts
export interface CrawlFileAdvancedConfig extends CrawlCommonConfig {
  targets: (string | CrawlFileDetailTargetConfig)[]
  intervalTime?: IntervalTime
  fingerprints?: DetailTargetFingerprintCommon[]
  storeDirs?: string | (string | null)[]
  extensions?: string | (string | null)[]
  fileNames?: (string | null)[]

  headers?: Object

  onCrawlItemComplete?: (crawlFileSingleResult: CrawlFileSingleResult) => void
  onBeforeSaveItemFile?: (info: {
    id: number
    fileName: string
    filePath: string
    data: Buffer
  }) => Promise<Buffer | void> | Buffer | void
}
```

| 参数            | 类型                         | 默认值          | 描述      |
| -------------------- | ------------------ | ------------------- | --------- |
| targets              | (string \\| CrawlDataDetailTargetConfig)[] | -         | 目标        |
| intervalTime         | IntervalTime                                                                                  | -                              | 间隔时间  |
| fingerprints         | DetailTargetFingerprintCommon[]                                                               | -                              | 设备指纹  |
| storeDirs            | string \\| (string \\| null)[]   | \_\_dirname | 存储位置 |
| extension            | string \\| (string \\| null)[]   | -           | 扩展名   |
| fileName             | (string \\| null)[]                        | -         | 文件名      |
| headers              | Object | -                              | 请求头    |
| onCrawlItemComplete  | ( crawlDataSingleResult: CrawlDataSingleResult ) => void | - | 声明周期  |
| onBeforeSaveItemFile | (info: { id: number; fileName: string; filePath: string; data: Buffer }) => Promise<Buffer \\| void> \\| Buffer \\| void | - | 声明周期 |

## CrawlFileSingleResult

```ts
export interface CrawlFileSingleResult extends CrawlCommonResult {
  data: {
    statusCode: number | undefined
    headers: IncomingHttpHeaders // IncomingHttpHeaders 来自于 node:http
    data: {
      isSuccess: boolean
      fileName: string
      fileExtension: string
      mimeType: string
      size: number
      filePath: string
    }
  } | null
}
```

**外部类型**

- IncomingHttpHeaders：来自于 nodejs 的 http
