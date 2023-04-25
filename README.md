# x-crawl · [![npm](https://img.shields.io/npm/v/x-crawl.svg)](https://www.npmjs.com/package/x-crawl) [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/coder-hxl/x-crawl/blob/main/LICENSE)

English | [简体中文](https://github.com/coder-hxl/x-crawl/blob/main/docs/cn.md)

x-crawl is a flexible Node.js multipurpose crawler library. The usage is flexible, and there are many built-in functions for crawl pages, crawl interfaces, crawl files, etc.

> If you also like x-crawl, you can give [x-crawl repository](https://github.com/coder-hxl/x-crawl) a star to support it, thank you for your support!

## Features

- **🔥 Asynchronous Synchronous** - Just change the mode property to toggle asynchronous or synchronous crawling mode.
- **⚙️ Multiple purposes** - It can crawl pages, crawl interfaces, crawl files and poll crawls to meet the needs of various scenarios.
- **🖋️ Flexible writing style** - The same crawling API can be adapted to multiple configurations, and each configuration method is very unique.
- **⏱️ Interval Crawling** - No interval, fixed interval and random interval to generate or avoid high concurrent crawling.
- **🔄 Failed Retry** - Avoid crawling failure due to short-term problems, and customize the number of retries.
- **➡️ Proxy Rotation** - Auto-rotate proxies with failure retry, custom error times and HTTP status codes.
- **👀 Device Fingerprinting** - Zero configuration or custom configuration, avoid fingerprinting to identify and track us from different locations.
- **🚀 Priority Queue** - According to the priority of a single crawling target, it can be crawled ahead of other targets.
- **☁️ Crawl SPA** - Crawl SPA (Single Page Application) to generate pre-rendered content (aka "SSR" (Server Side Rendering)).
- **⚒️ Control Page** - You can submit form, keyboard input, event operation, generate screenshots of the page, etc.
- **🧾 Capture Record** - Capture and record crawling, and use colored strings to remind in the terminal.
- **🦾 TypeScript** - Own types, implement complete types through generics.

## Relationship with Puppeteer

The crawlPage API has built-in [puppeteer](https://github.com/puppeteer/puppeteer), you only need to pass in some configuration options to complete some operations, the result will expose the Brower instance and Page instance, you get Brower instance and Page instance will be intact, x-crawl will not rewrite them.

# Table of Contents

- [Install](#Install)
- [Example](#Example)
- [Core Concepts](#Core-Concepts)
  - [Create Application](#Create-Application)
    - [An Example of a Crawler Application](#An-Example-of-a-Crawler-Application)
    - [Crawl Mode](#Crawl-Mode)
    - [Default Device Fingerprint](#Default-Device-Fingerprint)
    - [Multiple Crawler Application Anstances](#Multiple-Crawler-Application-Instances)
  - [Crawl Page](#Crawl-Page)
    - [Browser Instance](#Browser-Instance)
    - [Page Instance](#Page-Instance)
    - [life Cycle](#life-Cycle)
      - [onCrawlItemComplete](#onCrawlItemComplete)
  - [Crawl Interface](#Crawl-Interface)
    - [life Cycle](#life-Cycle-1)
      - [onCrawlItemComplete](#onCrawlItemComplete-1)
  - [Crawl Files](#Crawl-Files)
    - [life Cycle](#life-Cycle)
      - [onCrawlItemComplete](#onCrawlItemComplete-2)
      - [onBeforeSaveItemFile](#onBeforeSaveItemFile)
  - [Start Polling](#Start-Polling)
  - [Config Priority](#Config-Priority)
  - [Interval Time](#Interval-Time)
  - [Fail Retry](#Fail-Retry)
  - [Rotate Proxy](#Rotate Proxy)
  - [Custom Device Fingerprint](#Custom-Device-Fingerprint)
  - [Priority Queue](#Priority-Queue)
  - [About Results](#About-Results)
  - [TypeScript](#TypeScript)
- [API](#API)
  - [xCrawl](#xCrawl)
    - [Type](#Type)
    - [Example](#Example-1)
  - [crawlPage](#crawlPage)
    - [Type](#Type-1)
    - [Example](#Example-2)
    - [Config](#Config)
      - [Simple target config - string](#Simple-target-config---string)
      - [Detailed target config - CrawlPageDetailTargetConfig](#Detailed-target-config---CrawlPageDetailTargetConfig)
      - [Mixed target array config - (string | CrawlPageDetailTargetConfig)[]](#Mixed-target-array-config---string--CrawlPageDetailTargetConfig)
      - [Advanced config - CrawlPageAdvancedConfig](#Advanced-config---CrawlPageAdvancedConfig)
  - [crawlData](#crawlData)
    - [Type](#Type-2)
    - [Example](#Example-3)
    - [Config](#Config-1)
      - [Simple target config - string](#Simple-target-config---string-1)
      - [Detailed target config - CrawlDataDetailTargetConfig](#Detailed-target-config---CrawlDataDetailTargetConfig)
      - [Mixed target array config - (string | CrawlDataDetailTargetConfig)[]](#Mixed-target-array-config---string--CrawlDataDetailTargetConfig)
      - [Advanced config - CrawlDataAdvancedConfig](#Advanced-config---CrawlDataAdvancedConfig)
  - [crawlFile](#crawlFile)
    - [Type](#Type-3)
    - [Example](#Example-4)
    - [Config](#Config-2)
      - [Detailed target config - CrawlFileDetailTargetConfig](#Detailed-target-config---CrawlFileDetailTargetConfig)
      - [Detailed target array config - CrawlFileDetailTargetConfig[]](#Detailed-target-array-config---CrawlFileDetailTargetConfig)
      - [Advanced config - CrawlFileAdvancedConfig](#Advanced-config-CrawlFileAdvancedConfig)
  - [crawlPolling](#crawlPolling)
    - [Type](#Type-4)
    - [Example](#Example-5)
- [Types](#Types)
  - [API Config](#API-Config)
    - [XCrawlConfig](#XCrawlConfig)
    - [Detail Target Config](#Detail-Target-Config)
      - [CrawlPageDetailTargetConfig](#CrawlPageDetailTargetConfig)
      - [CrawlDataDetailTargetConfig](#CrawlDataDetailTargetConfig)
      - [CrawlFileDetailTargetConfig](#CrawlFileDetailTargetConfig)
    - [Advanced Config](#Advanced-Config)
      - [CrawlPageAdvancedConfig](#CrawlPageAdvancedConfig)
      - [CrawlDataAdvancedConfig](#CrawlDataAdvancedConfig)
      - [CrawlFileAdvancedConfig](#CrawlFileAdvancedConfig)
    - [StartPollingConfig](#StartPollingConfig)
    - [Crawl Other Config](#Crawl-Other-Config)
      - [CrawlCommonConfig](#CrawlCommonConfig)
      - [DetailTargetFingerprintCommon](#DetailTargetFingerprintCommon)
      - [Mobile](#Mobile)
      - [Platform](#Platform)
      - [PageCookies](#PageCookies)
      - [Method](#Method)
      - [IntervalTime](#IntervalTime)
  - [API Result](#API-Result)
    - [XCrawlInstance](#XCrawlInstance)
    - [CrawlCommonResult](#CrawlCommonResult)
    - [CrawlPageSingleResult](#CrawlPageSingleResult)
    - [CrawlDataSingleResult](#CrawlDataSingleResult)
    - [CrawlFileSingleResult](#CrawlFileSingleResult)
  - [API Other](#API-Other)
    - [AnyObject](#AnyObject)
- [More](#More)

## Install

Take NPM as an example:

```shell
npm install x-crawl
```

## Example

Take the automatic acquisition of photos of experiences and homes in hawaii every day as an example::

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
    'https://zh.airbnb.com/s/hawaii/homes'
  ])

  // Store the image URL to targets
  const targets = []
  const elSelectorMap = ['.c14whb16', '.l196t2l1']
  for (const item of res) {
    const { id } = item
    const { page } = item.data
    const boxSelector = elSelectorMap[id - 1]

    // Wait for the image element to appear
    await page.waitForSelector(`${boxSelector} img`)

    // Gets the URL of the page's wheel image element
    const boxHandle = await page.$(boxSelector)
    const urls = await boxHandle.$$eval('picture img', (imgEls) => {
      return imgEls.map((item) => item.src)
    })
    targets.push(...urls)

    // Close page
    page.close()
  }

  // Call the crawlFile API to crawl pictures
  myXCrawl.crawlFile({ targets, storeDir: './upload' })
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

## Core Concepts

### Create Application

#### An Example of a Crawler Application

Create a new **application instance** via [xCrawl()](#xCrawl):

```js
import xCrawl from 'x-crawl'

const myXCrawl = xCrawl({
  // options
})
```

Related **options** can refer to [XCrawlBaseConfig](#XCrawlBaseConfig) .

#### Crawl Mode

A crawler application instance has two crawling modes: asynchronous/synchronous, and each crawler instance can only choose one of them.

```js
import xCrawl from 'x-crawl'

const myXCrawl = xCrawl({
  mode: 'async'
})
```

The mode option defaults to async .

- async: Asynchronous crawling target, no need to wait for the current crawling target to complete, then proceed to the next crawling target
- sync: Synchronize the crawling target. You need to wait for the completion of this crawling target before proceeding to the next crawling target

If there is an interval time set, it is necessary to wait for the end of the interval time before crawling the next target.

**Note:** The crawling process of the crawling API is performed separately, and this mode is only valid for batch crawling targets.

#### Default Device Fingerprint

A property can be used to control whether to use the default random fingerprint, or you can configure a custom fingerprint through subsequent crawling.

Device fingerprinting is set up to avoid identifying and tracking us from different locations through fingerprinting.

```js
import xCrawl from 'x-crawl'

const myXCrawl = xCrawl({
  enableRandomFingerprint: true
})
```

The enableRandomFingerprint option defaults to true.

- true: Enable random device fingerprinting. The fingerprint configuration of the target can be specified through advanced configuration or detailed target configuration.
- false: Turns off random device fingerprinting, does not affect the fingerprint configuration specified for the target by advanced configuration or detailed target configuration.

#### Multiple Crawler Application Instances

```js
import xCrawl from 'x-crawl'

const myXCrawl1 = xCrawl({
  // options
})

const myXCrawl2 = xCrawl({
  // options
})
```

### Crawl Page

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

#### Browser Instance

When you call crawlPage API to crawl pages in the same crawler instance, the browser instance used is the same, because the crawlPage API of the browser instance in the same crawler instance is shared. It's a headless browser, no UI shell, what he does is bring **all modern web platform features** provided by the browser rendering engine to the code. For specific usage, please refer to [Browser](https://pptr.dev/api/puppeteer.browser).

**Note:** The browser will keep running and the file will not be terminated. If you want to stop, you can execute browser.close() to close it. Do not call [crawlPage](#crawlPage) or [page](#page) if you need to use it later. Because the crawlPage API of the browser instance in the same crawler instance is shared.

#### Page Instance

When you call crawlPage API to crawl pages in the same crawler instance, a new page instance will be generated from the browser instance. It can be used for interactive operations. For specific usage, please refer to [Page](https://pptr.dev/api/puppeteer.page).

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

#### life Cycle

Lifecycle functions owned by the crawlPage API:

- onCrawlItemComplete: Call back when each crawl is complete

##### onCrawlItemComplete

In the onCrawlItemComplete function, you can get the results of each crawled goal in advance.

**Note:** If you need to crawl many pages at one time, you need to use this life cycle function to process the results of each target and close the page instance after each page is crawled down. If you do not close the page instance, then The program will crash due to too many opened pages.

### Crawl Interface

Crawl interface data through [crawlData()](#crawlData) .

```js
import xCrawl from 'x-crawl'

const myXCrawl = xCrawl({ intervalTime: { max: 3000, min: 1000 } })

const targets = [
  'https://www.example.com/api-1',
  'https://www.example.com/api-2',
  {
    url: 'https://www.example.com/api-3',
    method: 'POST',
    data: { name: 'coderhxl' }
  }
]

myXCrawl.crawlData({ targets }).then((res) => {
  // deal with
})
```

#### life Cycle

Life cycle functions owned by crawlData API:

- onCrawlItemComplete: Call back when each crawl is complete

##### onCrawlItemComplete

In the onCrawlItemComplete function, you can get the results of each crawled goal in advance.

### Crawl Files

Crawl file data via [crawlFile()](#crawlFile) .

```js
import xCrawl from 'x-crawl'

const myXCrawl = xCrawl({ intervalTime: { max: 3000, min: 1000 } })

myXCrawl
  .crawlFile({
    targets: [
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

#### life Cycle

Life cycle functions owned by crawlFile API:

- onCrawlItemComplete: Call back when each crawl is complete

- onBeforeSaveItemFile: Callback before saving the file

##### onCrawlItemComplete

In the onCrawlItemComplete function, you can get the results of each crawled goal in advance.

##### onBeforeSaveItemFile

In the onBeforeSaveItemFile function, you can get the Buffer type file, you can process the Buffer, and then you need to return a Promise, and the resolve is a Buffer, which will replace the obtained Buffer and store it in the file.

**Resize Picture**

Use the sharp library to resize the images to be crawled:

```js
import xCrawl from 'x-crawl'
import sharp from 'sharp'

const myXCrawl = xCrawl()

myXCrawl
  .crawlFile({
    targets: [
      'https://www.example.com/file-1.jpg',
      'https://www.example.com/file-2.jpg'
    ],
    fileConfig: {
      onBeforeSaveItemFile(info) {
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

### Start Polling

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

**Using crawlPage in polling Note:** The browser instance will retain a reference to the page instance. If it is no longer used in the future, you need to close the page instance yourself, otherwise it will cause a memory leak.

Callback function parameters:

- The count attribute records the current number of polling operations.
- stopPolling is a callback function, calling it can terminate subsequent polling operations.

### Config Priority

Some common configurations can be set in these three places:

- Application instance configuration (global)
- Advanced configuration (partial)
- Detailed target configuration (separately)

The priority is: detailed target configuration > advanced configuration > application instance configuration

Take crawlPage to crawl two pages as an example:

```js
import xCrawl from 'x-crawl'

// Application instance configurationconst testXCrawl = xCrawl({
  proxy: {
    urls: [
      'https://www.example.com/proxy-1',
      'https://www.example.com/proxy-2',
      'https://www.example.com/proxy-3'
    ],
    switchByErrorCount: 3,
    switchByHttpStatus: [401, 403]
  }
})

// Advanced configuration
testXCrawl
  .crawlPage({
    targets: [
      'https://www.example.com/page-1',
      'https://www.example.com/page-2',
      // Detailed target configuration
      {
        url: 'https://www.example.com/page-3',
        proxy: { urls: ['https://www.example.com/proxy-5'] }
      }
    ],
    maxRetry: 10,
    proxy: {
      urls: [
        'https://www.example.com/proxy-3',
        'https://www.example.com/proxy-4'
      ],
      switchByErrorCount: 3,
      switchByHttpStatus: [401, 403]
    }
  })
  .then((res) => {})
})
```

In the above example, **Proxy** is set in **Application Instance Configuration**, **Advanced Configuration** and **Detailed Target Configuration**, page3 will use its own proxy configuration, page1 and page2 will use the proxy configuration of the advanced configuration.

### Interval Time

The interval time can prevent too much concurrency and avoid too much pressure on the server.

The crawling interval is controlled by the crawling API itself, not by the crawler instance.

```js
import xCrawl from 'x-crawl'

const myXCrawl = xCrawl()

myXCrawl
  .crawlData({
    targets: ['https://www.example.com/api-1', 'https://www.example.com/api-2'],
    intervalTime: { max: 2000, min: 1000 }
  })
  .then((res) => {})
```

The intervalTime option defaults to undefined . If there is a setting value, it will wait for a period of time before requesting, which can prevent too much concurrency and avoid too much pressure on the server.

- number: The time that must wait before each crawl target is fixed
- IntervalTime: Take a random value among max and min

**Note:** The first crawl target will not trigger the interval.

### Fail Retry

It can avoid crawling failure due to temporary problems, and will wait for the end of this round of crawling targets to crawl again.

The number of failed retries can be set by creating crawler application instance, advanced usage, and detailed target.

```js
import xCrawl from 'x-crawl'

const myXCrawl = xCrawl()

myXCrawl
  .crawlData({ url: 'https://www.example.com/api', maxRetry: 9 })
  .then((res) => {})
```

The maxRetry attribute determines how many times to retry.

### Rotate Proxy

With failed retries, custom error times and HTTP status codes, the proxy is automatically rotated for crawling targets.

You can set the number of failed retries in the three places of creating a crawler application instance, advanced usage, and detailed goals.

Take crawlPage as an example:

```js
import xCrawl from 'x-crawl'

const testXCrawl = xCrawl()

testXCrawl
  .crawlPage({
    targets: [
      'https://www.example.com/page-1',
      'https://www.example.com/page-2',
      'https://www.example.com/page-3',
      'https://www.example.com/page-4',
      // Undelegate for this target
      { url: 'https://www.example.com/page-6', proxy: null },
      // Set the proxy individually for this target
      {
        url: 'https://www.example.com/page-6',
        proxy: {
          urls: [
            'https://www.example.com/proxy-4',
            'https://www.example.com/proxy-5'
          ],
          switchByErrorCount: 3
        }
      }
    ],
    maxRetry: 10,
    // Set the proxy uniformly for this target
    proxy: {
      urls: [
        'https://www.example.com/proxy-1',
        'https://www.example.com/proxy-2',
        'https://www.example.com/proxy-3'
      ],
      switchByErrorCount: 3,
      switchByHttpStatus: [401, 403]
    }
  })
  .then((res) => {})
```

**Note:** This function needs to cooperate with failure retry to work normally.

### Custom Device Fingerprint

Customize the configuration of device fingerprints to avoid identifying and tracking us from different locations through fingerprint recognition.

Multiple information can be passed in fingerprints through advanced usage, and internally it will help you randomly assign each target to targets. It is also possible to set a specific fingerprint for a target directly with the detailed target configuration.

Take crawlPage as an example:

```js
import xCrawl from 'x-crawl'

const myXCrawl = xCrawl({ intervalTime: { max: 5000, min: 3000 } })

myXCrawl.crawlPage({
  targets: [
    'https://www.example.com/page-1',
    'https://www.example.com/page-2',
    'https://www.example.com/page-3',
    // Unfingerprint for this target
    { url: 'https://www.example.com/page-4', fingerprint: null },
    // Set the fingerprint individually for this target
    {
      url: 'https://www.example.com/page-5',
      fingerprint: {
        mobile: 'random',
        platform: 'Windows',
        acceptLanguage: `zh-CN,zh;q=0.9,en;q=0.8`,
        userAgent: {
          value:
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36',
          versions: [
            { name: 'Chrome', maxMinorVersion: 10, maxPatchVersion: 5615 },
            { name: 'Safari', maxMinorVersion: 36, maxPatchVersion: 2333 }
          ]
        }
      }
    }
  ],
  // Set the fingerprint uniformly for this target
  fingerprints: [
    {
      maxWidth: 1024,
      maxHeight: 800,
      platform: 'Windows',
      mobile: 'random',
      userAgent: {
        value:
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36',
        versions: [
          {
            name: 'Chrome',
            // browser version
            maxMajorVersion: 112,
            minMajorVersion: 100,
            maxMinorVersion: 20,
            maxPatchVersion: 5000
          },
          {
            name: 'Safari',
            maxMajorVersion: 537,
            minMajorVersion: 500,
            maxMinorVersion: 36,
            maxPatchVersion: 5000
          }
        ]
      }
    }
  ]
})
```

For more fingerprint options, you can go to the corresponding configuration to view.

### Priority Queue

A priority queue allows a crawl target to be sent first.

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

### About Results

Each crawl target will generate a detail object, which will contain the following properties:

- id: Generated according to the order of crawling targets, if there is a priority, it will be generated according to the priority
- isSuccess: Whether to crawl successfully
- maxRetry: The maximum number of retries for this crawling target
- retryCount: The number of times the crawling target has been retried
- proxyDetails: record the proxy situation
- crawlErrorQueue: Error collection of the crawl target
- data: the crawling data of the crawling target

If it is a specific configuration, it will automatically determine whether the details object is stored in an array according to the configuration method you choose, and return the array, otherwise return the details object. Already fits types perfectly in TypeScript.

Details about configuration methods and results are as follows: [crawlPage config](#config), [crawlData config](#config-1), [crawlFile config](#config-2).

### TypeScript

Type systems like TypeScript can detect many common errors at compile time through static analysis. This reduces runtime errors and gives us more confidence when refactoring large projects. TypeScript also improves the development experience and efficiency through type-based auto-completion in the IDE.

x-crawl itself is written in TypeScript and supports TypeScript. Comes with a type declaration file, out of the box.

## API

### xCrawl

Create a crawler instance via call xCrawl. The crawl target queue is maintained by the instance method itself, not by the instance itself.

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
    callback?: (res: CrawlPageSingleResult) => void
  ): Promise<CrawlPageSingleResult>

  (
    config: CrawlPageDetailTargetConfig,
    callback?: (res: CrawlPageSingleResult) => void
  ): Promise<CrawlPageSingleResult>

  (
    config: (string | CrawlPageDetailTargetConfig)[],
    callback?: (res: CrawlPageSingleResult[]) => void
  ): Promise<CrawlPageSingleResult[]>

  (
    config: CrawlPageAdvancedConfig,
    callback?: (res: CrawlPageSingleResult[]) => void
  ): Promise<CrawlPageSingleResult[]>
}
```

**Parameter Type:**

- Look at the [CrawlPageDetailTargetConfig](#CrawlPageDetailTargetConfig) type
- Look at the [CrawlPageAdvancedConfig](#CrawlPageAdvancedConfig) type

**Return value type:**

- Look at the [CrawlPageSingleResult](#CrawlPageSingleResult) type

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

- Simple target config - string
- Detailed target config - CrawlPageDetailTargetConfig
- Mixed target array config - (string | CrawlPageDetailTargetConfig)[]
- Advanced config - CrawlPageAdvancedConfig

##### Simple target config - string

This is a simple target configuration. if you just want to simply crawl this page, you can try this way of writing:

```js
import xCrawl from 'x-crawl'

const myXCrawl = xCrawl()

myXCrawl.crawlPage('https://www.example.com').then((res) => {})
```

The res you get will be an object.

##### Detailed target config - CrawlPageDetailTargetConfig

This is the detailed target configuration. if you want to crawl this page and need to retry on failure, you can try this way of writing:

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

More configuration options can view [CrawlPageDetailTargetConfig](#CrawlPageDetailTargetConfig).

##### Mixed target array config - (string | CrawlPageDetailTargetConfig)[]

This is a mixed target array configuration. if you want to crawl multiple pages, and some pages need to fail and retry, you can try this way of writing:

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

More configuration options can view [CrawlPageDetailTargetConfig](#CrawlPageDetailTargetConfig).

##### Advanced config - CrawlPageAdvancedConfig

This is an advanced configuration, targets is a mixed target array configuration. if you want to crawl multiple pages and crawl target configurations (proxy, cookies, retries, etc.) that you don't want to write repeatedly, but also need interval time, device fingerprint, lifecycle, etc., try this:

```js
import xCrawl from 'x-crawl'

const myXCrawl = xCrawl()

myXCrawl
  .crawlPage({
    targets: [
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

More configuration options can view [CrawlPageAdvancedConfig](#CrawlPageAdvancedConfig).

More information about the results can be found at [About results](#About-results) , which can be selected according to the actual situation.

### crawlData

crawlData is the method of the crawler instance, which is usually used to crawl APIs to obtain JSON data and so on.

#### Type

The crawlData API is a function. A type is an [overloaded function](https://www.typescriptlang.org/docs/handbook/2/functions.html#function-overloads) which can be called (in terms of type) with different configuration parameters.

```ts
type crawlData = {
  <T = any>(
    config: CrawlDataDetailTargetConfig,
    callback?: (res: CrawlDataSingleResult<T>) => void
  ): Promise<CrawlDataSingleResult<T>>

  <T = any>(
    config: string,
    callback?: (res: CrawlDataSingleResult<T>) => void
  ): Promise<CrawlDataSingleResult<T>>

  <T = any>(
    config: (string | CrawlDataDetailTargetConfig)[],
    callback?: (res: CrawlDataSingleResult<T>[]) => void
  ): Promise<CrawlDataSingleResult<T>[]>

  <T = any>(
    config: CrawlDataAdvancedConfig<T>,
    callback?: (res: CrawlDataSingleResult<T>[]) => void
  ): Promise<CrawlDataSingleResult<T>[]>
}
```

**Parameter Type:**

- Look at the [CrawlDataDetailTargetConfig](#CrawlDataDetailTargetConfig) type
- Look at the [CrawlDataAdvancedConfig](#CrawlDataAdvancedConfig) type

**Return value type:**

- Look at the [CrawlDataSingleResult](#CrawlDataSingleResult) type

#### Example

```js
import xCrawl from 'x-crawl'

const myXCrawl = xCrawl({
  timeout: 10000,
  intervalTime: { max: 2000, min: 1000 }
})

myXCrawl
  .crawlData({
    targets: ['https://www.example.com/api-1', 'https://www.example.com/api-2'],
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

- Simple target config - string
- Detailed target config - CrawlDataDetailTargetConfig
- Mixed target array config - (string | CrawlDataDetailTargetConfig)[]
- Advanced config - CrawlDataAdvancedConfig

##### Simple target config - string

This is a simple target configuration. if you just want to simply crawl the data, and the interface is GET, you can try this way of writing:

```js
import xCrawl from 'x-crawl'

const myXCrawl = xCrawl()

myXCrawl.crawlData('https://www.example.com/api').then((res) => {})
```

The res you get will be an object.

##### Detailed target config - CrawlDataDetailTargetConfig

This is the detailed target configuration. if you want to crawl this data and need to retry on failure, you can try this way of writing:

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

More configuration options can view [CrawlDataDetailTargetConfig](#CrawlDataDetailTargetConfig).

##### Mixed target array config - (string | CrawlDataDetailTargetConfig)[]

This is a mixed target array configuration. if you want to crawl multiple data, and some data needs to fail and retry, you can try this way of writing:

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

More configuration options can view [CrawlDataDetailTargetConfig](#CrawlDataDetailTargetConfig).

##### Advanced config - CrawlDataAdvancedConfig

This is an advanced configuration, targets is a mixed target array configuration. if you want to crawl more than one piece of data and crawl target configurations (proxy, cookies, retries, etc.) don't want to write twice, but also need interval time, device fingerprint, lifecycle, etc., try this:

```js
import xCrawl from 'x-crawl'

const myXCrawl = xCrawl()

myXCrawl
  .crawlData({
    targets: [
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

More configuration options can view [CrawlPageAdvancedConfig](#CrawlPageAdvancedConfig) .

More information about the results can be found at [About results](#About-results) , which can be selected according to the actual situation.

### crawlFile

crawlFile is the method of the crawler instance, which is usually used to crawl files, such as pictures, pdf files, etc.

#### Type

The crawlFile API is a function. A type is an [overloaded function](https://www.typescriptlang.org/docs/handbook/2/functions.html#function-overloads) which can be called (in terms of type) with different configuration parameters.

```ts
type crawlFile = {
  (
    config: CrawlFileDetailTargetConfig,
    callback?: (res: CrawlFileSingleResult) => void
  ): Promise<CrawlFileSingleResult>

  (
    config: CrawlFileDetailTargetConfig[],
    callback?: (res: CrawlFileSingleResult[]) => void
  ): Promise<CrawlFileSingleResult[]>

  (
    config: CrawlFileAdvancedConfig,
    callback?: (res: CrawlFileSingleResult[]) => void
  ): Promise<CrawlFileSingleResult[]>
}
```

**Parameter Type:**

- Look at the [CrawlFileDetailTargetConfig](#CrawlFileDetailTargetConfig) type
- Look at the [CrawlFileAdvancedConfig](#CrawlFileAdvancedConfig) type

**Return value type:**

- Look at the [CrawlFileSingleResult](#CrawlFileSingleResult) type

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
    targets: [
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

- Detailed target config - CrawlFileDetailTargetConfig
- Detailed target array config - CrawlFileDetailTargetConfig[]
- Advanced config CrawlFileAdvancedConfig

##### Detailed target config - CrawlFileDetailTargetConfig

This is the detailed target configuration. if you want to crawl this file and need to retry on failure, you can try this way of writing:

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

More configuration options can view [CrawlFileDetailTargetConfig](#CrawlFileDetailTargetConfig).

##### Detailed target array config - CrawlFileDetailTargetConfig[]

This is the detailed target array configuration. if you want to crawl multiple files, and some data needs to be retried after failure, you can try this way of writing:

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

More configuration options can view [CrawlFileDetailTargetConfig](#CrawlFileDetailTargetConfig).

##### Advanced config CrawlFileAdvancedConfig

This is an advanced configuration, targets is a mixed target array configuration. if you want to crawl more than one piece of data and crawl target configurations (proxy, storeDir, retry, etc.) don't want to write twice, but also need interval time, device fingerprint, life cycle, etc., try this:

```js
import xCrawl from 'x-crawl'

const myXCrawl = xCrawl()

myXCrawl
  .crawlFile({
    targets: [
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

More configuration options can view [CrawlFileAdvancedConfig](#CrawlFileAdvancedConfig) .

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

#### XCrawlConfig

```ts
export interface XCrawlConfig extends CrawlCommonConfig {
  mode?: 'async' | 'sync'
  enableRandomFingerprint?: boolean
  baseUrl?: string
  intervalTime?: IntervalTime
  crawlPage?: {
    launchBrowser?: PuppeteerLaunchOptions // puppeteer
  }
}
```

**Default Value**

- mode: 'async'
- enableRandomFingerprint: true
- baseUrl: undefined
- intervalTime: undefined
- crawlPage: undefined

#### Detail target config

##### CrawlPageDetailTargetConfig

```ts
export interface CrawlPageDetailTargetConfig extends CrawlCommonConfig {
  url: string
  headers?: AnyObject | null
  cookies?: PageCookies | null
  priority?: number
  viewport?: Viewport | null // puppeteer
  fingerprint?:
    | (DetailTargetFingerprintCommon & {
        maxWidth?: number
        minWidth?: number
        maxHeight?: number
        minHidth?: number
      })
    | null
}
```

**Default Value**

- url: undefined
- headers: undefined
- cookies: undefined
- priority: undefined
- viewport: undefined
- fingerprint: undefined

##### CrawlDataDetailTargetConfig

```ts
export interface CrawlDataDetailTargetConfig extends CrawlCommonConfig {
  url: string
  method?: Method
  headers?: AnyObject | null
  params?: AnyObject
  data?: any
  priority?: number
  fingerprint?: DetailTargetFingerprintCommon | null
}
```

**Default Value**

- url: undefined
- method: 'GET'
- headers: undefined
- params: undefined
- data: undefined
- priority: undefined
- fingerprint: undefined

##### CrawlFileDetailTargetConfig

```ts
export interface CrawlFileDetailTargetConfig extends CrawlCommonConfig {
  url: string
  headers?: AnyObject | null
  priority?: number
  storeDir?: string | null
  fileName?: string
  extension?: string | null
  fingerprint?: DetailTargetFingerprintCommon | null
}
```

**Default Value**

- url: undefined
- headers: undefined
- priority: undefined
- storeDir: \_\_dirname
- fileName: string
- extension: string
- fingerprint: undefined

#### Advanced Config

##### CrawlPageAdvancedConfig

```ts
export interface CrawlPageAdvancedConfig extends CrawlCommonConfig {
  targets: (string | CrawlPageDetailTargetConfig)[]
  intervalTime?: IntervalTime
  fingerprints?: (DetailTargetFingerprintCommon & {
    maxWidth?: number
    minWidth?: number
    maxHeight?: number
    minHidth?: number
  })[]

  headers?: AnyObject
  cookies?: PageCookies
  viewport?: Viewport

  onCrawlItemComplete?: (crawlPageSingleResult: CrawlPageSingleResult) => void
}
```

**Default Value**

- targets: undefined
- intervalTime: undefined
- fingerprints: undefined
- headers: undefined
- cookies: undefined
- viewport: undefined
- onCrawlItemComplete: undefined

##### CrawlDataAdvancedConfig

```ts
export interface CrawlDataAdvancedConfig<T> extends CrawlCommonConfig {
  targets: (string | CrawlDataDetailTargetConfig)[]
  intervalTime?: IntervalTime
  fingerprints?: DetailTargetFingerprintCommon[]

  headers?: AnyObject

  onCrawlItemComplete?: (
    crawlDataSingleResult: CrawlDataSingleResult<T>
  ) => void
}
```

**Default Value**

- targets: undefined
- intervalTime: undefined
- fingerprints: undefined
- headers: undefined
- onCrawlItemComplete: undefined

##### CrawlFileAdvancedConfig

```ts
export interface CrawlFileAdvancedConfig extends CrawlCommonConfig {
  targets: (string | CrawlFileDetailTargetConfig)[]
  intervalTime?: IntervalTime
  fingerprints?: DetailTargetFingerprintCommon[]

  headers?: AnyObject
  storeDir?: string
  extension?: string

  onCrawlItemComplete?: (crawlFileSingleResult: CrawlFileSingleResult) => void
  onBeforeSaveItemFile?: (info: {
    id: number
    fileName: string
    filePath: string
    data: Buffer
  }) => Promise<Buffer>
}
```

**Default Value**

- targets: undefined
- intervalTime: undefined
- fingerprints: undefined
- headers: undefined
- storeDir: \_\_dirname
- extension: string
- onCrawlItemComplete: undefined
- onBeforeSaveItemFile: undefined

#### StartPollingConfig

```ts
export interface StartPollingConfig {
  d?: number
  h?: number
  m?: number
}
```

**Default Value**

- d: undefined
- h: undefined
- m: undefined

#### Crawl Other Config

##### CrawlCommonConfig

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

**Default Value**

- timeout: 10000
- proxy: undefined
- maxRetry: 0

##### DetailTargetFingerprintCommon

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

**Default Value**

- ua: undefined
- mobile: undefined
- platform: undefined
- platformVersion: undefined
- acceptLanguage: undefined
- userAgent: undefined

##### Mobile

```ts
export type Mobile = '?0' | '?1'
```

##### Platform

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

##### PageCookies

```ts
export type PageCookies =
  | string
  | Protocol.Network.CookieParam // puppeteer
  | Protocol.Network.CookieParam[] // puppeteer
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

##### IntervalTime

```ts
export type IntervalTime = number | { max: number; min?: number }
```

### API Result

#### XCrawlInstance

```ts
export interface XCrawlInstance {
  crawlPage: {
    (
      config: string,
      callback?: (res: CrawlPageSingleResult) => void
    ): Promise<CrawlPageSingleResult>

    (
      config: CrawlPageDetailTargetConfig,
      callback?: (res: CrawlPageSingleResult) => void
    ): Promise<CrawlPageSingleResult>

    (
      config: (string | CrawlPageDetailTargetConfig)[],
      callback?: (res: CrawlPageSingleResult[]) => void
    ): Promise<CrawlPageSingleResult[]>

    (
      config: CrawlPageAdvancedConfig,
      callback?: (res: CrawlPageSingleResult[]) => void
    ): Promise<CrawlPageSingleResult[]>
  }

  crawlData: {
    <T = any>(
      config: CrawlDataDetailTargetConfig,
      callback?: (res: CrawlDataSingleResult<T>) => void
    ): Promise<CrawlDataSingleResult<T>>

    <T = any>(
      config: string,
      callback?: (res: CrawlDataSingleResult<T>) => void
    ): Promise<CrawlDataSingleResult<T>>

    <T = any>(
      config: (string | CrawlDataDetailTargetConfig)[],
      callback?: (res: CrawlDataSingleResult<T>[]) => void
    ): Promise<CrawlDataSingleResult<T>[]>

    <T = any>(
      config: CrawlDataAdvancedConfig<T>,
      callback?: (res: CrawlDataSingleResult<T>[]) => void
    ): Promise<CrawlDataSingleResult<T>[]>
  }

  crawlFile: {
    (
      config: CrawlFileDetailTargetConfig,
      callback?: (res: CrawlFileSingleResult) => void
    ): Promise<CrawlFileSingleResult>

    (
      config: CrawlFileDetailTargetConfig[],
      callback?: (res: CrawlFileSingleResult[]) => void
    ): Promise<CrawlFileSingleResult[]>

    (
      config: CrawlFileAdvancedConfig,
      callback?: (res: CrawlFileSingleResult[]) => void
    ): Promise<CrawlFileSingleResult[]>
  }

  startPolling: (
    config: StartPollingConfig,
    callback: (count: number, stopPolling: () => void) => void
  ) => void
}
```

#### CrawlCommonResult

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

- id：Generated according to the order in which the target is climbed, or by priority, if any
- isSuccess：Whether the climb is successful
- maxRetry：Maximum number of retries of the crawl target
- retryCount：Maximum number of retries of the crawl target
- proxyDetails：Record agent status
- crawlErrorQueue：Error collection for the crawl target

#### CrawlPageSingleResult

```ts
export interface CrawlPageSingleResult extends CrawlCommonResult {
  data: {
    browser: Browser // puppeteer
    response: HTTPResponse | null // puppeteer
    page: Page // puppeteer
  }
}
```

#### CrawlDataSingleResult

```ts
export interface CrawlDataSingleResult<D> extends CrawlCommonResult {
  data: {
    statusCode: number | undefined
    headers: IncomingHttpHeaders // nodejs http
    data: D
  } | null
}
```

#### CrawlFileSingleResult

```ts
export interface CrawlFileSingleResult extends CrawlCommonResult {
  data: {
    statusCode: number | undefined
    headers: IncomingHttpHeaders // nodejs http
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
