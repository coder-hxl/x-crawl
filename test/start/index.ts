import path from 'node:path'

import XCrawl from '../../src'

import { IRequestConfig } from '../../src/types'
import { IAreaRoom, IBRecommend } from './types'

// 1. 房间数据
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

// 2 HTML: GitHub Docs
// 采用 jsdom 对 HTML String 解析

const githubDocsXCrawl = new XCrawl({
  timeout: 10000,
  intervalTime: {
    max: 3000,
    min: 1000
  }
})

async function githubDocs() {
  const dom = await githubDocsXCrawl.fetchHTML('https://docs.github.com/zh')

  console.log(dom.window.document.querySelector('title')?.textContent)
}

// githubDocs()
