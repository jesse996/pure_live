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

import CryptoJS from 'crypto-js'

const kUserAgent =
  'Mozilla/5.0 (Linux; Android 11; Pixel 5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.91 Mobile Safari/537.36 Edg/117.0.0.0'

export class HuyaSite extends LiveSite {
  id = 'huya'
  name = '虎牙直播'
  // settings: SettingsService = Get.find<SettingsService>()

  override getDanmaku(): LiveDanmaku {
    // return new BiliBiliDanmaku()
    return {} as LiveDanmaku
  }

  override async getCategores(page: number, pageSize: number): Promise<any> {
    const categories = [
      { id: '1', name: '网游', children: [] as any[] },
      { id: '2', name: '单机', children: [] as any[] },
      { id: '8', name: '娱乐', children: [] as any[] },
      { id: '3', name: '手游', children: [] as any[] },
    ]

    for (const item of categories) {
      const items = await this.getSubCategores(item)
      item.children.push(...items)
    }
    return categories
  }

  async getSubCategores(liveCategory: any): Promise<any> {
    const result = (await ky
      .get('https://live.cdn.huya.com/liveconfig/game/bussLive', {
        searchParams: {
          bussType: liveCategory.id,
        },
      })
      .json()) as any as any

    const subs = []
    for (const item of result.data) {
      const gid = item.gid.toString()
      const subCategory = {
        areaId: gid,
        areaName: item.gameFullName.toString(),
        areaType: liveCategory.id,
        platform: 'huya',
        areaPic: `https://huyaimg.msstatic.com/cdnimage/game/${gid}-MS.jpg`,
        typeName: liveCategory.name,
      }
      subs.push(subCategory)
    }

    return subs
  }

  override async getCategoryRooms(category: any, page = 1): Promise<any> {
    const result = (await ky
      .get('https://www.huya.com/cache.php', {
        searchParams: {
          m: 'LiveList',
          do: 'getLiveListByPage',
          tagAll: 0,
          gameId: category.areaId,
          page: page,
        },
      })
      .json()) as any as any

    const items = []
    for (const item of result.data.datas) {
      let cover = item.screenshot.toString()
      if (!cover.includes('?')) {
        cover += '?x-oss-process=style/w338_h190&'
      }
      let title = item.introduction?.toString() ?? ''
      if (title === '') {
        title = item.roomName?.toString() ?? ''
      }
      const roomItem = {
        roomId: item.profileRoom.toString(),
        title: title,
        cover: cover,
        nick: item.nick.toString(),
        watching: item.totalCount.toString(),
        avatar: item.avatar180,
        area: item.gameFullName.toString(),
        liveStatus: 'live',
        status: true,
        platform: 'huya',
      }
      items.push(roomItem)
    }
    const hasMore = result.data.page < result.data.totalPage
    return { hasMore, items }
  }

  override async getPlayQualites(detail: any): Promise<any[]> {
    const qualities: any[] = []
    const urlData = detail.data
    if (urlData.bitRates.length === 0) {
      urlData.bitRates = [
        { name: '原画', bitRate: 0 },
        { name: '高清', bitRate: 2000 },
      ]
    }
    for (const item of urlData.bitRates) {
      const urls: string[] = []
      for (const line of urlData.lines) {
        let src = line.line
        src += `/${line.streamName}`
        if (line.lineType === 'flv') {
          src += '.flv'
        }
        if (line.lineType === 'hls') {
          src += '.m3u8'
        }
        const parms = this.processAnticode(
          line.lineType === 'flv' ? line.flvAntiCode : line.hlsAntiCode,
          urlData.uid,
          line.streamName
        )
        src += `?${parms}`
        if (item.bitRate > 0) {
          src += `&ratio=${item.bitRate}`
        }
        urls.push(src)
      }
      qualities.push({
        data: urls,
        quality: item.name,
      })
    }

    return qualities
  }

  override async getPlayUrls(detail: any, quality: any): Promise<string[]> {
    return quality.data
  }

  override async getRecommendRooms(page = 1): Promise<any> {
    const result = (await ky
      .get('https://www.huya.com/cache.php', {
        searchParams: {
          m: 'LiveList',
          do: 'getLiveListByPage',
          tagAll: 0,
          page: page,
        },
      })
      .json()) as any

    const items = []
    for (const item of result.data.datas) {
      let cover = item.screenshot.toString()
      if (!cover.includes('?')) {
        cover += '?x-oss-process=style/w338_h190&'
      }
      let title = item.introduction?.toString() ?? ''
      if (title === '') {
        title = item.roomName?.toString() ?? ''
      }
      const roomItem = {
        roomId: item.profileRoom.toString(),
        title: title,
        cover: cover,
        area: item.gameFullName.toString(),
        nick: item.nick.toString(),
        avatar: item.avatar180,
        watching: item.totalCount.toString(),
        platform: 'huya',
        liveStatus: 'live',
        status: true,
      }
      items.push(roomItem)
    }
    const hasMore = result.data.page < result.data.totalPage
    return { hasMore, items }
  }

