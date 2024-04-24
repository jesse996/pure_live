import { Card, Image, Pagination, SimpleGrid, Text } from "@mantine/core";
import { LoaderFunctionArgs, MetaFunction, redirect } from "@remix-run/node";
import {
  type ClientLoaderFunctionArgs,
  Link,
  useLoaderData,
  useSearchParams,
} from "@remix-run/react";
import { supabaseClient } from "~/utils";

export const meta: MetaFunction<typeof loader> = ({}) => {
  return [{ title: "新新闻" }];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  throw redirect("/live/bilibili/category/2");
};

// export default function Index() {
//   const { totalPage, currPage, list, host } = useLoaderData<typeof loader>();
//   const [searchParam, setSearchParam] = useSearchParams();
//   // console.info("sear", searchParam);
//   return (
//     <div
//     // style={{ backgroundImage: 'url("https://api.likepoems.com/img/pc/")' }}
//     >
//       <SimpleGrid cols={{ xs: 1, sm: 2, md: 4 }}>
//         {list.map((i) => (
//           <Link to={`/article/${i.id}`} key={i.id}>
//             <Card
//               shadow="sm"
//               padding="xl"
//               // h={200}
//               // component="a"
//               // href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
//               // target="_blank"
//             >
//               <Card.Section>
//                 <Image
//                   src={`https://picsum.photos/seed/${i.title}/200/160`}
//                   h={160}
//                   alt={i.title}
//                 />
//               </Card.Section>
//               <Text truncate>{i.title}</Text>
//             </Card>
//           </Link>
//         ))}
//       </SimpleGrid>
//       <img
//         src={`https://api.likepoems.com/counter/get/@${host}`}
//         alt="count"
//         className={"h-14 absolute mt-2"}
//       />
//       <div className={"text-center flex justify-center mt-5"}>
//         <Pagination
//           total={totalPage}
//           value={currPage}
//           onChange={(newPage) => {
//             searchParam.set("page", newPage.toString());
//             setSearchParam(searchParam);
//           }}
//         />
//       </div>
//     </div>
//   );
// }
