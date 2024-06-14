import sendWeeklyRoundupEmail from "@/app/api/lib/send-weekly-roundup-email";
import { createClient } from "@/utils/supabase/server";
import { User } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from 'next/server';

const API_PATH = `api/cron/emails/weekly-roundup`

const validUser = (user: User) => {
  return (
    user.email_confirmed_at !== null
  )
}

export async function GET(req: NextRequest) {
  console.log(`${API_PATH}: Called`)

  if (req.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    console.error(`${API_PATH}: Unauthorized`)
    return NextResponse.json({error: "unauthorized"}, { status: 403 });
  }

  console.log(`${API_PATH}: Authorized`)

  const supabase = createClient(true);
  const { data: { users }, error} = await supabase.auth.admin.listUsers()

  const results = await Promise.all(
    users
      .filter(validUser)
      .map(async (user) => {
        const { data, error } = await sendWeeklyRoundupEmail(user)
        return { user, data, error }
      })
  )

  console.log(`${API_PATH}: START Errors`)
  results
    .filter(({ error }) => error)
    .forEach(({ user, error }) => {
      console.error(`${API_PATH}: Error sending weekly roundup email to ${user.email}: ${error}`)
    })
  console.log(`${API_PATH}: END Errors`)

  console.log(`${API_PATH}: Done`)

  return NextResponse.json({
    ok: true,
    nUsers: results.length,
    nSuccess: results.filter(({ data }) => data).length,
    nFail: results.filter(({ error }) => error).length,
  });

}