# 用户自定义 AI 功能

为了满足不同用户的个性化需求，x-crawl 还提供了用户自定义 AI 的功能。将 openai 实例提供出来，这意味着您可以根据自己的需求，对 AI 进行定制和优化，使其更好地适应您的爬虫工作。

使用 AI 应用实例的 custom 方法。

示例：

```js{7}
import { createCrawlOpenAI } from 'x-crawl'

const crawlOpenAIApp = createCrawlOpenAI({
  clientOptions: { apiKey: '你的 API Key' }
})

const openai = crawlOpenAIApp.custom()
```

调用 custom 拿到的 openai 可参考：https://platform.openai.com/docs/api-reference/chat/create?lang=node.js ，调用 custom 拿到的 openai 与网站示例 new OpenAI() 拿到的实例差不多，不同的是 x-crawl 会将创建 AI 应用实例时传入的 clientOptions 传给 new OpenAI ，拿到的是完好无损 OpenAI 实例，x-crawl 并不会对其重写。
