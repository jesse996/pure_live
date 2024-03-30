import ky from "ky";
import {
	type LiveArea,
	type LiveCategory,
	type LiveCategoryResult,
	type LiveDanmaku,
	type LivePlayQuality,
	type LiveRoom,
	LiveStatus,
} from "~/types/live";
import type { LiveSuperChatMessage } from "~/types/live/liveMessage";
import { LiveSite } from "./livesite";

import type {
	LiveSearchAnchorResult,
	LiveSearchRoomResult,
} from "~/types/live/liveSearchResult";

export class DouyuSite extends LiveSite {
	id = "douyu";
	name = "斗鱼直播";

	getDanmaku(): LiveDanmaku {
		// return new BiliBiliDanmaku()
		return {} as LiveDanmaku;
	}

	override async getCategores(
		page: number,
		pageSize: number,
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
			const items = await this.getSubCategories(item);
			item.children.push(...items);
		}
		return categories;
	}

	async getSubCategories(liveCategory: LiveCategory): Promise<LiveArea[]> {
		const result = (await ky
			.get("https://www.douyu.com/japi/weblist/api/getC2List", {
				searchParams: {
					shortName: liveCategory.id,
					offset: 0,
					limit: 200,
				},
			})
			.json()) as any as any;

		const subs: LiveArea[] = [];
		for (const item of result.data.list) {
			subs.push({
				areaPic: item.squareIconUrlW.toString(),
				areaId: item.cid2.toString(),
				typeName: liveCategory.name,
				areaType: liveCategory.id,
				platform: "douyu",
				areaName: item.cname2.toString(),
			});
		}

		return subs;
	}

	override async getCategoryRooms(
		category: LiveArea,
		page = 1,
	): Promise<LiveCategoryResult> {
		const result = (await ky
			.get(
				`https://www.douyu.com/gapi/rkc/directory/mixList/2_${category.areaId}/${page}`,
				{
					searchParams: {},
				},
			)
			.json()) as any as any;

		const items: LiveRoom[] = [];
		for (const item of result.data.rl) {
			if (item.type !== 1) {
				continue;
			}
			const roomItem: LiveRoom = {
				cover: item.rs16.toString(),
				watching: item.ol.toString(),
				roomId: item.rid.toString(),
				title: item.rn.toString(),
				nick: item.nn.toString(),
				area: item.c2name.toString(),
				liveStatus: LiveStatus.live,
				avatar: item.av.toString().isNotEmpty
					? `https://apic.douyucdn.cn/upload/${item.av}_middle.jpg`
					: "",
				status: true,
				platform: "douyu",
			};
			items.push(roomItem);
		}
		const hasMore = page < result.data.pgcnt;
		return { hasMore, items };
	}

	override async getPlayQualites(detail: LiveRoom): Promise<LivePlayQuality[]> {
		let data = detail.data;
		data += "&cdn=&rate=-1&ver=Douyu_223061205&iar=1&ive=1&hevc=0&fa=0";
		const qualities: any[] = [];
		const result = (await ky
			.post(`https://www.douyu.com/lapi/live/getH5Play/${detail.roomId}`, {
				body: data,
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
				},
			})
			.json()) as any;

		const cdns: string[] = [];
		// console.log("result", result.data);

		for (const item of result.data.cdnsWithName) {
			cdns.push(item.cdn);
		}
		for (const item of result.data.multirates) {
			qualities.push({
				quality: item.name,
				data: { rate: item.rate, cdns },
			});
		}
		return qualities;
	}

	override async getPlayUrls(
		detail: LiveRoom,
		quality: LivePlayQuality,
	): Promise<string[]> {
		const args = detail.data.toString();
		const data = quality.data;

		const urls: string[] = [];
		for (const item of data.cdns) {
			const url = await this.getPlayUrl(
				detail.roomId ?? "",
				args,
				data.rate,
				item,
			);
			if (url !== "") {
				urls.push(url);
			}
		}
		return urls;
	}

	async getPlayUrl(
		roomId: string,
		args: string,
		rate: number,
		cdn: string,
	): Promise<string> {
		args += `&cdn=${cdn}&rate=${rate}`;
		const result = (await ky
			.post(`https://www.douyu.com/lapi/live/getH5Play/${roomId}`, {
				body: args,
				headers: {
					referer: `https://www.douyu.com/${roomId}`,
					"user-agent":
						"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36 Edg/114.0.1823.43",
					"Content-Type": "application/x-www-form-urlencoded",
				},
			})
			.json()) as any;

		return `${result.data.rtmp_url}/${decodeURIComponent(
			result.data.rtmp_live,
		)}`;
	}

	override async getRecommendRooms(page = 1): Promise<LiveCategoryResult> {
		const result = (await ky
			.get(`https://www.douyu.com/japi/weblist/apinc/allpage/6/${page}`, {
				searchParams: {},
			})
			.json()) as any;

		const items: any[] = [];
		for (const item of result.data.rl) {
			if (item.type !== 1) {
				continue;
			}
			const roomItem = {
				cover: item.rs16.toString(),
				watching: item.ol.toString(),
				roomId: item.rid.toString(),
				title: item.rn.toString(),
				nick: item.nn.toString(),
				area: item.c2name.toString(),
				avatar: item.av.toString().isNotEmpty
					? `https://apic.douyucdn.cn/upload/${item.av}_middle.jpg`
					: "",
				platform: "douyu",
				status: true,
				liveStatus: "live",
			};
			items.push(roomItem);
		}
		const hasMore = page < result.data.pgcnt;
		return { hasMore, items };
	}

	override async getRoomDetail(roomId: string): Promise<LiveRoom> {
		try {
			const result = (await ky
				.get(`https://www.douyu.com/betard/${roomId}`, {
					headers: {
						referer: `https://www.douyu.com/${roomId}`,
						"user-agent":
							"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36 Edg/114.0.1823.43",
					},
				})
				.json()) as any;

			let roomInfo: any;
			if (typeof result === "string") {
				roomInfo = JSON.parse(result).room;
			} else {
				roomInfo = result.room;
			}

			const jsEncResult = await ky
				.get(`https://www.douyu.com/swf_api/homeH5Enc?rids=${roomId}`, {
					headers: {
						referer: `https://www.douyu.com/${roomId}`,
						"user-agent":
							"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36 Edg/114.0.1823.43",
					},
				})
				.text();

			const crptext = JSON.parse(jsEncResult).data[`room${roomId}`].toString();

			return {
				cover: roomInfo.room_pic.toString(),
				watching: roomInfo.room_biz_all.hot.toString(),
				roomId: roomId,
				title: roomInfo.room_name.toString(),
				nick: roomInfo.owner_name.toString(),
				avatar: roomInfo.owner_avatar.toString(),
				introduction: roomInfo.show_details.toString(),
				area: roomInfo.cate_name?.toString() ?? "",
				notice: "",
				liveStatus:
					roomInfo.show_status === 1 ? LiveStatus.live : LiveStatus.offline,
				status: roomInfo.show_status === 1,
				danmakuData: roomInfo.room_id.toString(),
				data: await this.getPlayArgs(crptext, roomInfo.room_id.toString()),
				platform: "douyu",
				link: `https://www.douyu.com/${roomId}`,
				isRecord: roomInfo.videoLoop === 1,
			};
		} catch (e) {
			console.log(e);
			throw e;

			// const liveRoom = settings.getLiveRoomByRoomId(roomId)
			// liveRoom.liveStatus = 'offline'
			// liveRoom.status = false
			// return liveRoom
		}
	}

	override async searchRooms(
		keyword: string,
		page = 1,
	): Promise<LiveSearchRoomResult> {
		const did = this.generateRandomString(32);
		const result = (await ky
			.get("https://www.douyu.com/japi/search/api/searchShow", {
				searchParams: {
					kw: keyword,
					page: page,
					pageSize: 20,
				},
				headers: {
					"User-Agent":
						"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36 Edg/114.0.1823.51",
					referer: "https://www.douyu.com/search/",
					Cookie: `dy_did=${did};acf_did=${did}`,
				},
			})
			.json()) as any;

		if (result.error !== 0) {
			throw new Error(result.msg);
		}

		const items: any[] = [];
		const queryList = result.data.relateShow ?? [];
		for (const item of queryList) {
			const liveStatus = (Number.parseInt(item.isLive.toString()) ?? 0) === 1;
			const roomType = Number.parseInt(item.roomType.toString()) ?? 0;
			const roomItem = {
				roomId: item.rid.toString(),
				title: item.roomName.toString(),
				cover: item.roomSrc.toString(),
				area: item.cateName.toString(),
				avatar: item.avatar.toString(),
				liveStatus: liveStatus && roomType === 0 ? "live" : "offline",
				status: liveStatus && roomType === 0,
				nick: item.nickName.toString(),
				platform: "douyu",
				watching: item.hot.toString(),
			};
			items.push(roomItem);
		}
		return { hasMore: queryList.length > 0, items };
	}

	generateRandomString(length: number): string {
		const random = crypto.getRandomValues(new Uint8Array(length));
		let result = "";
		for (let i = 0; i < length; i++) {
			result += random[i].toString(16);
		}
		return result;
	}

	override async searchAnchors(
		keyword: string,
		page = 1,
	): Promise<LiveSearchAnchorResult> {
		const did = this.generateRandomString(32);
		const result = (await ky
			.get("https://www.douyu.com/japi/search/api/searchUser", {
				searchParams: {
					kw: keyword,
					page: page,
					pageSize: 20,
					filterType: 1,
				},
				headers: {
					"User-Agent":
						"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36 Edg/114.0.1823.51",
					referer: "https://www.douyu.com/search/",
					Cookie: `dy_did=${did};acf_did=${did}`,
				},
			})
			.json()) as any;

		const items: any[] = [];
		for (const item of result.data.relateUser) {
			const liveStatus =
				(Number.parseInt(item.anchorInfo.isLive.toString()) ?? 0) === 1;
			const roomType =
				Number.parseInt(item.anchorInfo.roomType.toString()) ?? 0;
			const roomItem = {
				roomId: item.anchorInfo.rid.toString(),
				avatar: item.anchorInfo.avatar.toString(),
				userName: item.anchorInfo.nickName.toString(),
				liveStatus: liveStatus && roomType === 0,
			};
			items.push(roomItem);
		}
		const hasMore = result.data.relateUser.length > 0;
		return { hasMore, items };
	}

	override async getLiveStatus(roomId: string): Promise<boolean> {
		const detail = await this.getRoomDetail(roomId);
		return detail.status;
	}

	async getPlayArgs(html: string, rid: string): Promise<string> {
		html =
			html.match(
				/(vdwdae325w_64we[\s\S]*function ub98484234[\s\S]*?)function/m,
			)?.[1] || "";
		html = html.replace(/eval.*?;}/g, "strc;}");

		const result = (await ky
			.post("http://alive.nsapps.cn/api/AllLive/DouyuSign", {
				json: { html: html, rid: rid },
			})
			.json()) as any;

		if (result.code === 0) {
			return result.data.toString();
		}
		return "";
	}

	parseHotNum(hn: string): number {
		try {
			let num = Number.parseFloat(hn.replace("万", ""));
			if (hn.includes("万")) {
				num *= 10000;
			}
			return Math.round(num);
		} catch (_) {
			return -999;
		}
	}

	override async getSuperChatMessage(
		roomId: string,
	): Promise<LiveSuperChatMessage[]> {
		throw new Error("尚不支持");
	}
}
