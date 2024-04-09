# crawlData

crawl 是爬虫实例的方法，通常用于爬取 API ，可获取 JSON 数据等等。

## 类型

crawlData API 是一个函数。类型是 [重载函数](https://www.typescriptlang.org/docs/handbook/2/functions.html#function-overloads) 可以通过不同的配置参数调用该函数（在类型方面）。

```ts
type crawlData = {
  <T = any>(config: string): Promise<CrawlDataSingleResult<T>>

  <T = any>(
    config: CrawlDataDetailTargetConfig
  ): Promise<CrawlDataSingleResult<T>>

  <T = any>(
    config: (string | CrawlDataDetailTargetConfig)[]
  ): Promise<CrawlDataSingleResult<T>[]>

  <T = any>(
    config: CrawlDataAdvancedConfig<T>
  ): Promise<CrawlDataSingleResult<T>[]>
}
```

**参数类型：**

- 查看 [CrawlDataDetailTargetConfig](/cn/type/crawl-data#crawldatadetailtargetconfig) 类型
- 查看 [CrawlDataAdvancedConfig](/cn/type/crawl-data#crawldataadvancedconfig) 类型

**返回值类型：**

- 查看 [CrawlDataSingleResult](/cn/type/crawl-data#crawldatasingleresult) 类型

## 示例

```js
import { createCrawl } from 'x-crawl'

const crawlApp = createCrawl({
  timeout: 10000,
  intervalTime: { max: 2000, min: 1000 }
})

// crawlData API
crawlApp
  .crawlData({
    targets: ['https://www.example.com/api-1', 'https://www.example.com/api-2'],
    intervalTime: { max: 3000, min: 1000 },
    cookies: 'xxx',
    maxRetry: 1
  })
  .then((res) => {
    console.log(res)
  })
```

## 配置

一共有 4 种:

- 简单目标配置 - string
- 详细目标配置 - CrawlDataDetailTargetConfig
- 混合目标数组配置 - (string | CrawlDataDetailTargetConfig)[]
- 进阶配置 - CrawlDataAdvancedConfig

### 简单目标配置 - string

这是简单目标配置。如果你只想单纯爬一下这个数据，并且该接口是 GET 方式的，可以试试这种写法：

```js
import { createCrawl } from 'x-crawl'

const crawlApp = createCrawl()

crawlApp.crawlData('https://www.example.com/api').then((res) => {})
```

::: tip
拿到的 res 将是一个对象。
:::

### 详细目标配置 - CrawlDataDetailTargetConfig

这是详细目标配置。如果你想爬一下这个数据，并且需要失败重试之类的，可以试试这种写法：

```js
import { createCrawl } from 'x-crawl'

const crawlApp = createCrawl()

crawlApp
  .crawlData({
    url: 'https://www.example.com/api',
    proxy: { urls: ['xxx'] },
    maxRetry: 1
  })
  .then((res) => {})
```

更多配置选项可以查看 [CrawlDataDetailTargetConfig](/cn/type/crawl-data#crawldatadetailtargetconfig) 。

::: tip
拿到的 res 将是一个对象。
:::

### 混合目标数组配置 - (string | CrawlDataDetailTargetConfig)[]

这是混合目标数组配置。如果你想爬取多个数据，并且有些数据需要失败重试之类的，可以试试这种写法：

```js
import { createCrawl } from 'x-crawl'

const crawlApp = createCrawl()

crawlApp
  .crawlData([
    'https://www.example.com/api-1',
    { url: 'https://www.example.com/api-2', maxRetry: 2 }
  ])
  .then((res) => {})
```

更多配置选项可以查看 [CrawlDataDetailTargetConfig](/cn/type/crawl-data#crawldatadetailtargetconfig) 。

::: tip
拿到的 res 将是一个数组，里面是对象。
:::

### 进阶配置 - CrawlDataAdvancedConfig

这是进阶配置，targets 是混合目标数组配置。如果你想爬取多个数据，并且爬取目标配置（proxy、cookies、重试等等）不想重复写，还需要间隔时间、设备指纹以及生命周期等等，可以试试这种写法：

```js
import { createCrawl } from 'x-crawl'

const crawlApp = createCrawl()

crawlApp
  .crawlData({
    targets: [
      'https://www.example.com/api-1',
      { url: 'https://www.example.com/api-2', maxRetry: 6 }
    ],
    intervalTime: { max: 3000, min: 1000 },
    cookies: 'xxx',
    maxRetry: 1
  })
  .then((res) => {})
```

更多配置选项可以查看 [CrawlDataAdvancedConfig](/cn/type/crawl-data#crawldataadvancedconfig) 。

::: tip
拿到的 res 将是一个数组，里面是对象。
:::

关于结果的更多信息可查看 [关于结果](/cn/guide/results#关于结果) ，可以根据实际情况选用即可。
