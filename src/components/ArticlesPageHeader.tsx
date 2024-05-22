"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import useArticles from "@/hooks/useArticles";
import { formatDistance, isToday } from "date-fns";

const ArticlesPageHeader = () => {
  const articlesQuery = useArticles()

  if (articlesQuery.isLoading) return <div>Loading...</div>
  if (articlesQuery.isError) return <div>Error</div>

  const articles = articlesQuery.data!

  if(!articles || articles.length === 0) { 
    return null
  }

  let publishedStr = ""

  const lastRecordedToday = isToday(new Date(articles[0].published_at))

  if(lastRecordedToday) {
    publishedStr = "Today"
  }
  else {
    publishedStr = formatDistance(new Date(articles[0].published_at), new Date(), {addSuffix: true, })
  }

  const nWriters = new Set(articles.map(a => a.author_raw)).size

  return <div className="grid grid-cols-3 gap-4">
    <Card className="text-center py-4 flex flex-col justify-end">
      <CardHeader>
        <CardTitle>
          <span className="text-6xl">{articles.length}</span>
        </CardTitle>
        <CardDescription>
          Articles recorded
        </CardDescription>
      </CardHeader>
    </Card>

    <Card className="text-center py-4 flex flex-col justify-end">
      <CardHeader>
        <CardTitle><span className="text-6xl">{articles.filter(a => a.backed_up_at).length}</span></CardTitle>
        <CardDescription>Articles backed up</CardDescription>
      </CardHeader>
    </Card>

    <Card className="text-center py-4 flex flex-col justify-end">
      <CardHeader>
        <CardTitle><span className="text-3xl">{publishedStr}</span></CardTitle>
        <CardDescription>Most recently published article</CardDescription>
      </CardHeader>
    </Card>

    <Card className="text-center py-4 flex flex-col justify-end">
      <CardHeader>
        <CardTitle><span className="text-6xl">{nWriters}</span></CardTitle>
        <CardDescription>Writers in dataset</CardDescription>
      </CardHeader>
    </Card>
  </div>
}

export default ArticlesPageHeader;