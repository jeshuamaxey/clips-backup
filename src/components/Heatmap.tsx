"use client";

import useArticles from '@/hooks/useArticles'
import { CalendarDatum, ResponsiveCalendar } from '@nivo/calendar'
import { Square } from 'lucide-react';
import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import resolveConfig from 'tailwindcss/resolveConfig'
import tailwindConfig from '../../tailwind.config';

const Heatmap = () => {
  const thisYear = new Date().getFullYear()
  const [year, setYear] = useState(thisYear)
  const { theme } = resolveConfig(tailwindConfig)
  const articlesQuery = useArticles()

  if(articlesQuery.isLoading) return (<div>Loading...</div>)
  if(articlesQuery.isError) return (<div>Error: {articlesQuery.error.message}</div>)
  if(!articlesQuery.data || articlesQuery.data.length === 0) return (<div>No data</div>)

  const articles = articlesQuery.data

  type dataType = {
    [key:string]: {
      value: number
    }
  }

  const heatmapDatamap = articles
  .filter((article) => new Date(article.published_at).getFullYear() === year)
  .reduce((data: dataType, article) => {
    const day = new Date(article.published_at).toISOString().split('T')[0]

    if(data[day]) {
      return {
        ...data,
        [day]: {
          value: data[day].value + 1
        }
      }
    }

    return {
      ...data,
      [day]: {
        value: 1
      }
    }
  }, {})


  const heatmapDataArray: CalendarDatum[] = Object.keys(heatmapDatamap).map((day) => {
    return {value: heatmapDatamap[day].value, day}
  })

  const firstDay = articles.sort((a, b) => new Date(a.published_at).getTime() - new Date(b.published_at).getTime())[0].published_at
  const firstYear = new Date(firstDay).getFullYear()

  const yearOptions = Array.from({length: thisYear - firstYear + 1}, (v, k) => firstYear+k)

  type twColorName = keyof typeof theme.colors
  type twToneIndex = keyof typeof theme.colors.green
  const tones: twToneIndex[] = ["100","200","300","400","500","600"]
  const baseColor: twColorName = "fuchsia"
  const colors = tones.map(num => theme.colors[baseColor][num])

  return (
    <div className="flex flex-col gap-2">
    <div className="h-40">
      <ResponsiveCalendar
          data={heatmapDataArray}
          from={`01-01-${year}`}
          to={`12-31-${year}`}
          emptyColor="#eeeeee"
          colors={colors}
          margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
          yearSpacing={40}
          monthBorderColor="#ffffff"
          dayBorderWidth={2}
          dayBorderColor="#ffffff"
          tooltip={n=> <span className="text-xs py-1 px-2 bg-foreground text-background rounded">
            {`${n.value} article${Number(n.value) === 1 ? "" : "s"} on ${new Date(n.day).toDateString()}`}
          </span>
          }
          legends={[
            {
              anchor: "bottom-right",
              direction: "row",
              translateY: 36,
              itemCount: 4,
              itemWidth: 42,
              itemHeight: 36,
              itemsSpacing: 14,
              itemDirection: "right-to-left"
            }
          ]}
          />
    </div>

    <div className="flex justify-between">
      <Select 
        value={String(year)}
        onValueChange={(value) => setYear(Number(value))}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Year" />
          </SelectTrigger>
          <SelectContent>
          {yearOptions.map((yr) => 
            <SelectItem key={yr} value={String(yr)}>{yr}</SelectItem>
          )}
          </SelectContent>
      </Select>

      <div className="flex gap-1 justify-center items-center">
        <span className="text-xs">Less</span>
        {colors.map((color, i) => <span key={i} className="text-xs" style={{color}}>
          <Square size={16} fill={color} />
        </span>)}
        <span className="text-xs">More</span>
      </div>
    </div>
    </div>

  )
}

export default Heatmap