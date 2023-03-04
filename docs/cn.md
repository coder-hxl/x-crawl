# x-crawl

[English](https://github.com/coder-hxl/x-crawl#x-crawl) | 简体中文

x-crawl 是 Nodejs 多功能爬虫库。

如果对您有帮助，请给[存储库](https://github.com/coder-hxl/x-crawl)点个 Star 支持一下。

## 特征

- 只需简单的配置即可抓取页面、JSON、文件资源等等。
- 内置 puppeteer 爬取页面 ，并用采用 jsdom 库对页面解析。
- 支持 异步/同步 方式爬取数据。
- 支持 Promise/Callback 方式获取结果。
- 轮询功能，定时爬取。
- 拟人化的请求间隔时间。
- 使用 TypeScript 编写，提供泛型。

## 跟 puppeteer 的关系

fetchPage API 内部使用 [puppeteer](https://github.com/puppeteer/puppeteer) 库来爬取页面。

可以完成以下操作:

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
      + [设置间隔时间](#设置间隔时间)
      + [多个爬虫应用实例](#多个爬虫应用实例)
    * [爬取页面](#爬取页面)
    * [爬取接口](#爬取接口)
    * [爬取文件](#爬取文件)
- [API](#API)
    * [xCrawl](#xCrawl)
       + [类型](#类型-1)
       + [示例](#示例-1)
       + [模式](#模式)
       + [间隔时间](#间隔时间)
    * [fetchPage](#fetchPage)
       + [类型](#类型-2)
       + [示例](#示例-2)
    * [fetchData](#fetchData)
       + [类型](#类型-3)
       + [示例](#示例-3)
       + [关于 page](#关于-page)
    * [fetchFile](#fetchFile)
       + [类型](#类型-4)
       + [示例](#示例-4)
    * [startPolling](#startPolling)
       + [类型](#类型-5)
       + [示例](#示例-5)
- [类型](#类型-6)
    * [AnyObject](#AnyObject)
    * [Method](#Method)
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
  intervalTime: { max: 3000, min: 2000 } // 控制请求频率
})

// 3.设置爬取任务
// 调用 startPolling API 开始轮询功能，每隔一天会调用回调函数
myXCrawl.startPolling({ d: 1 }, () => {
  // 调用 fetchPage API 爬取 Page
  myXCrawl.fetchPage('https://www.bilibili.com/guochuang/').then((res) => {
    const { jsdom } = res.data // 默认使用了 JSDOM 库解析 Page

    // 获取轮播图片元素
    const imgEls = jsdom.window.document.querySelectorAll('.carousel-wrapper .chief-recom-item img')

    // 设置请求配置
    const requestConfig = []
    imgEls.forEach((item) => requestConfig.push({ url: `https:${item.src}` }))

    // 调用 fetchFile API 爬取图片
    myXCrawl.fetchFile({ requestConfig, fileConfig: { storeDir: './upload' } })
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

#### 设置间隔时间

设置间隔时间可以防止并发量太大，避免给服务器造成太大的压力。

```js
import xCrawl from 'x-crawl'

const myXCrawl = xCrawl({
  intervalTime: { max: 3000, min: 1000 }
})
```

intervalTime 选项默认为 undefined 。若有设置值，则会在请求前等待一段时间，可以防止并发量太大，避免给服务器造成太大的压力。

- number: 固定每次请求前必须等待的时间
- Object: 在 max 和 min 中随机取一个值，更加拟人化

第一次请求是不会触发间隔时间。


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

通过 [fetchPage()](#fetchPage) 爬取一个页面

```js
myXCrawl.fetchPage('https://xxx.com').then(res => {
  const { jsdom, page } = res.data
})
```

### 爬取接口

通过 [fetchData()](#fetchData) 爬取接口数据

```js
const requestConfig = [
  { url: 'https://xxx.com/xxxx' },
  { url: 'https://xxx.com/xxxx' },
  { url: 'https://xxx.com/xxxx' }
]

myXCrawl.fetchData({ requestConfig }).then(res => {
  // 处理
})
```

### 爬取文件

通过 [fetchFile()](#fetchFile) 爬取文件数据

```js
import path from 'node:path'

const requestConfig = [
  { url: 'https://xxx.com/xxxx' },
  { url: 'https://xxx.com/xxxx' },
  { url: 'https://xxx.com/xxxx' }
]

myXCrawl.fetchFile({
  requestConfig,
  fileConfig: {
    storeDir: path.resolve(__dirname, './upload') // 存放文件夹
  }
}).then(fileInfos => {
  console.log(fileInfos)
})
```

## API

### xCrawl

通过调用 xCrawl 创建一个爬虫实例。请求是由实例方法内部自己维护，并非由实例自己维护。

#### 类型

更详细的类型请看[类型](#类型-6)部分内容

```ts
function xCrawl(baseConfig?: XCrawlBaseConfig): XCrawlInstance
```

#### 示例

```js
const myXCrawl = xCrawl({
  baseUrl: 'https://xxx.com',
  timeout: 10000,
  // 请求的间隔时间, 多个请求才有效
  intervalTime: {
    max: 2000,
    min: 1000
  }
})
```

**注意:** 为避免后续示例需要重复创建实例，这里的 **myXCrawl** 将是 **fetchPage/fetchData/fetchFile** 示例中的爬虫实例。

### fetchPage 

fetchPage 是 [myXCrawl](#示例-2) 实例的方法，通常用于爬取页面。

#### 类型

- 查看 [FetchPageConfig](#FetchPageConfig) 类型
- 查看 [FetchPage](#FetchPage-2) 类型

```ts
function fetchPage: (
  config: FetchPageConfig,
  callback?: (res: FetchPage) => void
) => Promise<FetchPage>
```

#### 示例

```js
myXCrawl.fetchPage('/xxx').then((res) => {
  const { jsdom } = res.data
  console.log(jsdom.window.document.querySelector('title')?.textContent)
})
```

#### 关于 page 

从 res.data.page 拿到 page 实例，其可以做事件之类的交互操作，具体使用参考 [page](https://pptr.dev/api/puppeteer.page) 。

### fetchData

fetch 是 [myXCrawl](#示例-2) 实例的方法，通常用于爬取 API ，可获取 JSON 数据等等。

#### 类型

- 查看 [FetchDataConfig](#FetchDataConfig) 类型
- 查看 [FetchResCommonV1](#FetchResCommonV1) 类型
- 查看 [FetchResCommonArrV1](#FetchResCommonArrV1) 类型

```ts
function fetchData: <T = any>(
  config: FetchDataConfig,
  callback?: (res: FetchResCommonV1<T>) => void
) => Promise<FetchResCommonArrV1<T>>
```

#### 示例

```js
const requestConfig = [
  { url: '/xxxx', method: 'GET' },
  { url: '/xxxx', method: 'GET' },
  { url: '/xxxx', method: 'GET' }
]

myXCrawl.fetchData({ requestConfig }).then(res => {
  console.log(res)
})
```

### fetchFile

fetchFile 是 [myXCrawl](#示例-2) 实例的方法，通常用于爬取文件，可获取图片、pdf 文件等等。

#### 类型

- 查看 [FetchFileConfig](#FetchFileConfig) 类型
- 查看 [FetchResCommonV1](#FetchResCommonV1) 类型
- 查看 [FetchResCommonArrV1](#FetchResCommonArrV1) 类型
- 查看 [FileInfo](#FileInfo) 类型

```ts
function fetchFile: (
  config: FetchFileConfig,
  callback?: (res: FetchResCommonV1<FileInfo>) => void
) => Promise<FetchResCommonArrV1<FileInfo>>
```

#### 示例

```js
import path from 'node:path'

const requestConfig = [
  { url: '/xxxx' },
  { url: '/xxxx' },
  { url: '/xxxx' }
]

myXCrawl.fetchFile({
  requestConfig,
  fileConfig: {
    storeDir: path.resolve(__dirname, './upload') // 存放文件夹
  }
}).then(fileInfos => {
  console.log(fileInfos)
})
```

### startPolling

fetchPolling 是 [myXCrawl](#示例-1) 实例的方法，通常用于进行轮询操作，比如每隔一段时间获取新闻之类的。

#### 类型

- 查看 [StartPollingConfig](#StartPollingConfig) 类型

```ts
function startPolling: (
  config: StartPollingConfig,
  callback: (count: number) => void
) => void
```

#### 示例

```js
myXCrawl.startPolling({ h: 1, m: 30 }, () => {
  // 每隔一个半小时会执行一次
  // fetchPage/fetchData/fetchFile
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

### FetchResCommonV1

```ts
interface FetchResCommonV1<T> {
  id: number
  statusCode: number | undefined
  headers: IncomingHttpHeaders // nodejs: http 类型
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
  httpResponse: HTTPResponse | null // puppeteer 库的 HTTPResponse 类型
  data: {
    page: Page // puppeteer 库的 Page 类型
    jsdom: JSDOM // jsdom 库的 JSDOM 类型
  }
}
```

## 更多

如有 **问题** 或 **需求** 请在 https://github.com/coder-hxl/x-crawl/issues 中提 **Issues** 。