  override async getRoomDetail(roomId: string): Promise<any> {
    const resultText = await ky
      .get(`https://m.huya.com/${roomId}`, {
        headers: {
          'user-agent': kUserAgent,
        },
      })
      .text()

    try {
      const text = /window\.HNF_GLOBAL_INIT.=.\{(.*?)\}.<\/script>/.exec(
        resultText
      )?.[1]
      const jsonObj = JSON.parse(`{${text}}`)

      let title = jsonObj.roomInfo.tLiveInfo.sIntroduction?.toString() ?? ''
      if (title === '') {
        title = jsonObj.roomInfo.tLiveInfo.sRoomName?.toString() ?? ''
      }

      const huyaLines = []
      const huyaBiterates = []

      //读取可用线路
      const lines = jsonObj.roomInfo.tLiveInfo.tLiveStreamInfo.vStreamInfo.value
      for (const item of lines) {
        if ((item.sFlvUrl?.toString() ?? '').length > 0) {
          if (
            item.iPCPriorityRate > -1 ||
            item.iWebPriorityRate > -1 ||
            item.iMobilePriorityRate > -1
          ) {
            huyaLines.push({
              line: item.sFlvUrl.toString(),
              lineType: 'flv',
              flvAntiCode: item.sFlvAntiCode.toString(),
              hlsAntiCode: item.sHlsAntiCode.toString(),
              streamName: item.sStreamName.toString(),
            })
          }
        }
      }

      //清晰度
      const biterates =
        jsonObj.roomInfo.tLiveInfo.tLiveStreamInfo.vBitRateInfo.value
      for (const item of biterates) {
        const name = item.sDisplayName.toString()
        if (name.includes('HDR')) {
          continue
        }
        if (
          huyaBiterates.map((e) => e.name).every((element) => element !== name)
        ) {
          huyaBiterates.push({
            bitRate: item.iBitRate,
            name: name,
          })
        }
      }

      const topSid = Number.parseInt(
        /lChannelId":([0-9]+)/.exec(resultText)?.[1] ?? '0'
      )
      const subSid = Number.parseInt(
        /lSubChannelId":([0-9]+)/.exec(resultText)?.[1] ?? '0'
      )

      return {
        cover: jsonObj.roomInfo.tLiveInfo.sScreenshot.toString(),
        watching: jsonObj.roomInfo.tLiveInfo.lTotalCount.toString(),
        roomId: roomId,
        area: jsonObj.roomInfo.tLiveInfo.sGameFullName.toString() ?? '',
        title: title,
        nick: jsonObj.roomInfo.tProfileInfo.sNick.toString(),
        avatar: jsonObj.roomInfo.tProfileInfo.sAvatar180.toString(),
        introduction: jsonObj.roomInfo.tLiveInfo.sIntroduction.toString(),
        notice: jsonObj.welcomeText.toString(),
        status: jsonObj.roomInfo.eLiveStatus === 2,
        liveStatus: jsonObj.roomInfo.eLiveStatus === 2 ? 'live' : 'offline',
        platform: 'huya',
        data: {
          url: `https:${Buffer.from(
            jsonObj.roomProfile.liveLineUrl.toString(),
            'base64'
          ).toString()}`,
          lines: huyaLines,
          bitRates: huyaBiterates,
          uid: this.getUid(13, 10),
        },
        danmakuData: {
          ayyuid: jsonObj.roomInfo.tLiveInfo.lYyid ?? 0,
          topSid: topSid ?? 0,
          subSid: subSid ?? 0,
        },
        link: `https://www.huya.com/${roomId}`,
      }
    } catch (e) {
      throw new Error('获取房间信息失败')
      // const liveRoom = settings.getLiveRoomByRoomId(roomId);
      // liveRoom.liveStatus = 'offline';
      // liveRoom.status = false;
      // return liveRoom;
    }
  }

  override async searchRooms(keyword: string, page = 1): Promise<any> {
    const resultText = (await ky
      .get('https://search.cdn.huya.com/', {
        searchParams: {
          m: 'Search',
          do: 'getSearchContent',
          q: keyword,
          uid: 0,
          v: 4,
          typ: -5,
          livestate: 0,
          rows: 20,
          start: (page - 1) * 20,
        },
      })
      .json()) as any

    const result = JSON.parse(resultText)
    const items = []
    const queryList = result.response['3'].docs ?? []
    for (const item of queryList) {
      let cover = item.game_screenshot.toString()
      if (!cover.includes('?')) {
        cover += '?x-oss-process=style/w338_h190&'
      }

      let title = item.game_introduction?.toString() ?? ''
      if (title === '') {
        title = item.game_roomName?.toString() ?? ''
      }
      const roomItem = {
        roomId: item.room_id.toString(),
        title: title,
        cover: cover,
        nick: item.game_nick.toString(),
        area: item.gameName.toString(),
        status: true,
        liveStatus: 'live',
        avatar: item.game_imgUrl.toString(),
        watching: item.game_total_count.toString(),
        platform: 'huya',
      }
      items.push(roomItem)
    }
    return { hasMore: queryList.length > 0, items: items }
  }

