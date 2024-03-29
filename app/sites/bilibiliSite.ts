import ky from 'ky'
import {
  LiveStatus,
  type LiveArea,
  type LiveCategory,
  type LiveCategoryResult,
  type LiveDanmaku,
  type LivePlayQuality,
  type LiveRoom,
} from '~/types/live'
import type { LiveSuperChatMessage } from '~/types/live/liveMessage'
import type {
  LiveAnchorItem,
  LiveSearchAnchorResult,
  LiveSearchRoomResult,
} from '~/types/live/liveSearchResult'
import { LiveSite } from './livesite'

export class BiliBiliSite extends LiveSite {
  id = 'bilibili'
  name = '哔哩哔哩直播'
  cookie = ''
  userId = 0
  // settings: SettingsService = Get.find<SettingsService>()

  getDanmaku(): LiveDanmaku {
    // return new BiliBiliDanmaku()
    return {} as LiveDanmaku
  }

  async getCategores(page: number, pageSize: number): Promise<LiveCategory[]> {
    const categories: LiveCategory[] = []
    const result = (await ky
      .get('https://api.live.bilibili.com/room/v1/Area/getList', {
        searchParams: {
          need_entrance: 1,
          parent_id: 0,
        },
        headers: this.cookie ? { cookie: this.cookie } : undefined,
      })
      .json()) as any as any

    for (const item of result.data) {
      const subs: LiveArea[] = []
      for (const subItem of item.list) {
        const subCategory: LiveArea = {
          areaId: subItem.id.toString(),
          areaName: subItem.name ?? '',
          areaType: subItem.parent_id ?? '',
          typeName: subItem.parent_name ?? '',
          areaPic: `${subItem.pic ?? ''}@100w.png`,
          platform: 'bilibili',
        }
        subs.push(subCategory)
      }
      const category: LiveCategory = {
        children: subs,
        id: item.id.toString(),
        name: item.name ?? '',
      }
      categories.push(category)
    }
    return categories
  }

  async getCategoryRooms(
    category: LiveArea,
    page = 1
  ): Promise<LiveCategoryResult> {
    const result = (await ky
      .get(
        'https://api.live.bilibili.com/xlive/web-interface/v1/second/getList',
        {
          searchParams: {
            platform: 'web',
            parent_area_id: category.areaType ?? '',
            area_id: category.areaId ?? '',
            sort_type: '',
            page: page,
          },
          headers: this.cookie ? { cookie: this.cookie } : undefined,
        }
      )
      .json()) as any as any

    const hasMore = result.data.has_more === 1
    const items: LiveRoom[] = []
    for (const item of result.data.list) {
      const roomItem: LiveRoom = {
        roomId: item.roomid.toString(),
        title: item.title.toString(),
        cover: `${item.cover}@400w.jpg`,
        nick: item.uname.toString(),
        avatar: item.face.toString(),
        watching: item.online.toString(),
        liveStatus: LiveStatus.live,
        area: item.area_name.toString(),
        status: true,
        platform: 'bilibili',
      }
      items.push(roomItem)
    }
    return { hasMore, items }
  }

  async getPlayQualites(detail: LiveRoom): Promise<LivePlayQuality[]> {
    const qualities: LivePlayQuality[] = []
    const result = (await ky
      .get(
        'https://api.live.bilibili.com/xlive/web-room/v2/index/getRoomPlayInfo',
        {
          searchParams: {
            room_id: detail.roomId ?? '',
            protocol: '0,1',
            format: '0,1,2',
            codec: '0,1',
            platform: 'web',
          },
          headers: this.cookie ? { cookie: this.cookie } : undefined,
        }
      )
      .json()) as any

    const qualitiesMap: { [key: number]: string } = {}
    for (const item of result.data.playurl_info.playurl.g_qn_desc) {
      qualitiesMap[Number.parseInt(item.qn.toString()) || 0] =
        item.desc.toString()
    }

    for (const item of result.data.playurl_info.playurl.stream[0].format[0]
      .codec[0].accept_qn) {
      const qualityItem: LivePlayQuality = {
        quality: qualitiesMap[item] || '未知清晰度',
        data: item,
      }
      qualities.push(qualityItem)
    }
    return qualities
  }

