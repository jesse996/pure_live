import ky from 'ky'
import {
  type LiveArea,
  type LiveCategory,
  type LiveCategoryResult,
  type LiveDanmaku,
  type LivePlayQuality,
  type LiveRoom,
  LiveStatus,
} from '~/types/live'
import type { LiveSuperChatMessage } from '~/types/live/liveMessage'
import type {
  LiveAnchorItem,
  LiveSearchAnchorResult,
  LiveSearchRoomResult,
} from '~/types/live/liveSearchResult'
import { LiveSite } from './livesite'

const kDefaultUserAgent =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0'

const kDefaultReferer = 'https://live.douyin.com'

const kDefaultAuthority = 'live.douyin.com'

const headers: Record<string, string> = {
  Authority: kDefaultAuthority,
  Referer: kDefaultReferer,
  'User-Agent': kDefaultUserAgent,
  cookie: '',
  // cookie:
  //   'ttwid=1%7CRPNm2Scn3PaXQUwem3Va3gyzVjcMvTMrSc1Kzk8XzFM%7C1708850650%7Cda2a17849037d3a19d6126286d20f55b83d47806b77643bc4137c3e8a40ae9c2',
}

export class DouyinSite extends LiveSite {
  id = 'douyin'
  name = '抖音直播'
  // settings: SettingsService = Get.find<SettingsService>()

  override getDanmaku(): LiveDanmaku {
    // return new BiliBiliDanmaku()
    return {} as LiveDanmaku
  }

  async getRequestHeaders(): Promise<Record<string, string>> {
    try {
      if (headers.cookie) {
        return headers
      }
      const response = await ky.get('https://live.douyin.com', {
        headers: headers,
      })
      const setCookieHeader = response.headers.get('set-cookie')
      if (setCookieHeader) {
        const cookies = setCookieHeader.split(',')
        for (const cookie of cookies) {
          console.log('cookie', cookie)

          const cookieValue = cookie.split(';')[0]
          if (cookieValue.includes('ttwid')) {
            headers.cookie = cookieValue
            break
          }
        }
      }
      console.log('cookie', headers.cookie)

      return headers
    } catch (e) {
      console.error(e)
      return headers
    }
  }

