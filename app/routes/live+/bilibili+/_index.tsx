import { json } from "@remix-run/cloudflare";
import { getCategory } from "~/apis/bilibili";
import { useLoaderData } from "@remix-run/react";

export const loader = async () => {
  const category = await getCategory();
  return json({ category });
};

export default function DouyuCatagory() {
  const data = useLoaderData<typeof loader>();
  return <div>{JSON.stringify(data, null, 4)}</div>;
}
