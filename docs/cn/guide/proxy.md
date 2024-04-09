# 轮换代理

配合失败重试，自定义错误次数以及 HTTP 状态码为爬取目标自动轮换代理。

可以在 创建爬虫应用实例、进阶用法、详细目标 这三个地方设置。

以 crawlPage 为例：

```js
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

::: tip
该功能需要配合失败重试才能正常使用。
:::
