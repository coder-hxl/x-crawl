# x-crawl [![npm](https://img.shields.io/npm/v/x-crawl.svg)](https://www.npmjs.com/package/x-crawl) [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/coder-hxl/x-crawl/blob/main/LICENSE)

[English](https://github.com/coder-hxl/x-crawl#x-crawl) | 简体中文

x-crawl 是一个灵活的 Node.js 多功能爬虫库。用于爬页面、爬接口、爬文件以及轮询爬。

> 如果你也喜欢 x-crawl ，可以给 [x-crawl 存储库](https://github.com/coder-hxl/x-crawl) 点个 star 支持一下，感谢大家的支持！

## 特征

- **🔥 异步/同步** - 只需更改一下 mode 属性即可切换 异步/同步 爬取模式。
- **⚙️ 多种功能** - 可爬页面、爬接口、爬文件以及轮询爬。并且支持爬取单个或多个。
- **🖋️ 写法灵活** - 一种功能适配多种爬取配置、获取爬取结果的写法，写法非常灵活。
- **👀 设备指纹** - 零配置/自定义配置，即可避免通过指纹识别从不同位置识别并跟踪我们。
- **⏱️ 间隔爬取** - 无间隔/固定间隔/随机间隔，可以有效 使用/避免 高并发爬取。
- **🔄 失败重试** - 可针对所有爬取的请求设置，针对单次爬取的请求设置，针对单个请求设置进行失败重试。
- **🚀 优先队列** - 根据单个请求的优先级使用优先爬取。
- **☁️ 爬取 SPA** - 批量爬取 SPA（单页应用程序）生成预渲染内容（即“SSR”（服务器端渲染））。
- **⚒️ 控制页面** - 无头浏览器可以表单提交、键盘输入、事件操作、生成页面的屏幕截图等。
- **🧾 捕获记录** - 对爬取的结果进行捕获记录，并在控制台进行高亮的提醒。
- **🦾 TypeScript** - 拥有类型，通过泛型实现完整的类型。

## 跟 puppeteer 的关系

crawlPage API 内置了 [puppeteer](https://github.com/puppeteer/puppeteer) ，您只需要传入一些配置选项即可完成一些操作，结果会将 Brower 实例和 Page 实例暴露出来。

# 目录

- [安装](#安装)
- [示例](#示例)
- [核心概念](#核心概念)
  - [创建应用](#创建应用)
    - [一个爬虫应用实例](#一个爬虫应用实例)
    - [爬取模式](#爬取模式)
    - [设备指纹](#设备指纹)
    - [多个爬虫应用实例](#多个爬虫应用实例)
  - [爬取页面](#爬取页面)
    - [browser 实例](#browser-实例)
    - [page 实例](#page-实例)
    - [生命周期](#生命周期)
      - [onCrawlItemComplete](#onCrawlItemComplete)
  - [爬取接口](#爬取接口)
    - [生命周期](#生命周期-1)
      - [onCrawlItemComplete](#onCrawlItemComplete-1)
  - [爬取文件](#爬取文件)
    - [生命周期](#生命周期-2)
      - [onCrawlItemComplete](#onCrawlItemComplete-2)
      - [onBeforeSaveItemFile](#onBeforeSaveItemFile)
  - [启动轮询](#启动轮询)
  - [配置优先级](#配置优先级)
  - [设备指纹](#设备指纹-1)
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
  - [API Config](#API-config)
    - [XCrawlConfig](#XCrawlConfig)
    - [Detail target config](#Detail-target-config)
      - [CrawlPageDetailTargetConfig](#CrawlPageDetailTargetConfig)
      - [CrawlDataDetailTargetConfig](#CrawlDataDetailTargetConfig)
      - [CrawlFileDetailTargetConfig](#CrawlFileDetailTargetConfig)
    - [Advanced config](#Advanced-config)
      - [CrawlPageAdvancedConfig](#CrawlPageAdvancedConfig)
      - [CrawlDataAdvancedConfig](#CrawlDataAdvancedConfig)
      - [CrawlFileAdvancedConfig](#CrawlFileAdvancedConfig)
    - [StartPollingConfig](#StartPollingConfig)
    - [Crawl other config](#Crawl-other-config)
      - [CrawlCommonConfig](#CrawlCommonConfig)
      - [DetailTargetFingerprintCommon](#DetailTargetFingerprintCommon)
      - [AdvancedFingerprintCommon](#AdvancedFingerprintCommon)
      - [Mobile](#Mobile)
      - [Platform](#Platform)
      - [PageCookies](#PageCookies)
      - [Method](#Method)
      - [IntervalTime](#IntervalTime)
  - [API Result](#API-Result)
    - [XCrawlInstance](#XCrawlInstance)
    - [CrawlCommonRes](#CrawlCommonRes)
    - [CrawlPageSingleRes](#CrawlPageSingleRes)
    - [CrawlDataSingleRes](#CrawlDataSingleRes)
    - [CrawlFileSingleRes](#CrawlFileSingleRes)
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

  // 存放图片 URL 到 targets
  const targets = []
  const elSelectorMap = ['.carousel-inner', '.chief-recom-item', '.bg-item']
  for (const item of res) {
    const { id } = item
    const { page } = item.data

    // 获取页面轮播图片元素的 URL
    const urls = await page.$$eval(`${elSelectorMap[id - 1]} img`, (imgEls) =>
      imgEls.map((item) => item.src)
    )
    targets.push(...urls)

    // 关闭页面
    page.close()
  }

  // 调用 crawlFile API 爬取图片
  await myXCrawl.crawlFile({ targets, storeDir: './upload' })
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

#### 爬取模式

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

#### 设备指纹

可以通过一个属性控制是否使用默认的随机指纹，您也可以通过后续的爬取配置自定义指纹。

设置设备指纹是为了避免通过指纹识别从不同位置识别并跟踪我们。

```js
import xCrawl from 'x-crawl'

const myXCrawl = xCrawl({
  enableRandomFingerprint: true
})
```

enableRandomFingerprint 选项默认为 true。

- true: 启动随机设备指纹。可通过进阶版配置或详细目标版配置指定目标的指纹配置。
- false: 关闭随机设备指纹，不影响进阶版配置或详细版配置为目标指定的指纹配置。

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

myXCrawl.crawlPage('https://www.example.com').then((res) => {
  const { browser, page } = res.data

  // 关闭浏览器
  browser.close()
})
```

#### browser 实例

它是 [Browser](https://pptr.dev/api/puppeteer.browser) 的实例对象，具体使用可以参考 [Browser](https://pptr.dev/api/puppeteer.browser) 。

browser 实例他是个无头浏览器，并无 UI 外壳，他做的是将浏览器渲染引擎提供的**所有现代网络平台功能**带到代码中。

**注意：** browser 会一直保持着运行，造成文件不会终止，如果想停止可以执行 browser.close() 关闭。如果后面还需要用到 [crawlPage](#crawlPage) 或者 [page](#page) 请勿调用。因为当您修改 browser 实例的属性时，会对该爬虫实例 crawlPage API 内部的 browser 实例和返回结果的 page 实例以及 browser 实例造成影响，因为 browser 实例在同一个爬虫实例的 crawlPage API 内是共享的。

#### page 实例

它是 [Page](https://pptr.dev/api/puppeteer.page) 的实例对象，实例还可以做事件之类的交互操作，具体使用可以参考 [page](https://pptr.dev/api/puppeteer.page) 。

browser 实例内部会保留着对 page 实例的引用，如果后续不再使用需要自行关闭 page 实例，否则会造成内存泄露。

**获取屏幕截图**

```js
import xCrawl from 'x-crawl'

const myXCrawl = xCrawl()

myXCrawl.crawlPage('https://www.example.com').then(async (res) => {
  const { browser, page } = res.data

  // 获取页面渲染后的截图
  await page.screenshot({ path: './upload/page.png' })

  console.log('获取屏幕截图完毕')

  browser.close()
})
```

#### 生命周期

crawlPageAPI 拥有的声明周期函数:

- onCrawlItemComplete: 当每个爬取目标结束并处理后执行

##### onCrawlItemComplete

在 onCrawlItemComplete 函数中你可以拿到每个爬取目标的结果。

**注意:** 如果你需要一次性爬取很多页面，就需要在每个页面爬下来后，用这个生命周期函数来处理每个目标的结果并关闭 page 实例，如果不进行关闭操作，则会因开启的 page 过多而造成程序崩溃。

### 爬取接口

通过 [crawlData()](#crawlData) 爬取接口数据。

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
  // 处理
})
```

#### 生命周期

crawlData API 拥有的声明周期函数:

- onCrawlItemComplete: 当每个爬取目标结束并处理后执行

##### onCrawlItemComplete

在 onCrawlItemComplete 函数中你可以拿到每个爬取目标的结果。

### 爬取文件

通过 [crawlFile()](#crawlFile) 爬取文件数据。

```js
import xCrawl from 'x-crawl'

const myXCrawl = xCrawl({ intervalTime: { max: 3000, min: 1000 } })

myXCrawl
  .crawlFile({
    targets: [
      'https://www.example.com/file-1',
      'https://www.example.com/file-2'
    ],
    storeDir: './upload' // 存放文件夹
  })
  .then((res) => {})
```

#### 生命周期

crawlFile API 拥有的声明周期函数:

- onCrawlItemComplete: 当每个爬取目标结束并处理后执行

- onBeforeSaveItemFile: 在保存文件前执行

##### onCrawlItemComplete

在 onCrawlItemComplete 函数中你可以拿到每个爬取目标的结果。

##### onBeforeSaveItemFile

在 onBeforeSaveItemFile 函数中你可以拿到 Buffer 类型的文件，你可以对该 Buffer 进行处理，然后需要返回一个 Promise ，并且 resolve 是 Buffer 。

**调整图片大小**

使用 sharp 库对需要爬取的图片进行调整大小操作:

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
  const res = await myXCrawl.crawlPage('https://www.example.com')
  res.data.page.close()
})
```

**在轮询中使用 crawlPage 注意：** 调用 page.close() 是为了防止 browser 实例内部还保留着对 page 实例的引用，如果后续不再使用当前 page 需要自行关闭，否则会造成内存泄露。

回调函数参数：

- count 属性记录当前是第几次轮询操作。
- stopPolling 是一个回调函数，调用其可以终止后面的轮询操作。

### 配置优先级

一些通用的配置可以通过在这三个地方设置：

- 应用实例配置（全局）
- 进阶配置（局部）
- 详细目标配置（单独）

优先级为：详细目标配置 > 进阶配置 > 应用实例配置

以 crawlPage 爬取两个页面为例：

```js
import xCrawl from 'x-crawl'

// 应用实例配置
const myXCrawl = xCrawl({
  intervalTime: { max: 3000, min: 1000 }
})

// 进阶配置
myXCrawl.crawlPage({
  targets: [
    'https://www.example.com/page-1',
    {
      // 详细目标配置
      url: 'https://www.example.com/page-1',
      viewport: { width: 1920, height: 1080 }
    }
  ],
  intervalTime: 1000,
  viewport: { width: 800, height: 600 }
})
```

在上面的实例中，**应用实例配置**和**进阶配置**中都设置了间隔时间，那么将会以**进阶配置**的间隔时间为准。在**进阶配置**和**详细目标配置**中设置了视口，那么第二个目标是设置了视口，其将会以**详细目标配置**的视口为准。

### 设备指纹

自定义配置，即可避免通过指纹识别从不同位置识别并跟踪我们。

可以通过进阶用法在 fingerprint 传入多个信息，内部会帮助您随机分配给 targets 的每个目标。也可以直接用详细目标配置为目标设置特定的指纹。

以 crawlPage 为例：

```js
import xCrawl from 'x-crawl'

const myXCrawl = xCrawl({ intervalTime: { max: 5000, min: 3000 } })

myXCrawl
  .crawlPage({
    targets: [
      'https://www.example.com/page-1',
      {
        // 指定指纹
        url: 'https://www.example.com/page-2',
        fingerprint: {
          maxWidth: 1980,
          minWidth: 1980,
          maxHeight: 1080,
          minHidth: 1080,
          platform: 'Android'
        }
      }
    ],
    fingerprint: {
      // 为 targets 里的每个目标设置指纹
      maxWidth: 1980,
      maxHeight: 1080,
      userAgents: [
        'Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:47.0) Gecko/20100101 Firefox/47.0',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36',
        'Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:47.0) Gecko/20100101 Firefox/47.0'
      ],
      platforms: ['Chromium OS', 'iOS', 'Linux', 'macOS', 'Windows']
    }
  })
  .then((res) => {})
```

更多指纹选项可以前往对应的配置查看。

### 间隔时间

间隔时间可以防止并发量太大，避免给服务器造成太大的压力。

爬取间隔时间是由实例方法内部控制的，并非由实例控制整个爬取间隔时间。

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

intervalTime 选项默认为 undefined 。若有设置值，则会在请求前等待一段时间，可以防止并发量太大，避免给服务器造成太大的压力。

- number: 固定每次请求前必须等待的时间
- Object: 在 max 和 min 中随机取一个值，更加拟人化

**注意:** 第一次请求是不会触发间隔时间。

### 失败重试

失败重试在超时之类的错误发生时，将会等待这一轮请求结束后重新请求。

```js
import xCrawl from 'x-crawl'

const myXCrawl = xCrawl()

myXCrawl
  .crawlData({ url: 'https://www.example.com/api', maxRetry: 1 })
  .then((res) => {})
```

maxRetry 属性决定要重试几次。

### 优先队列

优先队列可以让某个请求优先发送。

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

xCrawl API 是一个函数。

```ts
function xCrawl(baseConfig?: XCrawlBaseConfig): XCrawlInstance
```

**参数类型：**

- 查看 [XCrawlBaseConfig](#XCrawlBaseConfig) 类型

**返回值类型：**

- 查看 [XCrawlInstance](#XCrawlInstance)类型

#### 示例

```js
import xCrawl from 'x-crawl'

// xCrawl API
const myXCrawl = xCrawl({
  baseUrl: 'https://www.example.com',
  timeout: 10000,
  intervalTime: { max: 2000, min: 1000 }
})
```

### crawlPage

crawlPage 是爬虫实例的方法，通常用于爬取页面。

#### 类型

crawlPage API 是一个函数。类型是 [重载函数](https://www.typescriptlang.org/docs/handbook/2/functions.html#function-overloads) 可以通过不同的配置参数调用该函数（在类型方面）。

```ts
type crawlPage = {
  (
    config: string,
    callback?: (res: CrawlPageSingleRes) => void
  ): Promise<CrawlPageSingleRes>

  (
    config: CrawlPageDetailTargetConfig,
    callback?: (res: CrawlPageSingleRes) => void
  ): Promise<CrawlPageSingleRes>

  (
    config: (string | CrawlPageDetailTargetConfig)[],
    callback?: (res: CrawlPageSingleRes[]) => void
  ): Promise<CrawlPageSingleRes[]>

  (
    config: CrawlPageAdvancedConfig,
    callback?: (res: CrawlPageSingleRes[]) => void
  ): Promise<CrawlPageSingleRes[]>
}
```

**参数类型：**

- 查看 [CrawlPageDetailTargetConfig](#CrawlPageDetailTargetConfig) 类型
- 查看 [CrawlPageAdvancedConfig](#CrawlPageAdvancedConfig) 类型

**返回值类型：**

- 查看 [CrawlPageSingleRes](#CrawlPageSingleRes) 类型

#### 示例

```js
import xCrawl from 'x-crawl'

const myXCrawl = xCrawl()

// crawlPage API
myXCrawl.crawlPage('https://www.example.com').then((res) => {
  const { browser, page } = res.data

  // 关闭浏览器
  browser.close()
})
```

#### 配置

一共有 4 种:

- string
- CrawlPageDetailTargetConfig
- (string | CrawlPageDetailTargetConfig)[]
- CrawlPageAdvancedConfig

**1.string**

这是简单目标配置。如果你只想单纯爬一下这个页面，可以试试这种写法：

```js
import xCrawl from 'x-crawl'

const myXCrawl = xCrawl()

myXCrawl.crawlPage('https://www.example.com').then((res) => {})
```

拿到的 res 将是一个对象。

**2.CrawlPageDetailTargetConfig**

这是详细目标配置。如果你想爬一下这个页面，并且需要失败重试之类的，可以试试这种写法：

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

拿到的 res 将是一个对象。

更多配置选项可以查看 [CrawlPageDetailTargetConfig](#CrawlPageDetailTargetConfig) 。

**3.(string | CrawlPageDetailTargetConfig)[]**

这是混合目标数组配置。如果你想爬取多个页面，并且有些页面需要失败重试之类的，可以试试这种写法：

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

拿到的 res 将是一个数组，里面是对象。

更多配置选项可以查看 [CrawlPageDetailTargetConfig](#CrawlPageDetailTargetConfig) 。

**4.CrawlPageAdvancedConfig**

这是进阶配置，targets 是混合目标数组配置。如果你想爬取多个页面，并且请求配置（proxy、cookies、重试等等）不想重复写，需要间隔时间的话，可以试试这种写法：

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

拿到的 res 将是一个数组，里面是对象。

更多配置选项可以查看 [CrawlPageAdvancedConfig](#CrawlPageAdvancedConfig) 。

关于结果的更多信息可查看 [关于结果](#关于结果) ，可以根据实际情况选用即可。

### crawlData

crawl 是爬虫实例的方法，通常用于爬取 API ，可获取 JSON 数据等等。

#### 类型

crawlData API 是一个函数。类型是 [重载函数](https://www.typescriptlang.org/docs/handbook/2/functions.html#function-overloads) 可以通过不同的配置参数调用该函数（在类型方面）。

```ts
type crawlData = {
  <T = any>(
    config: CrawlDataDetailTargetConfig,
    callback?: (res: CrawlDataSingleRes<T>) => void
  ): Promise<CrawlDataSingleRes<T>>

  <T = any>(
    config: string,
    callback?: (res: CrawlDataSingleRes<T>) => void
  ): Promise<CrawlDataSingleRes<T>>

  <T = any>(
    config: (string | CrawlDataDetailTargetConfig)[],
    callback?: (res: CrawlDataSingleRes<T>[]) => void
  ): Promise<CrawlDataSingleRes<T>[]>

  <T = any>(
    config: CrawlDataAdvancedConfig<T>,
    callback?: (res: CrawlDataSingleRes<T>[]) => void
  ): Promise<CrawlDataSingleRes<T>[]>
}
```

**参数类型：**

- 查看 [CrawlDataDetailTargetConfig](#CrawlDataDetailTargetConfig) 类型
- 查看 [CrawlDataAdvancedConfig](#CrawlDataAdvancedConfig) 类型

**返回值类型：**

- 查看 [CrawlDataSingleRes](#CrawlDataSingleRes) 类型

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
    targets: ['https://www.example.com/api-1', 'https://www.example.com/api-2'],
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
- CrawlDataDetailTargetConfig
- (string | CrawlDataDetailTargetConfig)[]
- CrawlDataAdvancedConfig

**1.string**

这是简单目标配置。如果你只想单纯爬一下这个数据，并且该接口是 GET 方式的，可以试试这种写法：

```js
import xCrawl from 'x-crawl'

const myXCrawl = xCrawl()

myXCrawl.crawlData('https://www.example.com/api').then((res) => {})
```

拿到的 res 将是一个对象。

**2.CrawlDataDetailTargetConfig**

这是详细目标配置。如果你想爬一下这个数据，并且需要失败重试之类的，可以试试这种写法：

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

拿到的 res 将是一个对象。

更多配置选项可以查看 [CrawlDataDetailTargetConfig](#CrawlDataDetailTargetConfig) 。

**3.(string | CrawlDataDetailTargetConfig)[]**

这是混合目标数组配置。如果你想爬取多个数据，并且有些数据需要失败重试之类的，可以试试这种写法：

```js
import xCrawl from 'x-crawl'

const myXCrawl = xCrawl()

myXCrawl
  .crawlPage([
    'https://www.example.com/api-1',
    { url: 'https://www.example.com/api-2', maxRetry: 2 }
  ])
  .then((res) => {})
```

拿到的 res 将是一个数组，里面是对象。

更多配置选项可以查看 [CrawlDataDetailTargetConfig](#CrawlDataDetailTargetConfig) 。

**4.CrawlDataAdvancedConfig**

这是进阶配置，targets 是混合目标数组配置。如果你想爬取多个数据，并且请求配置（proxy、cookies、重试等等）不想重复写，需要间隔时间的话，可以试试这种写法：

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

拿到的 res 将是一个数组，里面是对象。

更多配置选项可以查看 [CrawlPageAdvancedConfig](#CrawlPageAdvancedConfig) 。

关于结果的更多信息可查看 [关于结果](#关于结果) ，可以根据实际情况选用即可。

### crawlFile

crawlFile 是爬虫实例的方法，通常用于爬取文件，可获取图片、pdf 文件等等。

#### 类型

crawlFile API 是一个函数。类型是 [重载函数](https://www.typescriptlang.org/docs/handbook/2/functions.html#function-overloads) 可以通过不同的配置参数调用该函数（在类型方面）。

```ts
type crawlFile = {
  (
    config: CrawlFileDetailTargetConfig,
    callback?: (res: CrawlFileSingleRes) => void
  ): Promise<CrawlFileSingleRes>

  (
    config: CrawlFileDetailTargetConfig[],
    callback?: (res: CrawlFileSingleRes[]) => void
  ): Promise<CrawlFileSingleRes[]>

  (
    config: CrawlFileAdvancedConfig,
    callback?: (res: CrawlFileSingleRes[]) => void
  ): Promise<CrawlFileSingleRes[]>
}
```

**参数类型：**

- 查看 [CrawlFileDetailTargetConfig](#CrawlFileDetailTargetConfig) 类型
- 查看 [CrawlFileAdvancedConfig](#CrawlFileAdvancedConfig) 类型

**返回值类型：**

- 查看 [CrawlFileSingleRes](#CrawlFileSingleRes) 类型

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

#### 配置

一共有 3 种:

- CrawlFileDetailTargetConfig
- CrawlFileDetailTargetConfig[]
- CrawlFileAdvancedConfig

**1.CrawlFileDetailTargetConfig**

这是详细目标配置。如果你想爬一下这个文件，并且需要失败重试之类的，可以试试这种写法：

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

拿到的 res 将是一个对象。

更多配置选项可以查看 [CrawlFileDetailTargetConfig](#CrawlFileDetailTargetConfig) 。

**2.CrawlFileDetailTargetConfig[]**

这是详细目标数组配置。如果你想爬取多个文件，并且有些数据需要失败重试之类的，可以试试这种写法：

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

拿到的 res 将是一个数组，里面是对象。

更多配置选项可以查看 [CrawlFileDetailTargetConfig](#CrawlFileDetailTargetConfig) 。

**3.CrawlFileAdvancedConfig**

这是进阶配置，targets 是混合目标数组配置。如果你想爬取多个数据，并且请求配置（storeDir、proxy、重试等等）不想重复写，需要间隔时间等等的话，可以试试这种写法：

```js
import xCrawl from 'x-crawl'

const myXCrawl = xCrawl()

myXCrawl
  .crawlFile({
    targets: [
      'https://www.example.com/file-1',
      { url: 'https://www.example.com/file-2', storeDir: './upload/file2' }
    ],
    storeDir: './upload',
    intervalTime: { max: 3000, min: 1000 },
    maxRetry: 1
  })
  .then((res) => {})
```

拿到的 res 将是一个数组，里面是对象。

更多配置选项可以查看 [CrawlFileAdvancedConfig](#CrawlFileAdvancedConfig) 。

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

### API config

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
        maxWidth: number
        minWidth?: number
        maxHeight: number
        minHidth?: number
      })
    | null
}
```

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

#### Advanced config

##### CrawlPageAdvancedConfig

```ts
export interface CrawlPageAdvancedConfig extends CrawlCommonConfig {
  targets: (string | CrawlPageDetailTargetConfig)[]
  intervalTime?: IntervalTime
  fingerprint?: AdvancedFingerprintCommon & {
    maxWidth: number
    minWidth?: number
    maxHeight: number
    minHidth?: number
  }

  headers?: AnyObject
  cookies?: PageCookies
  viewport?: Viewport // puppeteer

  onCrawlItemComplete?: (crawlPageSingleRes: CrawlPageSingleRes) => void
}
```

##### CrawlDataAdvancedConfig

```ts
export interface CrawlDataAdvancedConfig<T> extends CrawlCommonConfig {
  targets: (string | CrawlDataDetailTargetConfig)[]
  intervalTime?: IntervalTime
  fingerprint?: AdvancedFingerprintCommon

  headers?: AnyObject

  onCrawlItemComplete?: (crawlDataSingleRes: CrawlDataSingleRes<T>) => void
}
```

##### CrawlFileAdvancedConfig

```ts
export interface CrawlFileAdvancedConfig extends CrawlCommonConfig {
  targets: (string | CrawlFileDetailTargetConfig)[]
  intervalTime?: IntervalTime
  fingerprint?: AdvancedFingerprintCommon

  headers?: AnyObject
  storeDir?: string
  extension?: string

  onCrawlItemComplete?: (crawlFileSingleRes: CrawlFileSingleRes) => void
  onBeforeSaveItemFile?: (info: {
    id: number
    fileName: string
    filePath: string
    data: Buffer
  }) => Promise<Buffer>
}
```

#### StartPollingConfig

```ts
export interface StartPollingConfig {
  d?: number
  h?: number
  m?: number
}
```

#### Crawl other config

##### CrawlCommonConfig

```ts
export interface CrawlCommonConfig {
  timeout?: number
  proxy?: string
  maxRetry?: number
}
```

##### DetailTargetFingerprintCommon

```ts
export interface DetailTargetFingerprintCommon {
  userAgent?: string
  ua?: string
  platform?: Platform
  platformVersion?: string
  mobile?: Mobile
  acceptLanguage?: string
}
```

##### AdvancedFingerprintCommon

```ts
export interface AdvancedFingerprintCommon {
  userAgents?: string[]
  uas?: string[]
  platforms?: Platform[]
  platformVersions?: string[]
  mobiles?: Mobile[]
  acceptLanguages?: string[]
}
```

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

### API result

#### XCrawlInstance

```ts
export interface XCrawlInstance {
  crawlPage: {
    (
      config: string,
      callback?: (res: CrawlPageSingleRes) => void
    ): Promise<CrawlPageSingleRes>

    (
      config: CrawlPageDetailTargetConfig,
      callback?: (res: CrawlPageSingleRes) => void
    ): Promise<CrawlPageSingleRes>

    (
      config: (string | CrawlPageDetailTargetConfig)[],
      callback?: (res: CrawlPageSingleRes[]) => void
    ): Promise<CrawlPageSingleRes[]>

    (
      config: CrawlPageAdvancedConfig,
      callback?: (res: CrawlPageSingleRes[]) => void
    ): Promise<CrawlPageSingleRes[]>
  }

  crawlData: {
    <T = any>(
      config: CrawlDataDetailTargetConfig,
      callback?: (res: CrawlDataSingleRes<T>) => void
    ): Promise<CrawlDataSingleRes<T>>

    <T = any>(
      config: string,
      callback?: (res: CrawlDataSingleRes<T>) => void
    ): Promise<CrawlDataSingleRes<T>>

    <T = any>(
      config: (string | CrawlDataDetailTargetConfig)[],
      callback?: (res: CrawlDataSingleRes<T>[]) => void
    ): Promise<CrawlDataSingleRes<T>[]>

    <T = any>(
      config: CrawlDataAdvancedConfig<T>,
      callback?: (res: CrawlDataSingleRes<T>[]) => void
    ): Promise<CrawlDataSingleRes<T>[]>
  }

  crawlFile: {
    (
      config: CrawlFileDetailTargetConfig,
      callback?: (res: CrawlFileSingleRes) => void
    ): Promise<CrawlFileSingleRes>

    (
      config: CrawlFileDetailTargetConfig[],
      callback?: (res: CrawlFileSingleRes[]) => void
    ): Promise<CrawlFileSingleRes[]>

    (
      config: CrawlFileAdvancedConfig,
      callback?: (res: CrawlFileSingleRes[]) => void
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
  retryCount: number
  crawlErrorQueue: Error[]
}
```

#### CrawlPageSingleRes

```ts
export interface CrawlPageSingleRes extends CrawlCommonRes {
  data: {
    browser: Browser // puppeteer
    response: HTTPResponse | null // puppeteer
    page: Page // puppeteer
  }
}
```

#### CrawlDataSingleRes

```ts
export interface CrawlDataSingleRes<D> extends CrawlCommonRes {
  data: {
    statusCode: number | undefined
    headers: IncomingHttpHeaders // nodejs http
    data: D
  } | null
}
```

#### CrawlFileSingleRes

```ts
export interface CrawlFileSingleRes extends CrawlCommonRes {
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

## 更多

如果您有 **问题 、需求、好的建议** 请在 https://github.com/coder-hxl/x-crawl/issues 中提 **Issues** 。

感谢大家的支持。
