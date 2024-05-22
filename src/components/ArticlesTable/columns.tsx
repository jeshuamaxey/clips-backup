import { ArticlesSB } from "@/utils/supabase/types";
import { ColumnDef } from "@tanstack/react-table";
import FileDownloadButton from "../FileDownloadButton";
import Hyperlink from "../Hyperlink";
import WaybackMachineLink from "../WaybackMachineLink";

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
    accessorKey: "url_raw",
    header: "Wayback Machine",
    cell: ({ row }) => {
      const url: string = row.getValue("url_raw")

      return <WaybackMachineLink url={url} />
    },
  }
]