  override async getCategores(
    page: number,
    pageSize: number
  ): Promise<LiveCategory[]> {
    const categories: LiveCategory[] = []
    const result = await ky
      .get('https://live.douyin.com/', {
        headers: await this.getRequestHeaders(),
      })
      .text()
    const renderData =
      result.match(/\{\\"pathname\\":\\"\/\\",\\"categoryData.*?\]\\n/)?.[0] ??
      ''
    const renderDataJson = JSON.parse(
      renderData
        .trim()
        .replace(/\\"/g, '"')
        .replace(/\\/g, '\\')
        .replace(']\\n', '')
    )
    for (const item of renderDataJson.categoryData) {
      const subs: LiveArea[] = []
      const id = `${item.partition.id_str},${item.partition.type}`
      for (const subItem of item.sub_partition) {
        const subCategory: LiveArea = {
          areaId: `${subItem.partition.id_str},${subItem.partition.type}`,
          typeName: item.partition.title ?? '',
          areaType: id,
          areaName: subItem.partition.title ?? '',
          areaPic: '',
          platform: 'douyin',
        }
        subs.push(subCategory)
      }

      const category: LiveCategory = {
        children: subs,
        id: id,
        name: item.partition.title ?? '',
      }
      subs.unshift({
        areaId: category.id,
        typeName: category.name,
        areaType: category.id,
        areaPic: '',
        areaName: category.name,
        platform: 'douyin',
      })
      categories.push(category)
    }
    // console.log('categories', categories)

    return categories
  }

  override async getCategoryRooms(
    category: LiveArea,
    page = 1
  ): Promise<LiveCategoryResult> {
    const ids = category.areaId?.split(',')
    const partitionId = ids?.[0]!
    const partitionType = ids?.[1]!
    const result = (await ky
      .get('https://live.douyin.com/webcast/web/partition/detail/room/', {
        searchParams: {
          aid: 6383,
          app_name: 'douyin_web',
          live_id: 1,
          device_platform: 'web',
          count: 15,
          offset: (page - 1) * 15,
          partition: partitionId,
          partition_type: partitionType,
          req_from: 2,
        },
        headers: await this.getRequestHeaders(),
      })
      .json()) as any
    const hasMore = (result.data.data as any[]).length >= 15
    const items: LiveRoom[] = []
    for (const item of result.data.data) {
      const roomItem: LiveRoom = {
        roomId: item.web_rid,
        title: item.room.title.toString(),
        cover: item.room.cover.url_list[0].toString(),
        nick: item.room.owner.nickname.toString(),
        liveStatus: LiveStatus.live,
        avatar: item.room.owner.avatar_thumb.url_list[0].toString(),
        status: true,
        platform: 'douyin',
        area: item.tag_name.toString(),
        watching: item.room?.room_view_stats?.display_value.toString() ?? '',
      }
      items.push(roomItem)
    }
    return { hasMore: hasMore, items: items }
  }

  override async getRecommendRooms(page = 1) {
    const result: any = await ky
      .get('https://live.douyin.com/webcast/web/partition/detail/room/', {
        searchParams: {
          aid: 6383,
          app_name: 'douyin_web',
          live_id: 1,
          device_platform: 'web',
          count: 15,
          offset: (page - 1) * 15,
          partition: 720,
          partition_type: 1,
        },
        headers: await this.getRequestHeaders(),
      })
      .json()

    const hasMore = (result.data.data as any[]).length >= 15
    const items: any[] = []

    for (const item of result.data.data) {
      const roomItem = {
        roomId: item.web_rid,
        title: item.room.title.toString(),
        cover: item.room.cover.url_list[0].toString(),
        nick: item.room.owner.nickname.toString(),
        platform: 'douyin',
        area: item.tag_name ?? '热门推荐',
        avatar: item.room.owner.avatar_thumb.url_list[0].toString(),
        watching: item.room?.room_view_stats?.display_value.toString() ?? '',
        liveStatus: 'live',
      }
      items.push(roomItem)
    }
    return { hasMore: hasMore, items: items }
  }

  override async getRoomDetail(roomId: string): Promise<LiveRoom> {
    try {
      const detail = await this.getRoomWebDetail(roomId)
      const requestHeader = await this.getRequestHeaders()
      const webRid = roomId
      const realRoomId = detail.roomStore.roomInfo.room.id_str.toString()
      const userUniqueId = detail.userStore.odin.user_unique_id.toString()
      const result: any = await ky
        .get('https://live.douyin.com/webcast/room/web/enter/', {
          searchParams: {
            aid: 6383,
            app_name: 'douyin_web',
            live_id: 1,
            device_platform: 'web',
            enter_from: 'web_live',
            web_rid: webRid,
            room_id_str: realRoomId,
            enter_source: '',
            'Room-Enter-User-Login-Ab': 0,
            is_need_double_stream: false,
            cookie_enabled: true,
            screen_width: 1980,
            screen_height: 1080,
            browser_language: 'zh-CN',
            browser_platform: 'Win32',
            browser_name: 'Edge',
            browser_version: '120.0.0.0',
          },
          headers: requestHeader,
        })
        .json()

      const roomInfo = result.data.data[0]
      const userInfo = result.data.user
      const partition = result.data.partition_road_map
      const roomStatus = (roomInfo.status ?? 0) === 2
      const liveRoom = {
        roomId: roomId,
        title: roomInfo.title.toString(),
        cover: roomStatus ? roomInfo.cover.url_list[0].toString() : '',
        nick: userInfo.nickname.toString(),
        avatar: userInfo.avatar_thumb.url_list[0].toString(),
        watching: roomInfo?.room_view_stats?.display_value.toString() ?? '',
        liveStatus: roomStatus ? LiveStatus.live : LiveStatus.offline,
        link: `https://live.douyin.com/${webRid}`,
        area: partition?.partition?.title.toString() ?? '',
        status: roomStatus,
        platform: 'douyin',
        introduction: roomInfo.title.toString(),
        notice: '',
        danmakuData: {
          webRid: webRid,
          roomId: realRoomId,
          userId: userUniqueId,
          cookie: requestHeader.cookie,
        },
        data: roomInfo.stream_url,
      }
      return liveRoom
    } catch (e) {
      console.log(e)
      throw e

      // let liveRoom = this.settings.getLiveRoomByRoomId(roomId);
      // liveRoom.liveStatus = 'offline';
      // liveRoom.status = false;
      // return liveRoom;
    }
  }

  async getRoomWebDetail(webRid: string) {
    const headResp: any = await ky.head(`https://live.douyin.com/${webRid}`, {
      headers: await this.getRequestHeaders(),
    })

    let dyCookie = ''
    for (const element of headResp.headers.get('set-cookie')?.split(',') ??
      []) {
      const cookie = element.split(';')[0]
      if (cookie.includes('ttwid') || cookie.includes('__ac_nonce')) {
        dyCookie += `${cookie};`
        // console.log('cookie', dyCookie)
      }
    }
    console.log('cookie', dyCookie)
    console.log('webRid', webRid)

    const result: any = await ky
      .get(`https://live.douyin.com/${webRid}`, {
        headers: {
          Authority: kDefaultAuthority,
          Referer: kDefaultReferer,
          Cookie: dyCookie,
          'User-Agent': kDefaultUserAgent,
        },
      })
      .text()

    const renderData =
      result.match(/\{\\"state\\":\{\\"isLiveModal.*?\]\\n/)?.[0] || '{}'
    const str = renderData
      .trim()
      .replace(/\\"/g, '"')
      .replace(/\\\\/g, '\\')
      .replace(']\\n', '')

    const renderDataJson = JSON.parse(str ?? '{}')

    return renderDataJson.state
  }
  override async getPlayQualites(detail: LiveRoom): Promise<LivePlayQuality[]> {
    const qualities = []
    const qualityData = JSON.parse(
      detail.data.live_core_sdk_data.pull_data.stream_data
    ).data
    const qulityList =
      detail.data.live_core_sdk_data.pull_data.options.qualities
    for (const quality of qulityList) {
      const qualityItem = {
        quality: quality.name,
        sort: quality.level,
        data: [
          qualityData[quality.sdk_key].main.flv.toString(),
          qualityData[quality.sdk_key].main.hls.toString(),
        ],
      }
      qualities.push(qualityItem)
    }
    qualities.sort((a: any, b: any) => b.sort - a.sort)
    return qualities
  }

  override async getPlayUrls(
    detail: LiveRoom,
    quality: LivePlayQuality
  ): Promise<string[]> {
    return quality.data
  }

  override async searchRooms(
    keyword: string,
    page = 1
  ): Promise<LiveSearchRoomResult> {
    const serverUrl = 'https://www.douyin.com/aweme/v1/web/live/search/'
    const uri = new URL(serverUrl)
    uri.searchParams.set('device_platform', 'webapp')
    uri.searchParams.set('aid', '6383')
    uri.searchParams.set('channel', 'channel_pc_web')
    uri.searchParams.set('search_channel', 'aweme_live')
    uri.searchParams.set('keyword', keyword)
    uri.searchParams.set('search_source', 'switch_tab')
    uri.searchParams.set('query_correct_type', '1')
    uri.searchParams.set('is_filter_search', '0')
    uri.searchParams.set('from_group_id', '')
    uri.searchParams.set('offset', ((page - 1) * 10).toString())
    uri.searchParams.set('count', '10')
    uri.searchParams.set('pc_client_type', '1')
    uri.searchParams.set('version_code', '170400')
    uri.searchParams.set('version_name', '17.4.0')
    uri.searchParams.set('cookie_enabled', 'true')
    uri.searchParams.set('screen_width', '1980')
    uri.searchParams.set('screen_height', '1080')
    uri.searchParams.set('browser_language', 'zh-CN')
    uri.searchParams.set('browser_platform', 'Win32')
    uri.searchParams.set('browser_name', 'Edge')
    uri.searchParams.set('browser_version', '120.0.0.0')
    uri.searchParams.set('browser_online', 'true')
    uri.searchParams.set('engine_name', 'Blink')
    uri.searchParams.set('engine_version', '120.0.0.0')
    uri.searchParams.set('os_name', 'Windows')
    uri.searchParams.set('os_version', '10')
    uri.searchParams.set('cpu_core_num', '12')
    uri.searchParams.set('device_memory', '8')
    uri.searchParams.set('platform', 'PC')
    uri.searchParams.set('downlink', '10')
    uri.searchParams.set('effective_type', '4g')
    uri.searchParams.set('round_trip_time', '100')
    uri.searchParams.set('webid', '7273033021933946427')

    const requlestUrl = await this.signUrl(uri.toString())
    const headResp: any = await ky.head('https://live.douyin.com', {
      headers: headers,
    })
    let dyCookie = ''
    const setCookieHeader = headResp.headers.get('set-cookie')
    if (setCookieHeader) {
      const cookies = setCookieHeader.split(',')
      for (const element of cookies) {
        const cookie = element.split(';')[0]
        if (cookie.includes('ttwid')) {
          dyCookie += `${cookie};`
        }
        if (cookie.includes('__ac_nonce')) {
          dyCookie += `${cookie};`
        }
      }
    }

    const result: any = await ky
      .get(requlestUrl, {
        headers: {
          Accept: '*/*',
          Authority: 'www.douyin.com',
          Referer: requlestUrl,
          Cookie: dyCookie,
          'User-Agent': kDefaultUserAgent,
        },
      })
      .json()

    if (result === 'blocked') {
      throw new Error('抖音直播搜索被限制，请稍后再试')
    }

    const items = []
    const queryList = result.data ?? []
    for (const item of queryList) {
      const itemData = JSON.parse(item.lives.rawdata.toString())
      const roomStatus = (itemData.status ?? 0) === 2
      const roomItem = {
        roomId: itemData.owner.web_rid.toString(),
        title: itemData.title.toString(),
        cover: itemData.cover.url_list[0].toString(),
        nick: itemData.owner.nickname.toString(),
        platform: 'douyin',
        avatar: itemData.owner.avatar_thumb.url_list[0].toString(),
        liveStatus: roomStatus ? LiveStatus.live : LiveStatus.offline,
        area: '',
        status: roomStatus,
        watching: itemData.stats.total_user_str.toString(),
      }
      items.push(roomItem)
    }
    return { hasMore: queryList.length > 0, items: items }
  }

  override async searchAnchors(keyword: string, page = 1): Promise<any> {
    throw new Error('抖音暂不支持搜索主播，请直接搜索直播间')
  }

  override async getLiveStatus(roomId: string): Promise<boolean> {
    const result = await this.getRoomDetail(roomId)
    return result.status!
  }

  override getSuperChatMessage(roomId: string): Promise<Array<any>> {
    return Promise.resolve([])
  }

  generateRandomString(length: number): string {
    const random = crypto.getRandomValues(new Uint8Array(length))
    const values = Array.from(random, (v) => v % 16)
    const stringBuffer = values.map((v) => v.toString(16)).join('')
    return stringBuffer
  }

  async signUrl(url: string): Promise<string> {
    try {
      const signResult: any = await ky
        .post('https://tk.nsapps.cn/', {
          headers: { 'Content-Type': 'application/json' },
          json: { url: url, userAgent: kDefaultUserAgent },
        })
        .json()

      const requlestUrl = `${signResult.data.url}&msToken=${encodeURIComponent(
        signResult.data.mstoken
      )}`
      return requlestUrl
    } catch (e) {
      console.error(e)
      return url
    }
  }
}
