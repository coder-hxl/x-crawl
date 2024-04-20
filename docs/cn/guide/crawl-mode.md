# 爬取模式 {#crawling-mode}

一个爬虫应用实例有两种爬取模式: 异步/同步，每个爬虫实例只能选择其中一种。

```js{3}
import { createCrawl } from 'x-crawl'

const crawlApp = createCrawl({ mode: 'async' })
```

mode 选项默认为 async 。

- async: 异步爬取目标，无需等当前爬取目标完成，就进行下次爬取目标
- sync: 同步爬取目标，需要等这次爬取目标完成，才会进行下次爬取目标

若有设置间隔时间，则都需要等间隔时间结束才会爬取下次目标。

::: tip
爬取 API 的爬取过程都是单独进行的，也就是说如果调用两个 crawlPage 他们会互不干扰，该模式对批量爬取目标才有效。
:::
