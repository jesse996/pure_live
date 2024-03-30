import { Card, Image, Pagination, SimpleGrid, Text } from "@mantine/core";
import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import {
	type ClientLoaderFunctionArgs,
	Link,
	useLoaderData,
	useSearchParams,
} from "@remix-run/react";
import { supabaseClient } from "~/utils";

export const meta: MetaFunction<typeof loader> = ({ }) => {
	return [{ title: "新新闻" }];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const searchParams = new URL(request.url).searchParams;
	const currPage = Number(searchParams.get("page") ?? 1);
	const tag = searchParams.get("tag") ?? "";
	const limit = 16;
	const start = (currPage - 1) * limit;
	const end = start + limit - 1;
	let query = supabaseClient
		.from("sys_article")
		.select("id,title", { count: "estimated", head: false })
		.range(start, end)
		.order("id", { ascending: false });
	if (tag) {
		query = query.containedBy("tag", [tag]);
	}
	const { count, data: list, error } = await query;

	if (error) throw error;
	let host = new URL(request.url).host;
	host = host.replaceAll(".", "");
	host = host.replaceAll(":", "");
	return {
		totalPage: ((count! / limit) | 0) + 1,
		currPage,
		list,
		host,
		tag,
	};
};

let cache: any;
export const clientLoader = async ({
	serverLoader,
	request,
}: ClientLoaderFunctionArgs) => {
	const searchParams = new URL(request.url).searchParams;
	const pg = Number(searchParams.get("page") ?? 1);
	const tag = searchParams.get("tag");
	if (cache && cache.currPage === pg && cache.tag === tag) return cache;
	const data = await serverLoader();
	cache = data;
	return data;
};
clientLoader.hydrate = true;

export default function Index() {
	const { totalPage, currPage, list, host } = useLoaderData<typeof loader>();
	const [searchParam, setSearchParam] = useSearchParams();
	// console.info("sear", searchParam);
	return (
		<div
		// style={{ backgroundImage: 'url("https://api.likepoems.com/img/pc/")' }}
		>
			<SimpleGrid cols={{ xs: 1, sm: 2, md: 4 }}>
				{list.map((i) => (
					<Link to={`/article/${i.id}`} key={i.id}>
						<Card
							shadow="sm"
							padding="xl"
						// h={200}
						// component="a"
						// href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
						// target="_blank"
						>
							<Card.Section>
								<Image
									src={`https://picsum.photos/seed/${i.title}/200/160`}
									h={160}
									alt={i.title}
								/>
							</Card.Section>
							<Text truncate>{i.title}</Text>
						</Card>
					</Link>
				))}
			</SimpleGrid>
			<img
				src={`https://api.likepoems.com/counter/get/@${host}`}
				alt="count"
				className={"h-14 absolute mt-2"}
			/>
			<div className={"text-center flex justify-center mt-5"}>
				<Pagination
					total={totalPage}
					value={currPage}
					onChange={(newPage) => {
						searchParam.set("page", newPage.toString());
						setSearchParam(searchParam);
					}}
				/>
			</div>
		</div>
	);
}
