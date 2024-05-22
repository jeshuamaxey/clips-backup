import { useState } from "react"
import Hyperlink from "./Hyperlink"
import { Button } from "./ui/button"
import { set } from "date-fns"

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
      <Hyperlink target="_blank" href={waybackup.url}>
        View on wayback
      </Hyperlink>
    )
  } else if(searchedFor) {
    return (
      <span>Not found</span>
    )
  } else {
    return (
      <Button variant="outline"
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
        {loading ? "Searching..." : "Search"}
      </Button>
    )
  }
}

export default WaybackMachineLink