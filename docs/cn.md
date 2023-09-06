# x-crawl · [![npm](https://img.shields.io/npm/v/x-crawl.svg)](https://www.npmjs.com/package/x-crawl) [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/coder-hxl/x-crawl/blob/main/LICENSE)

[English](https://github.com/coder-hxl/x-crawl#x-crawl) | 简体中文

x-crawl 是一个灵活的 Node.js 多功能爬虫库。灵活的使用方式和众多的功能可以帮助您快速、安全、稳定地爬取页面、接口以及文件。

> 如果你也喜欢 x-crawl ，可以给 [x-crawl 存储库](https://github.com/coder-hxl/x-crawl) 点个 star 支持一下，感谢大家的支持！

## 特征

- **🔥 异步同步** - 只需更改一下 mode 属性即可切换异步或同步爬取模式。
- **⚙️ 多种用途** - 可爬页面、爬接口、爬文件以及轮询爬，满足各种场景需求。
- **☁️ 爬取 SPA** - 爬取 SPA（单页应用程序）生成预渲染内容（即“SSR”（服务器端渲染））。
- **⚒️ 控制页面** - 自动化表单提交、UI 测试、键盘输入、事件操作、打开浏览器等。
- **🖋️ 写法灵活** - 同种爬取 API 适配多种配置，每种配置方式都非常独特。
- **⏱️ 间隔爬取** - 无间隔、固定间隔以及随机间隔，产生或避免高并发爬取。
- **🔄 失败重试** - 避免因短暂的问题而造成爬取失败，自定义重试次数。
- **➡️ 轮换代理** - 配合失败重试，自定义错误次数以及 HTTP 状态码自动轮换代理。
- **👀 设备指纹** - 零配置或自定义配置，避免指纹识别从不同位置识别并跟踪我们。
- **🚀 优先队列** - 根据单个爬取目标的优先级可以优先于其他目标提前爬取。
- **🧾 捕获记录** - 对爬取进行捕获记录，并在终端使用彩色字符串提醒。
- **🦾 TypeScript** - 拥有类型，通过泛型实现完整的类型。

## 赞助

x-crawl 是采用 MIT 许可的开源项目，使用完全免费。如果你在工作中受益于我开发维护的项目，请考虑通过 [爱发电](https://afdian.net/a/coderhxl) 平台来支持一下我的工作。

# 目录

- [安装](#安装)
- [示例](#示例)
- [核心概念](#核心概念)
  - [创建应用](#创建应用)
    - [一个爬虫应用实例](#一个爬虫应用实例)
    - [爬取模式](#爬取模式)
    - [默认设备指纹](#默认设备指纹)
    - [多个爬虫应用实例](#多个爬虫应用实例)
  - [爬取页面](#爬取页面)
    - [browser 实例](#browser-实例)
    - [page 实例](#page-实例)
    - [生命周期](#生命周期)
      - [onCrawlItemComplete](#onCrawlItemComplete)
    - [打开浏览器](#打开浏览器)
  - [爬取接口](#爬取接口)
    - [生命周期](#生命周期-1)
      - [onCrawlItemComplete](#onCrawlItemComplete-1)
  - [爬取文件](#爬取文件)
    - [生命周期](#生命周期-2)
      - [onCrawlItemComplete](#onCrawlItemComplete-2)
      - [onBeforeSaveItemFile](#onBeforeSaveItemFile)
  - [启动轮询](#启动轮询)
  - [配置优先级](#配置优先级)
  - [间隔时间](#间隔时间)
  - [失败重试](#失败重试)
  - [轮换代理](#轮换代理)
  - [自定义设备指纹](#自定义设备指纹)
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
      - [简单目标配置 - string](#简单目标配置---string)
      - [详细目标配置 - CrawlPageDetailTargetConfig](#详细目标配置---CrawlPageDetailTargetConfig)
      - [混合目标数组配置 - (string | CrawlPageDetailTargetConfig)[]](#混合目标数组配置---string--CrawlPageDetailTargetConfig)
      - [进阶配置 - CrawlPageAdvancedConfig](#进阶配置---CrawlPageAdvancedConfig)
  - [crawlData](#crawlData)
    - [类型](#类型-2)
    - [示例](#示例-3)
    - [配置](#配置-1)
      - [简单目标配置 - string](#简单目标配置---string-1)
      - [详细目标配置 - CrawlDataDetailTargetConfig](#详细目标配置---CrawlDataDetailTargetConfig)
      - [混合目标数组配置 - (string | CrawlDataDetailTargetConfig)[]](#混合目标数组配置---string--CrawlDataDetailTargetConfig)
      - [进阶配置 - CrawlDataAdvancedConfig](#进阶配置---CrawlDataAdvancedConfig)
  - [crawlFile](#crawlFile)
    - [类型](#类型-3)
    - [示例](#示例-4)
    - [配置](#配置-2)
      - [详细目标配置 - CrawlFileDetailTargetConfig](#详细目标配置---CrawlFileDetailTargetConfig)
      - [详细目标数组配置 - CrawlFileDetailTargetConfig[]](#详细目标数组配置---CrawlFileDetailTargetConfig)
      - [进阶配置 - CrawlFileAdvancedConfig](#进阶配置---CrawlFileAdvancedConfig)
  - [startPolling](#startPolling)
    - [类型](#类型-4)
    - [示例](#示例-5)
    - [类型](#类型-5)
- [类型](#类型-6)
  - [API Config](#API-config)
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
- [常见问题](#常见问题)
  - [crawlPage API 跟 puppeteer 的关系](#crawlPage-API-跟-puppeteer-的关系)
- [更多](#更多)
  - [社区](#社区)
  - [Issues](#Issues)
  - [赞助](#赞助-1)

## 安装

以 NPM 为例:

```shell
npm install x-crawl
```

## 示例

以每天自动获取世界各地的经历和房间的一些照片为例：

```js
// 1.导入模块 ES/CJS
import xCrawl from 'x-crawl'

// 2.创建一个爬虫实例
const myXCrawl = xCrawl({ maxRetry: 3, intervalTime: { max: 2000, min: 1000 } })

// 3.设置爬取任务
// 调用 startPolling API 开始轮询功能，每隔一天会调用回调函数
myXCrawl.startPolling({ d: 1 }, async (count, stopPolling) => {
  // 调用 crawlPage API 来爬取页面
  const pageResults = await myXCrawl.crawlPage({
    targets: [
      'https://www.airbnb.cn/s/*/experiences',
      'https://www.airbnb.cn/s/plus_homes'
    ],
    viewport: { width: 1920, height: 1080 }
  })

  // 通过遍历爬取页面结果获取图片 URL
  const imgUrls = []
  for (const item of pageResults) {
    const { id } = item
    const { page } = item.data
    const elSelector = id === 1 ? '.i9cqrtb' : '.c4mnd7m'

    // 等待页面元素出现
    await page.waitForSelector(elSelector)

    // 获取页面图片的 URL
    const urls = await page.$$eval(`${elSelector} picture img`, (imgEls) =>
      imgEls.map((item) => item.src)
    )
    imgUrls.push(...urls.slice(0, 8))

    // 关闭页面
    page.close()
  }

  // 调用 crawlFile API 爬取图片
  await myXCrawl.crawlFile({ targets: imgUrls, storeDirs: './upload' })
})
```

运行效果:

<div align="center">
  <img src="https://raw.githubusercontent.com/coder-hxl/x-crawl/main/assets/run-example-gif.gif" />
</div>

**注意:** 请勿随意爬取，爬取前可查看 **robots.txt** 协议。网站的类名可能会有变更，这里只是为了演示如何使用 x-crawl 。

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

- async: 异步爬取目标，无需等当前爬取目标完成，就进行下次爬取目标
- sync: 同步爬取目标，需要等这次爬取目标完成，才会进行下次爬取目标

若有设置间隔时间，则都需要等间隔时间结束才会爬取下次目标。

**注意:** 爬取 API 的爬取过程都是单独进行的，该模式对批量爬取目标才有效。

#### 默认设备指纹

可以通过一个属性控制是否使用默认的随机指纹，您也可以通过后续的爬取配置自定义指纹。

设置设备指纹是为了避免通过指纹识别从不同位置识别并跟踪我们。

```js
import xCrawl from 'x-crawl'

const myXCrawl = xCrawl({
  enableRandomFingerprint: true
})
```

enableRandomFingerprint 选项默认为 true。

- true: 启动随机设备指纹。可通过进阶配置或详细目标配置指定目标的指纹配置。
- false: 关闭随机设备指纹，不影响进阶配置或详细目标配置为目标指定的指纹配置。

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

当你在同个爬虫实例调用 crawlPage API 进行爬取页面时，所用的 browser 实例都是同一个，因为 browser 实例在同个爬虫实例中的 crawlPage API 是共享的。具体使用可以参考 [Browser](https://pptr.dev/api/puppeteer.browser) 。

**注意：** browser 会一直保持着运行，造成文件不会终止，如果想停止可以执行 browser.close() 关闭。如果后面还需要用到 [crawlPage](#crawlPage) 或者 [page](#page) 请勿调用。因为 browser 实例在同个爬虫实例中的 crawlPage API 是共享的。

#### page 实例

当你在同个爬虫实例调用 crawlPage API 进行爬取页面时，都会从 browser 实例中产生一个新的 page 实例。具体使用可以参考 [Page](https://pptr.dev/api/puppeteer.page) 。

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

crawlPage API 拥有的声明周期函数:

- onCrawlItemComplete: 当每个爬取目标完成后会回调

##### onCrawlItemComplete

在 onCrawlItemComplete 函数中你可以提前拿到每次爬取目标的结果。

**注意:** 如果你需要一次性爬取很多页面，就需要在每个页面爬下来后，用这个生命周期函数来处理每个目标的结果并关闭 page 实例，如果不进行关闭操作，则会因开启的 page 过多而造成程序崩溃。

#### 打开浏览器

取消以无头模式运行浏览器。

```js
import xCrawl from 'x-crawl'

const myXCrawl = xCrawl({
  maxRetry: 3,
  // 取消以无头模式运行浏览器
  crawlPage: { puppeteerLaunch: { headless: false } }
})

myXCrawl.crawlPage('https://www.example.com').then((res) => {})
```

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

- onCrawlItemComplete: 当每个爬取目标完成后会回调

##### onCrawlItemComplete

在 onCrawlItemComplete 函数中你可以提前拿到每次爬取目标的结果。

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
    storeDirs: './upload' // 存放文件夹
  })
  .then((res) => {})
```

#### 生命周期

crawlFile API 拥有的声明周期函数:

- onCrawlItemComplete: 当每个爬取目标完成后会回调

- onBeforeSaveItemFile: 会在保存文件前回调

##### onCrawlItemComplete

在 onCrawlItemComplete 函数中你可以提前拿到每次爬取目标的结果。

##### onBeforeSaveItemFile

在 onBeforeSaveItemFile 函数中你可以拿到 Buffer 类型的文件，你可以对该 Buffer 进行处理，然后需要返回一个 Promise ，并且 resolve 是 Buffer ，该 Buffer 会替换掉拿到的 Buffer 存储到文件中。

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

**在轮询中使用 crawlPage 注意：** browser 实例内部会保留着对 page 实例的引用，如果后续不再使用需要自行关闭 page 实例，否则会造成内存泄露。

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
const testXCrawl = xCrawl({
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

// 进阶配置
testXCrawl
  .crawlPage({
    targets: [
      'https://www.example.com/page-1',
      'https://www.example.com/page-2',
      // 详细目标配置
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
```

在上面的实例中，**应用实例配置**、**进阶配置**以及**详细目标配置**中都设置了**代理**，page3 将会采用自己的代理配置，page1 和 page2 将采用进阶配置的代理配置。

### 间隔时间

间隔时间可以防止并发量太大，避免给服务器造成太大的压力。

爬取间隔时间是由爬取 API 内部自己控制的，并非由爬虫实例控制爬取 API 的间隔时间。

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

intervalTime 选项默认为 undefined 。若有设置值，则会在爬取目标前等待一段时间，可以防止并发量太大，避免给服务器造成太大的压力。

- number: 固定每次爬取目标前必须等待的时间
- IntervalTime: 在 max 和 min 中随机取一个值

**注意:** 第一次爬取目标是不会触发间隔时间。

### 失败重试

可避免因一时问题而造成爬取失败，将会等待这一轮爬取目标结束后重新爬取目标。

可以在 创建爬虫应用实例、进阶用法、详细目标 这三个地方设置。

```js
import xCrawl from 'x-crawl'

const myXCrawl = xCrawl()

myXCrawl
  .crawlData({ url: 'https://www.example.com/api', maxRetry: 9 })
  .then((res) => {})
```

maxRetry 属性决定要重试几次。

### 轮换代理

配合失败重试，自定义错误次数以及 HTTP 状态码为爬取目标自动轮换代理。

可以在 创建爬虫应用实例、进阶用法、详细目标 这三个地方设置。

以 crawlPage 为例：

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
      // 为此目标取消代理
      { url: 'https://www.example.com/page-6', proxy: null },
      // 为此目标单独设置代理
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
    // 为此次的目标统一设置代理
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

**注意:** 该功能需要配合失败重试才能正常使用。

### 自定义设备指纹

自定义配置设备指纹，可避免通过指纹识别从不同位置识别并跟踪我们。

可以通过进阶用法在 fingerprints 传入多个信息，内部会帮助您随机分配给 targets 的每个目标。也可以直接用详细目标配置为目标设置特定的指纹。

以 crawlPage 为例：

```js
import xCrawl from 'x-crawl'

const myXCrawl = xCrawl({ intervalTime: { max: 5000, min: 3000 } })

myXCrawl.crawlPage({
  targets: [
    'https://www.example.com/page-1',
    'https://www.example.com/page-2',
    'https://www.example.com/page-3',
    // 为此目标取消指纹
    { url: 'https://www.example.com/page-4', fingerprint: null },
    // 为此目标单独设置指纹
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
  // 为此次的目标统一设置指纹
  fingerprints: [
    // 设备指纹 1
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
            // 浏览器版本
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
    // 设备指纹 2
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
    // 设备指纹 3
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

更多指纹选项可以前往对应的配置查看。

### 优先队列

优先队列可以让某个爬取目标优先发送。

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

每个爬取目标都会产生一个详情对象，该详情对象会包含以下属性：

- id：根据爬取目标的顺序生成的，如果有优先级，则会根据优先级生成
- isSuccess：是否成功爬取
- maxRetry：该次爬取目标的最大重试次数
- retryCount：该次爬取目标已经重试的次数
- proxyDetails：记录代理情况
- crawlErrorQueue：该次爬取目标的报错收集
- data：该次爬取目标的爬取数据

如果是特定的配置，会自动根据你选用的配置方式决定详情对象是否存放在一个数组中，并把该数组返回，否则返回详情对象。已经在 TypeScript 中类型完美适配。

相关的配置方式和结果详情查看：[crawlPage 配置](#配置)、[crawlData 配置](#配置-1)、[crawlFile 配置](#配置-2) 。

### TypeScript

像 TypeScript 这样的类型系统可以在编译时通过静态分析检测出很多常见错误。这减少了运行时错误，也让我们在重构大型项目的时候更有信心。通过 IDE 中基于类型的自动补全，TypeScript 还改善了开发体验和效率。

x-crawl 本身就是用 TypeScript 编写的，并对 TypeScript 提供了支持。自带类型声明文件，开箱即用。

## API

### xCrawl

通过调用 xCrawl 创建一个爬虫实例。爬取目标是由实例方法内部自己维护，并非由实例自己维护。

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

**参数类型：**

- 查看 [CrawlPageDetailTargetConfig](#CrawlPageDetailTargetConfig) 类型
- 查看 [CrawlPageAdvancedConfig](#CrawlPageAdvancedConfig) 类型

**返回值类型：**

- 查看 [CrawlPageSingleResult](#CrawlPageSingleResult) 类型

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

- 简单目标配置 - string
- 详细目标配置 - CrawlPageDetailTargetConfig
- 混合目标数组配置 - (string | CrawlPageDetailTargetConfig)[]
- 进阶配置 - CrawlPageAdvancedConfig

##### 简单目标配置 - string

这是简单目标配置。如果你只想单纯爬一下这个页面，可以试试这种写法：

```js
import xCrawl from 'x-crawl'

const myXCrawl = xCrawl()

myXCrawl.crawlPage('https://www.example.com').then((res) => {})
```

拿到的 res 将是一个对象。

##### 详细目标配置 - CrawlPageDetailTargetConfig

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

##### 混合目标数组配置 - (string | CrawlPageDetailTargetConfig)[]

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

##### 进阶配置 - CrawlPageAdvancedConfig

这是进阶配置，targets 是混合目标数组配置。如果你想爬取多个页面，并且爬取目标配置（proxy、cookies、重试等等）不想重复写，还需要间隔时间、设备指纹以及生命周期等等，可以试试这种写法：

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

**参数类型：**

- 查看 [CrawlDataDetailTargetConfig](#CrawlDataDetailTargetConfig) 类型
- 查看 [CrawlDataAdvancedConfig](#CrawlDataAdvancedConfig) 类型

**返回值类型：**

- 查看 [CrawlDataSingleResult](#CrawlDataSingleResult) 类型

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

- 简单目标配置 - string
- 详细目标配置 - CrawlDataDetailTargetConfig
- 混合目标数组配置 - (string | CrawlDataDetailTargetConfig)[]
- 进阶配置 - CrawlDataAdvancedConfig

##### 简单目标配置 - string

这是简单目标配置。如果你只想单纯爬一下这个数据，并且该接口是 GET 方式的，可以试试这种写法：

```js
import xCrawl from 'x-crawl'

const myXCrawl = xCrawl()

myXCrawl.crawlData('https://www.example.com/api').then((res) => {})
```

拿到的 res 将是一个对象。

##### 详细目标配置 - CrawlDataDetailTargetConfig

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

##### 混合目标数组配置 - (string | CrawlDataDetailTargetConfig)[]

这是混合目标数组配置。如果你想爬取多个数据，并且有些数据需要失败重试之类的，可以试试这种写法：

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

拿到的 res 将是一个数组，里面是对象。

更多配置选项可以查看 [CrawlDataDetailTargetConfig](#CrawlDataDetailTargetConfig) 。

##### 进阶配置 - CrawlDataAdvancedConfig

这是进阶配置，targets 是混合目标数组配置。如果你想爬取多个数据，并且爬取目标配置（proxy、cookies、重试等等）不想重复写，还需要间隔时间、设备指纹以及生命周期等等，可以试试这种写法：

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

**参数类型：**

- 查看 [CrawlFileDetailTargetConfig](#CrawlFileDetailTargetConfig) 类型
- 查看 [CrawlFileAdvancedConfig](#CrawlFileAdvancedConfig) 类型

**返回值类型：**

- 查看 [CrawlFileSingleResult](#CrawlFileSingleResult) 类型

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
    storeDirs: './upload',
    intervalTime: { max: 3000, min: 1000 },
    maxRetry: 1
  })
  .then((res) => {})
```

#### 配置

一共有 3 种:

- 详细目标配置 - CrawlFileDetailTargetConfig
- 详细目标数组配置 - CrawlFileDetailTargetConfig[]
- 进阶配置 - CrawlFileAdvancedConfig

##### 详细目标配置 - CrawlFileDetailTargetConfig

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

##### 详细目标数组配置 - CrawlFileDetailTargetConfig[]

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

##### 进阶配置 - CrawlFileAdvancedConfig

这是进阶配置，targets 是混合目标数组配置。如果你想爬取多个数据，并且爬取目标配置（proxy、storeDir、重试等等）不想重复写，还需要间隔时间、设备指纹以及生命周期等等，可以试试这种写法：

```js
import xCrawl from 'x-crawl'

const myXCrawl = xCrawl()

myXCrawl
  .crawlFile({
    targets: [
      'https://www.example.com/file-1',
      { url: 'https://www.example.com/file-2', storeDir: './upload/file2' }
    ],
    storeDirs: './upload',
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

### API Config

#### XCrawlConfig

```ts
export interface XCrawlConfig extends CrawlCommonConfig {
  mode?: 'async' | 'sync'
  enableRandomFingerprint?: boolean
  baseUrl?: string
  intervalTime?: IntervalTime
  crawlPage?: {
    puppeteerLaunch?: PuppeteerLaunchOptions // puppeteer
  }
}
```

**默认值**

- mode: 'async'
- enableRandomFingerprint: true
- baseUrl: undefined
- intervalTime: undefined
- crawlPage: undefined

#### Detail Target Config

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

**默认值**

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

**默认值**

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
  fileName?: string | null
  extension?: string | null
  fingerprint?: DetailTargetFingerprintCommon | null
}
```

**默认值**

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

**默认值**

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

**默认值**

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

  headers?: AnyObject

  onCrawlItemComplete?: (crawlFileSingleResult: CrawlFileSingleResult) => void
  onBeforeSaveItemFile?: (info: {
    id: number
    fileName: string
    filePath: string
    data: Buffer
  }) => Promise<Buffer>
}
```

**默认值**

- targets: undefined
- intervalTime: undefined
- fingerprints: undefined
- storeDirs: \_\_dirname
- extensions: string
- fileNames: undefined
- headers: undefined
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

**默认值**

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

**默认值**

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

**默认值**

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

- id：根据爬取目标的顺序生成的，如果有优先级，则会根据优先级生成
- isSuccess：是否成功爬取
- maxRetry：该次爬取目标的最大重试次数
- retryCount：该次爬取目标已经重试的次数
- proxyDetails：记录代理情况
- crawlErrorQueue：该次爬取目标的报错收集

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

## 常见问题

### crawlPage API 跟 puppeteer 的关系

crawlPage API 内置了 [puppeteer](https://github.com/puppeteer/puppeteer) ，您只需要传入一些配置选项即可让 x-crawl 帮助您简化操作，并拿到完好的 Brower 实例和 Page 实例，x-crawl 并不会对其重写。

## 更多

### 社区

- **Discord 聊天:** 通过 [Discord](https://discord.gg/SF7aaebg4E) 与其他 x-crawl 用户实时提问和讨论。

- **GitHub 讨论:** 使用 [GitHub 讨论](https://github.com/coder-hxl/x-crawl/discussions) 来进行留言板式的问题和讨论。

### Issues

如果您有 **问题 、需求、好的建议** 可以在 [GitHub Issues](https://github.com/coder-hxl/x-crawl/issues) 中提 **Issues** 。

### 赞助

x-crawl 是采用 MIT 许可的开源项目，使用完全免费。如果你在工作中受益于我开发维护的项目，请考虑通过 [爱发电](https://afdian.net/a/coderhxl) 平台来支持一下我的工作。
