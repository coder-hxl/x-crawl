# x-crawl

English | [简体中文](https://github.com/coder-hxl/x-crawl/blob/main/docs/cn.md)

x-crawl is a flexible nodejs crawler library. You can crawl pages and control operations such as pages, batch network requests, and batch downloads of file resources. Support asynchronous/synchronous mode crawling data. Running on nodejs, the usage is flexible and simple, friendly to JS/TS developers.

If you feel good, you can support [x-crawl repository](https://github.com/coder-hxl/x-crawl) with a Star.

## Features

- Cules data for asynchronous/synchronous ways.
- In three ways to obtain the results of the three ways of supporting Promise, Callback, and Promise + Callback.
- RquestConfig has 5 ways of writing.
- Flexible request interval.
- Operations such as crawling pages, batch network requests, and batch downloading of file resources can be performed with simple configuration.
- The rotation function, crawl regularly.
- The built -in Puppeteer crawl the page and uses the JSDOM library to analyze the page, or it can also be parsed by itself.
- Chopening with TypeScript, possessing type prompts, and providing generic types.

## Relationship with puppeteer 

The crawlPage API internally uses the [puppeteer](https://github.com/puppeteer/puppeteer) library to help us crawl pages.

We can do the following:

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
      + [Multiple crawler application instances](#Multiple-crawler-application-instances)
    * [Crawl page](#Crawl-page)
      + [jsdom instance](#jsdom-instance)
      + [browser instance](#browser-instance)
      + [page instance](#page-instance)
    * [Crawl interface](#Crawl-interface)
    * [Crawl files](#Crawl-files)
    * [Start polling](#Start-polling)
    * [Request interval time](#Request-interval-time)
    * [Multiple ways of writing requestConfig options](#Multiple-ways-of-writing-requestConfig-options)
    * [Multiple ways to get results](#Multiple-ways-to-get-results)
- [API](#API)
    * [x-crawl](#x-crawl-2)
       + [Type](#Type-1)
       + [Example](#Example-1)
    * [crawlPage](#crawlPage)
       + [Type](#Type-2)
       + [Example](#Example-2)
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
    * [RequestConfigObject](#RequestConfigObject)
    * [RequestConfig](#RequestConfig)
    * [MergeRequestConfigObject](#MergeRequestConfigObject)
    * [IntervalTime](#IntervalTime)
    * [XCrawlBaseConfig](#XCrawlBaseConfig)
    * [CrawlBaseConfigV1](#CrawlBaseConfigV1)
    * [CrawlPageConfig](#CrawlPageConfig	)
    * [CrawlDataConfig](#CrawlDataConfig) 
    * [CrawlFileConfig](#CrawlFileConfig)
    * [StartPollingConfig](#StartPollingConfig)
    * [XCrawlInstance](#XCrawlInstance)
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
    const { browser, jsdom } = res // By default, the JSDOM library is used to parse Page

    // Get the cover image element of the Promoted Video
    const imgEls = jsdom.window.document.querySelectorAll(
      '.yt-core-image--fill-parent-width'
    )

    // set request configuration
    const requestConfig = []
    imgEls.forEach((item) => {
      if (item.src) {
        requestConfig.push(item.src)
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
import xCrawl from 'x-crawl'

const myXCrawl = xCrawl({ 
  timeout: 10000
})

myXCrawl.crawlPage('https://xxx.com').then(res => {
  const { jsdom, browser, page } = res
  
  // Close the browser
  browser.close()
})
```

#### jsdom instance

It is an instance object of [JSDOM](https://github.com/jsdom/jsdom), please refer to [jsdom](https://github.com/jsdom/jsdom) for specific usage.

**Note:** The jsdom instance only parses the content of [page instance](#page-instance), if you use page instance for event operation, you may need to parse the latest by yourself For details, please refer to the self-parsing page of [page instance](#page-instance).

#### browser instance

It is an instance object of [Browser](https://pptr.dev/api/puppeteer.browser). For specific usage, please refer to [Browser](https://pptr.dev/api/puppeteer.browser).

The browser instance is a headless browser without a UI shell. What he does is to bring **all modern network platform functions** provided by the browser rendering engine to the code.

**Note:** An event loop will always be generated inside the browser instance, causing the file not to be terminated. If you want to stop, you can execute browser.close() to close it. Do not call [crawlPage](#crawlPage) or [page](#page) if you need to use it later. Because when you modify the properties of the browser instance, it will affect the browser instance inside the crawlPage API of the crawler instance, the page instance that returns the result, and the browser instance, because the browser instance is shared within the crawlPage API of the same crawler instance.

#### page instance

It is an instance object of [Page](https://pptr.dev/api/puppeteer.page). The instance can also perform interactive operations such as events. For specific usage, please refer to [page](https://pptr.dev /api/puppeteer. page).

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

myXCrawl
   .crawlPage('https://xxx.com')
   .then(async (res) => {
     const { page } = res

     // Get a screenshot of the rendered page
     await page.screenshot({ path: './upload/page.png' })

     console.log('Screen capture is complete')
   })
```

### Crawl interface

Crawl interface data through [crawlData()](#crawlData)

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

myXCrawl.crawlData({ requestConfig }).then(res => {
   // deal with
})
```

### Crawl files

Crawl file data via [crawlFile()](#crawlFile)

```js
import xCrawl from 'x-crawl'

const myXCrawl = xCrawl({ 
  timeout: 10000,
  intervalTime: { max: 3000, min: 1000 }
})

const requestConfig = [ 'https://xxx.com/xxxx', 'https://xxx.com/xxxx' ]

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

Start a polling crawl with [startPolling](#startPolling)

```js
import xCrawl from 'x-crawl'

const myXCrawl = xCrawl({ 
  timeout: 10000,
  intervalTime: { max: 3000, min: 1000 }
})

myXCrawl. startPolling({ h: 2, m: 30 }, (count, stopPolling) => {
  // will be executed every two and a half hours
  // crawlPage/crawlData/crawlFile
  myXCrawl.crawlPage('https://xxx.com').then(res => {
    const { jsdom, browser, page } = res
 
  })
})
```

Callback function parameters:

- The count attribute records the current number of polling operations.
- stopPolling is a callback function, calling it can terminate subsequent polling operations.

### Request interval time

Setting the requests interval time can prevent too much concurrency and avoid too much pressure on the server.

It can be set when creating a crawler instance, or you can choose to set it separately for an API. The request interval time is controlled internally by the instance method, not by the instance to control the entire request interval time.

```js
import xCrawl from 'x-crawl'

// Unified settings
const myXCrawl = xCrawl({
  intervalTime: { max: 3000, min: 1000 }
})

// Set individually (high priority)
myXCrawl.crawlFile({
  requestConfig: [ 'https://xxx.com/xxxx', 'https://xxx.com/xxxx' ],
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
const requestConfig2 = [ 'https://xxx.com/xxxx', 'https://xxx.com/xxxx', 'https://xxx.com/xxxx' ]

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

myXCrawl.crawlData({ requestConfig: requestConfig5 }).then(res => {
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

const requestConfig = [ 'https://xxx.com/xxxx', 'https://xxx.com/xxxx', 'https://xxx.com/xxxx' ]

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

### x-crawl

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
  // The interval between requests, multiple requests are valid
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
- Look at the [CrawlPage](#CrawlPage-2) type

```ts
function crawlPage: (
  config: CrawlPageConfig,
  callback?: (res: CrawlPage) => void
) => Promise<CrawlPage>
```

#### Example

```js
import xCrawl from 'x-crawl'

const myXCrawl = xCrawl({ timeout: 10000 })

// crawlPage API
myXCrawl.crawlPage('https://xxx.com/xxxx').then((res) => {
  const { jsdom, browser, page } = res
  console.log(jsdom.window.document.querySelector('title')?.textContent)
    
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
myXCrawl.crawlData({ requestConfig }).then(res => {
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

const requestConfig = [ 'https://xxx.com/xxxx', 'https://xxx.com/xxxx' ]

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
type Method = 'get' | 'GET' | 'delete' | 'DELETE' | 'head' | 'HEAD' | 'options' | 'OPTONS' | 'post' | 'POST' | 'put' | 'PUT' | 'patch' | 'PATCH' | 'purge' | 'PURGE' | 'link' | 'LINK' | 'unlink' | 'UNLINK'
```

### RequestConfigObject

```ts 
interface RequestConfigObject {
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
type RequestConfig = string | RequestConfigObject
```

### MergeRequestConfigObject

```ts
interface MergeRequestConfigObject {
  url: string
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
type CrawlPageConfig = string | MergeRequestConfigObject
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

### XCrawlInstance

```js
interface XCrawlInstance {
  crawlPage: (
    config: CrawlPageConfig,
    callback?: (res: CrawlPage) => void
  ) => Promise<CrawlPage>

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
  browser // The type of Browser in the puppeteer library
  page: Page // The type of Page in the puppeteer library
  jsdom: JSDOM // The type of JSDOM in the jsdom library
}
```

## More

If you have any **questions** or **needs** , please submit **Issues in** https://github.com/coder-hxl/x-crawl/issues .
