import { ArticleSB } from "@/utils/supabase/types";
import { ColumnDef } from "@tanstack/react-table";
import FileDownloadButton from "../FileDownloadButton";
import Hyperlink from "../Hyperlink";
import WaybackMachineLink from "../WaybackMachineLink";
import { CheckSquare, Square, X } from "lucide-react";
import { Button } from "../ui/button";
import { Session } from "@supabase/supabase-js";
import { Badge } from "../ui/badge";

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

  console.log({
    raw: articleTitleRaw,
    filename,
  });

  url.searchParams.append(QUERY_PARAMS.FILENAME, filename);
  url.searchParams.append(QUERY_PARAMS.ARTICLE_ID, String(articleId));
  url.hash = BACKUP_ARTICLE_HASH;

  window.open(url.href, '_blank');
};

export const getColumns = (session: Session): ColumnDef<ArticleSB>[] => [
  {
    accessorKey: "title",
    accessorFn: (row) => {
      return {
        title_raw: row.title_raw,
        url_raw: row.url_raw
      }
    },
    header: "Title",
    cell: ({ row }) => {
      const title: {
        url_raw: string,
        title_raw: string
      } = row.getValue("title")

      return (
        <div className="capitalize">
          <Hyperlink href={title.url_raw || ""}>
            {title.title_raw}
          </Hyperlink>
        </div>
      )
    },
  },
  {
    accessorKey: "author_raw",
    header: "Author",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("author_raw")}</div>
    ),
  },
  {
    accessorKey: "outlet_name",
    accessorFn: (row) => row.outlets?.name,
    header: "Outlet",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("outlet_name")}</div>
    ),
  },
  {
    accessorKey: "published_at",
    header: "Published",
    cell: ({ row }) => (
      <div className="">{new Date(row.getValue("published_at")).toDateString()}</div>
    ),
  },
  {
    accessorKey: "backed_up_at",
    header: "Status",
    cell: ({ row }) => (
      <Badge className={row.getValue("backed_up_at") ? "bg-green-500 hover:bg-green-500" : "bg-yellow-500 hover:bg-yellow-500"}>{row.getValue("backed_up_at") ? <CheckSquare size={16} /> : <X size={16} />}</Badge>
    ),
  },
  {
    accessorKey: "backed_up",
    accessorFn: (row) => {
      return {
        id: row.id,
        url_raw: row.url_raw,
        title_raw: row.title_raw,
        backed_up_at: row.backed_up_at
      }
    },
    header: "Back up",
    cell: ({ row }) => {
      const {
        backed_up_at,
        id: articleId,
        url_raw: articleUrlRaw,
        title_raw: articleTitleRaw
      }: {
        id: number,
        url_raw: string,
        title_raw: string,
        backed_up_at: string
      } = row.getValue("backed_up");

      if(backed_up_at) {
        return <div className="min-w-[140px]">
          <FileDownloadButton
            fileBucket="article_backups"
            filePath={getBackupFilePath(session, articleTitleRaw)}
            />

        </div>
      } else {
        return <div className="min-w-[140px]">
            <Button size="sm" variant="outline" onClick={() => backupArticle(String(articleId), articleUrlRaw, articleTitleRaw)}>
              Backup now
            </Button>
          </div>
        }
      },
  },
  {
    accessorKey: "url_raw",
    header: "Wayback Machine",
    cell: ({ row }) => {
      const url: string = row.getValue("url_raw")

      return <WaybackMachineLink url={url} />
    },
  }
]