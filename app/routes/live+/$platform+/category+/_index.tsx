import { Navigate, useMatches, useRouteLoaderData } from "@remix-run/react";
import { loader as bLoader } from "~/routes/live+/bilibili+/category+/_layout";

export default function CategoryIndex() {
  // const matches = useMatches();
  // console.info("matches", matches);
  const biliData = useRouteLoaderData<typeof bLoader>(
    "routes/live+/bilibili+/category+/_layout"
  );
  console.info("biliData", biliData);
  return <Navigate to={`${biliData?.categorys[0].id}`} />;
}
