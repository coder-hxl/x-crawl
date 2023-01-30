# <div id="en">x-crawl</div>

English | <a href="#cn" style="text-decoration: none">简体中文</a>

XCrawl is a Nodejs multifunctional crawler library. Provide configuration to batch fetch HTML, JSON, images, etc.

## Install

Take NPM as an example:

```shell
npm install x-crawl
```

## example

Get the title of https://docs.github.com/zh/get-started as an example:

```js
// Import module ES/CJS
import XCrawl from 'x-crawl'

// Create a crawler instance
const docsXCrawl = new XCrawl({
  baseUrl: 'https://docs.github.com',
  timeout: 10000,
  intervalTime: { max: 2000, min: 1000 }
})

// Call fetchHTML API to crawl
docsXCrawl.fetchHTML('/zh/get-started').then((jsdom) => {
  console.log(jsdom.window.document.querySelector('title')?.textContent)
})
```

## Key concept

### XCrawl

Create a crawler instance via new XCrawl.

- Type

```ts
class XCrawl {
  private readonly baseConfig
  constructor(baseConfig?: IXCrawlBaseConifg)
  fetchData<T = any>(config: IFetchDataConfig): Promise<IFetchData<T>>
  fetchFile(config: IFetchFileConfig): Promise<IFetchFile>
  fetchHTML(url: string): Promise<JSDOM>
}
```

- <div id="myXCrawl">Example</div>

myXCrawl is the crawler instance of the following example.

```js
const myXCrawl = new XCrawl({
  baseUrl: 'https://xxx.com',
  timeout: 10000,
  // The interval of the next request, multiple requests are valid
  intervalTime: {
    max: 2000,
    min: 1000
  }
})
```

### fetchData

fetchData is the method of the above <a href="#myXCrawl" style="text-decoration: none">myXCrawl</a> instance, which is usually used to crawl APIs to obtain JSON data and so on.

- Type

```ts
function fetchData <T = any>(config: IFetchDataConfig): Promise<T>
```

- Example

```js
const requestConifg = [
  { url: '/xxxx', method: 'GET' },
  { url: '/xxxx', method: 'GET' },
  { url: '/xxxx', method: 'GET' }
]

myXCrawl.fetchData({ 
  requestConifg, // Request configuration, can be IRequestConfig | IRequestConfig[]
  intervalTime: 800 // Interval between next requests, multiple requests are valid
}).then(res => {
  console.log(res)
})
```

### fetchFile

fetchFile is the method of the above <a href="#myXCrawl"  style="text-decoration: none">myXCrawl</a> instance, which is usually used to crawl files, such as pictures, pdf files, etc.

- Type

```ts
function fetchFile(config: IFetchFileConfig): Promise<IFetchFile>
```

- Example

```js
const requestConifg = [
  { url: '/xxxx' },
  { url: '/xxxx' },
  { url: '/xxxx' }
]

myXCrawl.fetchFile({
  requestConifg,
  fileConfig: {
    storeDir: path.resolve(__dirname, './upload') // storage folder
  }
}).then(fileInfos => {
  console.log(fileInfos)
})
```

### fetchHTML

fetchHTML is the method of the above <a href="#myXCrawl"  style="text-decoration: none">myXCrawl</a> instance, usually used to crawl HTML.

- Type

```ts
function fetchHTML(url: string): Promise<JSDOM>
```

- Example

```js
myXCrawl.fetchHTML('/xxx').then((jsdom) => {
  console.log(jsdom.window.document.querySelector('title')?.textContent)
})
```

## Types

- IAnyObject

```ts
interface IAnyObject extends Object {
  [key: string | number | symbol]: any
}
```

- IMethod

```ts
export type IMethod = 'get' | 'GET' | 'delete' | 'DELETE' | 'head' | 'HEAD' | 'options' | 'OPTIONS' | 'post' | 'POST' | 'put' | 'PUT' | 'patch' | 'PATCH' | 'purge' | 'PURGE' | 'link' | 'LINK' | 'unlink' | 'UNLINK'
```

