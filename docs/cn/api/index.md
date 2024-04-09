# createCrawl

通过调用 createCrawl 创建一个爬虫应用实例。爬取目标是由实例方法内部维护，并非由实例维护。

## 类型

createCrawl API 是一个函数。

```ts
function createCrawl(config?: CreateCrawlConfig): CrawlApp
```

**参数类型：**

- 查看 [CreateCrawlConfig](/cn/type/index#createcrawlconfig) 类型

**返回值类型：**

- 查看 [CrawlApp](/cn/type/index#crawlapp) 类型

## 示例

```js
import { createCrawl } from 'x-crawl'

// createCrawl API
const crawlApp = createCrawl({
  baseUrl: 'https://www.example.com',
  timeout: 10000,
  intervalTime: { max: 2000, min: 1000 }
})
```
