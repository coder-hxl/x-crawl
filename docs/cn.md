# x-crawl · [![npm](https://img.shields.io/npm/v/x-crawl.svg)](https://www.npmjs.com/package/x-crawl) [![NPM Downloads](https://img.shields.io/npm/dt/x-crawl)](https://www.npmjs.com/package/x-crawl) [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/coder-hxl/x-crawl/blob/main/LICENSE)

[English](https://github.com/coder-hxl/x-crawl#x-crawl) | 简体中文

x-crawl 是一个灵活的 Node.js AI 辅助爬虫库。强大的 AI 辅助功能，使爬虫工作变得更加高效、智能和便捷。

> 如果您觉得 x-crawl 对您有所帮助，或者您喜欢 x-crawl ，可以在 GitHub 上给 [x-crawl 存储库](https://github.com/coder-hxl/x-crawl) 点个 star 。您的支持是我们持续改进的动力！感谢您的支持！

## 特征

- **🤖 AI 辅助** - 强大的 AI 辅助功能，使爬虫工作变得更加高效、智能和便捷。
- **🖋️ 写法灵活** - 单个爬取 API 都适配多种配置，每种配置方式都各有千秋。
- **⚙️ 功能丰富** - 支持爬动态页面、静态页面、接口数据以及文件数据。
- **⚒️ 控制页面** - 爬取动态页面支持自动化操作、键盘输入、事件操作等。
- **👀 设备指纹** - 零配置或自定义配置，避免指纹识别从不同位置识别并跟踪我们。
- **🔥 异步同步** - 无需切换爬取 API 即可进行异步或同步的爬取模式。
- **⏱️ 间隔爬取** - 无间隔、固定间隔以及随机间隔，决定是否高并发爬取。
- **🔄 失败重试** - 自定义重试次数，避免因短暂的问题而造成爬取失败。
- **➡️ 轮换代理** - 搭配失败重试，自定义错误次数以及 HTTP 状态码自动轮换代理。
- **🚀 优先队列** - 根据单个爬取目标的优先级可以优先于其他目标提前爬取。
- **🧾 记录爬取** - 可控的爬取信息，会在终端输出彩色字符串信息。
- **🦾 TypeScript** - 拥有类型，通过泛型实现完整的类型。

## 赞助

x-crawl 是采用 MIT 许可的开源项目。如果您在工作中受益于我开发维护的项目，为了让我能够持续投入精力进行项目的维护与更新，提升用户体验和功能，请考虑通过 [爱发电](https://afdian.net/a/coderhxl) 平台来支持一下我的工作。您的支持是我们持续改进的动力！感谢您的支持！

# 目录

- [安装](#安装)
- [示例](#示例)
- [基础](#基础)
  - [创建应用](#创建应用)
    - [一个爬虫应用实例](#一个爬虫应用实例)
    - [多个爬虫应用实例](#多个爬虫应用实例)
  - [爬取页面](#爬取页面)
    - [browser 实例](#browser-实例)
    - [page 实例](#page-实例)
    - [生命周期](#生命周期)
      - [onCrawlItemComplete](#onCrawlItemComplete)
    - [打开浏览器](#打开浏览器)
  - [爬取 HTML](#爬取-html)
    - [生命周期](#生命周期-1)
      - [onCrawlItemComplete](#onCrawlItemComplete-1)
  - [爬取接口](#爬取接口)
    - [生命周期](#生命周期-2)
      - [onCrawlItemComplete](#onCrawlItemComplete-2)
  - [爬取文件](#爬取文件)
    - [生命周期](#生命周期-3)
      - [onCrawlItemComplete](#onCrawlItemComplete-3)
      - [onBeforeSaveItemFile](#onBeforeSaveItemFile)
  - [间隔时间](#间隔时间)
  - [失败重试](#失败重试)
  - [轮换代理](#轮换代理)
  - [优先队列](#优先队列)
  - [终端信息](#终端信息)
  - [关于结果](#关于结果)
  - [TypeScript](#TypeScript)
- [AI 辅助](#AI-辅助)
  - [创建 AI 应用](#创建-AI-应用)
  - [智能按需分析元素](#智能按需分析元素)
  - [智能生成元素选择器](#智能生成元素选择器)
  - [智能回复爬虫问题](#智能回复爬虫问题)
  - [用户自定义 AI 功能](#用户自定义-AI-功能)
- [进阶](#进阶)
  - [爬取模式](#爬取模式)
  - [设备指纹](#设备指纹)
    - [默认设备指纹](#默认设备指纹)
    - [自定义设备指纹](#自定义设备指纹)
  - [配置](#配置)
    - [优先级](#优先级)
    - [取消复用配置选项](#取消复用配置选项)
- [API](#API)
  - [createCrawl](#createCrawl)
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
  - [crawlHTML](#crawlHTML)
    - [类型](#类型-2)
    - [示例](#示例-3)
    - [配置](#配置-1)
      - [简单目标配置 - string](#简单目标配置---string-1)
      - [详细目标配置 - CrawlHTMLDetailTargetConfig](#详细目标配置---CrawlHTMLDetailTargetConfig)
      - [混合目标数组配置 - (string | CrawlHTMLDetailTargetConfig)[]](#混合目标数组配置---string--CrawlHTMLDetailTargetConfig)
      - [进阶配置 - CrawlHTMLAdvancedConfig](#进阶配置---CrawlHTMLAdvancedConfig)
  - [crawlData](#crawlData)
    - [类型](#类型-3)
    - [示例](#示例-4)
    - [配置](#配置-2)
      - [简单目标配置 - string](#简单目标配置---string-2)
      - [详细目标配置 - CrawlDataDetailTargetConfig](#详细目标配置---CrawlDataDetailTargetConfig)
      - [混合目标数组配置 - (string | CrawlDataDetailTargetConfig)[]](#混合目标数组配置---string--CrawlDataDetailTargetConfig)
      - [进阶配置 - CrawlDataAdvancedConfig](#进阶配置---CrawlDataAdvancedConfig)
  - [crawlFile](#crawlFile)
    - [类型](#类型-4)
    - [示例](#示例-5)
    - [配置](#配置-3)
      - [简单目标配置 - string](#简单目标配置---string-3)
      - [详细目标配置 - (string | CrawlFileDetailTargetConfig)](#详细目标配置---CrawlFileDetailTargetConfig)
      - [详细目标数组配置 - CrawlFileDetailTargetConfig[]](#混合目标数组配置---string--CrawlFileDetailTargetConfig)
      - [进阶配置 - CrawlFileAdvancedConfig](#进阶配置---CrawlFileAdvancedConfig)
  - [createXCrawlOpenAI](#createXCrawlOpenAI)
    - [类型](#类型-5)
    - [示例](#示例-6)
  - [parseElements](#parseElements)
    - [类型](#类型-6)
    - [示例](#示例-7)
  - [getElementSelectors](#getElementSelectors)
    - [类型](#类型-7)
    - [示例](#示例-8)
  - [help](#help)
    - [类型](#类型-8)
    - [示例](#示例-9)
  - [custom](#custom)
    - [类型](#类型-9)
    - [示例](#示例-10)
- [类型](#类型-10)
  - [API Config](#API-config)
    - [CreateCrawlConfig](#CreateCrawlConfig)
    - [Detail Target Config](#Detail-Target-Config)
      - [CrawlPageDetailTargetConfig](#CrawlPageDetailTargetConfig)
      - [CrawlHTMLDetailTargetConfig](#CrawlHTMLDetailTargetConfig)
      - [CrawlDataDetailTargetConfig](#CrawlDataDetailTargetConfig)
      - [CrawlFileDetailTargetConfig](#CrawlFileDetailTargetConfig)
    - [Advanced Config](#Advanced-Config)
      - [CrawlPageAdvancedConfig](#CrawlPageAdvancedConfig)
      - [CrawlHTMLAdvancedConfig](#CrawlHTMLAdvancedConfig)
      - [CrawlDataAdvancedConfig](#CrawlDataAdvancedConfig)
      - [CrawlFileAdvancedConfig](#CrawlFileAdvancedConfig)
    - [Crawl Other Config](#Crawl-Other-Config)
      - [CrawlCommonConfig](#CrawlCommonConfig)
      - [DetailTargetFingerprintCommon](#DetailTargetFingerprintCommon)
      - [Mobile](#Mobile)
      - [Platform](#Platform)
      - [PageCookies](#PageCookies)
      - [Method](#Method)
      - [IntervalTime](#IntervalTime)
    - [CreateXCrawlOpenAIConfig](#CreateXCrawlOpenAIConfig)
    - [XCrawlOpenAIParseElementsContentOptions](#XCrawlOpenAIParseElementsContentOptions)
    - [XCrawlOpenAIGetElementSelectorsContentOptions](#XCrawlOpenAIGetElementSelectorsContentOptions)
    - [XCrawlOpenAICommonAPIOtherOption](#XCrawlOpenAICommonAPIOtherOption)
  - [API Result](#API-Result)
    - [CrawlApp](#CrawlApp)
    - [CrawlCommonResult](#CrawlCommonResult)
    - [CrawlPageSingleResult](#CrawlPageSingleResult)
    - [CrawlHTMLSingleResult](#CrawlHTMLSingleResult)
    - [CrawlDataSingleResult](#CrawlDataSingleResult)
    - [CrawlFileSingleResult](#CrawlFileSingleResult)
    - [XCrawlOpenAIApp](#XCrawlOpenAIApp)
    - [XCrawlOpenAIParseElementsResult](#XCrawlOpenAIParseElementsResult)
    - [XCrawlOpenAIGetElementSelectorsResult](#XCrawlOpenAIGetElementSelectorsResult)
- [常见问题](#常见问题)
  - [crawlPage API 跟 puppeteer 的关系](#crawlPage-API-跟-puppeteer-的关系)
  - [使用 crawlPage API 造成程序崩溃](#使用-crawlPage-API-造成程序崩溃)
- [更多](#更多)
  - [版本发布](#版本发布)
  - [旧版本文档](#旧版本文档)
  - [社区](#社区)
  - [Issues](#Issues)
  - [赞助](#赞助-1)
  - [注意事项](#注意事项)

## 安装

以 NPM 为例:

```shell
npm install x-crawl
```

## 示例

以每天自动获取世界各地的经历和房间的一些照片为例：

```js
// 1.导入模块 ES/CJS
import { createCrawl } from 'x-crawl'

// 2.创建一个爬虫实例
const crawlApp = createCrawl({
  maxRetry: 3,
  intervalTime: { max: 2000, min: 1000 }
})

// 3.设置爬取任务
// 调用 startPolling API 开始轮询功能，每隔一天会调用回调函数
crawlApp.startPolling({ d: 1 }, async (count, stopPolling) => {
  // 调用 crawlPage API 来爬取页面
  const pageResults = await crawlApp.crawlPage({
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
    imgUrls.push(...urls.slice(0, 6))

    // 关闭页面
    page.close()
  }

  // 调用 crawlFile API 爬取图片
  await crawlApp.crawlFile({ targets: imgUrls, storeDirs: './upload' })
})
```

运行效果:

<div align="center">
  <img src="https://raw.githubusercontent.com/coder-hxl/x-crawl/main/assets/run-example.gif" />
</div>

**注意:** x-crawl 仅供合法用途，禁止使用该工具进行任何违法活动，请务必遵守目标网站的 robots.txt 文件规定。网站的类名可能随时发生变更，本例仅用于演示 x-crawl 的使用方法，并非针对特定网站。

## 基础

### 创建爬虫应用

#### 一个爬虫应用实例

通过 [createCrawl()](#createCrawl) 创建一个新的 **应用实例**：

```js
import { createCrawl } from 'x-crawl'

const crawlApp = createCrawl({
  // 选项
})
```

相关的 **选项** 可参考 [CreateCrawlConfig](#CreateCrawlConfig) 。

#### 多个爬虫应用实例

```js
import { createCrawl } from 'x-crawl'

const crawlApp1 = createCrawl({
  // 选项
})

const crawlApp2 = createCrawl({
  // 选项
})
```

### 爬取页面

通过 [crawlPage()](#crawlPage) 爬取一个页面。

```js
import { createCrawl } from 'x-crawl'

const crawlApp = createCrawl()

crawlApp.crawlPage('https://www.example.com').then((res) => {
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

一个 browser 实例可能有多个 page 实例，如果后续不再使用需要自行关闭 page 实例，否则会造成内存泄露。

**获取屏幕截图**

```js
import { createCrawl } from 'x-crawl'

const crawlApp = createCrawl()

crawlApp.crawlPage('https://www.example.com').then(async (res) => {
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

#### 打开浏览器

取消以无头模式运行浏览器。

```js
import { createCrawl } from 'x-crawl'

const crawlApp = createCrawl({
  maxRetry: 3,
  // 取消以无头模式运行浏览器
  crawlPage: { puppeteerLaunchOptions: { headless: false } }
})

crawlApp.crawlPage('https://www.example.com').then((res) => {})
```

### 爬取 HTML

通过 [crawlHTML()](#crawlData) 爬取静态 HTML。

```js
import { createCrawl } from 'x-crawl'

const crawlApp = createCrawl({ intervalTime: { max: 3000, min: 1000 } })

crawlApp
  .crawlHTML([
    'https://www.example.com/html-1',
    'https://www.example.com/html-2'
  ])
  .then((res) => {
    // 处理
  })
```

#### 生命周期

crawlHTML API 拥有的声明周期函数:

- onCrawlItemComplete: 当每个爬取目标完成后会回调

##### onCrawlItemComplete

在 onCrawlItemComplete 函数中你可以提前拿到每次爬取目标的结果。

### 爬取接口

通过 [crawlData()](#crawlData) 爬取接口数据。

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
import { createCrawl } from 'x-crawl'

const crawlApp = createCrawl({ intervalTime: { max: 3000, min: 1000 } })

crawlApp
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

在 onBeforeSaveItemFile 函数中你可以拿到 Buffer 类型的文件，你可以对该 Buffer 进行处理，然后返回一个 Buffer 或者一个返回值是 Buffer 的 Promise ，x-crawl 会将返回的 Buffer 替换掉拿到的 Buffer 存储到文件中。

**调整图片大小**

使用 sharp 库对需要爬取的图片进行调整大小操作:

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

### 间隔时间

间隔时间可以防止并发量太大，避免给服务器造成太大的压力。

爬取间隔时间是由爬取 API 内部自己控制的，并非由爬虫实例控制爬取 API 的间隔时间。

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

intervalTime 选项默认为 undefined 。若有设置值，则会在爬取目标前等待一段时间，可以防止并发量太大，避免给服务器造成太大的压力。

- number: 固定每次爬取目标前必须等待的时间
- IntervalTime: 在 max 和 min 中随机取一个值

**注意:** 第一次爬取目标是不会触发间隔时间。

### 失败重试

可避免因一时问题而造成爬取失败，将会等待这一轮爬取目标结束后重新爬取目标。

可以在 创建爬虫应用实例、进阶用法、详细目标 这三个地方设置。

```js
import { createCrawl } from 'x-crawl'

const crawlApp = createCrawl()

crawlApp
  .crawlData({ url: 'https://www.example.com/api', maxRetry: 9 })
  .then((res) => {})
```

maxRetry 属性决定要重试几次。

### 轮换代理

配合失败重试，自定义错误次数以及 HTTP 状态码为爬取目标自动轮换代理。

可以在 创建爬虫应用实例、进阶用法、详细目标 这三个地方设置。

以 crawlPage 为例：

```js
import { createCrawl } from 'x-crawl'

const crawlApp = createCrawl()

crawlApp
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

### 优先队列

优先队列可以让某个爬取目标优先发送。

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

priority 属性的值越大就在当前爬取队列中越优先。

### 终端信息

爬取信息由开始（显示模式和总数）、过程（显示数量和等待多久）、结果（显示成功和失败信息）组成。每段信息前面都会有如 **1-page-2** ，前面的 1 代表第 1 个爬虫实例，中间的 page 代表 API 类型，后面的 2 代表第 1 个爬虫实例的第 2 个 page ，这样做的目的是为了更好区分信息来自哪个 API 。

当您不希望在终端显示爬取信息时，可以通过选项自己控制显示或隐藏。

```js
import { createCrawl } from 'x-crawl'

// 只隐藏过程，开始和结果显示
const crawlApp = createCrawl({ log: { process: false } })

// 隐藏全部信息
const crawlApp = createCrawl({ log: false })
```

log 选项接收对象或布尔类型：

- 布尔

  - true: 全部显示
  - false：全部隐藏

- 对象
  - start：对开始信息控制
  - process：对过程信息控制
  - result：对结果信息控制

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

相关的配置方式和结果详情查看：[crawlPage 配置](#配置)、[crawlHTML 配置](#配置-1)、[crawlData 配置](#配置-2)、[crawlFile 配置](#配置-3) 。

### TypeScript

像 TypeScript 这样的类型系统可以在编译时通过静态分析检测出很多常见错误。这减少了运行时错误，也让我们在重构大型项目的时候更有信心。通过 IDE 中基于类型的自动补全，TypeScript 还改善了开发体验和效率。

x-crawl 本身就是用 TypeScript 编写的，并对 TypeScript 提供了支持。自带类型声明文件，开箱即用。

## AI 辅助

强大的 AI 辅助功能，使爬虫工作变得更加高效、智能和便捷。

### 创建 AI 应用

目前 x-crawl 的 AI 辅助功能是依靠 OpenAI ，需要用到 OpenAI 的 API Key 。后续还可能加入其他 AI 的。

通过 [createXCrawlOpenAI()](#createXCrawlOpenAI) 创建一个新的 **应用实例**:

```js
import { createXCrawlOpenAI } from 'x-crawl'

const xCrawlOpenAIApp = createXCrawlOpenAI({
  clientOptions: { apiKey: '你的 API Key' }
})
```

**领取 API Key**

- **[OpenAI 官方的 API Key](https://platform.openai.com/api-keys)**
- **[免费的 API Key](https://github.com/chatanywhere/GPT_API_free)**

### 智能按需分析元素

无需手动分析 HTML 页面结构再提取所需的元素属性或值。现在只需将 HTML 代码输入到 AI 中，并告知 AI 您想获取哪些元素的信息，AI便会自动分析页面结构，提取出相应的元素属性或值。

使用 AI 应用实例的 parseElements 方法。

示例：

```js
import { createXCrawlOpenAI } from 'x-crawl'

const xCrawlOpenAIApp = createXCrawlOpenAI({
  clientOptions: { apiKey: '你的 API Key' }
})

const HTMLContent = `
  <div class="scroll-list">
    <div class="list-item">女装带帽卫衣</div>
    <div class="list-item">男装卫衣</div>
    <div class="list-item">女装卫衣</div>
    <div class="list-item">男装带帽卫衣</div>
  </div>
  <div class="scroll-list">
    <div class="list-item">男装纯棉短袖</div>
    <div class="list-item">男装纯棉短袖</div>
    <div class="list-item">女装纯棉短袖</div>
    <div class="list-item">男装冰丝短袖</div>
    <div class="list-item">男装圆领短袖</div>
  </div>
`

xCrawlOpenAIApp.parseElements(HTMLContent, '获取男装, 并去重').then((res) => {
  console.log(res)
  /*
    res:
    {
      elements: [
        { class: 'list-item', text: '男装卫衣' },
        { class: 'list-item', text: '男装带帽卫衣' },
        { class: 'list-item', text: '男装纯棉短袖' },
        { class: 'list-item', text: '男装冰丝短袖' },
        { class: 'list-item', text: '男装圆领短袖' }
      ],
      type: 'multiple'
    }
  */
})
```

也可以将整个 HTML 传给 AI 帮我们操作，但是会消耗更多 Tokens ，OpenAI 是根据 Tokens 进行收费的。

### 智能生成元素选择器

能够帮助我们快速定位到页面中的特定元素。只需将 HTML 代码输入到 AI 中，并告知 AI 您想获取哪些元素的选择器，AI 便会根据页面结构自动为您生成合适的选择器，大大简化了确定选择器的繁琐过程。

使用 AI 应用实例的 getElementSelectors 方法。

示例：

```js
import { createXCrawlOpenAI } from 'x-crawl'

const xCrawlOpenAIApp = createXCrawlOpenAI({
  clientOptions: { apiKey: '你的 API Key' }
})

const HTMLContent = `
  <div class="scroll-list">
    <div class="list-item">女装带帽卫衣</div>
    <div class="list-item">男装卫衣</div>
    <div class="list-item">女装卫衣</div>
    <div class="list-item">男装带帽卫衣</div>
  </div>
  <div class="scroll-list">
    <div class="list-item">男装纯棉短袖</div>
    <div class="list-item">男装纯棉短袖</div>
    <div class="list-item">女装纯棉短袖</div>
    <div class="list-item">男装冰丝短袖</div>
    <div class="list-item">男装圆领短袖</div>
  </div>
`

xCrawlOpenAIApp.getElementSelectors(HTMLContent, '获取所有女装').then((res) => {
  console.log(res)
  /*
    res:
    {
      selectors: '.scroll-list:nth-child(1) .list-item:nth-of-type(1), .scroll-list:nth-child(1) .list-item:nth-of-type(3), .scroll-list:nth-child(2) .list-item:nth-of-type(3)',
      type: 'single'
    }
  */
})
```

也可以将整个 HTML 传给 AI 帮我们操作，但是会消耗更多 Tokens ，OpenAI 是根据 Tokens 进行收费的。

### 智能回复爬虫问题

可以为您提供智能的解答和建议。无论是关于爬虫策略、反爬虫技巧还是数据处理等方面的问题，您都可以向AI提问，AI会根据其强大的学习和推理能力，为您提供专业的解答和建议，帮助您更好地完成爬虫任务。

使用 AI 应用实例的 help 方法。

示例：

```js
import { createXCrawlOpenAI } from 'x-crawl'

const xCrawlOpenAIApp = createXCrawlOpenAI({
  clientOptions: { apiKey: '你的 API Key' }
})

xCrawlOpenAIApp.help('x-crawl 是什么').then((res) => {
  console.log(res)
  /*
    res:
    x-crawl 是一个灵活的 Node.js AI 辅助爬虫库，它提供了强大的人工智能辅助功能，可以帮助开发者更高效、智能和便捷地进行网络爬虫工作。您可以在 GitHub 上找到更多关于 x-crawl 的详细信息和使用方式：https://github.com/coder-hxl/x-crawl。
  */
})

xCrawlOpenAIApp.help('爬虫的三大注意事项').then((res) => {
  console.log(res)
  /*
    res:
    在进行爬虫工作时，有三个重要的注意事项需要特别注意：

    1. **遵守网站规则和法律法规**：在进行数据爬取时，一定要遵守网站的robots.txt文件中的规则，并且不要违反任何相关的法律法规。尊重网站所有者的意愿和数据的所有权是非常重要的。

    2. **避免对网站造成过大负担**：爬虫在爬取数据时会占用网站的带宽和资源，过度频繁的访问会给网站带来压力甚至是瘫痪。因此，需要合理设置爬虫的访问频率，并且避免对网站造成过大的访问负担。

    3. **数据处理和存储的合法性和隐私保护**：爬取到的数据可能涉及用户的隐私信息，因此在收集、存储和使用这些数据时，要符合相关的隐私保护法律法规，并且不要滥用这些数据。另外，在处理数据时也要保证数据的准确性和可靠性，避免因不当的数据处理而产生误解或造成不良影响。
  */
})
```

### 用户自定义 AI 功能

为了满足不同用户的个性化需求，x-crawl 还提供了用户自定义 AI 的功能。将 openai 实例提供出来，这意味着您可以根据自己的需求，对 AI 进行定制和优化，使其更好地适应您的爬虫工作。

使用 AI 应用实例的 custom 方法。

示例：

```js
import { createXCrawlOpenAI } from 'x-crawl'

const xCrawlOpenAIApp = createXCrawlOpenAI({
  clientOptions: { apiKey: '你的 API Key' }
})

const openai = xCrawlOpenAIApp.custom()
```

调用 custom 拿到的 openai 可参考：https://platform.openai.com/docs/api-reference/chat/create?lang=node.js ，调用 custom 拿到的 openai 与网站示例 new OpenAI() 拿到的实例差不多，不同的是 x-crawl 会将创建 AI 应用实例时传入的 clientOptions 传给 new OpenAI ，拿到的是完好无损 OpenAI 实例，x-crawl 并不会对其重写。

## 进阶

### 爬取模式

一个爬虫应用实例有两种爬取模式: 异步/同步，每个爬虫实例只能选择其中一种。

```js
import { createCrawl } from 'x-crawl'

const crawlApp = createCrawl({
  mode: 'async'
})
```

mode 选项默认为 async 。

- async: 异步爬取目标，无需等当前爬取目标完成，就进行下次爬取目标
- sync: 同步爬取目标，需要等这次爬取目标完成，才会进行下次爬取目标

若有设置间隔时间，则都需要等间隔时间结束才会爬取下次目标。

**注意:** 爬取 API 的爬取过程都是单独进行的，该模式对批量爬取目标才有效。

### 设备指纹

#### 默认设备指纹

可以通过一个属性控制是否使用默认的随机指纹，您也可以通过后续的爬取配置自定义指纹。

设置设备指纹是为了避免通过指纹识别从不同位置识别并跟踪我们。

```js
import { createCrawl } from 'x-crawl'

const crawlApp = createCrawl({
  enableRandomFingerprint: true
})
```

enableRandomFingerprint 选项默认为 false 。

- true: 启动随机设备指纹。可通过进阶配置或详细目标配置指定目标的指纹配置。
- false: 关闭随机设备指纹，不影响进阶配置或详细目标配置为目标指定的指纹配置。

#### 自定义设备指纹

自定义配置设备指纹，可避免通过指纹识别从不同位置识别并跟踪我们。

可以通过进阶用法在 fingerprints 传入多个信息，内部会帮助您随机分配给 targets 的每个目标。也可以直接用详细目标配置为目标设置特定的指纹。

以 crawlPage 为例：

```js
import { createCrawl } from 'x-crawl'

const crawlApp = createCrawl({ intervalTime: { max: 5000, min: 3000 } })

crawlApp.crawlPage({
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

### 配置

一些通用的配置可以通过在这三个地方设置：

- 应用实例配置（全局）
- 进阶配置（局部）
- 详细目标配置（单独）

#### 优先级

优先级为：详细目标配置 > 进阶配置 > 应用实例配置

以 maxRetry 重试次数为例：

```js
import { createCrawl } from 'x-crawl'

// 应用实例配置
const crawlApp = createCrawl({ maxRetry: 3 })

// 进阶配置
crawlApp
  .crawlPage({
    targets: [
      'https://www.example.com/page-1',
      'https://www.example.com/page-2',
      // 详细目标配置
      { url: 'https://www.example.com/page-3', maxRetry: 8 },
      'https://www.example.com/page-4'
    ],
    maxRetry: 6
  })
  .then((res) => {})

crawlApp.crawlPage('https://www.example.com/page-5').then((res) => {})
```

在上面的示例中，**应用实例配置**、**进阶配置**以及**详细目标配置**中都设置了**重试次数**，page3 将会采用自己的重试次数（8次），page1、 page2 以及 page4 将采用进阶配置的重试次数（6次），page5 会使用应用实例配置的重试次数（3次）。

#### 取消复用配置选项

可在使用 null 取消上层配置。

以 maxRetry 重试次数为例：

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

在上面的示例中，page-1、page3、page4 都取消了重试次数，page2 有 3 次重试次数。

## API

### createCrawl

通过调用 createCrawl 创建一个爬虫应用实例。爬取目标是由实例方法内部维护，并非由实例维护。

#### 类型

createCrawl API 是一个函数。

```ts
function createCrawl(config?: CreateCrawlConfig): CrawlApp
```

**参数类型：**

- 查看 [CreateCrawlConfig](#CreateCrawlConfig) 类型

**返回值类型：**

- 查看 [CrawlApp](#CrawlApp) 类型

#### 示例

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

crawlPage 是爬虫实例的方法，通常用于爬取动态页面。

#### 类型

crawlPage API 是一个函数。类型是 [重载函数](https://www.typescriptlang.org/docs/handbook/2/functions.html#function-overloads) 可以通过不同的配置参数调用该函数（在类型方面）。

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

**参数类型：**

- 查看 [CrawlPageDetailTargetConfig](#CrawlPageDetailTargetConfig) 类型
- 查看 [CrawlPageAdvancedConfig](#CrawlPageAdvancedConfig) 类型

**返回值类型：**

- 查看 [CrawlPageSingleResult](#CrawlPageSingleResult) 类型

#### 示例

```js
import { createCrawl } from 'x-crawl'

const crawlApp = createCrawl()

// crawlPage API
crawlApp.crawlPage('https://www.example.com').then((res) => {
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
import { createCrawl } from 'x-crawl'

const crawlApp = createCrawl()

crawlApp.crawlPage('https://www.example.com').then((res) => {})
```

拿到的 res 将是一个对象。

##### 详细目标配置 - CrawlPageDetailTargetConfig

这是详细目标配置。如果你想爬一下这个页面，并且需要失败重试之类的，可以试试这种写法：

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

拿到的 res 将是一个对象。

更多配置选项可以查看 [CrawlPageDetailTargetConfig](#CrawlPageDetailTargetConfig) 。

##### 混合目标数组配置 - (string | CrawlPageDetailTargetConfig)[]

这是混合目标数组配置。如果你想爬取多个页面，并且有些页面需要失败重试之类的，可以试试这种写法：

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

拿到的 res 将是一个数组，里面是对象。

更多配置选项可以查看 [CrawlPageDetailTargetConfig](#CrawlPageDetailTargetConfig) 。

##### 进阶配置 - CrawlPageAdvancedConfig

这是进阶配置，targets 是混合目标数组配置。如果你想爬取多个页面，并且爬取目标配置（proxy、cookies、重试等等）不想重复写，还需要间隔时间、设备指纹以及生命周期等等，可以试试这种写法：

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

拿到的 res 将是一个数组，里面是对象。

更多配置选项可以查看 [CrawlPageAdvancedConfig](#CrawlPageAdvancedConfig) 。

关于结果的更多信息可查看 [关于结果](#关于结果) ，可以根据实际情况选用即可。

### crawlHTML

crawlHTML 是爬虫实例的方法，通常用于爬取静态 HTML 页面。

#### 类型

crawlHTML API 是一个函数。类型是 [重载函数](https://www.typescriptlang.org/docs/handbook/2/functions.html#function-overloads) 可以通过不同的配置参数调用该函数（在类型方面）。

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

**参数类型：**

- 查看 [CrawlHTMLDetailTargetConfig](#CrawlHTMLDetailTargetConfig) 类型
- 查看 [CrawlHTMLAdvancedConfig](#CrawlHTMLAdvancedConfig) 类型

**返回值类型：**

- 查看 [CrawlHTMLSingleResult](#CrawlHTMLSingleResult) 类型

#### 示例

```js
import { createCrawl } from 'x-crawl'

const crawlApp = createCrawl()

// crawlHTML API
crawlApp.crawlHTML('https://www.example.com').then((res) => {})
```

#### 配置

一共有 4 种:

- 简单目标配置 - string
- 详细目标配置 - CrawlHTMLDetailTargetConfig
- 混合目标数组配置 - (string | CrawlHTMLDetailTargetConfig)[]
- 进阶配置 - CrawlHTMLAdvancedConfig

##### 简单目标配置 - string

这是简单目标配置。如果你只想单纯爬一下这个静态 HTML 页面，可以试试这种写法：

```js
import { createCrawl } from 'x-crawl'

const crawlApp = createCrawl()

crawlApp.crawlHTML('https://www.example.com').then((res) => {})
```

拿到的 res 将是一个对象。

##### 详细目标配置 - CrawlHTMLDetailTargetConfig

这是详细目标配置。如果你想爬一下这个静态 HTML 页面，并且需要失败重试之类的，可以试试这种写法：

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

拿到的 res 将是一个对象。

更多配置选项可以查看 [CrawlHTMLDetailTargetConfig](#CrawlHTMLDetailTargetConfig) 。

##### 混合目标数组配置 - (string | CrawlHTMLDetailTargetConfig)[]

这是混合目标数组配置。如果你想爬取多个静态 HTML 页面，并且有些静态 HTML 页面需要失败重试之类的，可以试试这种写法：

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

拿到的 res 将是一个数组，里面是对象。

更多配置选项可以查看 [CrawlHTMLDetailTargetConfig](#CrawlHTMLDetailTargetConfig) 。

##### 进阶配置 - CrawlHTMLAdvancedConfig

这是进阶配置，targets 是混合目标数组配置。如果你想爬取多个静态 HTML 页面，并且爬取目标配置（proxy、cookies、重试等等）不想重复写，还需要间隔时间、设备指纹以及生命周期等等，可以试试这种写法：

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

拿到的 res 将是一个数组，里面是对象。

更多配置选项可以查看 [CrawlHTMLAdvancedConfig](#CrawlHTMLAdvancedConfig) 。

关于结果的更多信息可查看 [关于结果](#关于结果) ，可以根据实际情况选用即可。

### crawlData

crawl 是爬虫实例的方法，通常用于爬取 API ，可获取 JSON 数据等等。

#### 类型

crawlData API 是一个函数。类型是 [重载函数](https://www.typescriptlang.org/docs/handbook/2/functions.html#function-overloads) 可以通过不同的配置参数调用该函数（在类型方面）。

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

**参数类型：**

- 查看 [CrawlDataDetailTargetConfig](#CrawlDataDetailTargetConfig) 类型
- 查看 [CrawlDataAdvancedConfig](#CrawlDataAdvancedConfig) 类型

**返回值类型：**

- 查看 [CrawlDataSingleResult](#CrawlDataSingleResult) 类型

#### 示例

```js
import { createCrawl } from 'x-crawl'

const crawlApp = createCrawl({
  timeout: 10000,
  intervalTime: { max: 2000, min: 1000 }
})

// crawlData API
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

#### 配置

一共有 4 种:

- 简单目标配置 - string
- 详细目标配置 - CrawlDataDetailTargetConfig
- 混合目标数组配置 - (string | CrawlDataDetailTargetConfig)[]
- 进阶配置 - CrawlDataAdvancedConfig

##### 简单目标配置 - string

这是简单目标配置。如果你只想单纯爬一下这个数据，并且该接口是 GET 方式的，可以试试这种写法：

```js
import { createCrawl } from 'x-crawl'

const crawlApp = createCrawl()

crawlApp.crawlData('https://www.example.com/api').then((res) => {})
```

拿到的 res 将是一个对象。

##### 详细目标配置 - CrawlDataDetailTargetConfig

这是详细目标配置。如果你想爬一下这个数据，并且需要失败重试之类的，可以试试这种写法：

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

拿到的 res 将是一个对象。

更多配置选项可以查看 [CrawlDataDetailTargetConfig](#CrawlDataDetailTargetConfig) 。

##### 混合目标数组配置 - (string | CrawlDataDetailTargetConfig)[]

这是混合目标数组配置。如果你想爬取多个数据，并且有些数据需要失败重试之类的，可以试试这种写法：

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

拿到的 res 将是一个数组，里面是对象。

更多配置选项可以查看 [CrawlDataDetailTargetConfig](#CrawlDataDetailTargetConfig) 。

##### 进阶配置 - CrawlDataAdvancedConfig

这是进阶配置，targets 是混合目标数组配置。如果你想爬取多个数据，并且爬取目标配置（proxy、cookies、重试等等）不想重复写，还需要间隔时间、设备指纹以及生命周期等等，可以试试这种写法：

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

拿到的 res 将是一个数组，里面是对象。

更多配置选项可以查看 [CrawlPageAdvancedConfig](#CrawlPageAdvancedConfig) 。

关于结果的更多信息可查看 [关于结果](#关于结果) ，可以根据实际情况选用即可。

### crawlFile

crawlFile 是爬虫实例的方法，通常用于爬取文件，可获取图片、pdf 文件等等。

#### 类型

crawlFile API 是一个函数。类型是 [重载函数](https://www.typescriptlang.org/docs/handbook/2/functions.html#function-overloads) 可以通过不同的配置参数调用该函数（在类型方面）。

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

**参数类型：**

- 查看 [CrawlFileDetailTargetConfig](#CrawlFileDetailTargetConfig) 类型
- 查看 [CrawlFileAdvancedConfig](#CrawlFileAdvancedConfig) 类型

**返回值类型：**

- 查看 [CrawlFileSingleResult](#CrawlFileSingleResult) 类型

#### 示例

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

#### 配置

一共有 4 种:

- 简单目标配置 - string
- 详细目标配置 - CrawlFileDetailTargetConfig
- 详细目标数组配置 - (string | CrawlFileDetailTargetConfig)[]
- 进阶配置 - CrawlFileAdvancedConfig

##### 简单目标配置 - string

这是简单目标配置。如果你只想单纯爬一下这个文件，可以试试这种写法：

```js
import { createCrawl } from 'x-crawl'

const crawlApp = createCrawl()

crawlApp.crawlFile('https://www.example.com/file').then((res) => {})
```

拿到的 res 将是一个对象。

##### 详细目标配置 - CrawlFileDetailTargetConfig

这是详细目标配置。如果你想爬一下这个文件，并且需要失败重试之类的，可以试试这种写法：

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

拿到的 res 将是一个对象。

更多配置选项可以查看 [CrawlFileDetailTargetConfig](#CrawlFileDetailTargetConfig) 。

##### 混合目标数组配置 - (string | CrawlFileDetailTargetConfig)[]

这是混合目标数组配置。如果你想爬取多个文件，并且有些数据需要失败重试之类的，可以试试这种写法：

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

拿到的 res 将是一个数组，里面是对象。

更多配置选项可以查看 [CrawlFileDetailTargetConfig](#CrawlFileDetailTargetConfig) 。

##### 进阶配置 - CrawlFileAdvancedConfig

这是进阶配置，targets 是混合目标数组配置。如果你想爬取多个数据，并且爬取目标配置（proxy、storeDir、重试等等）不想重复写，还需要间隔时间、设备指纹以及生命周期等等，可以试试这种写法：

```js
import { createCrawl } from 'x-crawl'

const crawlApp = createCrawl()

crawlApp
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

### createXCrawlOpenAI

通过调用 createXCrawlOpenAI 创建一个 AI 应用实例。

#### 类型

createXCrawlOpenAI API 是一个函数。

```ts
function createXCrawlOpenAI(config?: CreateXCrawlOpenAIConfig): XCrawlOpenAIApp
```

**参数类型：**

- 查看 [CreateXCrawlOpenAIConfig](#CreateXCrawlOpenAIConfig) 类型

**返回值类型：**

- 查看 [XCrawlOpenAIApp](#XCrawlOpenAIApp) 类型

#### 示例

```js
import { createXCrawlOpenAI } from 'x-crawl'

// xCrawlOpenAIApp API
const xCrawlOpenAIApp = createXCrawlOpenAI({
  clientOptions: { apiKey: '你的 API Key' },
  defaultModel: { chatModel: 'gpt-4-turbo-preview' }
})
```

### parseElements

parseElements 是 AI 应用实例的方法，通常用于智能按需分析元素。

#### 类型

parseElements API 是一个函数。

```ts
function parseElements<T extends Record<string, string>>(
  HTML: string,
  content: string | XCrawlOpenAIParseElementsContentOptions,
  option?: XCrawlOpenAICommonAPIOtherOption
): Promise<XCrawlOpenAIParseElementsResult<T>>
```

**参数类型：**

- 查看 [XCrawlOpenAIParseElementsContentOptions](#XCrawlOpenAIParseElementsContentOptions) 类型
- 查看 [XCrawlOpenAICommonAPIOtherOption](#XCrawlOpenAICommonAPIOtherOption) 类型

**返回值类型：**

- 查看 [XCrawlOpenAIParseElementsResult](#XCrawlOpenAIParseElementsResult) 类型

#### 示例

```js
import { createXCrawlOpenAI } from 'x-crawl'

const xCrawlOpenAIApp = createXCrawlOpenAI()

xCrawlOpenAIApp.parseElements('HTML', '告诉 AI 你想要的').then((res) => {})
```

### getElementSelectors

getElementSelectors 是 AI 应用实例的方法，通常用于智能生成元素选择器。

#### 类型

parseElements API 是一个函数。

```ts
function getElementSelectors(
  HTML: string,
  content: string | XCrawlOpenAIGetElementSelectorsContentOptions,
  option?: XCrawlOpenAICommonAPIOtherOption
): Promise<XCrawlOpenAIGetElementSelectorsResult>
```

**参数类型：**

- 查看 [XCrawlOpenAIGetElementSelectorsContentOptions](#XCrawlOpenAIGetElementSelectorsContentOptions) 类型
- 查看 [XCrawlOpenAICommonAPIOtherOption](#XCrawlOpenAICommonAPIOtherOption) 类型

**返回值类型：**

- 查看 [XCrawlOpenAIGetElementSelectorsResult](#XCrawlOpenAIGetElementSelectorsResult) 类型

#### 示例

```js
import { createXCrawlOpenAI } from 'x-crawl'

const xCrawlOpenAIApp = createXCrawlOpenAI()

xCrawlOpenAIApp
  .getElementSelectors('HTML', '告诉 AI 你想要的')
  .then((res) => {})
```

### help

help 是 AI 应用实例的方法，通常用于智能回复爬虫问题。

#### 类型

help API 是一个函数。

```ts
function help(
  content: string,
  option?: XCrawlOpenAICommonAPIOtherOption
): Promise<string>
```

**参数类型：**

- 查看 [XCrawlOpenAICommonAPIOtherOption](#XCrawlOpenAICommonAPIOtherOption) 类型

#### 示例

```js
import { createXCrawlOpenAI } from 'x-crawl'

const xCrawlOpenAIApp = createXCrawlOpenAI()

xCrawlOpenAIApp.help('告诉 AI 你的问题').then((res) => {})
```

### custom

custom 是 AI 应用实例的方法，通常用于用户自定义AI功能。

#### 类型

customAPI 是一个函数。

```ts
function custom(): OpenAI
```

**返回值类型：**

可参考：https://platform.openai.com/docs/api-reference/chat/create?lang=node.js ，调用 custom 拿到的 openai 与网站示例 new OpenAI() 拿到的实例差不多，不同的是 x-crawl 会将创建 AI 应用实例时传入的 clientOptions 传给 new OpenAI ，拿到的是完好无损 OpenAI 实例，x-crawl 并不会对其重写。

#### 示例

```js
import { createXCrawlOpenAI } from 'x-crawl'

const xCrawlOpenAIApp = createXCrawlOpenAI()

const openai = xCrawlOpenAIApp.custom()
```

## 类型

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
    puppeteerLaunchOptions?: PuppeteerLaunchOptions // PuppeteerLaunchOptions 来自于 puppeteer
  }
}
```

**默认值**

- mode: 'async'
- enableRandomFingerprint: false
- baseUrl: undefined
- intervalTime: undefined
- log: { start: true, process: true, result: true }
- crawlPage: undefined

**外部类型**

- PuppeteerLaunchOptions：来自于 puppeteer ，crawlPage.puppeteerLaunchOptions 会直接传给 puppeteer.launch 用于创建浏览器实例

#### Detail Target Config

##### CrawlPageDetailTargetConfig

```ts
export interface CrawlPageDetailTargetConfig extends CrawlCommonConfig {
  url: string
  headers?: Object | null
  cookies?: PageCookies | null
  priority?: number
  viewport?: Viewport | null // Viewport 来自于 puppeteer
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

**外部类型**

- Viewport：来自于 puppeteer ，viewport 会直接传给 page.setViewport 用于设置页面大小

##### CrawlHTMLDetailTargetConfig

```ts
export interface CrawlHTMLDetailTargetConfig extends CrawlCommonConfig {
  url: string
  headers?: Object | null
  priority?: number
  fingerprint?: DetailTargetFingerprintCommon | null
}
```

**默认值**

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
  headers?: Object | null
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

  headers?: Object
  cookies?: PageCookies
  viewport?: Viewport // Viewport：来自于 puppeteer

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

**外部类型**

- Viewport：来自于 puppeteer ，viewport 会直接传给 page.setViewport 用于设置页面大小

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

**默认值**

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
  | Protocol.Network.CookieParam // Protocol 来自于 puppeteer
  | Protocol.Network.CookieParam[] // Protocol 来自于 puppeteer
```

**外部类型**

- Protocol：来自于 puppeteer

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
  clientOptions?: ClientOptions // ClientOptions 来自于 openai
}
```

**默认值**

- defaultModel: { chatModel: 'gpt-3.5-turbo' }
- clientOptions: undefined

**外部类型**

- ClientOptions：来自于 openai，clientOptions 会直接传给 new OpenAI 用于创建 AI 实例

#### XCrawlOpenAIParseElementsContentOptions

```ts
export interface XCrawlOpenAIParseElementsContentOptions {
  message: string
}
```

**默认值**

- message: undefined

**外部类型**

- ClientOptions：来自于 openai，clientOptions 会直接传给 new OpenAI 用于创建 AI 实例

#### XCrawlOpenAIGetElementSelectorsContentOptions

```ts
export interface XCrawlOpenAIGetElementSelectorsContentOptions {
  message: string
  pathMode: 'default' | 'strict'
}
```

- pathMode：
  - strict：选择器的路径从根部元素开始, 并精确指向目标元素。
  - default：可以从任何级别的元素开始的选择器。

**默认值**

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

- model：要选择的 AI 模型。

**默认值**

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
    browser: Browser // Browser 来自于 puppeteer
    response: HTTPResponse | null // HTTPResponse 来自于 puppeteer
    page: Page // Page 自来于 puppeteer
  }
}
```

**外部类型**

- Browser：来自于 puppeteer ，https://pptr.dev/api/puppeteer.browser
- HTTPResponse：来自于 puppeteer ，https://pptr.dev/api/puppeteer.httpresponse
- Page：来自于 puppeteer ，https://pptr.dev/api/puppeteer.page

#### CrawlHTMLSingleResult

```ts
export interface CrawlHTMLSingleResult extends CrawlCommonResult {
  data: {
    statusCode: number | undefined
    headers: IncomingHttpHeaders // IncomingHttpHeaders 来自于 node:http
    html: string
  } | null
}
```

**外部类型**

- IncomingHttpHeaders：来自于 nodejs 的 http

#### CrawlDataSingleResult

```ts
export interface CrawlDataSingleResult<D> extends CrawlCommonResult {
  data: {
    statusCode: number | undefined
    headers: IncomingHttpHeaders // IncomingHttpHeaders 来自于 node:http
    data: D
  } | null
}
```

**外部类型**

- IncomingHttpHeaders：来自于 nodejs 的 http

#### CrawlFileSingleResult

```ts
export interface CrawlFileSingleResult extends CrawlCommonResult {
  data: {
    statusCode: number | undefined
    headers: IncomingHttpHeaders // IncomingHttpHeaders 来自于 node:http
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

**外部类型**

- IncomingHttpHeaders：来自于 nodejs 的 http

#### XCrawlOpenAIApp

```ts
export interface XCrawlOpenAIApp {
  parseElements<T extends Record<string, string>>(
    HTML: string,
    content: string | XCrawlOpenAIParseElementsContentOptions,
    option?: XCrawlOpenAICommonAPIOtherOption
  ): Promise<XCrawlOpenAIParseElementsResult<T>>

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
export interface XCrawlOpenAIParseElementsResult<
  T extends Record<string, string>
> {
  elements: T[]
  type: 'single' | 'multiple' | 'none'
}
```

- type
  - single：说明当前 HTML 片段只找到一个目标。
  - multiple： 说明当前 HTML 片段找到多个目标。
  - none： 没有在当前 HTML 片段找到。

#### XCrawlOpenAIGetElementSelectorsResult

```ts
export interface XCrawlOpenAIGetElementSelectorsResult {
  selectors: string
  type: 'single' | 'multiple' | 'none'
}
```

- type

  - single：说明当前 HTML 片段只找到一个目标。
  - multiple： 说明当前 HTML 片段找到多个目标。
  - none： 没有在当前 HTML 片段找到。

## 常见问题

### crawlPage API 跟 puppeteer 的关系

crawlPage API 内置了 [puppeteer](https://github.com/puppeteer/puppeteer) ，您只需要传入一些配置选项即可让 x-crawl 帮助您简化操作，并拿到完好无损的 Brower 实例和 Page 实例，x-crawl 并不会对其重写。

### 使用 crawlPage API 造成程序崩溃

如果你需要在一个 crawlPage 爬取很多页面，建议在每个页面爬下来后，用 [onCrawlItemComplete 生命周期函数](#onCrawlItemComplete) 来处理每个目标的结果并关闭 page 实例，如果不进行关闭操作，则可能因开启的 page 过多而造成程序崩溃（跟自身设备性能有关）。

```js
import { createCrawl } from 'x-crawl'

const crawlApp = createCrawl()

// 爬取目标少的推荐
crawlApp
  .crawlPage([
    'https://www.example.com/page-1',
    'https://www.example.com/page-2'
  ])
  .then((results) => {
    for (const itemResult of results) {
      const { page } = itemResult.data

      // 后续不再使用就关闭
      page.close()
    }
  })

// 爬取目标多的推荐
// 通过进阶配置的 onCrawlItemComplete
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

    // 后续不再使用就关闭
    page.close()
  }
})
```

## 更多

### 版本发布

完整的过往发布记录可以在 [GitHub](https://github.com/coder-hxl/x-crawl/blob/main/CHANGELOG.md) 查阅。

### 旧版本文档

v9.0.0 版本：https://github.com/coder-hxl/x-crawl/blob/v9.0.0/docs/cn.md

### 社区

- **Discord 聊天:** 通过 [Discord](https://discord.gg/SF7aaebg4E) 与其他 x-crawl 用户实时提问和讨论。
- **GitHub 讨论:** 使用 [GitHub 讨论](https://github.com/coder-hxl/x-crawl/discussions) 来进行留言板式的问题和讨论。

不得提交与任何非法活动相关的问题和讨论。x-crawl 仅供合法用途，禁止使用该工具进行任何违法活动，包括但不限于未经授权的数据采集、网络攻击、隐私侵犯等行为。请确保您的使用行为始终符合法律法规和道德标准，共同维护一个安全、合法的网络环境。

### Issues

如果您有 **问题 、需求、好的建议** 可以在 [GitHub Issues](https://github.com/coder-hxl/x-crawl/issues) 中提 **Issues** 。

### 赞助

x-crawl 是采用 MIT 许可的开源项目。如果您在工作中受益于我开发维护的项目，为了让我能够持续投入精力进行项目的维护与更新，提升用户体验和功能，请考虑通过 [爱发电](https://afdian.net/a/coderhxl) 平台来支持一下我的工作。您的支持是我们持续改进的动力！感谢您的支持！

### 注意事项

- x-crawl 仅供合法用途，禁止使用该工具进行任何违法活动，包括但不限于未经授权的数据采集、网络攻击、隐私侵犯等行为。
- 在进行数据采集之前，请确保您已经获得了目标网站的明确授权，并遵守其 robots.txt 文件规定以及使用条款。
- 避免对目标网站造成过大的访问压力，以免触发其反爬策略或造成服务器宕机。

**x-crawl 仅供合法用途，任何因使用 x-crawl 而引起的法律责任，x-crawl 不承担任何责任**
