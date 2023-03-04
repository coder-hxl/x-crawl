# x-crawl

English | [简体中文](https://github.com/coder-hxl/x-crawl/blob/main/docs/cn.md)

x-crawl is a Nodejs multifunctional crawler library. 

If it helps you, please give the [repository](https://github.com/coder-hxl/x-crawl) a Star to support it.

## Features

- Crawl pages, JSON, file resources, etc. with simple configuration.
- The built-in puppeteer crawls the page, and uses the jsdom library to parse the page.
- Support asynchronous/synchronous way to crawl data.
- Support Promise/Callback method to get the result.
- Polling function, timing crawling.
- Anthropomorphic request interval.
- Written in TypeScript, providing generics.

## Relationship with puppeteer 

The fetchPage API internally uses the [puppeteer](https://github.com/puppeteer/puppeteer) library to crawl pages.

The following can be done:

- Generate screenshots and PDFs of pages.
- Crawl a SPA (Single-Page Application) and generate pre-rendered content (i.e. "SSR" (Server-Side Rendering)).
- Automate form submission, UI testing, keyboard input, etc.

# Table of Contents

- [Install](#Install)
- [Example](#Example)
- [Core concepts](#Core-concepts)
    * [Create application](#Create-application)
      + [An example of a crawler application](#An-example-of-a-crawler-application)
      + [Choose crawling mode](#Choose-crawling-mode)
      + [Set interval time](#Set-interval-time)
      + [Multiple crawler application instances](#Multiple-crawler-application-instances)
    * [Crawl page](#Crawl-page)
    * [Crawl interface](#Crawl-interface)
    * [Crawl files](#Crawl-files)
- [API](#API)
    * [x-crawl](#x-crawl-2)
       + [Type](#Type-1)
       + [Example](#Example-1)
       + [Mode](#Mode)
       + [IntervalTime](#IntervalTime)
    * [fetchPage](#fetchPage)
       + [Type](#Type-2)
       + [Example](#Example-2)
       + [About page](#About-page)
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
    * [RequestBaseConfig](#RequestBaseConfig)
    * [RequestConfig](#RequestConfig)
    * [IntervalTime](#IntervalTime)
    * [XCrawlBaseConfig](#XCrawlBaseConfig)
    * [FetchBaseConfigV1](#FetchBaseConfigV1)
    * [FetchPageConfig](#FetchPageConfig	)
    * [FetchDataConfig](#FetchDataConfig) 
    * [FetchFileConfig](#FetchFileConfig)
    * [StartPollingConfig](#StartPollingConfig)
    * [FetchResCommonV1](#FetchResCommonV1)
    * [FetchResCommonArrV1](#FetchResCommonArrV1)
    * [FileInfo](#FileInfo)
    * [FetchPage](#FetchPage)
- [More](#More)

## Install

Take NPM as an example:

```shell
npm install x-crawl
```

## Example

Regular crawling: Get the recommended pictures of the youtube homepage every other day as an example:

```js
// 1.Import module ES/CJS
import xCrawl from 'x-crawl'

// 2.Create a crawler instance
const myXCrawl = xCrawl({
  timeout: 10000, // overtime time
  intervalTime: { max: 3000, min: 2000 } // control request frequency
})

// 3.Set the crawling task
// Call the startPolling API to start the polling function, and the callback function will be called every other day
myXCrawl.startPolling({ d: 1 }, () => {
    // Call fetchPage API to crawl Page
  myXCrawl.fetchPage('https://www.youtube.com/').then((res) => {
    const { jsdom } = res.data // By default, the JSDOM library is used to parse Page

    // Get the cover image element of the Promoted Video
    const imgEls = jsdom.window.document.querySelectorAll(
      '.yt-core-image--fill-parent-width'
    )

    // set request configuration
    const requestConfig = []
    imgEls.forEach((item) => {
      if (item.src) {
        requestConfig.push({ url: item.src })
      }
    })

    // Call the fetchFile API to crawl pictures
    myXCrawl.fetchFile({ requestConfig, fileConfig: { storeDir: './upload' } })
  })
})

```

running result:

<div align="center">
  <img src="https://raw.githubusercontent.com/coder-hxl/x-crawl/main/assets/en/crawler.png" />
</div>

<div align="center">
  <img src="https://raw.githubusercontent.com/coder-hxl/x-crawl/main/assets/en/crawler-result.png" />
</div>

**Note:** Do not crawl at will, you can check the **robots.txt** protocol before crawling. This is just to demonstrate how to use x-crawl.

## Core concepts

### Create application

#### An example of a crawler application

Create a new **application instance** via [xCrawl()](#xCrawl):

```js
import xCrawl from 'x-crawl'

const myXCrawl = xCrawl({
   // options
})
```

Related **options** can refer to [XCrawlBaseConfig](#XCrawlBaseConfig) .

#### Choose crawling mode

A crawler application instance has two crawling modes: asynchronous/synchronous, and each crawler instance can only choose one of them.

```js
import xCrawl from 'x-crawl'

const myXCrawl = xCrawl({
   mode: 'async'
})
```

The mode option defaults to async .

- async: asynchronous request, in batch requests, the next request is made without waiting for the current request to complete
- sync: synchronous request, in batch requests, you need to wait for this request to complete before making the next request

If there is an interval time set, it is necessary to wait for the interval time to end before sending the request.

#### Set interval time

Setting the interval time can prevent too much concurrency and avoid too much pressure on the server.

```js
import xCrawl from 'x-crawl'

const myXCrawl = xCrawl({
   intervalTime: { max: 3000, min: 1000 }
})
```

The intervalTime option defaults to undefined . If there is a setting value, it will wait for a period of time before requesting, which can prevent too much concurrency and avoid too much pressure on the server.

- number: The time that must wait before each request is fixed
- Object: Randomly select a value from max and min, which is more anthropomorphic

The first request is not to trigger the interval.

#### Multiple crawler application instances

```js
import xCrawl from 'x-crawl'

const myXCrawl1 = xCrawl({
  // options
})

const myXCrawl2 = xCrawl({
  // options
})
```

### Crawl page

Fetch a page via [fetchPage()](#fetchPage)

```js
myXCrawl.fetchPage('https://xxx.com').then(res => {
   const { jsdom, page } = res.data
})
```

### Crawl interface

Crawl interface data through [fetchData()](#fetchData)

```js
const requestConfig = [
   { url: 'https://xxx.com/xxxx' },
   { url: 'https://xxx.com/xxxx' },
   { url: 'https://xxx.com/xxxx' }
]

myXCrawl.fetchData({ requestConfig }).then(res => {
   // deal with
})
```

### Crawl files

Fetch file data via [fetchFile()](#fetchFile)

```js
import path from 'node:path'

const requestConfig = [
   { url: 'https://xxx.com/xxxx' },
   { url: 'https://xxx.com/xxxx' },
   { url: 'https://xxx.com/xxxx' }
]

myXCrawl. fetchFile({
   requestConfig,
   fileConfig: {
     storeDir: path.resolve(__dirname, './upload') // storage folder
   }
}).then(fileInfos => {
   console. log(fileInfos)
})
```

## API

### x-crawl

Create a crawler instance via call xCrawl. The request queue is maintained by the instance method itself, not by the instance itself.

#### Type

For more detailed types, please see the [Types](#Types) section

```ts
function xCrawl(baseConfig?: XCrawlBaseConfig): XCrawlInstance
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

Passing **baseConfig** is for **fetchPage/fetchData/fetchFile** to use these values by default.

**Note:** To avoid repeated creation of instances in subsequent examples, **myXCrawl** here will be the crawler instance in the **fetchPage/fetchData/fetchFile** example.

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

### fetchPage

fetchPage is the method of the above [myXCrawl](https://github.com/coder-hxl/x-crawl#Example-1) instance, usually used to crawl page.

#### Type

- Look at the [FetchPageConfig](#FetchPageConfig) type
- Look at the [FetchPage](#FetchPage-2) type

```ts
function fetchPage: (
  config: FetchPageConfig,
  callback?: (res: FetchPage) => void
) => Promise<FetchPage>
```

#### Example

```js
myXCrawl.fetchPage('/xxx').then((res) => {
  const { jsdom } = res.data
  console.log(jsdom.window.document.querySelector('title')?.textContent)
})
```

#### About page

Get the page instance from res.data.page, which can do interactive operations such as events. For specific usage, refer to [page](https://pptr.dev/api/puppeteer.page).

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
const requestConfig = [
  { url: '/xxxx' },
  { url: '/xxxx' },
  { url: '/xxxx' }
]

myXCrawl.fetchData({ requestConfig }).then(res => {
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
const requestConfig = [
  { url: '/xxxx' },
  { url: '/xxxx' },
  { url: '/xxxx' }
]

myXCrawl.fetchFile({
  requestConfig,
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
  // fetchPage/fetchData/fetchFile
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

### RequestBaseConfig

```ts
interface RequestBaseConfig {
 url: string
 timeout?: number
 proxy?: string
}
```

### RequestConfig

```ts 
interface RequestConfig extends RequestBaseConfig {
  method?: Method
  headers?: AnyObject
  params?: AnyObject
  data?: any
}
```

### IntervalTime

```ts
type IntervalTime = number | {
  max: number
  min?: number
}
```

### XCrawlBaseConfig

```ts
interface XCrawlBaseConfig {
  baseUrl?: string
  timeout?: number
  intervalTime?: IntervalTime
  mode?: 'async' | 'sync'
  proxy?: string
}
```

### FetchBaseConfigV1

```ts
interface FetchBaseConfigV1 {
  requestConfig: RequestConfig | RequestConfig[]
  intervalTime?: IntervalTime
}
```

### FetchPageConfig

```ts
type FetchPageConfig = string | RequestBaseConfig
```

### FetchDataConfig

```ts
interface FetchDataConfig extends FetchBaseConfigV1 {
}
```

### FetchFileConfig

```ts
interface FetchFileConfig extends FetchBaseConfigV1 {
  fileConfig: {
    storeDir: string // Store folder
    extension?: string // Filename extension
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
  headers: IncomingHttpHeaders // nodejs: http type
  data: T
}
```

### FetchResCommonArrV1

```ts
type FetchResCommonArrV1<T> = FetchResCommonV1<T>[]
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

### FetchPage

```ts
interface FetchPage {
  httpResponse: HTTPResponse | null // The type of HTTPResponse in the puppeteer library
  data: {
    page: Page // The type of Page in the puppeteer library
    jsdom: JSDOM // The type of JSDOM in the jsdom library
  }
}
```

## More

If you have any **questions** or **needs** , please submit **Issues in** https://github.com/coder-hxl/x-crawl/issues .
