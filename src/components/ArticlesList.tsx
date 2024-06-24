"use client";

import useArticles from "@/hooks/useArticles";
import Hyperlink from "./Hyperlink";
import { Article } from "@/utils/supabase/types";
import { Badge } from "./ui/badge";
import { Calendar, ExternalLink, Newspaper } from "lucide-react";
import Link from "next/link";
import { Session } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

const getBackupFileName = (title: string) => {
  return title.replace(/[^a-z0-9]/gi, '-').toLowerCase() + '.pdf';
};

const getBackupFilePath = (session: Session, title: string) => {
  const userId = session.user?.id;
  return `${userId}/${getBackupFileName(title)}`;
}

const backupArticle = (articleId: string, articalUrlRaw: string, articleTitleRaw: string) => {
  const BACKUP_ARTICLE_HASH = '#__CB_BACKUP_ARTICLE'
  const QUERY_PARAMS = {
    FILENAME: 'filename',
    ARTICLE_ID: 'article_id',
  }

  const url = new URL(articalUrlRaw);
  const filename = getBackupFileName(articleTitleRaw);

  url.searchParams.append(QUERY_PARAMS.FILENAME, filename);
  url.searchParams.append(QUERY_PARAMS.ARTICLE_ID, String(articleId));
  url.hash = BACKUP_ARTICLE_HASH;

  window.open(url.href, '_blank');
};

const getBackupStatus = (article: Article) => {
  if (article.backed_up_at) {
    return 'Very safe';
  }

  if(article.wayback_machine_url) {
    return 'Safe';
  }

  return 'Unsafe';
}

const downloadPDFBackup = async (article: Article) => {
  const supabase = createClient();

  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  if (!session) {
    console.error('Error getting session:', sessionError!.message);
    return;
  }

  const backupFilePath = getBackupFilePath(session, article.title_raw);
  console.log({backupFilePath})
  const { data, error: storageError } = await supabase.storage.from('article_backups').download(backupFilePath);

  if (!data) {
    console.error('Error downloading backup:', storageError!.message);
    return;
  }

  const url = window.URL.createObjectURL(data);
  const a = document.createElement('a');
  a.href = url;
  a.download = getBackupFileName(article.title_raw);
  a.click();
  window.URL.revokeObjectURL(url);
}

const ArticlesList = () => {
  const router = useRouter();
  const articlesQuery = useArticles();

  if (articlesQuery.isLoading) {
    return <p>Loading...</p>;
  }

  if (articlesQuery.isError) {
    return <p>Error: {articlesQuery.error.message}</p>;
  }

  const articles = articlesQuery.data!;

  return (
    <div className="w-full flex flex-col gap-4">
      {articles.map((article) => {
        return <div className="flex flex-col gap-8 py-6 px-4 border rounded-lg" key={article.id}>
          <Link className="text-foreground/60 hover:text-foreground group" href={article.url_raw} target="_blank">
            <h3 className="text-2xl">
              {article.title_raw}
              <ExternalLink className="inline relative transition-all -top-[1px] -left-4 opacity-0 group-hover:left-2 group-hover:opacity-100" size={16} />
            </h3>
          </Link>
          <div className="flex flex-row gap-4">
            <div className="flex flex-col gap-1 w-1/3">
              <h4 className="font-bold">Meta data</h4>
              <p className="flex gap-1 items-center">
                <Calendar size={16} />
                {new Date(article.published_at).toDateString()}
              </p>
              <p className="flex gap-1 items-center">
                <Newspaper size={16} />
                {article.outlets?.name}
              </p>
            </div>
            <div className="flex flex-col gap-1 w-1/3">
              <h4 className="font-bold">Back ups <Badge>{getBackupStatus(article)}</Badge></h4>
                {article.wayback_machine_url ? (
                  <Hyperlink href={article.wayback_machine_url} target="_blank">Wayback</Hyperlink>
                ) : (
                  <p>No Wayback link</p>
                )}

                {article.backed_up_at ? (
                  <Hyperlink href="#" onClick={() => downloadPDFBackup(article)}>Download</Hyperlink>
                  ) : (
                    <Hyperlink href="#" onClick={() => backupArticle(String(article.id), article.url_raw, article.title_raw)}>Backup now</Hyperlink>
                )}
            </div>
            <div className="flex flex-col gap-1 w-1/3">
                {/* third col */}
            </div>
          </div>
        </div>;
      })}
    </div> 
  )
}

export default ArticlesList;