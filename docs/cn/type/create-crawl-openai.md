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

**默认值**

- defaultModel: { chatModel: 'gpt-3.5-turbo' }
- clientOptions: undefined

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
