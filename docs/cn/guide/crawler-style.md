# 爬虫风格 {#crawler-style}

不管是传统爬虫方式还是 AI 辅助爬虫 x-crawl 都可以满足您。

x-crawl 由两部分组成：

- 爬虫：由爬虫 API 以及各种功能组成，即使不依靠 AI 也能正常工作。
- AI：目前基于 OpenAI 提供的 AI 大模型，让 AI 简化很多繁琐的操作。

## 传统爬虫 和 AI 辅助爬虫 {#traditional-crawlers-and-ai-assisted-crawlers}

**传统爬虫**

传统爬虫主要依赖于固定的规则或模式来抓取网页数据。它们通常通过识别网页中的特定元素，如类名、标签或结构，来定位和提取所需信息。然而，这种方式的局限性显而易见。一旦网站进行更新，改变了原有的类名、标签或结构，传统爬虫就会因为无法识别新的元素而失效，导致数据抓取失败或错误。在 x-crawl 里就是使用 crawlPage 或 crawlHTML 这两个 API 通过固定规则来抓取网页数据。

**AI 辅助爬虫**

AI 辅助爬虫能够智能地分析和理解网页内容，从而更准确地定位并提取所需信息。通过自然语言处理等技术，它们能够理解网页的语义信息，从而更精确地定位所需数据，即使网站进行了更新，AI 辅助爬虫也能继续有效地抓取数据。

## 示例 {#example}

- 传统爬虫，通过网页中的特定元素获取电影排行榜的电影信息
- 爬虫 + AI ，爬虫搭配 AI 获取电影排行榜的电影信息

::: code-group

```js [AI 辅助爬虫]
import { createCrawl, createCrawlOpenAI } from 'x-crawl'

// 创建爬虫应用
const crawlApp = createCrawl()

// 创建 AI 应用
const crawlOpenAIApp = createCrawlOpenAI({
  clientOptions: { apiKey: process.env['OPENAI_API_KEY'] },
  defaultModel: { chatModel: 'gpt-4-turbo-preview' }
})

// crawlPage 用于爬取页面
crawlApp.crawlPage('https://movie.example.com/chart').then(async (res) => {
  const { page, browser } = res.data

  // 等待元素出现在页面中, 并获取 HTML
  await page.waitForSelector('#wrapper #content .article')
  const targetHTML = await page.$eval(
    '#wrapper #content .article',
    (e) => e.outerHTML
  )

  browser.close()

  // 让 AI 获取电影信息 (描述越详细越好)
  const filmResult = await crawlOpenAIApp.parseElements(
    targetHTML,
    `这是电影列表, 需要获取电影名(name), 封面链接(picture), 简介(info), 评分(score), 
    评论人数(commentsNumber)。使用括号的单词作为属性名`
  )

  console.log(filmResult)
})
```

```js [传统爬虫]
import { createCrawl } from 'x-crawl'

// 创建爬虫应用
const crawlApp = createCrawl()

// crawlPage 用于爬取页面
crawlApp.crawlPage('https://movie.example.com/chart').then(async (res) => {
  const { page, browser } = res.data

  // 等待元素出现在页面中
  await page.waitForSelector('#wrapper #content .article')
  const filmHandleList = await page.$$('#wrapper #content .article table')

  const pendingTask = []
  for (const filmHandle of filmHandleList) {
    // 封面链接(picture)
    const picturePending = filmHandle.$eval('td img', (img) => img.src)
    // 电影名(name)
    const namePending = filmHandle.$eval(
      'td:nth-child(2) a',
      (el) => el.innerText.split(' / ')[0]
    )
    // 简介(info)
    const infoPending = filmHandle.$eval(
      'td:nth-child(2) .pl',
      (el) => el.textContent
    )
    // 评分(score)
    const scorePending = filmHandle.$eval(
      'td:nth-child(2) .star .rating_nums',
      (el) => el.textContent
    )
    // 评论人数(commentsNumber)
    const commentsNumberPending = filmHandle.$eval(
      'td:nth-child(2) .star .pl',
      (el) => el.textContent?.replace(/\(|\)/g, '')
    )

    pendingTask.push([
      namePending,
      picturePending,
      infoPending,
      scorePending,
      commentsNumberPending
    ])
  }

  const filmInfoResult = []
  let i = 0
  for (const item of pendingTask) {
    Promise.all(item).then((res) => {
      // filmInfo 是一个电影信息对象，顺序在前面就决定好了
      const filmInfo = [
        'name',
        'picture',
        'info',
        'score',
        'commentsNumber'
      ].reduce((pre, key, i) => {
        pre[key] = res[i]
        return pre
      }, {})

      // 保存每个电影信息
      filmInfoResult.push(filmInfo)

      // 最后一次的处理
      if (pendingTask.length === ++i) {
        browser.close()

        // 整理，根据数量决定是多还是单
        const filmResult = {
          element: filmInfoResult,
          type: filmInfoResult.length > 1 ? 'multiple' : 'single'
        }

        console.log(filmResult)
      }
    })
  }
})
```

