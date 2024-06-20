import { ArticleInsert } from "@/utils/supabase/types";

type DataPayload = {
  data: null,
  error: { message: string }
} | {
  data: ArticleInsert[],
  error: null
}

export async function addWaybackLinksToArticles(articles: ArticleInsert[]): Promise<DataPayload>{
  const fnName = 'lib.getWaybackLinksForUser()';

  console.log(`${fnName}: Called`)

  const articleRequests = articles.map(async article => {
    console.log(`${fnName}: Fetching wayback machine link for ${article.url_raw}`)

    const response = await fetch(`https://archive.org/wayback/available?url=${article.url_raw}`)
    const json = await response.json()

    if(json.archived_snapshots.closest) {
      console.log(`${fnName}: Found wayback machine link for ${article.url_raw}`)
      const wayback_machine_url = json.archived_snapshots.closest.url
      return { ...article, wayback_machine_url };
    }
    console.log(`${fnName}: No wayback machine link found for ${article.url_raw}`)
    return article;
  })

  const data: ArticleInsert[] = await Promise.all(articleRequests)
  const nSuccess = data.filter(article => article.wayback_machine_url).length

  console.log(`${fnName}: Successfully fetched wayback machine links for ${nSuccess} out of ${data.length} articles`)
  return {
    data,
    error: null
  };
}