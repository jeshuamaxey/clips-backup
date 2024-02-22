import { createClient } from "@/utils/supabase/client"
import { ProfileUpdate } from "@/utils/supabase/types"
import { useMutation, useQueryClient } from "@tanstack/react-query"

const useUpdateProfile = () => {
  const supabase = createClient()
  const queryClient = useQueryClient()
  const myProfileMutation = useMutation({
    mutationKey: ["profiles"],
    mutationFn: async (newProfile: ProfileUpdate) => {
      const {data: { user }, error: userError} = await supabase.auth.getUser()
      const { data: profile, error: profileError } = await supabase.from("profiles").update(newProfile).filter("id", "eq", user?.id).single()

      if (userError || profileError) {
        throw new Error("Error updating profile")
      }
      
      return profile
    },
    onSuccess: () => {
      console.log("Profile updated")
      queryClient.invalidateQueries({
        queryKey: ["profiles", "mine"]
      })
    }
  })

  return myProfileMutation
}

export default useUpdateProfile
