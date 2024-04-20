# parseElements

parseElements 是 AI 应用实例的方法，通常用于智能按需分析元素。

## 类型 {#type}

parseElements API 是一个函数。

```ts
function parseElements<T extends Record<string, string>>(
  HTML: string,
  content: string | CrawlOpenAIParseElementsContentOptions,
  option?: CrawlOpenAICommonAPIOtherOption
): Promise<CrawlOpenAIParseElementsResult<T>>
```

**参数类型：**

- 查看 [CrawlOpenAIParseElementsContentOptions](/cn/type/parse-elements#crawlopenaiparseelementscontentoptions) 类型
- 查看 [CrawlOpenAICommonAPIOtherOption](/cn/type/crawl-openai-other-config#crawlopenaicommonapiotheroption) 类型

**返回值类型：**

- 查看 [CrawlOpenAIParseElementsResult](/cn/type/parse-elements#crawlopenaiparseelementsresult) 类型

## 示例 {#example}

```js
import { createCrawlOpenAI } from 'x-crawl'

const crawlOpenAIApp = createCrawlOpenAI()

crawlOpenAIApp.parseElements('HTML', '告诉 AI 你想要的').then((res) => {})
```
