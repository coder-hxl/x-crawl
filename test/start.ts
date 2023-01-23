import path from 'node:path'

import { fetch, fetchFile } from '../src'
import { IRequestConfig } from '../src/types'

// https://github.com/coder-hxl/airbnb-api

fetch({
  requestConifg: {
    url: 'http://localhost:9001/api/area/阳江市',
    method: 'POST',
    data: {
      type: 'plus',
      offset: 0,
      size: 20
    }
  }
}).then((res) => {
  const { id, name, pictureUrls } = res.data.list[0]
  // console.log(id, name, pictureUrls)

  const requestConifg: IRequestConfig[] = pictureUrls.map((url: string) => ({
    url,
    method: 'GET'
  }))

  fetchFile({
    requestConifg,
    intervalTime: { max: 3000, min: 2000 },
    fileConfig: {
      storeDir: path.resolve(__dirname, './upload'),
      suffix: '.jpg'
    }
  })
})
