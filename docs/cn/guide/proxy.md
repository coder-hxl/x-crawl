# 轮换代理 {#rotate-proxy}

配合失败重试，自定义错误次数以及 HTTP 状态码为爬取目标自动轮换代理。

```js{8,9,10,11,12,13,14,15,16}
import { createCrawl } from 'x-crawl'

const crawlApp = createCrawl()

crawlApp
  .crawlPage({
    url: 'https://www.example.com',
    maxRetry: 10,
    proxy: {
      urls: [
        'https://www.example.com/proxy-1',
        'https://www.example.com/proxy-2'
      ],
      switchByHttpStatus: [401, 403],
      switchByErrorCount: 3
    }
  })
  .then((res) => {})
```

上面的示例中我们使用 `switchByErrorCount` 为每个代理设置了 3 次机会，当 3 次机会用完了就会自动切换下一个代理。如果提供 `switchByHttpStatus` ，那么就会优先根据状态码自动切换代理。

::: tip
需要配合 maxRetry 失败重试才能使用，并且 maxRetry 必需大于该目标所有代理的 switchByErrorCount 总和，因为 maxRetry 控制该目标的重试次数。
:::

**可以在 创建爬虫应用实例、进阶用法、详细目标 这三个地方设置。**

```js{13,17,18,19,20,21,22,23,26,28,29,30,31,32,33,34,35,36}
import { createCrawl } from 'x-crawl'

const crawlApp = createCrawl()

crawlApp
  .crawlPage({
    targets: [
      'https://www.example.com/page-1',
      'https://www.example.com/page-2',
      'https://www.example.com/page-3',
      'https://www.example.com/page-4',
      // 为此目标取消代理
      { url: 'https://www.example.com/page-6', proxy: null },
      // 为此目标单独设置代理
      {
        url: 'https://www.example.com/page-6',
        proxy: {
          urls: [
            'https://www.example.com/proxy-4',
            'https://www.example.com/proxy-5'
          ],
          switchByErrorCount: 3
        }
      }
    ],
    maxRetry: 10,
    // 为此次的目标统一设置代理
    proxy: {
      urls: [
        'https://www.example.com/proxy-1',
        'https://www.example.com/proxy-2',
        'https://www.example.com/proxy-3'
      ],
      switchByErrorCount: 3,
      switchByHttpStatus: [401, 403]
    }
  })
  .then((res) => {})
```
