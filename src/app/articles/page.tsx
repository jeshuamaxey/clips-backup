import ArticlesPageHeader from "@/components/ArticlesPageHeader";
import ArticlesTable from "@/components/ArticlesTable";
import Header from "@/components/Header";
import { SELECT_ARTICLES } from "@/hooks/useArticles";
import Hydrate from "@/providers/Hydrate";
import getQueryClient from "@/utils/getQueryClient";
import { createClient } from "@/utils/supabase/server";
import { dehydrate } from "@tanstack/react-query";

const ArticlesPage = async () => {
  const supabase = createClient();

  const queryClient = getQueryClient()
  await queryClient.prefetchQuery({ queryKey: ["articles"], queryFn: async() => {
    const {data, error} = await supabase.from("articles").select(SELECT_ARTICLES).order("published_at", {ascending: false})
    return data
  }})
  const dehydratedState = dehydrate(queryClient)

  return (
    <Hydrate state={dehydratedState}>
      <div className="flex-1 w-full flex flex-col items-center">
        <Header />
        <div className="w-full max-w-4xl flex flex-col gap-4">
          <ArticlesPageHeader />
          <ArticlesTable />
        </div>
      </div>
    </Hydrate>
  );
}

export default ArticlesPage;