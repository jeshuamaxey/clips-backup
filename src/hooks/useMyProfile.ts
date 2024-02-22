import { createClient } from "@/utils/supabase/client"
import { useQuery } from "@tanstack/react-query"

export const SELECT_PROFILE = `*`

const useMyProfile = () => {
  const supabase = createClient()
  const myProfileQuery = useQuery({
    queryKey: ["profiles", "mine"],
    queryFn: async () => {
      const {data: { user }, error: userError} = await supabase.auth.getUser()
      const { data: profile, error: profileError } = await supabase.from("profiles").select(SELECT_PROFILE).filter("id", "eq", user?.id).single()

      if (userError || profileError) {
        throw new Error("Error fetching profile")
      }
      
      return profile
    },
  })

  return myProfileQuery
}

export default useMyProfile
