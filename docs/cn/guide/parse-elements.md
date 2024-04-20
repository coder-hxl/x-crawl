### 智能按需分析元素 {#interlligent-on-demand-analysis-elements}

无需手动分析 HTML 页面结构再提取所需的元素属性或值。现在只需将 HTML 代码输入到 AI 中，并告知 AI 您想获取哪些元素的信息，AI便会自动分析页面结构，提取出相应的元素属性或值。

使用 AI 应用实例的 [parseElements()](/cn/api/parse-elements#parseelements) 方法。

示例：

```js{23}
import { createCrawlOpenAI } from 'x-crawl'

const crawlOpenAIApp = createCrawlOpenAI({
  clientOptions: { apiKey: '你的 API Key' }
})

const HTMLContent = `
  <div class="scroll-list">
    <div class="list-item">女装带帽卫衣</div>
    <div class="list-item">男装卫衣</div>
    <div class="list-item">女装卫衣</div>
    <div class="list-item">男装带帽卫衣</div>
  </div>
  <div class="scroll-list">
    <div class="list-item">男装纯棉短袖</div>
    <div class="list-item">男装纯棉短袖</div>
    <div class="list-item">女装纯棉短袖</div>
    <div class="list-item">男装冰丝短袖</div>
    <div class="list-item">男装圆领短袖</div>
  </div>
`

crawlOpenAIApp.parseElements(HTMLContent, '获取男装, 并去重').then((res) => {
  console.log(res)
  /*
    res:
    {
      elements: [
        { class: 'list-item', text: '男装卫衣' },
        { class: 'list-item', text: '男装带帽卫衣' },
        { class: 'list-item', text: '男装纯棉短袖' },
        { class: 'list-item', text: '男装冰丝短袖' },
        { class: 'list-item', text: '男装圆领短袖' }
      ],
      type: 'multiple'
    }
  */
})
```

也可以将整个 HTML 传给 AI 帮我们操作，但是会消耗更多 Tokens ，OpenAI 是根据 Tokens 进行收费的。
