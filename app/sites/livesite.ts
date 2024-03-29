import {
  type LiveDanmaku,
  LiveStatus,
  type LiveArea,
  type LiveCategory,
  type LiveCategoryResult,
  type LivePlayQuality,
  type LiveRoom,
} from '~/types/live'
import type { LiveSuperChatMessage } from '~/types/live/liveMessage'
import type {
  LiveSearchAnchorResult,
  LiveSearchRoomResult,
} from '~/types/live/liveSearchResult'

class LiveSite {
  id = ''
  name = ''

  getDanmaku(): LiveDanmaku {
    return {} as LiveDanmaku
  }

  async getCategores(page: number, pageSize: number): Promise<LiveCategory[]> {
    return []
  }

  async searchRooms(keyword: string, page = 1): Promise<LiveSearchRoomResult> {
    return { hasMore: false, items: [] }
  }

  async searchAnchors(
    keyword: string,
    page = 1
  ): Promise<LiveSearchAnchorResult> {
    return { hasMore: false, items: [] }
  }

  async getCategoryRooms(
    category: LiveArea,
    page = 1
  ): Promise<LiveCategoryResult> {
    return { hasMore: false, items: [] }
  }

  async getRecommendRooms(page = 1): Promise<LiveCategoryResult> {
    return { hasMore: false, items: [] }
  }

  async getRoomDetail(roomId: string): Promise<LiveRoom> {
    return {
      cover: '',
      platform: '',
      watching: '0',
      roomId: '',
      status: false,
      liveStatus: LiveStatus.offline,
      title: '',
      link: '',
      avatar: '',
      nick: '',
      isRecord: false,
    }
  }

  async getPlayQualites(detail: LiveRoom): Promise<LivePlayQuality[]> {
    return []
  }

  async getPlayUrls(
    detail: LiveRoom,
    quality: LivePlayQuality
  ): Promise<string[]> {
    return []
  }

  async getLiveStatus(roomId: string): Promise<boolean> {
    return false
  }

  async getSuperChatMessage(roomId: string): Promise<LiveSuperChatMessage[]> {
    return []
  }
}
