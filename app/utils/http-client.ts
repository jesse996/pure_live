import ky from "ky";

export const bilibiliClient = ky.create({
	prefixUrl: "https://api.live.bilibili.com",
});

export const httpClient = ky;
