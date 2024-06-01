"use client";

import useArticles from "@/hooks/useArticles";
import { DataTable } from "./DataTable";
import { getColumns } from "./columns";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Session } from "@supabase/supabase-js";
import { ArticlesSB } from "@/utils/supabase/types";
import { ColumnDef } from "@tanstack/react-table";



const ArticlesTable = () => {
  const supabase = createClient();
  const [session, setSession] = useState<Session | null>(null)
  const [columns, setColumns] = useState<ColumnDef<ArticlesSB>[]>([])

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if(session) {
        setSession(session)
        setColumns(getColumns(session));
      }
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])

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