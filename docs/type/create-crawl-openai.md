# createCrawlOpenAI

## CreateCrawlOpenAIConfig

```ts
export interface CreateCrawlOpenAIConfig {
  defaultModel?: {
    chatModel: OpenAIChatModel
  }
  clientOptions?: ClientOptions // ClientOptions comes from openai
}
```

**default value**

- defaultModel: { chatModel: 'gpt-3.5-turbo' }
- clientOptions: undefined

**External type**

- ClientOptions: from openai, clientOptions will be passed directly to new OpenAI for creating AI instances

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
