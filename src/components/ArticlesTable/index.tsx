"use client";

import useArticles from "@/hooks/useArticles";
import { DataTable } from "./DataTable";
import { columns } from "./columns";



const ArticlesTable = () => {
  const articlesQuery = useArticles();

  if (articlesQuery.isLoading) {
    return <p>Loading...</p>;
  }

  if (articlesQuery.isError) {
    return <p>Error: {articlesQuery.error.message}</p>;
  }

  const articles = articlesQuery.data!;

  return (
    <DataTable columns={columns} data={articles} />
  )
}

export default ArticlesTable;