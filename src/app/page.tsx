import getQueryClient from "@/utils/getQueryClient";
import { createClient } from "@/utils/supabase/server";
import { dehydrate } from "@tanstack/react-query";
import Hydrate from "@/providers/Hydrate";
import Header from "@/components/Header";
import { SELECT_ARTICLES } from "@/hooks/useArticles";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { ReactNode } from "react";

const WidthRestrictor = ({ children, className }: { children: ReactNode, className?: string }) => (
  <div className={`w-full max-w-4xl ${className}`}>{children}</div>
);

export default async function Index() {
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

      <Header mb={false} />

      <main className="w-full">
        <div className="flex-1 flex flex-col gap-20 w-full">
          <div className="bg-foreground">
            <WidthRestrictor className="mx-auto py-20">
              <div className="flex-1 flex flex-col gap-4 px-4">
                <h2 className="font-bold text-4xl py-4 text-background/60 leading-relaxed">
                  A tool for journalists to<br/>
                    <span className="text-background">
                    securely backup published work
                    </span>
                    <br/>
                    and&nbsp;
                    <span className="text-background">
                      showcase it to editors.
                    </span>
                </h2>
                <Button className="w-1/2" variant="outline" asChild>
                  <Link href="/signup">Get started</Link>
                </Button>
              </div>
            </WidthRestrictor>
          </div>

          <WidthRestrictor className="mx-auto">
            <div className="flex-1 flex flex-col gap-4 px-4">
              <h2 className="font-bold text-4xl py-4 text-foreground leading-relaxed">
                How it works
              </h2>
              <div className="flex-1 flex flex-col gap-16">
                <div className="flex gap-4">
                  <div className="flex flex-col gap-4">
                    <h3 className="font-bold text-xl text-foreground/100">1. Log your work</h3>
                    <Image alt="screenshot of the tool in action" src="/images/logging.png" width={1127} height={545} />
                    <p className="text-foreground/60">
                      Save links to your published work to your story safe using our browser extension.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex flex-col gap-4">
                    <h3 className="font-bold text-xl text-foreground/100">2. Track your publishing stats</h3>
                    <Image alt="screenshot of the tool in action" src="/images/dashboard.png" width={1127} height={545} />
                    <p className="text-foreground/60">
                      Automatically track your publishing record on your personal dashboard.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex flex-col gap-4">
                    <h3 className="font-bold text-xl text-foreground/100">3. Selectively backup entire articles</h3>
                    <Image alt="screenshot of the tool in action" src="/images/wayback.png" width={1127} height={545} />
                    <p className="text-foreground/60">
                      Easily find a wayback machine link to any of your logged stories, even if they've been taken down byy the original outlet.
                    </p>
                    <p className="text-foreground/60">
                      A PDF backup feature is coming soon!
                    </p>
                  </div>
                </div>
                {/* <div className="flex gap-4">
                  <div className="flex flex-col gap-4">
                    <h3 className="font-bold text-xl text-foreground/100">4. One-click create PDFs</h3>
                    <Image alt="screenshot of the tool in action" src="/images/logging.png" width={1127} height={545} />
                    <p className="text-foreground/60">
                      Our PDF backup feature (still in beta) allows you to backup a copy of the article to your story safe or download it locally.
                    </p>
                  </div>
                </div> */}
              </div>
            </div>
          </WidthRestrictor>

          <div className="bg-foreground">
            <WidthRestrictor className="mx-auto py-20">
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <Image className="block rounded-full w-4/5 md:w-1/2" alt="screenshot of the tool in action" src="/images/sinead-baker-sq.png" width={600} height={600} />
                <div className="w-4/5 md:w-1/2 flex flex-col gap-8">
                  <q className="text-4xl text-background">
                    Story Safe gives me peace of mind that my work is safe and secure. I can easily find links to my stories and backup the full article with one click.
                  </q>
                  <div>
                    <p className="text-4xl text-background/80">
                      Sinead Baker
                    </p>
                    <p className="text-4xl text-background/40">
                      News Correspondent, Business Insider
                    </p>
                  </div>
                </div>
              </div>
            </WidthRestrictor>
          </div>

          <footer>
            <WidthRestrictor className="mx-auto py-20">
              <div className="flex-1 flex flex-col items-center gap-4 px-4">
                <h2 className="font-bold text-4xl py-4 text-foreground leading-relaxed">
                  Ready to start?
                </h2>

                <div className="flex flex-col gap-4">
                  <p className="text-foreground/60">
                    Sign up for a free account and start logging your work today.
                  </p>
                  <Button className="w-1/2 mx-auto" asChild>
                    <Link href="/signup">Get started for free!</Link>
                  </Button>
                </div>
              </div>
            </WidthRestrictor>
          </footer>


        </div>
      </main>
    </div>
    </Hydrate>
  );
}
