import { ArticlesSB } from "@/utils/supabase/types";
import { ColumnDef } from "@tanstack/react-table";
import FileDownloadButton from "../FileDownloadButton";
import Hyperlink from "../Hyperlink";

export const columns: ColumnDef<ArticlesSB>[] = [
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
    accessorKey: "backup",
    accessorFn: (row) => {
      return {
        backed_up: !!row.backed_up_at,
        backed_up_at: row.backed_up_at,
        pdf_path: row.backup_pdf_path
      }
    },
    header: "Backup",
    cell: ({ row }) => {
      const backup: {
        backed_up: boolean
        backed_up_at: string | null,
        pdf_path: string | null
      } = row.getValue("backup")

      if(!backup.backed_up) {
        return (
          <div className="">Not backed up</div>
        )
      }
      
      if(backup.pdf_path) {
        return (
          <div className="">
            <FileDownloadButton fileBucket="article_backups" filePath={backup.pdf_path} />
          </div>
        )
      }
    },
  },
]