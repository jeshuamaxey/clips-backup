"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import useArticles from "@/hooks/useArticles";
import { formatDistance } from "date-fns";

const ArticlesPageHeader = () => {
  const articlesQuery = useArticles()

  if (articlesQuery.isLoading) return <div>Loading...</div>
  if (articlesQuery.isError) return <div>Error</div>

  const articles = articlesQuery.data!

  if(!articles || articles.length === 0) { 
    return null
  }

  return <div className="flex flex-row gap-4">
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
        <CardTitle><span>{formatDistance(new Date(articles[0].published_at), new Date(), {addSuffix: true})}</span></CardTitle>
        <CardDescription>Most recently recorded article</CardDescription>
      </CardHeader>
      <CardContent>
      </CardContent>
    </Card>
  </div>
}

export default ArticlesPageHeader;