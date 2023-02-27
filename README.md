# x-crawl

English | [简体中文](https://github.com/coder-hxl/x-crawl/blob/main/docs/cn.md)

x-crawl is a Nodejs multifunctional crawler library. 

## Feature

- Crawl HTML, JSON, file resources, etc. with simple configuration
- Use puppeteer to crawl HTML, and use JSDOM library to parse HTML, or parse HTML by yourself
- Support asynchronous/synchronous way to crawl data
- Support Promise/Callback way to get the result
- Polling function
- Anthropomorphic request interval
- Written in TypeScript, provides generics

# Table of Contents

- [Install](#Install)
- [Example](#Example)
- [Core concepts](#Core-concepts)
    * [x-crawl](#x-crawl-2)
       + [Type](#Type-1)
       + [Example](#Example-1)
       + [Mode](#Mode)
       + [IntervalTime](#IntervalTime)
    * [fetchHTML](#fetchHTML)
       + [Type](#Type-2)
       + [Example](#Example-2)
    * [fetchData](#fetchData)
       + [Type](#Type-3)
       + [Example](#Example-3)
    * [fetchFile](#fetchFile)
       + [Type](#Type-4)
       + [Example](#Example-4)
    * [fetchPolling](#fetchPolling)
       + [Type](#Type-5)
       + [Example](#Example-5)
- [Types](#Types)
    * [AnyObject](#AnyObject)
    * [Method](#Method)
    * [RequestConfig](#RequestConfig)
    * [IntervalTime](#IntervalTime)
    * [FetchBaseConifg](#FetchBaseConifg)
    * [XCrawlBaseConifg](#XCrawlBaseConifg)
    * [FetchHTMLConfig](#FetchHTMLConfig	)
    * [FetchDataConfig](#FetchDataConfig)   
    * [FetchFileConfig](#FetchFileConfig)
    * [StartPollingConfig](#StartPollingConfig)
    * [FetchCommon](#FetchCommon)
    * [FetchCommonArr](#FetchCommonArr)
    * [FileInfo](#FileInfo)
    * [FetchHTML](#FetchHTML)
- [More](#More)

## Install

Take NPM as an example:

```shell
npm install x-crawl
```

## Example

Get the title of https://docs.github.com/zh/get-started as an example:

```js
// Import module ES/CJS
import xCrawl from 'x-crawl'

// Create a crawler instance
const docsXCrawl = xCrawl({
  baseUrl: 'https://docs.github.com',
  timeout: 10000,
  intervalTime: { max: 2000, min: 1000 }
})

// Call fetchHTML API to crawl
docsXCrawl.fetchHTML('/zh/get-started').then((res) => {
  const { jsdom } = res.data
  console.log(jsdom.window.document.querySelector('title')?.textContent)
})
```

## Core concepts

### x-crawl

Create a crawler instance via call xCrawl. The request queue is maintained by the instance method itself, not by the instance itself.

#### Type

For more detailed types, please see the [Types](#Types) section

```ts
function xCrawl(baseConfig?: XCrawlBaseConifg): XCrawlInstance
```

#### Example

```js
const myXCrawl = xCrawl({
  baseUrl: 'https://xxx.com',
  timeout: 10000,
  // The interval between requests, multiple requests are valid
  intervalTime: {
    max: 2000,
    min: 1000
  }
})
```

Passing **baseConfig** is for **fetchHTML/fetchData/fetchFile** to use these values by default.

**Note:** To avoid repeated creation of instances in subsequent examples, **myXCrawl** here will be the crawler instance in the **fetchHTML/fetchData/fetchFile** example.

#### Mode 

The mode option defaults to async .

- async: In batch requests, the next request is made without waiting for the current request to complete
- sync: In batch requests, you need to wait for this request to complete before making the next request

If there is an interval time set, it is necessary to wait for the interval time to end before sending the request.

#### IntervalTime 

The intervalTime option defaults to undefined . If there is a setting value, it will wait for a period of time before requesting, which can prevent too much concurrency and avoid too much pressure on the server.

- number: The time that must wait before each request is fixed
- Object: Randomly select a value from max and min, which is more anthropomorphic

The first request is not to trigger the interval.

### fetchHTML

fetchHTML is the method of the above [myXCrawl](https://github.com/coder-hxl/x-crawl#Example-1) instance, usually used to crawl HTML.

#### Type

- Look at the [FetchHTMLConfig](#FetchHTMLConfig) type
- Look at the [FetchHTML](#FetchHTML) type

```ts
function fetchHTML: (
  config: FetchHTMLConfig,
  callback?: (res: FetchHTML) => void
) => Promise<FetchHTML>
```

#### Example

```js
myXCrawl.fetchHTML('/xxx').then((res) => {
  const { jsdom } = res.data
  console.log(jsdom.window.document.querySelector('title')?.textContent)
})
```

### fetchData

fetchData is the method of the above [myXCrawl](#Example-1) instance, which is usually used to crawl APIs to obtain JSON data and so on.

#### Type

- Look at the [FetchDataConfig](#FetchDataConfig) type
- Look at the [FetchResCommonV1](#FetchResCommonV1) type
- Look at the [FetchResCommonArrV1](#FetchResCommonArrV1) type

```ts
function fetchData: <T = any>(
  config: FetchDataConfig,
  callback?: (res: FetchResCommonV1<T>) => void
) => Promise<FetchResCommonArrV1<T>>
```

#### Example

```js
const requestConifg = [
  { url: '/xxxx', method: 'GET' },
  { url: '/xxxx', method: 'GET' },
  { url: '/xxxx', method: 'GET' }
]

myXCrawl.fetchData({ 
  requestConifg, // Request configuration, can be RequestConfig | RequestConfig[]
  intervalTime: { max: 5000, min: 1000 } // The intervalTime passed in when not using myXCrawl
}).then(res => {
  console.log(res)
})
```

### fetchFile

fetchFile is the method of the above [myXCrawl](#Example-1) instance, which is usually used to crawl files, such as pictures, pdf files, etc.

#### Type

- Look at the [FetchFileConfig](#FetchFileConfig) type
- Look at the [FetchResCommonV1](#FetchResCommonV1) type
- Look at the [FetchResCommonArrV1](#FetchResCommonArrV1) type
- Look at the [FileInfo](#FileInfo) type

```ts
function fetchFile: (
  config: FetchFileConfig,
  callback?: (res: FetchResCommonV1<FileInfo>) => void
) => Promise<FetchResCommonArrV1<FileInfo>>
```

#### Example

```js
const requestConifg = [
  { url: '/xxxx' },
  { url: '/xxxx' },
  { url: '/xxxx' }
]

myXCrawl.fetchFile({
  requestConifg,
  fileConfig: {
    storeDir: path.resolve(__dirname, './upload') // storage folder
  }
}).then(fileInfos => {
  console.log(fileInfos)
})
```

### startPolling

fetchPolling is a method of the [myXCrawl](#Example-1) instance, typically used to perform polling operations, such as getting news every once in a while.

#### Type

- Look at the [StartPollingConfig](#StartPollingConfig) type

```ts
function startPolling(
  config: StartPollingConfig,
  callback: (count: number) => void
): void
```

#### Example

```js
myXCrawl.startPolling({ h: 1, m: 30 }, () => {
  // will be executed every one and a half hours
  // fetchHTML/fetchData/fetchFile
})
```

## Types

### AnyObject

```ts
interface AnyObject extends Object {
  [key: string | number | symbol]: any
}
```

### Method

```ts
type Method = 'get' | 'GET' | 'delete' | 'DELETE' | 'head' | 'HEAD' | 'options' | 'OPTONS' | 'post' | 'POST' | 'put' | 'PUT' | 'patch' | 'PATCH' | 'purge' | 'PURGE' | 'link' | 'LINK' | 'unlink' | 'UNLINK'
```

### RequestConfig

```ts 
interface RequestConfig {
  url: string
  method?: Method
  headers?: AnyObject
  params?: AnyObject
  data?: any
  timeout?: number
  proxy?: string
}
```

### IntervalTime

```ts
type IntervalTime = number | {
  max: number
  min?: number
}
```

### XCrawlBaseConifg

```ts
interface XCrawlBaseConifg {
  baseUrl?: string
  timeout?: number
  intervalTime?: IntervalTime
  mode?: 'async' | 'sync'
  proxy?: string
}
```

### FetchBaseConifgV1

```ts
interface FetchBaseConifgV1 {
  requestConifg: RequestConfig | RequestConfig[]
  intervalTime?: IntervalTime
}
```

### FetchBaseConifgV2

```ts
interface FetchBaseConifgV2 {
  url: string
  header?: AnyObject
  timeout?: number
  proxy?: string
}
```

### FetchHTMLConfig

```ts
type FetchHTMLConfig = string | FetchBaseConifgV2
```

### FetchDataConfig

```ts
interface FetchDataConfig extends FetchBaseConifgV1 {
}
```

### FetchFileConfig

```ts
interface FetchFileConfig extends FetchBaseConifgV1 {
  fileConfig: {
    storeDir: string // Store folder
    extension?: string // filename extension
  }
}
```

### StartPollingConfig

```ts
interface StartPollingConfig {
  d?: number // day
  h?: number // hour
  m?: number // minute
}
```

### FetchResCommonV1

```ts
interface FetchCommon<T> {
  id: number
  statusCode: number | undefined
  headers: IncomingHttpHeaders // node: http type
  data: T
}
```

### FetchResCommonArrV1

```ts
type FetchCommonArr<T> = FetchCommon<T>[]
```

### FileInfo

```ts
interface FileInfo {
  fileName: string
  mimeType: string
  size: number
  filePath: string
}
```

### FetchHTML

```ts
interface FetchHTML {
  httpResponse: HTTPResponse | null // The type of HTTPResponse in the puppeteer library
  data: {
    page: Page
    content: string
    jsdom: JSDOM // The type of JSDOM in the jsdom library
  }
}
```

## More

If you have any **questions** or **needs** , please submit **Issues in** https://github.com/coder-hxl/x-crawl/issues .
