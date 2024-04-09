# createXCrawlOpenAI

通过调用 createXCrawlOpenAI 创建一个 AI 应用实例。

## 类型

createXCrawlOpenAI API 是一个函数。

```ts
function createXCrawlOpenAI(config?: CreateXCrawlOpenAIConfig): XCrawlOpenAIApp
```

**参数类型：**

- 查看 [CreateXCrawlOpenAIConfig](#CreateXCrawlOpenAIConfig) 类型

**返回值类型：**

- 查看 [XCrawlOpenAIApp](#XCrawlOpenAIApp) 类型

## 示例

```js
import { createXCrawlOpenAI } from 'x-crawl'

// xCrawlOpenAIApp API
const xCrawlOpenAIApp = createXCrawlOpenAI({
  clientOptions: { apiKey: '你的 API Key' },
  defaultModel: { chatModel: 'gpt-4-turbo-preview' }
})
```
