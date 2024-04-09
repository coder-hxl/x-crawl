# 创建 AI 应用

目前 x-crawl 的 AI 辅助功能是依靠 OpenAI ，需要用到 OpenAI 的 API Key 。后续还可能加入其他 AI 的。

通过 [createCrawlOpenAI()](/cn/api/create-crawl-openai#createxcrawlopenai) 创建一个新的 **应用实例**:

```js
import { createCrawlOpenAI } from 'x-crawl'

const crawlOpenAIApp = createCrawlOpenAI({
  clientOptions: { apiKey: '你的 API Key' }
})
```

**领取 API Key**

- **[OpenAI 官方的 API Key](https://platform.openai.com/api-keys)**
- **[免费的 API Key](https://github.com/chatanywhere/GPT_API_free)**
