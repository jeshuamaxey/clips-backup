import { createClient } from "@/utils/supabase/client"
import { UserMetadata } from "@/utils/supabase/types"
import { useMutation, useQueryClient } from "@tanstack/react-query"

const useUpdateUserMetadata = () => {
  const supabase = createClient()
  const queryClient = useQueryClient()
  const myProfileMutation = useMutation({
    mutationKey: ["users", "me"],
    mutationFn: async (newMetadata: UserMetadata) => {
      const {data: { user }, error} = await supabase.auth.updateUser({ data: newMetadata })

      if (error) {
        throw new Error("Error updating profile")
      }
      
      return user
    },
    onSuccess: () => {
      console.log("user metadata updated")
      queryClient.invalidateQueries({
        queryKey: ["users", "me"]
      })
    }
  })

  return myProfileMutation
}

export default useUpdateUserMetadata
