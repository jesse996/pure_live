import { Card, Image, Text } from "@mantine/core";
import {
  Link,
  useMatches,
  useNavigate,
  useParams,
  useRouteLoaderData,
} from "@remix-run/react";
import { loader as categoryLoader } from "~/routes/live+/bilibili+/category+/_layout";

export default function CategoryIdPage() {
  const params = useParams();
  // useRouteLoaderData('live.')
  const matched = useMatches();
  const categorys = useRouteLoaderData<typeof categoryLoader>(
    matched.at(-2)?.id ?? ""
  )?.categorys;
  // console.info("matched", matched);
  // console.info("categorys", categorys);

  const categoryId = params.categoryId;
  const currentCategory = categorys?.find((item) => item.id === categoryId);
  // console.log("currentCategory", currentCategory);
  return (
    <div className={""}>
      <div
        className={
          "grid grid-cols-[repeat(auto-fill,minmax(190px,1fr))] justify-center"
        }
      >
        {currentCategory?.children.map((item) => (
          <Link to={`area/${item.areaId}`} key={item.areaId}>
            <div className="w-40 m-4 shadow-lg rounded-lg overflow-hidden">
              <div className="relative">
                <img
                  src={item.areaPic}
                  alt={item.areaName}
                  referrerPolicy={"no-referrer"}
                  className="h-40 w-full object-cover"
                />
              </div>
              <div className="px-6 py-4">
                <div className="font-bold text-xl mb-2 truncate">
                  {item.areaName}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
