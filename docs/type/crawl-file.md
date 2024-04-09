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

**default value**

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

**default value**

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
    headers: IncomingHttpHeaders // IncomingHttpHeaders comes from node:http
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

**External type**

- IncomingHttpHeaders: http from nodejs
