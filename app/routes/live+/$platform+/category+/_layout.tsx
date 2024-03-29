import { Tabs } from "@mantine/core";
import {
  Outlet,
  useLoaderData,
  useNavigate,
  useParams,
} from "@remix-run/react";
import { getCategories as biliGetCategories } from "~/apis/bilibili";
import { getCategories as douyuGetCategories } from "~/apis/douyu";
import { LoaderFunctionArgs } from "@remix-run/cloudflare";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const platform = params.platform;
  if (!platform) {
    throw new Error("platform is required");
  }

  switch (platform) {
    case 'bilibili':
      {
        const categorys = await biliGetCategories();
        return { categorys };

      }
    case 'douyu':
      {
        const categorys = await douyuGetCategories();
        return { categorys };

      }
    default:
      throw new Error(`platform ${platform} is not supported`);
  }

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
