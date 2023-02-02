# x-crawl

English | [简体中文](https://github.com/coder-hxl/x-crawl/blob/main/document/cn.md)

XCrawl is a Nodejs multifunctional crawler library. Crawl HTML, JSON, file resources, etc. through simple configuration.

## highlights

- Call the API to grab HTML, JSON, file resources, etc
- Batch requests can choose the mode of sending asynchronously or sending synchronously

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

## Core concepts

### XCrawl

Create a crawler instance via new XCrawl.

#### Type

```ts
class XCrawl {
  private readonly baseConfig
  constructor(baseConfig?: IXCrawlBaseConifg)
  fetchHTML(config: string | IFetchHTMLConfig): Promise<JSDOM>
  fetchData<T = any>(config: IFetchDataConfig): Promise<IFetchCommon<T>>
  fetchFile(config: IFetchFileConfig): Promise<IFetchCommon<IFileInfo>>
}
```

#### <div id="myXCrawl">Example</div>

myXCrawl is the crawler instance of the following example.

```js
const myXCrawl = new XCrawl({
  baseUrl: 'https://xxx.com',
  timeout: 10000,
  // The interval between requests, multiple requests are valid
  intervalTime: {
    max: 2000,
    min: 1000
  }
})
```

#### About the pattern

The mode option defaults to async .

- async: In batch requests, the next request is made without waiting for the current request to complete
- sync: In batch requests, you need to wait for this request to complete before making the next request

If there is an interval time set, it is necessary to wait for the interval time to end before sending the request.

### fetchHTML

fetchHTML is the method of the above <a href="#myXCrawl"  style="text-decoration: none">myXCrawl</a> instance, usually used to crawl HTML.

#### Type

```ts
function fetchHTML(config: string | IFetchHTMLConfig): Promise<JSDOM>
```

#### Example

```js
myXCrawl.fetchHTML('/xxx').then((jsdom) => {
  console.log(jsdom.window.document.querySelector('title')?.textContent)
})
```

### fetchData

fetchData is the method of the above <a href="#myXCrawl" style="text-decoration: none">myXCrawl</a> instance, which is usually used to crawl APIs to obtain JSON data and so on.

#### Type

```ts
function fetchData<T = any>(config: IFetchDataConfig): Promise<IFetchCommon<T>>
```

#### Example

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

#### Type

```ts
function fetchFile(config: IFetchFileConfig): Promise<IFetchCommon<IFileInfo>>
```

#### Example

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

## Types

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

## More

If you have any **questions** or **needs** , please submit **Issues in** https://github.com/coder-hxl/x-crawl/issues .
