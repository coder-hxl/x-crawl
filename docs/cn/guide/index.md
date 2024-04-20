# 简介 {#introduction}

## 什么是 x-crawl ? {#waht-is-x-crawl?}

x-crawl 是一个灵活的 Node.js AI 辅助爬虫库。灵活的使用方式和强大的 AI 辅助功能，使爬虫工作变得更加高效、智能和便捷。

它由两部分组成：

- 爬虫：由爬虫 API 以及各种功能组成，即使不依靠 AI 也能正常工作。
- AI：目前基于 OpenAI 提供的 AI 大模型，让 AI 简化很多繁琐的操作。

> 如果您觉得 x-crawl 对您有所帮助，或者您喜欢 x-crawl ，可以在 GitHub 上给 [x-crawl 存储库](https://github.com/coder-hxl/x-crawl) 点个 star 。您的支持是我们持续改进的动力！感谢您的支持！

## 特征 {#features}

- **🤖 AI 辅助** - 强大的 AI 辅助功能，使爬虫工作变得更加高效、智能和便捷。
- **🖋️ 写法灵活** - 单个爬取 API 都适配多种配置，每种配置方式都各有千秋。
- **⚙️ 多种用途** - 支持爬动态页面、静态页面、接口数据以及文件数据。
- **⚒️ 控制页面** - 爬取动态页面支持自动化操作、键盘输入、事件操作等。
- **👀 设备指纹** - 零配置或自定义配置，避免指纹识别从不同位置识别并跟踪我们。
- **🔥 异步同步** - 无需切换爬取 API 即可进行异步或同步的爬取模式。
- **⏱️ 间隔爬取** - 无间隔、固定间隔以及随机间隔，决定是否高并发爬取。
- **🔄 失败重试** - 自定义重试次数，避免因短暂的问题而造成爬取失败。
- **➡️ 轮换代理** - 搭配失败重试，自定义错误次数以及 HTTP 状态码自动轮换代理。
- **🚀 优先队列** - 根据单个爬取目标的优先级可以优先于其他目标提前爬取。
- **🧾 爬取信息** - 可控的爬取信息，会在终端输出彩色字符串信息。
- **🦾 TypeScript** - 拥有类型，通过泛型实现完整的类型。

## AI 辅助爬虫 {#ai-assisted-crawler}

随着网络技术的日新月异，网站更新变得愈发频繁，而类名或结构的改变往往给依赖这些元素的爬虫带来不小的挑战。在这样的背景下，结合 AI 技术的爬虫成为了应对这一挑战的有力武器。

首先，网站更新后类名或结构的改变可能导致传统的爬虫抓取策略失效。这是因为爬虫通常依赖于固定的类名或结构来定位并提取所需信息。一旦这些元素发生变化，爬虫就可能无法准确找到所需数据，从而影响数据抓取的效果和准确性。

然而，结合 AI 技术的爬虫则能够更好地应对这种变化。AI 还可以通过自然语言处理等技术，理解并解析网页的语义信息，从而更准确地提取所需数据。

综上所述，结合 AI 技术的爬虫能够更好地应对网站更新后类名或结构改变的问题。

## 示例 {#example}

- 爬虫和 AI 结合，让爬虫和 AI 获取高评分度假屋的房屋图片
- 爬虫和 AI 结合，让爬虫和 AI 获取豆瓣电影排行榜的电影信息

### 示例1 {#example1}

**爬虫和 AI 结合，让爬虫和 AI 获取高评分度假屋的房屋图片**

```js
import { createCrawl, createCrawlOpenAI } from 'x-crawl'

// 创建爬虫应用
const crawlApp = createCrawl({
  maxRetry: 3,
  intervalTime: { max: 2000, min: 1000 }
})

// 创建 AI 应用
const crawlOpenAIApp = createCrawlOpenAI({
  clientOptions: { apiKey: process.env['OPENAI_API_KEY'] },
  defaultModel: { chatModel: 'gpt-4-turbo-preview' }
})

// crawlPage 用于爬取页面
crawlApp.crawlPage('https://www.airbnb.cn/s/select_homes').then(async (res) => {
  const { page, browser } = res.data

  // 等待元素出现在页面中, 并获取 HTML
  const targetSelector = '[data-tracking-id="TOP_REVIEWED_LISTINGS"]'
  await page.waitForSelector(targetSelector)
  const highlyHTML = await page.$eval(targetSelector, (el) => el.innerHTML)

  // 让 AI 获取图片链接, 并去重 (描述越详细越好)
  const srcResult = await crawlOpenAIApp.parseElements(
    highlyHTML,
    '获取图片链接, 不要source里面的, 并去重'
  )

  browser.close()

  // crawlFile 用于爬取文件资源
  crawlApp.crawlFile({
    targets: srcResult.elements.map((item) => item.src),
    storeDirs: './upload'
  })
})
```

过程：

![](/example.gif)

搭配 AI 爬到的高评分度假屋图片:

![](/example.png)

::: details 查看 AI 需要处理的 HTML

为了方便观看，这里进行了格式化

```html
<div data-pageslot="true" class="c1yo0219 dir dir-ltr">
  <div class="c121p4jg dir dir-ltr" data-reactroot="">
    <div
      aria-describedby="carousel-description"
      aria-labelledby="carousel-label"
      class="s7q4c1d rd7fm2t dir dir-ltr"
      role="group"
    >
      <div class="hztl681 dir dir-ltr" id="carousel-label">
        <div class="htgr43m dir dir-ltr">
          <div class=" dir dir-ltr">
            <h2 class="h1436ahv dir dir-ltr">威奇托的高评分度假屋</h2>
            <p class="bqwnmiz swd4c9o dir dir-ltr">
              这些房源在位置、干净卫生等方面获得房客的一致好评。
            </p>
          </div>
        </div>
      </div>
      <div class="dbldy2s dir dir-ltr" id="carousel-description">
        显示 12 项中的 4 项
      </div>
      <div class="c18vjgz6 dir dir-ltr">
        <div class="cfexzqx dir dir-ltr">
          <span class="a8jt5op dir dir-ltr" aria-live="polite"
            >第 1 页，共 3 页</span
          >
          <div aria-hidden="false" class="_1uytoza">
            <span class="a8jt5op dir dir-ltr">第 1 页，共 3 页</span>
            <div dir="ltr">
              <div aria-hidden="true" class="_1l1vk8w">1 / 3</div>
            </div>
            <div class="_jro6t0">
              <button
                aria-label="上一张"
                type="button"
                class="l1ovpqvx c1e0qvzg dir dir-ltr"
              >
                <span class="ifnd39z dir dir-ltr"
                  ><span class="_krjbj">_</span
                  ><svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 32 32"
                    style="display:block;fill:none;height:12px;width:12px;stroke:currentColor;stroke-width:4;overflow:visible"
                    aria-hidden="true"
                    role="presentation"
                    focusable="false"
                  >
                    <path
                      fill="none"
                      d="M20 28 8.7 16.7a1 1 0 0 1 0-1.4L20 4"
                    ></path></svg
                ></span></button
              ><span class="_pog3hg"></span
              ><button
                aria-label="下一张"
                type="button"
                class="l1ovpqvx c1e0qvzg dir dir-ltr"
              >
                <span class="ifnd39z dir dir-ltr"
                  ><span class="_krjbj">_</span
                  ><svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 32 32"
                    style="display:block;fill:none;height:12px;width:12px;stroke:currentColor;stroke-width:4;overflow:visible"
                    aria-hidden="true"
                    role="presentation"
                    focusable="false"
                  >
                    <path
                      fill="none"
                      d="m12 4 11.3 11.3a1 1 0 0 1 0 1.4L12 28"
                    ></path></svg
                ></span>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="s1yvqyx7 dir dir-ltr">
        <div class="c14whb16 dir dir-ltr">
          <div aria-hidden="false" class=" dir dir-ltr">
            <a
              aria-label="农家乐 ｜ Mulvane"
              class="cbkobxh dir dir-ltr"
              href="/s/homes?dynamic_product_ids%5B%5D=45937791&amp;omni_page_id=36021&amp;place_id=ChIJLRh_0mrbuocRPj3TdL_VlpM"
              target="_blank"
              rel="noreferrer"
              data-nosnippet="true"
              ><picture class="p1h9elqm dir dir-ltr"
                ><source
                  class="s1yu4uxa dir dir-ltr"
                  srcset="
                    https://z1.muscache.cn/im/pictures/miso/Hosting-45937791/original/c67d32ed-21eb-4066-8cef-650dcd45bada.jpeg?  im_w=320 1x,
                    https://z1.muscache.cn/im/pictures/miso/Hosting-45937791/original/c67d32ed-21eb-4066-8cef-650dcd45bada.jpeg?  im_w=720 2x
                  "
                  media="(min-width: 744px)" />
                <source
                  class="s1yu4uxa dir dir-ltr"
                  srcset="
                    https://z1.muscache.cn/im/pictures/miso/Hosting-45937791/original/c67d32ed-21eb-4066-8cef-650dcd45bada.jpeg?  im_w=480 1x,
                    https://z1.muscache.cn/im/pictures/miso/Hosting-45937791/original/c67d32ed-21eb-4066-8cef-650dcd45bada.jpeg?  im_w=960 2x
                  "
                  media="(min-width: 375px)" />
                <source
                  class="s1yu4uxa dir dir-ltr"
                  srcset="
                    https://z1.muscache.cn/im/pictures/miso/Hosting-45937791/original/c67d32ed-21eb-4066-8cef-650dcd45bada.jpeg?  im_w=320 1x,
                    https://z1.muscache.cn/im/pictures/miso/Hosting-45937791/original/c67d32ed-21eb-4066-8cef-650dcd45bada.jpeg?  im_w=720 2x
                  " />
                <img
                  src="https://z1.muscache.cn/im/pictures/miso/Hosting-45937791/original/c67d32ed-21eb-4066-8cef-650dcd45bada.jpeg? aki_policy=large"
                  loading="lazy"
                  alt=""
                  class="iotvkpj dir dir-ltr"
              /></picture>
              <div class="b14un2cd g12fuxtb f9iqyua dir dir-ltr">
                <span class="a8jt5op dir dir-ltr">房客推荐</span>
                <div aria-hidden="true" class="t1qa5xaj dir dir-ltr">
                  房客推荐
                </div>
              </div>
              <div class="cbheav2 dir dir-ltr">
                <h3
                  class="t1jojoys n1nue62c dir dir-ltr"
                  data-testid="listing-card-title"
                >
                  农家乐 ｜ Mulvane
                </h3>
                <span class="r4a59j5 dir dir-ltr"
                  ><span class="a8jt5op dir dir-ltr"
                    >平均评分 4.98 分（满分 5 分），共 168 条评价</span
                  ><svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 32 32"
                    style="display:block;height:12px;width:12px;fill:currentColor"
                    aria-hidden="true"
                    role="presentation"
                    focusable="false"
                  >
                    <path
                      fill-rule="evenodd"
                      d="m15.1 1.58-4.13 8.88-9.86 1.27a1 1 0 0 0-.54 1.74l7.3 6.57-1.97 9.85a1 1 0 0 0 1.48 1.06l8.62-5 8.63 5a1 1   0 0 0 1.48-1.06l-1.97-9.85 7.3-6.57a1 1 0 0 0-.55-1.73l-9.86-1.28-4.12-8.88a1 1 0 0 0-1.82 0z"
                    ></path></svg
                  ><span aria-hidden="true" class="ru0q88m dir dir-ltr"
                    >4.98 (168)</span
                  ></span
                >
                <p
                  class="n1nue62c f1m3zhlw t6mzqp7 dir dir-ltr"
                  data-testid="listing-card-name"
                >
                  带私人热水浴缸和早餐的小木屋度假屋3
                </p>
                <p class="s4ddf4l n1nue62c f1m3zhlw dir dir-ltr">
                  Stay in one of our three private cabins, each equipped with
                  its own two person hot tub on the back deck for you to enjoy
                  under the stars. You will also have breakfast delivered to
                  your cabin at the time you choose in the morning(s). Each
                  cabin offers a pillow-top Queen bed, mini-fridge, microwave,
                  coffee maker, thermostat-controlled gas fireplace, A/C unit,
                  shower, cable TV, and a DVD player. All of that situated on
                  24+ beautiful acres complete with a pond and walking paths
                  through the woods.
                </p>
                <p class="n1nue62c f1m3zhlw dir dir-ltr">8月8日至15日</p>
                <div class="cyjufhz p8bhhzl f1m3zhlw dir dir-ltr">
                  <span aria-hidden="true" class="piy2wzv dir dir-ltr"
                    >￥1,170</span
                  ><span aria-hidden="true">&nbsp;\x3C!-- -->/晚</span
                  ><span class="s14ffc1j dir dir-ltr">每晚 ￥1,170</span>
                </div>
              </div></a
            >
          </div>
          <div aria-hidden="false" class="sjvtr3d dir dir-ltr">
            <a
              aria-label="Loft ｜ 威奇托（Wichita）"
              class="cbkobxh dir dir-ltr"
              href="/s/homes?dynamic_product_ids%5B%5D=29753115&amp;omni_page_id=36021&amp;place_id=ChIJLRh_0mrbuocRPj3TdL_VlpM"
              target="_blank"
              rel="noreferrer"
              data-nosnippet="true"
              ><picture class="p1h9elqm dir dir-ltr"
                ><source
                  class="s1yu4uxa dir dir-ltr"
                  srcset="
                    https://z1.muscache.cn/im/pictures/52d375d3-5e54-444b-8186-15e61a592d9a.jpg?im_w=320 1x,
                    https://z1.muscache.cn/im/pictures/52d375d3-5e54-444b-8186-15e61a592d9a.jpg?im_w=720 2x
                  "
                  media="(min-width: 744px)" />
                <source
                  class="s1yu4uxa dir dir-ltr"
                  srcset="
                    https://z1.muscache.cn/im/pictures/52d375d3-5e54-444b-8186-15e61a592d9a.jpg?im_w=480 1x,
                    https://z1.muscache.cn/im/pictures/52d375d3-5e54-444b-8186-15e61a592d9a.jpg?im_w=960 2x
                  "
                  media="(min-width: 375px)" />
                <source
                  class="s1yu4uxa dir dir-ltr"
                  srcset="
                    https://z1.muscache.cn/im/pictures/52d375d3-5e54-444b-8186-15e61a592d9a.jpg?im_w=320 1x,
                    https://z1.muscache.cn/im/pictures/52d375d3-5e54-444b-8186-15e61a592d9a.jpg?im_w=720 2x
                  " />
                <img
                  src="https://z1.muscache.cn/im/pictures/52d375d3-5e54-444b-8186-15e61a592d9a.jpg?aki_policy=large"
                  loading="lazy"
                  alt=""
                  class="iotvkpj dir dir-ltr"
              /></picture>
              <div class="b14un2cd g12fuxtb f9iqyua dir dir-ltr">
                <span class="a8jt5op dir dir-ltr">房客推荐</span>
                <div aria-hidden="true" class="t1qa5xaj dir dir-ltr">
                  房客推荐
                </div>
              </div>
              <div class="cbheav2 dir dir-ltr">
                <h3
                  class="t1jojoys n1nue62c dir dir-ltr"
                  data-testid="listing-card-title"
                >
                  Loft ｜ 威奇托（Wichita）
                </h3>
                <span class="r4a59j5 dir dir-ltr"
                  ><span class="a8jt5op dir dir-ltr"
                    >平均评分 4.9 分（满分 5 分），共 710 条评价</span
                  ><svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 32 32"
                    style="display:block;height:12px;width:12px;fill:currentColor"
                    aria-hidden="true"
                    role="presentation"
                    focusable="false"
                  >
                    <path
                      fill-rule="evenodd"
                      d="m15.1 1.58-4.13 8.88-9.86 1.27a1 1 0 0 0-.54 1.74l7.3 6.57-1.97 9.85a1 1 0 0 0 1.48 1.06l8.62-5 8.63 5a1 1   0 0 0 1.48-1.06l-1.97-9.85 7.3-6.57a1 1 0 0 0-.55-1.73l-9.86-1.28-4.12-8.88a1 1 0 0 0-1.82 0z"
                    ></path></svg
                  ><span aria-hidden="true" class="ru0q88m dir dir-ltr"
                    >4.9 (710)</span
                  ></span
                >
                <p
                  class="n1nue62c f1m3zhlw t6mzqp7 dir dir-ltr"
                  data-testid="listing-card-name"
                >
                  Wichita市中心现代、明亮的乐趣阁楼
                </p>
                <p class="s4ddf4l n1nue62c f1m3zhlw dir dir-ltr">
                  Welcome to the heart of downtown Wichita, KS, affectionately
                  referred to as the ICT by locals. Parking right out front, on
                  Douglas Ave in front of the private entrance. A gorgeous airy
                  loft with 10’ ceilings and a huge skylight tunnel. Two
                  bedrooms with full bathrooms, fully stocked kitchen with all
                  appliances. Full sized washer and dryer...all supplies
                  provided. Enjoy the private rooftop patio, hop on the free
                  trolly service, The Q, or walk to a plethora of restaurants,
                  bars or attractions.
                </p>
                <p class="n1nue62c f1m3zhlw dir dir-ltr">10月31日至11月7日</p>
                <div class="cyjufhz p8bhhzl f1m3zhlw dir dir-ltr">
                  <span aria-hidden="true" class="piy2wzv dir dir-ltr"
                    >￥862</span
                  ><span aria-hidden="true">&nbsp;\x3C!-- -->/晚</span
                  ><span class="s14ffc1j dir dir-ltr">每晚 ￥862</span>
                </div>
              </div></a
            >
          </div>
          <div aria-hidden="false" class="sjvtr3d dir dir-ltr">
            <a
              aria-label="民居 ｜ 威奇托（Wichita）"
              class="cbkobxh dir dir-ltr"
              href="/s/homes?dynamic_product_ids%5B%5D=26764727&amp;omni_page_id=36021&amp;place_id=ChIJLRh_0mrbuocRPj3TdL_VlpM"
              target="_blank"
              rel="noreferrer"
              data-nosnippet="true"
              ><picture class="p1h9elqm dir dir-ltr"
                ><source
                  class="s1yu4uxa dir dir-ltr"
                  srcset="
                    https://z1.muscache.cn/im/pictures/4ce87a7c-cbce-4e6e-97ea-38840518e1c4.jpg?im_w=320 1x,
                    https://z1.muscache.cn/im/pictures/4ce87a7c-cbce-4e6e-97ea-38840518e1c4.jpg?im_w=720 2x
                  "
                  media="(min-width: 744px)" />
                <source
                  class="s1yu4uxa dir dir-ltr"
                  srcset="
                    https://z1.muscache.cn/im/pictures/4ce87a7c-cbce-4e6e-97ea-38840518e1c4.jpg?im_w=480 1x,
                    https://z1.muscache.cn/im/pictures/4ce87a7c-cbce-4e6e-97ea-38840518e1c4.jpg?im_w=960 2x
                  "
                  media="(min-width: 375px)" />
                <source
                  class="s1yu4uxa dir dir-ltr"
                  srcset="
                    https://z1.muscache.cn/im/pictures/4ce87a7c-cbce-4e6e-97ea-38840518e1c4.jpg?im_w=320 1x,
                    https://z1.muscache.cn/im/pictures/4ce87a7c-cbce-4e6e-97ea-38840518e1c4.jpg?im_w=720 2x
                  " />
                <img
                  src="https://z1.muscache.cn/im/pictures/4ce87a7c-cbce-4e6e-97ea-38840518e1c4.jpg?aki_policy=large"
                  loading="lazy"
                  alt=""
                  class="iotvkpj dir dir-ltr"
              /></picture>
              <div class="b14un2cd g12fuxtb f9iqyua dir dir-ltr">
                <span class="a8jt5op dir dir-ltr">房客推荐</span>
                <div aria-hidden="true" class="t1qa5xaj dir dir-ltr">
                  房客推荐
                </div>
              </div>
              <div class="cbheav2 dir dir-ltr">
                <h3
                  class="t1jojoys n1nue62c dir dir-ltr"
                  data-testid="listing-card-title"
                >
                  民居 ｜ 威奇托（Wichita）
                </h3>
                <span class="r4a59j5 dir dir-ltr"
                  ><span class="a8jt5op dir dir-ltr"
                    >平均评分 4.92 分（满分 5 分），共 250 条评价</span
                  ><svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 32 32"
                    style="display:block;height:12px;width:12px;fill:currentColor"
                    aria-hidden="true"
                    role="presentation"
                    focusable="false"
                  >
                    <path
                      fill-rule="evenodd"
                      d="m15.1 1.58-4.13 8.88-9.86 1.27a1 1 0 0 0-.54 1.74l7.3 6.57-1.97 9.85a1 1 0 0 0 1.48 1.06l8.62-5 8.63 5a1 1   0 0 0 1.48-1.06l-1.97-9.85 7.3-6.57a1 1 0 0 0-.55-1.73l-9.86-1.28-4.12-8.88a1 1 0 0 0-1.82 0z"
                    ></path></svg
                  ><span aria-hidden="true" class="ru0q88m dir dir-ltr"
                    >4.92 (250)</span
                  ></span
                >
                <p
                  class="n1nue62c f1m3zhlw t6mzqp7 dir dir-ltr"
                  data-testid="listing-card-name"
                >
                  整套带复古飞机主题的小房子
                </p>
                <p class="s4ddf4l n1nue62c f1m3zhlw dir dir-ltr">
                  With a nod to Wichita's rich aviation history and focus on
                  care and quality in every detail; enjoy our fun and
                  interesting little house! Wichita has it all: shopping, zoo,
                  bike path with bike rentals, breweries, coffee shops, amazing
                  restaurants, music and sport venues, public parks, food
                  trucks, museums, and thriving businesses - we think you will
                  find our space executive ready, vacation prepared, and
                  comfortable! We hope you enjoy this amazing city and perfect
                  little home as much as we do!
                </p>
                <p class="n1nue62c f1m3zhlw dir dir-ltr">1月18日至25日</p>
                <div class="cyjufhz p8bhhzl f1m3zhlw dir dir-ltr">
                  <span aria-hidden="true" class="piy2wzv dir dir-ltr"
                    >￥709</span
                  ><span aria-hidden="true">&nbsp;\x3C!-- -->/晚</span
                  ><span class="s14ffc1j dir dir-ltr">每晚 ￥709</span>
                </div>
              </div></a
            >
          </div>
          <div aria-hidden="false" class="sjvtr3d dir dir-ltr">
            <a
              aria-label="民居 ｜ 威奇托（Wichita）"
              class="cbkobxh dir dir-ltr"
              href="/s/homes?dynamic_product_ids%5B%5D=545779178592886885&amp;omni_page_id=36021&amp; place_id=ChIJLRh_0mrbuocRPj3TdL_VlpM"
              target="_blank"
              rel="noreferrer"
              data-nosnippet="true"
              ><picture class="p1h9elqm dir dir-ltr"
                ><source
                  class="s1yu4uxa dir dir-ltr"
                  srcset="
                    https://z1.muscache.cn/im/pictures/3f6b8ce1-df9b-4624-94e0-b63ec54b7fe4.jpg?im_w=320 1x,
                    https://z1.muscache.cn/im/pictures/3f6b8ce1-df9b-4624-94e0-b63ec54b7fe4.jpg?im_w=720 2x
                  "
                  media="(min-width: 744px)" />
                <source
                  class="s1yu4uxa dir dir-ltr"
                  srcset="
                    https://z1.muscache.cn/im/pictures/3f6b8ce1-df9b-4624-94e0-b63ec54b7fe4.jpg?im_w=480 1x,
                    https://z1.muscache.cn/im/pictures/3f6b8ce1-df9b-4624-94e0-b63ec54b7fe4.jpg?im_w=960 2x
                  "
                  media="(min-width: 375px)" />
                <source
                  class="s1yu4uxa dir dir-ltr"
                  srcset="
                    https://z1.muscache.cn/im/pictures/3f6b8ce1-df9b-4624-94e0-b63ec54b7fe4.jpg?im_w=320 1x,
                    https://z1.muscache.cn/im/pictures/3f6b8ce1-df9b-4624-94e0-b63ec54b7fe4.jpg?im_w=720 2x
                  " />
                <img
                  src="https://z1.muscache.cn/im/pictures/3f6b8ce1-df9b-4624-94e0-b63ec54b7fe4.jpg?aki_policy=large"
                  loading="lazy"
                  alt=""
                  class="iotvkpj dir dir-ltr"
              /></picture>
              <div class="b14un2cd g12fuxtb f9iqyua dir dir-ltr">
                <span class="a8jt5op dir dir-ltr">房客推荐</span>
                <div aria-hidden="true" class="t1qa5xaj dir dir-ltr">
                  房客推荐
                </div>
              </div>
              <div class="cbheav2 dir dir-ltr">
                <h3
                  class="t1jojoys n1nue62c dir dir-ltr"
                  data-testid="listing-card-title"
                >
                  民居 ｜ 威奇托（Wichita）
                </h3>
                <span class="r4a59j5 dir dir-ltr"
                  ><span class="a8jt5op dir dir-ltr"
                    >平均评分 4.89 分（满分 5 分），共 292 条评价</span
                  ><svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 32 32"
                    style="display:block;height:12px;width:12px;fill:currentColor"
                    aria-hidden="true"
                    role="presentation"
                    focusable="false"
                  >
                    <path
                      fill-rule="evenodd"
                      d="m15.1 1.58-4.13 8.88-9.86 1.27a1 1 0 0 0-.54 1.74l7.3 6.57-1.97 9.85a1 1 0 0 0 1.48 1.06l8.62-5 8.63 5a1 1   0 0 0 1.48-1.06l-1.97-9.85 7.3-6.57a1 1 0 0 0-.55-1.73l-9.86-1.28-4.12-8.88a1 1 0 0 0-1.82 0z"
                    ></path></svg
                  ><span aria-hidden="true" class="ru0q88m dir dir-ltr"
                    >4.89 (292)</span
                  ></span
                >
                <p
                  class="n1nue62c f1m3zhlw t6mzqp7 dir dir-ltr"
                  data-testid="listing-card-name"
                >
                  舒适的双★卧室★步行至河畔
                </p>
                <p class="s4ddf4l n1nue62c f1m3zhlw dir dir-ltr">
                  We offer Full kitchen with essentials, ideal for families who
                  like to cook at home and like to save!\n*Special note, Home is
                  available for booking 7/15-8/4, 2024. Must book for entire
                  time for great discount! Message me if interested. \n\n5
                  minutes from I-35 highway, 6 min to WSU, 12 minutes from ICT
                  Airport, five minutes to Interest Bank Arena! \n\nThis
                  beautiful home is within walking distance of Arkansas River,
                  trails, parks. \nWalk and see amazing wildlife on trail right
                  by Arkansas River.
                </p>
                <p class="n1nue62c f1m3zhlw dir dir-ltr">9月18日至25日</p>
                <div class="cyjufhz p8bhhzl f1m3zhlw dir dir-ltr">
                  <span aria-hidden="true" class="piy2wzv dir dir-ltr"
                    >￥546</span
                  ><span aria-hidden="true">&nbsp;\x3C!-- -->/晚</span
                  ><span class="s14ffc1j dir dir-ltr">每晚 ￥546</span>
                </div>
              </div></a
            >
          </div>
          <div aria-hidden="true" class=" dir dir-ltr">
            <a
              aria-label="民居 ｜ 威奇托（Wichita）"
              class="cbkobxh dir dir-ltr"
              href="/s/homes?dynamic_product_ids%5B%5D=661881998531696630&amp;omni_page_id=36021&amp; place_id=ChIJLRh_0mrbuocRPj3TdL_VlpM"
              target="_blank"
              rel="noreferrer"
              data-nosnippet="true"
              tabindex="-1"
              ><picture class="p1h9elqm dir dir-ltr"
                ><source
                  class="s1yu4uxa dir dir-ltr"
                  srcset="
                    https://z1.muscache.cn/im/pictures/miso/Hosting-661881998531696630/original/c7f7769f-e56c-4d55-8e74-06fdaf3e048d. jpeg?im_w=320 1x,
                    https://z1.muscache.cn/im/pictures/miso/Hosting-661881998531696630/original/c7f7769f-e56c-4d55-8e74-06fdaf3e048d. jpeg?im_w=720 2x
                  "
                  media="(min-width: 744px)" />
                <source
                  class="s1yu4uxa dir dir-ltr"
                  srcset="
                    https://z1.muscache.cn/im/pictures/miso/Hosting-661881998531696630/original/c7f7769f-e56c-4d55-8e74-06fdaf3e048d. jpeg?im_w=480 1x,
                    https://z1.muscache.cn/im/pictures/miso/Hosting-661881998531696630/original/c7f7769f-e56c-4d55-8e74-06fdaf3e048d. jpeg?im_w=960 2x
                  "
                  media="(min-width: 375px)" />
                <source
                  class="s1yu4uxa dir dir-ltr"
                  srcset="
                    https://z1.muscache.cn/im/pictures/miso/Hosting-661881998531696630/original/c7f7769f-e56c-4d55-8e74-06fdaf3e048d. jpeg?im_w=320 1x,
                    https://z1.muscache.cn/im/pictures/miso/Hosting-661881998531696630/original/c7f7769f-e56c-4d55-8e74-06fdaf3e048d. jpeg?im_w=720 2x
                  " />
                <img
                  src="https://z1.muscache.cn/im/pictures/miso/Hosting-661881998531696630/original/ c7f7769f-e56c-4d55-8e74-06fdaf3e048d.jpeg?aki_policy=large"
                  loading="lazy"
                  alt=""
                  class="iotvkpj dir dir-ltr"
              /></picture>
              <div class="b14un2cd g12fuxtb f9iqyua dir dir-ltr">
                <span class="a8jt5op dir dir-ltr">房客推荐</span>
                <div aria-hidden="true" class="t1qa5xaj dir dir-ltr">
                  房客推荐
                </div>
              </div>
              <div class="cbheav2 dir dir-ltr">
                <h3
                  class="t1jojoys n1nue62c dir dir-ltr"
                  data-testid="listing-card-title"
                >
                  民居 ｜ 威奇托（Wichita）
                </h3>
                <span class="r4a59j5 dir dir-ltr"
                  ><span class="a8jt5op dir dir-ltr"
                    >平均评分 4.88 分（满分 5 分），共 128 条评价</span
                  ><svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 32 32"
                    style="display:block;height:12px;width:12px;fill:currentColor"
                    aria-hidden="true"
                    role="presentation"
                    focusable="false"
                  >
                    <path
                      fill-rule="evenodd"
                      d="m15.1 1.58-4.13 8.88-9.86 1.27a1 1 0 0 0-.54 1.74l7.3 6.57-1.97 9.85a1 1 0 0 0 1.48 1.06l8.62-5 8.63 5a1 1   0 0 0 1.48-1.06l-1.97-9.85 7.3-6.57a1 1 0 0 0-.55-1.73l-9.86-1.28-4.12-8.88a1 1 0 0 0-1.82 0z"
                    ></path></svg
                  ><span aria-hidden="true" class="ru0q88m dir dir-ltr"
                    >4.88 (128)</span
                  ></span
                >
                <p
                  class="n1nue62c f1m3zhlw t6mzqp7 dir dir-ltr"
                  data-testid="listing-card-name"
                >
                  历史悠久的德拉诺区休闲度假胜地
                </p>
                <p class="s4ddf4l n1nue62c f1m3zhlw dir dir-ltr">
                  Enjoy this spacious, relaxing home, centrally located, 5
                  minutes from downtown, 8 minutes from the ICT
                  airport.\n\nGuests will enjoy the main floor of this two story
                  house-turned-duplex, which includes two bedrooms with queen
                  beds, one full bath off the master bedroom, cozy living room,
                  and dining area with kitchenette.\n\nEnjoy the relaxing front
                  porch with a swing and comfortable chairs in this historic
                  neighborhood.\n\nThere are two dogs in the upstairs apartment
                  that may make minimal noise.
                </p>
                <p class="n1nue62c f1m3zhlw dir dir-ltr">5月26日至6月2日</p>
                <div class="cyjufhz p8bhhzl f1m3zhlw dir dir-ltr">
                  <span aria-hidden="true" class="piy2wzv dir dir-ltr"
                    >￥743</span
                  ><span aria-hidden="true">&nbsp;\x3C!-- -->/晚</span
                  ><span class="s14ffc1j dir dir-ltr">每晚 ￥743</span>
                </div>
              </div></a
            >
          </div>
          <div aria-hidden="true" class="sjvtr3d dir dir-ltr">
            <a
              aria-label="乡村小屋 ｜ Clearwater"
              class="cbkobxh dir dir-ltr"
              href="/s/homes?dynamic_product_ids%5B%5D=50620715&amp;omni_page_id=36021&amp;place_id=ChIJLRh_0mrbuocRPj3TdL_VlpM"
              target="_blank"
              rel="noreferrer"
              data-nosnippet="true"
              tabindex="-1"
              ><picture class="p1h9elqm dir dir-ltr"
                ><source
                  class="s1yu4uxa dir dir-ltr"
                  srcset="
                    https://z1.muscache.cn/im/pictures/miso/Hosting-50620715/original/650ba8af-3f77-41ce-8c93-0cf502a8656d.jpeg?  im_w=320 1x,
                    https://z1.muscache.cn/im/pictures/miso/Hosting-50620715/original/650ba8af-3f77-41ce-8c93-0cf502a8656d.jpeg?  im_w=720 2x
                  "
                  media="(min-width: 744px)" />
                <source
                  class="s1yu4uxa dir dir-ltr"
                  srcset="
                    https://z1.muscache.cn/im/pictures/miso/Hosting-50620715/original/650ba8af-3f77-41ce-8c93-0cf502a8656d.jpeg?  im_w=480 1x,
                    https://z1.muscache.cn/im/pictures/miso/Hosting-50620715/original/650ba8af-3f77-41ce-8c93-0cf502a8656d.jpeg?  im_w=960 2x
                  "
                  media="(min-width: 375px)" />
                <source
                  class="s1yu4uxa dir dir-ltr"
                  srcset="
                    https://z1.muscache.cn/im/pictures/miso/Hosting-50620715/original/650ba8af-3f77-41ce-8c93-0cf502a8656d.jpeg?  im_w=320 1x,
                    https://z1.muscache.cn/im/pictures/miso/Hosting-50620715/original/650ba8af-3f77-41ce-8c93-0cf502a8656d.jpeg?  im_w=720 2x
                  " />
                <img
                  src="https://z1.muscache.cn/im/pictures/miso/Hosting-50620715/original/650ba8af-3f77-41ce-8c93-0cf502a8656d.jpeg? aki_policy=large"
                  loading="lazy"
                  alt=""
                  class="iotvkpj dir dir-ltr"
              /></picture>
              <div class="b14un2cd g12fuxtb f9iqyua dir dir-ltr">
                <span class="a8jt5op dir dir-ltr">房客推荐</span>
                <div aria-hidden="true" class="t1qa5xaj dir dir-ltr">
                  房客推荐
                </div>
              </div>
              <div class="cbheav2 dir dir-ltr">
                <h3
                  class="t1jojoys n1nue62c dir dir-ltr"
                  data-testid="listing-card-title"
                >
                  乡村小屋 ｜ Clearwater
                </h3>
                <span class="r4a59j5 dir dir-ltr"
                  ><span class="a8jt5op dir dir-ltr"
                    >平均评分 4.99 分（满分 5 分），共 137 条评价</span
                  ><svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 32 32"
                    style="display:block;height:12px;width:12px;fill:currentColor"
                    aria-hidden="true"
                    role="presentation"
                    focusable="false"
                  >
                    <path
                      fill-rule="evenodd"
                      d="m15.1 1.58-4.13 8.88-9.86 1.27a1 1 0 0 0-.54 1.74l7.3 6.57-1.97 9.85a1 1 0 0 0 1.48 1.06l8.62-5 8.63 5a1 1   0 0 0 1.48-1.06l-1.97-9.85 7.3-6.57a1 1 0 0 0-.55-1.73l-9.86-1.28-4.12-8.88a1 1 0 0 0-1.82 0z"
                    ></path></svg
                  ><span aria-hidden="true" class="ru0q88m dir dir-ltr"
                    >4.99 (137)</span
                  ></span
                >
                <p
                  class="n1nue62c f1m3zhlw t6mzqp7 dir dir-ltr"
                  data-testid="listing-card-name"
                >
                  全新装修乡村小屋乡村度假屋
                </p>
                <p class="s4ddf4l n1nue62c f1m3zhlw dir dir-ltr">
                  Clearview Cottage is a quiet country home just 13 miles from
                  Eisenhower Airport and 20 minutes from downtown Wichita. This
                  fully renovated home has one bedroom and one bathroom and is
                  ideal for romantic getaways and business travelers. Outdoor
                  spaces include a large front porch to watch the sunset and
                  explore the stars at night. Located on a working farm, you
                  will experience the sights and sounds of rural life and
                  perhaps find some farm fresh eggs to enjoy!
                </p>
                <p class="n1nue62c f1m3zhlw dir dir-ltr">1月19日至26日</p>
                <div class="cyjufhz p8bhhzl f1m3zhlw dir dir-ltr">
                  <span aria-hidden="true" class="piy2wzv dir dir-ltr"
                    >￥535</span
                  ><span aria-hidden="true">&nbsp;\x3C!-- -->/晚</span
                  ><span class="s14ffc1j dir dir-ltr">每晚 ￥535</span>
                </div>
              </div></a
            >
          </div>
          <div aria-hidden="true" class="sjvtr3d dir dir-ltr">
            <a
              aria-label="联排别墅 ｜ 威奇托（Wichita）"
              class="cbkobxh dir dir-ltr"
              href="/s/homes?dynamic_product_ids%5B%5D=40405228&amp;omni_page_id=36021&amp;place_id=ChIJLRh_0mrbuocRPj3TdL_VlpM"
              target="_blank"
              rel="noreferrer"
              data-nosnippet="true"
              tabindex="-1"
              ><picture class="p1h9elqm dir dir-ltr"
                ><source
                  class="s1yu4uxa dir dir-ltr"
                  srcset="
                    https://z1.muscache.cn/im/pictures/b899a44f-e5dd-4ee8-9116-13a5c79fb3d6.jpg?im_w=320 1x,
                    https://z1.muscache.cn/im/pictures/b899a44f-e5dd-4ee8-9116-13a5c79fb3d6.jpg?im_w=720 2x
                  "
                  media="(min-width: 744px)" />
                <source
                  class="s1yu4uxa dir dir-ltr"
                  srcset="
                    https://z1.muscache.cn/im/pictures/b899a44f-e5dd-4ee8-9116-13a5c79fb3d6.jpg?im_w=480 1x,
                    https://z1.muscache.cn/im/pictures/b899a44f-e5dd-4ee8-9116-13a5c79fb3d6.jpg?im_w=960 2x
                  "
                  media="(min-width: 375px)" />
                <source
                  class="s1yu4uxa dir dir-ltr"
                  srcset="
                    https://z1.muscache.cn/im/pictures/b899a44f-e5dd-4ee8-9116-13a5c79fb3d6.jpg?im_w=320 1x,
                    https://z1.muscache.cn/im/pictures/b899a44f-e5dd-4ee8-9116-13a5c79fb3d6.jpg?im_w=720 2x
                  " />
                <img
                  src="https://z1.muscache.cn/im/pictures/b899a44f-e5dd-4ee8-9116-13a5c79fb3d6.jpg?aki_policy=large"
                  loading="lazy"
                  alt=""
                  class="iotvkpj dir dir-ltr"
              /></picture>
              <div class="b14un2cd g12fuxtb f9iqyua dir dir-ltr">
                <span class="a8jt5op dir dir-ltr">房客推荐</span>
                <div aria-hidden="true" class="t1qa5xaj dir dir-ltr">
                  房客推荐
                </div>
              </div>
              <div class="cbheav2 dir dir-ltr">
                <h3
                  class="t1jojoys n1nue62c dir dir-ltr"
                  data-testid="listing-card-title"
                >
                  联排别墅 ｜ 威奇托（Wichita）
                </h3>
                <span class="r4a59j5 dir dir-ltr"
                  ><span class="a8jt5op dir dir-ltr"
                    >平均评分 4.96 分（满分 5 分），共 132 条评价</span
                  ><svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 32 32"
                    style="display:block;height:12px;width:12px;fill:currentColor"
                    aria-hidden="true"
                    role="presentation"
                    focusable="false"
                  >
                    <path
                      fill-rule="evenodd"
                      d="m15.1 1.58-4.13 8.88-9.86 1.27a1 1 0 0 0-.54 1.74l7.3 6.57-1.97 9.85a1 1 0 0 0 1.48 1.06l8.62-5 8.63 5a1 1   0 0 0 1.48-1.06l-1.97-9.85 7.3-6.57a1 1 0 0 0-.55-1.73l-9.86-1.28-4.12-8.88a1 1 0 0 0-1.82 0z"
                    ></path></svg
                  ><span aria-hidden="true" class="ru0q88m dir dir-ltr"
                    >4.96 (132)</span
                  ></span
                >
                <p
                  class="n1nue62c f1m3zhlw t6mzqp7 dir dir-ltr"
                  data-testid="listing-card-name"
                >
                  Boho Bliss in College Hill by Indigo Moon Homes
                </p>
                <p class="s4ddf4l n1nue62c f1m3zhlw dir dir-ltr">
                  Introducing the newest Indigo Moon Property! This charming
                  twin home is professionally designed and staged by Indigo Moon
                  Homes and is walking distance to all of College Hill's most
                  popular eateries, shopping, and bars. Wesley Med Center and
                  WSU are both a short drive away and the complimentary Q-line
                  trolley is two blocks away. From fine linens and furnishings
                  to a fully equipped kitchen, we strive to make your stay
                  enjoyable!
                </p>
                <p class="n1nue62c f1m3zhlw dir dir-ltr">5月19日至26日</p>
                <div class="cyjufhz p8bhhzl f1m3zhlw dir dir-ltr">
                  <span aria-hidden="true" class="piy2wzv dir dir-ltr"
                    >￥645</span
                  ><span aria-hidden="true">&nbsp;\x3C!-- -->/晚</span
                  ><span class="s14ffc1j dir dir-ltr">每晚 ￥645</span>
                </div>
              </div></a
            >
          </div>
          <div aria-hidden="true" class="sjvtr3d dir dir-ltr">
            <a
              aria-label="民居 ｜ 威奇托（Wichita）"
              class="cbkobxh dir dir-ltr"
              href="/s/homes?dynamic_product_ids%5B%5D=51309116&amp;omni_page_id=36021&amp;place_id=ChIJLRh_0mrbuocRPj3TdL_VlpM"
              target="_blank"
              rel="noreferrer"
              data-nosnippet="true"
              tabindex="-1"
              ><picture class="p1h9elqm dir dir-ltr"
                ><source
                  class="s1yu4uxa dir dir-ltr"
                  srcset="
                    https://z1.muscache.cn/im/pictures/a2820abe-20bc-4898-a0ee-17f3c974158b.jpg?im_w=320 1x,
                    https://z1.muscache.cn/im/pictures/a2820abe-20bc-4898-a0ee-17f3c974158b.jpg?im_w=720 2x
                  "
                  media="(min-width: 744px)" />
                <source
                  class="s1yu4uxa dir dir-ltr"
                  srcset="
                    https://z1.muscache.cn/im/pictures/a2820abe-20bc-4898-a0ee-17f3c974158b.jpg?im_w=480 1x,
                    https://z1.muscache.cn/im/pictures/a2820abe-20bc-4898-a0ee-17f3c974158b.jpg?im_w=960 2x
                  "
                  media="(min-width: 375px)" />
                <source
                  class="s1yu4uxa dir dir-ltr"
                  srcset="
                    https://z1.muscache.cn/im/pictures/a2820abe-20bc-4898-a0ee-17f3c974158b.jpg?im_w=320 1x,
                    https://z1.muscache.cn/im/pictures/a2820abe-20bc-4898-a0ee-17f3c974158b.jpg?im_w=720 2x
                  " />
                <img
                  src="https://z1.muscache.cn/im/pictures/a2820abe-20bc-4898-a0ee-17f3c974158b.jpg?aki_policy=large"
                  loading="lazy"
                  alt=""
                  class="iotvkpj dir dir-ltr"
              /></picture>
              <div class="b14un2cd g12fuxtb f9iqyua dir dir-ltr">
                <span class="a8jt5op dir dir-ltr">房客推荐</span>
                <div aria-hidden="true" class="t1qa5xaj dir dir-ltr">
                  房客推荐
                </div>
              </div>
              <div class="cbheav2 dir dir-ltr">
                <h3
                  class="t1jojoys n1nue62c dir dir-ltr"
                  data-testid="listing-card-title"
                >
                  民居 ｜ 威奇托（Wichita）
                </h3>
                <span class="r4a59j5 dir dir-ltr"
                  ><span class="a8jt5op dir dir-ltr"
                    >平均评分 4.93 分（满分 5 分），共 256 条评价</span
                  ><svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 32 32"
                    style="display:block;height:12px;width:12px;fill:currentColor"
                    aria-hidden="true"
                    role="presentation"
                    focusable="false"
                  >
                    <path
                      fill-rule="evenodd"
                      d="m15.1 1.58-4.13 8.88-9.86 1.27a1 1 0 0 0-.54 1.74l7.3 6.57-1.97 9.85a1 1 0 0 0 1.48 1.06l8.62-5 8.63 5a1 1   0 0 0 1.48-1.06l-1.97-9.85 7.3-6.57a1 1 0 0 0-.55-1.73l-9.86-1.28-4.12-8.88a1 1 0 0 0-1.82 0z"
                    ></path></svg
                  ><span aria-hidden="true" class="ru0q88m dir dir-ltr"
                    >4.93 (256)</span
                  ></span
                >
                <p
                  class="n1nue62c f1m3zhlw t6mzqp7 dir dir-ltr"
                  data-testid="listing-card-name"
                >
                  舒适房源，距离市中心5分钟车程
                </p>
                <p class="s4ddf4l n1nue62c f1m3zhlw dir dir-ltr">
                  Enjoy a curated, comfort oriented experience at this
                  centrally-located Wichita home. Minutes from Friends and
                  Newman University, less than 10 minutes from the airport and
                  downtown. \n\nYou’ll love the spacious kitchen access,
                  comfortable living space, and beautiful bedrooms with queen
                  size beds and black out curtains for optimal
                  rest.\n\nContactless check in. You’ll receive a custom check
                  in code the day of your arrival.
                </p>
                <p class="n1nue62c f1m3zhlw dir dir-ltr">10月14日至21日</p>
                <div class="cyjufhz p8bhhzl f1m3zhlw dir dir-ltr">
                  <span aria-hidden="true" class="piy2wzv dir dir-ltr"
                    >￥1,068</span
                  ><span aria-hidden="true">&nbsp;\x3C!-- -->/晚</span
                  ><span class="s14ffc1j dir dir-ltr">每晚 ￥1,068</span>
                </div>
              </div></a
            >
          </div>
          <div aria-hidden="true" class=" dir dir-ltr">
            <a
              aria-label="客房 ｜ 威奇托（Wichita）"
              class="cbkobxh dir dir-ltr"
              href="/s/homes?dynamic_product_ids%5B%5D=21364903&amp;omni_page_id=36021&amp;place_id=ChIJLRh_0mrbuocRPj3TdL_VlpM"
              target="_blank"
              rel="noreferrer"
              data-nosnippet="true"
              tabindex="-1"
              ><picture class="p1h9elqm dir dir-ltr"
                ><source
                  class="s1yu4uxa dir dir-ltr"
                  srcset="
                    https://z1.muscache.cn/im/pictures/1f55a7c1-021f-4eb5-8e35-6473e16d7fef.jpg?im_w=320 1x,
                    https://z1.muscache.cn/im/pictures/1f55a7c1-021f-4eb5-8e35-6473e16d7fef.jpg?im_w=720 2x
                  "
                  media="(min-width: 744px)" />
                <source
                  class="s1yu4uxa dir dir-ltr"
                  srcset="
                    https://z1.muscache.cn/im/pictures/1f55a7c1-021f-4eb5-8e35-6473e16d7fef.jpg?im_w=480 1x,
                    https://z1.muscache.cn/im/pictures/1f55a7c1-021f-4eb5-8e35-6473e16d7fef.jpg?im_w=960 2x
                  "
                  media="(min-width: 375px)" />
                <source
                  class="s1yu4uxa dir dir-ltr"
                  srcset="
                    https://z1.muscache.cn/im/pictures/1f55a7c1-021f-4eb5-8e35-6473e16d7fef.jpg?im_w=320 1x,
                    https://z1.muscache.cn/im/pictures/1f55a7c1-021f-4eb5-8e35-6473e16d7fef.jpg?im_w=720 2x
                  " />
                <img
                  src="https://z1.muscache.cn/im/pictures/1f55a7c1-021f-4eb5-8e35-6473e16d7fef.jpg?aki_policy=large"
                  loading="lazy"
                  alt=""
                  class="iotvkpj dir dir-ltr"
              /></picture>
              <div class="b14un2cd g12fuxtb f9iqyua dir dir-ltr">
                <span class="a8jt5op dir dir-ltr">房客推荐</span>
                <div aria-hidden="true" class="t1qa5xaj dir dir-ltr">
                  房客推荐
                </div>
              </div>
              <div class="cbheav2 dir dir-ltr">
                <h3
                  class="t1jojoys n1nue62c dir dir-ltr"
                  data-testid="listing-card-title"
                >
                  客房 ｜ 威奇托（Wichita）
                </h3>
                <span class="r4a59j5 dir dir-ltr"
                  ><span class="a8jt5op dir dir-ltr"
                    >平均评分 4.99 分（满分 5 分），共 100 条评价</span
                  ><svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 32 32"
                    style="display:block;height:12px;width:12px;fill:currentColor"
                    aria-hidden="true"
                    role="presentation"
                    focusable="false"
                  >
                    <path
                      fill-rule="evenodd"
                      d="m15.1 1.58-4.13 8.88-9.86 1.27a1 1 0 0 0-.54 1.74l7.3 6.57-1.97 9.85a1 1 0 0 0 1.48 1.06l8.62-5 8.63 5a1 1   0 0 0 1.48-1.06l-1.97-9.85 7.3-6.57a1 1 0 0 0-.55-1.73l-9.86-1.28-4.12-8.88a1 1 0 0 0-1.82 0z"
                    ></path></svg
                  ><span aria-hidden="true" class="ru0q88m dir dir-ltr"
                    >4.99 (100)</span
                  ></span
                >
                <p
                  class="n1nue62c f1m3zhlw t6mzqp7 dir dir-ltr"
                  data-testid="listing-card-name"
                >
                  树屋
                </p>
                <p class="s4ddf4l n1nue62c f1m3zhlw dir dir-ltr">
                  Quaint ‘treehouse’, guesthouse over a garage. Includes 3/4
                  bath with walk-in shower, washer and dryer, kitchen/living
                  space, and deck that overlooks the backyard. Walking distance
                  to all of Delano, Riverfront Stadium and Keeper of the
                  Plains.\nLess than a half mile from Wichita’s best slice of
                  Pizza at Picasso’s, best dive bar The Shamrock with live music
                  on weekends, and many more local treasures.
                </p>
                <p class="n1nue62c f1m3zhlw dir dir-ltr">6月25日至7月2日</p>
                <div class="cyjufhz p8bhhzl f1m3zhlw dir dir-ltr">
                  <span aria-hidden="true" class="piy2wzv dir dir-ltr"
                    >￥683</span
                  ><span aria-hidden="true">&nbsp;\x3C!-- -->/晚</span
                  ><span class="s14ffc1j dir dir-ltr">每晚 ￥683</span>
                </div>
              </div></a
            >
          </div>
          <div aria-hidden="true" class="sjvtr3d dir dir-ltr">
            <a
              aria-label="袖珍小屋 ｜ 威奇托（Wichita）"
              class="cbkobxh dir dir-ltr"
              href="/s/homes?dynamic_product_ids%5B%5D=24893823&amp;omni_page_id=36021&amp;place_id=ChIJLRh_0mrbuocRPj3TdL_VlpM"
              target="_blank"
              rel="noreferrer"
              data-nosnippet="true"
              tabindex="-1"
              ><picture class="p1h9elqm dir dir-ltr"
                ><source
                  class="s1yu4uxa dir dir-ltr"
                  srcset="
                    https://z1.muscache.cn/im/pictures/5205dac7-dd2a-4f91-8027-a4c0e52b4fae.jpg?im_w=320 1x,
                    https://z1.muscache.cn/im/pictures/5205dac7-dd2a-4f91-8027-a4c0e52b4fae.jpg?im_w=720 2x
                  "
                  media="(min-width: 744px)" />
                <source
                  class="s1yu4uxa dir dir-ltr"
                  srcset="
                    https://z1.muscache.cn/im/pictures/5205dac7-dd2a-4f91-8027-a4c0e52b4fae.jpg?im_w=480 1x,
                    https://z1.muscache.cn/im/pictures/5205dac7-dd2a-4f91-8027-a4c0e52b4fae.jpg?im_w=960 2x
                  "
                  media="(min-width: 375px)" />
                <source
                  class="s1yu4uxa dir dir-ltr"
                  srcset="
                    https://z1.muscache.cn/im/pictures/5205dac7-dd2a-4f91-8027-a4c0e52b4fae.jpg?im_w=320 1x,
                    https://z1.muscache.cn/im/pictures/5205dac7-dd2a-4f91-8027-a4c0e52b4fae.jpg?im_w=720 2x
                  " />
                <img
                  src="https://z1.muscache.cn/im/pictures/5205dac7-dd2a-4f91-8027-a4c0e52b4fae.jpg?aki_policy=large"
                  loading="lazy"
                  alt=""
                  class="iotvkpj dir dir-ltr"
              /></picture>
              <div class="b14un2cd movpp6a f9iqyua dir dir-ltr">
                <span class="a8jt5op dir dir-ltr">超赞房东</span>
                <div aria-hidden="true" class="t1qa5xaj dir dir-ltr">
                  超赞房东
                </div>
              </div>
              <div class="cbheav2 dir dir-ltr">
                <h3
                  class="t1jojoys n1nue62c dir dir-ltr"
                  data-testid="listing-card-title"
                >
                  袖珍小屋 ｜ 威奇托（Wichita）
                </h3>
                <span class="r4a59j5 dir dir-ltr"
                  ><span class="a8jt5op dir dir-ltr"
                    >平均评分 4.87 分（满分 5 分），共 800 条评价</span
                  ><svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 32 32"
                    style="display:block;height:12px;width:12px;fill:currentColor"
                    aria-hidden="true"
                    role="presentation"
                    focusable="false"
                  >
                    <path
                      fill-rule="evenodd"
                      d="m15.1 1.58-4.13 8.88-9.86 1.27a1 1 0 0 0-.54 1.74l7.3 6.57-1.97 9.85a1 1 0 0 0 1.48 1.06l8.62-5 8.63 5a1 1   0 0 0 1.48-1.06l-1.97-9.85 7.3-6.57a1 1 0 0 0-.55-1.73l-9.86-1.28-4.12-8.88a1 1 0 0 0-1.82 0z"
                    ></path></svg
                  ><span aria-hidden="true" class="ru0q88m dir dir-ltr"
                    >4.87 (800)</span
                  ></span
                >
                <p
                  class="n1nue62c f1m3zhlw t6mzqp7 dir dir-ltr"
                  data-testid="listing-card-name"
                >
                  小巷小房子：距离老城区5个街区！
                </p>
                <p class="s4ddf4l n1nue62c f1m3zhlw dir dir-ltr">
                  Our "Little House on the Alley" is a relaxing escape from the
                  hotel scene or sharing a room in someone's home. The little
                  house is all yours! At only 320 square feet you can move
                  around from room to room quite easily, but at the same time it
                  has everything you need for a weekend getaway or a short term
                  stay. And the best part? You are just 5 blocks to Old Town
                  Entertainment District!
                </p>
                <p class="n1nue62c f1m3zhlw dir dir-ltr">8月1日至8日</p>
                <div class="cyjufhz p8bhhzl f1m3zhlw dir dir-ltr">
                  <span aria-hidden="true" class="piy2wzv dir dir-ltr"
                    >￥589</span
                  ><span aria-hidden="true">&nbsp;\x3C!-- -->/晚</span
                  ><span class="s14ffc1j dir dir-ltr">每晚 ￥589</span>
                </div>
              </div></a
            >
          </div>
          <div aria-hidden="true" class="sjvtr3d dir dir-ltr">
            <a
              aria-label="民居 ｜ 威奇托（Wichita）"
              class="cbkobxh dir dir-ltr"
              href="/s/homes?dynamic_product_ids%5B%5D=792178978933830608&amp;omni_page_id=36021&amp; place_id=ChIJLRh_0mrbuocRPj3TdL_VlpM"
              target="_blank"
              rel="noreferrer"
              data-nosnippet="true"
              tabindex="-1"
              ><picture class="p1h9elqm dir dir-ltr"
                ><source
                  class="s1yu4uxa dir dir-ltr"
                  srcset="
                    https://z1.muscache.cn/im/pictures/miso/Hosting-792178978933830608/original/75a7613c-e435-45fb-9db4-e4163921254b. jpeg?im_w=320 1x,
                    https://z1.muscache.cn/im/pictures/miso/Hosting-792178978933830608/original/75a7613c-e435-45fb-9db4-e4163921254b. jpeg?im_w=720 2x
                  "
                  media="(min-width: 744px)" />
                <source
                  class="s1yu4uxa dir dir-ltr"
                  srcset="
                    https://z1.muscache.cn/im/pictures/miso/Hosting-792178978933830608/original/75a7613c-e435-45fb-9db4-e4163921254b. jpeg?im_w=480 1x,
                    https://z1.muscache.cn/im/pictures/miso/Hosting-792178978933830608/original/75a7613c-e435-45fb-9db4-e4163921254b. jpeg?im_w=960 2x
                  "
                  media="(min-width: 375px)" />
                <source
                  class="s1yu4uxa dir dir-ltr"
                  srcset="
                    https://z1.muscache.cn/im/pictures/miso/Hosting-792178978933830608/original/75a7613c-e435-45fb-9db4-e4163921254b. jpeg?im_w=320 1x,
                    https://z1.muscache.cn/im/pictures/miso/Hosting-792178978933830608/original/75a7613c-e435-45fb-9db4-e4163921254b. jpeg?im_w=720 2x
                  " />
                <img
                  src="https://z1.muscache.cn/im/pictures/miso/Hosting-792178978933830608/original/ 75a7613c-e435-45fb-9db4-e4163921254b.jpeg?aki_policy=large"
                  loading="lazy"
                  alt=""
                  class="iotvkpj dir dir-ltr"
              /></picture>
              <div class="b14un2cd g12fuxtb f9iqyua dir dir-ltr">
                <span class="a8jt5op dir dir-ltr">房客推荐</span>
                <div aria-hidden="true" class="t1qa5xaj dir dir-ltr">
                  房客推荐
                </div>
              </div>
              <div class="cbheav2 dir dir-ltr">
                <h3
                  class="t1jojoys n1nue62c dir dir-ltr"
                  data-testid="listing-card-title"
                >
                  民居 ｜ 威奇托（Wichita）
                </h3>
                <span class="r4a59j5 dir dir-ltr"
                  ><span class="a8jt5op dir dir-ltr"
                    >平均评分 4.88 分（满分 5 分），共 102 条评价</span
                  ><svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 32 32"
                    style="display:block;height:12px;width:12px;fill:currentColor"
                    aria-hidden="true"
                    role="presentation"
                    focusable="false"
                  >
                    <path
                      fill-rule="evenodd"
                      d="m15.1 1.58-4.13 8.88-9.86 1.27a1 1 0 0 0-.54 1.74l7.3 6.57-1.97 9.85a1 1 0 0 0 1.48 1.06l8.62-5 8.63 5a1 1   0 0 0 1.48-1.06l-1.97-9.85 7.3-6.57a1 1 0 0 0-.55-1.73l-9.86-1.28-4.12-8.88a1 1 0 0 0-1.82 0z"
                    ></path></svg
                  ><span aria-hidden="true" class="ru0q88m dir dir-ltr"
                    >4.88 (102)</span
                  ></span
                >
                <p
                  class="n1nue62c f1m3zhlw t6mzqp7 dir dir-ltr"
                  data-testid="listing-card-name"
                >
                  位于威奇塔（ Wichita ）中心的舒适房源
                </p>
                <p class="s4ddf4l n1nue62c f1m3zhlw dir dir-ltr">
                  Beautiful cozy home in the heart of Wichita in a quiet
                  neighborhood. This home is moments away from Wesley Hospital,
                  popular restaurants, bars, and grocery stores. This home is
                  fully furnished with washer and dryer and all appliances,
                  equipped with the fastest fiber internet. Pet friendly. Fenced
                  backyard for the 4 legged children. Our goal is to accommodate
                  our guest to the fullest.
                </p>
                <p class="n1nue62c f1m3zhlw dir dir-ltr">3月16日至23日</p>
                <div class="cyjufhz p8bhhzl f1m3zhlw dir dir-ltr">
                  <span aria-hidden="true" class="piy2wzv dir dir-ltr"
                    >￥1,094</span
                  ><span aria-hidden="true">&nbsp;\x3C!-- -->/晚</span
                  ><span class="s14ffc1j dir dir-ltr">每晚 ￥1,094</span>
                </div>
              </div></a
            >
          </div>
          <div aria-hidden="true" class="sjvtr3d dir dir-ltr">
            <a
              aria-label="民居 ｜ 威奇托（Wichita）"
              class="cbkobxh dir dir-ltr"
              href="/s/homes?dynamic_product_ids%5B%5D=32114722&amp;omni_page_id=36021&amp;place_id=ChIJLRh_0mrbuocRPj3TdL_VlpM"
              target="_blank"
              rel="noreferrer"
              data-nosnippet="true"
              tabindex="-1"
              ><picture class="p1h9elqm dir dir-ltr"
                ><source
                  class="s1yu4uxa dir dir-ltr"
                  srcset="
                    https://z1.muscache.cn/im/pictures/5e755fa0-74a5-400c-b33d-427e56f84330.jpg?im_w=320 1x,
                    https://z1.muscache.cn/im/pictures/5e755fa0-74a5-400c-b33d-427e56f84330.jpg?im_w=720 2x
                  "
                  media="(min-width: 744px)" />
                <source
                  class="s1yu4uxa dir dir-ltr"
                  srcset="
                    https://z1.muscache.cn/im/pictures/5e755fa0-74a5-400c-b33d-427e56f84330.jpg?im_w=480 1x,
                    https://z1.muscache.cn/im/pictures/5e755fa0-74a5-400c-b33d-427e56f84330.jpg?im_w=960 2x
                  "
                  media="(min-width: 375px)" />
                <source
                  class="s1yu4uxa dir dir-ltr"
                  srcset="
                    https://z1.muscache.cn/im/pictures/5e755fa0-74a5-400c-b33d-427e56f84330.jpg?im_w=320 1x,
                    https://z1.muscache.cn/im/pictures/5e755fa0-74a5-400c-b33d-427e56f84330.jpg?im_w=720 2x
                  " />
                <img
                  src="https://z1.muscache.cn/im/pictures/5e755fa0-74a5-400c-b33d-427e56f84330.jpg?aki_policy=large"
                  loading="lazy"
                  alt=""
                  class="iotvkpj dir dir-ltr"
              /></picture>
              <div class="b14un2cd g12fuxtb f9iqyua dir dir-ltr">
                <span class="a8jt5op dir dir-ltr">房客推荐</span>
                <div aria-hidden="true" class="t1qa5xaj dir dir-ltr">
                  房客推荐
                </div>
              </div>
              <div class="cbheav2 dir dir-ltr">
                <h3
                  class="t1jojoys n1nue62c dir dir-ltr"
                  data-testid="listing-card-title"
                >
                  民居 ｜ 威奇托（Wichita）
                </h3>
                <span class="r4a59j5 dir dir-ltr"
                  ><span class="a8jt5op dir dir-ltr"
                    >平均评分 4.99 分（满分 5 分），共 153 条评价</span
                  ><svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 32 32"
                    style="display:block;height:12px;width:12px;fill:currentColor"
                    aria-hidden="true"
                    role="presentation"
                    focusable="false"
                  >
                    <path
                      fill-rule="evenodd"
                      d="m15.1 1.58-4.13 8.88-9.86 1.27a1 1 0 0 0-.54 1.74l7.3 6.57-1.97 9.85a1 1 0 0 0 1.48 1.06l8.62-5 8.63 5a1 1   0 0 0 1.48-1.06l-1.97-9.85 7.3-6.57a1 1 0 0 0-.55-1.73l-9.86-1.28-4.12-8.88a1 1 0 0 0-1.82 0z"
                    ></path></svg
                  ><span aria-hidden="true" class="ru0q88m dir dir-ltr"
                    >4.99 (153)</span
                  ></span
                >
                <p
                  class="n1nue62c f1m3zhlw t6mzqp7 dir dir-ltr"
                  data-testid="listing-card-name"
                >
                  ICT Farmhouse-Charming Two Bedroom Home
                </p>
                <p class="s4ddf4l n1nue62c f1m3zhlw dir dir-ltr">
                  Welcome to the ICT Farmhouse! (ICT=Wichita in Airline Lingo)
                  This charming, newly remodeled two bedroom home is located on
                  the western edge of historic Delano Neighborhood. Its
                  proximity to the Downtown District, Century II Convention
                  Center &amp; many wedding venues makes it the perfect place to
                  stay for business or pleasure!
                </p>
                <p class="n1nue62c f1m3zhlw dir dir-ltr">4月28日至5月5日</p>
                <div class="cyjufhz p8bhhzl f1m3zhlw dir dir-ltr">
                  <span aria-hidden="true" class="piy2wzv dir dir-ltr"
                    >￥670</span
                  ><span aria-hidden="true">&nbsp;\x3C!-- -->/晚</span
                  ><span class="s14ffc1j dir dir-ltr">每晚 ￥670</span>
                </div>
              </div></a
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
```

:::

::: details 查看 AI 返回的 srcResult (房屋图片链接)

```json
{
  "elements": [
    {
      "src": "https://z1.muscache.cn/im/pictures/miso/Hosting-45937791/original/c67d32ed-21eb-4066-8cef-650dcd45bada.jpeg?im_w=720"
    },
    {
      "src": "https://z1.muscache.cn/im/pictures/df3493cf-39b2-46cc-9e85-7ef186980f25.jpg?im_w=720"
    },
    {
      "src": "https://z1.muscache.cn/im/pictures/52d375d3-5e54-444b-8186-15e61a592d9a.jpg?im_w=720"
    },
    {
      "src": "https://z1.muscache.cn/im/pictures/4ce87a7c-cbce-4e6e-97ea-38840518e1c4.jpg?im_w=720"
    },
    {
      "src": "https://z1.muscache.cn/im/pictures/miso/Hosting-661881998531696630/original/c7f7769f-e56c-4d55-8e74-06fdaf3e048d.jpeg?im_w=720"
    },
    {
      "src": "https://z1.muscache.cn/im/pictures/miso/Hosting-50620715/original/650ba8af-3f77-41ce-8c93-0cf502a8656d.jpeg?im_w=720"
    },
    {
      "src": "https://z1.muscache.cn/im/pictures/b899a44f-e5dd-4ee8-9116-13a5c79fb3d6.jpg?im_w=720"
    },
    {
      "src": "https://z1.muscache.cn/im/pictures/a2820abe-20bc-4898-a0ee-17f3c974158b.jpg?im_w=720"
    },
    {
      "src": "https://z1.muscache.cn/im/pictures/1f55a7c1-021f-4eb5-8e35-6473e16d7fef.jpg?im_w=720"
    },
    {
      "src": "https://z1.muscache.cn/im/pictures/5205dac7-dd2a-4f91-8027-a4c0e52b4fae.jpg?im_w=720"
    },
    {
      "src": "https://z1.muscache.cn/im/pictures/miso/Hosting-792178978933830608/original/75a7613c-e435-45fb-9db4-e4163921254b.jpeg?im_w=720"
    },
    {
      "src": "https://z1.muscache.cn/im/pictures/bafaacfa-1644-4a3b-9165-bcd831924cc6.jpg?im_w=720"
    }
  ],
  "type": "multiple"
}
```

:::

---

### 示例2 {#example2}

**爬虫和 AI 结合，让爬虫和 AI 获取豆瓣电影排行榜的电影信息**

```js
import { createCrawl, createCrawlOpenAI } from 'x-crawl'

// 创建爬虫应用
const crawlApp = createCrawl()

// 创建 AI 应用
const crawlOpenAIApp = createCrawlOpenAI({
  clientOptions: { apiKey: process.env['OPENAI_API_KEY'] },
  defaultModel: { chatModel: 'gpt-4-turbo-preview' }
})

// crawlPage 用于爬取页面
crawlApp.crawlPage('https://movie.douban.com/chart').then(async (res) => {
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
    `这是电影列表, 需要获取电影名(name), 封面链接(picture), 
    简介(info), 评分(score), 评论人数(commentsNumber)。使用括号的单词作为属性名`
  )

  console.log(filmResult)
})
```

::: details 查看 AI 需要处理的 HTML

为了方便观看，这里进行了格式化

```html
<div class="article">
  \n \n
  <h2>豆瓣新片榜 · · · · · ·</h2>
  \n
  <div class="indent">
    \n \n\n\n\n\n\n
    <div class="">
      \n
      <p class="ul first"></p>
      \n
      <table width="100%" class="">
        \n
        <tbody>
          <tr class="item">
            \n
            <td width="100" valign="top">
              \n \n\n
              <a
                class="nbg"
                href="https://movie.douban.com/subject/35611467/"
                title="老狐狸"
                >\n
                <img
                  src="https://img1.doubanio.com/view/photo/s_ratio_poster/public/p2900908599.webp"
                  width="75"
                  alt="老狐狸"
                  class=""
                />\n </a
              >\n
            </td>
            \n\n
            <td valign="top">
              \n \n\n
              <div class="pl2">
                \n\n
                <a href="https://movie.douban.com/subject/35611467/" class=""
                  >\n 老狐狸\n /
                  <span style="font-size:13px;">老狐狸没教我的事 / Old Fox</span
                  >\n </a
                >\n\n\n\n
                <p class="pl">
                  2023-10-27(东京国际电影节) / 2023-11-24(中国台湾) / 白润音 /
                  刘冠廷 / 陈慕义 / 刘奕儿 / 门胁麦 / 黄健玮 / 温升豪 / 班铁翔 /
                  杨丽音 / 傅孟柏 / 高英轩 / 庄益增 / 张再兴 / 许博维 / 管罄 /
                  钟瑶 / 游珈瑄 / 郑旸恩 / 戴雅芝 / 姜仁 / 萧鸿文...
                </p>
                \n\n \n\n\n \n
                <div class="star clearfix">
                  \n <span class="allstar40"></span>\n
                  <span class="rating_nums">8.1</span>\n
                  <span class="pl">(29204人评价)</span>\n\n
                </div>
                \n\n\n
              </div>
              \n\n
            </td>
            \n
          </tr>
          \n
        </tbody>
      </table>
      \n
      <div id="collect_form_35611467"></div>
      \n
      <p class="ul"></p>
      \n
      <table width="100%" class="">
        \n
        <tbody>
          <tr class="item">
            \n
            <td width="100" valign="top">
              \n \n\n
              <a
                class="nbg"
                href="https://movie.douban.com/subject/35426925/"
                title="机器人之梦"
                >\n
                <img
                  src="https://img1.doubanio.com/view/photo/s_ratio_poster/public/p2899644068.webp"
                  width="75"
                  alt="机器人之梦"
                  class=""
                />\n </a
              >\n
            </td>
            \n\n
            <td valign="top">
              \n \n\n
              <div class="pl2">
                \n\n
                <a href="https://movie.douban.com/subject/35426925/" class=""
                  >\n 机器人之梦\n /
                  <span style="font-size:13px;"
                    >再见机器人(台) / Mon ami robot</span
                  >\n </a
                >\n\n\n\n
                <p class="pl">
                  2023-05-20(戛纳电影节) / 2023-12-06(西班牙) / 2024(中国大陆) /
                  伊万·拉班达 / 阿尔伯特·特里佛·塞加拉 / 拉法·卡尔沃 /
                  何塞·加西亚·托斯 / 何塞·路易斯·梅地亚维拉 / 加西埃拉·莫利娜 /
                  埃斯特·索兰斯 / 西班牙 / 法国 / 巴勃罗·贝格尔...
                </p>
                \n\n \n\n\n \n
                <div class="star clearfix">
                  \n <span class="allstar45"></span>\n
                  <span class="rating_nums">9.1</span>\n
                  <span class="pl">(64650人评价)</span>\n\n
                </div>
                \n\n\n
              </div>
              \n\n
            </td>
            \n
          </tr>
          \n
        </tbody>
      </table>
      \n
      <div id="collect_form_35426925"></div>
      \n
      <p class="ul"></p>
      \n
      <table width="100%" class="">
        \n
        <tbody>
          <tr class="item">
            \n
            <td width="100" valign="top">
              \n \n\n
              <a
                class="nbg"
                href="https://movie.douban.com/subject/36093612/"
                title="白日之下"
                >\n
                <img
                  src="https://img1.doubanio.com/view/photo/s_ratio_poster/public/p2904961420.webp"
                  width="75"
                  alt="白日之下"
                  class=""
                />\n </a
              >\n
            </td>
            \n\n
            <td valign="top">
              \n \n\n
              <div class="pl2">
                \n\n
                <a href="https://movie.douban.com/subject/36093612/" class=""
                  >\n 白日之下\n /
                  <span style="font-size:13px;">In Broad Daylight</span>\n </a
                >\n\n\n\n
                <p class="pl">
                  2023-06-11(上海国际电影节) / 2023-11-02(中国香港) /
                  2024-04-12(中国大陆) / 姜大卫 / 余香凝 / 林保怡 / 梁仲恒 /
                  陈湛文 / 周汉宁 / 梁雍婷 / 龚慈恩 / 宝珮如 / 朱柏谦 / 朱栢康 /
                  许月湘 / 胡枫 / 鲍起静 / 高翰文 / 彭杏英 / 罗浩铭 / 谭玉瑛...
                </p>
                \n\n \n\n\n \n
                <div class="star clearfix">
                  \n <span class="allstar40"></span>\n
                  <span class="rating_nums">8.0</span>\n
                  <span class="pl">(36530人评价)</span>\n\n
                </div>
                \n\n\n
              </div>
              \n\n
            </td>
            \n
          </tr>
          \n
        </tbody>
      </table>
      \n
      <div id="collect_form_36093612"></div>
      \n
      <p class="ul"></p>
      \n
      <table width="100%" class="">
        \n
        <tbody>
          <tr class="item">
            \n
            <td width="100" valign="top">
              \n \n\n
              <a
                class="nbg"
                href="https://movie.douban.com/subject/35350109/"
                title="可怜的东西"
                >\n
                <img
                  src="https://img1.doubanio.com/view/photo/s_ratio_poster/public/p2897662939.webp"
                  width="75"
                  alt="可怜的东西"
                  class=""
                />\n </a
              >\n
            </td>
            \n\n
            <td valign="top">
              \n \n\n
              <div class="pl2">
                \n\n
                <a href="https://movie.douban.com/subject/35350109/" class=""
                  >\n 可怜的东西\n </a
                >\n\n\n\n
                <p class="pl">
                  2023-09-01(威尼斯电影节) / 2023-12-08(美国) / 艾玛·斯通 /
                  马克·鲁弗洛 / 威廉·达福 / 拉米·尤素夫 / 克里斯托弗·阿波特 /
                  苏西·本巴 / 杰洛德·卡尔迈克 / 凯瑟琳·亨特 / 薇琪·佩珀代因 /
                  玛格丽特·库里 / 汉娜·许古拉 / 杰克·巴顿...
                </p>
                \n\n \n\n\n \n
                <div class="star clearfix">
                  \n <span class="allstar35"></span>\n
                  <span class="rating_nums">7.0</span>\n
                  <span class="pl">(130112人评价)</span>\n\n
                </div>
                \n\n\n
              </div>
              \n\n
            </td>
            \n
          </tr>
          \n
        </tbody>
      </table>
      \n
      <div id="collect_form_35350109"></div>
      \n
      <p class="ul"></p>
      \n
      <table width="100%" class="">
        \n
        <tbody>
          <tr class="item">
            \n
            <td width="100" valign="top">
              \n \n\n
              <a
                class="nbg"
                href="https://movie.douban.com/subject/35902857/"
                title="完美的日子"
                >\n
                <img
                  src="https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2898894527.webp"
                  width="75"
                  alt="完美的日子"
                  class=""
                />\n </a
              >\n
            </td>
            \n\n
            <td valign="top">
              \n \n\n
              <div class="pl2">
                \n\n
                <a href="https://movie.douban.com/subject/35902857/" class=""
                  >\n 完美的日子\n /
                  <span style="font-size:13px;"
                    >东京厕所 / 我的完美日常(台)</span
                  >\n </a
                >\n\n\n
                <span
                  style="font-size: 13px; padding-left: 3px; color: #00A65F;"
                  >[可播放]</span
                >\n\n
                <p class="pl">
                  2023-05-25(戛纳电影节) / 2023-12-21(德国) / 2023-12-22(日本) /
                  役所广司 / 柄本时生 / 中野有纱 / 山田葵 / 麻生祐未 /
                  石川小百合 / 三浦友和 / 田中泯 / 大下浩人 / 犬山犬子 /
                  牧口元美 / 长井短 / 研直子 / 茂吕师冈 / 县森鱼 / 片桐入 /
                  芹泽兴人...
                </p>
                \n\n \n\n\n \n
                <div class="star clearfix">
                  \n <span class="allstar40"></span>\n
                  <span class="rating_nums">8.3</span>\n
                  <span class="pl">(33560人评价)</span>\n\n
                </div>
                \n\n\n
              </div>
              \n\n
            </td>
            \n
          </tr>
          \n
        </tbody>
      </table>
      \n
      <div id="collect_form_35902857"></div>
      \n
      <p class="ul"></p>
      \n
      <table width="100%" class="">
        \n
        <tbody>
          <tr class="item">
            \n
            <td width="100" valign="top">
              \n \n\n
              <a
                class="nbg"
                href="https://movie.douban.com/subject/26608246/"
                title="新威龙杀阵"
                >\n
                <img
                  src="https://img1.doubanio.com/view/photo/s_ratio_poster/public/p2905374090.webp"
                  width="75"
                  alt="新威龙杀阵"
                  class=""
                />\n </a
              >\n
            </td>
            \n\n
            <td valign="top">
              \n \n\n
              <div class="pl2">
                \n\n
                <a href="https://movie.douban.com/subject/26608246/" class=""
                  >\n 新威龙杀阵\n /
                  <span style="font-size:13px;">威龙杀阵</span>\n </a
                >\n\n\n\n
                <p class="pl">
                  2024-03-08(西南偏南电影节) / 2024-03-21(美国网络) /
                  杰克·吉伦哈尔 / 康纳·麦格雷戈 / 杰西卡·威廉姆斯 /
                  比利·马格努森 / 丹妮拉·曼希沃 / 吉米索拉·艾库美罗 /
                  卢卡斯·盖奇 / 特拉维斯·范·文克 / 达伦·巴内特 /
                  乔昆姆·德·阿尔梅达...
                </p>
                \n\n \n\n\n \n
                <div class="star clearfix">
                  \n <span class="allstar30"></span>\n
                  <span class="rating_nums">6.3</span>\n
                  <span class="pl">(9980人评价)</span>\n\n
                </div>
                \n\n\n
              </div>
              \n\n
            </td>
            \n
          </tr>
          \n
        </tbody>
      </table>
      \n
      <div id="collect_form_26608246"></div>
      \n
      <p class="ul"></p>
      \n
      <table width="100%" class="">
        \n
        <tbody>
          <tr class="item">
            \n
            <td width="100" valign="top">
              \n \n\n
              <a
                class="nbg"
                href="https://movie.douban.com/subject/35712804/"
                title="首尔之春"
                >\n
                <img
                  src="https://img1.doubanio.com/view/photo/s_ratio_poster/public/p2905204009.webp"
                  width="75"
                  alt="首尔之春"
                  class=""
                />\n </a
              >\n
            </td>
            \n\n
            <td valign="top">
              \n \n\n
              <div class="pl2">
                \n\n
                <a href="https://movie.douban.com/subject/35712804/" class=""
                  >\n 首尔之春\n /
                  <span style="font-size:13px;"
                    >12.12：首尔之春(台) / 12.12: The Day</span
                  >\n </a
                >\n\n\n\n
                <p class="pl">
                  2023-11-22(韩国) / 黄政民 / 郑雨盛 / 李星民 / 朴解浚 / 金成畇
                  / 朴勋 / 安世镐 / 郑允荷 / 丁海寅 / 南允皓 / 全秀芝 / 韩国 /
                  金成洙 / 141分钟 / 首尔之春 / 剧情 / 金成洙 Sung-su Kim / 韩语
                </p>
                \n\n \n\n\n \n
                <div class="star clearfix">
                  \n <span class="allstar45"></span>\n
                  <span class="rating_nums">8.8</span>\n
                  <span class="pl">(171858人评价)</span>\n\n
                </div>
                \n\n\n
              </div>
              \n\n
            </td>
            \n
          </tr>
          \n
        </tbody>
      </table>
      \n
      <div id="collect_form_35712804"></div>
      \n
      <p class="ul"></p>
      \n
      <table width="100%" class="">
        \n
        <tbody>
          <tr class="item">
            \n
            <td width="100" valign="top">
              \n \n\n
              <a
                class="nbg"
                href="https://movie.douban.com/subject/35074609/"
                title="金手指"
                >\n
                <img
                  src="https://img1.doubanio.com/view/photo/s_ratio_poster/public/p2901830629.webp"
                  width="75"
                  alt="金手指"
                  class=""
                />\n </a
              >\n
            </td>
            \n\n
            <td valign="top">
              \n \n\n
              <div class="pl2">
                \n\n
                <a href="https://movie.douban.com/subject/35074609/" class=""
                  >\n 金手指\n /
                  <span style="font-size:13px;">The Goldfinger</span>\n </a
                >\n\n\n
                <span
                  style="font-size: 13px; padding-left: 3px; color: #00A65F;"
                  >[可播放]</span
                >\n\n
                <p class="pl">
                  2023-12-30(中国大陆) / 梁朝伟 / 刘德华 / 蔡卓妍 / 任达华 /
                  方中信 / 陈家乐 / 白只 / 姜皓文 / 太保 / 钱嘉乐 / 袁咏仪 /
                  周家怡 / 岑珈其 / 李靖筠 / 吴肇轩 / 柯炜林 / 冯泳贤 / 杜曜宇 /
                  李建城 / 古永锋 / 中国香港 / 中国大陆 / 庄文强...
                </p>
                \n\n \n\n\n \n
                <div class="star clearfix">
                  \n <span class="allstar30"></span>\n
                  <span class="rating_nums">6.1</span>\n
                  <span class="pl">(135956人评价)</span>\n\n
                </div>
                \n\n\n
              </div>
              \n\n
            </td>
            \n
          </tr>
          \n
        </tbody>
      </table>
      \n
      <div id="collect_form_35074609"></div>
      \n
      <p class="ul"></p>
      \n
      <table width="100%" class="">
        \n
        <tbody>
          <tr class="item">
            \n
            <td width="100" valign="top">
              \n \n\n
              <a
                class="nbg"
                href="https://movie.douban.com/subject/36212631/"
                title="美国小说"
                >\n
                <img
                  src="https://img9.doubanio.com/view/photo/s_ratio_poster/public/p2902166424.webp"
                  width="75"
                  alt="美国小说"
                  class=""
                />\n </a
              >\n
            </td>
            \n\n
            <td valign="top">
              \n \n\n
              <div class="pl2">
                \n\n
                <a href="https://movie.douban.com/subject/36212631/" class=""
                  >\n 美国小说\n /
                  <span style="font-size:13px;">擦除</span>\n </a
                >\n\n\n\n
                <p class="pl">
                  2023-09-08(多伦多国际电影节) / 2023-12-15(美国) / 杰弗里·怀特
                  / 翠西·艾利斯·罗斯 / 约翰·奥提兹 / 伊萨·雷 / 斯特林·K·布朗 /
                  埃里卡·亚历山大 / 莱斯利·格塞斯 / 亚当·布罗迪 / 凯斯·大卫 /
                  迈拉·卢克利希亚·泰勒 / 雷蒙德·安东尼·托马斯...
                </p>
                \n\n \n\n\n \n
                <div class="star clearfix">
                  \n <span class="allstar40"></span>\n
                  <span class="rating_nums">7.7</span>\n
                  <span class="pl">(26223人评价)</span>\n\n
                </div>
                \n\n\n
              </div>
              \n\n
            </td>
            \n
          </tr>
          \n
        </tbody>
      </table>
      \n
      <div id="collect_form_36212631"></div>
      \n
      <p class="ul"></p>
      \n
      <table width="100%" class="">
        \n
        <tbody>
          <tr class="item">
            \n
            <td width="100" valign="top">
              \n \n\n
              <a
                class="nbg"
                href="https://movie.douban.com/subject/35169716/"
                title="利益区域"
                >\n
                <img
                  src="https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2899514583.webp"
                  width="75"
                  alt="利益区域"
                  class=""
                />\n </a
              >\n
            </td>
            \n\n
            <td valign="top">
              \n \n\n
              <div class="pl2">
                \n\n
                <a href="https://movie.douban.com/subject/35169716/" class=""
                  >\n 利益区域\n /
                  <span style="font-size:13px;">兴趣之地 / 利害之畿</span>\n </a
                >\n\n\n\n
                <p class="pl">
                  2023-05-19(戛纳电影节) / 2023-12-15(美国) /
                  克里斯蒂安·富里道尔 / 桑德拉·惠勒 / 约翰·卡特豪斯 /
                  拉尔夫·赫尔福特 / 弗雷娅·克罗伊茨卡姆 / 马克斯·贝克 /
                  伊摩根·蔻格 / 斯蒂芬妮·佩特罗维茨 / 拉尔夫·齐尔曼 /
                  玛丽·罗莎·提特言...
                </p>
                \n\n \n\n\n \n
                <div class="star clearfix">
                  \n <span class="allstar35"></span>\n
                  <span class="rating_nums">7.4</span>\n
                  <span class="pl">(24873人评价)</span>\n\n
                </div>
                \n\n\n
              </div>
              \n\n
            </td>
            \n
          </tr>
          \n
        </tbody>
      </table>
      \n
      <div id="collect_form_35169716"></div>
      \n
    </div>
    \n\n\n
  </div>
  \n \n\n
</div>
```

:::

::: details 查看 AI 返回的 filmResult （电影的信息）

```json
{
  "elements": [
    {
      "name": "老狐狸",
      "picture": "https://img1.doubanio.com/view/photo/s_ratio_poster/public/p2900908599.webp",
      "info": "2023-10-27(东京国际电影节) / 2023-11-24(中国台湾) / 白润音 / 刘冠廷 / 陈慕义 / 刘奕儿 / 门胁麦 / 黄健玮 / 温升豪 / 班铁翔 / 杨丽音 / 傅孟柏 / 高英轩 / 庄益增 / 张再兴 / 许博维 / 管罄 / 钟瑶 / 游珈瑄 / 郑旸恩 / 戴雅芝 / 姜仁 / 萧鸿文...",
      "score": "8.1",
      "commentsNumber": "29211人评价"
    },
    {
      "name": "机器人之梦",
      "picture": "https://img1.doubanio.com/view/photo/s_ratio_poster/public/p2899644068.webp",
      "info": "2023-05-20(戛纳电影节) / 2023-12-06(西班牙) / 2024(中国大陆) / 伊万·拉班达 / 阿尔伯特·特里佛·塞加拉 / 拉法·卡尔沃 / 何塞·加西亚·托斯 / 何塞·路易斯·梅地亚维拉 / 加西埃拉·莫利娜 / 埃斯特·索兰斯 / 西班牙 / 法国 / 巴勃罗·贝格尔...",
      "score": "9.1",
      "commentsNumber": "64650人评价"
    },
    {
      "name": "白日之下",
      "picture": "https://img1.doubanio.com/view/photo/s_ratio_poster/public/p2904961420.webp",
      "info": "2023-06-11(上海国际电影节) / 2023-11-02(中国香港) / 2024-04-12(中国大陆) / 姜大卫 / 余香凝 / 林保怡 / 梁仲恒 / 陈湛文 / 周汉宁 / 梁雍婷 / 龚慈恩 / 宝珮如 / 朱柏谦 / 朱栢康 / 许月湘 / 胡枫 / 鲍起静 / 高翰文 / 彭杏英 / 罗浩铭 / 谭玉瑛...",
      "score": "8.0",
      "commentsNumber": "36540人评价"
    },
    {
      "name": "可怜的东西",
      "picture": "https://img1.doubanio.com/view/photo/s_ratio_poster/public/p2897662939.webp",
      "info": "2023-09-01(威尼斯电影节) / 2023-12-08(美国) / 艾玛·斯通 / 马克·鲁弗洛 / 威廉·达福 / 拉米·尤素夫 / 克里斯托弗·阿波特 / 苏西·本巴 / 杰洛德·卡尔迈克 / 凯瑟琳·亨特 / 薇琪·佩珀代因 / 玛格丽特·库里 / 汉娜·许古拉 / 杰克·巴顿...",
      "score": "7.0",
      "commentsNumber": "130113人评价"
    },
    {
      "name": "完美的日子",
      "picture": "https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2898894527.webp",
      "info": "2023-05-25(戛纳电影节) / 2023-12-21(德国) / 2023-12-22(日本) / 役所广司 / 柄本时生 / 中野有纱 / 山田葵  / 麻生祐未 / 石川小百合 / 三浦友和 / 田中泯 / 大下浩人 / 犬山犬子 / 牧口元美 / 长井短 / 研直子 / 茂吕师冈 / 县森鱼 / 片桐入 / 芹泽兴人...",
      "score": "8.3",
      "commentsNumber": "33562人评价"
    },
    {
      "name": "新威龙杀阵",
      "picture": "https://img1.doubanio.com/view/photo/s_ratio_poster/public/p2905374090.webp",
      "info": "2024-03-08(西南偏南电影节) / 2024-03-21(美国网络) / 杰克·吉伦哈尔 / 康纳·麦格雷戈 / 杰西卡·威廉姆斯 / 比利·马格努森 / 丹妮拉·曼希沃 / 吉米索拉·艾库美罗 / 卢卡斯·盖奇 / 特拉维斯·范·文克 / 达伦·巴内特 / 乔昆姆·德·阿尔梅达...",
      "score": "6.3",
      "commentsNumber": "9980人评价"
    },
    {
      "name": "首尔之春",
      "picture": "https://img1.doubanio.com/view/photo/s_ratio_poster/public/p2905204009.webp",
      "info": "2023-11-22(韩国) / 黄政民 / 郑雨盛 / 李星民 / 朴解浚 / 金成畇 / 朴勋 / 安世镐 / 郑允荷 / 丁海寅 / 南允皓 / 全秀芝 / 韩国 / 金成洙 / 141分钟 / 首尔之春 / 剧情 / 金成洙 Sung-su Kim / 韩语",
      "score": "8.8",
      "commentsNumber": "171858人评价"
    },
    {
      "name": "金手指",
      "picture": "https://img1.doubanio.com/view/photo/s_ratio_poster/public/p2901830629.webp",
      "info": "2023-12-30(中国大陆) / 梁朝伟 / 刘德华 / 蔡卓妍 / 任达华 / 方中信 / 陈家乐 / 白只 / 姜皓文 / 太保 / 钱嘉乐 / 袁咏仪 / 周家怡 / 岑珈其 / 李靖筠 / 吴肇轩 / 柯炜林 / 冯泳贤 / 杜曜宇 / 李建城 / 古永锋 / 中国香港 / 中国大陆 / 庄文强...",
      "score": "6.1",
      "commentsNumber": "135956人评价"
    },
    {
      "name": "美国小说",
      "picture": "https://img9.doubanio.com/view/photo/s_ratio_poster/public/p2902166424.webp",
      "info": "2023-09-08(多伦多国际电影节) / 2023-12-15(美国) / 杰弗里·怀特 / 翠西·艾利斯·罗斯 / 约翰·奥提兹 / 伊萨·雷 / 斯特林·K·布朗 / 埃里卡·亚历山大 / 莱斯利·格塞斯 / 亚当·布罗迪 / 凯斯·大卫 / 迈拉·卢克利希亚·泰勒 / 雷蒙德·安东尼·托马斯...",
      "score": "7.7",
      "commentsNumber": "26223人评价"
    },
    {
      "name": "利益区域",
      "picture": "https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2899514583.webp",
      "info": "2023-05-19(戛纳电影节) / 2023-12-15(美国) / 克里斯蒂安·富里道尔 / 桑德拉·惠勒 / 约翰·卡特豪斯 / 拉尔夫·赫尔福特 / 弗雷娅·克罗伊茨卡姆 / 马克斯·贝克 / 伊摩根·蔻格 / 斯蒂芬妮·佩特罗维茨 / 拉尔夫·齐尔曼 / 玛丽·罗莎·提特言...",
      "score": "7.4",
      "commentsNumber": "24875人评价"
    }
  ],
  "type": "multiple"
}
```

:::

---

::: tip 提示
甚至可以将整个 HTML 传给 AI 帮我们操作，由于网站内容更加复杂你还需要更准确描述要取的位置，并且会消耗大量的 Tokens 。

即使网站后续的更新导致类名或结构发生改变也能正常爬到数据，因为我们可以不再依赖于固定的类名或结构来定位并提取所需信息，而是让 AI 理解并解析网页的语义信息，从而更高效、智能和便捷提取所需数据。
:::

::: warning 警告
x-crawl 仅供合法用途，禁止使用该工具进行任何违法活动，请务必遵守目标网站的 robots.txt 文件规定。本例仅用于演示 x-crawl 的使用方法，并非针对特定网站，如有侵权请联系我删除。
:::
