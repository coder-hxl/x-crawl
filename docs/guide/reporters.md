# 终端信息

爬取信息由开始（显示模式和总数）、过程（显示数量和等待多久）、结果（显示成功和失败信息）组成。每段信息前面都会有如 **1-page-2** ，前面的 1 代表第 1 个爬虫实例，中间的 page 代表 API 类型，后面的 2 代表第 1 个爬虫实例的第 2 个 page ，这样做的目的是为了更好区分信息来自哪个 API 。

当您不希望在终端显示爬取信息时，可以通过选项自己控制显示或隐藏。

```js{4,7}
import { createCrawl } from 'x-crawl'

// 只隐藏过程，开始和结果显示
const crawlApp = createCrawl({ log: { process: false } })

// 隐藏全部信息
const crawlApp = createCrawl({ log: false })
```

log 选项接收对象或布尔类型：

- 布尔
  - true：全部显示
  - false：全部隐藏
- 对象
  - start：对开始信息控制
  - process：对过程信息控制
  - result：对结果信息控制
