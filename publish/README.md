# x-crawl [![npm](https://img.shields.io/npm/v/x-crawl.svg)](https://www.npmjs.com/package/x-crawl) [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/coder-hxl/x-crawl/blob/main/LICENSE)

English | [简体中文](https://github.com/coder-hxl/x-crawl/blob/main/docs/cn.md)

x-crawl is a flexible nodejs crawler library. It can crawl pages in batches, network requests in batches, download file resources in batches, polling and crawling, etc. Supports asynchronous/synchronous mode crawling. Running on nodejs, the usage is flexible and simple, friendly to JS/TS developers.

> If you feel good, you can give [x-crawl repository](https://github.com/coder-hxl/x-crawl) a Star to support it, your Star will be the motivation for my update.

## Features

- **🔥 Asynchronous/Synchronous** - Support asynchronous/synchronous mode batch crawling.
- **⚙️ Multiple functions** - Batch crawling of pages, batch network requests, batch download of file resources, polling crawling, etc.
- **🖋️ Flexible writing style** - Multiple crawling configurations and ways to get crawling results.
- **⏱️ Interval crawling** - no interval/fixed interval/random interval, you can use/avoid high concurrent crawling.
- **☁️ Crawl SPA** - Batch crawl SPA (Single Page Application) to generate pre-rendered content (ie "SSR" (Server Side Rendering)).
- **⚒️ Controlling Pages** - Headless browsers can submit forms, keystrokes, event actions, generate screenshots of pages, etc.
- **🧾 Capture Record** - Capture and record the crawled results, and highlight the reminders.
- **🦾TypeScript** - Own types, implement complete types through generics.

## Relationship with puppeteer

The crawlPage API internally uses the [puppeteer](https://github.com/puppeteer/puppeteer) library to help us crawl pages and expose Brower instances and Page instances.

# Table of Contents

- [Install](#Install)
- [Example](#Example)
- [Core concepts](#Core-concepts)
  - [Create application](#Create-application)
    - [An example of a crawler application](#An-example-of-a-crawler-application)
    - [Choose crawling mode](#Choose-crawling-mode)
    - [Multiple crawler application instances](#Multiple-crawler-application-instances)
  - [Crawl page](#Crawl-page)
    - [browser instance](#browser-instance)
    - [page instance](#page-instance)
  - [Crawl interface](#Crawl-interface)
  - [Crawl files](#Crawl-files)
  - [Start polling](#Start-polling)
  - [Crawl interval](#Crawl-interval)
  - [Multiple ways of writing requestConfig options](#Multiple-ways-of-writing-requestConfig-options)
  - [Multiple ways to get results](#Multiple-ways-to-get-results)
- [API](#API)
  - [xCrawl](#xCrawl)
    - [Type](#Type)
    - [Example](#Example-1)
  - [crawlPage](#crawlPage)
    - [Type](#Type-1)
    - [Example](#Example-2)
  - [crawlData](#crawlData)
    - [Type](#Type-2)
    - [Example](#Example-3)
  - [crawlFile](#crawlFile)
    - [Type](#Type-3)
    - [Example](#Example-4)
  - [crawlPolling](#crawlPolling)
    - [Type](#Type-4)
    - [Example](#Example-5)
- [Types](#Types)
  - [AnyObject](#AnyObject)
  - [Method](#Method)
  - [RequestConfigObjectV1](#RequestConfigObjectV1)
  - [RequestConfigObjectV2](#RequestConfigObjectV2)
  - [RequestConfig](#RequestConfig)
  - [IntervalTime](#IntervalTime)
  - [XCrawlBaseConfig](#XCrawlBaseConfig)
  - [CrawlBaseConfigV1](#CrawlBaseConfigV1)
  - [CrawlBaseConfigV2](#CrawlBaseConfigV2)
  - [CrawlPageConfig](#CrawlPageConfig)
  - [CrawlDataConfig](#CrawlDataConfig)
  - [CrawlFileConfig](#CrawlFileConfig)
  - [StartPollingConfig](#StartPollingConfig)
  - [XCrawlInstance](#XCrawlInstance)
  - [CrawlResCommonV1](#CrawlResCommonV1)
  - [CrawlResCommonArrV1](#CrawlResCommonArrV1)
  - [CrawlPage](#CrawlPage-1)
  - [FileInfo](#FileInfo)
- [More](#More)

## Install

Take NPM as an example:

```shell
npm install x-crawl
```

## Example

Timing capture: Take the automatic capture of the cover image of Airbnb Plus listings every day as an example:

```js
// 1.Import module ES/CJS
import xCrawl from 'x-crawl'

// 2.Create a crawler instance
const myXCrawl = xCrawl({
  timeout: 10000, // overtime time
  intervalTime: { max: 3000, min: 2000 } // crawl interval
})

// 3.Set the crawling task
/*
  Call the startPolling API to start the polling function,
  and the callback function will be called every other day
*/
myXCrawl.startPolling({ d: 1 }, async (count, stopPolling) => {
  // Call crawlPage API to crawl Page
  const { page } = await myXCrawl.crawlPage('https://zh.airbnb.com/s/*/plus_homes')

  // set request configuration
  const plusBoxHandle = await page.$('.a1stauiv')
  const requestConfig = await plusBoxHandle!.$$eval('picture img', (imgEls) => {
    return imgEls.map((item) => item.src)
  })

  // Call the crawlFile API to crawl pictures
  myXCrawl.crawlFile({ requestConfig, fileConfig: { storeDir: './upload' } })

  // Close page
  page.close()
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

Crawl a page via [crawlPage()](#crawlPage) .

```js
import xCrawl from 'x-crawl'

const myXCrawl = xCrawl({
  timeout: 10000
})

myXCrawl.crawlPage('https://xxx.com').then((res) => {
  const { browser, page } = res

  // Close the browser
  browser.close()
})
```

#### browser instance

It is an instance object of [Browser](https://pptr.dev/api/puppeteer.browser). For specific usage, please refer to [Browser](https://pptr.dev/api/puppeteer.browser).

The browser instance is a headless browser without a UI shell. What he does is to bring **all modern network platform functions** provided by the browser rendering engine to the code.

**Note:** An event loop will always be generated inside the browser instance, causing the file not to be terminated. If you want to stop, you can execute browser.close() to close it. Do not call [crawlPage](#crawlPage) or [page](#page) if you need to use it later. Because when you modify the properties of the browser instance, it will affect the browser instance inside the crawlPage API of the crawler instance, the page instance that returns the result, and the browser instance, because the browser instance is shared within the crawlPage API of the same crawler instance.

#### page instance

It is an instance object of [Page](https://pptr.dev/api/puppeteer.page). The instance can also perform interactive operations such as events. For specific usage, please refer to [page](https://pptr.dev /api/puppeteer. page).

The browser instance will retain a reference to the page instance. If it is no longer used in the future, the page instance needs to be closed by itself, otherwise it will cause a memory leak.

**Parse the page by yourself**

Take the jsdom library as an example:

```js
import xCrawl from 'x-crawl'
import { JSDOM } from 'jsdom'

const myXCrawl = xCrawl({ timeout: 10000 })

myXCrawl.crawlPage('https://www.xxx.com').then(async (res) => {
  const { page } = res

  // Get the latest page content
  const content = await page.content()

  // Use the jsdom library to parse it yourself
  const jsdom = new JSDOM(content)

  console.log(jsdom.window.document.querySelector('title').textContent)
})
```

**Take Screenshot**

```js
import xCrawl from 'x-crawl'

const myXCrawl = xCrawl({ timeout: 10000 })

myXCrawl.crawlPage('https://xxx.com').then(async (res) => {
  const { page } = res

  // Get a screenshot of the rendered page
  await page.screenshot({ path: './upload/page.png' })

  console.log('Screen capture is complete')
})
```

### Crawl interface

Crawl interface data through [crawlData()](#crawlData) .

```js
import xCrawl from 'x-crawl'

const myXCrawl = xCrawl({
  timeout: 10000,
  intervalTime: { max: 3000, min: 1000 }
})

const requestConfig = [
  { url: 'https://xxx.com/xxxx' },
  { url: 'https://xxx.com/xxxx', method: 'POST', data: { name: 'coderhxl' } },
  { url: 'https://xxx.com/xxxx' }
]

myXCrawl.crawlData({ requestConfig }).then((res) => {
  // deal with
})
```

### Crawl files

Crawl file data via [crawlFile()](#crawlFile) .

```js
import xCrawl from 'x-crawl'

const myXCrawl = xCrawl({
  timeout: 10000,
  intervalTime: { max: 3000, min: 1000 }
})

const requestConfig = ['https://xxx.com/xxxx', 'https://xxx.com/xxxx']

myXCrawl
  .crawlFile({
    requestConfig,
    fileConfig: {
      storeDir: './upload' // storage folder
    }
  })
  .then((fileInfos) => {
    console.log(fileInfos)
  })
```

### Start polling

Start a polling crawl with [startPolling()](#startPolling) .

```js
import xCrawl from 'x-crawl'

const myXCrawl = xCrawl({
  timeout: 10000,
  intervalTime: { max: 3000, min: 1000 }
})

myXCrawl.startPolling({ h: 2, m: 30 }, async (count, stopPolling) => {
  // will be executed every two and a half hours
  // crawlPage/crawlData/crawlFile
  const { browser, page } = await myXCrawl.crawlPage('https://xxx.com')
  page.close()
})
```

**Using crawlPage in polling Note:** Calling page.close() is to prevent the browser instance from retaining references to the page instance. If it is no longer used in the future, you need to close the page instance yourself, otherwise it will cause memory leaks.

Callback function parameters:

- The count attribute records the current number of polling operations.
- stopPolling is a callback function, calling it can terminate subsequent polling operations.

### Crawl interval

Setting the requests interval time can prevent too much concurrency and avoid too much pressure on the server.

It can be set when creating a crawler instance, or you can choose to set it separately for an API. The crawl interval is controlled internally by the instance method, not by the instance to control the entire crawl interval.

```js
import xCrawl from 'x-crawl'

// Unified settings
const myXCrawl = xCrawl({
  intervalTime: { max: 3000, min: 1000 }
})

// Set individually (high priority)
myXCrawl.crawlFile({
  requestConfig: ['https://xxx.com/xxxx', 'https://xxx.com/xxxx'],
  intervalTime: { max: 2000, min: 1000 }
})
```

The intervalTime option defaults to undefined . If there is a setting value, it will wait for a period of time before requesting, which can prevent too much concurrency and avoid too much pressure on the server.

- number: The time that must wait before each request is fixed
- Object: Randomly select a value from max and min, which is more anthropomorphic

**Note:** The first request will not trigger the interval.

### Multiple ways of writing requestConfig options

The writing method of requestConfig is very flexible, there are 5 types in total, which can be:

- string
- array of strings
- object
- array of objects
- string plus object array

```js
import xCrawl from 'x-crawl'

const myXCrawl = xCrawl({
  timeout: 10000,
  intervalTime: { max: 3000, min: 1000 }
})

// requestConfig writing method 1:
const requestConfig1 = 'https://xxx.com/xxxx'

// requestConfig writing method 2:
const requestConfig2 = ['https://xxx.com/xxxx', 'https://xxx.com/xxxx', 'https://xxx.com/xxxx']

// requestConfig writing method 3:
const requestConfig3 = {
  url: 'https://xxx.com/xxxx',
  method: 'POST',
  data: { name: 'coderhxl' }
}

// requestConfig writing method 4:
const requestConfig4 = [
  { url: 'https://xxx.com/xxxx' },
  { url: 'https://xxx.com/xxxx', method: 'POST', data: { name: 'coderhxl' } },
  { url: 'https://xxx.com/xxxx' }
]

// requestConfig writing method 5:
const requestConfig5 = [
  'https://xxx.com/xxxx',
  { url: 'https://xxx.com/xxxx', method: 'POST', data: { name: 'coderhxl' } },
  'https://xxx.com/xxxx'
]

myXCrawl.crawlData({ requestConfig: requestConfig5 }).then((res) => {
  console.log(res)
})
```

It can be selected according to the actual situation.

### Multiple ways to get results

There are three ways to get the result: Promise, Callback and Promise + Callback.

- Promise: After all requests end, get the results of all requests
- Callback: After each request ends, get the result of the current request

These three methods apply to crawlPage, crawlData and crawlFile.

```js
import xCrawl from 'x-crawl'

const myXCrawl = xCrawl({
  timeout: 10000,
  intervalTime: { max: 3000, min: 1000 }
})

const requestConfig = ['https://xxx.com/xxxx', 'https://xxx.com/xxxx', 'https://xxx.com/xxxx']

// Method 1: Promise
myXCrawl
  .crawlFile({
    requestConfig,
    fileConfig: { storeDir: './upload' }
  })
  .then((fileInfos) => {
    console.log('Promise: ', fileInfos)
  })

// Method 2: Callback
myXCrawl.crawlFile(
  {
    requestConfig,
    fileConfig: { storeDir: './upload' }
  },
  (fileInfo) => {
    console.log('Callback: ', fileInfo)
  }
)

// Method 3: Promise + Callback
myXCrawl
  .crawlFile(
    {
      requestConfig,
      fileConfig: { storeDir: './upload' }
    },
    (fileInfo) => {
      console.log('Callback: ', fileInfo)
    }
  )
  .then((fileInfos) => {
    console.log('Promise: ', fileInfos)
  })
```

It can be selected according to the actual situation.

## API

### xCrawl

Create a crawler instance via call xCrawl. The request queue is maintained by the instance method itself, not by the instance itself.

#### Type

- [XCrawlBaseConfig](#XCrawlBaseConfig)
- [XCrawlInstance](#XCrawlInstance)

```ts
function xCrawl(baseConfig?: XCrawlBaseConfig): XCrawlInstance
```

#### Example

```js
import xCrawl from 'x-crawl'

// xCrawl API
const myXCrawl = xCrawl({
  baseUrl: 'https://xxx.com',
  timeout: 10000,
  // Crawling interval time, batch crawling is only valid
  intervalTime: {
    max: 2000,
    min: 1000
  }
})
```

**Note:** To avoid repeated creation of instances in subsequent examples, **myXCrawl** here will be the crawler instance in the **crawlPage/crawlData/crawlFile** example.

### crawlPage

crawlPage is the method of the crawler instance, usually used to crawl page.

#### Type

- Look at the [CrawlPageConfig](#CrawlPageConfig) type
- Look at the [CrawlPage](#CrawlPage-1) type

```ts
function crawlPage<T extends CrawlPageConfig = CrawlPageConfig>(
  config: T,
  callback?: ((res: CrawlPage) => void) | undefined
): Promise<T extends string[] | CrawlBaseConfigV1[] ? CrawlPage[] : CrawlPage>
```

#### Example

```js
import xCrawl from 'x-crawl'

const myXCrawl = xCrawl({ timeout: 10000 })

// crawlPage API
myXCrawl.crawlPage('https://xxx.com/xxxx').then((res) => {
  const { browser, page } = res

  // Close the browser
  browser.close()
})
```

### crawlData

crawlData is the method of the crawler instance, which is usually used to crawl APIs to obtain JSON data and so on.

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
import xCrawl from 'x-crawl'

const myXCrawl = xCrawl({
  timeout: 10000,
  intervalTime: { max: 2000, min: 1000 }
})

const requestConfig = [
  { url: 'https://xxx.com/xxxx' },
  { url: 'https://xxx.com/xxxx', method: 'POST', data: { name: 'coderhxl' } },
  { url: 'https://xxx.com/xxxx' }
]

// crawlData API
myXCrawl.crawlData({ requestConfig }).then((res) => {
  console.log(res)
})
```

### crawlFile

crawlFile is the method of the crawler instance, which is usually used to crawl files, such as pictures, pdf files, etc.

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
import xCrawl from 'x-crawl'

const myXCrawl = xCrawl({
  timeout: 10000,
  intervalTime: { max: 2000, min: 1000 }
})

const requestConfig = ['https://xxx.com/xxxx', 'https://xxx.com/xxxx']

myXCrawl
  .crawlFile({
    requestConfig,
    fileConfig: {
      storeDir: './upload' // storage folder
    }
  })
  .then((fileInfos) => {
    console.log(fileInfos)
  })
```

### startPolling

crawlPolling is a method of the crawler instance, typically used to perform polling operations, such as getting news every once in a while.

#### Type

- Look at the [StartPollingConfig](#StartPollingConfig) type

```ts
function startPolling(
  config: StartPollingConfig,
  callback: (count: number, stopPolling: () => void) => void
): void
```

#### Example

```js
import xCrawl from 'x-crawl'

const myXCrawl = xCrawl({
  timeout: 10000,
  intervalTime: { max: 2000, min: 1000 }
})

// startPolling API
myXCrawl.startPolling({ h: 2, m: 30 }, (count, stopPolling) => {
  // will be executed every two and a half hours
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
type Method =
  | 'get'
  | 'GET'
  | 'delete'
  | 'DELETE'
  | 'head'
  | 'HEAD'
  | 'options'
  | 'OPTONS'
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

### RequestConfigObjectV1

```ts
interface RequestConfigObjectV1 {
  url: string
  headers?: AnyObject
  timeout?: number
  proxy?: string
}
```

### RequestConfigObjectV2

```ts
interface RequestConfigObjectV2 {
  url: string
  method?: Method
  headers?: AnyObject
  params?: AnyObject
  data?: any
  timeout?: number
  proxy?: string
}
```

### RequestConfig

```ts
type RequestConfig = string | RequestConfigObjectV2
```

### IntervalTime

```ts
type IntervalTime =
  | number
  | {
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
interface CrawlBaseConfigV1 extends RequestConfigObjectV1 {
  cookies?: string | Protocol.Network.CookieParam | Protocol.Network.CookieParam[] // The Protocol is from the puppeteer library
}
```

### CrawlBaseConfigV2

```ts
interface CrawlBaseConfigV2 {
  requestConfig: RequestConfig | RequestConfig[]
  intervalTime?: IntervalTime
}
```

### CrawlPageConfig

```ts
type CrawlPageConfig = string | CrawlBaseConfigV1
```

### CrawlDataConfig

```ts
interface CrawlDataConfig extends CrawlBaseConfigV2 {}
```

### CrawlFileConfig

```ts
interface CrawlFileConfig extends CrawlBaseConfigV2 {
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

### XCrawlInstance

```js
interface XCrawlInstance {
  crawlPage: <T extends CrawlPageConfig = CrawlPageConfig>(
    config: T,
    callback?: (res: CrawlPage) => void
  ) => Promise<
    T extends string[] | CrawlBaseConfigV1[] ? CrawlPage[] : CrawlPage
  >

  crawlData: <T = any>(
    config: CrawlDataConfig,
    callback?: (res: CrawlResCommonV1<T>) => void
  ) => Promise<CrawlResCommonArrV1<T>>

  crawlFile: (
    config: CrawlFileConfig,
    callback?: (res: CrawlResCommonV1<FileInfo>) => void
  ) => Promise<CrawlResCommonArrV1<FileInfo>>

  startPolling: (
    config: StartPollingConfig,
    callback: (count: number, stopPolling: () => void) => void
  ) => void
}
```

### CrawlResCommonV1

```ts
interface CrawlResCommonV1<T> {
  id: number
  statusCode: number | undefined
  headers: IncomingHttpHeaders // The http is from the nodejs library
  data: T
}
```

### CrawlResCommonArrV1

```ts
type CrawlResCommonArrV1<T> = CrawlResCommonV1<T>[]
```

### CrawlPage

```ts
interface CrawlPage {
  httpResponse: HTTPResponse | null // The HTTPResponse is from the puppeteer library
  browser: Browser // The Browser is from the puppeteer library
  page: Page // The Page is from the puppeteer library
}
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

## More

If you have any **questions** or **needs** , please submit **Issues in** https://github.com/coder-hxl/x-crawl/issues .
