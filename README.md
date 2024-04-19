# x-crawl · [![npm](https://img.shields.io/npm/v/x-crawl.svg)](https://www.npmjs.com/package/x-crawl) [![NPM Downloads](https://img.shields.io/npm/dt/x-crawl)](https://www.npmjs.com/package/x-crawl) [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/coder-hxl/x-crawl/blob/main/LICENSE)

[English](https://coder-hxl.github.io/x-crawl) | [简体中文](https://coder-hxl.github.io/x-crawl/cn)

x-crawl is a flexible Node.js AI-assisted crawler library. Flexible usage and powerful AI assistance functions make crawler work more efficient, intelligent and convenient.

It consists of two parts:

- Crawler: It consists of a crawler API and various functions that can work normally even without relying on AI.
- AI: Currently based on the large AI model provided by OpenAI, AI simplifies many tedious operations.

> If you find x-crawl helpful, or you like x-crawl, you can give [x-crawl repository](https://github.com/coder-hxl/x-crawl) a like on GitHub A star. Your support is the driving force for our continuous improvement! thank you for your support!

## Features

- **🤖 AI Assistance** - Powerful AI assistance function makes crawler work more efficient, intelligent and convenient.
- **🖋️ Flexible writing** - A single crawling API is suitable for multiple configurations, and each configuration method has its own advantages.
- **⚙️Multiple uses** - Supports crawling dynamic pages, static pages, interface data and file data.
- **⚒️ Control page** - Crawling dynamic pages supports automated operations, keyboard input, event operations, etc.
- **👀 Device Fingerprinting** - Zero configuration or custom configuration to avoid fingerprint recognition to identify and track us from different locations.
- **🔥 Asynchronous Sync** - Asynchronous or synchronous crawling mode without switching crawling API.
- **⏱️ Interval crawling** - no interval, fixed interval and random interval, determine whether to crawl with high concurrency.
- **🔄 Failed Retry** - Customize the number of retries to avoid crawling failures due to temporary problems.
- **➡️ Rotation proxy** - Automatic proxy rotation with failed retries, custom error times and HTTP status codes.
- **🚀 Priority Queue** - Based on the priority of a single crawl target, it can be crawled ahead of other targets.
- **🧾 Crawl information** - Controllable crawl information, which will output colored string information in the terminal.
- **🦾 TypeScript** - Own types and implement complete types through generics.

## AI assisted crawler

With the rapid development of network technology, website updates have become more frequent, and changes in class names or structures often bring considerable challenges to crawlers that rely on these elements. Against this background, crawlers combined with AI technology have become a powerful weapon to meet this challenge.

First of all, changes in class names or structures after website updates may cause traditional crawler strategies to fail. This is because crawlers often rely on fixed class names or structures to locate and extract the required information. Once these elements change, the crawler may not be able to accurately find the required data, thus affecting the effectiveness and accuracy of data crawling.

However, crawlers combined with AI technology are better able to cope with this change. AI can also understand and parse the semantic information of web pages through natural language processing and other technologies to more accurately extract the required data.

To sum up, crawlers combined with AI technology can better cope with the problem of class name or structure changes after website updates.

## Example

The combination of crawler and AI allows the crawler and AI to obtain pictures of high-rated vacation rentals according to our instructions:

```js
import { createCrawl, createCrawlOpenAI } from 'x-crawl'

//Create a crawler application
const crawlApp = createCrawl({
  maxRetry: 3,
  intervalTime: { max: 2000, min: 1000 }
})

//Create AI application
const crawlOpenAIApp = createCrawlOpenAI({
  clientOptions: { apiKey: process.env['OPENAI_API_KEY'] },
  defaultModel: { chatModel: 'gpt-4-turbo-preview' }
})

// crawlPage is used to crawl pages
crawlApp.crawlPage('https://www.airbnb.cn/s/select_homes').then(async (res) => {
  const { page, browser } = res.data

  // Wait for the element to appear on the page and get the HTML
  const targetSelector = '[data-tracking-id="TOP_REVIEWED_LISTINGS"]'
  await page.waitForSelector(targetSelector)
  const highlyHTML = await page.$eval(targetSelector, (el) => el.innerHTML)

  // Let the AI get the image link and de-duplicate it (the more detailed the description, the better)
  const srcResult = await crawlOpenAIApp.parseElements(
    highlyHTML,
    `Get the image link, don't source it inside, and de-duplicate it`
  )

  browser.close()

  // crawlFile is used to crawl file resources
  crawlApp.crawlFile({
    targets: srcResult.elements.map((item) => item.src),
    storeDirs: './upload'
  })
})
```

**Can even send the whole HTML to the AI to help us operate, because the website content is more complex you also need to describe the location to get more accurately, and will consume a lot of Tokens.**

**Even if the subsequent update of the website causes the class name or structure to change, it can climb to the data normally, because we no longer rely on the fixed class name or structure to locate and extract the required information, but let the AI understand and parse the semantic information of the web page, so as to extract the required data more efficiently, intelligently and conveniently.**

Procedure:

![](https://raw.githubusercontent.com/coder-hxl/x-crawl/main/assets/example.gif)

Pictures of highly rated vacation rentals climbed to:

![](https://raw.githubusercontent.com/coder-hxl/x-crawl/main/assets/example.png)

<details>

<summary>See the HTML that the AI needs to process</summary>

For ease of viewing, it is formatted here

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
                    https://z1.muscache.cn/im/pictures/miso/Hosting-45937791/original/c67d32ed-21eb-4066-8cef-650dcd45bada.jpeg?im_w=320 1x,
                    https://z1.muscache.cn/im/pictures/miso/Hosting-45937791/original/c67d32ed-21eb-4066-8cef-650dcd45bada.jpeg?im_w=720 2x
                  "
                  media="(min-width: 744px)" />
                <source
                  class="s1yu4uxa dir dir-ltr"
                  srcset="
                    https://z1.muscache.cn/im/pictures/miso/Hosting-45937791/original/c67d32ed-21eb-4066-8cef-650dcd45bada.jpeg?im_w=480 1x,
                    https://z1.muscache.cn/im/pictures/miso/Hosting-45937791/original/c67d32ed-21eb-4066-8cef-650dcd45bada.jpeg?im_w=960 2x
                  "
                  media="(min-width: 375px)" />
                <source
                  class="s1yu4uxa dir dir-ltr"
                  srcset="
                    https://z1.muscache.cn/im/pictures/miso/Hosting-45937791/original/c67d32ed-21eb-4066-8cef-650dcd45bada.jpeg?im_w=320 1x,
                    https://z1.muscache.cn/im/pictures/miso/Hosting-45937791/original/c67d32ed-21eb-4066-8cef-650dcd45bada.jpeg?im_w=720 2x
                  " />
                <img
                  src="https://z1.muscache.cn/im/pictures/miso/Hosting-45937791/original/c67d32ed-21eb-4066-8cef-650dcd45bada.jpeg?aki_policy=large"
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
                      d="m15.1 1.58-4.13 8.88-9.86 1.27a1 1 0 0 0-.54 1.74l7.3 6.57-1.97 9.85a1 1 0 0 0 1.48 1.06l8.62-5 8.63 5a1 1 0 0 0 1.48-1.06l-1.97-9.85 7.3-6.57a1 1 0 0 0-.55-1.73l-9.86-1.28-4.12-8.88a1 1 0 0 0-1.82 0z"
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
                      d="m15.1 1.58-4.13 8.88-9.86 1.27a1 1 0 0 0-.54 1.74l7.3 6.57-1.97 9.85a1 1 0 0 0 1.48 1.06l8.62-5 8.63 5a1 1 0 0 0 1.48-1.06l-1.97-9.85 7.3-6.57a1 1 0 0 0-.55-1.73l-9.86-1.28-4.12-8.88a1 1 0 0 0-1.82 0z"
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
                      d="m15.1 1.58-4.13 8.88-9.86 1.27a1 1 0 0 0-.54 1.74l7.3 6.57-1.97 9.85a1 1 0 0 0 1.48 1.06l8.62-5 8.63 5a1 1 0 0 0 1.48-1.06l-1.97-9.85 7.3-6.57a1 1 0 0 0-.55-1.73l-9.86-1.28-4.12-8.88a1 1 0 0 0-1.82 0z"
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
              href="/s/homes?dynamic_product_ids%5B%5D=545779178592886885&amp;omni_page_id=36021&amp;place_id=ChIJLRh_0mrbuocRPj3TdL_VlpM"
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
                      d="m15.1 1.58-4.13 8.88-9.86 1.27a1 1 0 0 0-.54 1.74l7.3 6.57-1.97 9.85a1 1 0 0 0 1.48 1.06l8.62-5 8.63 5a1 1 0 0 0 1.48-1.06l-1.97-9.85 7.3-6.57a1 1 0 0 0-.55-1.73l-9.86-1.28-4.12-8.88a1 1 0 0 0-1.82 0z"
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
              href="/s/homes?dynamic_product_ids%5B%5D=661881998531696630&amp;omni_page_id=36021&amp;place_id=ChIJLRh_0mrbuocRPj3TdL_VlpM"
              target="_blank"
              rel="noreferrer"
              data-nosnippet="true"
              tabindex="-1"
              ><picture class="p1h9elqm dir dir-ltr"
                ><source
                  class="s1yu4uxa dir dir-ltr"
                  srcset="
                    https://z1.muscache.cn/im/pictures/miso/Hosting-661881998531696630/original/c7f7769f-e56c-4d55-8e74-06fdaf3e048d.jpeg?im_w=320 1x,
                    https://z1.muscache.cn/im/pictures/miso/Hosting-661881998531696630/original/c7f7769f-e56c-4d55-8e74-06fdaf3e048d.jpeg?im_w=720 2x
                  "
                  media="(min-width: 744px)" />
                <source
                  class="s1yu4uxa dir dir-ltr"
                  srcset="
                    https://z1.muscache.cn/im/pictures/miso/Hosting-661881998531696630/original/c7f7769f-e56c-4d55-8e74-06fdaf3e048d.jpeg?im_w=480 1x,
                    https://z1.muscache.cn/im/pictures/miso/Hosting-661881998531696630/original/c7f7769f-e56c-4d55-8e74-06fdaf3e048d.jpeg?im_w=960 2x
                  "
                  media="(min-width: 375px)" />
                <source
                  class="s1yu4uxa dir dir-ltr"
                  srcset="
                    https://z1.muscache.cn/im/pictures/miso/Hosting-661881998531696630/original/c7f7769f-e56c-4d55-8e74-06fdaf3e048d.jpeg?im_w=320 1x,
                    https://z1.muscache.cn/im/pictures/miso/Hosting-661881998531696630/original/c7f7769f-e56c-4d55-8e74-06fdaf3e048d.jpeg?im_w=720 2x
                  " />
                <img
                  src="https://z1.muscache.cn/im/pictures/miso/Hosting-661881998531696630/original/c7f7769f-e56c-4d55-8e74-06fdaf3e048d.jpeg?aki_policy=large"
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
                      d="m15.1 1.58-4.13 8.88-9.86 1.27a1 1 0 0 0-.54 1.74l7.3 6.57-1.97 9.85a1 1 0 0 0 1.48 1.06l8.62-5 8.63 5a1 1 0 0 0 1.48-1.06l-1.97-9.85 7.3-6.57a1 1 0 0 0-.55-1.73l-9.86-1.28-4.12-8.88a1 1 0 0 0-1.82 0z"
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
                    https://z1.muscache.cn/im/pictures/miso/Hosting-50620715/original/650ba8af-3f77-41ce-8c93-0cf502a8656d.jpeg?im_w=320 1x,
                    https://z1.muscache.cn/im/pictures/miso/Hosting-50620715/original/650ba8af-3f77-41ce-8c93-0cf502a8656d.jpeg?im_w=720 2x
                  "
                  media="(min-width: 744px)" />
                <source
                  class="s1yu4uxa dir dir-ltr"
                  srcset="
                    https://z1.muscache.cn/im/pictures/miso/Hosting-50620715/original/650ba8af-3f77-41ce-8c93-0cf502a8656d.jpeg?im_w=480 1x,
                    https://z1.muscache.cn/im/pictures/miso/Hosting-50620715/original/650ba8af-3f77-41ce-8c93-0cf502a8656d.jpeg?im_w=960 2x
                  "
                  media="(min-width: 375px)" />
                <source
                  class="s1yu4uxa dir dir-ltr"
                  srcset="
                    https://z1.muscache.cn/im/pictures/miso/Hosting-50620715/original/650ba8af-3f77-41ce-8c93-0cf502a8656d.jpeg?im_w=320 1x,
                    https://z1.muscache.cn/im/pictures/miso/Hosting-50620715/original/650ba8af-3f77-41ce-8c93-0cf502a8656d.jpeg?im_w=720 2x
                  " />
                <img
                  src="https://z1.muscache.cn/im/pictures/miso/Hosting-50620715/original/650ba8af-3f77-41ce-8c93-0cf502a8656d.jpeg?aki_policy=large"
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
                      d="m15.1 1.58-4.13 8.88-9.86 1.27a1 1 0 0 0-.54 1.74l7.3 6.57-1.97 9.85a1 1 0 0 0 1.48 1.06l8.62-5 8.63 5a1 1 0 0 0 1.48-1.06l-1.97-9.85 7.3-6.57a1 1 0 0 0-.55-1.73l-9.86-1.28-4.12-8.88a1 1 0 0 0-1.82 0z"
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
                      d="m15.1 1.58-4.13 8.88-9.86 1.27a1 1 0 0 0-.54 1.74l7.3 6.57-1.97 9.85a1 1 0 0 0 1.48 1.06l8.62-5 8.63 5a1 1 0 0 0 1.48-1.06l-1.97-9.85 7.3-6.57a1 1 0 0 0-.55-1.73l-9.86-1.28-4.12-8.88a1 1 0 0 0-1.82 0z"
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
                      d="m15.1 1.58-4.13 8.88-9.86 1.27a1 1 0 0 0-.54 1.74l7.3 6.57-1.97 9.85a1 1 0 0 0 1.48 1.06l8.62-5 8.63 5a1 1 0 0 0 1.48-1.06l-1.97-9.85 7.3-6.57a1 1 0 0 0-.55-1.73l-9.86-1.28-4.12-8.88a1 1 0 0 0-1.82 0z"
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
                      d="m15.1 1.58-4.13 8.88-9.86 1.27a1 1 0 0 0-.54 1.74l7.3 6.57-1.97 9.85a1 1 0 0 0 1.48 1.06l8.62-5 8.63 5a1 1 0 0 0 1.48-1.06l-1.97-9.85 7.3-6.57a1 1 0 0 0-.55-1.73l-9.86-1.28-4.12-8.88a1 1 0 0 0-1.82 0z"
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
                      d="m15.1 1.58-4.13 8.88-9.86 1.27a1 1 0 0 0-.54 1.74l7.3 6.57-1.97 9.85a1 1 0 0 0 1.48 1.06l8.62-5 8.63 5a1 1 0 0 0 1.48-1.06l-1.97-9.85 7.3-6.57a1 1 0 0 0-.55-1.73l-9.86-1.28-4.12-8.88a1 1 0 0 0-1.82 0z"
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
              href="/s/homes?dynamic_product_ids%5B%5D=792178978933830608&amp;omni_page_id=36021&amp;place_id=ChIJLRh_0mrbuocRPj3TdL_VlpM"
              target="_blank"
              rel="noreferrer"
              data-nosnippet="true"
              tabindex="-1"
              ><picture class="p1h9elqm dir dir-ltr"
                ><source
                  class="s1yu4uxa dir dir-ltr"
                  srcset="
                    https://z1.muscache.cn/im/pictures/miso/Hosting-792178978933830608/original/75a7613c-e435-45fb-9db4-e4163921254b.jpeg?im_w=320 1x,
                    https://z1.muscache.cn/im/pictures/miso/Hosting-792178978933830608/original/75a7613c-e435-45fb-9db4-e4163921254b.jpeg?im_w=720 2x
                  "
                  media="(min-width: 744px)" />
                <source
                  class="s1yu4uxa dir dir-ltr"
                  srcset="
                    https://z1.muscache.cn/im/pictures/miso/Hosting-792178978933830608/original/75a7613c-e435-45fb-9db4-e4163921254b.jpeg?im_w=480 1x,
                    https://z1.muscache.cn/im/pictures/miso/Hosting-792178978933830608/original/75a7613c-e435-45fb-9db4-e4163921254b.jpeg?im_w=960 2x
                  "
                  media="(min-width: 375px)" />
                <source
                  class="s1yu4uxa dir dir-ltr"
                  srcset="
                    https://z1.muscache.cn/im/pictures/miso/Hosting-792178978933830608/original/75a7613c-e435-45fb-9db4-e4163921254b.jpeg?im_w=320 1x,
                    https://z1.muscache.cn/im/pictures/miso/Hosting-792178978933830608/original/75a7613c-e435-45fb-9db4-e4163921254b.jpeg?im_w=720 2x
                  " />
                <img
                  src="https://z1.muscache.cn/im/pictures/miso/Hosting-792178978933830608/original/75a7613c-e435-45fb-9db4-e4163921254b.jpeg?aki_policy=large"
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
                      d="m15.1 1.58-4.13 8.88-9.86 1.27a1 1 0 0 0-.54 1.74l7.3 6.57-1.97 9.85a1 1 0 0 0 1.48 1.06l8.62-5 8.63 5a1 1 0 0 0 1.48-1.06l-1.97-9.85 7.3-6.57a1 1 0 0 0-.55-1.73l-9.86-1.28-4.12-8.88a1 1 0 0 0-1.82 0z"
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
                      d="m15.1 1.58-4.13 8.88-9.86 1.27a1 1 0 0 0-.54 1.74l7.3 6.57-1.97 9.85a1 1 0 0 0 1.48 1.06l8.62-5 8.63 5a1 1 0 0 0 1.48-1.06l-1.97-9.85 7.3-6.57a1 1 0 0 0-.55-1.73l-9.86-1.28-4.12-8.88a1 1 0 0 0-1.82 0z"
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

</details>

<details>

<summary>View the srcResult (img url) returned by AI after parsing the HTML according to our instructions</summary>

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

</details>

**warning**: x-crawl is for legal use only. Any illegal activity using this tool is prohibited. Please be sure to comply with the robots.txt file regulations of the target website. This example is only used to demonstrate the use of x-crawl and is not targeted at a specific website.

## Document

x-crawl latest version documentation:

[English](https://coder-hxl.github.io/x-crawl) | [简体中文](https://coder-hxl.github.io/x-crawl/cn)

x-crawl v9 documentation:

[English](https://github.com/coder-hxl/x-crawl/blob/v9.0.0/README.md) | [简体中文](https://github.com/coder-hxl/x-crawl/blob/v9.0.0/docs/cn.md)
