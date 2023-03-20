# x-crawl [![npm](https://img.shields.io/npm/v/x-crawl.svg)](https://www.npmjs.com/package/x-crawl) [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/coder-hxl/x-crawl/blob/main/LICENSE)

[English](https://github.com/coder-hxl/x-crawl#x-crawl) | 简体中文

x-crawl 是一个灵活的 nodejs 爬虫库。可以爬取页面并控制页面、批量网络请求以及批量下载文件资源等操作。支持 异步/同步 模式爬取数据。跑在 nodejs 上，用法灵活和简单，对 JS/TS 开发者友好。

> 如果感觉不错，可以给 [x-crawl 存储库](https://github.com/coder-hxl/x-crawl) 点个 Star 支持一下，您的 Star 将是我更新的动力。

## 特征

- 支持 异步/同步 方式爬取数据。
- 灵活的写法，支持多种方式写请求配置和获取爬取结果。
- 灵活的爬取间隔时间，由你决定 使用/避免 高并发爬取。
- 简单的配置即可抓取页面、批量网络请求以及批量下载文件资源等操作。
- 拥有轮询功能，定时爬取数据。
- 内置 puppeteer 爬取页面，并用采用 jsdom 库对页面内容解析，也支持自行解析。
- 对爬取的成功和失败进行捕获记录，并进行高亮的提醒。
- 使用 TypeScript 编写，拥有类型，提供泛型。

## 跟 puppeteer 的关系

crawlPage API 内部使用 [puppeteer](https://github.com/puppeteer/puppeteer) 库来帮助我们爬取页面。

crawlPage API 的返回值将可以做以下操作:

- 生成页面的屏幕截图和 PDF。
- 抓取 SPA（单页应用程序）并生成预渲染内容（即“SSR”（服务器端渲染））。
- 自动化表单提交、UI 测试、键盘输入等。

# 目录

- [安装](#安装)
- [示例](#示例)
- [核心概念](#核心概念)
    * [创建应用](#创建应用)
      + [一个爬虫应用实例](#一个爬虫应用实例)
      + [选择爬取模式](#选择爬取模式)
      + [多个爬虫应用实例](#多个爬虫应用实例)
    * [爬取页面](#爬取页面)
      + [jsdom 实例](#jsdom-实例)
      + [browser 实例](#browser-实例)
      + [page 实例](#page-实例)
    * [爬取接口](#爬取接口)
    * [爬取文件](#爬取文件)
    * [启动轮询](#启动轮询)
    * [爬取间隔时间](#爬取间隔时间)
    * [requestConfig 选项的多种写法](#requestConfig-选项的多种写法)
    * [获取结果的多种方式](#获取结果的多种方式)
- [API](#API)
    * [xCrawl](#xCrawl)
       + [类型](#类型-1)
       + [示例](#示例-1)
    * [crawlPage](#crawlPage)
       + [类型](#类型-2)
       + [示例](#示例-2)
    * [crawlData](#crawlData)
       + [类型](#类型-3)
       + [示例](#示例-3)
    * [crawlFile](#crawlFile)
       + [类型](#类型-4)
       + [示例](#示例-4)
    * [startPolling](#startPolling)
       + [类型](#类型-5)
       + [示例](#示例-5)
- [类型](#类型-6)
    * [AnyObject](#AnyObject)
    * [Method](#Method)
    * [RequestConfigObjectV1](#RequestConfigObjectV1)
    * [RequestConfigObjectV2](#RequestConfigObjectV2)
    * [RequestConfig](#RequestConfig)
    * [IntervalTime](#IntervalTime)
    * [XCrawlBaseConfig](#XCrawlBaseConfig)
    * [CrawlPageConfig](#CrawlPageConfig	)
    * [CrawlBaseConfigV1](#CrawlBaseConfigV1)
    * [CrawlDataConfig](#CrawlDataConfig) 
    * [CrawlFileConfig](#CrawlFileConfig)
    * [StartPollingConfig](#StartPollingConfig)
    * [CrawlResCommonV1](#CrawlResCommonV1)
    * [CrawlResCommonArrV1](#CrawlResCommonArrV1)
    * [CrawlPage](#CrawlPage-2) 
    * [FileInfo](#FileInfo)
- [更多](#更多)

## 安装

以 NPM 为例: 

```shell
npm install x-crawl
````

## 示例

定时爬取: 每隔一天就获取 bilibili 国漫主页的轮播图片为例: 

```js
// 1.导入模块 ES/CJS
import xCrawl from 'x-crawl'

// 2.创建一个爬虫实例
const myXCrawl = xCrawl({
  timeout: 10000, // 请求超时时间
  intervalTime: { max: 3000, min: 2000 } // 爬取间隔时间
})

// 3.设置爬取任务
// 调用 startPolling API 开始轮询功能，每隔一天会调用回调函数
myXCrawl.startPolling({ d: 1 }, () => {
  // 调用 crawlPage API 爬取 Page
  myXCrawl.crawlPage('https://www.bilibili.com/guochuang/').then((res) => {
    const { jsdom } = res // 默认使用了 JSDOM 库解析 Page

    // 获取轮播图片元素
    const imgEls = jsdom.window.document.querySelectorAll('.chief-recom-item img')

    // 设置请求配置
    const requestConfig = []
    imgEls.forEach((item) => requestConfig.push(`https:${item.src}`))

    // 调用 crawlFile API 爬取图片
    myXCrawl.crawlFile({  requestConfig, fileConfig: { storeDir: './upload' } })
  })
})
```

运行效果:

<div align="center">
  <img src="https://raw.githubusercontent.com/coder-hxl/x-crawl/main/assets/cn/crawler.png" />
</div>

<div align="center">
  <img src="https://raw.githubusercontent.com/coder-hxl/x-crawl/main/assets/cn/crawler-result.png" />
</div>

**注意:** 请勿随意爬取，爬取前可查看 **robots.txt** 协议。这里只是为了演示如何使用 x-crawl 。

## 核心概念

### 创建应用

#### 一个爬虫应用实例

通过 [xCrawl()](#xCrawl) 创建一个新的 **应用实例:**

```js
import xCrawl from 'x-crawl'

const myXCrawl = xCrawl({
  // 选项
})
```

相关的 **选项** 可参考 [XCrawlBaseConfig](#XCrawlBaseConfig) 。

#### 选择爬取模式

一个爬虫应用实例有两种爬取模式: 异步/同步，每个爬虫实例只能选择其中一种。

```js
import xCrawl from 'x-crawl'

const myXCrawl = xCrawl({
  mode: 'async'
})
```

mode 选项默认为 async 。

- async: 异步请求，在批量请求时，无需等当前请求完成，就进行下次请求
- sync: 同步请求，在批量请求时，需要等这次请求完成，才会进行下次请求

若有设置间隔时间，则都需要等间隔时间结束才能发送请求。


#### 多个爬虫应用实例

```js
import xCrawl from 'x-crawl'

const myXCrawl1 = xCrawl({
  // 选项
})

const myXCrawl2 = xCrawl({
  // 选项
})
```

### 爬取页面

通过 [crawlPage()](#crawlPage) 爬取一个页面。

```js
import xCrawl from 'x-crawl'

const myXCrawl = xCrawl({ timeout: 10000 })

myXCrawl.crawlPage('https://xxx.com').then(res => {
  const { jsdom, browser, page } = res
  
  // 关闭浏览器
  browser.close()
})
```

#### jsdom 实例

它是 [JSDOM](https://github.com/jsdom/jsdom) 的实例对象，具体使用可以参考 [jsdom](https://github.com/jsdom/jsdom) 。

**注意：** jsdom 实例只是对 [page 实例](#page-实例) 的 content 进行了解析，如果您使用  page 实例进行了事件操作的话，可能需要自行解析最新的页面内容，具体操作可查看 [page 实例](#page-实例) 的自行解析页面。

#### browser 实例

它是  [Browser](https://pptr.dev/api/puppeteer.browser) 的实例对象，具体使用可以参考 [Browser](https://pptr.dev/api/puppeteer.browser) 。

browser 实例他是个无头浏览器，并无 UI 外壳，他做的是将浏览器渲染引擎提供的**所有现代网络平台功能**带到代码中。

**注意：** browser 实例内部会一直产生事件循环，造成文件不会终止，如果想停止可以执行 browser.close() 关闭。如果后面还需要用到 [crawlPage](#crawlPage) 或者 [page](#page) 请勿调用。因为当您修改 browser 实例的属性时，会对该爬虫实例 crawlPage API 内部的 browser 实例和返回结果的 page 实例以及 browser 实例造成影响，因为 browser 实例在同一个爬虫实例的 crawlPage API 内是共享的。

#### page 实例

它是 [Page](https://pptr.dev/api/puppeteer.page) 的实例对象，实例还可以做事件之类的交互操作，具体使用可以参考 [page](https://pptr.dev/api/puppeteer.page) 。

**自行解析页面**

以使用 jsdom 库为例：

```js
import xCrawl from 'x-crawl'
import { JSDOM } from 'jsdom'

const myXCrawl = xCrawl({ timeout: 10000 })

myXCrawl.crawlPage('https://www.xxx.com').then(async (res) => {
  const { page } = res

  // 获取最新的页面内容  
  const content = await page.content()

  // 使用 jsdom 库自行解析
  const jsdom = new JSDOM(content)
  
  console.log(jsdom.window.document.querySelector('title').textContent)
})
```

**获取屏幕截图**

```js
import xCrawl from 'x-crawl'

const myXCrawl = xCrawl({ timeout: 10000 })

myXCrawl
  .crawlPage('https://xxx.com')
  .then(async (res) => {
    const { page } = res

    // 获取页面渲染后的截图
    await page.screenshot({ path: './upload/page.png' })

    console.log('获取屏幕截图完毕')
  })
```

### 爬取接口

通过 [crawlData()](#crawlData) 爬取接口数据。

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
  // 处理
})
```

### 爬取文件

通过 [crawlFile()](#crawlFile) 爬取文件数据。

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
      storeDir: './upload' // 存放文件夹
    }
  })
  .then((fileInfos) => {
    console.log(fileInfos)
  })

```

### 启动轮询

通过 [startPolling()](#startPolling) 启动一个轮询爬取。

```js
import xCrawl from 'x-crawl'

const myXCrawl = xCrawl({ 
  timeout: 10000
})

myXCrawl.startPolling({ h: 2, m: 30 }, (count, stopPolling) => {
  // 每隔两个半小时会执行一次
  // crawlPage/crawlData/crawlFile
  myXCrawl.crawlPage('https://xxx.com').then(res => {
    const { jsdom, browser, page } = res
  })
})
```

回调函数参数：

- count 属性记录当前是第几次轮询操作。
- stopPolling 是一个回调函数，调用其可以终止后面的轮询操作。

### 爬取间隔时间

设置爬取间隔时间可以防止并发量太大，避免给服务器造成太大的压力。

可以在创建爬虫实例的时候设置，也可选择给某个 API 单独设置。爬取间隔时间是由实例方法内部控制的，并非由实例控制整个爬取间隔时间。

```js
import xCrawl from 'x-crawl'

// 统一设置
const myXCrawl = xCrawl({
  intervalTime: { max: 3000, min: 1000 }
})

// 单独设置 (优先级高)
myXCrawl.crawlFile({
  requestConfig: [ 'https://xxx.com/xxxx', 'https://xxx.com/xxxx' ],
  intervalTime: { max: 2000, min: 1000 }
})
```

intervalTime 选项默认为 undefined 。若有设置值，则会在请求前等待一段时间，可以防止并发量太大，避免给服务器造成太大的压力。

- number: 固定每次请求前必须等待的时间
- Object: 在 max 和 min 中随机取一个值，更加拟人化

**注意:** 第一次请求是不会触发间隔时间。

### requestConfig 选项的多种写法

requestConfig 的写法非常灵活，一共有5种，可以是:

- 字符串
- 字符串数组
- 对象
- 对象数组
- 字符串加对象数组

```js
import xCrawl from 'x-crawl'

const myXCrawl = xCrawl({ 
  timeout: 10000,
  intervalTime: { max: 3000, min: 1000 }
})

// requestConfig 写法1:
const requestConfig1 = 'https://xxx.com/xxxx'

// requestConfig 写法2:
const requestConfig2 = [ 'https://xxx.com/xxxx', 'https://xxx.com/xxxx', 'https://xxx.com/xxxx' ]

// requestConfig 写法3:
const requestConfig3 = { 
  url: 'https://xxx.com/xxxx', 
  method: 'POST', 
  data: { name: 'coderhxl' } 
}

// requestConfig 写法4:
const requestConfig4 = [
  { url: 'https://xxx.com/xxxx' },
  { url: 'https://xxx.com/xxxx', method: 'POST', data: { name: 'coderhxl' } },
  { url: 'https://xxx.com/xxxx' }
]

// requestConfig 写法5:
const requestConfig5 = [
  'https://xxx.com/xxxx',
  { url: 'https://xxx.com/xxxx', method: 'POST', data: { name: 'coderhxl' } },
  'https://xxx.com/xxxx'
]


myXCrawl.crawlData({ requestConfig: requestConfig5 }).then(res => {
  console.log(res)
})
```

可以根据实际情况选用即可。

### 获取结果的多种方式

获取结果有三种方式:  Promise、Callback 以及 Promise + Callback。

- Promise: 等所有请求结束后，获取所有请求的结果
- Callback: 每次请求结束后，获取当前请求的结果

这三种方式适用于 crawlPage、crawlData 以及 crawlFile 。

```js
import xCrawl from 'x-crawl'

const myXCrawl = xCrawl({ 
  timeout: 10000,
  intervalTime: { max: 3000, min: 1000 }
})

const requestConfig = [ 'https://xxx.com/xxxx', 'https://xxx.com/xxxx', 'https://xxx.com/xxxx' ]

// 方式一: Promise
myXCrawl
  .crawlFile({
    requestConfig,
    fileConfig: { storeDir: './upload' }
  })
  .then((fileInfos) => {
    console.log('Promise: ', fileInfos)
  })

// 方式二: Callback
myXCrawl.crawlFile(
  {
    requestConfig,
    fileConfig: { storeDir: './upload' }
  },
  (fileInfo) => {
    console.log('Callback: ', fileInfo)
  }
)

// 方式三: Promise + Callback
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

可以根据实际情况选用即可。

## API

### xCrawl

通过调用 xCrawl 创建一个爬虫实例。请求是由实例方法内部自己维护，并非由实例自己维护。

#### 类型

- [XCrawlBaseConfig](#XCrawlBaseConfig)
- [XCrawlInstance](#XCrawlInstance)

```ts
function xCrawl(baseConfig?: XCrawlBaseConfig): XCrawlInstance
```

#### 示例

```js
import xCrawl from 'x-crawl'

// xCrawl API
const myXCrawl = xCrawl({
  baseUrl: 'https://xxx.com',
  timeout: 10000,
  // 爬取间隔时间, 批量爬取才有效
  intervalTime: {
    max: 2000,
    min: 1000
  }
})
```

### crawlPage 

crawlPage 是爬虫实例的方法，通常用于爬取页面。

#### 类型

- 查看 [CrawlPageConfig](#CrawlPageConfig) 类型
- 查看 [CrawlPage](#CrawlPage-2) 类型

```ts
function crawlPage: (
  config: CrawlPageConfig,
  callback?: (res: CrawlPage) => void
) => Promise<CrawlPage>
```

#### 示例

```js
import xCrawl from 'x-crawl'

const myXCrawl = xCrawl({ timeout: 10000 })

// crawlPage API
myXCrawl.crawlPage('https://xxx.com/xxx').then((res) => {
  const { jsdom, browser, page } = res
  console.log(jsdom.window.document.querySelector('title')?.textContent)
  
  // 关闭浏览器
  browser.close()
})
```

### crawlData

crawl 是爬虫实例的方法，通常用于爬取 API ，可获取 JSON 数据等等。

#### 类型

- 查看 [CrawlDataConfig](#CrawlDataConfig) 类型
- 查看 [CrawlResCommonV1](#CrawlResCommonV1) 类型
- 查看 [CrawlResCommonArrV1](#CrawlResCommonArrV1) 类型

```ts
function crawlData: <T = any>(
  config: CrawlDataConfig,
  callback?: (res: CrawlResCommonV1<T>) => void
) => Promise<CrawlResCommonArrV1<T>>
```

#### 示例

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

crawlFile 是爬虫实例的方法，通常用于爬取文件，可获取图片、pdf 文件等等。

#### 类型

- 查看 [CrawlFileConfig](#CrawlFileConfig) 类型
- 查看 [CrawlResCommonV1](#CrawlResCommonV1) 类型
- 查看 [CrawlResCommonArrV1](#CrawlResCommonArrV1) 类型
- 查看 [FileInfo](#FileInfo) 类型

```ts
function crawlFile: (
  config: CrawlFileConfig,
  callback?: (res: CrawlResCommonV1<FileInfo>) => void
) => Promise<CrawlResCommonArrV1<FileInfo>>
```

#### 示例

```js
import xCrawl from 'x-crawl'

const myXCrawl = xCrawl({
  timeout: 10000,
  intervalTime: { max: 2000, min: 1000 }
})

const requestConfig = [ 'https://xxx.com/xxxx', 'https://xxx.com/xxxx' ]

// crawlFile API
myXCrawl
  .crawlFile({
    requestConfig,
    fileConfig: {
      storeDir: './upload' // 存放文件夹
    }
  })
  .then((fileInfos) => {
    console.log(fileInfos)
  })
```

### startPolling

crawlPolling 是爬虫实例的方法，通常用于进行轮询操作，比如每隔一段时间获取新闻之类的。

#### 类型

- 查看 [StartPollingConfig](#StartPollingConfig) 类型

```ts
function startPolling: (
  config: StartPollingConfig,
  callback: (count: number, stopPolling: () => void) => void
) => void
```

#### 示例

```js
import xCrawl from 'x-crawl'

const myXCrawl = xCrawl({
  timeout: 10000,
  intervalTime: { max: 2000, min: 1000 }
})

// startPolling API
myXCrawl.startPolling({ h: 2, m: 30 }, (count, stopPolling) => {
  // 每隔两个半小时会执行一次
  // crawlPage/crawlData/crawlFile
})
```

## 类型

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

### CrawlPageConfig

```ts
type CrawlPageConfig = string | RequestConfigObjectV1
```

### CrawlBaseConfigV1

```ts
interface CrawlBaseConfigV1 {
  requestConfig: RequestConfig | RequestConfig[]
  intervalTime?: IntervalTime
}
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
    storeDir: string // 存放文件夹
    extension?: string // 文件扩展名
  }
}
```

### StartPollingConfig

```ts
interface StartPollingConfig {
  d?: number // 日
  h?: number // 小时
  m?: number // 分钟
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
interface CrawlResCommonV1<T> {
  id: number
  statusCode: number | undefined
  headers: IncomingHttpHeaders // nodejs: http 类型
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
  httpResponse: HTTPResponse | null // puppeteer 库的 HTTPResponse 类型
  browser: Browser // puppeteer 库的 Browser 类型
  page: Page // puppeteer 库的 Page 类型
  jsdom: JSDOM // jsdom 库的 JSDOM 类型
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

## 更多

如有 **问题** 或 **需求** 请在 https://github.com/coder-hxl/x-crawl/issues 中提 **Issues** 。
