import { LoaderFunctionArgs } from "@remix-run/cloudflare";
import { client } from "~/utils";
import { readItem } from "@directus/sdk";
import { useLoaderData } from "@remix-run/react";
import { TypographyStylesProvider } from "@mantine/core";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  return await client.request(readItem("article", params.id!));
};
export default function ArticleDetail() {
  const data = useLoaderData<typeof loader>();
  return (
    <div>
      <TypographyStylesProvider>
        <h1>{data.title}</h1>
        <article dangerouslySetInnerHTML={{ __html: data.content }} />
      </TypographyStylesProvider>
    </div>
  );
}
