import { useState } from "react"
import Hyperlink from "./Hyperlink"
import { Button } from "./ui/button"
import { Loader2Icon } from "lucide-react"

const WaybackMachineLink = ({ url }: { url: string }) => {
  const [loading, setLoading] = useState(false)
  const [searchedFor, setSearchedFor] = useState(false)
  const [waybackup, setWaybackup] = useState<{
    status: string,
    available: boolean,
    url: string
    timestamp: string
  } | null>(null)

  if(waybackup) {
    return (
      <Button size="sm" variant="outline" asChild>
        <Hyperlink target="_blank" href={waybackup.url}>
        View on wayback
      </Hyperlink>
      </Button>
    )
  } else if(searchedFor) {
    return (
      <span>Not found</span>
    )
  } else {
    return (
      <Button size="sm" variant="outline"
        onClick={async () => {
          setLoading(true)
          const response = await fetch(`https://archive.org/wayback/available?url=${url}`)
          const json = await response.json()
          if(json.archived_snapshots.closest) {
            setWaybackup(json.archived_snapshots.closest)
          }
          setLoading(false)
          setSearchedFor(true)
      }}>
        {loading ? <>
          <Loader2Icon size={16} className="mr-1 animate-spin"/>
        </> : "Search"}
      </Button>
    )
  }
}

export default WaybackMachineLink