import type { LiveRoom } from './index'

export type LiveSearchRoomResult = {
  hasMore: boolean
  items: LiveRoom[]
}

export type LiveSearchAnchorResult = {
  hasMore: boolean
  items: LiveAnchorItem[]
}

export type LiveAnchorItem = {
  roomId: string
  avatar: string
  userName: string
  liveStatus: boolean
}
