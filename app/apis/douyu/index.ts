import {
	type LiveArea,
	type LiveCategory,
	type LiveCategoryResult,
	type LivePlayQuality,
	type LiveRoom,
	LiveStatus,
} from "app/types/live";
import ky from "ky";

export async function getCategories(
	page?: number,
	pageSize?: number,
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
	liveCategory: LiveCategory,
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

export async function getCategoryRooms(
	// category: LiveArea,
	areaId: string,
	page = 1,
): Promise<LiveCategoryResult> {
	const result = (await ky
		.get(`https://www.douyu.com/gapi/rkc/directory/mixList/2_${areaId}/${page}`)
		.json()) as any;

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

export async function getPlayQualites(
	detail: LiveRoom,
): Promise<LivePlayQuality[]> {
	let data = detail.data;

	data += "&cdn=&rate=-1&ver=Douyu_223061205&iar=1&ive=1&hevc=0&fa=0";
	const qualities: LivePlayQuality[] = [];

	const result = (await ky
		.post(`https://www.douyu.com/lapi/live/getH5Play/${detail.roomId}`, {
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
			},
			body: data,
		})
		.json()) as any;

	const cdns: string[] = [];

	for (const item of result.data.cdnsWithName) {
		cdns.push(item.cdn.toString());
	}
	for (const item of result.data.multirates) {
		qualities.push({
			quality: item.name.toString(),
			data: { rate: item.rate, cdns: cdns },
		});
	}
	return qualities;
}

export async function getPlayUrls(
	detail: LiveRoom,
	quality: LivePlayQuality,
): Promise<string[]> {
	const args = detail.data.toString();
	const data = quality.data;

	const urls: string[] = [];
	for (const item of data.cdns) {
		const url = await getPlayUrl(detail.roomId!, args, data.rate, item);
		if (url.length > 0) {
			urls.push(url);
		}
	}
	return urls;
}

async function getPlayUrl(
	roomId: string,
	args: string,
	rate: number,
	cdn: string,
): Promise<string> {
	args += `&cdn=${cdn}&rate=${rate}`;
	const result = (await ky
		.post(`https://www.douyu.com/lapi/live/getH5Play/${roomId}`, {
			headers: {
				referer: `https://www.douyu.com/${roomId}`,
				"user-agent":
					"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36 Edg/114.0.1823.43",
				"Content-Type": "application/x-www-form-urlencoded",
			},
			body: args,
		})
		.json()) as any;

	return `${result.data.rtmp_url}/${decodeURIComponent(result.data.rtmp_live)}`;
}

export async function getRoomDetail(roomId: string): Promise<LiveRoom> {
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

		const roomInfo = result.room;

		const jsEncResult = (await ky
			.get(`https://www.douyu.com/swf_api/homeH5Enc?rids=${roomId}`, {
				headers: {
					referer: `https://www.douyu.com/${roomId}`,
					"user-agent":
						"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36 Edg/114.0.1823.43",
				},
			})
			.json()) as any;

		const crptext = jsEncResult.data[`room${roomId}`].toString();

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
			data: await getPlayArgs(crptext, roomInfo.room_id.toString()),
			platform: "douyu",
			link: `https://www.douyu.com/${roomId}`,
			isRecord: roomInfo.videoLoop === 1,
		};
	} catch (e) {
		// Handle error
		console.log(e);

		throw e;
	}
}

async function getPlayArgs(html: string, rid: string): Promise<string> {
	// Extract encrypted js
	const regex = /(vdwdae325w_64we[\s\S]*function ub98484234[\s\S]*?)function/m;
	const match = html.match(regex);

	html = match?.[1] ? match[1] : "";
	html = html.replace(/eval.*?;}/g, "strc;}");

	const result = (await ky
		.post("http://alive.nsapps.cn/api/AllLive/DouyuSign", {
			json: { html, rid },
		})
		.json()) as any;

	if (result.code === 0) {
		return result.data.toString();
	}
	return "";
}
