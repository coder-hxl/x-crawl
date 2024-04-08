# parseElements

## CrawlOpenAIParseElementsContentOptions

```ts
export interface CrawlOpenAIParseElementsContentOptions {
  message: string
}
```

**默认值**

- message: undefined

**外部类型**

- ClientOptions：来自于 openai，clientOptions 会直接传给 new OpenAI 用于创建 AI 实例

## CrawlOpenAIParseElementsResult

```ts
export interface CrawlOpenAIParseElementsResult<
  T extends Record<string, string>
> {
  elements: T[]
  type: 'single' | 'multiple' | 'none'
}
```

- type
  - single：说明当前 HTML 片段只找到一个目标。
  - multiple： 说明当前 HTML 片段找到多个目标。
  - none： 没有在当前 HTML 片段找到。
