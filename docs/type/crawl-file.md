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

**默认值**

- url: undefined
- headers: undefined
- priority: undefined
- storeDir: \_\_dirname
- fileName: string
- extension: string
- fingerprint: undefined

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

**默认值**

- targets: undefined
- intervalTime: undefined
- fingerprints: undefined
- storeDirs: \_\_dirname
- extensions: string
- fileNames: undefined
- headers: undefined
- onCrawlItemComplete: undefined
- onBeforeSaveItemFile: undefined

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
