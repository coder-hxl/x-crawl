# createCrawlOpenAI

## CreateCrawlOpenAIConfig

```ts
export interface CreateCrawlOpenAIConfig {
  defaultModel?: {
    chatModel: OpenAIChatModel
  }
  clientOptions?: ClientOptions // ClientOptions 来自于 openai
}
```

| 参数          | 类型                           | 默认值 | 描述                          |
| ------------- | ------------------------------ | ------ | ----------------------------- |
| defaultModel  | { chatModel: OpenAIChatModel } | -      | AI 模型                       |
| clientOptions | ClientOptions                  | -      | AI 其他配置, 用于创建 AI 实例 |

**外部类型**

- ClientOptions：来自于 openai，clientOptions 会直接传给 new OpenAI 用于创建 AI 实例

## CrawlOpenAIApp

```ts
export interface CrawlOpenAIApp {
  parseElements<T extends Record<string, string>>(
    HTML: string,
    content: string | CrawlOpenAIParseElementsContentOptions,
    option?: CrawlOpenAICommonAPIOtherOption
  ): Promise<CrawlOpenAIParseElementsResult<T>>

  getElementSelectors(
    HTML: string,
    content: string | CrawlOpenAIGetElementSelectorsContentOptions,
    option?: CrawlOpenAICommonAPIOtherOption
  ): Promise<CrawlOpenAIGetElementSelectorsResult>

  help(
    content: string,
    option?: CrawlOpenAICommonAPIOtherOption
  ): Promise<string>

  custom(): OpenAI
}
```