:::

::: details 两个示例最终展示的电影信息

```json
{
  "elements": [
    {
      "name": "老狐狸",
      "picture": "https://img1.exampleio.com/view/photo/s_ratio_poster/public/p2900908599.webp",
      "info": "2023-10-27(东京国际电影节) / 2023-11-24(中国台湾) / 白润音 / 刘冠廷 / 陈慕义 / 刘奕儿 / 门胁麦 / 黄健玮 / 温升豪 / 班铁翔 / 杨丽音 / 傅孟柏 / 高英轩 / 庄益增 / 张再兴 / 许博维 / 管罄 / 钟瑶 / 游珈瑄 / 郑旸恩 / 戴雅芝 / 姜仁 / 萧鸿文...",
      "score": "8.1",
      "commentsNumber": "29211人评价"
    },
    {
      "name": "机器人之梦",
      "picture": "https://img1.exampleio.com/view/photo/s_ratio_poster/public/p2899644068.webp",
      "info": "2023-05-20(戛纳电影节) / 2023-12-06(西班牙) / 2024(中国大陆) / 伊万·拉班达 / 阿尔伯特·特里佛·塞加拉 / 拉法·卡尔沃 / 何塞·加西亚·托斯 / 何塞·路易斯·梅地亚维拉 / 加西埃拉·莫利娜 / 埃斯特·索兰斯 / 西班牙 / 法国 / 巴勃罗·贝格尔...",
      "score": "9.1",
      "commentsNumber": "64650人评价"
    },
    {
      "name": "白日之下",
      "picture": "https://img1.exampleio.com/view/photo/s_ratio_poster/public/p2904961420.webp",
      "info": "2023-06-11(上海国际电影节) / 2023-11-02(中国香港) / 2024-04-12(中国大陆) / 姜大卫 / 余香凝 / 林保怡 / 梁仲恒 / 陈湛文 / 周汉宁 / 梁雍婷 / 龚慈恩 / 宝珮如 / 朱柏谦 / 朱栢康 / 许月湘 / 胡枫 / 鲍起静 / 高翰文 / 彭杏英 / 罗浩铭 / 谭玉瑛...",
      "score": "8.0",
      "commentsNumber": "36540人评价"
    },
    {
      "name": "可怜的东西",
      "picture": "https://img1.exampleio.com/view/photo/s_ratio_poster/public/p2897662939.webp",
      "info": "2023-09-01(威尼斯电影节) / 2023-12-08(美国) / 艾玛·斯通 / 马克·鲁弗洛 / 威廉·达福 / 拉米·尤素夫 / 克里斯托弗·阿波特 / 苏西·本巴 / 杰洛德·卡尔迈克 / 凯瑟琳·亨特 / 薇琪·佩珀代因 / 玛格丽特·库里 / 汉娜·许古拉 / 杰克·巴顿...",
      "score": "7.0",
      "commentsNumber": "130113人评价"
    },
    {
      "name": "完美的日子",
      "picture": "https://img3.exampleio.com/view/photo/s_ratio_poster/public/p2898894527.webp",
      "info": "2023-05-25(戛纳电影节) / 2023-12-21(德国) / 2023-12-22(日本) / 役所广司 / 柄本时生 / 中野有纱 / 山田葵  / 麻生祐未 / 石川小百合 / 三浦友和 / 田中泯 / 大下浩人 / 犬山犬子 / 牧口元美 / 长井短 / 研直子 / 茂吕师冈 / 县森鱼 / 片桐入 / 芹泽兴人...",
      "score": "8.3",
      "commentsNumber": "33562人评价"
    },
    {
      "name": "新威龙杀阵",
      "picture": "https://img1.exampleio.com/view/photo/s_ratio_poster/public/p2905374090.webp",
      "info": "2024-03-08(西南偏南电影节) / 2024-03-21(美国网络) / 杰克·吉伦哈尔 / 康纳·麦格雷戈 / 杰西卡·威廉姆斯 / 比利·马格努森 / 丹妮拉·曼希沃 / 吉米索拉·艾库美罗 / 卢卡斯·盖奇 / 特拉维斯·范·文克 / 达伦·巴内特 / 乔昆姆·德·阿尔梅达...",
      "score": "6.3",
      "commentsNumber": "9980人评价"
    },
    {
      "name": "首尔之春",
      "picture": "https://img1.exampleio.com/view/photo/s_ratio_poster/public/p2905204009.webp",
      "info": "2023-11-22(韩国) / 黄政民 / 郑雨盛 / 李星民 / 朴解浚 / 金成畇 / 朴勋 / 安世镐 / 郑允荷 / 丁海寅 / 南允皓 / 全秀芝 / 韩国 / 金成洙 / 141分钟 / 首尔之春 / 剧情 / 金成洙 Sung-su Kim / 韩语",
      "score": "8.8",
      "commentsNumber": "171858人评价"
    },
    {
      "name": "金手指",
      "picture": "https://img1.exampleio.com/view/photo/s_ratio_poster/public/p2901830629.webp",
      "info": "2023-12-30(中国大陆) / 梁朝伟 / 刘德华 / 蔡卓妍 / 任达华 / 方中信 / 陈家乐 / 白只 / 姜皓文 / 太保 / 钱嘉乐 / 袁咏仪 / 周家怡 / 岑珈其 / 李靖筠 / 吴肇轩 / 柯炜林 / 冯泳贤 / 杜曜宇 / 李建城 / 古永锋 / 中国香港 / 中国大陆 / 庄文强...",
      "score": "6.1",
      "commentsNumber": "135956人评价"
    },
    {
      "name": "美国小说",
      "picture": "https://img9.exampleio.com/view/photo/s_ratio_poster/public/p2902166424.webp",
      "info": "2023-09-08(多伦多国际电影节) / 2023-12-15(美国) / 杰弗里·怀特 / 翠西·艾利斯·罗斯 / 约翰·奥提兹 / 伊萨·雷 / 斯特林·K·布朗 / 埃里卡·亚历山大 / 莱斯利·格塞斯 / 亚当·布罗迪 / 凯斯·大卫 / 迈拉·卢克利希亚·泰勒 / 雷蒙德·安东尼·托马斯...",
      "score": "7.7",
      "commentsNumber": "26223人评价"
    },
    {
      "name": "利益区域",
      "picture": "https://img3.exampleio.com/view/photo/s_ratio_poster/public/p2899514583.webp",
      "info": "2023-05-19(戛纳电影节) / 2023-12-15(美国) / 克里斯蒂安·富里道尔 / 桑德拉·惠勒 / 约翰·卡特豪斯 / 拉尔夫·赫尔福特 / 弗雷娅·克罗伊茨卡姆 / 马克斯·贝克 / 伊摩根·蔻格 / 斯蒂芬妮·佩特罗维茨 / 拉尔夫·齐尔曼 / 玛丽·罗莎·提特言...",
      "score": "7.4",
      "commentsNumber": "24875人评价"
    }
  ],
  "type": "multiple"
}
```

