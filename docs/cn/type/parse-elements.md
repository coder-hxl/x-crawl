# parseElements

## CrawlOpenAIParseElementsContentOptions

```ts
export interface CrawlOpenAIParseElementsContentOptions {
  message: string
}
```

| 参数    | 类型   | 默认值 | 描述               |
| ------- | ------ | ------ | ------------------ |
| message | string | -      | 你需要 AI 做的操作 |

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

| 参数     | 类型        | 默认值        | 描述                               |
| -------- | ----------- | ------------- | ---------------------------------- |
| elements | T[]         | -             | 拿到的元素                         |
| type     | 'single' \\| 'multiple' \\| 'none'                             | -   | 类型 |
|          | single      | -             | 说明当前 HTML 片段只找到一个目标。 |
|          | multiple    | -             | 说明当前 HTML 片段找到多个目标。   |
|          | none        | -             | 说明没有在当前 HTML 片段找到。     |
