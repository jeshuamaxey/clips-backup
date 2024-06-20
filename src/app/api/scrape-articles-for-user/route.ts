import { jwtDecode } from "jwt-decode";
import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from 'next/server';
import { User } from "@supabase/supabase-js";
import { SELECT_ARTICLES } from "@/hooks/useArticles";
import { scrapeArticlesForUser } from "../lib/scrape-articles-for-user";
import { addWaybackLinksToArticles } from "../lib/get-wayback-links-for-user";

export async function GET(req: NextRequest) {
  const fnName = 'GET api/scrape-articles-for-user';

  console.log(`${fnName}: Called`)

  const supabase = createClient(true);
  let user: User;
  
  try {
    const bearerToken = req.headers.get('Authorization')?.split(' ')[1]!;
    const token = jwtDecode(bearerToken);
    const userId = token.sub || "NO_ID_FROM_TOKEN";

    console.log(`${fnName}: Fetching user ${userId}`)

    
    const { data, error } = await supabase.auth.admin.getUserById(userId);
    
    if(error) throw error;
    
    user = data.user;
  } catch(error: any) {
    console.log(`${fnName}: Could not get user`)
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
    
  console.log(`${fnName}: User ${user.id} fetched successfully`)
  const { data: scrapedArticles, error: scrapeError } = await scrapeArticlesForUser(user);

  if(scrapeError) {
    console.error(`${fnName}: Error scraping articles for user ${user.id}`)
    console.error(scrapeError)
    
    return NextResponse.json({
      error: scrapeError.message
    }, { status: 500 });
  }

  let articlesToInsert;
  const {data, error: waybackError } = await addWaybackLinksToArticles(scrapedArticles);

  if(waybackError) {
    console.error(`${fnName}: Error scraping articles for user ${user.id}`)
    console.error(waybackError)
    articlesToInsert = scrapedArticles;
  } else {
    articlesToInsert = data;
  }

  const { data: articles, error: insertError } = await supabase.from('articles')
    .upsert(articlesToInsert, { onConflict: 'created_by,url_raw', ignoreDuplicates: true })
    .select(SELECT_ARTICLES)

  if(insertError) {
    console.error(`${fnName}: Error inserting articles for user ${user.id}`)
    console.error(insertError)
    
    return NextResponse.json({
      error: insertError.message
    }, { status: 500 });
  }

  console.log(`${fnName}: Successfully inserted ${articles.length} articles for user ${user.id}`)

  return NextResponse.json({
    data: articles
  }, { status: 200 });
}
