# 创建 AI 应用 {#create-ai-application}

## Ollama

通过 [createCrawlOllama()](/cn/api/create-crawl-ollama#createxcrawlollama) 创建一个新的 **应用实例**:

```js
import { createCrawlOllama } from 'x-crawl'

const crawlOllamaApp = createCrawlOllama({
  model: "你的模型",
  clientOptions: { ... }
})
```

## Openai

需要用到 OpenAI 的 API Key

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