- IRequestConfig

```ts
export interface IRequestConfig {
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

- IFechData

```ts
type IFetchData<T> = {
  statusCode: number | undefined
  headers: IncomingHttpHeaders // node:http
  data: T
}[]
```

- IFetchFile

```ts
 type IFetchFile = {
  fileName: string
  mimeType: string
  size: number
  filePath: string
}[]
```

- IXCrawlBaseConifg

```ts
interface IXCrawlBaseConifg {
  baseUrl?: string
  timeout?: number
  intervalTime?: IIntervalTime
}
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

## More

If you have any **questions** or **needs** , please submit **Issues in** https://github.com/coder-hxl/x-crawl .


---


# <div id="cn">x-crawl</div>

<a href="#en"  style="text-decoration: none">English</a> | 简体中文

XCrawl 是 Nodejs 多功能爬虫库。提供配置即可批量抓取 HTML 、JSON、图片等等。

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

- 类型

```ts
class XCrawl {
  private readonly baseConfig
  constructor(baseConfig?: IXCrawlBaseConifg)
  fetchData<T = any>(config: IFetchDataConfig): Promise<IFetchData<T>>
  fetchFile(config: IFetchFileConfig): Promise<IFetchFile>
  fetchHTML(url: string): Promise<JSDOM>
}
```

- <div id="cn-myXCrawl"  style="text-decoration: none">示例</div>

myXCrawl 为后面示例的爬虫实例。

```js
const myXCrawl = new XCrawl({
  baseUrl: 'https://xxx.com',
  timeout: 10000,
  // 下次请求的间隔时间, 多个请求才有效
  intervalTime: {
    max: 2000,
    min: 1000
  }
})
```

### fetchData

fetch 是上面 <a href="#cn-myXCrawl"  style="text-decoration: none">myXCrawl</a> 实例的方法，通常用于爬取 API ，可获取 JSON 数据等等。

- 类型

```ts
function fetchData<T = any>(config: IFetchDataConfig): Promise<T>
```

- 示例

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

fetchFile 是上面 <a href="#cn-myXCrawl"  style="text-decoration: none">myXCrawl</a> 实例的方法，通常用于爬取文件，可获取图片、pdf 文件等等。

- 类型

```ts
function fetchFile(config: IFetchFileConfig): Promise<IFetchFile>
```

- 示例

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

### fetchHTML

fetchHTML 是上面 <a href="#cn-myXCrawl"  style="text-decoration: none">myXCrawl</a> 实例的方法，通常用于爬取 HTML 。

- 类型

```ts
function fetchHTML(url: string): Promise<JSDOM>
```

- 示例

```js
myXCrawl.fetchHTML('/xxx').then((jsdom) => {
  console.log(jsdom.window.document.querySelector('title')?.textContent)
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
export type IMethod = 'get' | 'GET' | 'delete' | 'DELETE' | 'head' | 'HEAD' | 'options' | 'OPTIONS' | 'post' | 'POST' | 'put' | 'PUT' | 'patch' | 'PATCH' | 'purge' | 'PURGE' | 'link' | 'LINK' | 'unlink' | 'UNLINK'
```

- IRequestConfig

```ts 
export interface IRequestConfig {
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

- IFetchData

```ts
type IFetch<T> = {
  statusCode: number | undefined
  headers: IncomingHttpHeaders // node:http
  data: T
}[]
```

- IFetchFile

```ts
 type IFetchFile = {
  fileName: string
  mimeType: string
  size: number
  filePath: string
}[]
```

- IXCrawlBaseConifg

```ts
interface IXCrawlBaseConifg {
  baseUrl?: string
  timeout?: number
  intervalTime?: IIntervalTime
}
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

如有 **问题** 或 **需求** 请在 https://github.com/coder-hxl/x-crawl 中提 **Issues** 。
