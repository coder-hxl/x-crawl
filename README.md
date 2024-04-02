# x-crawl · [![npm](https://img.shields.io/npm/v/x-crawl.svg)](https://www.npmjs.com/package/x-crawl) [![NPM Downloads](https://img.shields.io/npm/dt/x-crawl)](https://www.npmjs.com/package/x-crawl) [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/coder-hxl/x-crawl/blob/main/LICENSE)

English | [简体中文](https://github.com/coder-hxl/x-crawl/blob/main/docs/cn.md)

x-crawl is a flexible Node.js AI-assisted crawler library. Powerful AI assistance functions make crawler work more efficient, intelligent and convenient.

> If you find x-crawl helpful, or you like x-crawl, you can give [x-crawl repository](https://github.com/coder-hxl/x-crawl) a like on GitHub A star. Your support is the driving force for our continuous improvement! thank you for your support!

## Features

- **🤖 AI Assistance** - Powerful AI assistance function makes crawler work more efficient, intelligent and convenient.
- **🖋️ Flexible writing** - A single crawling API is suitable for multiple configurations, and each configuration method has its own advantages.
- **⚙️Multiple uses** - Supports crawling dynamic pages, static pages, interface data and file data.
- **⚒️ Control page** - Crawling dynamic pages supports automated operations, keyboard input, event operations, etc.
- **👀 Device Fingerprinting** - Zero configuration or custom configuration to avoid fingerprint recognition to identify and track us from different locations.
- **🔥 Asynchronous Sync** - Asynchronous or synchronous crawling mode without switching crawling API.
- **⏱️ Interval crawling** - no interval, fixed interval and random interval, determine whether to crawl with high concurrency.
- **🔄 Failed Retry** - Customize the number of retries to avoid crawling failures due to temporary problems.
- **➡️ Rotation proxy** - Automatic proxy rotation with failed retries, custom error times and HTTP status codes.
- **🚀 Priority Queue** - Based on the priority of a single crawl target, it can be crawled ahead of other targets.
- **🧾 Crawl information** - Controllable crawl information, which will output colored string information in the terminal.
- **🦾 TypeScript** - Own types and implement complete types through generics.

## Sponsor

x-crawl is an open source project licensed under the MIT license. If you benefit from the projects I develop and maintain at work, so that I can continue to devote energy to the maintenance and update of the project and improve the user experience and functions, please consider using [Afdian](https://afdian.net/a /coderhxl) platform to support my work. Your support is the driving force for our continuous improvement! thank you for your support!

# Table of Contents

- [Install](#install)
- [Example](#example)
- [Base](#base)
  - [Create a Crawler Application](#create-a-crawler-application)
    - [An Example of a Crawler Application](#an-example-of-a-crawler-application)
    - [Multiple Crawler Application Anstances](#multiple-crawler-application-instances)
  - [Crawl Page](#crawl-page)
    - [Browser Instance](#browser-instance)
    - [Page Instance](#page-instance)
    - [life Cycle](#life-cycle)
      - [onCrawlItemComplete](#oncrawlitemcomplete)
    - [Open Browser](#open-browser)
  - [Crawl HTML](#crawl-html)
    - [life Cycle](#life-cycle-1)
      - [onCrawlItemComplete](#oncrawlitemcomplete-1)
  - [Crawl Interface](#crawl-interface)
    - [life Cycle](#life-cycle-2)
      - [onCrawlItemComplete](#oncrawlitemcomplete-2)
  - [Crawl Files](#crawl-files)
    - [life Cycle](#life-cycle-3)
      - [onCrawlItemComplete](#oncrawlitemcomplete-3)
      - [onBeforeSaveItemFile](#onbeforesaveitemfile)
  - [Interval Time](#interval-time)
  - [Fail Retry](#fail-retry)
  - [Rotate Proxy](#rotate-proxy)
  - [Priority Queue](#priority-queue)
  - [Terminal information](#Terminal-information)
  - [About Results](#about-results)
  - [TypeScript](#typescript)
- [AI Assistance](#ai-assistance)
  - [Create AI Applications](#create-ai-applications)
  - [Intelligent on Demand Analysis Elements](#intelligent-on-demand-analysis-elements)
  - [Intelligent Generation of Element Selectors](#intelligent-generation-of-element-selectors)
  - [Intelligent Reply to Crawler Questions](#intelligent-reply-to-crawler-questions)
  - [User Defined AI Functions](#user-defined-ai-functions)
- [Ddvanced](#advanced)
  - [Crawl Mode](#crawl-mode)
  - [Device Fingerprint](#device-fingerprint)
    - [Default Device Fingerprint](#default-device-fingerprint)
    - [Custom Device Fingerprint](#custom-device-fingerprint)
  - [Configuration](#configuration)
    - [Config Priority](#config-priority)
    - [Cancel Reuse Configuration Options](#cancel-reuse-configuration-options)
- [API](#api)
  - [createCrawl](#createCrawl)
    - [Type](#type)
    - [Example](#example-1)
  - [crawlPage](#crawlpage)
    - [Type](#type-1)
    - [Example](#example-2)
    - [Config](#config)
      - [Simple target config - string](#simple-target-config---string)
      - [Detailed target config - CrawlPageDetailTargetConfig](#detailed-target-config---crawlpagedetailtargetconfig)
      - [Mixed target array config - (string | CrawlPageDetailTargetConfig)[]](#mixed-target-array-config---string--crawlpagedetailtargetconfig)
      - [Advanced config - CrawlPageAdvancedConfig](#advanced-config---crawlpageadvancedconfig)
  - [crawlHTML](#crawlhtml)
    - [Type](#type-2)
    - [Example](#example-3)
    - [Config](#config-1)
      - [Simple target config - string](#simple-target-config---string-1)
      - [Detailed target config - CrawlHTMLDetailTargetConfig](#detailed-target-config---crawlhtmldetailtargetconfig)
      - [Mixed target array config - (string | CrawlHTMLDetailTargetConfig)[]](#mixed-target-array-config---string--crawlhtmldetailtargetconfig)
      - [Advanced config - CrawlHTMLAdvancedConfig](#advanced-config---crawlhtmladvancedconfig)
  - [crawlData](#crawldata)
    - [Type](#type-3)
    - [Example](#example-4)
    - [Config](#config-2)
      - [Simple target config - string](#simple-target-config---string-2)
      - [Detailed target config - CrawlDataDetailTargetConfig](#detailed-target-config---crawldatadetailtargetconfig)
      - [Mixed target array config - (string | CrawlDataDetailTargetConfig)[]](#mixed-target-array-config---string--crawldatadetailtargetconfig)
      - [Advanced config - CrawlDataAdvancedConfig](#advanced-config---crawldataadvancedconfig)
  - [crawlFile](#crawlfile)
    - [Type](#type-4)
    - [Example](#example-5)
    - [Config](#config-3)
      - [Simple target config - string](#simple-target-config---string-3)
      - [Detailed target config - CrawlFileDetailTargetConfig](#detailed-target-config---crawlFiledetailtargetconfig)
      - [Mixed target array config - (string | CrawlFileDetailTargetConfig)[]](#mixed-target-array-config---string---crawlfiledetailtargetconfig)
      - [Advanced config - CrawlFileAdvancedConfig](#advanced-config-crawlfileadvancedconfig)
  - [createXCrawlOpenAI](#createxcrawlopenai)
    - [Type](#type-5)
    - [Example](#example-6)
  - [parseElements](#parseElements)
    - [Type](#type-6)
    - [Example](#example-7)
  - [getElementSelectors](#getElementSelectors)
    - [Type](#type-7)
    - [Example](#example-8)
  - [help](#help)
    - [Type](#type-8)
    - [Example](#example-9)
  - [custom](#custom)
    - [Type](#type-9)
    - [Example](#example-10)
- [Types](#types)
  - [API Config](#api-config)
    - [CreateCrawlConfig](#xcrawlconfig)
    - [Detail Target Config](#detail-target-config)
      - [CrawlPageDetailTargetConfig](#crawlpagedetailtargetconfig)
      - [CrawlHTMLDetailTargetConfig](#crawlhtmldetailtargetconfig)
      - [CrawlDataDetailTargetConfig](#crawldatadetailtargetconfig)
      - [CrawlFileDetailTargetConfig](#crawlfiledetailtargetconfig)
    - [Advanced Config](#advanced-config)
      - [CrawlPageAdvancedConfig](#crawlpageadvancedconfig)
      - [CrawlHTMLAdvancedConfig](#crawlhtmladvancedconfig)
      - [CrawlDataAdvancedConfig](#crawldataadvancedconfig)
      - [CrawlFileAdvancedConfig](#crawlfileadvancedconfig)
    - [Crawl Other Config](#crawl-other-config)
      - [CrawlCommonConfig](#crawlcommonconfig)
      - [DetailTargetFingerprintCommon](#detailtargetfingerprintcommon)
      - [Mobile](#mobile)
      - [Platform](#platform)
      - [PageCookies](#pagecookies)
      - [Method](#method)
      - [IntervalTime](#intervaltime)
    - [CreateXCrawlOpenAIConfig](#createxcrawlopenaiconfig)
    - [XCrawlOpenAIParseElementsContentOptions](#xcrawlopenaiparseelementscontentoptions)
    - [XCrawlOpenAIGetElementSelectorsContentOptions](#xcrawlopenaigetelementselectorscontentoptions)
    - [XCrawlOpenAICommonAPIOtherOption](#xcrawlopenaicommonapiotheroption)
  - [API Result](#api-result)
    - [CrawlApp](#crawlapp)
    - [CrawlCommonResult](#crawlcommonResult)
    - [CrawlPageSingleResult](#crawlpagesingleresult)
    - [CrawlHTMLSingleResult](#crawlhtmlsingleresult)
    - [CrawlDataSingleResult](#crawldatasingleresult)
    - [CrawlFileSingleResult](#crawlfilesingleresult)
    - [XCrawlOpenAIApp](#xcrawlOpenaiapp)
    - [XCrawlOpenAIParseElementsResult](#xcrawlopenaiparseelementsresult)
    - [XCrawlOpenAIGetElementSelectorsResult](#xcrawlopenaigetelementselectorsresult)
- [FAQ](#faq)
  - [The relationship between crawlPage API and puppeteer](#the-relationship-between-crawlpage-api-and-puppeteer)
  - [Using crawlPage API causes the program to crash](#using-crawlpage-api-causes-the-program-to-crash)
- [More](#more)
  - [Version release](#version-release)
  - [Old Version Documentation](#old-version-documentation)
  - [Community](#community)
  - [Issues](#issues)
  - [Sponsor](#sponsor-1)
  - [Precautions](#Precautions)

## Install

Take NPM as an example:

```shell
npm install x-crawl
```

## Example

Take the automatic acquisition of some photos of experiences and homes around the world every day as an example:

```js
// 1. Import module ES/CJS
import { createCrawl } from 'x-crawl'

// 2. Create a crawler instance
const crawlApp = createCrawl({
  maxRetry: 3,
  intervalTime: { max: 2000, min: 1000 }
})

// 3. Set the crawling task
/*
  Call the startPolling API to start the polling function,
  and the callback function will be called every other day
*/
crawlApp.startPolling({ d: 1 }, async (count, stopPolling) => {
  // Call the crawlPage API to crawl the page
  const pageResults = await crawlApp.crawlPage({
    targets: [
      'https://www.airbnb.cn/s/*/experiences',
      'https://www.airbnb.cn/s/plus_homes'
    ],
    viewport: { width: 1920, height: 1080 }
  })

  // Obtain the image URL by traversing the crawled page results
  const imgUrls = []
  for (const item of pageResults) {
    const { id } = item
    const { page } = item.data
    const elSelector = id === 1 ? '.i9cqrtb' : '.c4mnd7m'

    // wait for the page element to appear
    await page.waitForSelector(elSelector)

    // Get the URL of the page image
    const urls = await page.$$eval(`${elSelector} picture img`, (imgEls) =>
      imgEls.map((item) => item.src)
    )
    imgUrls.push(...urls.slice(0, 6))

    // close the page
    page.close()
  }

  // Call crawlFile API to crawl pictures
  await crawlApp.crawlFile({ targets: imgUrls, storeDirs: './upload' })
})
```

running result:

<div align="center">
  <img src="https://raw.githubusercontent.com/coder-hxl/x-crawl/main/assets/run-example.gif" />
</div>

**Note:** x-crawl is for legal purposes only. It is prohibited to use this tool for any illegal activities. Please be sure to comply with the robots.txt file regulations of the target website. The class name of the website may change at any time. This example is only used to demonstrate the use of x-crawl and is not specific to a specific website.

## Base

### Create a crawler application

#### An Example of a Crawler Application

Create a new **application instance** via [createCrawl()](#createCrawl):

```js
import { createCrawl } from 'x-crawl'

const crawlApp = createCrawl({
  // options
})
```

Related **options** can refer to [CreateCrawlConfig](#CreateCrawlConfig) .

#### Multiple Crawler Application Instances

```js
import { createCrawl } from 'x-crawl'

const crawlApp1 = createCrawl({
  // options
})

const crawlApp2 = createCrawl({
  // options
})
```

### Crawl Page

Crawl a page via [crawlPage()](#crawlPage) .

```js
import { createCrawl } from 'x-crawl'

const crawlApp = createCrawl()

crawlApp.crawlPage('https://www.example.com').then((res) => {
  const { browser, page } = res.data

  // Close the browser
  browser.close()
})
```

#### Browser Instance

When you call crawlPage API to crawl pages in the same crawler instance, the browser instance used is the same, because the crawlPage API of the browser instance in the same crawler instance is shared. For specific usage, please refer to [Browser](https://pptr.dev/api/puppeteer.browser).

**Note:** The browser will keep running and the file will not be terminated. If you want to stop, you can execute browser.close() to close it. Do not call [crawlPage](#crawlPage) or [page](#page) if you need to use it later. Because the crawlPage API of the browser instance in the same crawler instance is shared.

#### Page Instance

When you call crawlPage API to crawl pages in the same crawler instance, a new page instance will be generated from the browser instance. For specific usage, please refer to [Page](https://pptr.dev/api/puppeteer.page).

The browser instance will retain a reference to the page instance. If it is no longer used in the future, the page instance needs to be closed by itself, otherwise it will cause a memory leak.

A browser instance may have multiple page instances. If it is no longer used later, you need to close the page instance yourself, otherwise it will cause a memory leak.

**Take Screenshot**

```js
import { createCrawl } from 'x-crawl'

const crawlApp = createCrawl()

crawlApp.crawlPage('https://www.example.com').then(async (res) => {
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

#### Open Browser

Disable running the browser in headless mode.

```js
import { createCrawl } from 'x-crawl'

const crawlApp = createCrawl({
  maxRetry: 3,
  // Cancel running the browser in headless mode
  crawlPage: { puppeteerLaunchOptions: { headless: false } }
})

crawlApp.crawlPage('https://www.example.com').then((res) => {})
```

### Crawl HTML

Crawl interface data through [crawlHTML()](#crawlHTML) .

```js
import { createCrawl } from 'x-crawl'

const crawlApp = createCrawl({ intervalTime: { max: 3000, min: 1000 } })

crawlApp
  .crawlHTML([
    'https://www.example.com/html-1',
    'https://www.example.com/html-2'
  ])
  .then((res) => {
    // deal with
  })
```

#### life Cycle

Life cycle functions owned by crawlHTML API:

- onCrawlItemComplete: Call back when each crawl is complete

##### onCrawlItemComplete

In the onCrawlItemComplete function, you can get the results of each crawled goal in advance.

### Crawl Interface

Crawl interface data through [crawlData()](#crawlData) .

```js
import { createCrawl } from 'x-crawl'

const crawlApp = createCrawl({ intervalTime: { max: 3000, min: 1000 } })

const targets = [
  'https://www.example.com/api-1',
  'https://www.example.com/api-2',
  {
    url: 'https://www.example.com/api-3',
    method: 'POST',
    data: { name: 'coderhxl' }
  }
]

crawlApp.crawlData({ targets }).then((res) => {
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
import { createCrawl } from 'x-crawl'

const crawlApp = createCrawl({ intervalTime: { max: 3000, min: 1000 } })

crawlApp
  .crawlFile({
    targets: [
      'https://www.example.com/file-1',
      'https://www.example.com/file-2'
    ],
    storeDirs: './upload' // storage folder
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

In the onBeforeSaveItemFile function, you can get a Buffer type file, you can process the Buffer, and then return a Buffer or a Promise whose return value is a Buffer. x-crawl will replace the returned Buffer with the obtained Buffer and store it in in the file.

**Resize Picture**

Use the sharp library to resize the images to be crawled:

```js
import { createCrawl } from 'x-crawl'
import sharp from 'sharp'

const crawlApp = createCrawl()

crawlApp
  .crawlFile({
    targets: [
      'https://www.example.com/file-1.jpg',
      'https://www.example.com/file-2.jpg'
    ],
    onBeforeSaveItemFile(info) {
      return sharp(info.data).resize(200).toBuffer()
    }
  })
  .then((res) => {
    res.forEach((item) => {
      console.log(item.data?.data.isSuccess)
    })
  })
```

### Interval Time

The interval time can prevent too much concurrency and avoid too much pressure on the server.

The crawling interval is controlled by the crawling API itself, not by the crawler instance.

```js
import { createCrawl } from 'x-crawl'

const crawlApp = createCrawl()

crawlApp
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

You can create crawler application instance, advanced usage, detailed target these three places Settings.

```js
import { createCrawl } from 'x-crawl'

const crawlApp = createCrawl()

crawlApp
  .crawlData({ url: 'https://www.example.com/api', maxRetry: 9 })
  .then((res) => {})
```

The maxRetry attribute determines how many times to retry.

### Rotate Proxy

With failed retries, custom error times and HTTP status codes, the proxy is automatically rotated for crawling targets.

You can create crawler application instance, advanced usage, detailed target these three places Settings.

Take crawlPage as an example:

```js
import { createCrawl } from 'x-crawl'

const testXCrawl = createCrawl()

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

### Priority Queue

A priority queue allows a crawl target to be sent first.

```js
import { createCrawl } from 'x-crawl'

const crawlApp = createCrawl()

crawlApp
  .crawlData([
    { url: 'https://www.example.com/api-1', priority: 1 },
    { url: 'https://www.example.com/api-2', priority: 10 },
    { url: 'https://www.example.com/api-3', priority: 8 }
  ])
  .then((res) => {})
```

The larger the value of the priority attribute, the higher the priority in the current crawling queue.

### Terminal information

The crawling information consists of start (displaying the mode and total number), process (displaying the number and how long to wait), and result (displaying success and failure information). There will be something like **1-page-2** in front of each piece of information. The first 1 represents the first crawler instance, the middle page represents the API type, and the following 2 represents the second page of the first crawler instance. Do this The purpose is to better distinguish which API the information comes from.

When you do not want to display the crawled information in the terminal, you can control the display or hiding through the options.

```js
import { createCrawl } from 'x-crawl'

// Only hide the process, start and result display
const crawlApp = createCrawl({ log: { process: false } })

// Hide all information
const crawlApp = createCrawl({ log: false })
```

The log option accepts an object or boolean type:

- Boolean

  - true: show all
  - false: hide all

- object
  - start: control the start information
  - process: control of process information
  - result: control of result information

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

Details about configuration methods and results are as follows: [crawlPage config](#config), [crawlHTML config](#config-1), [crawlData config](#config-2), [crawlFile config](#config-3).

### TypeScript

Type systems like TypeScript can detect many common errors at compile time through static analysis. This reduces runtime errors and gives us more confidence when refactoring large projects. TypeScript also improves the development experience and efficiency through type-based auto-completion in the IDE.

x-crawl itself is written in TypeScript and supports TypeScript. Comes with a type declaration file, out of the box.

## AI Assistance

Powerful AI assistance functions make crawler work more efficient, intelligent and convenient.

### Create AI applications

Currently, x-crawl’s AI auxiliary function relies on OpenAI and requires the use of OpenAI’s API Key. Other AI may be added in the future.

Create a new **application instance** via [createXCrawlOpenAI()](#createXCrawlOpenAI):

```js
import { createXCrawlOpenAI } from 'x-crawl'

const xCrawlOpenAIApp = createXCrawlOpenAI({
  clientOptions: { apiKey: 'Your API Key' }
})
```

**Get API Key**

- **[OpenAI official API Key](https://platform.openai.com/api-keys)**
- **[Free API Key](https://github.com/chatanywhere/GPT_API_free)**

### Intelligent on-demand analysis elements

No need to manually analyze the HTML page structure to extract the required element attributes or values. Now you just need to input the HTML code into AI and tell AI which elements you want to get information about, and AI will automatically analyze the page structure and extract the corresponding element attributes or values.

Use the parseElements method of the AI application instance.

Example:

```js
import { createXCrawlOpenAI } from 'x-crawl'

const xCrawlOpenAIApp = createXCrawlOpenAI({
  clientOptions: { apiKey: 'Your API Key' }
})

const HTMLContent = `
   <div class="scroll-list">
     <div class="list-item">Women's hooded sweatshirt</div>
     <div class="list-item">Men's sweatshirts</div>
     <div class="list-item">Women's sweatshirt</div>
     <div class="list-item">Men's hooded sweatshirt</div>
   </div>
   <div class="scroll-list">
     <div class="list-item">Men's pure cotton short sleeves</div>
     <div class="list-item">Men's pure cotton short sleeves</div>
     <div class="list-item">Women's pure cotton short sleeves</div>
     <div class="list-item">Men's ice silk short sleeves</div>
     <div class="list-item">Men's round neck short sleeves</div>
   </div>
`

xCrawlOpenAIApp
  .parseElements(HTMLContent, `Take all men's clothing and remove duplicates`)
  .then((res) => {
    console.log(res)
    /*
      res:
      {
        elements: [
          { content: "Men's hooded sweatshirt" },
          { content: "Men's sweatshirts" },
          { content: "Men's pure cotton short sleeves" },
          { content: "Men's ice silk short sleeves" },
          { content: "Men's round neck short sleeves" }
        ],
        type: 'multiple'
      }
    */
  })
```

You can also pass the entire HTML to AI to help us operate, but it will consume more Tokens. OpenAI charges based on Tokens.

### Intelligent generation of element selectors

It can help us quickly locate specific elements on the page. Just enter the HTML code into AI and tell AI which elements you want to get selectors for, and AI will automatically generate appropriate selectors for you based on the page structure, greatly simplifying the tedious process of determining selectors.

Use the getElementSelectors method of the AI application instance.

Example:

```js
import { createXCrawlOpenAI } from 'x-crawl'

const xCrawlOpenAIApp = createXCrawlOpenAI({
  clientOptions: { apiKey: 'Your API Key' }
})

const HTMLContent = `
   <div class="scroll-list">
     <div class="list-item">Women's hooded sweatshirt</div>
     <div class="list-item">Men's sweatshirts</div>
     <div class="list-item">Women's sweatshirt</div>
     <div class="list-item">Men's hooded sweatshirt</div>
   </div>
   <div class="scroll-list">
     <div class="list-item">Men's pure cotton short sleeves</div>
     <div class="list-item">Men's pure cotton short sleeves</div>
     <div class="list-item">Women's pure cotton short sleeves</div>
     <div class="list-item">Men's ice silk short sleeves</div>
     <div class="list-item">Men's round neck short sleeves</div>
   </div>
`

xCrawlOpenAIApp
  .getElementSelectors(HTMLContent, `all Women's wear`)
  .then((res) => {
    console.log(res)
    /*
      res:
      {
        selectors: '.scroll-list:nth-child(1) .list-item:nth-of-type(1), .scroll-list:nth-child(1) .list-item:nth-of-type(3), .scroll-list:nth-child(2) .list-item:nth-of-type(3)',
        type: 'multiple'
      }
    */
  })
```

You can also pass the entire HTML to AI to help us operate, but it will consume more Tokens. OpenAI charges based on Tokens.

### Intelligent reply to crawler questions

Can provide you with intelligent answers and suggestions. Whether it is about crawling strategies, anti-crawling techniques or data processing, you can ask AI questions, and AI will provide you with professional answers and suggestions based on its powerful learning and reasoning capabilities to help you complete your tasks better. Reptile task.

Use the help method of the AI application instance.

Example:

```js
import { createXCrawlOpenAI } from 'x-crawl'

const xCrawlOpenAIApp = createXCrawlOpenAI({
  clientOptions: { apiKey: 'Your API Key' }
})

xCrawlOpenAIApp.help('What is x-crawl').then((res) => {
  console.log(res)
  /*
    res:
    x-crawl is a flexible Node.js AI-assisted web crawling library. It offers powerful AI-assisted features that make web crawling more efficient, intelligent, and convenient. You can find more information and the source code on x-crawl's GitHub page: https://github.com/coder-hxl/x-crawl.
   */
})

xCrawlOpenAIApp
  .help('Three major things to note about crawlers')
  .then((res) => {
    console.log(res)
    /*
      res:
      There are several important aspects to consider when working with crawlers:

      1. **Robots.txt:** It's important to respect the rules set in a website's robots.txt file. This file specifies which parts of a website can be crawled by search engines and other bots. Not following these rules can lead to your crawler being blocked or even legal issues.

      2. **Crawl Delay:** It's a good practice to implement a crawl delay between your requests to a website. This helps to reduce the load on the server and also shows respect for the server resources.

      3. **User-Agent:** Always set a descriptive User-Agent header for your crawler. This helps websites identify your crawler and allows them to contact you if there are any issues. Using a generic or misleading User-Agent can also lead to your crawler being blocked.

      By keeping these points in mind, you can ensure that your crawler operates efficiently and ethically.
   */
  })
```

### User-defined AI functions

In order to meet the personalized needs of different users, x-crawl also provides user-customized AI functions. Providing openai instances means you can tailor and optimize the AI to your needs to better suit your crawling efforts.

Use the custom method of the AI application instance.

Example:

```js
import { createXCrawlOpenAI } from 'x-crawl'

const xCrawlOpenAIApp = createXCrawlOpenAI({
  clientOptions: { apiKey: 'Your API Key' }
})

const openai = xCrawlOpenAIApp.custom()
```

For the openai obtained by calling custom, please refer to: https://platform.openai.com/docs/api-reference/chat/create?lang=node.js. The openai obtained by calling custom and the website example new OpenAI() can be obtained. The instance is similar. The difference is that x-crawl will pass the clientOptions passed in when creating the AI application instance to new OpenAI. What you get is an intact OpenAI instance, and x-crawl will not rewrite it.

## Advanced

### Crawl Mode

A crawler application instance has two crawling modes: asynchronous/synchronous, and each crawler instance can only choose one of them.

```js
import { createCrawl } from 'x-crawl'

const crawlApp = createCrawl({
  mode: 'async'
})
```

The mode option defaults to async .

- async: Asynchronous crawling target, no need to wait for the current crawling target to complete, then proceed to the next crawling target
- sync: Synchronize the crawling target. You need to wait for the completion of this crawling target before proceeding to the next crawling target

If there is an interval time set, it is necessary to wait for the end of the interval time before crawling the next target.

**Note:** The crawling process of the crawling API is performed separately, and this mode is only valid for batch crawling targets.

### Device Fingerprint

#### Default Device Fingerprint

A property can be used to control whether to use the default random fingerprint, or you can configure a custom fingerprint through subsequent crawling.

Device fingerprinting is set up to avoid identifying and tracking us from different locations through fingerprinting.

```js
import { createCrawl } from 'x-crawl'

const crawlApp = createCrawl({
  enableRandomFingerprint: true
})
```

The enableRandomFingerprint option defaults to false.

- true: Enable random device fingerprinting. The fingerprint configuration of the target can be specified through advanced configuration or detailed target configuration.

- false: Turns off random device fingerprinting, does not affect the fingerprint configuration specified for the target by advanced configuration or detailed target configuration.

#### Custom Device Fingerprint

Customize the configuration of device fingerprints to avoid identifying and tracking us from different locations through fingerprint recognition.

Multiple information can be passed in fingerprints through advanced usage, and internally it will help you randomly assign each target to targets. It is also possible to set a specific fingerprint for a target directly with the detailed target configuration.

Take crawlPage as an example:

```js
import { createCrawl } from 'x-crawl'

const crawlApp = createCrawl({ intervalTime: { max: 5000, min: 3000 } })

crawlApp.crawlPage({
  targets: [
    'https://www.example.com/page-1',
    'https://www.example.com/page-2',
    'https://www.example.com/page-3',
    // Cancel the fingerprint for this target
    { url: 'https://www.example.com/page-4', fingerprint: null },
    // Set a separate fingerprint for this target
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
  // Set fingerprints uniformly for this target
  fingerprints: [
    // Device fingerprint 1
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
            // Browser version
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
    },
    // Device fingerprint 2
    {
      platform: 'Windows',
      mobile: 'random',
      userAgent: {
        value:
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36 Edg/91.0.864.59',
        versions: [
          {
            name: 'Chrome',
            maxMajorVersion: 91,
            minMajorVersion: 88,
            maxMinorVersion: 10,
            maxPatchVersion: 5615
          },
          { name: 'Safari', maxMinorVersion: 36, maxPatchVersion: 2333 },
          { name: 'Edg', maxMinorVersion: 10, maxPatchVersion: 864 }
        ]
      }
    },
    // Device fingerprint 3
    {
      platform: 'Windows',
      mobile: 'random',
      userAgent: {
        value:
          'Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:47.0) Gecko/20100101 Firefox/47.0',
        versions: [
          {
            name: 'Firefox',
            maxMajorVersion: 47,
            minMajorVersion: 43,
            maxMinorVersion: 10,
            maxPatchVersion: 5000
          }
        ]
      }
    }
  ]
})
```

For more fingerprint options, you can go to the corresponding configuration to view.

### Configuration

Some common configurations can be set in these three places:

- Application instance configuration (global)
- Advanced configuration (partial)
- Detailed target configuration (separately)

#### Config Priority

The priority is: detailed target configuration > advanced configuration > application instance configuration

The following uses maxRetry times as an example:

```js
import { createCrawl } from 'x-crawl'

//Application instance configuration
const crawlApp = createCrawl({ maxRetry: 3 })

//Advanced configuration
crawlApp
  .crawlPage({
    targets: [
      'https://www.example.com/page-1',
      'https://www.example.com/page-2',
      // Detailed target configuration
      { url: 'https://www.example.com/page-3', maxRetry: 8 },
      'https://www.example.com/page-4'
    ],
    maxRetry: 6
  })
  .then((res) => {})

crawlApp.crawlPage('https://www.example.com/page-5').then((res) => {})
```

In the above example, ** Application instance configuration **, ** Advanced configuration ** and ** Detailed target configuration ** are set with ** retry times **, page3 will use its own retry times (8), page1, page2 and page4 will use the advanced configuration retry times (6). page5 uses the number of retries configured by the application instance (3).

#### Cancel reuse configuration options

You can use null to cancel the upper-level configuration.

Take maxRetry retry times as an example:

```js
import { createCrawl } from 'x-crawl'

const crawlApp = createCrawl({ maxRetry: 3 })

crawlApp
  .crawlPage({
    url: 'https://www.example.com/page-1',
    maxRetry: null
  })
  .then((res) => {})

crawlApp.crawlPage('https://www.example.com/page-2').then((res) => {})

crawlApp
  .crawlPage({
    targets: [
      'https://www.example.com/page-3',
      'https://www.example.com/page-4'
    ],
    maxRetry: null
  })
  .then((res) => {})
```

In the above example, page1, page3, and page4 all cancel the retry count, and page2 has three retry counts

## API

### createCrawl

Create a crawler application instance by calling createCrawl. The crawl target is maintained internally by the instance method, not by the instance.

#### Type

The createCrawl API is a function.

```ts
function createCrawl(baseConfig?: CreateCrawlConfig): CrawlApp
```

**Parameter Type:**

- Look at the [CreateCrawlConfig](#CreateCrawlConfig) type

**Return value type:**

- View [CrawlApp](#CrawlApp) type

#### Example

```js
import { createCrawl } from 'x-crawl'

// createCrawl API
const crawlApp = createCrawl({
  baseUrl: 'https://www.example.com',
  timeout: 10000,
  intervalTime: { max: 2000, min: 1000 }
})
```

### crawlPage

crawlPage is the method of a crawler instance, usually used to crawl a dynamic page.

#### Type

The crawlPage API is a function. A type is an [overloaded function](https://www.typescriptlang.org/docs/handbook/2/functions.html#function-overloads) which can be called (in terms of type) with different configuration parameters.

```ts
type crawlPage = {
  (config: string): Promise<CrawlPageSingleResult>

  (config: CrawlPageDetailTargetConfig): Promise<CrawlPageSingleResult>

  (
    config: (string | CrawlPageDetailTargetConfig)[]
  ): Promise<CrawlPageSingleResult[]>

  (config: CrawlPageAdvancedConfig): Promise<CrawlPageSingleResult[]>
}
```

**Parameter Type:**

- Look at the [CrawlPageDetailTargetConfig](#CrawlPageDetailTargetConfig) type
- Look at the [CrawlPageAdvancedConfig](#CrawlPageAdvancedConfig) type

**Return value type:**

- Look at the [CrawlPageSingleResult](#CrawlPageSingleResult) type

#### Example

```js
import { createCrawl } from 'x-crawl'

const crawlApp = createCrawl()

// crawlPage API
crawlApp.crawlPage('https://www.example.com').then((res) => {
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
import { createCrawl } from 'x-crawl'

const crawlApp = createCrawl()

crawlApp.crawlPage('https://www.example.com').then((res) => {})
```

The res you get will be an object.

##### Detailed target config - CrawlPageDetailTargetConfig

This is the detailed target configuration. if you want to crawl this page and need to retry on failure, you can try this way of writing:

```js
import { createCrawl } from 'x-crawl'

const crawlApp = createCrawl()

crawlApp
  .crawlPage({
    url: 'https://www.example.com',
    proxy: { urls: ['xxx'] },
    maxRetry: 1
  })
  .then((res) => {})
```

The res you get will be an object.

More configuration options can view [CrawlPageDetailTargetConfig](#CrawlPageDetailTargetConfig).

##### Mixed target array config - (string | CrawlPageDetailTargetConfig)[]

This is a mixed target array configuration. if you want to crawl multiple pages, and some pages need to fail and retry, you can try this way of writing:

```js
import { createCrawl } from 'x-crawl'

const crawlApp = createCrawl()

crawlApp
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
import { createCrawl } from 'x-crawl'

const crawlApp = createCrawl()

crawlApp
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

### crawlHTML

crawlHTML is a method for crawling instances, usually used to crawl static HTML pages.

#### Type

The crawlHTML API is a function. A type is an [overloaded function](https://www.typescriptlang.org/docs/handbook/2/functions.html#function-overloads) which can be called (in terms of type) with different configuration parameters.

```ts
type crawlHTML = {
  (config: string): Promise<CrawlHTMLSingleResult>

  (config: CrawlHTMLDetailTargetConfig): Promise<CrawlHTMLSingleResult>

  (
    config: (string | CrawlHTMLDetailTargetConfig)[]
  ): Promise<CrawlHTMLSingleResult[]>

  (config: CrawlHTMLAdvancedConfig): Promise<CrawlHTMLSingleResult[]>
}
```

**Parameter Type:**

- Look at the [CrawlHTMLDetailTargetConfig](#CrawlHTMLDetailTargetConfig) type
- Look at the [CrawlHTMLAdvancedConfig](#CrawlHTMLAdvancedConfig) type

**Return value type:**

- Look at the [CrawlHTMLSingleResult](#CrawlHTMLSingleResult) type

#### Example

```js
import { createCrawl } from 'x-crawl'

const crawlApp = createCrawl()

// crawlHTML API
crawlApp.crawlHTML('https://www.example.com').then((res) => {
  const { browser, page } = res.data

  // Close the browser
  browser.close()
})
```

#### Config

There are 4 types:

- Simple target config - string
- Detailed target config - CrawlHTMLDetailTargetConfig
- Mixed target array config - (string | CrawlHTMLDetailTargetConfig)[]
- Advanced config - CrawlHTMLAdvancedConfig

##### Simple target config - string

This is a simple target configuration. if you just want to simply crawl this static HTML page, you can try this way of writing:

```js
import { createCrawl } from 'x-crawl'

const crawlApp = createCrawl()

crawlApp.crawlHTML('https://www.example.com').then((res) => {})
```

The res you get will be an object.

##### Detailed target config - CrawlHTMLDetailTargetConfig

This is the detailed target configuration. if you want to crawl this static HTML page and need to retry on failure, you can try this way of writing:

```js
import { createCrawl } from 'x-crawl'

const crawlApp = createCrawl()

crawlApp
  .crawlHTML({
    url: 'https://www.example.com',
    proxy: { urls: ['xxx'] },
    maxRetry: 1
  })
  .then((res) => {})
```

The res you get will be an object.

More configuration options can view [CrawlHTMLDetailTargetConfig](#CrawlHTMLDetailTargetConfig).

##### Mixed target array config - (string | CrawlHTMLDetailTargetConfig)[]

This is a mixed target array configuration. if you want to crawl multiple static HTML pages, and some pages need to fail and retry, you can try this way of writing:

```js
import { createCrawl } from 'x-crawl'

const crawlApp = createCrawl()

crawlApp
  .crawlHTML([
    'https://www.example.com/page-1',
    { url: 'https://www.example.com/page-2', maxRetry: 2 }
  ])
  .then((res) => {})
```

The res you get will be an array of objects.

More configuration options can view [CrawlHTMLDetailTargetConfig](#CrawlHTMLDetailTargetConfig).

##### Advanced config - CrawlHTMLAdvancedConfig

This is an advanced configuration, targets is a mixed target array configuration. if you want to crawl multiple static HTML pages and crawl target configurations (proxy, cookies, retries, etc.) that you don't want to write repeatedly, but also need interval time, device fingerprint, lifecycle, etc., try this:

```js
import { createCrawl } from 'x-crawl'

const crawlApp = createCrawl()

crawlApp
  .crawlHTML({
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

More configuration options can view [CrawlHTMLAdvancedConfig](#CrawlHTMLAdvancedConfig).

More information about the results can be found at [About results](#About-results) , which can be selected according to the actual situation.

### crawlData

crawlData is the method of the crawler instance, which is usually used to crawl APIs to obtain JSON data and so on.

#### Type

The crawlData API is a function. A type is an [overloaded function](https://www.typescriptlang.org/docs/handbook/2/functions.html#function-overloads) which can be called (in terms of type) with different configuration parameters.

```ts
type crawlData = {
  <T = any>(config: string): Promise<CrawlDataSingleResult<T>>

  <T = any>(
    config: CrawlDataDetailTargetConfig
  ): Promise<CrawlDataSingleResult<T>>

  <T = any>(
    config: (string | CrawlDataDetailTargetConfig)[]
  ): Promise<CrawlDataSingleResult<T>[]>

  <T = any>(
    config: CrawlDataAdvancedConfig<T>
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
import { createCrawl } from 'x-crawl'

const crawlApp = createCrawl({
  timeout: 10000,
  intervalTime: { max: 2000, min: 1000 }
})

crawlApp
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
import { createCrawl } from 'x-crawl'

const crawlApp = createCrawl()

crawlApp.crawlData('https://www.example.com/api').then((res) => {})
```

The res you get will be an object.

##### Detailed target config - CrawlDataDetailTargetConfig

This is the detailed target configuration. if you want to crawl this data and need to retry on failure, you can try this way of writing:

```js
import { createCrawl } from 'x-crawl'

const crawlApp = createCrawl()

crawlApp
  .crawlData({
    url: 'https://www.example.com/api',
    proxy: { urls: ['xxx'] },
    maxRetry: 1
  })
  .then((res) => {})
```

The res you get will be an object.

More configuration options can view [CrawlDataDetailTargetConfig](#CrawlDataDetailTargetConfig).

##### Mixed target array config - (string | CrawlDataDetailTargetConfig)[]

This is a mixed target array configuration. if you want to crawl multiple data, and some data needs to fail and retry, you can try this way of writing:

```js
import { createCrawl } from 'x-crawl'

const crawlApp = createCrawl()

crawlApp
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
import { createCrawl } from 'x-crawl'

const crawlApp = createCrawl()

crawlApp
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
  (config: string): Promise<CrawlFileSingleResult>

  (config: CrawlFileDetailTargetConfig): Promise<CrawlFileSingleResult>

  (
    config: (string | CrawlFileDetailTargetConfig)[]
  ): Promise<CrawlFileSingleResult[]>

  (config: CrawlFileAdvancedConfig): Promise<CrawlFileSingleResult[]>
}
```

**Parameter Type:**

- Look at the [CrawlFileDetailTargetConfig](#CrawlFileDetailTargetConfig) type
- Look at the [CrawlFileAdvancedConfig](#CrawlFileAdvancedConfig) type

**Return value type:**

- Look at the [CrawlFileSingleResult](#CrawlFileSingleResult) type

#### Example

```js
import { createCrawl } from 'x-crawl'

const crawlApp = createCrawl({
  timeout: 10000,
  intervalTime: { max: 2000, min: 1000 }
})

// crawlFile API
crawlApp
  .crawlFile({
    targets: [
      'https://www.example.com/file-1',
      'https://www.example.com/file-2'
    ],
    storeDirs: './upload',
    intervalTime: { max: 3000, min: 1000 },
    maxRetry: 1
  })
  .then((res) => {})
```

#### Config

There are 4 types in total:

- Simple target configuration - string
- Detailed target configuration - CrawlFileDetailTargetConfig
- Detailed target array configuration - (string | CrawlFileDetailTargetConfig)[]
- Advanced configuration - CrawlFileAdvancedConfig

##### Simple target configuration - string

This is a simple target configuration. If you just want to simply crawl this file, you can try this way of writing:

```js
import { createCrawl } from 'x-crawl'

const crawlApp = createCrawl()

crawlApp.crawlFile('https://www.example.com/file').then((res) => {})
```

The res obtained will be an object.

##### Detailed target config - CrawlFileDetailTargetConfig

This is the detailed target configuration. if you want to crawl this file and need to retry on failure, you can try this way of writing:

```js
import { createCrawl } from 'x-crawl'

const crawlApp = createCrawl()

crawlApp
  .crawlFile({
    url: 'https://www.example.com/file',
    proxy: { urls: ['xxx'] },
    maxRetry: 1,
    storeDir: './upload',
    fileName: 'xxx'
  })
  .then((res) => {})
```

The res you get will be an object.

More configuration options can view [CrawlFileDetailTargetConfig](#CrawlFileDetailTargetConfig).

##### Mixed target array config - (string | CrawlFileDetailTargetConfig)[]

This is the detailed target array configuration. if you want to crawl multiple files, and some data needs to be retried after failure, you can try this way of writing:

```js
import { createCrawl } from 'x-crawl'

const crawlApp = createCrawl()

crawlApp
  .crawlFile([
    'https://www.example.com/file-1',
    { url: 'https://www.example.com/file-2', storeDir: './upload' },
    { url: 'https://www.example.com/file-3', storeDir: './upload', maxRetry: 2 }
  ])
  .then((res) => {})
```

The res you get will be an array of objects.

More configuration options can view [CrawlFileDetailTargetConfig](#CrawlFileDetailTargetConfig).

##### Advanced config CrawlFileAdvancedConfig

This is an advanced configuration, targets is a mixed target array configuration. if you want to crawl more than one piece of data and crawl target configurations (proxy, storeDir, retry, etc.) don't want to write twice, but also need interval time, device fingerprint, life cycle, etc., try this:

```js
import { createCrawl } from 'x-crawl'

const crawlApp = createCrawl()

crawlApp
  .crawlFile({
    targets: [
      'https://www.example.com/file-1',
      { url: 'https://www.example.com/file-2', storeDir: './upload/xxx' }
    ],
    storeDirs: './upload',
    intervalTime: { max: 3000, min: 1000 },
    maxRetry: 1
  })
  .then((res) => {})
```

The res you get will be an array of objects.

More configuration options can view [CrawlFileAdvancedConfig](#CrawlFileAdvancedConfig) .

More information about the results can be found at [About results](#About-results) , which can be selected according to the actual situation.

### createXCrawlOpenAI

Create an AI application instance by calling createXCrawlOpenAI.

#### type

createXCrawlOpenAI API is a function.

```ts
function createXCrawlOpenAI(config?: CreateXCrawlOpenAIConfig): XCrawlOpenAIApp
```

**Parameter Type:**

- View the [CreateXCrawlOpenAIConfig](#CreateXCrawlOpenAIConfig) type

**Return value type:**

- View the [XCrawlOpenAIApp](#XCrawlOpenAIApp) type

#### Example

```js
import { createXCrawlOpenAI } from 'x-crawl'

// xCrawlOpenAIApp API
const xCrawlOpenAIApp = createXCrawlOpenAI({
  clientOptions: { apiKey: 'Your API Key' },
  defaultModel: { chatModel: 'gpt-4-turbo-preview' }
})
```

### parseElements

parseElements is a method of AI application instances, typically used for intelligent on-demand analysis of elements.

#### type

parseElements API is a function.

```ts
function parseElements(
  HTML: string,
  content: string | XCrawlOpenAIParseElementsContentOptions,
  option?: XCrawlOpenAICommonAPIOtherOption
): Promise<XCrawlOpenAIParseElementsResult>
```

**Parameter Type:**

- View the [XCrawlOpenAIParseElementsContentOptions](#XCrawlOpenAIParseElementsContentOptions) type
- View the [XCrawlOpenAICommonAPIOtherOption](#XCrawlOpenAICommonAPIOtherOption) type

**Return value type:**

- View the [XCrawlOpenAIParseElementsResult](#XCrawlOpenAIParseElementsResult) type

#### Example

```js
import { createXCrawlOpenAI } from 'x-crawl'

const xCrawlOpenAIApp = createXCrawlOpenAI()

xCrawlOpenAIApp
  .parseElements('HTML', 'Tell the AI what you want')
  .then((res) => {})
```

### getElementSelectors

getElementSelectors is a method of AI application instance, usually used to intelligently generate element selectors.

#### type

parseElements API is a function.

```ts
function getElementSelectors(
  HTML: string,
  content: string | XCrawlOpenAIGetElementSelectorsContentOptions,
  option?: XCrawlOpenAICommonAPIOtherOption
): Promise<XCrawlOpenAIGetElementSelectorsResult>
```

**Parameter Type:**

- View the [XCrawlOpenAIGetElementSelectorsContentOptions](#XCrawlOpenAIGetElementSelectorsContentOptions) type
- View the [XCrawlOpenAICommonAPIOtherOption](#XCrawlOpenAICommonAPIOtherOption) type

**Return value type:**

- View the [XCrawlOpenAIGetElementSelectorsResult](#XCrawlOpenAIGetElementSelectorsResult) type

#### Example

```js
import { createXCrawlOpenAI } from 'x-crawl'

const xCrawlOpenAIApp = createXCrawlOpenAI()

xCrawlOpenAIApp
  .getElementSelectors('HTML', 'Tell the AI what you want')
  .then((res) => {})
```

### help

help is a method of AI application instance, usually used to intelligently reply to crawler questions.

#### type

help API is a function.

```ts
function help(
  content: string,
  option?: XCrawlOpenAICommonAPIOtherOption
): Promise<string>
```

**Parameter Type:**

- View the [XCrawlOpenAICommonAPIOtherOption](#XCrawlOpenAICommonAPIOtherOption) type

#### Example

```js
import { createXCrawlOpenAI } from 'x-crawl'

const xCrawlOpenAIApp = createXCrawlOpenAI()

xCrawlOpenAIApp.help('Tell the AI your problem').then((res) => {})
```

###custom

custom is a method of AI application instance, usually used for user-defined AI functions.

#### type

customAPI is a function.

```ts
function custom(): OpenAI
```

**Return value type:**

You can refer to: https://platform.openai.com/docs/api-reference/chat/create?lang=node.js. The openai obtained by calling custom is similar to the instance obtained by the website example new OpenAI(). The differences are x-crawl will pass the clientOptions passed in when creating the AI application instance to new OpenAI. What you get is an intact OpenAI instance, and x-crawl will not rewrite it.

#### Example

```js
import { createXCrawlOpenAI } from 'x-crawl'

const xCrawlOpenAIApp = createXCrawlOpenAI()

const openai = xCrawlOpenAIApp.custom()
```

## Types

### API Config

#### CreateCrawlConfig

```ts
export interface CreateCrawlConfig extends CrawlCommonConfig {
  mode?: 'async' | 'sync'
  enableRandomFingerprint?: boolean
  baseUrl?: string
  intervalTime?: IntervalTime
  log?:
    | {
        start?: boolean
        process?: boolean
        result?: boolean
      }
    | boolean
  crawlPage?: {
    puppeteerLaunchOptions?: PuppeteerLaunchOptions // PuppeteerLaunchOptions are from puppeteer
  }
}
```

**Default Value**

- mode: 'async'
- enableRandomFingerprint: false
- baseUrl: undefined
- intervalTime: undefined
- log: { start: true, process: true, result: true }
- crawlPage: undefined

**External type**

- PuppeteerLaunchOptions: from the puppeteer, crawlPage. Can directly to the puppeteer PuppeteerLaunchOptions launch used to create a browser instance

#### Detail target config

##### CrawlPageDetailTargetConfig

```ts
export interface CrawlPageDetailTargetConfig extends CrawlCommonConfig {
  url: string
  headers?: Object | null
  cookies?: PageCookies | null
  priority?: number
  viewport?: Viewport | null // The Viewport is from the puppeteer
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

**External type**

- Viewport: from puppeteer, viewport will be passed directly to page.setViewport to set the page size

##### CrawlHTMLDetailTargetConfig

```ts
export interface CrawlHTMLDetailTargetConfig extends CrawlCommonConfig {
  url: string
  headers?: Object | null
  priority?: number
  fingerprint?: DetailTargetFingerprintCommon | null
}
```

**Default Value**

- url: undefined
- headers: undefined
- priority: undefined
- fingerprint: undefined

##### CrawlDataDetailTargetConfig

```ts
export interface CrawlDataDetailTargetConfig extends CrawlCommonConfig {
  url: string
  method?: Method
  headers?: Object | null
  params?: Object
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
  headers?: Object | null
  priority?: number
  storeDir?: string | null
  fileName?: string | null
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

  headers?: Object
  cookies?: PageCookies
  viewport?: Viewport // Viewport: This parameter is from puppeteer

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

**External type**

- Viewport: from puppeteer, viewport will be passed directly to page.setViewport to set the page size

##### CrawlHTMLAdvancedConfig

```ts
export interface CrawlHTMLAdvancedConfig extends CrawlCommonConfig {
  targets: (string | CrawlHTMLDetailTargetConfig)[]
  intervalTime?: IntervalTime
  fingerprints?: DetailTargetFingerprintCommon[]

  headers?: Object

  onCrawlItemComplete?: (crawlDataSingleResult: CrawlHTMLSingleResult) => void
}
```

**Default Value**

- targets: undefined
- intervalTime: undefined
- fingerprints: undefined
- headers: undefined
- onCrawlItemComplete: undefined

##### CrawlDataAdvancedConfig

```ts
export interface CrawlDataAdvancedConfig<T> extends CrawlCommonConfig {
  targets: (string | CrawlDataDetailTargetConfig)[]
  intervalTime?: IntervalTime
  fingerprints?: DetailTargetFingerprintCommon[]

  headers?: Object

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

**Default Value**

- targets: undefined
- intervalTime: undefined
- fingerprints: undefined
- storeDir: \_\_dirname
- extension: string
- fileNames: undefined
- headers: undefined
- onCrawlItemComplete: undefined
- onBeforeSaveItemFile: undefined

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
  | Protocol.Network.CookieParam // Protocol comes from puppeteer
  | Protocol.Network.CookieParam[] // Protocol comes from puppeteer
```

**External type**

- Protocol: from puppeteer

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

#### CreateXCrawlOpenAIConfig

```ts
export interface CreateXCrawlOpenAIConfig {
  defaultModel?: {
    chatModel: OpenAIChatModel
  }
  clientOptions?: ClientOptions // ClientOptions comes from openai
}
```

**default value**

- defaultModel: { chatModel: 'gpt-3.5-turbo' }
- clientOptions: undefined

**External type**

- ClientOptions: from openai, clientOptions will be passed directly to new OpenAI for creating AI instances

#### XCrawlOpenAIParseElementsContentOptions

```ts
export interface XCrawlOpenAIParseElementsContentOptions {
  message: string
}
```

**default value**

- message: undefined

**External type**

- ClientOptions: from openai, clientOptions will be passed directly to new OpenAI for creating AI instances

#### XCrawlOpenAIGetElementSelectorsContentOptions

```ts
export interface XCrawlOpenAIGetElementSelectorsContentOptions {
  message: string
  pathMode: 'default' | 'strict'
}
```

- pathMode:
  - strict: The selector's path starts from the root element and points exactly to the target element.
  - default: a selector that can start from any level of elements.

**default value**

- message: undefined
- pathMode: 'default'

#### XCrawlOpenAICommonAPIOtherOption

```ts
export interface XCrawlOpenAICommonAPIOtherOption {
  model?:
    | 'gpt-4-0125-preview'
    | 'gpt-4-turbo-preview'
    | 'gpt-4-1106-preview'
    | 'gpt-4-vision-preview'
    | 'gpt-4'
    | 'gpt-4-0314'
    | 'gpt-4-0613'
    | 'gpt-4-32k'
    | 'gpt-4-32k-0314'
    | 'gpt-4-32k-0613'
    | 'gpt-3.5-turbo'
    | 'gpt-3.5-turbo-16k'
    | 'gpt-3.5-turbo-0301'
    | 'gpt-3.5-turbo-0613'
    | 'gpt-3.5-turbo-1106'
    | 'gpt-3.5-turbo-0125'
    | 'gpt-3.5-turbo-16k-0613'
}
```

- model: the AI model to be selected.

**default value**

- model: undefined

### API Result

#### CrawlApp

```ts
export interface CrawlApp {
  crawlPage: {
    (config: string): Promise<CrawlPageSingleResult>

    (config: CrawlPageDetailTargetConfig): Promise<CrawlPageSingleResult>

    (
      config: (string | CrawlPageDetailTargetConfig)[]
    ): Promise<CrawlPageSingleResult[]>

    (config: CrawlPageAdvancedConfig): Promise<CrawlPageSingleResult[]>
  }

  crawlHTML: {
    (config: string): Promise<CrawlHTMLSingleResult>

    (config: CrawlHTMLDetailTargetConfig): Promise<CrawlHTMLSingleResult>

    (
      config: (string | CrawlHTMLDetailTargetConfig)[]
    ): Promise<CrawlHTMLSingleResult[]>

    (config: CrawlHTMLAdvancedConfig): Promise<CrawlHTMLSingleResult[]>
  }

  crawlData: {
    <T = any>(config: string): Promise<CrawlDataSingleResult<T>>

    <T = any>(
      config: CrawlDataDetailTargetConfig
    ): Promise<CrawlDataSingleResult<T>>

    <T = any>(
      config: (string | CrawlDataDetailTargetConfig)[]
    ): Promise<CrawlDataSingleResult<T>[]>

    <T = any>(
      config: CrawlDataAdvancedConfig<T>
    ): Promise<CrawlDataSingleResult<T>[]>
  }

  crawlFile: {
    (config: string): Promise<CrawlFileSingleResult>

    (config: CrawlFileDetailTargetConfig): Promise<CrawlFileSingleResult>

    (
      config: (string | CrawlFileDetailTargetConfig)[]
    ): Promise<CrawlFileSingleResult[]>

    (config: CrawlFileAdvancedConfig): Promise<CrawlFileSingleResult[]>
  }
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
    browser: Browser // Browser from puppeteer
    response: HTTPResponse | null // HTTPResponse from puppeteer
    page: Page // Page from puppeteer
  }
}
```

**External type**

- Browser: from puppeteer, https://pptr.dev/api/puppeteer.browser
- HTTPResponse: from puppeteer, https://pptr.dev/api/puppeteer.httpresponse
- Page: from puppeteer, https://pptr.dev/api/puppeteer.page

#### CrawlHTMLSingleResult

```ts
export interface CrawlHTMLSingleResult extends CrawlCommonResult {
  data: {
    statusCode: number | undefined
    headers: IncomingHttpHeaders // IncomingHttpHeaders comes from node:http
    html: string
  } | null
}
```

**External type**

- IncomingHttpHeaders: http from nodejs

#### CrawlDataSingleResult

```ts
export interface CrawlDataSingleResult<D> extends CrawlCommonResult {
  data: {
    statusCode: number | undefined
    headers: IncomingHttpHeaders // IncomingHttpHeaders comes from node:http
    data: D
  } | null
}
```

**External type**

- IncomingHttpHeaders: http from nodejs

#### CrawlFileSingleResult

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

#### XCrawlOpenAIApp

```ts
export interface XCrawlOpenAIApp {
  parseElements(
    HTML: string,
    content: string | XCrawlOpenAIParseElementsContentOptions,
    option?: XCrawlOpenAICommonAPIOtherOption
  ): Promise<XCrawlOpenAIParseElementsResult>

  getElementSelectors(
    HTML: string,
    content: string | XCrawlOpenAIGetElementSelectorsContentOptions,
    option?: XCrawlOpenAICommonAPIOtherOption
  ): Promise<XCrawlOpenAIGetElementSelectorsResult>

  help(
    content: string,
    option?: XCrawlOpenAICommonAPIOtherOption
  ): Promise<string>
  custom(): OpenAI
}
```

#### XCrawlOpenAIParseElementsResult

```ts
export interface XCrawlOpenAIParseElementsResult {
  selectors: string
  type: 'single' | 'multiple' | 'none'
}
```

- type
  - single: indicates that the current HTML fragment only finds one target.
  - multiple: Indicates that the current HTML fragment found multiple targets.
  - none: Not found in the current HTML fragment.

#### XCrawlOpenAIGetElementSelectorsResult

```ts
export interface XCrawlOpenAIGetElementSelectorsResult {
  elements: string[]
  type: 'single' | 'multiple' | 'none'
}
```

- type

  - single: indicates that the current HTML fragment only finds one target.
  - multiple: Indicates that the current HTML fragment found multiple targets.
  - none: Not found in the current HTML fragment.

## FAQ

### The relationship between crawlPage API and puppeteer

The crawlPage API has built-in [puppeteer](https://github.com/puppeteer/puppeteer). You only need to pass in some configuration options to let x-crawl help you simplify the operation and get intact Brower instances and Pages. instance, x-crawl does not override it.

### Using crawlPage API causes the program to crash

If you need to crawl many pages in one crawlPage, it is recommended that after crawling each page, use [onCrawlItemComplete life cycle function](#onCrawlItemComplete) to process the results of each target and close the page instance. If no shutdown operation is performed, then The program may crash due to too many pages being opened (related to the performance of the device itself).

```js
import { createCrawl } from 'x-crawl'

const crawlApp = createCrawl()

// Recommendations with few crawling targets
crawlApp
  .crawlPage([
    'https://www.example.com/page-1',
    'https://www.example.com/page-2'
  ])
  .then((results) => {
    for (const itemResult of results) {
      const { page } = itemResult.data

      //Close if no longer used
      page.close()
    }
  })

// Crawling recommendations with many targets
//onCrawlItemComplete through advanced configuration
crawlApp.crawlPage({
  targets: [
    'https://www.example.com/page-1',
    'https://www.example.com/page-2',
    'https://www.example.com/page-3',
    'https://www.example.com/page-4',
    'https://www.example.com/page-5',
    'https://www.example.com/page-6',
    'https://www.example.com/page-7',
    'https://www.example.com/page-8',
    'https://www.example.com/page-9',
    'https://www.example.com/page-10'
  ],
  onCrawlItemComplete(crawlPageSingleResult) {
    const { page } = crawlPageSingleResult.data

    //Close if no longer used
    page.close()
  }
})
```

## More

### Version release

The complete past release record can be viewed at [GitHub](https://github.com/coder-hxl/x-crawl/blob/main/CHANGELOG.md).

### Old version documentation

v9.0.0 version: https://github.com/coder-hxl/x-crawl/blob/v9.0.0

### Community

- **Discord Chat:** Ask questions and discuss live with other x-crawl users via [Discord](https://discord.gg/SF7aaebg4E).

- **GitHub Discussions:** Use [GitHub Discussions](https://github.com/coder-hxl/x-crawl/discussions) for message board-style questions and discussions.

Questions and discussions related to any illegal activity may not be submitted. x-crawl is for legal purposes only, and it is prohibited to use this tool to conduct any illegal activities, including but not limited to unauthorized data collection, network attacks, privacy violations, etc. Please ensure that your usage behavior always complies with laws, regulations and ethical standards, and jointly maintain a safe and legal network environment.

### Issues

If you have questions, needs, or good suggestions, you can raise them at [GitHub Issues](https://github.com/coder-hxl/x-crawl/issues).

### Sponsor

x-crawl is an open source project licensed under the MIT license. If you benefit from the projects I develop and maintain at work, so that I can continue to devote energy to the maintenance and update of the project and improve the user experience and functions, please consider using [Afdian](https://afdian.net/a/coderhxl) platform to support my work. Your support is the driving force for our continuous improvement! thank you for your support!

### Precautions

- x-crawl is for legal purposes only. It is prohibited to use this tool to conduct any illegal activities, including but not limited to unauthorized data collection, network attacks, privacy violations, etc.
- Before collecting data, make sure you have explicit authorization from the target website and comply with its robots.txt file and terms of use.
- Avoid placing excessive access pressure on the target website to avoid triggering its anti-crawling strategy or causing server downtime.

**x-crawl is for legal purposes only, x-crawl does not bear any responsibility for any legal liability arising from the use of x-crawl**
