import { Card, Pagination, SimpleGrid, Text } from "@mantine/core";
import { LoaderFunctionArgs } from "@remix-run/cloudflare";
import { supabaseClient } from "~/utils";
import { Link, useLoaderData, useNavigate } from "@remix-run/react";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const currPage = Number(new URL(request.url).searchParams.get("page") ?? 1);
  const limit = 40;
  const start = (currPage - 1) * limit;
  const end = start + limit;
  const {
    count,
    data: list,
    error,
  } = await supabaseClient
    .from("sys_article")
    .select("id,title", { count: "estimated", head: false })
    .range(start, end)
    .order("id", { ascending: false });
  if (error) throw error;

  return { totalPage: ((count! / limit) | 0) + 1, currPage, list };
};

export default function Index() {
  const { totalPage, currPage, list } = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  return (
    <>
      <SimpleGrid cols={4}>
        {list.map((i) => (
          <Link to={`/article/${i.id}`} key={i.id}>
            <Card
              shadow="sm"
              padding="xl"
              // h={40}
              // component="a"
              // href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
              // target="_blank"
            >
              <Text truncate>{i.title}</Text>
            </Card>
          </Link>
        ))}
      </SimpleGrid>
      <div className={"text-center flex justify-center mt-5"}>
        <Pagination
          total={totalPage}
          value={currPage}
          onChange={(newPage) => {
            navigate({
              pathname: ".",
              search: "?page=" + newPage,
            });
          }}
        />
      </div>
    </>
  );
}
