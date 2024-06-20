import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from 'next/server';
import { scrapeArticlesForUser } from "../../lib/scrape-articles-for-user";
import sendScrapeReportEmail from "../../lib/send-scrape-report-email";
import { SELECT_ARTICLES } from "@/hooks/useArticles";
import { addWaybackLinksToArticles } from "../../lib/get-wayback-links-for-user";

const fnName = "api/cron/scrape-articles"

export async function GET(req: NextRequest) {
  console.log(`${fnName}: Called`)

  const start = new Date()

  if (req.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    console.error(`${fnName}: Unauthorized`)
    return NextResponse.json({error: "unauthorized"}, { status: 403 });
    }

    console.error(`${fnName}: Authorized`)

  const supabase = createClient(true);

  const { data: {users}, error } = await supabase.auth.admin.listUsers({
    page: 1,
    perPage: 1000
  });

  if(error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  console.log(`${fnName}: Successfully fetched ${users.length} users`)

  const successUserIds = [];
  const failureuserIds = [];

  for (const user of users) {
    const { data, error } = await scrapeArticlesForUser(user)

    if(error) {
      console.error(`${fnName}: Error scraping articles for user ${user.id}`)
      console.error(error)
      failureuserIds.push(user.id);
      continue;
    }
  
    console.log(`${fnName}: Successfully scraped articles for user ${user.id}`)

    const {data: articlesToInsert, error: waybackError} = await addWaybackLinksToArticles(data)

    if(waybackError) {
      console.error(`${fnName}: Error adding wayback links for user ${user.id}`)
      console.error(waybackError)
      failureuserIds.push(user.id);
      continue;
    }

    const { data: articles, error: insertError } = await supabase.from('articles')
      .upsert(articlesToInsert, { onConflict: 'created_by,url_raw', ignoreDuplicates: true })
      .select(SELECT_ARTICLES)

    if(insertError) {
      console.error(`${fnName}: Error inserting articles for user ${user.id}`)
      console.error(insertError)
      failureuserIds.push(user.id);
      continue;
    }

    console.log(`${fnName}: Successfully inserted ${articles.length} articles for user ${user.id}`)
    successUserIds.push(user.id);
  }

  const { data, error: reportEmailError } = await sendScrapeReportEmail({
    emails: ['me@jeshua.co'],
    report: {
      nUsers: users.length,
      successRate: successUserIds.length / users.length,
      successUserIds,
      failureuserIds,
      start,
      end: new Date()
    }
  })

  if(reportEmailError) {
    console.error(`${fnName}: Error sending scrape report email`)
    console.error(reportEmailError)
  }

  console.log(`${fnName}: Done`)
  return NextResponse.json({
    ok: true,
    nUsers: users.length,
    successRate: successUserIds.length / users.length,
    successUserIds,
    failureuserIds
  });
}