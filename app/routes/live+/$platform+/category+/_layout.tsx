import { Tabs } from "@mantine/core";
import type { LoaderFunctionArgs } from "@remix-run/node";
import {
  ClientLoaderFunctionArgs,
  Outlet,
  useLoaderData,
  useNavigate,
  useParams,
} from "@remix-run/react";
import { getSiteFromPlatform } from "~/sites";
import { cacheClientLoader, useCachedLoaderData } from "remix-client-cache";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const platform = params.platform;
  if (!platform) {
    throw new Error("platform is required");
  }
  const liveSite = getSiteFromPlatform(platform);

  return { categories: await liveSite.getCategores(0, 0) };
};

// Caches the loader data on the client
export const clientLoader = (args: ClientLoaderFunctionArgs) =>
  cacheClientLoader(args);

// make sure you turn this flag on
clientLoader.hydrate = true;

export default function BilibiliCatagory() {
  const { categories } = useLoaderData<typeof loader>();
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
          {categories?.map((item) => (
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
