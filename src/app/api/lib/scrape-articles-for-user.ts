import selectors from "../cron/scrape-articles/selectors"
import * as cheerio from "cheerio";
import { ArticleInsert } from "@/utils/supabase/types";
import { User } from "@supabase/supabase-js";

type DataPayload = {
  data: ArticleInsert[] | null,
  error: { message: string } | null
}

export async function scrapeArticlesForUser(user: User): Promise<DataPayload>{
  const BI_DOMAIN = 'https://www.businessinsider.com';
  const BI_OUTLET_ID = '1';

  console.log(`lib.scrapeArticlesForUser(): Called`)

  console.log(`lib.scrapeArticlesForUser(): Fetching articles for user ${user.id}`)
  if(!user.user_metadata.author_pages || user.user_metadata.author_pages.length === 0) {
    console.log(`lib.scrapeArticlesForUser(): Aborting. No author page for user ${user.id}`)
    return {
      data: null,
      error: { message: `No author page for user ${user.id}` }
    };
  }
    
  const author_page = user.user_metadata.author_pages[0];
  console.log(`lib.scrapeArticlesForUser(): Accessing ${author_page}`)

  let response;

  try {
    response = await fetch(author_page);
    console.log(`lib.scrapeArticlesForUser(): Successfully fetched ${author_page}`)
  } catch (error) {
    console.error(`lib.scrapeArticlesForUser(): Error fetching ${author_page}`)
    console.error(error)
    return {
      data: null,
      error: { message: `Error fetching ${author_page}` }
    };
  }

  const html = await response.text();
  const dom = cheerio.load(html);

  const BI = selectors[BI_OUTLET_ID];

  const htmlArticles = dom(BI.articleDOMSelector)
  const author_raw =  dom(BI.authorDOMSelector).text();

  console.log(`lib.scrapeArticlesForUser(): ${htmlArticles.length} articles found`)

  const articlesToInsert: ArticleInsert[] = htmlArticles.map((i, el) => {
    const article = dom(el);
    const url_raw = `${BI_DOMAIN}${article.find(BI.articleUrlDOMSelector).attr('href')}`;
    const title_raw = article.find(BI.articleTitleDOMSelector).text();
    const published_at = article.find(BI.articlePublishedDateDOMSelector).text().trim();
    const created_by = user.id;
    return {author_raw, url_raw, title_raw, published_at, outlet_id: Number(BI_OUTLET_ID), created_by };
  }).get();

  return {
    data: articlesToInsert,
    error: null
  };  
}