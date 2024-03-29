import Artplayer from "artplayer";
import Hls from "hls.js";
import { useEffect } from "react";

type Props = {
	playUrl: string;
};
export default function MyPlayer({ playUrl }: Props) {
	useEffect(() => {
		const dp = new Artplayer({
			container: "#video",
			url: playUrl,
			isLive: true,
			autoplay: true,
			// setting: true,
			fullscreen: true,

			type: "m3u8",
			customType: {
				m3u8: playM3u8,
			},
		});
		dp.on("ready", () => {
			dp.play();
		});

		return () => {
			dp.destroy();
		};
	}, [playUrl]);

	return (
		<div id={"video"} className={"w-full aspect-video"}>
			loading...
		</div>
	);
}

function playM3u8(video, url, art) {
	if (Hls.isSupported()) {
		if (art.hls) art.hls.destroy();
		const hls = new Hls();
		hls.loadSource(url);
		hls.attachMedia(video);
		art.hls = hls;
		art.on("destroy", () => hls.destroy());
	} else if (video.canPlayType("application/vnd.apple.mpegurl")) {
		video.src = url;
	} else {
		art.notice.show = "Unsupported playback format: m3u8";
	}
}