  async getPlayUrls(
    detail: LiveRoom,
    quality: LivePlayQuality
  ): Promise<string[]> {
    const urls: string[] = []
    const result = (await ky
      .get(
        'https://api.live.bilibili.com/xlive/web-room/v2/index/getRoomPlayInfo',
        {
          searchParams: {
            room_id: detail.roomId ?? '',
            protocol: '0,1',
            format: '0,2',
            codec: '0',
            platform: 'web',
            qn: quality.data,
          },
          headers: this.cookie ? { cookie: this.cookie } : undefined,
        }
      )
      .json()) as any

    const streamList = result.data.playurl_info.playurl.stream

    for (const streamItem of streamList) {
      const formatList = streamItem.format
      for (const formatItem of formatList) {
        const formatName = formatItem.format_name
        const codecList = formatItem.codec
        if (formatName !== 'flv') {
          for (const codecItem of codecList) {
            const urlList = codecItem.url_info
            const baseUrl = codecItem.base_url.toString()

            for (const urlItem of urlList) {
              urls.push(`${urlItem.host}${baseUrl}${urlItem.extra}`)
            }
          }
        }
      }
    }
    // 对链接进行排序，包含mcdn的在后
    urls.sort((a, b) => {
      if (a.includes('mcdn')) {
        return 1
      }
      return -1
    })
    return urls
  }

  async getRecommendRooms(page = 1): Promise<LiveCategoryResult> {
    const result = (await ky
      .get(
        'https://api.live.bilibili.com/xlive/web-interface/v1/second/getListByArea',
        {
          searchParams: {
            platform: 'web',
            sort: 'online',
            page_size: 30,
            page: page,
          },
          headers: this.cookie
            ? undefined
            : {
                cookie: this.cookie,
              },
        }
      )
      .json()) as any

    const hasMore = (result.data.list as Array<any>).length > 0
    const items: LiveRoom[] = result.data.list.map((item: any) => ({
      roomId: item.roomid.toString(),
      title: item.title.toString(),
      cover: `${item.cover}@400w.jpg`,
      area: item.area_name.toString(),
      nick: item.uname.toString(),
      avatar: item.face.toString(),
      watching: item.online.toString(),
      liveStatus: LiveStatus.live,
      platform: 'bilibili',
    }))

    return { hasMore, items }
  }

  async getRoomDetail(roomId: string): Promise<LiveRoom> {
    const result = (await ky
      .get(
        'https://api.live.bilibili.com/xlive/web-room/v1/index/getH5InfoByRoom',
        {
          searchParams: {
            room_id: roomId,
          },
          headers: this.cookie
            ? undefined
            : {
                cookie: this.cookie,
              },
        }
      )
      .json()) as any as any

    const roomDanmakuResult = (await ky
      .get(
        'https://api.live.bilibili.com/xlive/web-room/v1/index/getDanmuInfo',
        {
          searchParams: {
            id: roomId,
          },
          headers: this.cookie
            ? undefined
            : {
                cookie: this.cookie,
              },
        }
      )
      .json()) as any as any

    const buvid = await this.getBuvid()
    const serverHosts = (roomDanmakuResult.data.host_list as Array<any>).map(
      (e) => e.host.toString()
    )

    return {
      roomId: roomId,
      title: result.data.room_info.title.toString(),
      cover: result.data.room_info.cover.toString(),
      nick: result.data.anchor_info.base_info.uname.toString(),
      avatar: `${result.data.anchor_info.base_info.face}@100w.jpg`,
      watching: result.data.room_info.online.toString(),
      area: result.data.room_info.area_name.toString(),
      status: ((result.data.room_info.live_status as number) || 0) === 1,
      liveStatus:
        ((result.data.room_info.live_status as number) || 0) === 1
          ? LiveStatus.live
          : LiveStatus.offline,
      link: `https://live.bilibili.com/${roomId}`,
      introduction: result.data.room_info.description.toString(),
      notice: '',
      platform: 'bilibili',
      danmakuData: {
        roomId: (result.data.room_info.room_id as number) || 0,
        uid: this.userId,
        token: roomDanmakuResult.data.token.toString(),
        serverHost:
          serverHosts.length > 0
            ? serverHosts[0]
            : 'broadcastlv.chat.bilibili.com',
        buvid: buvid,
        cookie: this.cookie,
      },
    }
  }

