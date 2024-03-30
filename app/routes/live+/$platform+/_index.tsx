// import { LoaderFunctionArgs, redirect } from "@remix-run/node";
// import {
//   getCategory as biliGetCategory,
//   getCategoryRooms as biliGetCategoryRooms,
// } from "~/apis/bilibili";
//
// import {
//   getCategores as douyuGetCategory,
//   getCategoryRooms as biliGetCategoryRooms,
// } from "~/apis/douyu";
//
// import { useLoaderData } from "@remix-run/react";
//
// export const loader = async ({ params }: LoaderFunctionArgs) => {
//   console.info("params", params);
//   const platform = params.platform;
//   if (!platform) {
//     throw new Error("platform is required");
//   }
//   switch (platform) {
//     case "bilibili": {
//       const category = await biliGetCategory();
//       return { category };
//     }
//     case "douyu": {
//       const category = await douyuGetCategory();
//       return { category };
//     }
//     default:
//       return redirect("/404");
//   }
//   // const category = await biliGetCategory();
//   // const searchParam = new URLSearchParams(request.url);
//   // const categoryType = searchParam.get("categoryId");
//   // const page = Number(searchParam.get("page") ?? 1);
//   // if (categoryType) {
//   //   const categoryItem = category.find((item) => item.id === categoryType);
//   //   if (categoryItem) {
//   //     biliGetCategoryRooms(categoryItem.children, page);
//   //   }
//   // }
//   // const defaultCategory = category[0];
//   // return { category };
// };
//
// export default function DouyuCatagory() {
//   const data = useLoaderData<typeof loader>();
//   return <pre>{JSON.stringify(data, null, 4)}</pre>;
// }
