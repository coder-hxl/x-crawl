#parseElements

## CrawlOpenAIParseElementsContentOptions

```ts
export interface CrawlOpenAIParseElementsContentOptions {
  message: string
}
```

**default value**

- message: undefined

**External type**

- ClientOptions: from openai, clientOptions will be passed directly to new OpenAI for creating AI instances

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
  - single: indicates that the current HTML fragment only finds one target.
  - multiple: Indicates that the current HTML fragment found multiple targets.
  - none: Not found in the current HTML fragment.
