# CrawlOtherConfig

## CrawlCommonConfig

```ts
export interface CrawlCommonConfig {
  timeout?: number | null
  proxy?: {
    urls: string[]
    switchByHttpStatus?: number[]
    switchByErrorCount?: number
  } | null
  maxRetry?: number | null
}
```

**默认值**

- timeout: 10000
- proxy: undefined
- maxRetry: 0

## DetailTargetFingerprintCommon

```ts
export interface DetailTargetFingerprintCommon {
  ua?: string
  mobile?: '?0' | '?1' | 'random'
  platform?: Platform
  platformVersion?: string
  acceptLanguage?: string
  userAgent?: {
    value: string
    versions?: {
      name: string
      maxMajorVersion?: number
      minMajorVersion?: number
      maxMinorVersion?: number
      minMinorVersion?: number
      maxPatchVersion?: number
      minPatchVersion?: number
    }[]
  }
}
```

**默认值**

- ua: undefined
- mobile: undefined
- platform: undefined
- platformVersion: undefined
- acceptLanguage: undefined
- userAgent: undefined

## Mobile

```ts
export type Mobile = '?0' | '?1'
```

## Platform

```ts
export type Platform =
  | 'Android'
  | 'Chrome OS'
  | 'Chromium OS'
  | 'iOS'
  | 'Linux'
  | 'macOS'
  | 'Windows'
  | 'Unknown'
```

## PageCookies

```ts
export type PageCookies =
  | string
  | Protocol.Network.CookieParam // Protocol 来自于 puppeteer
  | Protocol.Network.CookieParam[] // Protocol 来自于 puppeteer
```

**外部类型**

- Protocol：来自于 puppeteer

## Method

```ts
export type Method =
  | 'get'
  | 'GET'
  | 'delete'
  | 'DELETE'
  | 'head'
  | 'HEAD'
  | 'options'
  | 'OPTIONS'
  | 'post'
  | 'POST'
  | 'put'
  | 'PUT'
  | 'patch'
  | 'PATCH'
  | 'purge'
  | 'PURGE'
  | 'link'
  | 'LINK'
  | 'unlink'
  | 'UNLINK'
```

## IntervalTime

```ts
export type IntervalTime = number | { max: number; min?: number }
```

## CrawlCommonResult

```ts
export interface CrawlCommonResult {
  id: number
  isSuccess: boolean
  maxRetry: number
  retryCount: number
  proxyDetails: ProxyDetails
  crawlErrorQueue: Error[]
}
```

- id：根据爬取目标的顺序生成的，如果有优先级，则会根据优先级生成
- isSuccess：是否成功爬取
- maxRetry：该次爬取目标的最大重试次数
- retryCount：该次爬取目标已经重试的次数
- proxyDetails：记录代理情况
- crawlErrorQueue：该次爬取目标的报错收集
