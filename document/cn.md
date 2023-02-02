# x-crawl

[English](https://github.com/coder-hxl/x-crawl/blob/main/README.md) | 简体中文

XCrawl 是 Nodejs 多功能爬虫库。只需简单的配置即可抓取 HTML 、JSON、文件资源等等。

## 亮点

- 调用 API 即可抓取 HTML 、JSON 、文件资源等等
- 批量请求可选择模式 异步发送 或 同步发送

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
docsXCrawl.fetchHTML('/zh/get-started').then((jsdom) => {
  console.log(jsdom.window.document.querySelector('title')?.textContent)
})
```

## 核心概念

### XCrawl

通过 new XCrawl 创建一个爬虫实例。

#### 类型

```ts
class XCrawl {
  private readonly baseConfig
  constructor(baseConfig?: IXCrawlBaseConifg)
  fetchHTML(config: string | IFetchHTMLConfig): Promise<JSDOM>
  fetchData<T = any>(config: IFetchDataConfig): Promise<IFetchCommon<T>>
  fetchFile(config: IFetchFileConfig): Promise<IFetchCommon<IFileInfo>>
}
```

#### <div id="myXCrawl"  style="text-decoration: none">示例</div>

myXCrawl 为后面示例的爬虫实例。

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

#### 关于模式

mode 选项默认为 async 。

- async: 在批量请求时，无需等当前请求完成，就进行下次请求
- sync: 在批量请求时，需要等这次请求完成，才会进行下次请求

若有设置间隔时间，则都需要等间隔时间结束才能发送请求。

### fetchHTML

fetchHTML 是上面 <a href="#myXCrawl"  style="text-decoration: none">myXCrawl</a> 实例的方法，通常用于爬取 HTML 。

#### 类型

```ts
function fetchHTML(config: string | IFetchHTMLConfig): Promise<JSDOM>
```

#### 示例

```js
myXCrawl.fetchHTML('/xxx').then((jsdom) => {
  console.log(jsdom.window.document.querySelector('title')?.textContent)
})
```

### fetchData

fetch 是上面 <a href="#myXCrawl"  style="text-decoration: none">myXCrawl</a> 实例的方法，通常用于爬取 API ，可获取 JSON 数据等等。

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
  intervalTime: 800 // 下次请求的间隔时间, 多个请求才有效
}).then(res => {
  console.log(res)
})
```

### fetchFile

fetchFile 是上面 <a href="#myXCrawl"  style="text-decoration: none">myXCrawl</a> 实例的方法，通常用于爬取文件，可获取图片、pdf 文件等等。

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

- IAnyObject

```ts
interface IAnyObject extends Object {
  [key: string | number | symbol]: any
}
```

- IMethod

```ts
type IMethod = 'get' | 'GET' | 'delete' | 'DELETE' | 'head' | 'HEAD' | 'options' | 'OPTIONS' | 'post' | 'POST' | 'put' | 'PUT' | 'patch' | 'PATCH' | 'purge' | 'PURGE' | 'link' | 'LINK' | 'unlink' | 'UNLINK'
```

- IRequestConfig

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

- IIntervalTime

```ts
type IIntervalTime = number | {
  max: number
  min?: number
}
```

- IFetchBaseConifg

```ts
interface IFetchBaseConifg {
  requestConifg: IRequestConfig | IRequestConfig[]
  intervalTime?: IIntervalTime
}
```

- IFetchCommon

```ts
type IFetchCommon<T> = {
  id: number
  statusCode: number | undefined
  headers: IncomingHttpHeaders // node:http type
  data: T
}[]
```

- IFileInfo

```ts
interface IFileInfo {
  fileName: string
  mimeType: string
  size: number
  filePath: string
}
```

- IXCrawlBaseConifg

```ts
interface IXCrawlBaseConifg {
  baseUrl?: string
  timeout?: number
  intervalTime?: IIntervalTime
  mode?: 'async' | 'sync' // default: 'async'
}
```

- IFetchHTMLConfig

```ts
interface IFetchHTMLConfig extends IRequestConfig {}
```

- IFetchDataConfig

```ts
interface IFetchDataConfig extends IFetchBaseConifg {
}
```

- IFetchFileConfig

```ts
interface IFetchFileConfig extends IFetchBaseConifg {
  fileConfig: {
    storeDir: string
  }
}
```

## 更多

如有 **问题** 或 **需求** 请在 https://github.com/coder-hxl/x-crawl/issues 中提 **Issues** 。
