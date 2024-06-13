import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from 'next/server';
import { scrapeArticlesForUser } from "../../lib/scrape-articles-for-user";

export async function GET(req: NextRequest) {
  console.log(`api/scrape-articles: Called`)

  if (req.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    console.error(`api/scrape-articles: Unauthorized`)
    return NextResponse.json({error: "unauthorized"}, { status: 403 });
    }

    console.error(`api/scrape-articles: Authorized`)

  const supabase = createClient(true);

  const { data: {users}, error } = await supabase.auth.admin.listUsers({
    page: 1,
    perPage: 1000
  });

  if(error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  console.log(`api/scrape-articles: Successfully fetched ${users.length} users`)

  const successUserIds = [];
  const failureuserIds = [];

  for (const user of users) {
    const { data, error } = await scrapeArticlesForUser(user)

    if(error) {
      console.error(`api/scrape-articles: Error scraping articles for user ${user.id}`)
      console.error(error)
      failureuserIds.push(user.id);
    } else {
      console.log(`api/scrape-articles: Successfully scraped articles for user ${user.id}`)
      successUserIds.push(user.id);
    }
  }

  console.log(`api/scrape-articles: Done`)
  return NextResponse.json({
    ok: true,
    nUsers: users.length,
    successRate: successUserIds.length / users.length,
    successUserIds,
    failureuserIds
  });
}