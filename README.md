# <div id="en">x-crawl</div>

English | <a href="#cn" style="text-decoration: none">简体中文</a>

Crawl is a Nodejs multifunctional crawler library. Provide configuration to batch fetch HTML, JSON, images, etc.

---


# <div id="cn">x-crawl</div>

<a href="#en"  style="text-decoration: none">English</a> | 简体中文

Crawl 是 Nodejs 多功能爬虫库。提供配置即可批量抓取 HTML 、JSON、图片等等。

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

* 类型

```ts
class XCrawl {
  private readonly baseConfig
  constructor(baseConfig?: IXCrawlBaseConifg)
  fetch<T = any>(config: IFetchConfig): Promise<T>
  fetchFile(config: IFetchFileConfig): Promise<IFetchFile>
  fetchHTML(url: string): Promise<JSDOM>
}
```

* <div id="myXCrawl"  style="text-decoration: none">示例</div>

myXCrawl 为后面示例的爬虫实例。

```js
const myXCrawl = new XCrawl({
  baseUrl: 'https://xxx.com',
  timeout: 10000,
  // 相当于默认值, 下次请求的间隔时间, 多个请求才有效
  intervalTime: {
    max: 2000,
    min: 1000
  }
})
```

### fetch

fetch 是上面 <a href="#myXCrawl"  style="text-decoration: none">myXCrawl</a> 实例的方法，通常用于爬取 API ，可获取 JSON 数据等等。

* 类型

```ts
function fetch<T = any>(config: IFetchConfig): Promise<T>
```

* 示例

```js
const requestConifg = [
  { url: '/xxxx', method: 'GET' },
  { url: '/xxxx', method: 'GET' },
  { url: '/xxxx', method: 'GET' }
]

myXCrawl.fetch({ 
  requestConifg, // 请求配置, 可以是 Array | Object
  intervalTime: 800 // 下次请求的间隔时间, 多个请求才有效
}).then(res => {
  console.log(res)
})
```

### fetchFile

fetchFile 是上面 <a href="#myXCrawl"  style="text-decoration: none">myXCrawl</a> 实例的方法，通常用于爬取文件，可获取图片、pdf 文件等等。

* 类型

```ts
function fetchFile(config: IFetchFileConfig): Promise<IFetchFile>
```

* 示例

```js
const requestConifg = [
  { url: '/xxxx', method: 'GET' },
  { url: '/xxxx', method: 'GET' },
  { url: '/xxxx', method: 'GET' }
]

myXCrawl.fetchFile({
  requestConifg, // 请求配置, 可以是 Array | Object
  fileConfig: {
    storeDir: path.resolve(__dirname, './upload') // 存放文件夹
  }
}).then(fileInfos => {
  console.log(fileInfos)
})
```

### fetchHTML

fetchHTML 是上面 <a href="#myXCrawl"  style="text-decoration: none">myXCrawl</a> 实例的方法，通常用于爬取 HTML 。

* 类型

```ts
function fetchHTML(url: string): Promise<JSDOM>
```

* 示例

```js
myXCrawl.fetchHTML('/xxx').then((jsdom) => {
  console.log(jsdom.window.document.querySelector('title')?.textContent)
})
```

## 类型

* IAnyObject

```ts
interface IAnyObject extends Object {
  [key: string | number | symbol]: any
}
```

* IMethod

```ts
export type IMethod = 'get' | 'GET' | 'delete' | 'DELETE' | 'head' | 'HEAD' | 'options' | 'OPTIONS' | 'post' | 'POST' | 'put' | 'PUT' | 'patch' | 'PATCH' | 'purge' | 'PURGE' | 'link' | 'LINK' | 'unlink' | 'UNLINK'
```

* IRequestConfig

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

* IIntervalTime

```ts
type IIntervalTime = number | {
  max: number
  min?: number
}
```

* IFetchBaseConifg

```ts
interface IFetchBaseConifg {
  requestConifg: IRequestConfig | IRequestConfig[]
  intervalTime?: IIntervalTime
}
```

* IFetchFile

```ts
 type IFetchFile = {
  fileName: string
  mimeType: string
  size: number
  filePath: string
}[]
```

* IXCrawlBaseConifg

```ts
interface IXCrawlBaseConifg {
  baseUrl?: string
  timeout?: number
  intervalTime?: IIntervalTime
}
```

* IFetchConfig

```ts
interface IFetchConfig extends IFetchBaseConifg {
}
```

* IFetchFileConfig

```ts
interface IFetchFileConfig extends IFetchBaseConifg {
  fileConfig: {
    storeDir: string
  }
}
```

## 更多

如有 **问题** 或 **需求** 请在 https://github.com/coder-hxl/x-crawl 中提 **Issues** 。
