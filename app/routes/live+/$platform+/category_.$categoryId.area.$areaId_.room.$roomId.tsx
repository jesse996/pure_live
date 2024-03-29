import { Select } from "@mantine/core";
import type { LoaderFunctionArgs } from "@remix-run/cloudflare";
import { useLoaderData, useSearchParams } from "@remix-run/react";
import {
	getPlayQualites as biliGetPlayQualites,
	getPlayUrls as biliGetPlayUrls,
	getRoomDetail as biliGetRoomDetail,
} from "~/apis/bilibili";
import {
	getPlayUrls as douyuGetPlayUrls,
	getRoomDetail as douyuGetRoomDetail,
	getPlayQualites as douyuiGetPlayQualites,
} from "~/apis/douyu";
import MyPlayer from "~/components/MyPlayer/MyPlayer";

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
	const platform = params.platform!;
	switch (platform) {
		case "douyu": {
			const roomDetail = await douyuGetRoomDetail(params.roomId!);
			const playQualities = await douyuiGetPlayQualites(roomDetail);
			const qualityName = new URL(request.url).searchParams.get("quality");
			const quality =
				playQualities.find((i) => i.quality === qualityName) ??
				playQualities[0];
			const playUrls = await douyuGetPlayUrls(roomDetail, quality);
			return { playQualities, currQuality: quality, playUrls };
		}
		case "bilibili": {
			const roomDetail = await biliGetRoomDetail(params.roomId!);
			const playQualities = await biliGetPlayQualites(roomDetail);
			const qualityName = new URL(request.url).searchParams.get("quality");
			const quality =
				playQualities.find((i) => i.quality === qualityName) ??
				playQualities[0];
			const playUrls = await biliGetPlayUrls(params.roomId!, quality);
			return { playQualities, currQuality: quality, playUrls };
		}
		default:
			break;
	}
};
export default function RoomDetail() {
	const { playQualities, playUrls, currQuality } =
		useLoaderData<typeof loader>();
	console.info("playQualities", playQualities);
	console.info("playUrls", playUrls);
	const [, setSearchParam] = useSearchParams();

	return (
		<div>
			<MyPlayer playUrl={playUrls.at(-1)!} />
			<div>
				<Select
					value={currQuality?.quality}
					onChange={(value) => {
						if (value) setSearchParam({ quality: value });
					}}
					data={playQualities.map((i) => i.quality)}
					className={"w-40"}
				/>
			</div>
		</div>
	);
}
