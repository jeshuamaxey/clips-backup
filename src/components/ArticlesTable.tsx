"use client";

import useArticles from "@/hooks/useArticles";
import { createClient } from "@/utils/supabase/client";
import { useState } from "react";
import { Button } from "./ui/button";

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
    <table>
      <thead>
        <tr>
          <th>Title</th>
          <th>Author</th>
          <th>Publish date</th>
          <th>Backup</th>
        </tr>
      </thead>
      <tbody>
        {articles.map((article) => (
          <tr key={article.id}>
            <td>{article.title_raw}</td>
            <td>{article.author_raw}</td>
            <td>{new Date(article.published_at).toDateString()}</td>
            <td>{article.backed_up_at ? (
              signedUrls[article.backup_pdf_path!] ? (
                <a href={signedUrls[article.backup_pdf_path!]} download>
                  Download
                </a>
              ) : (
                <Button onClick={() => getBackupUrl(article.backup_pdf_path!)} disabled={signedUrls[article.backup_pdf_path!] === LOADING}>
                  {signedUrls[article.backup_pdf_path!] === LOADING ? "Loading..." : "Generate link"}
                </Button>
              )
            ) : "Not backed up"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default ArticlesTable;