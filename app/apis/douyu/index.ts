import { bilibiliClient } from "~/utils/http-client";

import ky from "ky";
import {
  LiveCategory,
  LiveArea,
  LiveCategoryResult,
  LiveRoom,
  LiveStatus,
  LivePlayQuality,
} from "app/types/live";

export async function getCategories(
  page?: number,
  pageSize?: number
): Promise<LiveCategory[]> {
  const categories: LiveCategory[] = [
    { id: "PCgame", name: "网游竞技", children: [] },
    { id: "djry", name: "单机热游", children: [] },
    { id: "syxx", name: "手游休闲", children: [] },
    { id: "yl", name: "娱乐天地", children: [] },
    { id: "yz", name: "颜值", children: [] },
    { id: "kjwh", name: "科技文化", children: [] },
    { id: "yp", name: "语言互动", children: [] },
  ];

  for (const item of categories) {
    const items = await getSubCategories(item);
    item.children.push(...items);
  }
  return categories;
}

async function getSubCategories(
  liveCategory: LiveCategory
): Promise<LiveArea[]> {
  const result = (await ky
    .get("https://www.douyu.com/japi/weblist/api/getC2List", {
      searchParams: {
        shortName: liveCategory.id,
        offset: 0,
        limit: 200,
      },
    })
    .json()) as any;

  const subs: LiveArea[] = [];
  for (const item of result["data"]["list"]) {
    subs.push({
      areaPic: item["squareIconUrlW"].toString(),
      areaId: item["cid2"].toString(),
      typeName: liveCategory.name,
      areaType: liveCategory.id,
      platform: "douyu",
      areaName: item["cname2"].toString(),
    });
  }

  return subs;
}

export async function getCategoryRooms(
  categoryId: string,
  areaId: string,
  page: number = 1
): Promise<LiveCategoryResult> {
  const result = await bilibiliClient
    .get("xlive/web-interface/v1/second/getList", {
      searchParams: {
        platform: "web",
        parent_area_id: categoryId ?? "",
        area_id: areaId ?? "",
        sort_type: "",
        page: page,
      },
    })
    .json();

  const hasMore = result["data"]["has_more"] === 1;
  const items: LiveRoom[] = [];
  for (const item of result["data"]["list"]) {
    const roomItem: LiveRoom = {
      roomId: item["roomid"].toString(),
      title: item["title"].toString(),
      cover: `${item["cover"]}@400w.jpg`,
      nick: item["uname"].toString(),
      avatar: item["face"].toString(),
      watching: item["online"].toString(),
      liveStatus: LiveStatus.live,
      area: item["area_name"].toString(),
      status: true,
      platform: "live",
      userId: item["uid"].toString(),
    };
    items.push(roomItem);
  }
  return { hasMore, items };
}

export async function getPlayQualites(
  roomId: string
): Promise<LivePlayQuality[]> {
  const qualities: LivePlayQuality[] = [];
  const result = await bilibiliClient
    .get("xlive/web-room/v2/index/getRoomPlayInfo", {
      searchParams: {
        room_id: roomId,
        protocol: "0,1",
        format: "0,1,2",
        codec: "0,1",
        platform: "web",
      },
    })
    .json();

  const qualitiesMap: { [key: number]: string } = {};
  for (const item of result.data.playurl_info.playurl.g_qn_desc) {
    qualitiesMap[parseInt(item.qn) || 0] = item.desc;
  }

  for (const item of result.data.playurl_info.playurl.stream[0].format[0]
    .codec[0].accept_qn) {
    const qualityItem: LivePlayQuality = {
      quality: qualitiesMap[item] || "未知清晰度",
      data: item,
    };
    qualities.push(qualityItem);
  }
  return qualities;
}

export async function getPlayUrls(
  roomId: string,
  quality: LivePlayQuality
): Promise<string[]> {
  const urls: string[] = [];
  const result = await bilibiliClient
    .get("xlive/web-room/v2/index/getRoomPlayInfo", {
      searchParams: {
        room_id: roomId,
        protocol: "0,1",
        format: "0,2",
        codec: "0",
        platform: "web",
        qn: quality.data,
      },
    })
    .json();

  const streamList = result.data.playurl_info.playurl.stream;

  for (const streamItem of streamList) {
    const formatList = streamItem.format;
    for (const formatItem of formatList) {
      const formatName = formatItem.format_name;
      const codecList = formatItem.codec;
      if (formatName != "flv") {
        for (const codecItem of codecList) {
          const urlList = codecItem.url_info;
          const baseUrl = codecItem.base_url.toString();

          for (const urlItem of urlList) {
            urls.push(`${urlItem.host}${baseUrl}${urlItem.extra}`);
          }
        }
      }
    }
  }
  // Sort the urls, ones containing 'mcdn' are at the end
  urls.sort((a, b) => (a.includes("mcdn") ? 1 : -1));
  return urls;
}

export const getRoomDetail = async (roomId: string): Promise<LiveRoom> => {
  try {
    const response = await bilibiliClient
      .get("xlive/web-room/v1/index/getH5InfoByRoom", {
        searchParams: {
          room_id: roomId,
        },
      })
      .json();

    const roomInfo = response.data;
    const title = roomInfo.room_info.title;
    const cover = roomInfo.room_info.cover;
    const nick = roomInfo.anchor_info.base_info.uname;
    const avatar = `${roomInfo.anchor_info.base_info.face}@100w.jpg`;
    const watching = roomInfo.room_info.online;
    const area = roomInfo.room_info.area_name ?? "";
    const isLive = roomInfo.room_info.live_status === 1;
    const liveStatus = isLive ? LiveStatus.live : LiveStatus.offline;
    const link = `https://live.bilibili.com/${roomId}`;
    const introduction = roomInfo.room_info.description;

    const danmakuResponse = await bilibiliClient
      .get("xlive/web-room/v1/index/getDanmuInfo", {
        searchParams: {
          id: roomId,
        },
      })
      .json();

    const danmakuInfo = danmakuResponse.data;
    const token = danmakuInfo.token;
    const serverHosts = danmakuInfo.host_list.map((host) => host.host);
    const serverHost =
      serverHosts.length > 0 ? serverHosts[0] : "broadcastlv.chat.live.com";
    const buvid = await getBuvid();

    return {
      roomId,
      title,
      cover,
      nick,
      avatar,
      watching,
      area,
      status: isLive,
      liveStatus,
      link,
      introduction,
      notice: "",
      platform: "live",
      danmakuData: {
        roomId,
        uid: "",
        token,
        serverHost,
        buvid,
      },
    };
  } catch (error) {
    console.info("error", error);
    // const liveRoom = settings.getLiveRoomByRoomId(roomId);
    // liveRoom.liveStatus = LiveStatus.offline;
    // liveRoom.status = false;
    // return liveRoom;
    return {} as any;
  }
};

const getBuvid = async (): Promise<string> => {
  const BUVID_REGEX = /buvid3=(.*?);/;

  try {
    // if (cookie.includes("buvid3")) {
    //   return BUVID_REGEX.exec(cookie)?.[1] ?? "";
    // }

    const response = await ky
      .get("https://api.bilibili.com/x/frontend/finger/spi")
      .json();

    return response.data["b_3"].toString();
  } catch (error) {
    return "";
  }
};
