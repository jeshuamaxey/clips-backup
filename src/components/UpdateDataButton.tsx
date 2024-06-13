"use client"

import { useState } from "react"
import { Button } from "./ui/button"
import { createClient } from "@/utils/supabase/client"
import { AuthError } from "@supabase/supabase-js"
import { useToast } from "./ui/use-toast"
import getQueryClient from "@/utils/getQueryClient"

const UpdateDataButton = () => {
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<AuthError | null>(null)
  const toast = useToast()
  const queryClient = getQueryClient()

  const updateData = async () => {
    setLoading(true)
    console.log("updating...")

    const { data: { session }, error: userError } = await supabase.auth.getSession()

    if(userError) {
      console.error(userError)
      setError(userError)
      setLoading(false)
      toast.toast({title: "Error updating data", description: "Something went wrong while updating data. Please retry"})
      return
    }
    
    const res = await fetch("/api/scrape-articles-for-user", {
      headers: {
        "Authorization": `Bearer ${session?.access_token}`
      }
    })
    
    if(!res.ok) {
      toast.toast({
        title: "Error updating data",
        description: "Something went wrong while updating data. Please retry"
      })
      setLoading(false)
    }

    const body = await res.json()

    if(body.data.length === 0) {
      toast.toast({
        title: "Update complete",
        description: "We checked your author page, but no new articles were found. If you think this is a mistake, please get in touch"
      })
    } else {
      toast.toast({
        title: "Update complete",
        description: `We just logged ${body.data.length} new articles for you. You can now see them in the "Articles list" tab.`
      })

      await queryClient.invalidateQueries({
        queryKey: ["articles"]
      })
    }


    setLoading(false)
    return
  }
  
  return <Button size="sm" onClick={updateData} disabled={loading}>
    {loading ? "Updating..." : "Update now"}
  </Button>
}

export default UpdateDataButton