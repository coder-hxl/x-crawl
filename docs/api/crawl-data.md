# crawlData

crawl is a method of crawler instance, usually used to crawl API, obtain JSON data, etc.

## type

crawlData API is a function. A type is an [overloaded function](https://www.typescriptlang.org/docs/handbook/2/functions.html#function-overloads) that can be called with different configuration parameters (in terms of type).

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

**Parameter Type:**

- View the [CrawlDataDetailTargetConfig](/type/crawl-data#crawldatadetailtargetconfig) type
- View the [CrawlDataAdvancedConfig](/type/crawl-data#crawldataadvancedconfig) type

**Return value type:**

- View the [CrawlDataSingleResult](/type/crawl-data#crawldatasingleresult) type

## Example

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

## Configuration

There are 4 types in total:

- Simple target configuration - string
- Detailed target configuration - CrawlDataDetailTargetConfig
- Mixed target array configuration - (string | CrawlDataDetailTargetConfig)[]
- Advanced configuration - CrawlDataAdvancedConfig

### Simple target configuration - string

This is a simple target configuration. If you just want to simply crawl this data, and the interface is GET, you can try this way of writing:

```js
import { createCrawl } from 'x-crawl'

const crawlApp = createCrawl()

crawlApp.crawlData('https://www.example.com/api').then((res) => {})
```

::: tip
The res obtained will be an object.
:::

### Detailed target configuration - CrawlDataDetailTargetConfig

This is the detailed target configuration. If you want to crawl this data and need to retry after failure, you can try this way of writing:

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

For more configuration options, see [CrawlDataDetailTargetConfig](/type/crawl-data#crawldatadetailtargetconfig).

::: tip
The res obtained will be an object.
:::

### Mixed target array configuration - (string | CrawlDataDetailTargetConfig)[]

This is a mixed target array configuration. If you want to crawl multiple data, and some data needs to be failed and retried, you can try this way of writing:

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

For more configuration options, see [CrawlDataDetailTargetConfig](/type/crawl-data#crawldatadetailtargetconfig).

::: tip
The res obtained will be an array containing objects.
:::

### Advanced configuration - CrawlDataAdvancedConfig

This is an advanced configuration, targets is a mixed target array configuration. If you want to crawl multiple data, and you don’t want to write the crawling target configuration (proxy, cookies, retry, etc.) repeatedly, and you also need interval time, device fingerprint, life cycle, etc., you can try this way of writing:

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

For more configuration options, see [CrawlDataAdvancedConfig](/type/crawl-data#crawldataadvancedconfig).

::: tip
The res obtained will be an array containing objects.
:::

For more information about the results, please view [About the results](/guide/results#about-the-results). You can choose it according to the actual situation.
