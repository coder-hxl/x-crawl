# 配置

一些通用的配置可以通过在这三个地方设置：

- 应用实例配置（全局）
- 进阶配置（局部）
- 详细目标配置（单独）

## 优先级

优先级为：详细目标配置 > 进阶配置 > 应用实例配置

以 maxRetry 重试次数为例：

```js{4,13,16}
import { createCrawl } from 'x-crawl'

// 应用实例配置
const crawlApp = createCrawl({ maxRetry: 3 })

// 进阶配置
crawlApp
  .crawlPage({
    targets: [
      'https://www.example.com/page-1',
      'https://www.example.com/page-2',
      // 详细目标配置
      { url: 'https://www.example.com/page-3', maxRetry: 8 },
      'https://www.example.com/page-4'
    ],
    maxRetry: 6
  })
  .then((res) => {})

crawlApp.crawlPage('https://www.example.com/page-5').then((res) => {})
```

在上面的示例中，**应用实例配置**、**进阶配置**以及**详细目标配置**中都设置了**重试次数**，page3 将会采用自己的重试次数（8次），page1、 page2 以及 page4 将采用进阶配置的重试次数（6次），page5 会使用应用实例配置的重试次数（3次）。

## 取消复用配置选项

可在使用 null 取消上层配置。

以 maxRetry 重试次数为例：

```js{8,20}
import { createCrawl } from 'x-crawl'

const crawlApp = createCrawl({ maxRetry: 3 })

crawlApp
  .crawlPage({
    url: 'https://www.example.com/page-1',
    maxRetry: null
  })
  .then((res) => {})

crawlApp.crawlPage('https://www.example.com/page-2').then((res) => {})

crawlApp
  .crawlPage({
    targets: [
      'https://www.example.com/page-3',
      'https://www.example.com/page-4'
    ],
    maxRetry: null
  })
  .then((res) => {})
```

在上面的示例中，page-1、page3、page4 都取消了重试次数，page2 有 3 次重试次数。
