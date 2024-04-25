import { Navigate, useRouteLoaderData } from "@remix-run/react";
import type { loader as bLoader } from "~/routes/live+/$platform+/category+/_layout";

export default function CategoryIndex() {
  // const matches = useMatches();
  // console.info("matches", matches);
  const layouteData = useRouteLoaderData<typeof bLoader>(
    "routes/live+/$platform+/category+/_layout"
  );
  console.info("layouteData", layouteData);
  return <Navigate to={`${layouteData?.categorys[0].id}`} />;
}
