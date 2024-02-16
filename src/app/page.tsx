import getQueryClient from "@/utils/getQueryClient";
import { createClient } from "@/utils/supabase/server";
import { dehydrate } from "@tanstack/react-query";
import Hydrate from "@/providers/Hydrate";
import Header from "@/components/Header";

export default async function Index() {
  const supabase = createClient();

  const queryClient = getQueryClient()
  await queryClient.prefetchQuery({ queryKey: ["articles"], queryFn: async() => {
    const {data, error} = await supabase.from("articles").select("*")
    return data
  }})
  const dehydratedState = dehydrate(queryClient)

  return (
    <Hydrate state={dehydratedState}>
    <div className="flex-1 w-full flex flex-col gap-20 items-center">

      <Header />

      <div className="w-full max-w-4xl">
        <div className="flex-1 flex flex-col gap-20 w-full px-3">
          <main className="flex-1 flex flex-col gap-6">
            <h2 className="font-bold text-4xl py-4 text-foreground/60 leading-relaxed">
              A tool for journalists to<br/>
                <span className="text-foreground/100">
                securely backup published work
                </span>
                <br/>
                and&nbsp;
                <span className="text-foreground/100">
                  showcase it to editors.
                </span>
            </h2>
          </main>
        </div>
      </div>
    </div>
    </Hydrate>
  );
}