  async searchRooms(keyword: string, page = 1): Promise<LiveSearchRoomResult> {
    const result = (await ky
      .get(
        'https://api.bilibili.com/x/web-interface/search/type?context=&search_type=live&cover_type=user_cover',
        {
          searchParams: {
            order: '',
            keyword: keyword,
            category_id: '',
            __refresh__: '',
            _extra: '',
            highlight: 0,
            single_column: 0,
            page: page,
          },
          headers: this.cookie
            ? { cookie: 'buvid3=infoc;' }
            : {
                cookie: this.cookie,
              },
        }
      )
      .json()) as any

    const items: LiveRoom[] = []
    const queryList = result.data.result.live_room || []
    for (const item of queryList) {
      let title = item.title.toString()
      // Remove <em></em> tags from title
      title = title.replace(/<.*?em.*?>/g, '')
      const roomItem: LiveRoom = {
        roomId: item.roomid.toString(),
        title: title,
        cover: `https:${item.cover}@400w.jpg`,
        nick: item.uname.toString(),
        watching: item.online.toString(),
        liveStatus:
          (item.live_status || 0) === 1 ? LiveStatus.live : LiveStatus.offline,
        area: item.cate_name.toString(),
        status: (item.live_status || 0) === 1,
        avatar: `https:${item.uface}@400w.jpg`,
        platform: 'bilibili',
      }
      items.push(roomItem)
    }
    return { hasMore: queryList.length > 0, items }
  }

  async searchAnchors(
    keyword: string,
    page = 1
  ): Promise<LiveSearchAnchorResult> {
    const result = (await ky
      .get(
        'https://api.bilibili.com/x/web-interface/search/type?context=&search_type=live_user&cover_type=user_cover',
        {
          searchParams: {
            order: '',
            keyword: keyword,
            category_id: '',
            __refresh__: '',
            _extra: '',
            highlight: 0,
            single_column: 0,
            page: page,
          },
          headers: this.cookie
            ? { cookie: 'buvid3=infoc;' }
            : {
                cookie: this.cookie,
              },
        }
      )
      .json()) as any

    const items: LiveAnchorItem[] = []
    for (const item of result.data.result || []) {
      let uname = item.uname.toString()
      // Remove <em></em> tags from uname
      uname = uname.replace(/<.*?em.*?>/g, '')
      const anchorItem: LiveAnchorItem = {
        roomId: item.roomid.toString(),
        avatar: `https:${item.uface}@400w.jpg`,
        userName: uname,
        liveStatus: item.is_live,
      }
      items.push(anchorItem)
    }
    return { hasMore: items.length >= 40, items }
  }

  async getLiveStatus(roomId: string): Promise<boolean> {
    const result = (await ky
      .get('https://api.live.bilibili.com/room/v1/Room/get_info', {
        searchParams: {
          room_id: roomId,
        },
        headers: this.cookie
          ? undefined
          : {
              cookie: this.cookie,
            },
      })
      .json()) as any

    return (result.data.live_status ?? 0) === 1
  }

  async getSuperChatMessage(roomId: string): Promise<LiveSuperChatMessage[]> {
    const result = (await ky
      .get('https://api.live.bilibili.com/av/v1/SuperChat/getMessageList', {
        searchParams: {
          room_id: roomId,
        },
        headers: this.cookie
          ? undefined
          : {
              cookie: this.cookie,
            },
      })
      .json()) as any

    const messages: LiveSuperChatMessage[] = []
    for (const item of result.data.list ?? []) {
      const message: LiveSuperChatMessage = {
        backgroundBottomColor: item.background_bottom_color.toString(),
        backgroundColor: item.background_color.toString(),
        endTime: new Date(item.end_time * 1000),
        face: `${item.user_info.face}@200w.jpg`,
        message: item.message.toString(),
        price: item.price,
        startTime: new Date(item.start_time * 1000),
        userName: item.user_info.uname.toString(),
      }
      messages.push(message)
    }
    return messages
  }

  async getBuvid(): Promise<string> {
    try {
      if (this.cookie.includes('buvid3')) {
        const match = this.cookie.match(/buvid3=(.*?);/)
        return match ? match[1] : ''
      }

      const result = (await ky
        .get('https://api.bilibili.com/x/frontend/finger/spi', {
          headers: this.cookie
            ? undefined
            : {
                cookie: this.cookie,
              },
        })
        .json()) as any

      return result.data.b_3.toString()
    } catch (e) {
      return ''
    }
  }
}
