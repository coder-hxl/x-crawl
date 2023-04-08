# x-crawl [![npm](https://img.shields.io/npm/v/x-crawl.svg)](https://www.npmjs.com/package/x-crawl) [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/coder-hxl/x-crawl/blob/main/LICENSE)

[English](https://github.com/coder-hxl/x-crawl#x-crawl) | 简体中文

x-crawl 是一个灵活的 nodejs 爬虫库。可批量爬取页面、批量网络请求、批量下载文件资源、轮询爬取等。用法灵活和简单，对 JS/TS 开发者友好。

> 如果你喜欢 x-crawl ，可以给 [x-crawl 存储库](https://github.com/coder-hxl/x-crawl) 点个 Star 支持一下，不仅是对它的认可，同时也是对开发者的认可。

## 特征

- **🔥 异步/同步** - 只需更改一下 mode 属性即可切换 异步/同步 爬取模式。
- **⚙️ 多种功能** - 可批量爬取页面、批量网络请求、批量下载文件资源、轮询爬取等。
- **🖋️ 写法灵活** - 一种功能适配多种爬取配置、获取爬取结果的写法，写法非常灵活。
- **⏱️ 间隔爬取** - 无间隔/固定间隔/随机间隔，可以有效 使用/避免 高并发爬取。
- **🔄 失败重试** - 可针对所有爬取的请求设置，针对单次爬取的请求设置，针对单个请求设置进行失败重试。
- **🚀 优先队列** - 根据单个请求的优先级使用优先爬取。
- **☁️ 爬取 SPA** - 批量爬取 SPA（单页应用程序）生成预渲染内容（即“SSR”（服务器端渲染））。
- **⚒️ 控制页面** - 无头浏览器可以表单提交、键盘输入、事件操作、生成页面的屏幕截图等。
- **🧾 捕获记录** - 对爬取的结果进行捕获记录，并在控制台进行高亮的提醒。
- **🦾TypeScript** - 拥有类型，通过泛型实现完整的类型。

## 跟 puppeteer 的关系

crawlPage API 内部使用 [puppeteer](https://github.com/puppeteer/puppeteer) 库来帮助我们爬取页面，并将 Brower 实例和 Page 实例暴露出来。

# 目录

- [安装](#安装)
- [示例](#示例)
- [核心概念](#核心概念)
  - [创建应用](#创建应用)
    - [一个爬虫应用实例](#一个爬虫应用实例)
    - [选择爬取模式](#选择爬取模式)
    - [多个爬虫应用实例](#多个爬虫应用实例)
  - [爬取页面](#爬取页面)
    - [browser 实例](#browser-实例)
    - [page 实例](#page-实例)
  - [爬取接口](#爬取接口)
  - [爬取文件](#爬取文件)
  - [启动轮询](#启动轮询)
  - [配置优先级](#配置优先级)
  - [间隔时间](#间隔时间)
  - [失败重试](#失败重试)
  - [优先队列](#优先队列)
  - [关于结果](#关于结果)
  - [TypeScript](#TypeScript)
- [API](#API)
  - [xCrawl](#xCrawl)
    - [类型](#类型)
    - [示例](#示例-1)
  - [crawlPage](#crawlPage)
    - [类型](#类型-1)
    - [示例](#示例-2)
    - [配置](#配置)
  - [crawlData](#crawlData)
    - [类型](#类型-2)
    - [示例](#示例-3)
    - [配置](#配置-1)
  - [crawlFile](#crawlFile)
    - [类型](#类型-3)
    - [示例](#示例-4)
    - [配置](#配置-2)
  - [startPolling](#startPolling)
    - [类型](#类型-4)
    - [示例](#示例-5)
    - [类型](#类型-5)
- [类型](#类型-6)
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
      - [CrawlPageConfig](#CrawlPageConfig)
      - [CrawlDataConfig](#CrawlDataConfig)
      - [CrawlFileConfig](#CrawlFileConfig)
      - [StartPollingConfig](#StartPollingConfig)
  - [API Result](#API-Result)
    - [XCrawlInstance](#XCrawlInstance)
    - [CrawlCommonRes](#CrawlCommonRes)
    - [CrawlPageSingleRes](#CrawlPageSingleRes)
    - [CrawlDataSingleRes](#CrawlDataSingleRes)
    - [CrawlFileSingleRes](#CrawlFileSingleRes)
    - [CrawlPageRes](#CrawlPageRes)
    - [CrawlDataRes](#CrawlDataRes)
    - [CrawlFileRes](#CrawlFileRes)
  - [API Other](#API-Other)
    - [AnyObject](#AnyObject)
- [更多](#更多)

## 安装

以 NPM 为例:

```shell
npm install x-crawl
```

## 示例

每天自动获取 bilibili 首页、国漫、电影这三个页面的轮播图片为例:

```js
// 1.导入模块 ES/CJS
import xCrawl from 'x-crawl'

// 2.创建一个爬虫实例
const myXCrawl = xCrawl({ maxRetry: 3, intervalTime: { max: 3000, min: 2000 } })

// 3.设置爬取任务
// 调用 startPolling API 开始轮询功能，每隔一天会调用回调函数
myXCrawl.startPolling({ d: 1 }, async (count, stopPolling) => {
  // 调用 crawlPage API 爬取 首页、国漫、电影 这三个页面
  const res = await myXCrawl.crawlPage([
    'https://www.bilibili.com',
    'https://www.bilibili.com/guochuang',
    'https://www.bilibili.com/movie'
  ])

  // 存放图片 URL
  const imgUrls: string[] = []
  const elSelectorMap = ['.carousel-inner img', '.chief-recom-item img', '.bg-item img']
  for (const item of res) {
    const { id } = item
    const { page } = item.data

    // 获取页面轮播图片元素的 URL
    const urls = await page.$$eval(elSelectorMap[id - 1], (imgEls) =>
      imgEls.map((item) => item.src)
    )
    imgUrls.push(...urls)

    // 关闭页面
    page.close()
  }

  // 调用 crawlFile API 爬取图片
  await myXCrawl.crawlFile({
    requestConfigs: imgUrls,
    fileConfig: { storeDir: './upload' }
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

const myXCrawl = xCrawl()

myXCrawl.crawlPage('https://xxx.com').then((res) => {
  const { browser, page } = res.data

  // 关闭浏览器
  browser.close()
})
```

#### browser 实例

它是 [Browser](https://pptr.dev/api/puppeteer.browser) 的实例对象，具体使用可以参考 [Browser](https://pptr.dev/api/puppeteer.browser) 。

browser 实例他是个无头浏览器，并无 UI 外壳，他做的是将浏览器渲染引擎提供的**所有现代网络平台功能**带到代码中。

**注意：** browser 实例内部会一直产生事件循环，造成文件不会终止，如果想停止可以执行 browser.close() 关闭。如果后面还需要用到 [crawlPage](#crawlPage) 或者 [page](#page) 请勿调用。因为当您修改 browser 实例的属性时，会对该爬虫实例 crawlPage API 内部的 browser 实例和返回结果的 page 实例以及 browser 实例造成影响，因为 browser 实例在同一个爬虫实例的 crawlPage API 内是共享的。

#### page 实例

它是 [Page](https://pptr.dev/api/puppeteer.page) 的实例对象，实例还可以做事件之类的交互操作，具体使用可以参考 [page](https://pptr.dev/api/puppeteer.page) 。

browser 实例内部会保留着对 page 实例的引用，如果后续不再使用需要自行关闭 page 实例，否则会造成内存泄露。

**获取屏幕截图**

```js
import xCrawl from 'x-crawl'

const myXCrawl = xCrawl()

myXCrawl.crawlPage('https://xxx.com').then(async (res) => {
  const { browser, page } = res.data

  // 获取页面渲染后的截图
  await page.screenshot({ path: './upload/page.png' })

  console.log('获取屏幕截图完毕')

  browser.close()
})
```

### 爬取接口

通过 [crawlData()](#crawlData) 爬取接口数据。

```js
import xCrawl from 'x-crawl'

const myXCrawl = xCrawl({ intervalTime: { max: 3000, min: 1000 } })

const requestConfigs = [
  'https://xxx.com/xxxx',
  'https://xxx.com/xxxx',
  { url: 'https://xxx.com/xxxx', method: 'POST', data: { name: 'coderhxl' } }
]

myXCrawl.crawlData({ requestConfigs }).then((res) => {
  // 处理
})
```

### 爬取文件

通过 [crawlFile()](#crawlFile) 爬取文件数据。

```js
import xCrawl from 'x-crawl'

const myXCrawl = xCrawl({ intervalTime: { max: 3000, min: 1000 } })

myXCrawl
  .crawlFile({
    requestConfigs: ['https://xxx.com/xxxx', 'https://xxx.com/xxxx'],
    fileConfig: {
      storeDir: './upload' // 存放文件夹
    }
  })
  .then((res) => {})
```

### 启动轮询

通过 [startPolling()](#startPolling) 启动一个轮询爬取。

```js
import xCrawl from 'x-crawl'

const myXCrawl = xCrawl({
  timeout: 10000
})

myXCrawl.startPolling({ h: 2, m: 30 }, async (count, stopPolling) => {
  // 每隔两个半小时会执行一次
  // crawlPage/crawlData/crawlFile
  const res = await myXCrawl.crawlPage('https://xxx.com')
  res.data.page.close()
})
```

**在轮询中使用 crawlPage 注意：** 调用 page.close() 是为了防止 browser 实例内部还保留着对 page 实例的引用，如果后续不再使用当前 page 需要自行关闭，否则会造成内存泄露。

回调函数参数：

- count 属性记录当前是第几次轮询操作。
- stopPolling 是一个回调函数，调用其可以终止后面的轮询操作。

### 配置优先级

一些通用的配置可以在三个地方设置：

- 爬虫应用实例（全局）
- 爬虫 API （局部）
- 请求配置（单独）

优先级为：request config > API config > application config

### 间隔时间

间隔时间可以防止并发量太大，避免给服务器造成太大的压力。

爬取间隔时间是由实例方法内部控制的，并非由实例控制整个爬取间隔时间。

```js
import xCrawl from 'x-crawl'

const myXCrawl = xCrawl()

myXCrawl
  .crawlData({
    requestConfigs: ['https://xxx.com/xxxx', 'https://xxx.com/xxxx'],
    intervalTime: { max: 2000, min: 1000 }
  })
  .then((res) => {})
```

intervalTime 选项默认为 undefined 。若有设置值，则会在请求前等待一段时间，可以防止并发量太大，避免给服务器造成太大的压力。

- number: 固定每次请求前必须等待的时间
- Object: 在 max 和 min 中随机取一个值，更加拟人化

**注意:** 第一次请求是不会触发间隔时间。

### 失败重试

失败重试在超时之类的错误发生时，将会等待这一轮请求结束后重新请求。

```js
import xCrawl from 'x-crawl'

const myXCrawl = xCrawl()

myXCrawl.crawlData({ url: 'https://xxx.com/xxxx', maxRetry: 1 }).then((res) => {})
```

maxRetry 属性决定要重试几次。

### 优先队列

优先队列可以让某个请求优先发送。

```js
import xCrawl from 'x-crawl'

const myXCrawl = xCrawl()

myXCrawl
  .crawlData([
    { url: 'https://xxx.com/xxxx', priority: 1 },
    { url: 'https://xxx.com/xxxx', priority: 10 },
    { url: 'https://xxx.com/xxxx', priority: 8 }
  ])
  .then((res) => {})
```

priority 属性的值越大就在当前爬取队列中越优先。

### 关于结果

对于结果，每个请求的结果将统一使用对象包裹着，该对象提供了关于这次请求结果的信息，比如：id、结果、是否成功、最大重试、重试次数、收集到错误信息等。自动根据你选用的配置方式决定返回值是否包裹在一个数组中，并且在 TS 中类型完美适配。

每个对象的 id 是根据你配置里的请求顺序决定的，如果有使用优先级，则会根据优先级排序。

相关的配置方式和结果详情查看：[crawlPage 配置](#配置)、[crawlData 配置](#配置-1)、[crawlFile 配置](#配置-2) 。

### TypeScript

像 TypeScript 这样的类型系统可以在编译时通过静态分析检测出很多常见错误。这减少了运行时错误，也让我们在重构大型项目的时候更有信心。通过 IDE 中基于类型的自动补全，TypeScript 还改善了开发体验和效率。

x-crawl 本身就是用 TypeScript 编写的，并对 TypeScript 提供了支持。自带类型声明文件，开箱即用。

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
  intervalTime: { max: 2000, min: 1000 }
})
```

### crawlPage

crawlPage 是爬虫实例的方法，通常用于爬取页面。

#### 类型

- 查看 [CrawlPageConfig](#CrawlPageConfig) 类型
- 查看 [CrawlPageSingleRes](#CrawlPageSingleRes) 类型
- 查看 [CrawlPageRes](#CrawlPageRes) 类型

```ts
function crawlPage: <T extends CrawlPageConfig>(
  config: T,
  callback?: ((res: CrawlPageSingleRes) => void) | undefined
) => Promise<CrawlPageRes<T>>
```

#### 示例

```js
import xCrawl from 'x-crawl'

const myXCrawl = xCrawl()

// crawlPage API
myXCrawl.crawlPage('https://xxx.com/xxx').then((res) => {
  const { browser, page } = res.data

  // 关闭浏览器
  browser.close()
})
```

#### 配置

一共有 4 种:

- string
- PageRequestConfig
- (string | PageRequestConfig)[]
- CrawlPageConfigObject

**1.string**

如果你只想单纯爬一下这个页面，可以试试这种写法：

```js
import xCrawl from 'x-crawl'

const myXCrawl = xCrawl()

myXCrawl.crawlPage('https://xxx.com/xxxx').then((res) => {})
```

拿到的 res 将是一个对象。

**2.PageRequestConfig**

PageRequestConfig 的更多配置选项可以查看 [PageRequestConfig](#PageRequestConfig) 。

如果你想爬一下这个页面，并且需要失败重试之类的，可以试试这种写法：

```js
import xCrawl from 'x-crawl'

const myXCrawl = xCrawl()

myXCrawl
  .crawlPage({
    url: 'https://xxx.com/xxxx',
    proxy: 'xxx',
    maxRetry: 1
  })
  .then((res) => {})
```

拿到的 res 将是一个对象。

**3.(string | PageRequestConfig)[]**

PageRequestConfig 的更多配置选项可以查看 [PageRequestConfig](#PageRequestConfig) 。

如果你想爬取多个页面，并且有些页面需要失败重试之类的，可以试试这种写法：

```js
import xCrawl from 'x-crawl'

const myXCrawl = xCrawl()

myXCrawl
  .crawlPage(['https://xxx.com/xxxx', { url: 'https://xxx.com/xxxx', maxRetry: 2 }])
  .then((res) => {})
```

拿到的 res 将是一个数组，里面是对象。

**4.CrawlPageConfigObject**

CrawlPageConfigObject 的更多配置选项可以查看 [CrawlPageConfigObject](#CrawlPageConfigObject) 。

如果你想爬取多个页面，并且请求配置（proxy、cookies、重试等等）不想重复写，需要间隔时间的话，可以试试这种写法：

```
import xCrawl from 'x-crawl'

const myXCrawl = xCrawl()

myXCrawl.crawlPage({
  requestConfigs: [
    'https://xxx.com/xxxx',
    { url: 'https://xxx.com/xxxx', maxRetry: 6 }
  ],
  intervalTime: { max: 3000, min: 1000 },
  cookies: 'xxx',
  maxRetry: 1
}).then((res) => {})
```

拿到的 res 将是一个数组，里面是对象。

关于结果的更多信息可查看 [关于结果](#关于结果) ，可以根据实际情况选用即可。

### crawlData

crawl 是爬虫实例的方法，通常用于爬取 API ，可获取 JSON 数据等等。

#### 类型

- 查看 [CrawlDataConfig](#CrawlDataConfig) 类型
- 查看 [CrawlDataSingleRes](#CrawlDataSingleRes) 类型
- 查看 [CrawlDataRes](#CrawlDataRes) 类型

```ts
function crawlData<D = any, T extends CrawlDataConfig = CrawlDataConfig>(
  config: T,
  callback?: ((res: CrawlDataSingleRes<D>) => void) | undefined
) => Promise<CrawlDataRes<D, T>>
```

#### 示例

```js
import xCrawl from 'x-crawl'

const myXCrawl = xCrawl({
  timeout: 10000,
  intervalTime: { max: 2000, min: 1000 }
})

// crawlData API
myXCrawl
  .crawlData({
    requestConfigs: ['https://xxx.com/xxxx', 'https://xxx.com/xxxx'],
    intervalTime: { max: 3000, min: 1000 },
    cookies: 'xxx',
    maxRetry: 1
  })
  .then((res) => {
    console.log(res)
  })
```

#### 配置

一共有 4 种:

- string
- DataRequestConfig
- (string | DataRequestConfig)[]
- CrawlDataConfigObject

**1.string**

如果你只想单纯爬一下这个数据，并且该接口是 GET 方式的，可以试试这种写法：

```js
import xCrawl from 'x-crawl'

const myXCrawl = xCrawl()

myXCrawl.crawlData('https://xxx.com/xxxx').then((res) => {})
```

拿到的 res 将是一个对象。

**2.DataRequestConfig**

DataRequestConfig 的更多配置选项可以查看 [DataRequestConfig](#DataRequestConfig) 。

如果你想爬一下这个数据，并且需要失败重试之类的，可以试试这种写法：

```js
import xCrawl from 'x-crawl'

const myXCrawl = xCrawl()

myXCrawl
  .crawlData({
    url: 'https://xxx.com/xxxx',
    proxy: 'xxx',
    maxRetry: 1
  })
  .then((res) => {})
```

拿到的 res 将是一个对象。

**3.(string | DataRequestConfig)[]**

DataRequestConfig 的更多配置选项可以查看 [DataRequestConfig](#DataRequestConfig) 。

如果你想爬取多个数据，并且有些数据需要失败重试之类的，可以试试这种写法：

```js
import xCrawl from 'x-crawl'

const myXCrawl = xCrawl()

myXCrawl
  .crawlPage(['https://xxx.com/xxxx', { url: 'https://xxx.com/xxxx', maxRetry: 2 }])
  .then((res) => {})
```

拿到的 res 将是一个数组，里面是对象。

**4.CrawlDataConfigObject**

CrawlPageConfigObject 的更多配置选项可以查看 [CrawlPageConfigObject](#CrawlPageConfigObject) 。

如果你想爬取多个数据，并且请求配置（proxy、cookies、重试等等）不想重复写，需要间隔时间的话，可以试试这种写法：

```
import xCrawl from 'x-crawl'

const myXCrawl = xCrawl()

myXCrawl.crawlData({
  requestConfigs: [
    'https://xxx.com/xxxx',
    { url: 'https://xxx.com/xxxx', maxRetry: 6 }
  ],
  intervalTime: { max: 3000, min: 1000 },
  cookies: 'xxx',
  maxRetry: 1
}).then((res) => {})
```

拿到的 res 将是一个数组，里面是对象。

关于结果的更多信息可查看 [关于结果](#关于结果) ，可以根据实际情况选用即可。

### crawlFile

crawlFile 是爬虫实例的方法，通常用于爬取文件，可获取图片、pdf 文件等等。

#### 类型

- 查看 [CrawlFileConfig](#CrawlFileConfig) 类型
- 查看 [CrawlFileSingleRes](#CrawlFileSingleRes) 类型
- 查看 [CrawlFileRes](#CrawlFileRes) 类型

```ts
function crawlFile<T extends CrawlFileConfig>(
  config: T,
  callback?: ((res: CrawlFileSingleRes) => void) | undefined
) => Promise<CrawlFileRes<T>>
```

#### 示例

```js
import xCrawl from 'x-crawl'

const myXCrawl = xCrawl({
  timeout: 10000,
  intervalTime: { max: 2000, min: 1000 }
})

// crawlFile API
myXCrawl
  .crawlFile({
    requestConfigs: ['https://xxx.com/xxxx', 'https://xxx.com/xxxx'],
    storeDir: './upload',
    intervalTime: { max: 3000, min: 1000 },
    maxRetry: 1
  })
  .then((res) => {})
```

#### 配置

一共有 3 种:

- FileRequestConfig
- FileRequestConfig[]
- CrawlFileConfigObject

**1.FileRequestConfig**

FileRequestConfig 的更多配置选项可以查看 [FileRequestConfig](#FileRequestConfig) 。

如果你想爬一下这个文件，并且需要失败重试之类的，可以试试这种写法：

```js
import xCrawl from 'x-crawl'

const myXCrawl = xCrawl()

myXCrawl
  .crawlFile({
    url: 'https://xxx.com/xxxx',
    proxy: 'xxx',
    maxRetry: 1,
    storeDir: './upload',
    fileName: 'xxx'
  })
  .then((res) => {})
```

拿到的 res 将是一个对象。

**2.FileRequestConfig[]**

FileRequestConfig 的更多配置选项可以查看 [FileRequestConfig](#FileRequestConfig) 。

如果你想爬取多个文件，并且有些数据需要失败重试之类的，可以试试这种写法：

```js
import xCrawl from 'x-crawl'

const myXCrawl = xCrawl()

myXCrawl
  .crawlFile([
    { url: 'https://xxx.com/xxxx', storeDir: './upload' },
    { url: 'https://xxx.com/xxxx', storeDir: './upload', maxRetry: 2 }
  ])
  .then((res) => {})
```

拿到的 res 将是一个数组，里面是对象。

**3.CrawlFileConfigObject**

CrawlFileConfigObject 的更多配置选项可以查看 [CrawlFileConfigObject](#CrawlFileConfigObject) 。

如果你想爬取多个数据，并且请求配置（storeDir、proxy、重试等等）不想重复写，需要间隔时间等等的话，可以试试这种写法：

```
import xCrawl from 'x-crawl'

const myXCrawl = xCrawl()

myXCrawl.crawlFile({
  requestConfigs: [
    'https://xxx.com/xxxx',
    { url: 'https://xxx.com/xxxx', storeDir: './upload/xxx' }
  ],
  storeDir: './upload',
  intervalTime: { max: 3000, min: 1000 },
  maxRetry: 1
}).then((res) => {})
```

拿到的 res 将是一个数组，里面是对象。

关于结果的更多信息可查看 [关于结果](#关于结果) ，可以根据实际情况选用即可。

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
    }) => Buffer | void
  }
}
```

##### CrawlPageConfig

```ts
export type CrawlPageConfig =
  | string
  | PageRequestConfig
  | (string | PageRequestConfig)[]
  | CrawlPageConfigObject
```

##### CrawlDataConfig

```ts
export type CrawlDataConfig =
  | string
  | DataRequestConfig
  | (string | DataRequestConfig)[]
  | CrawlDataConfigObject
```

##### CrawlFileConfig

```ts
export type CrawlFileConfig = FileRequestConfig | FileRequestConfig[] | CrawlFileConfigObject
```

##### StartPollingConfig

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
  crawlPage: <T extends CrawlPageConfig>(
    config: T,
    callback?: ((res: CrawlPageSingleRes) => void) | undefined
  ) => Promise<CrawlPageRes<T>>

  crawlData: <D = any, T extends CrawlDataConfig = CrawlDataConfig>(
    config: T,
    callback?: ((res: CrawlDataSingleRes<D>) => void) | undefined
  ) => Promise<CrawlDataRes<D, T>>

  crawlFile: <T extends CrawlFileConfig>(
    config: T,
    callback?: ((res: CrawlFileSingleRes) => void) | undefined
  ) => Promise<CrawlFileRes<T>>

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

#### CrawlPageRes

```ts
export type CrawlPageRes<R extends CrawlPageConfig> = R extends
  | (string | PageRequestConfig)[]
  | CrawlPageConfigObject
  ? CrawlPageSingleRes[]
  : CrawlPageSingleRes
```

#### CrawlDataRes

```ts
export type CrawlDataRes<D, R extends CrawlDataConfig> = R extends
  | (string | DataRequestConfig)[]
  | CrawlDataConfigObject
  ? CrawlDataSingleRes<D>[]
  : CrawlDataSingleRes<D>
```

#### CrawlFileRes

```ts
export type CrawlFileRes<R extends CrawlFileConfig> = R extends
  | FileRequestConfig[]
  | CrawlFileConfigObject
  ? CrawlFileSingleRes[]
  : CrawlFileSingleRes
```

### API Other

#### AnyObject

```ts
export interface AnyObject extends Object {
  [key: string | number | symbol]: any
}
```

## 更多

如果您有 **问题 、需求、好的建议** 请在 https://github.com/coder-hxl/x-crawl/issues 中提 **Issues** 。
