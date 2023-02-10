# x-crawl

English | [简体中文](https://github.com/coder-hxl/x-crawl/blob/main/document/cn.md)

XCrawl is a Nodejs multifunctional crawler library. 

## Feature

- Crawl HTML, JSON, file resources, etc. with simple configuration
- Use the JSDOM library to parse HTML, or parse HTML by yourself
- Optional mode asynchronous/synchronous for batch requests
- Polling function
- Anthropomorphic request interval
- Written in TypeScript

## Catalog

[TOC]

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
docsXCrawl.fetchHTML('/zh/get-started').then((res) => {
  const { jsdom } = res.data
  console.log(jsdom.window.document.querySelector('title')?.textContent)
})
```

## Core concepts

### XCrawl

Create a crawler instance via new XCrawl. The request queue is maintained by the instance method itself and is not shared.

#### Type

```ts
class XCrawl {
  constructor(baseConfig?: IXCrawlBaseConifg)
  fetchHTML(config: IFetchHTMLConfig): Promise<IFetchHTML>
  fetchData<T = any>(config: IFetchDataConfig): Promise<IFetchCommon<T>>
  fetchFile(config: IFetchFileConfig): Promise<IFetchCommon<IFileInfo>>
  fetchPolling(config: IFetchPollingConfig, callback: (count: number) => void): void
}
```

#### Example

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

Passing **baseConfig** is for **fetchHTML/fetchData/fetchFile** to use these values by default.

**Note:** To avoid repeated creation of instances in subsequent examples, **myXCrawl** here will be the crawler instance in the **fetchHTML/fetchData/fetchFile** example.

#### Mode 

The mode option defaults to async .

- async: In batch requests, the next request is made without waiting for the current request to complete
- sync: In batch requests, you need to wait for this request to complete before making the next request

If there is an interval time set, it is necessary to wait for the interval time to end before sending the request.

#### IntervalTime 

The intervalTime option defaults to undefined . If there is a setting value, it will wait for a period of time before requesting, which can prevent too much concurrency and avoid too much pressure on the server.

- number: The time that must wait before each request is fixed
- Object: Randomly select a value from max and min, which is more anthropomorphic

The first request is not to trigger the interval.

### fetchHTML

fetchHTML is the method of the above [myXCrawl](https://github.com/coder-hxl/x-crawl#Example-1) instance, usually used to crawl HTML.

#### Type

```ts
function fetchHTML(config: IFetchHTMLConfig): Promise<IFetchHTML>
```

#### Example

```js
myXCrawl.fetchHTML('/xxx').then((res) => {
  const { jsdom } = res.data
  console.log(jsdom.window.document.querySelector('title')?.textContent)
})
```

### fetchData

fetchData is the method of the above [myXCrawl](https://github.com/coder-hxl/x-crawl#Example-1) instance, which is usually used to crawl APIs to obtain JSON data and so on.

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
  intervalTime: { max: 5000, min: 1000 } // The intervalTime passed in when not using myXCrawl
}).then(res => {
  console.log(res)
})
```

### fetchFile

fetchFile is the method of the above [myXCrawl](https://github.com/coder-hxl/x-crawl#Example-1) instance, which is usually used to crawl files, such as pictures, pdf files, etc.

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

### fetchPolling

fetchPolling is a method of the [myXCrawl](https://github.com/coder-hxl/x-crawl#Example-1) instance, typically used to perform polling operations, such as getting news every once in a while.

#### Type

```ts
function fetchPolling(
  config: IFetchPollingConfig,
  callback: (count: number) => void
): void
```

#### Example

```js
myXCrawl.fetchPolling({ h: 1, m: 30 }, () => {
  // will be executed every one and a half hours
  // fetchHTML/fetchData/fetchFile
})
```

## Types

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
 Y?: number // Year (365 days per year)
 M?: number // Month (30 days per month)
 d?: number // day
 h?: number // hour
 m?: number // minute
}
```

### IFetchCommon

```ts
type IFetchCommon<T> = {
  id: number
  statusCode: number | undefined
  headers: IncomingHttpHeaders // node:http type
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
    jsdom: JSDOM // HTML parsing using the jsdom library
  }
}
```

## More

If you have any **questions** or **needs** , please submit **Issues in** https://github.com/coder-hxl/x-crawl/issues .
