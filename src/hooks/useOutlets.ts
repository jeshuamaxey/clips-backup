import { createClient } from "@/utils/supabase/client"
import { useQuery } from "@tanstack/react-query"

export const SELECT_OUTLETS = `*`

const useOutlets = () => {
  const supabase = createClient()
  const outletsQuery = useQuery({
    queryKey: ["outlets"],
    queryFn: async () => {
      const { data, error } = await supabase.from("outlets").select(SELECT_OUTLETS)
      return data
    },
  })

  return outletsQuery
}

export default useOutlets
