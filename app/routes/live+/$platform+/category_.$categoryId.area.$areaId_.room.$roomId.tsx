import { Select } from "@mantine/core";
import type { LoaderFunctionArgs } from "@remix-run/node";
import {
  ClientLoaderFunctionArgs,
  useLoaderData,
  useSearchParams,
} from "@remix-run/react";
import { cacheClientLoader, useCachedLoaderData } from "remix-client-cache";
import MyPlayer from "~/components/MyPlayer/MyPlayer";
import { getSiteFromPlatform } from "~/sites";

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  const platform = params.platform!;
  const liveSite = getSiteFromPlatform(platform);

  const roomDetail = await liveSite.getRoomDetail(params.roomId!);
  const playQualities = await liveSite.getPlayQualites(roomDetail);
  const qualityName = new URL(request.url).searchParams.get("quality");
  const quality =
    playQualities.find((i) => i.quality === qualityName) ?? playQualities[0];
  const playUrls = await liveSite.getPlayUrls(roomDetail, quality);
  return { playQualities, currQuality: quality, playUrls };
};

// Caches the loader data on the client
export const clientLoader = (args: ClientLoaderFunctionArgs) =>
  cacheClientLoader(args);

// make sure you turn this flag on
clientLoader.hydrate = true;

export default function RoomDetail() {
  const { playQualities, playUrls, currQuality } =
    useCachedLoaderData<typeof loader>();
  console.log("playUrls", playUrls);

  const [, setSearchParam] = useSearchParams();

  return (
    <div>
      <MyPlayer playUrl={playUrls.at(-1)!.replace("http://", "https://")} />
      <div>
        <Select
          value={currQuality?.quality}
          onChange={(value) => {
            if (value) setSearchParam({ quality: value }, { replace: true });
          }}
          data={playQualities.map((i) => i.quality)}
          className={"w-40"}
        />
      </div>
    </div>
  );
}
