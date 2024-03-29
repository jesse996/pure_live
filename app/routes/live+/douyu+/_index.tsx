import { LoaderFunctionArgs } from "@remix-run/cloudflare";
import { getCategores, getCategoryRooms } from "~/apis/douyu";
import { useLoaderData } from "@remix-run/react";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const category = await getCategores();
  // const searchParam = new URLSearchParams(request.url);
  // const categoryType = searchParam.get("categoryId");
  // const page = Number(searchParam.get("page") ?? 1);
  // if (categoryType) {
  //   const categoryItem = category.find((item) => item.id === categoryType);
  //   if (categoryItem) {
  //     getCategoryRooms(categoryItem.children, page);
  //   }
  // }
  // const defaultCategory = category[0];
  return { category };
};

export default function DouyuCatagory() {
  const data = useLoaderData<typeof loader>();
  return <pre>{JSON.stringify(data, null, 4)}</pre>;
}
