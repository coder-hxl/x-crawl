# createCrawlOpenAI

通过调用 createCrawlOpenAI 创建一个 AI 应用实例。

## 类型 {#type}

createCrawlOpenAI API 是一个函数。

```ts
function createCrawlOpenAI(config?: createCrawlOpenAIConfig): crawlOpenAIApp
```

**参数类型：**

- 查看 [createCrawlOpenAIConfig](/cn/type/create-crawl-openai#createcrawlopenaiconfig) 类型

**返回值类型：**

- 查看 [crawlOpenAIApp](/cn/type/create-crawl-openai#crawlopenaiapp) 类型

## 示例 {#example}

```js
import { createCrawlOpenAI } from 'x-crawl'

// crawlOpenAIApp API
const crawlOpenAIApp = createCrawlOpenAI({
  clientOptions: { apiKey: '你的 API Key' },
  defaultModel: { chatModel: 'gpt-4-turbo-preview' }
})
```
