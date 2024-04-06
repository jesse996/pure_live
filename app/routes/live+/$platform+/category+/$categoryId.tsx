import {
  Link,
  useMatches,
  useParams,
  useRouteLoaderData,
} from "@remix-run/react";
import type { loader as categoryLoader } from "~/routes/live+/$platform+/category+/_layout";

export default function CategoryIdPage() {
  const params = useParams();
  // useRouteLoaderData('live.')
  const matched = useMatches();

  const categorys = useRouteLoaderData<typeof categoryLoader>(
    matched.at(-2)?.id ?? ""
  )?.categorys;

  const categoryId = params.categoryId;
  const currentCategory = categorys?.find((item) => item.id === categoryId);

  return (
    <div className={""}>
      <div
        className={
          "grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] justify-center gap-3 "
        }
      >
        {currentCategory?.children.map((item) => (
          <Link to={`area/${item.areaId}`} key={item.areaId}>
            <div className=" shadow-lg rounded-lg overflow-hidden">
              <div className="relative">
                <img
                  src={item.areaPic}
                  alt={item.areaName}
                  referrerPolicy={"no-referrer"}
                  className="h-40 w-full object-cover"
                />
              </div>
              <div className="px-6 py-4">
                <div className="font-bold text-xl mb-2 truncate text-center">
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
