import Artplayer from "artplayer";
// import flvjs from "flv.js";
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

      // type: "flv",
      customType: {
        m3u8: playM3u8,
        flv: playFlv,
      },
    });

    // dp.on("ready", () => {
    // 	console.log("ready");

    // 	dp.destroy();
    // });

    return () => {
      dp.destroy();
    };
  }, [playUrl]);

  return (
    <div id={"video"} className={"w-full aspect-video"}>
      loading... dd
    </div>
  );
}

function playM3u8(video: any, url: string, art: any) {
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

async function playFlv(video: any, url: string, art: any) {
  const flvjs = (await import("flv.js")).default;
  if (flvjs.isSupported()) {
    if (art.flv) art.flv.destroy();
    const flv = flvjs.createPlayer({ type: "flv", url });
    flv.attachMediaElement(video);
    flv.load();
    art.flv = flv;
    art.on("destroy", () => flv.destroy());
  } else {
    art.notice.show = "Unsupported playback format: flv";
  }
}
