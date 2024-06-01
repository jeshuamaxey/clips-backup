import { useState } from "react"
import { Button } from "./ui/button"
import { createClient } from "@/utils/supabase/client"
import Hyperlink from "./Hyperlink"
import { Download, Link, Loader2Icon } from "lucide-react"

type FileDownloadButtonProps = {
  fileBucket: string
  filePath: string
}

const FileDownloadButton = ({
  fileBucket,
  filePath,
  ...props
}: FileDownloadButtonProps) => {
  const supabase = createClient();
  const [generatingUrl, setGeneratingUrl] = useState<boolean>(false)
  const [signedUrl, setSignedUrl] = useState<string | undefined>(undefined)

  const generateUrl = async () => {
    setGeneratingUrl(true)
    const { data, error } = await supabase.storage
      .from(fileBucket)
      .createSignedUrl(filePath, 3600)
    
    if(error) {
      console.error(error)
    }
    if(data) {
      setSignedUrl(data.signedUrl)
    }
    setGeneratingUrl(false)
}

  if(signedUrl) {
    return <Button size="sm" variant="outline" asChild>
      <Hyperlink href={signedUrl} target="_blank" download>
        <Download size={16} className="mr-1"/>
        Download
      </Hyperlink>
    </Button>
  }

  if(generatingUrl) {
    return <Button size="sm" variant="outline" disabled>
      <Loader2Icon size={16} className="mr-1 animate-spin"/>
      Generating...
    </Button>
  }

  return (
    <Button size="sm" variant="outline" onClick={generateUrl}>
      <Link size={16} className="mr-1"/>
      Generate download link
    </Button>
  )
}

export default FileDownloadButton