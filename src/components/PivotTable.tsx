"use client"

import useArticles from "@/hooks/useArticles";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"


type PivotTableProps = { }

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
]

const monthOrder = (a: string, b: string) => {
  const aMonth = a.slice(0, 3)
  const bMonth = b.slice(0, 3)
  return MONTHS.indexOf(aMonth) - MONTHS.indexOf(bMonth)
}

const PivotTable = ({}: PivotTableProps) => {
  const articlesQuery = useArticles();

  if (articlesQuery.isLoading) {
    return <p>Loading...</p>;
  }

  if (articlesQuery.isError) {
    return <p>Error: {articlesQuery.error.message}</p>;
  }

  const articles = articlesQuery.data!;

  const monthYearRows = articles.reduce((acc, article) => {
    const dateComponents = new Date(article.published_at).toDateString().split(" ")
    const month = dateComponents[1]
    const year = dateComponents[3]

    if (!acc[month]) {
      acc[month] ={
        [year]: 0
      };
    }
    if (!acc[month][year]) {
      acc[month][year] = 0;
    }
    acc[month][year]++;
    return acc;
  }, {} as Record<string, Record<string, number>>);

  const years = articles.reduce((acc, article) => {
    const dateComponents = new Date(article.published_at).toDateString().split(" ")
    const year = dateComponents[3]

    if (!acc.includes(year)) {
      acc.push(year);
    }
    return acc;
  }, [] as string[]);

  return <Table>
    <TableHeader>
      <TableRow>
        <TableHead>Month</TableHead>
        {years.map((year) => <TableHead className="text-right" key={year}>{year}</TableHead>)}
      </TableRow>
    </TableHeader>
    <TableBody>
      {Object.keys(monthYearRows).sort(monthOrder).map((monthYear, i) => {
        const month = monthYear.slice(0, 3)

        return <TableRow key={monthYear}>
          <TableCell>{monthYear}</TableCell>
          {years.map((year) => {
            const isFuture = new Date(Number(year), MONTHS.indexOf(month)).getTime() > new Date().getTime()

            return <TableHead className="text-right" key={year}>
              {isFuture ? "" : monthYearRows[month][year] || 0}
            </TableHead>
            }
          )}
        </TableRow>
        }
      )}
    </TableBody>
  </Table>
}

export default PivotTable;