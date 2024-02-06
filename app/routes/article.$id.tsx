import { LoaderFunctionArgs } from "@remix-run/cloudflare";
import { client, supabaseClient } from "~/utils";
import { readItem } from "@directus/sdk";
import { useLoaderData } from "@remix-run/react";
import { TypographyStylesProvider } from "@mantine/core";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  // return await client.request(readItem("article", params.id!));
  const { data, error } = await supabaseClient
    .from("sys_article")
    .select()
    .eq("id", params.id!)
    .single();
  if (error) throw error;
  return data;
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
