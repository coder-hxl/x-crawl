# x-crawl [![npm](https://img.shields.io/npm/v/x-crawl.svg)](https://www.npmjs.com/package/x-crawl) [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/coder-hxl/x-crawl/blob/main/LICENSE)

English | [简体中文](https://github.com/coder-hxl/x-crawl/blob/main/docs/cn.md)

x-crawl is a flexible nodejs crawler library. Used to crawl pages, crawl interfaces, crawl files, and poll crawls. Flexible and simple to use, friendly to JS/TS developers.

> If you also like x-crawl, you can give [x-crawl repository](https://github.com/coder-hxl/x-crawl) a star to support it, thank you all for your support.

## Features

- **🔥 Async/Sync** - Just change the mode property to toggle async/sync crawling mode.
- **⚙️ Multiple functions** - Can crawl pages, crawl interfaces, crawl files and poll crawls. And it supports crawling single or multiple.
- **🖋️ Flexible writing method** - A function adapts to multiple crawling configurations and obtains crawling results. The writing method is very flexible.
- **⏱️ Interval crawling** - no interval/fixed interval/random interval, can effectively use/avoid high concurrent crawling.
- **🔄 Retry on failure** - It can be set for all crawling requests, for a single crawling request, and for a single request to set a failed retry.
- **🚀 Priority Queue** - Use priority crawling based on the priority of individual requests.
- **☁️ Crawl SPA** - Batch crawl SPA (Single Page Application) to generate pre-rendered content (ie "SSR" (Server Side Rendering)).
- **⚒️ Controlling Pages** - Headless browsers can submit forms, keystrokes, event actions, generate screenshots of pages, etc.
- **🧾 Capture Record** - Capture and record the crawled results, and highlight them on the console.
- **🦾 TypeScript** - Own types, implement complete types through generics.

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
    - [life cycle](#life-cycle)
      - [beforeSave](#beforeSave)
  - [Start polling](#Start-polling)
  - [Config priority](#Config-Priority)
  - [Interval time](#Interval-time)
  - [Fail retry](#Fail-retry)
  - [Priority queue](#Priority-queue)
  - [About results](#About-results)
  - [TypeScript](#TypeScript)
- [API](#API)
  - [xCrawl](#xCrawl)
    - [Type](#Type)
    - [Example](#Example-1)
  - [crawlPage](#crawlPage)
    - [Type](#Type-1)
    - [Example](#Example-2)
    - [Config](#Config)
  - [crawlData](#crawlData)
    - [Type](#Type-2)
    - [Example](#Example-3)
    - [Config](#Config-1)
  - [crawlFile](#crawlFile)
    - [Type](#Type-3)
    - [Example](#Example-4)
    - [Config](#Config-2)
  - [crawlPolling](#crawlPolling)
    - [Type](#Type-4)
    - [Example](#Example-5)
- [Types](#Types)
  - [API Config](#API-Config)
    - [API Config Other](#API-Config-Other)
      - [IntervalTime](#IntervalTime)
      - [Method](#Method)
      - [PageRequestConfigCookies](#PageRequestConfigCookies)
    - [API Config Request](#API-Config-Request)
      - [PageRequestConfig](#PageRequestConfig)
      - [DataRequestConfig](#DataRequestConfig)
      - [FileRequestConfig](#FileRequestConfig)
    - [API Config Crawl](#API-Config-Crawl)
      - [XCrawlBaseConfig](#XCrawlBaseConfig)
      - [CrawlPageConfigObject](#CrawlPageConfigObject)
      - [CrawlDataConfigObject](#CrawlDataConfigObject)
      - [CrawlFileConfigObject](#CrawlFileConfigObject)
      - [StartPollingConfig](#StartPollingConfig)
  - [API Result](#API-Result)
    - [XCrawlInstance](#XCrawlInstance)
    - [CrawlCommonRes](#CrawlCommonRes)
    - [CrawlPageSingleRes](#CrawlPageSingleRes)
    - [CrawlDataSingleRes](#CrawlDataSingleRes)
    - [CrawlFileSingleRes](#CrawlFileSingleRes)
  - [API Other](#API-Other)
    - [AnyObject](#AnyObject)
- [More](#More)

## Install

Take NPM as an example:

```shell
npm install x-crawl
```

## Example

Take some pictures of Airbnb hawaii experience and Plus listings automatically every day as an example:

```js
// 1.Import module ES/CJS
import xCrawl from 'x-crawl'

// 2.Create a crawler instance
const myXCrawl = xCrawl({ maxRetry: 3, intervalTime: { max: 3000, min: 2000 } })

// 3.Set the crawling task
/*
  Call the startPolling API to start the polling function,
  and the callback function will be called every other day
*/
myXCrawl.startPolling({ d: 1 }, async (count, stopPolling) => {
  // Call crawlPage API to crawl Page
  const res = await myXCrawl.crawlPage([
    'https://zh.airbnb.com/s/hawaii/experiences',
    'https://zh.airbnb.com/s/hawaii/plus_homes'
  ])

  // Store the image URL
  const imgUrls = []
  const elSelectorMap = ['.c14whb16', '.a1stauiv']
  for (const item of res) {
    const { id } = item
    const { page } = item.data

    // Gets the URL of the page's wheel image element
    const boxHandle = await page.$(elSelectorMap[id - 1])
    const urls = await boxHandle.$$eval('picture img', (imgEls) => {
      return imgEls.map((item) => item.src)
    })
    imgUrls.push(...urls)

    // Close page
    page.close()
  }

  // Call the crawlFile API to crawl pictures
  myXCrawl.crawlFile({
    requestConfigs: imgUrls,
    fileConfig: { storeDir: './upload' }
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

Crawl a page via [crawlPage()](#crawlPage) .

```js
import xCrawl from 'x-crawl'

const myXCrawl = xCrawl()

myXCrawl.crawlPage('https://www.example.com').then((res) => {
  const { browser, page } = res.data

  // Close the browser
  browser.close()
})
```

#### browser instance

It is an instance object of [Browser](https://pptr.dev/api/puppeteer.browser). For specific usage, please refer to [Browser](https://pptr.dev/api/puppeteer.browser).

The browser instance is a headless browser without a UI shell. What he does is to bring **all modern network platform functions** provided by the browser rendering engine to the code.

**Note:** The browser will stay up and running, causing the file not to be terminated. If you want to stop, you can execute browser.close() to close it. Do not call [crawlPage](#crawlPage) or [page](#page) if you need to use it later. Because when you modify the properties of the browser instance, it will affect the browser instance inside the crawlPage API of the crawler instance, the page instance that returns the result, and the browser instance, because the browser instance is shared within the crawlPage API of the same crawler instance.

#### page instance

It is an instance object of [Page](https://pptr.dev/api/puppeteer.page). The instance can also perform interactive operations such as events. For specific usage, please refer to [page](https://pptr.dev /api/puppeteer. page).

The browser instance will retain a reference to the page instance. If it is no longer used in the future, the page instance needs to be closed by itself, otherwise it will cause a memory leak.

**Take Screenshot**

```js
import xCrawl from 'x-crawl'

const myXCrawl = xCrawl()

myXCrawl.crawlPage('https://www.example.com').then(async (res) => {
  const { browser, page } = res.data

  // Get a screenshot of the rendered page
  await page.screenshot({ path: './upload/page.png' })

  console.log('Screen capture is complete')

  browser.close()
})
```

### Crawl interface

Crawl interface data through [crawlData()](#crawlData) .

```js
import xCrawl from 'x-crawl'

const myXCrawl = xCrawl({ intervalTime: { max: 3000, min: 1000 } })

const requestConfigs = [
  'https://www.example.com/api-1',
  'https://www.example.com/api-2',
  {
    url: 'https://www.example.com/api-3',
    method: 'POST',
    data: { name: 'coderhxl' }
  }
]

myXCrawl.crawlData({ requestConfigs }).then((res) => {
  // deal with
})
```

### Crawl files

Crawl file data via [crawlFile()](#crawlFile) .

```js
import xCrawl from 'x-crawl'

const myXCrawl = xCrawl({ intervalTime: { max: 3000, min: 1000 } })

myXCrawl
  .crawlFile({
    requestConfigs: [
      'https://www.example.com/file-1',
      'https://www.example.com/file-2'
    ],
    fileConfig: {
      storeDir: './upload' // storage folder
    }
  })
  .then((res) => {
    console.log(res)
  })
```

#### life cycle

The crawlFile API has a lifetime function:

- beforeSave: executed before saving the file

##### beforeSave

In the beforeSave function you can get a file of type Buffer, which you can process and return a Promise and resolve as a Buffer.

**Resize picture**

Use the sharp library to resize the images to be crawled:

```js
import xCrawl from 'x-crawl'
import sharp from 'sharp'

const testXCrawl = xCrawl()

testXCrawl
  .crawlFile({
    requestConfigs: [
      'https://www.example.com/file-1.jpg',
      'https://www.example.com/file-2.jpg'
    ],
    fileConfig: {
      beforeSave(info) {
        return sharp(info.data).resize(200).toBuffer()
      }
    }
  })
  .then((res) => {
    res.forEach((item) => {
      console.log(item.data?.data.isSuccess)
    })
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
  const res = await myXCrawl.crawlPage('https://www.example.com')
  res.data.page.close()
})
```

**Using crawlPage in polling Note:** The purpose of calling page.close() is to prevent the browser instance from retaining references to the page instance. If the current page is no longer used in the future, it needs to be closed by itself, otherwise it will cause a memory leak.

Callback function parameters:

- The count attribute records the current number of polling operations.
- stopPolling is a callback function, calling it can terminate subsequent polling operations.

### Config priority

Some general configuration can be set in three places:

- Crawler application instance (global)
- Crawler API (local)
- Request configuration (separate)

The priority is: request config > API config > application config

### Interval time

The interval time can prevent too much concurrency and avoid too much pressure on the server.

The crawling interval is controlled internally by the instance method, not the entire crawling interval is controlled by the instance.

```js
import xCrawl from 'x-crawl'

const myXCrawl = xCrawl()

myXCrawl
  .crawlData({
    requestConfigs: [
      'https://www.example.com/api-1',
      'https://www.example.com/api-2'
    ],
    intervalTime: { max: 2000, min: 1000 }
  })
  .then((res) => {})
```

The intervalTime option defaults to undefined . If there is a setting value, it will wait for a period of time before requesting, which can prevent too much concurrency and avoid too much pressure on the server.

- number: The time that must wait before each request is fixed
- Object: Randomly select a value from max and min, which is more anthropomorphic

**Note:** The first request will not trigger the interval.

### Fail retry

Failed retry In the event of an error such as a timeout, the request will wait for the round to end and then retry.

```js
import xCrawl from 'x-crawl'

const myXCrawl = xCrawl()

myXCrawl
  .crawlData({ url: 'https://www.example.com/api', maxRetry: 1 })
  .then((res) => {})
```

The maxRetry attribute determines how many times to retry.

### Priority queue

A priority queue allows a request to be sent first.

```js
import xCrawl from 'x-crawl'

const myXCrawl = xCrawl()

myXCrawl
  .crawlData([
    { url: 'https://www.example.com/api-1', priority: 1 },
    { url: 'https://www.example.com/api-2', priority: 10 },
    { url: 'https://www.example.com/api-3', priority: 8 }
  ])
  .then((res) => {})
```

The larger the value of the priority attribute, the higher the priority in the current crawling queue.

### About results

For the result, the result of each request is uniformly wrapped with an object that provides information about the result of the request, such as id, result, success or not, maximum retry, number of retries, error information collected, and so on. Automatically determine whether the return value is wrapped in an array depending on the configuration you choose, and the type fits perfectly in TS.

The id of each object is determined according to the order of requests in your configuration, and if there is a priority used, it will be sorted by priority.

Details about configuration methods and results are as follows: [crawlPage config](#config), [crawlData config](#config-1), [crawlFile config](#config-2).

### TypeScript

Type systems like TypeScript can detect many common errors at compile time through static analysis. This reduces runtime errors and gives us more confidence when refactoring large projects. TypeScript also improves the development experience and efficiency through type-based auto-completion in the IDE.

x-crawl itself is written in TypeScript and supports TypeScript. Comes with a type declaration file, out of the box.

## API

### xCrawl

Create a crawler instance via call xCrawl. The request queue is maintained by the instance method itself, not by the instance itself.

#### Type

The xCrawl API is a function.

```ts
function xCrawl(baseConfig?: XCrawlBaseConfig): XCrawlInstance
```

**Parameter Type:**

- Look at the [XCrawlBaseConfig](#XCrawlBaseConfig) type

**Return value type:**

- View [XCrawlInstance](#XCrawlInstance) type

#### Example

```js
import xCrawl from 'x-crawl'

// xCrawl API
const myXCrawl = xCrawl({
  baseUrl: 'https://www.example.com',
  timeout: 10000,
  intervalTime: { max: 2000, min: 1000 }
})
```

**Note:** To avoid repeated creation of instances in subsequent examples, **myXCrawl** here will be the crawler instance in the **crawlPage/crawlData/crawlFile** example.

### crawlPage

crawlPage is the method of the crawler instance, usually used to crawl page.

#### Type

The crawlPage API is a function. A type is an [overloaded function](https://www.typescriptlang.org/docs/handbook/2/functions.html#function-overloads) which can be called (in terms of type) with different configuration parameters.

```ts
type crawlPage = {
  (
    config: string,
    callback?: (res: CrawlPageSingleRes) => void
  ): Promise<CrawlPageSingleRes>

  (
    config: PageRequestConfig,
    callback?: (res: CrawlPageSingleRes) => void
  ): Promise<CrawlPageSingleRes>

  (
    config: (string | PageRequestConfig)[],
    callback?: (res: CrawlPageSingleRes) => void
  ): Promise<CrawlPageSingleRes[]>

  (
    config: CrawlPageConfigObject,
    callback?: (res: CrawlPageSingleRes) => void
  ): Promise<CrawlPageSingleRes[]>
}
```

**Parameter Type:**

- Look at the [PageRequestConfig](#PageRequestConfig) type
- Look at the [CrawlPageConfigObject](#CrawlPageConfigObject) type

**Return value type:**

- Look at the [CrawlPageSingleRes](#CrawlPageSingleRes) type

#### Example

```js
import xCrawl from 'x-crawl'

const myXCrawl = xCrawl()

// crawlPage API
myXCrawl.crawlPage('https://www.example.com').then((res) => {
  const { browser, page } = res.data

  // Close the browser
  browser.close()
})
```

#### Config

There are 4 types:

- string
- PageRequestConfig
- (string | PageRequestConfig)[]
- CrawlPageConfigObject

**1.string**

If you just want to simply crawl this page, you can try this way of writing:

```js
import xCrawl from 'x-crawl'

const myXCrawl = xCrawl()

myXCrawl.crawlPage('https://www.example.com').then((res) => {})
```

The res you get will be an object.

**2. PageRequestConfig**

More configuration options of PageRequestConfig can be found in [PageRequestConfig](#PageRequestConfig) .

If you want to crawl this page and need to retry on failure, you can try this way of writing:

```js
import xCrawl from 'x-crawl'

const myXCrawl = xCrawl()

myXCrawl
  .crawlPage({
    url: 'https://www.example.com',
    proxy: 'xxx',
    maxRetry: 1
  })
  .then((res) => {})
```

The res you get will be an object.

**3.(string | PageRequestConfig)[]**

More configuration options of PageRequestConfig can be found in [PageRequestConfig](#PageRequestConfig) .

If you want to crawl multiple pages, and some pages need to fail and retry, you can try this way of writing:

```js
import xCrawl from 'x-crawl'

const myXCrawl = xCrawl()

myXCrawl
  .crawlPage([
    'https://www.example.com/page-1',
    { url: 'https://www.example.com/page-2', maxRetry: 2 }
  ])
  .then((res) => {})
```

The res you get will be an array of objects.

**4. CrawlPageConfigObject**

For more configuration options of CrawlPageConfigObject, please refer to [CrawlPageConfigObject](#CrawlPageConfigObject) .

If you want to crawl multiple pages, and the request configuration (proxy, cookies, retry, etc.) does not want to be written repeatedly, if you need an interval, you can try this way of writing:

```js
import xCrawl from 'x-crawl'

const myXCrawl = xCrawl()

myXCrawl
  .crawlPage({
    requestConfigs: [
      'https://www.example.com/page-1',
      { url: 'https://www.example.com/page-2', maxRetry: 6 }
    ],
    intervalTime: { max: 3000, min: 1000 },
    cookies: 'xxx',
    maxRetry: 1
  })
  .then((res) => {})
```

The res you get will be an array of objects.

More information about the results can be found at [About results](#About-results) , which can be selected according to the actual situation.

### crawlData

crawlData is the method of the crawler instance, which is usually used to crawl APIs to obtain JSON data and so on.

#### Type

The crawlData API is a function. A type is an [overloaded function](https://www.typescriptlang.org/docs/handbook/2/functions.html#function-overloads) which can be called (in terms of type) with different configuration parameters.

```ts
type crawlData = {
  <T = any>(
    config: DataRequestConfig,
    callback?: (res: CrawlDataSingleRes<T>) => void
  ): Promise<CrawlDataSingleRes<T>>

  <T = any>(
    config: string,
    callback?: (res: CrawlDataSingleRes<T>) => void
  ): Promise<CrawlDataSingleRes<T>>

  <T = any>(
    config: (string | DataRequestConfig)[],
    callback?: (res: CrawlDataSingleRes<T>) => void
  ): Promise<CrawlDataSingleRes<T>[]>

  <T = any>(
    config: CrawlDataConfigObject,
    callback?: (res: CrawlDataSingleRes<T>) => void
  ): Promise<CrawlDataSingleRes<T>[]>
}
```

**Parameter Type:**

- See [DataRequestConfig](#DataRequestConfig) type
- Look at the [CrawlDataConfigObject](#CrawlDataConfigObject) type

**Return value type:**

- Look at the [CrawlDataSingleRes](#CrawlDataSingleRes) type

#### Example

```js
import xCrawl from 'x-crawl'

const myXCrawl = xCrawl({
  timeout: 10000,
  intervalTime: { max: 2000, min: 1000 }
})

myXCrawl
  .crawlData({
    requestConfigs: [
      'https://www.example.com/api-1',
      'https://www.example.com/api-2'
    ],
    intervalTime: { max: 3000, min: 1000 },
    cookies: 'xxx',
    maxRetry: 1
  })
  .then((res) => {
    console.log(res)
  })
```

#### Config

There are 4 types:

- string
- DataRequestConfig
- (string | DataRequestConfig)[]
- CrawlDataConfigObject

**1.string**

If you just want to simply crawl the data, and the interface is GET, you can try this way of writing:

```js
import xCrawl from 'x-crawl'

const myXCrawl = xCrawl()

myXCrawl.crawlData('https://www.example.com/api').then((res) => {})
```

The res you get will be an object.

**2. DataRequestConfig**

More configuration options of DataRequestConfig can be found in [DataRequestConfig](#DataRequestConfig) .

If you want to crawl this data and need to retry on failure, you can try this way of writing:

```js
import xCrawl from 'x-crawl'

const myXCrawl = xCrawl()

myXCrawl
  .crawlData({
    url: 'https://www.example.com/api',
    proxy: 'xxx',
    maxRetry: 1
  })
  .then((res) => {})
```

The res you get will be an object.

**3.(string | DataRequestConfig)[]**

More configuration options of DataRequestConfig can be found in [DataRequestConfig](#DataRequestConfig) .

If you want to crawl multiple data, and some data needs to fail and retry, you can try this way of writing:

```js
import xCrawl from 'x-crawl'

const myXCrawl = xCrawl()

myXCrawl
  .crawlData([
    'https://www.example.com/api-1',
    { url: 'https://www.example.com/api-2', maxRetry: 2 }
  ])
  .then((res) => {})
```

The res you get will be an array of objects.

**4. CrawlDataConfigObject**

For more configuration options of CrawlPageConfigObject, please refer to [CrawlPageConfigObject](#CrawlPageConfigObject) .

If you want to crawl multiple data, and the request configuration (proxy, cookies, retry, etc.) does not want to be written repeatedly, if you need an interval, you can try this writing method:

```js
import xCrawl from 'x-crawl'

const myXCrawl = xCrawl()

myXCrawl
  .crawlData({
    requestConfigs: [
      'https://www.example.com/api-1',
      { url: 'https://www.example.com/api-2', maxRetry: 6 }
    ],
    intervalTime: { max: 3000, min: 1000 },
    cookies: 'xxx',
    maxRetry: 1
  })
  .then((res) => {})
```

The res you get will be an array of objects.

More information about the results can be found at [About results](#About-results) , which can be selected according to the actual situation.

### crawlFile

crawlFile is the method of the crawler instance, which is usually used to crawl files, such as pictures, pdf files, etc.

#### Type

The crawlFile API is a function. A type is an [overloaded function](https://www.typescriptlang.org/docs/handbook/2/functions.html#function-overloads) which can be called (in terms of type) with different configuration parameters.

```ts
type crawlFile = {
  (
    config: FileRequestConfig,
    callback?: (res: CrawlFileSingleRes) => void
  ): Promise<CrawlFileSingleRes>

  (
    config: FileRequestConfig[],
    callback?: (res: CrawlFileSingleRes) => void
  ): Promise<CrawlFileSingleRes[]>

  (
    config: CrawlFileConfigObject,
    callback?: (res: CrawlFileSingleRes) => void
  ): Promise<CrawlFileSingleRes[]>
}
```

**Parameter Type:**

- See [FileRequestConfig](#FileRequestConfig) type
- Look at the [CrawlFileConfigObject](#CrawlFileConfigObject) type

**Return value type:**

- Look at the [CrawlFileSingleRes](#CrawlFileSingleRes) type

#### Example

```js
import xCrawl from 'x-crawl'

const myXCrawl = xCrawl({
  timeout: 10000,
  intervalTime: { max: 2000, min: 1000 }
})

// crawlFile API
myXCrawl
  .crawlFile({
    requestConfigs: [
      'https://www.example.com/file-1',
      'https://www.example.com/file-2'
    ],
    storeDir: './upload',
    intervalTime: { max: 3000, min: 1000 },
    maxRetry: 1
  })
  .then((res) => {})
```

#### Config

There are 3 types:

- FileRequestConfig

- FileRequestConfig[]
- CrawlFileConfigObject

**1. FileRequestConfig**

More configuration options of FileRequestConfig can be found in [FileRequestConfig](#FileRequestConfig) .

If you want to crawl this file and need to retry on failure, you can try this way of writing:

```js
import xCrawl from 'x-crawl'

const myXCrawl = xCrawl()

myXCrawl
  .crawlFile({
    url: 'https://www.example.com/file',
    proxy: 'xxx',
    maxRetry: 1,
    storeDir: './upload',
    fileName: 'xxx'
  })
  .then((res) => {})
```

The res you get will be an object.

**2. FileRequestConfig[]**

More configuration options of FileRequestConfig can be found in [FileRequestConfig](#FileRequestConfig) .

If you want to crawl multiple files, and some data needs to be retried after failure, you can try this way of writing:

```js
import xCrawl from 'x-crawl'

const myXCrawl = xCrawl()

myXCrawl
  .crawlFile([
    { url: 'https://www.example.com/file-1', storeDir: './upload' },
    { url: 'https://www.example.com/file-2', storeDir: './upload', maxRetry: 2 }
  ])
  .then((res) => {})
```

The res you get will be an array of objects.

**3. CrawlFileConfigObject**

For more configuration options of CrawlFileConfigObject, please refer to [CrawlFileConfigObject](#CrawlFileConfigObject) .

If you want to crawl multiple data, and the request configuration (storeDir, proxy, retry, etc.) does not want to be written repeatedly, and you need interval time, etc., you can try this way of writing:

```js
import xCrawl from 'x-crawl'

const myXCrawl = xCrawl()

myXCrawl
  .crawlFile({
    requestConfigs: [
      'https://www.example.com/file-1',
      { url: 'https://www.example.com/file-2', storeDir: './upload/xxx' }
    ],
    storeDir: './upload',
    intervalTime: { max: 3000, min: 1000 },
    maxRetry: 1
  })
  .then((res) => {})
```

The res you get will be an array of objects.

More information about the results can be found at [About results](#About-results) , which can be selected according to the actual situation.

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

### API Config

#### API Config Other

##### IntervalTime

```ts
export type IntervalTime = number | { max: number; min?: number }
```

##### Method

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

##### PageRequestConfigCookies

```ts
export type PageRequestConfigCookies =
  | string
  | Protocol.Network.CookieParam
  | Protocol.Network.CookieParam[]
```

#### API Config Request

##### PageRequestConfig

```ts
export interface PageRequestConfig {
  url: string
  headers?: AnyObject
  timeout?: number
  proxy?: string
  cookies?: PageRequestConfigCookies
  maxRetry?: number
  priority?: number
}
```

##### DataRequestConfig

```ts
export interface DataRequestConfig {
  url: string
  method?: Method
  headers?: AnyObject
  params?: AnyObject
  data?: any
  timeout?: number
  proxy?: string
  maxRetry?: number
  priority?: number
}
```

##### FileRequestConfig

```ts
export interface FileRequestConfig {
  url: string
  headers?: AnyObject
  timeout?: number
  proxy?: string
  maxRetry?: number
  priority?: number
  storeDir?: string
  fileName?: string
  extension?: string
}
```

#### API Config Crawl

##### XCrawlBaseConfig

```ts
export interface XCrawlBaseConfig {
  baseUrl?: string
  timeout?: number
  intervalTime?: IntervalTime
  mode?: 'async' | 'sync'
  proxy?: string
  maxRetry?: number
}
```

##### CrawlPageConfigObject

```ts
export interface CrawlPageConfigObject {
  requestConfigs: (string | PageRequestConfig)[]
  proxy?: string
  timeout?: number
  cookies?: PageRequestConfigCookies
  intervalTime?: IntervalTime
  maxRetry?: number
}
```

##### CrawlDataConfigObject

```ts
export interface CrawlDataConfigObject {
  requestConfigs: (string | DataRequestConfig)[]
  proxy?: string
  timeout?: number
  intervalTime?: IntervalTime
  maxRetry?: number
}
```

##### CrawlFileConfigObject

```ts
export interface CrawlFileConfigObject {
  requestConfigs: (string | FileRequestConfig)[]
  proxy?: string
  timeout?: number
  intervalTime?: IntervalTime
  maxRetry?: number
  fileConfig?: {
    storeDir?: string
    extension?: string
    beforeSave?: (info: {
      id: number
      fileName: string
      filePath: string
      data: Buffer
    }) => Promise<Buffer>
  }
}
```

##### startPollingConfig

```js
export interface StartPollingConfig {
  d?: number
  h?: number
  m?: number
}
```

### API Result

#### XCrawlInstance

```ts
export interface XCrawlInstance {
  crawlPage: {
    (
      config: string,
      callback?: (res: CrawlPageSingleRes) => void
    ): Promise<CrawlPageSingleRes>

    (
      config: PageRequestConfig,
      callback?: (res: CrawlPageSingleRes) => void
    ): Promise<CrawlPageSingleRes>

    (
      config: (string | PageRequestConfig)[],
      callback?: (res: CrawlPageSingleRes) => void
    ): Promise<CrawlPageSingleRes[]>

    (
      config: CrawlPageConfigObject,
      callback?: (res: CrawlPageSingleRes) => void
    ): Promise<CrawlPageSingleRes[]>
  }

  crawlData: {
    <T = any>(
      config: DataRequestConfig,
      callback?: (res: CrawlDataSingleRes<T>) => void
    ): Promise<CrawlDataSingleRes<T>>

    <T = any>(
      config: string,
      callback?: (res: CrawlDataSingleRes<T>) => void
    ): Promise<CrawlDataSingleRes<T>>

    <T = any>(
      config: (string | DataRequestConfig)[],
      callback?: (res: CrawlDataSingleRes<T>) => void
    ): Promise<CrawlDataSingleRes<T>[]>

    <T = any>(
      config: CrawlDataConfigObject,
      callback?: (res: CrawlDataSingleRes<T>) => void
    ): Promise<CrawlDataSingleRes<T>[]>
  }

  crawlFile: {
    (
      config: FileRequestConfig,
      callback?: (res: CrawlFileSingleRes) => void
    ): Promise<CrawlFileSingleRes>

    (
      config: FileRequestConfig[],
      callback?: (res: CrawlFileSingleRes) => void
    ): Promise<CrawlFileSingleRes[]>

    (
      config: CrawlFileConfigObject,
      callback?: (res: CrawlFileSingleRes) => void
    ): Promise<CrawlFileSingleRes[]>
  }

  startPolling: (
    config: StartPollingConfig,
    callback: (count: number, stopPolling: () => void) => void
  ) => void
}
```

#### CrawlCommonRes

```ts
export interface CrawlCommonRes {
  id: number
  isSuccess: boolean
  maxRetry: number
  crawlCount: number
  retryCount: number
  errorQueue: Error[]
}
```

#### CrawlPageSingleRes

```ts
export interface CrawlPageSingleRes extends CrawlCommonRes {
  data: {
    browser: Browser
    response: HTTPResponse | null
    page: Page
  }
}
```

#### CrawlDataSingleRes

```ts
export interface CrawlDataSingleRes<D> extends CrawlCommonRes {
  data: {
    statusCode: number | undefined
    headers: IncomingHttpHeaders
    data: D
  } | null
}
```

#### CrawlFileSingleRes

```ts
export interface CrawlFileSingleRes extends CrawlCommonRes {
  data: {
    statusCode: number | undefined
    headers: IncomingHttpHeaders
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

### API Other

#### AnyObject

```ts
export interface AnyObject extends Object {
  [key: string | number | symbol]: any
}
```

## More

If you have **problems, needs, good suggestions** please raise **Issues** in https://github.com/coder-hxl/x-crawl/issues.

thank you for your support.
