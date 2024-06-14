import * as React from 'react';
import { Head, Html, Tailwind } from "@react-email/components";
import { ArticleSB } from '@/utils/supabase/types';

interface EmailTemplateProps {
  firstName: string;
  lastWeeksArticles: ArticleSB[];
  prevWeekArticles: {id: number}[];
  thisMonthsArticles: {id: number}[];
  lastMonthsArticles: {id: number}[];
}

const Panel = ({children, className}: {children: React.ReactNode, className: string}) => (
  <div className={`p-4 bg-slate-100 rounded-md ${className}`}>
    {children}
  </div>
)

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  firstName,
  lastWeeksArticles,
  prevWeekArticles,
  thisMonthsArticles,
  lastMonthsArticles
}) => (
  <Html>
    <Tailwind>
      <Head></Head>
      <main className="mb-4">
        <h1 className="text-2xl">Hello {firstName}</h1>
        <p className="text-lg">Let's take a look at last week's stats.</p>

        <div className="flex flex-row mb-4">
          <div className="w-1/2 p-4 bg-slate-100 rounded-md text-center">
            <p className="text-6xl m-0 font-bold">{lastWeeksArticles.length}</p>
            <p className="font-bold">Published last week</p>
          </div>
          <div className="w-1/2 p-4 bg-slate-100 rounded-md text-center mx-2">
            <p className="text-6xl m-0 font-bold">{prevWeekArticles.length}</p>
            <p className="font-bold">Published previous week</p>
          </div>
        </div>

        <div className="flex flex-row mb-4">
          <div className="w-1/2 p-4 bg-slate-100 rounded-md text-center">
            <p className="text-6xl m-0 font-bold">{thisMonthsArticles.length}</p>
            <p className="font-bold">This month so far</p>
          </div>
          <div className="w-1/2 p-4 bg-slate-100 rounded-md text-center mx-2">
            <p className="text-6xl m-0 font-bold">{lastMonthsArticles.length}</p>
            <p className="font-bold">Last month</p>
          </div>
        </div>

        <h1 className="text-2xl">Last week's articles</h1>

        {lastWeeksArticles.length > 0 && lastWeeksArticles.map((article, index) => (
          <div key={article.id} className="p-4 bg-slate-100 rounded-md mb-2">
            <p className="text-sm text-slate-700 p-0">{new Date(article.published_at).toDateString()} | {article.outlets?.name}</p>
            <p className="text-md font-bold">{article.title_raw}</p>
            <p>
              <a href={article.url_raw} className="text-sm text-blue-600 hover:underline">View on {article.outlets?.name}</a>
            </p>
          </div>
        ))}

      </main>
    </Tailwind>
  </Html>
);
