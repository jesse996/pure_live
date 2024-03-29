import { bilibiliClient } from "~/utils/http-client";
import {
  LiveArea,
  LiveCategory,
  LiveCategoryResult,
  LivePlayQuality,
  LiveRoom,
  LiveStatus,
} from "app/types/live";
import ky from "ky";

export const getCategories = async (): Promise<LiveCategory[]> => {
  const result = await bilibiliClient
    .get("room/v1/Area/getList", {
      searchParams: { need_entrance: 1, parent_id: 0 },
    })
    .json();
  const categories: LiveCategory[] = [];
  for (const item of result["data"]) {
    const subs: LiveArea[] = [];
    for (const subItem of item["list"]) {
      const subCategory = {
        areaId: subItem["id"].toString(),
        areaName: subItem["name"] ? subItem["name"] : "",
        areaType: subItem["parent_id"] ? subItem["parent_id"] : "",
        typeName: subItem["parent_name"] ? subItem["parent_name"] : "",
        areaPic: `${subItem["pic"] ? subItem["pic"] : ""}@100w.png`,
        platform: "live",
      };
      subs.push(subCategory);
    }
    const category = {
      children: subs,
      id: item["id"].toString(),
      name: item["name"] ? item["name"] : "",
    };
    categories.push(category);
  }
  return categories;
};

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
