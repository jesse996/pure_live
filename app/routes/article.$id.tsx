import { LoaderFunctionArgs, MetaFunction } from "@remix-run/cloudflare";
import { supabaseClient } from "~/utils";
import { useLoaderData } from "@remix-run/react";
import { TypographyStylesProvider } from "@mantine/core";
import Markdown from "react-markdown";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [{ title: "新新闻 - " + data?.title }];
};
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
        {data.content_type === "md" ? (
          <Markdown>{data.content}</Markdown>
        ) : (
          <article dangerouslySetInnerHTML={{ __html: data.content }} />
        )}
      </TypographyStylesProvider>

      <img
        src={`https://api.likepoems.com/counter/get/@$article.fml233.cn_${data.title}`}
        alt="count"
        className={"h-14 absolute mt-2"}
      />
    </div>
  );
}
