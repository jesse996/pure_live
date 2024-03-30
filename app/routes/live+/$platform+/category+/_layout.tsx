import { Tabs } from "@mantine/core";
import type { LoaderFunctionArgs } from "@remix-run/cloudflare";
import {
	Outlet,
	useLoaderData,
	useNavigate,
	useParams,
} from "@remix-run/react";
import { getSiteFromPlatform } from "~/sites";

export const loader = async ({ params }: LoaderFunctionArgs) => {
	const platform = params.platform;
	if (!platform) {
		throw new Error("platform is required");
	}
	const liveSite = getSiteFromPlatform(platform);

	return { categorys: await liveSite.getCategores(0, 0) };
};

export default function BilibiliCatagory() {
	const { categorys } = useLoaderData<typeof loader>();
	const params = useParams();
	const categoryId = params.categoryId;
	const navigate = useNavigate();

	return (
		<div>
			<Tabs
				value={categoryId}
				onChange={(value) => {
					navigate(`${value}`);
				}}
			>
				<Tabs.List>
					{categorys.map((item) => (
						<Tabs.Tab key={item.id} value={item.id}>
							<div>{item.name}</div>
						</Tabs.Tab>
					))}
				</Tabs.List>
			</Tabs>
			<Outlet />
		</div>
	);
}
