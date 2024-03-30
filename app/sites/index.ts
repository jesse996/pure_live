import { BiliBiliSite } from "./bilibiliSite";
import { DouyinSite } from "./douyin";
import { DouyuSite } from "./douyuSite";
import { HuyaSite } from "./huya";
import type { LiveSite } from "./livesite";

const sites: { [key: string]: LiveSite } = {
	bilibili: new BiliBiliSite(),
	douyu: new DouyuSite(),
	huya: new HuyaSite(),
	douyin: new DouyinSite(),
};

export function getSiteFromPlatform(platform: string): LiveSite {
	const site = sites[platform];
	if (!site) {
		throw new Error(`platform ${platform} is not supported`);
	}
	return site;
}
