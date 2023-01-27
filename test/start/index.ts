import path from 'node:path'

import XCrawl from '../../src'

import { IRequestConfig } from '../../src/types'
import { IAreaRoom, IBRecommend } from './types'

// 1. 爬取 房间数据
// https://github.com/coder-hxl/airbnb-api

const roomXCrawl = new XCrawl({
  timeout: 10000,
  intervalTime: {
    max: 3000,
    min: 1000
  }
})

function areaRoomData() {
  roomXCrawl
    .fetch<IAreaRoom>({
      requestConifg: {
        url: 'http://localhost:9001/api/area/阳江市',
        method: 'POST',
        data: {
          type: 'plus',
          offset: 0,
          size: 20
        }
      }
    })
    .then((areaData) => {
      const { id, pictureUrls } = areaData.data.list[0]
      console.log('areaData Id: ', id)

      const requestConifg: IRequestConfig[] = pictureUrls.map((url) => ({
        url,
        method: 'GET'
      }))

      roomXCrawl.fetchFile({
        requestConifg,
        fileConfig: { storeDir: path.resolve(__dirname, './upload') }
      })
    })
}
// areaRoomData()

// ==================================================

// 2. 爬取 b站 数据

// 2.1 JSON: b站首页推荐视频的封面图
/*
  https://api.bilibili.com/x/web-interface/wbi/index/top/feed/rcmd?y_num=5&fresh_type=3&feed_version=V8&fresh_idx_1h=1&fetch_row=1&fresh_idx=1&brush=0&homepage_ver=1&ps=10&outside_trigger=&w_rid=921db33671365ec8b9f7cab1971a3834&wts=1674553870
*/

const bilibiliXCrawl = new XCrawl({
  timeout: 10000,
  intervalTime: {
    max: 1500,
    min: 1000
  }
})

function bilibiliRecommendData() {
  bilibiliXCrawl
    .fetch<IBRecommend>({
      requestConifg: {
        url: 'https://api.bilibili.com/x/web-interface/wbi/index/top/feed/rcmd',
        method: 'GET',
        params: {
          y_num: 5,
          fresh_type: 3,
          feed_version: 'V8',
          fresh_idx_1h: 1,
          fetch_row: 1,
          fresh_idx: 1,
          brush: 0,
          homepage_ver: 1,
          ps: 10,
          outside_trigger: '',
          w_rid: '2e4be8e9830ecd780c5b0ff2bef805c9',
          wts: 1674556002
        },
        headers: {}
      }
    })
    .then((res) => {
      const pictureUrls: IRequestConfig[] = res.data.item.map((item) => ({
        url: item.pic,
        method: 'GET'
      }))

      bilibiliXCrawl.fetchFile({
        requestConifg: pictureUrls,
        intervalTime: { max: 3000, min: 2000 },
        fileConfig: { storeDir: path.resolve(__dirname, './upload') }
      })
    })
}
// bilibiliRecommendData()

// 2.2 HTML: b站首页标题
// 采用 jsdom 对 HTML String 解析

function bilibiliHTMLData() {
  bilibiliXCrawl.fetchHTML('https://www.bilibili.com/').then((dom) => {
    console.log(dom.window.document.querySelector('title')?.textContent)
  })
}
bilibiliHTMLData()
