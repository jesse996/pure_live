import { Card, Container, Pagination, SimpleGrid, Text } from "@mantine/core";
import { LoaderFunctionArgs } from "@remix-run/cloudflare";
import { client } from "~/utils";
import { aggregate, readItems } from "@directus/sdk";
import { Link, useLoaderData, useNavigate } from "@remix-run/react";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const currPage = Number(new URL(request.url).searchParams.get("page") ?? 1);
  const count = Number(
    (
      await client.request(
        aggregate("article", {
          aggregate: { count: "*" },
        })
      )
    )[0].count
  );
  const limit = 40;
  const list = await client.request(
    readItems("article", {
      fields: ["id", "title"],
      page: currPage,
      limit,
      sort: ["-id"],
    })
  );
  return { totalPage: ((count / limit) | 0) + 1, currPage, list };
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
