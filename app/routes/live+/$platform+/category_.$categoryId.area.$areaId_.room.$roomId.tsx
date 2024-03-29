import { getPlayQualites, getPlayUrls } from "~/apis/bilibili";
import { LoaderFunctionArgs } from "@remix-run/cloudflare";
import { useLoaderData, useSearchParams } from "@remix-run/react";
import MyPlayer from "~/components/MyPlayer/MyPlayer";
import { Select } from "@mantine/core";

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  const playQualities = await getPlayQualites(params.roomId!);
  const qualityName = new URL(request.url).searchParams.get("quality");
  const quality =
    playQualities.find((i) => i.quality === qualityName) ?? playQualities[0];
  const playUrls = await getPlayUrls(params.roomId!, quality);
  return { playQualities, currQuality: quality, playUrls };
};
export default function RoomDetail() {
  const { playQualities, playUrls, currQuality } =
    useLoaderData<typeof loader>();
  console.info("playQualities", playQualities);
  console.info("playUrls", playUrls);
  const [, setSearchParam] = useSearchParams();

  return (
    <div>
      <MyPlayer playUrl={playUrls[0]} />
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
