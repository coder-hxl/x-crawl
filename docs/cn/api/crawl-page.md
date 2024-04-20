# crawlPage

crawlPage 是爬虫实例的方法，通常用于爬取动态页面。

## 类型 {#type}

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

- 查看 [CrawlPageDetailTargetConfig](/cn/type/crawl-page#crawlpagedetailtargetconfig) 类型
- 查看 [CrawlPageAdvancedConfig](/cn/type/crawl-page#crawlpageadvancedconfig) 类型

**返回值类型：**

- 查看 [CrawlPageSingleResult](/cn/type/crawl-page#crawlpagesingleresult) 类型

## 示例 {#example}

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

## 配置 {#configuration}

一共有 4 种:

- 简单目标配置 - string
- 详细目标配置 - CrawlPageDetailTargetConfig
- 混合目标数组配置 - (string | CrawlPageDetailTargetConfig)[]
- 进阶配置 - CrawlPageAdvancedConfig

### 简单目标配置 - string {#simple-target-configuration---string}

这是简单目标配置。如果你只想单纯爬一下这个页面，可以试试这种写法：

```js
import { createCrawl } from 'x-crawl'

const crawlApp = createCrawl()

crawlApp.crawlPage('https://www.example.com').then((res) => {})
```

::: tip
拿到的 res 将是一个对象。
:::

### 详细目标配置 - CrawlPageDetailTargetConfig {#detailed-target-configuration---crawldatadetailtargetconfig}

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

更多配置选项可以查看 [CrawlPageDetailTargetConfig](/cn/type/crawl-page#crawlpagedetailtargetconfig) 。

::: tip
拿到的 res 将是一个对象。
:::

### 混合目标数组配置 - (string | CrawlPageDetailTargetConfig)[] {#mixed-target-array-configuration---(string-|-CrawlDataDetailTargetConfig)[]}

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

更多配置选项可以查看 [CrawlPageDetailTargetConfig](/cn/type/crawl-page#crawlpagedetailtargetconfig) 。

::: tip
拿到的 res 将是一个数组，里面是对象。
:::

### 进阶配置 - CrawlPageAdvancedConfig {#advanced-configuration---crawldataadvancedconfig}

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

更多配置选项可以查看 [CrawlPageAdvancedConfig](/cn/type/crawl-page#crawlpageadvancedconfig) 。

::: tip
拿到的 res 将是一个数组，里面是对象。
:::

关于结果的更多信息可查看 [关于结果](/cn/guide/results#关于结果) ，可以根据实际情况选用即可。
