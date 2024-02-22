import { useState } from "react"
import { Button } from "./ui/button"
import { createClient } from "@/utils/supabase/client"
import Hyperlink from "./Hyperlink"

type FileDownloadButtonProps = {
  fileBucket: string
  filePath: string
}

const FileDownloadButton = ({
  fileBucket,
  filePath
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
    return <Hyperlink href={signedUrl} target="_blank" download>Download</Hyperlink>
  }

  if(generatingUrl) {
    return <Button disabled>Generating...</Button>
  }

  return (
    <Button onClick={generateUrl}>Generate download link</Button>
  )
}

export default FileDownloadButton