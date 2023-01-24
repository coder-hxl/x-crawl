export interface IAreaRoom {
  code: number
  data: {
    list: {
      id: number
      name: string
      price: number
      type: string
      coverUrl: string
      lng: number
      lat: number
      starRating: number
      reviewsCount: number
      bedTypes: string[]
      scoreDesc: string
      pictureUrls: string[]
    }[]
    totalCount: number
  }
}

export interface IBRecommend {
  code: number
  message: string
  ttl: number
  data: {
    item: IBRecommendItem[]
    business_card: any
    floor_info: any
    user_feature: any
    preload_expose_pct: number
    preload_floor_expose_pct: number
    mid: number
  }
}

export interface IBRecommendItem {
  id: number
  bvid: string
  cid: number
  goto: string
  uri: string
  pic: string
  title: string
  duration: number
  pubdate: number
  owner: {
    mid: number
    name: string
    face: string
  }
  stat: {
    view: number
    like: number
    danmaku: number
  }
  av_feature: any
  is_followed: number
  rcmd_reason: {
    reason_type: number
    content?: string
  }
  show_info: number
  track_id: string
  pos: number
  room_info: any
  ogv_info: any
  business_info: any
  is_stock: number
}
