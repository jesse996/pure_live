import { Loader } from "@mantine/core";
import type { LoaderFunctionArgs } from "@remix-run/cloudflare";
import { Link, useFetcher, useLoaderData } from "@remix-run/react";
import { IconEye } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { InfiniteScroller } from "~/components/InfiniteScroller/InfiniteScroller";
import { getSiteFromPlatform } from "~/sites";
import type { LiveRoom } from "~/types/live";
import { loader as categoryLoader } from "./category+/_layout";

type LoaderData = {
	rooms: {
		items: LiveRoom[];
	};
	currPage: number;
};

export const loader = async ({
	params,
	request,
	context,
}: LoaderFunctionArgs) => {
	const platform = params.platform;
	if (!platform) {
		throw new Error("platform is required");
	}
	const liveSite = getSiteFromPlatform(platform);

	const url = new URL(request.url);
	const page = Number(url.searchParams.get("page") ?? "1");

	const categoryLoaderData = (
		await categoryLoader({ params, request, context })
	).categorys;
	const area = categoryLoaderData
		.find((i) => i.id === params.categoryId)
		?.children.find((i) => i.areaId === params.areaId);
	if (!area) {
		throw new Error("area not found");
	}

	return { rooms: await liveSite.getCategoryRooms(area, page), currPage: page };
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
	}, [fetcher.data]);

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
