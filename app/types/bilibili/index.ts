export type LiveCategory = {
  name: string
  id: string
  children: LiveArea[]
}

export type LiveArea = {
  platform?: string
  areaType?: string
  typeName?: string
  areaId?: string
  areaName?: string
  areaPic?: string
  shortName?: string
}

export type LiveCategoryResult = {
  hasMore: boolean
  items: LiveRoom[]
}

export type LiveRoom = {
  roomId?: string
  userId: string
  link?: string
  title?: string
  nick?: string
  avatar?: string
  cover?: string
  area?: string
  watching?: string
  followers?: string
  platform: string
  introduction?: string
  notice?: string
  status?: boolean
  data?: any
  danmakuData?: any
  isRecord?: boolean
  liveStatus: LiveStatus
}

export enum LiveStatus {
  live,
  offline,
  replay,
  unknown,
}

export type LivePlayQuality = {
  quality: string
  data: any
  sort?: number
}
