# getElementSelectors

## CrawlOpenAIGetElementSelectorsContentOptions

```ts
export interface CrawlOpenAIGetElementSelectorsContentOptions {
  message: string
  pathMode: 'default' | 'strict'
}
```

- pathMode：
  - strict：选择器的路径从根部元素开始, 并精确指向目标元素。
  - default：可以从任何级别的元素开始的选择器。

**默认值**

- message: undefined
- pathMode: 'default'

## CrawlOpenAIGetElementSelectorsResult

```ts
export interface CrawlOpenAIGetElementSelectorsResult {
  selectors: string
  type: 'single' | 'multiple' | 'none'
}
```

- type

  - single：说明当前 HTML 片段只找到一个目标。
  - multiple： 说明当前 HTML 片段找到多个目标。
  - none： 没有在当前 HTML 片段找到。
