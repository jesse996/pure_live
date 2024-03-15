import { Card, Grid, Image, Tabs, Text } from "@mantine/core";
import { Link, Outlet, useLoaderData, useSearchParams } from "@remix-run/react";
import { getCategory } from "~/apis/bilibili";

export const loader = async () => {
  const categorys = await getCategory();

  return { categorys };
};

export default function BilibiliCatagory() {
  const { categorys } = useLoaderData<typeof loader>();
  const [searchParam, setSearchParam] = useSearchParams();
  const categoryId = searchParam.get("categoryId") || categorys[0].id;
  const currentCategory = categorys.find((item) => item.id === categoryId);
  console.log("currentCategory", currentCategory);

  return (
    <div>
      <Tabs
        value={categoryId}
        onChange={(value) => {
          setSearchParam({ categoryId: value ?? "0" });
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

      <div className={"grid grid-cols-3 md:grid-cols-5 gap-10 rounded-md mt-2"}>
        {currentCategory?.children.map((item) => (
          // <Link to={`area/${item.areaId}`} key={item.areaId}>
          // <div key={item.areaId}>
          <Card
            shadow="lg"
            radius={40}
            key={item.areaId}
            className={"rounded-xl overflow-hidden"}
          >
            <Card.Section>
              <Image
                src={item.areaPic}
                alt={item.areaName}
                referrerPolicy="no-referrer"
                height={160}
                // className="object-contain w-full	 h-20"
              />
            </Card.Section>
            <Text
              className={"h-20  flex justify-center items-center bg-gray-50"}
            >
              {item.areaName}
            </Text>
          </Card>
          // </div>
          // </Link>
        ))}
      </div>
      <Outlet />
    </div>
  );
}
