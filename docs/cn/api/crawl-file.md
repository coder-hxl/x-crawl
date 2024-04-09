# crawlFile

crawlFile 是爬虫实例的方法，通常用于爬取文件，可获取图片、pdf 文件等等。

## 类型

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

- 查看 [CrawlFileDetailTargetConfig](/cn/type/crawl-file#crawlfiledetailtargetconfig) 类型
- 查看 [CrawlFileAdvancedConfig](/cn/type/crawl-file#crawlfileadvancedconfig) 类型

**返回值类型：**

- 查看 [CrawlFileSingleResult](/cn/type/crawl-file#crawlfilesingleresult) 类型

## 示例

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

## 配置

一共有 4 种:

- 简单目标配置 - string
- 详细目标配置 - CrawlFileDetailTargetConfig
- 详细目标数组配置 - (string | CrawlFileDetailTargetConfig)[]
- 进阶配置 - CrawlFileAdvancedConfig

### 简单目标配置 - string

这是简单目标配置。如果你只想单纯爬一下这个文件，可以试试这种写法：

```js
import { createCrawl } from 'x-crawl'

const crawlApp = createCrawl()

crawlApp.crawlFile('https://www.example.com/file').then((res) => {})
```

::: tip
拿到的 res 将是一个对象。
:::

### 详细目标配置 - CrawlFileDetailTargetConfig

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

更多配置选项可以查看 [CrawlFileDetailTargetConfig](/cn/type/crawl-file#crawlfiledetailtargetconfig) 。

::: tip
拿到的 res 将是一个对象。
:::

### 混合目标数组配置 - (string | CrawlFileDetailTargetConfig)[]

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

更多配置选项可以查看 [CrawlFileDetailTargetConfig](/cn/type/crawl-file#crawlfiledetailtargetconfig) 。

::: tip
拿到的 res 将是一个数组，里面是对象。
:::

### 进阶配置 - CrawlFileAdvancedConfig

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

更多配置选项可以查看 [CrawlFileAdvancedConfig](/cn/type/crawl-file/cn/type/crawl-file#crawlfileadvancedconfig) 。

::: tip
拿到的 res 将是一个数组，里面是对象。
:::

关于结果的更多信息可查看 [关于结果](/cn/guide/results#关于结果) ，可以根据实际情况选用即可。
