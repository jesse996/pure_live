import { Tabs } from "@mantine/core";
import {
  Outlet,
  useLoaderData,
  useNavigate,
  useParams,
} from "@remix-run/react";
import { getCategory } from "~/apis/bilibili";

export const loader = async () => {
  const categorys = await getCategory();

  return { categorys };
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
