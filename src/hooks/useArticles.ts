import { createClient } from "@/utils/supabase/client"
import { useQuery } from "@tanstack/react-query"

export const SELECT_ARTICLES = `
  *,
  outlets(*)
`

const useArticles = () => {
  const supabase = createClient()
  const articlesQuery = useQuery({
    queryKey: ["articles"],
    queryFn: async () => {
      const { data, error } = await supabase.from("articles").select(SELECT_ARTICLES).order('published_at', { ascending: false })
      console.log(data, error)
      return data
    },
  })

  return articlesQuery
}

export default useArticles
