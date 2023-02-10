# x-crawl

[English](https://github.com/coder-hxl/x-crawl#x-crawl) | 简体中文

XCrawl 是 Nodejs 多功能爬虫库。

## 特点

- 只需简单的配置即可抓取 HTML 、JSON、文件资源等等
- 使用 JSDOM 库对 HTML 解析，也可自行解析 HTML
- 批量请求时可选择模式 异步/同步
- 轮询功能
- 拟人化的请求间隔时间
- 使用 TypeScript 编写

# 目录

- [安装](#安装)
- [示例](#示例)
- [核心概念](#核心概念)
    * [XCrawl](#XCrawl)
       + [类型](#Type-1)
       + [示例](#示例-1)
       + [模式](#模式)
       + [间隔时间](#间隔时间)
    * [fetchHTML](#fetchHTML)
       + [类型](#类型-2)
       + [示例](#示例-2)
    * [fetchData](#fetchData)
       + [类型](#类型-3)
       + [示例](#示例-3)
    * [fetchFile](#fetchFile)
       + [类型](#类型-4)
       + [示例](#示例-4)
    * [fetchPolling](#fetchPolling)
       + [类型](#类型-5)
       + [示例](#示例-5)
- [类型](#类型-6)
    * [IAnyObject](#IAnyObject)
    * [IMethod](#IMethod)
    * [IRequestConfig](#IRequestConfig)
    * [IIntervalTime](#IIntervalTime)
    * [IFetchBaseConifg](#IFetchBaseConifg)
    * [IXCrawlBaseConifg](#IXCrawlBaseConifg)
    * [IFetchHTMLConfig](#IFetchHTMLConfig	)
    * [IFetchDataConfig](#IFetchDataConfig) 
    * [IFetchFileConfig](#IFetchFileConfig)
    * [IFetchPollingConfig](#IFetchPollingConfig)
    * [IFetchCommon](#IFetchCommon)
    * [IFileInfo](#IFileInfo)
    * [IFetchHTML](#IFetchHTML)
- [更多](#更多)

## 安装

以 NPM 为例: 

```shell
npm install x-crawl
````

## 示例

每隔一天就获取 bilibili 国漫主页的推荐轮播图片为例: 

```js
// 1.导入模块 ES/CJS
import XCrawl from 'x-crawl'

// 2.创建一个爬虫实例
const myXCrawl = new XCrawl({
  timeout: 10000, // 超时时间
  intervalTime: { max: 6000, min: 2000 } // 控制请求频率
})

// 3.调用 fetchPolling API 开始轮询功能，每隔一天会调用回调函数
myXCrawl.fetchPolling({ d: 1 }, () => {
  // 3.1.调用 fetchHTML API 爬取 HTML
  myXCrawl.fetchHTML('https://www.bilibili.com/guochuang/').then((res) => {
    const { jsdom } = res.data  // 默认使用了 JSDOM 库解析 HTML
  
     // 3.2.获取轮播图片的 src
    const imgSrc = []
    const recomEls = jsdom.window.document.querySelectorAll('.chief-recom-item')
    recomEls.forEach((item) => imgSrc.push(item.querySelector('img').src))
 
    // 3.3.调用 fetchFile API 爬取图片
    const requestConifg = imgSrc.map((src) => ({ url: `https:${src}` }))
    myXCrawl.fetchFile({ requestConifg, fileConfig: { storeDir: './upload' } })
  })
})
```

**注意:** 请勿随意爬取，这里只是为了演示如何使用 XCrawl ，并将请求频率控制在 6000ms 到 2000ms 内。

## 核心概念

### XCrawl

通过 new XCrawl 创建一个爬虫实例。请求队列是由实例方法内部自己维护，并非共享的。

#### 类型

```ts
class XCrawl {
  constructor(baseConfig?: IXCrawlBaseConifg)
  fetchHTML(config: IFetchHTMLConfig): Promise<IFetchHTML>
  fetchData<T = any>(config: IFetchDataConfig): Promise<IFetchCommon<T>>
  fetchFile(config: IFetchFileConfig): Promise<IFetchCommon<IFileInfo>>
  fetchPolling(config: IFetchPollingConfig, callback: (count: number) => void): void
}
```

#### 示例

```js
const myXCrawl = new XCrawl({
  baseUrl: 'https://xxx.com',
  timeout: 10000,
  // 请求的间隔时间, 多个请求才有效
  intervalTime: {
    max: 2000,
    min: 1000
  }
})
```

传入 **baseConfig** 是为了让 **fetchHTML/fetchData/fetchFile** 默认使用这些值。

**注意:** 为避免后续示例需要重复创建实例，这里的 **myXCrawl** 将是 **fetchHTML/fetchData/fetchFile** 示例中的爬虫实例。

#### 模式

mode 选项默认为 async 。

- async: 在批量请求时，无需等当前请求完成，就进行下次请求
- sync: 在批量请求时，需要等这次请求完成，才会进行下次请求

若有设置间隔时间，则都需要等间隔时间结束才能发送请求。

#### 间隔时间

intervalTime 选项默认为 undefined 。若有设置值，则会在请求前等待一段时间，可以防止并发量太大，避免给服务器造成太大的压力。

- number: 固定每次请求前必须等待的时间
- Object: 在 max 和 min 中随机取一个值，更加拟人化

第一次请求是不会触发间隔时间。

### fetchHTML

fetchHTML 是 [myXCrawl](https://github.com/coder-hxl/x-crawl/blob/main/document/cn.md#%E7%A4%BA%E4%BE%8B-1) 实例的方法，通常用于爬取 HTML 。

#### 类型

```ts
function fetchHTML(config: IFetchHTMLConfig): Promise<IFetchHTML>
```

#### 示例

```js
myXCrawl.fetchHTML('/xxx').then((res) => {
  const { jsdom } = res.data
  console.log(jsdom.window.document.querySelector('title')?.textContent)
})
```

### fetchData

fetch 是 [myXCrawl](#示例-1) 实例的方法，通常用于爬取 API ，可获取 JSON 数据等等。

#### 类型

```ts
function fetchData<T = any>(config: IFetchDataConfig): Promise<IFetchCommon<T>>
```

#### 示例

```js
const requestConifg = [
  { url: '/xxxx', method: 'GET' },
  { url: '/xxxx', method: 'GET' },
  { url: '/xxxx', method: 'GET' }
]

myXCrawl.fetchData({ 
  requestConifg, // 请求配置, 可以是 IRequestConfig | IRequestConfig[]
  intervalTime: { max: 5000, min: 1000 } // 不使用 myXCrawl 时传入的 intervalTime
}).then(res => {
  console.log(res)
})
```

### fetchFile

fetchFile 是 [myXCrawl](#示例-1) 实例的方法，通常用于爬取文件，可获取图片、pdf 文件等等。

#### 类型

```ts
function fetchFile(config: IFetchFileConfig): Promise<IFetchCommon<IFileInfo>>
```

#### 示例

```js
const requestConifg = [
  { url: '/xxxx' },
  { url: '/xxxx' },
  { url: '/xxxx' }
]

myXCrawl.fetchFile({
  requestConifg,
  fileConfig: {
    storeDir: path.resolve(__dirname, './upload') // 存放文件夹
  }
}).then(fileInfos => {
  console.log(fileInfos)
})
```

### fetchPolling

fetchPolling 是 [myXCrawl](#示例-1) 实例的方法，通常用于进行轮询操作，比如每隔一段时间获取新闻之类的。

#### 类型

```ts
function fetchPolling(
  config: IFetchPollingConfig,
  callback: (count: number) => void
): void
```

#### 示例

```js
myXCrawl.fetchPolling({ h: 1, m: 30 }, () => {
  // 每隔一个半小时会执行一次
  // fetchHTML/fetchData/fetchFile
})
```

## 类型

### IAnyObject

```ts
interface IAnyObject extends Object {
  [key: string | number | symbol]: any
}
```

### IMethod

```ts
type IMethod = 'get' | 'GET' | 'delete' | 'DELETE' | 'head' | 'HEAD' | 'options' | 'OPTIONS' | 'post' | 'POST' | 'put' | 'PUT' | 'patch' | 'PATCH' | 'purge' | 'PURGE' | 'link' | 'LINK' | 'unlink' | 'UNLINK'
```

### IRequestConfig

```ts 
interface IRequestConfig {
  url: string
  method?: IMethod
  headers?: IAnyObject
  params?: IAnyObject
  data?: any
  timeout?: number
  proxy?: string
}
```

### IIntervalTime

```ts
type IIntervalTime = number | {
  max: number
  min?: number
}
```

### IFetchBaseConifg

```ts
interface IFetchBaseConifg {
  requestConifg: IRequestConfig | IRequestConfig[]
  intervalTime?: IIntervalTime
}
```

### IXCrawlBaseConifg

```ts
interface IXCrawlBaseConifg {
  baseUrl?: string
  timeout?: number
  intervalTime?: IIntervalTime
  mode?: 'async' | 'sync'
  proxy?: string
}
```

### IFetchHTMLConfig

```ts
type IFetchHTMLConfig = string | IRequestConfig
```

### IFetchDataConfig

```ts
interface IFetchDataConfig extends IFetchBaseConifg {
}
```

### IFetchFileConfig

```ts
interface IFetchFileConfig extends IFetchBaseConifg {
  fileConfig: {
    storeDir: string
  }
}
```

### IFetchPollingConfig

```ts
interface IFetchPollingConfig {
  Y?: number // 年 (按每年365天)
  M?: number // 月 (按每月30天)
  d?: number // 日
  h?: number // 小时
  m?: number // 分钟
}
```

### IFetchCommon

```ts
type IFetchCommon<T> = {
  id: number
  statusCode: number | undefined
  headers: IncomingHttpHeaders // node:http 类型
  data: T
}[]
```

### IFileInfo

```ts
interface IFileInfo {
  fileName: string
  mimeType: string
  size: number
  filePath: string
}
```

### IFetchHTML

```ts
interface IFetchHTML {
  statusCode: number | undefined
  headers: IncomingHttpHeaders
  data: {
    html: string // HTML String
    jsdom: JSDOM // 使用了 jsdom 库对 HTML 解析
  }
}
```

## 更多

如有 **问题** 或 **需求** 请在 https://github.com/coder-hxl/x-crawl/issues 中提 **Issues** 。
