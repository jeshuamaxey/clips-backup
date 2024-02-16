import { createClient } from "@/utils/supabase/client"
import { useQuery } from "@tanstack/react-query"

const useArticles = () => {
  const supabase = createClient()
  const articlesQuery = useQuery({
    queryKey: ["articles"],
    queryFn: async () => {
      const { data, error } = await supabase.from("articles").select("*")
      return data
    },
  })

  return articlesQuery
}

export default useArticles
