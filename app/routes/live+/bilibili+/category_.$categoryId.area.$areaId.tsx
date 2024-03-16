import { json, LoaderFunctionArgs } from "@remix-run/cloudflare";
import { getCategoryRooms } from "~/apis/bilibili";
import { Link, useFetcher, useLoaderData } from "@remix-run/react";
import { IconEye } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { LiveRoom } from "~/types/bilibili";
import { InfiniteScroller } from "~/components/InfiniteScroller/InfiniteScroller";
import { Loader } from "@mantine/core";

type LoaderData = {
  rooms: {
    items: LiveRoom[];
  };
  currPage: number;
};

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  console.info("request.url", request.url);
  console.info("searchParam page", url.searchParams.get("page"));
  const page = Number(url.searchParams.get("page") ?? "1");
  // console.info("page", page);
  const rooms = await getCategoryRooms(
    params.categoryId!,
    params.areaId!,
    page
  );
  return json({ rooms, currPage: page });
};

export default function AreaDetail() {
  const { rooms, currPage } = useLoaderData<LoaderData>();
  const [allRooms, setAllRooms] = useState(rooms.items);
  const fetcher = useFetcher<LoaderData>();

  // An effect for appending data to items state
  useEffect(() => {
    if (!fetcher.data || fetcher.state === "loading") {
      return;
    }

    if (fetcher.data) {
      const newItems = fetcher.data.rooms.items;
      setAllRooms((prevAssets) => [...prevAssets, ...newItems]);
    }
  }, [fetcher.data, fetcher.state]);

  return (
    <InfiniteScroller
      loadNext={() => {
        const page = fetcher.data ? fetcher.data.currPage + 1 : currPage + 1;
        const query = `?page=${page}`;

        fetcher.load(query);
      }}
      loading={fetcher.state === "loading"}
    >
      <div
        className={
          "grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] justify-center"
        }
      >
        {allRooms.map((item, index) => (
          <Link
            key={index}
            to={`room/${item.roomId}`}
            className=" m-4 shadow-lg rounded-lg overflow-hidden"
          >
            <div className="relative">
              <img
                src={item.cover}
                alt={item.title}
                referrerPolicy={"no-referrer"}
                className="h-48 w-full object-cover"
              />
            </div>
            <div className="px-6 py-4">
              <div className="font-bold text-xl mb-2 truncate">
                {item.title}
              </div>
              <div className="text-gray-700 text-base">{item.nick}</div>
              <div className="mt-2 text-sm text-gray-600 flex items-center gap-1">
                <IconEye />
                {item.watching}
              </div>
            </div>
          </Link>
        ))}
      </div>
      {fetcher.state === "loading" && <Loader color="blue" />}
      <p>到底啦~</p>
    </InfiniteScroller>
  );
}
