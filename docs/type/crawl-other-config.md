#CrawlOtherConfig

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

**default value**

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

**default value**

-ua: undefined

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
  | Protocol.Network.CookieParam // Protocol comes from puppeteer
  | Protocol.Network.CookieParam[] // Protocol comes from puppeteer
```

**External type**

- Protocol: from puppeteer

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

- id: generated according to the order of crawling targets. If there is a priority, it will be generated according to the priority.
- isSuccess: whether the crawling was successful
- maxRetry: The maximum number of retries for this crawling target
- retryCount: the number of times the crawling target has been retried
- proxyDetails: record proxy status
- crawlErrorQueue: Collection of error reports for the crawl target
