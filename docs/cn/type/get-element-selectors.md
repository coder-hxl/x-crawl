# getElementSelectors

## CrawlOpenAIGetElementSelectorsContentOptions

```ts
export interface CrawlOpenAIGetElementSelectorsContentOptions {
  message: string
  pathMode: 'default' | 'strict'
}
```

| 参数     | 类型         | 默认值   | 描述                                             |
| -------- | ------------ | -------- | ------------------------------------------------ |
| message  | string       | -        | 你需要 AI 做的操作                               |
| pathMode | 'default' \\| 'strict' | 'default'                                        | 类型 |
|          | strict       | -        | 选择器的路径从根部元素开始, 并精确指向目标元素。 |
|          | default      | -        | 可以从任何级别的元素开始的选择器。               |

## CrawlOpenAIGetElementSelectorsResult

```ts
export interface CrawlOpenAIGetElementSelectorsResult {
  selectors: string
  type: 'single' | 'multiple' | 'none'
}
```

| 参数      | 类型        | 默认值        | 描述                               |
| --------- | ----------- | ------------- | ---------------------------------- |
| selectors | string      | -             | 选择器                             |
| type      | 'single' \\| 'multiple' \\| 'none'                             | -   | 类型 |
|           | single      | -             | 说明当前 HTML 片段只找到一个目标。 |
|           | multiple    | -             | 说明当前 HTML 片段找到多个目标。   |
|           | none        | -             | 说明没有在当前 HTML 片段找到。     |
