"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import useArticles from "@/hooks/useArticles";
import { createClient } from "@/utils/supabase/client";
import { useState } from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import Hyperlink from "./Hyperlink";

const ArticlesTable = () => {
  const LOADING = "__LOADING__"
  const [signedUrls, setSignedUrls] = useState<{[key: string]: string | undefined}>({});
  const supabase = createClient();
  const articlesQuery = useArticles();

  const getBackupUrl = async (path: string) => {
    setSignedUrls((prev) => ({ ...prev, [path]: LOADING }))
    const { data, error } = await supabase.storage
      .from('article_backups')
      .createSignedUrl(path, 3600)

    if(data) {
      setSignedUrls((prev) => ({ ...prev, [path]: data.signedUrl }))
    } else {
      setSignedUrls((prev) => ({ ...prev, [path]: undefined }))
      console.error(error)
    }
  }

  if (articlesQuery.isLoading) {
    return <p>Loading...</p>;
  }

  if (articlesQuery.isError) {
    return <p>Error: {articlesQuery.error.message}</p>;
  }

  const articles = articlesQuery.data!;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Author</TableHead>
          <TableHead>Publish date</TableHead>
          <TableHead>Backup</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {articles.map((article) => (
          <TableRow key={article.id}>
            <TableCell>{article.title_raw}</TableCell>
            <TableCell>{article.author_raw}</TableCell>
            <TableCell>{new Date(article.published_at).toDateString()}</TableCell>
            <TableCell>{article.backed_up_at ? (
              signedUrls[article.backup_pdf_path!] ? (
                <Hyperlink href={signedUrls[article.backup_pdf_path!]!} target="_blank" download>
                  Download
                </Hyperlink>
              ) : (
                <Button
                  size="sm"
                  onClick={() => getBackupUrl(article.backup_pdf_path!)}
                  disabled={signedUrls[article.backup_pdf_path!] === LOADING}
                  >
                  {signedUrls[article.backup_pdf_path!] === LOADING ? "Loading..." : "Generate link"}
                </Button>
              )
            ) : "Not backed up"}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default ArticlesTable;