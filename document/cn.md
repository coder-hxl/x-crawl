# x-crawl

[English](https://github.com/coder-hxl/x-crawl#x-crawl) | 简体中文

XCrawl 是 Nodejs 多功能爬虫库。只需简单的配置即可抓取 HTML 、JSON、文件资源等等。

## 亮点

- 简单的配置即可抓取 HTML 、JSON 、文件资源等等
- 批量请求可选择模式 异步 或 同步
- 拟人化的请求间隔时间

## 安装

以 NPM 为例: 

```shell
npm install x-crawl
````

## 示例

获取 https://docs.github.com/zh/get-started 的标题为例: 

```js
// 导入模块 ES/CJS
import XCrawl from 'x-crawl'

// 创建一个爬虫实例
const docsXCrawl = new XCrawl({
  baseUrl: 'https://docs.github.com',
  timeout: 10000,
  intervalTime: { max: 2000, min: 1000 }
})

// 调用 fetchHTML API 爬取
docsXCrawl.fetchHTML('/zh/get-started').then((res) => {
  const { jsdom } = res.data
  console.log(jsdom.window.document.querySelector('title')?.textContent)
})
```

## 核心概念

### XCrawl

通过 new XCrawl 创建一个爬虫实例。请求队列是由实例方法内部自己维护，并非共享的。

#### 类型

```ts
class XCrawl {
  private readonly baseConfig
  constructor(baseConfig?: IXCrawlBaseConifg)
  fetchHTML(config: IFetchHTMLConfig): Promise<IFetchHTML>
  fetchData<T = any>(config: IFetchDataConfig): Promise<IFetchCommon<T>>
  fetchFile(config: IFetchFileConfig): Promise<IFetchCommon<IFileInfo>>
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

fetch 是 [myXCrawl](https://github.com/coder-hxl/x-crawl/blob/main/document/cn.md#%E7%A4%BA%E4%BE%8B-1) 实例的方法，通常用于爬取 API ，可获取 JSON 数据等等。

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

fetchFile 是 [myXCrawl](https://github.com/coder-hxl/x-crawl/blob/main/document/cn.md#%E7%A4%BA%E4%BE%8B-1) 实例的方法，通常用于爬取文件，可获取图片、pdf 文件等等。

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

## 类型

#### IAnyObject

```ts
interface IAnyObject extends Object {
  [key: string | number | symbol]: any
}
```

#### IMethod

```ts
type IMethod = 'get' | 'GET' | 'delete' | 'DELETE' | 'head' | 'HEAD' | 'options' | 'OPTIONS' | 'post' | 'POST' | 'put' | 'PUT' | 'patch' | 'PATCH' | 'purge' | 'PURGE' | 'link' | 'LINK' | 'unlink' | 'UNLINK'
```

#### IRequestConfig

```ts 
interface IRequestConfig {
  url: string
  method?: IMethod
  headers?: IAnyObject
  params?: IAnyObject
  data?: any
  timeout?: number
}
```

#### IIntervalTime

```ts
type IIntervalTime = number | {
  max: number
  min?: number
}
```

#### IFetchBaseConifg

```ts
interface IFetchBaseConifg {
  requestConifg: IRequestConfig | IRequestConfig[]
  intervalTime?: IIntervalTime
}
```

#### IXCrawlBaseConifg

```ts
interface IXCrawlBaseConifg {
  baseUrl?: string
  timeout?: number
  intervalTime?: IIntervalTime
  mode?: 'async' | 'sync'
}
```

#### IFetchHTMLConfig

```ts
type IFetchHTMLConfig = string | IRequestConfig
```

#### IFetchDataConfig

```ts
interface IFetchDataConfig extends IFetchBaseConifg {
}
```

#### IFetchFileConfig

```ts
interface IFetchFileConfig extends IFetchBaseConifg {
  fileConfig: {
    storeDir: string
  }
}
```

#### IFetchCommon

```ts
type IFetchCommon<T> = {
  id: number
  statusCode: number | undefined
  headers: IncomingHttpHeaders // node:http type
  data: T
}[]
```

#### IFileInfo

```ts
interface IFileInfo {
  fileName: string
  mimeType: string
  size: number
  filePath: string
}
```

#### IFetchHTML

```ts
interface IFetchHTML {
  statusCode: number | undefined
  headers: IncomingHttpHeaders
  data: {
    raw: string // HTML String
    jsdom: JSDOM // 使用了 jsdom 库对 HTML 解析
  }
}
```

## 更多

如有 **问题** 或 **需求** 请在 https://github.com/coder-hxl/x-crawl/issues 中提 **Issues** 。