import { getPlayQualites, getPlayUrls } from "~/apis/bilibili";
import { json, LoaderFunctionArgs } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import Player from "xgplayer";
import HlsPlugin from "xgplayer-hls";
import { useEffect } from "react";
import "xgplayer/dist/index.min.css";
import LivePreset from "xgplayer/es/presets/live";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const playQualities = await getPlayQualites(params.roomId!);
  const playUrls = await getPlayUrls(params.roomId!, playQualities.at(-1)!);
  return json({ playQualities, playUrls });
};
export default function RoomDetail() {
  const { playQualities, playUrls } = useLoaderData<typeof loader>();
  console.info("playQualities", playQualities);
  console.info("playUrls", playUrls);

  useEffect(() => {
    const player = new Player({
      id: "video",
      url: playUrls[0],
      height: "600px",
      width: "100%",
      isLive: true,
      // autoplay: true,
      // playsinline: true,
      // hls: true,
      plugins: [HlsPlugin],
    });
    return () => {
      player.destroy();
    };
  }, [playUrls]);

  return (
    <div>
      RoomDetail
      <div id={"video"}>container</div>
    </div>
  );
}