  override async searchAnchors(keyword: string, page = 1): Promise<any> {
    const resultText = (await ky
      .get('https://search.cdn.huya.com/', {
        searchParams: {
          m: 'Search',
          do: 'getSearchContent',
          q: keyword,
          uid: 0,
          v: 1,
          typ: -5,
          livestate: 0,
          rows: 20,
          start: (page - 1) * 20,
        },
      })
      .json()) as any

    const items = []
    for (const item of resultText.response['1'].docs) {
      const anchorItem = {
        roomId: item.room_id.toString(),
        avatar: item.game_avatarUrl180.toString(),
        userName: item.game_nick.toString(),
        liveStatus: item.gameLiveOn,
      }
      items.push(anchorItem)
    }
    const hasMore = resultText.response['1'].numFound > page * 20
    return { hasMore: hasMore, items: items }
  }

  override async getLiveStatus(roomId: string): Promise<boolean> {
    const resultText = await ky
      .get(`https://m.huya.com/${roomId}`, {
        headers: {
          'user-agent': kUserAgent,
        },
      })
      .text()
    const text = /window\.HNF_GLOBAL_INIT.=.\{(.*?)\}.<\/script>/.exec(
      resultText
    )?.[1]
    const jsonObj = JSON.parse(`{${text}}`)
    return jsonObj.roomInfo.eLiveStatus === 2
  }

  async getAnonymousUid(): Promise<string> {
    const result = (await ky
      .post('https://udblgn.huya.com/web/anonymousLogin', {
        json: {
          appId: 5002,
          byPass: 3,
          context: '',
          version: '2.4',
          data: {},
        },
        headers: {
          'user-agent': kUserAgent,
        },
      })
      .json()) as any
    return result.data.uid.toString()
  }

  processAnticode(anticode: string, uid: string, streamname: string): string {
    const query = new URLSearchParams(anticode)
    query.set('t', '102')
    query.set('ctype', 'tars_mp')

    const wsTime = (Date.now() / 1000 + 21600).toString(16)
    const seqId = (Date.now() + Number.parseInt(uid)).toString()

    const fm = Buffer.from(
      decodeURIComponent(query.get('fm')!),
      'base64'
    ).toString('utf8')
    const wsSecretPrefix = fm.split('_')[0]

    const wsSecretHash = CryptoJS.MD5(
      `${seqId}|${query.get('ctype')}|${query.get('t')}`
    ).toString()
    const wsSecret = CryptoJS.MD5(
      `${wsSecretPrefix}_${uid}_${streamname}_${wsSecretHash}_${wsTime}`
    ).toString()

    const now = new Date()
    const formatted =
      now.getFullYear().toString() +
      (now.getMonth() + 1).toString().padStart(2, '0') +
      now.getDate().toString().padStart(2, '0') +
      now.getHours().toString().padStart(2, '0')

    return new URLSearchParams({
      wsSecret: wsSecret,
      wsTime: wsTime,
      seqid: seqId,
      ctype: query.get('ctype')!,
      ver: '1',
      fs: query.get('fs')!,
      sphdcdn: query.get('sphdcdn') || '',
      sphdDC: query.get('sphdDC') || '',
      sphd: query.get('sphd') || '',
      exsphd: query.get('exsphd') || '',
      uid: uid,
      uuid: this.getUUid(),
      t: query.get('t')!,
      sv: formatted,
    }).toString()
  }

  getUUid(): string {
    const currentTime = Date.now()
    const randomValue = Math.floor(Math.random() * 4294967295)
    const result =
      ((currentTime % 10000000000) * 1000 + randomValue) % 4294967295
    return result.toString()
  }

  getUid(t?: number, e?: number): string {
    const n =
      '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('')
    const o = Array(36).fill('')
    if (t != null) {
      for (let i = 0; i < t; i++) {
        o[i] = n[Math.floor(Math.random() * (e ?? n.length))]
      }
    } else {
      o[8] = o[13] = o[18] = o[23] = '-'
      o[14] = '4'
      for (let i = 0; i < 36; i++) {
        if (o[i] === '') {
          const r = Math.floor(Math.random() * 16)
          o[i] = n[19 === i ? (3 & r) | 8 : r]
        }
      }
    }
    return o.join('')
  }

  override async getSuperChatMessage(
    roomId: string
  ): Promise<LiveSuperChatMessage[]> {
    throw new Error('Method not implemented.')
  }
}
