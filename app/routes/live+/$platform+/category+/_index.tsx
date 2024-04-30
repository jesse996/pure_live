import { Navigate, useRouteLoaderData } from "@remix-run/react";
import type { loader as bLoader } from "~/routes/live+/$platform+/category+/_layout";

export default function CategoryIndex() {
  const layoutData = useRouteLoaderData<typeof bLoader>(
    "routes/live+/$platform+/category+/_layout"
  );
  console.info("layoutData", layoutData);
  return <Navigate to={`${layoutData?.categories[0].id}`} />;
}
