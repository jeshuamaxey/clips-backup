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

  return <div className="flex flex-col gap-4">
    <div className="flex flex-row gap-4">
      <Card className="w-1/3">
        <CardHeader>
          <CardTitle>
            <span>{articles.length}</span>
          </CardTitle>
          <CardDescription>
            Articles recorded
          </CardDescription>
        </CardHeader>
      </Card>

      <Card className="w-1/3">
        <CardHeader>
          <CardTitle><span>{articles.filter(a => a.backed_up_at).length}</span></CardTitle>
          <CardDescription>Articles backed up</CardDescription>
        </CardHeader>
        <CardContent>
        </CardContent>
      </Card>

      <Card className="w-1/3">
        <CardHeader>
          <CardTitle><span>{publishedStr}</span></CardTitle>
          <CardDescription>Most recently published article</CardDescription>
        </CardHeader>
        <CardContent>
        </CardContent>
      </Card>
    </div>
  </div>
}

export default ArticlesPageHeader;