:::

**对比它们提取信息所需的步骤**

::: code-group

```js [AI 辅助爬虫]
const filmResult = await crawlOpenAIApp.parseElements(
  targetHTML,
  `这是电影列表, 需要获取电影名(name), 封面链接(picture), 简介(info), 评分(score), 
  评论人数(commentsNumber)。使用括号的单词作为属性名`
)
```

```js [传统爬虫]
const pendingTask = []
for (const filmHandle of filmHandleList) {
  const picturePending = filmHandle.$eval('td img', (img) => img.src)
  const namePending = filmHandle.$eval(
    'td:nth-child(2) a',
    (el) => el.innerText.split(' / ')[0]
  )
  const infoPending = filmHandle.$eval(
    'td:nth-child(2) .pl',
    (el) => el.textContent
  )
  const scorePending = filmHandle.$eval(
    'td:nth-child(2) .star .rating_nums',
    (el) => el.textContent
  )
  const commentsNumberPending = filmHandle.$eval(
    'td:nth-child(2) .star .pl',
    (el) => el.textContent?.replace(/\(|\)/g, '')
  )

  pendingTask.push([
    namePending,
    picturePending,
    infoPending,
    scorePending,
    commentsNumberPending
  ])
}

const filmInfoResult = []
let i = 0
for (const item of pendingTask) {
  Promise.all(item).then((res) => {
    const filmInfo =
      ['name', 'picture', 'info', 'score', 'commentsNumber'].reduce <
      any >
      ((pre, key, i) => {
        pre[key] = res[i]
        return pre
      },
      {})

    filmInfoResult.push(filmInfo)

    if (pendingTask.length === ++i) {
      const filmResult = {
        element: filmInfoResult,
        type: filmInfoResult.length > 1 ? 'multiple' : 'single'
      }
    }
  })
}
```

