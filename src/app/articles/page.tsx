import ArticlesPageHeader from "@/components/ArticlesPageHeader";
import ArticlesTable from "@/components/ArticlesTable";
import Header from "@/components/Header";
import Heatmap from "@/components/Heatmap";
import { SELECT_ARTICLES } from "@/hooks/useArticles";
import Hydrate from "@/providers/Hydrate";
import getQueryClient from "@/utils/getQueryClient";
import { createClient } from "@/utils/supabase/server";
import { dehydrate } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import LastUpdatedIndicator from "@/components/LastUpdatedIndicator";
import PivotTable from "@/components/PivotTable";
import UpdateDataButton from "@/components/UpdateDataButton";

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

        <div className="w-full max-w-4xl">
        <Tabs defaultValue="dashboard" className="">
          <div className="flex flex-row justify-between items-center">
            <TabsList>
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="publishingRecord">Publishing record</TabsTrigger>
              <TabsTrigger value="dataTable">Articles list</TabsTrigger>
            </TabsList>
            <div className="flex gap-2 items-center">
              <LastUpdatedIndicator />
              <UpdateDataButton />
            </div>
          </div>

          <TabsContent value="dashboard">
            <div className="flex flex-col gap-4">
              <ArticlesPageHeader />
            </div>
          </TabsContent>

          <TabsContent value="publishingRecord">
            <div className="flex flex-col gap-8 pt-8">
              <Heatmap />
              <PivotTable />
            </div>
          </TabsContent>

          <TabsContent value="dataTable">
            <ArticlesTable />
          </TabsContent>
        </Tabs>
        </div>
      </div>
    </Hydrate>
  );
}

export default ArticlesPage;