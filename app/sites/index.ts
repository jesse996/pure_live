import { BiliBiliSite } from "./bilibiliSite";
import { DouyuSite } from "./douyuSite";
import type { LiveSite } from "./livesite";

const sites: { [key: string]: LiveSite } = {
	bilibili: new BiliBiliSite(),
	douyu: new DouyuSite(),
};

export function getSiteFromPlatform(platform: string): LiveSite {
	const site = sites[platform];
	if (!site) {
		throw new Error(`platform ${platform} is not supported`);
	}
	return site;
}