:::

- `传统爬虫` 需要依靠 `固定的类名` 和 `各种繁琐的操作` 来获取数据，如果网站更新频繁，那么网站更新后类名或结构的改变可能导致传统的爬虫抓取策略失效，需要重新获取最新的类名以及更新各种操作才能爬取数据。
- `AI 辅助爬虫` 只需要 `一段话` 就能够更加高效、智能和便捷获取到所需的数据。甚至可以将整个 HTML 传给 AI 帮我们操作，由于网站内容更加复杂需要更准确描述要取的位置，并且会消耗大量的 Tokens ，但即使网站后续的更新导致类名或结构发生改变也能正常爬到数据，因为我们可以不再依赖于固定的类名或结构来定位并提取所需信息，而是让 AI 理解并解析网页的语义信息，从而更高效、智能和便捷提取所需数据。

> 如果所需的内容更多，那么传统爬虫所做的步骤也就更多，而 AI 辅助爬虫只需增加几句话就能搞定，并且不用担心网站更新后的类名和结构是否会发生改动。

## 该怎么选 {#how-to-choose}

传统爬虫主要依赖于预设的规则或模式来抓取网页数据，它们对于结构稳定、规则明确的网站表现出色。然而，随着网络技术的飞速发展和网站结构的频繁更新，传统爬虫面临着越来越多的挑战。一旦网站结构发生变化，传统爬虫通常需要重新调整规则，甚至可能导致抓取失败，这大大降低了其效率和准确性。

相比之下，AI 辅助爬虫结合了人工智能技术，能够智能地解析网页结构和语义，自适应网站的变化。通过机器学习和自然语言处理等技术，AI 辅助爬虫可以识别并学习网页中的特征，从而更准确地定位和提取所需数据。这使得 AI 辅助爬虫在面对复杂多变的网站结构时，能够保持高效的抓取能力。

总的来说，传统爬虫和 AI 辅助爬虫各有其适用场景。对于结构稳定、规则明确的网站，传统爬虫可能是一个更经济、更直接的选择。然而，对于结构复杂、频繁更新的网站，AI 辅助爬虫则展现出了更高的灵活性和准确性优势。在选择时，我们需要根据具体的抓取需求、网站特点以及资源投入等因素进行综合考虑。
