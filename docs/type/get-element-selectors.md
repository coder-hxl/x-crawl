# getElementSelectors

## CrawlOpenAIGetElementSelectorsContentOptions

```ts
export interface CrawlOpenAIGetElementSelectorsContentOptions {
  message: string
  pathMode: 'default' | 'strict'
}
```

- pathMode:
  - strict: The selector's path starts from the root element and points exactly to the target element.
  - default: a selector that can start from any level of elements.

**default value**

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

  - single: indicates that the current HTML fragment only finds one target.
  - multiple: Indicates that the current HTML fragment found multiple targets.
  - none: Not found in the current HTML fragment.
