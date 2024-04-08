# crawlHTML

crawlHTML 是爬虫实例的方法，通常用于爬取静态 HTML 页面。

## 类型

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

## 示例

```js
import { createCrawl } from 'x-crawl'

const crawlApp = createCrawl()

// crawlHTML API
crawlApp.crawlHTML('https://www.example.com').then((res) => {})
```

## 配置

一共有 4 种:

- 简单目标配置 - string
- 详细目标配置 - CrawlHTMLDetailTargetConfig
- 混合目标数组配置 - (string | CrawlHTMLDetailTargetConfig)[]
- 进阶配置 - CrawlHTMLAdvancedConfig

### 简单目标配置 - string

这是简单目标配置。如果你只想单纯爬一下这个静态 HTML 页面，可以试试这种写法：

```js
import { createCrawl } from 'x-crawl'

const crawlApp = createCrawl()

crawlApp.crawlHTML('https://www.example.com').then((res) => {})
```

拿到的 res 将是一个对象。

### 详细目标配置 - CrawlHTMLDetailTargetConfig

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

### 混合目标数组配置 - (string | CrawlHTMLDetailTargetConfig)[]

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

### 进阶配置 - CrawlHTMLAdvancedConfig

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
