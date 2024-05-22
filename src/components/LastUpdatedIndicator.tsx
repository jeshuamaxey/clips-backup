"use client"

import useArticles from "@/hooks/useArticles";
import { formatDistance } from "date-fns";

const LastUpdatedIndicator = () => {
  const articlesQuery = useArticles();

  if(articlesQuery.isLoading) return null;
  if(articlesQuery.isError) return null;
  if(!articlesQuery.data || articlesQuery.data.length === 0) return null;

  const articles = articlesQuery.data;

  return <div className="flex flex-row gap-4 justify-end">
    <p className="text-sm opacity-40">Data last updated {formatDistance(new Date(articles[0].created_at), new Date(), {addSuffix: true})}</p>
  </div>
}

export default LastUpdatedIndicator