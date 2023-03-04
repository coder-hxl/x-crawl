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

The crawlPage API internally uses the [puppeteer](https://github.com/puppeteer/puppeteer) library to crawl pages.

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
    * [crawlPage](#crawlPage)
       + [Type](#Type-2)
       + [Example](#Example-2)
       + [About page](#About-page)
    * [crawlData](#crawlData)
       + [Type](#Type-3)
       + [Example](#Example-3)
    * [crawlFile](#crawlFile)
       + [Type](#Type-4)
       + [Example](#Example-4)
    * [crawlPolling](#crawlPolling)
       + [Type](#Type-5)
       + [Example](#Example-5)
- [Types](#Types)
    * [AnyObject](#AnyObject)
    * [Method](#Method)
    * [RequestBaseConfig](#RequestBaseConfig)
    * [RequestConfig](#RequestConfig)
    * [IntervalTime](#IntervalTime)
    * [XCrawlBaseConfig](#XCrawlBaseConfig)
    * [CrawlBaseConfigV1](#CrawlBaseConfigV1)
    * [CrawlPageConfig](#CrawlPageConfig	)
    * [CrawlDataConfig](#CrawlDataConfig) 
    * [CrawlFileConfig](#CrawlFileConfig)
    * [StartPollingConfig](#StartPollingConfig)
    * [CrawlResCommonV1](#CrawlResCommonV1)
    * [CrawlResCommonArrV1](#CrawlResCommonArrV1)
    * [FileInfo](#FileInfo)
    * [CrawlPage](#CrawlPage)
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
    // Call crawlPage API to crawl Page
  myXCrawl.crawlPage('https://www.youtube.com/').then((res) => {
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

    // Call the crawlFile API to crawl pictures
    myXCrawl.crawlFile({ requestConfig, fileConfig: { storeDir: './upload' } })
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

Crawl a page via [crawlPage()](#crawlPage)

```js
myXCrawl.crawlPage('https://xxx.com').then(res => {
   const { jsdom, page } = res.data
})
```

### Crawl interface

Crawl interface data through [crawlData()](#crawlData)

```js
const requestConfig = [
   { url: 'https://xxx.com/xxxx' },
   { url: 'https://xxx.com/xxxx' },
   { url: 'https://xxx.com/xxxx' }
]

myXCrawl.crawlData({ requestConfig }).then(res => {
   // deal with
})
```

### Crawl files

Crawl file data via [crawlFile()](#crawlFile)

```js
import path from 'node:path'

const requestConfig = [
   { url: 'https://xxx.com/xxxx' },
   { url: 'https://xxx.com/xxxx' },
   { url: 'https://xxx.com/xxxx' }
]

myXCrawl. crawlFile({
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

Passing **baseConfig** is for **crawlPage/crawlData/crawlFile** to use these values by default.

**Note:** To avoid repeated creation of instances in subsequent examples, **myXCrawl** here will be the crawler instance in the **crawlPage/crawlData/crawlFile** example.

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

### crawlPage

crawlPage is the method of the above [myXCrawl](https://github.com/coder-hxl/x-crawl#Example-1) instance, usually used to crawl page.

#### Type

- Look at the [CrawlPageConfig](#CrawlPageConfig) type
- Look at the [CrawlPage](#CrawlPage-2) type

```ts
function crawlPage: (
  config: CrawlPageConfig,
  callback?: (res: CrawlPage) => void
) => Promise<CrawlPage>
```

#### Example

```js
myXCrawl.crawlPage('/xxx').then((res) => {
  const { jsdom } = res.data
  console.log(jsdom.window.document.querySelector('title')?.textContent)
})
```

#### About page

Get the page instance from res.data.page, which can do interactive operations such as events. For specific usage, refer to [page](https://pptr.dev/api/puppeteer.page).

### crawlData

crawlData is the method of the above [myXCrawl](#Example-1) instance, which is usually used to crawl APIs to obtain JSON data and so on.

#### Type

- Look at the [CrawlDataConfig](#CrawlDataConfig) type
- Look at the [CrawlResCommonV1](#CrawlResCommonV1) type
- Look at the [CrawlResCommonArrV1](#CrawlResCommonArrV1) type

```ts
function crawlData: <T = any>(
  config: CrawlDataConfig,
  callback?: (res: CrawlResCommonV1<T>) => void
) => Promise<CrawlResCommonArrV1<T>>
```

#### Example

```js
const requestConfig = [
  { url: '/xxxx' },
  { url: '/xxxx' },
  { url: '/xxxx' }
]

myXCrawl.crawlData({ requestConfig }).then(res => {
  console.log(res)
})
```

### crawlFile

crawlFile is the method of the above [myXCrawl](#Example-1) instance, which is usually used to crawl files, such as pictures, pdf files, etc.

#### Type

- Look at the [CrawlFileConfig](#CrawlFileConfig) type
- Look at the [CrawlResCommonV1](#CrawlResCommonV1) type
- Look at the [CrawlResCommonArrV1](#CrawlResCommonArrV1) type
- Look at the [FileInfo](#FileInfo) type

```ts
function crawlFile: (
  config: CrawlFileConfig,
  callback?: (res: CrawlResCommonV1<FileInfo>) => void
) => Promise<CrawlResCommonArrV1<FileInfo>>
```

#### Example

```js
const requestConfig = [
  { url: '/xxxx' },
  { url: '/xxxx' },
  { url: '/xxxx' }
]

myXCrawl.crawlFile({
  requestConfig,
  fileConfig: {
    storeDir: path.resolve(__dirname, './upload') // storage folder
  }
}).then(fileInfos => {
  console.log(fileInfos)
})
```

### startPolling

crawlPolling is a method of the [myXCrawl](#Example-1) instance, typically used to perform polling operations, such as getting news every once in a while.

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
  // crawlPage/crawlData/crawlFile
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

### CrawlBaseConfigV1

```ts
interface CrawlBaseConfigV1 {
  requestConfig: RequestConfig | RequestConfig[]
  intervalTime?: IntervalTime
}
```

### CrawlPageConfig

```ts
type CrawlPageConfig = string | RequestBaseConfig
```

### CrawlDataConfig

```ts
interface CrawlDataConfig extends CrawlBaseConfigV1 {
}
```

### CrawlFileConfig

```ts
interface CrawlFileConfig extends CrawlBaseConfigV1 {
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

### CrawlResCommonV1

```ts
interface CrawlCommon<T> {
  id: number
  statusCode: number | undefined
  headers: IncomingHttpHeaders // nodejs: http type
  data: T
}
```

### CrawlResCommonArrV1

```ts
type CrawlResCommonArrV1<T> = CrawlResCommonV1<T>[]
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

### CrawlPage

```ts
interface CrawlPage {
  httpResponse: HTTPResponse | null // The type of HTTPResponse in the puppeteer library
  data: {
    page: Page // The type of Page in the puppeteer library
    jsdom: JSDOM // The type of JSDOM in the jsdom library
  }
}
```

## More

If you have any **questions** or **needs** , please submit **Issues in** https://github.com/coder-hxl/x-crawl/issues .
