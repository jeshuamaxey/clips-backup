import { EmailTemplate } from "@/email-templates/weekly-roundup";
import { SELECT_ARTICLES } from "@/hooks/useArticles";
import { createClient } from "@/utils/supabase/server";
import { User } from "@supabase/supabase-js";
import { previousMonday, previousSunday, startOfDay, endOfDay, endOfMonth, startOfMonth, sub } from "date-fns";
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY)

const FN_NAME = "lib.sendWeeklyRoundupEmail"

const sendWeeklyRoundupEmail = async (user: User): Promise<{data: any, error: any}> => {
  console.log(`${FN_NAME}: Called`)
  console.log(`${FN_NAME}: Sending weekly roundup email to ${user.email}`)

  if(!user.email) {
    throw new Error(`${FN_NAME}: User email is missing for user ${user.id}`)
  }

  const supabase = createClient(true);

  const now = new Date()
  const thisWeekEnd = endOfDay(previousSunday(now))
  const thisWeekStart = startOfDay(previousMonday(thisWeekEnd))
  const previousWeekStart = sub(thisWeekStart, {weeks: 1})

  const thisMonthEnd = endOfMonth(now)
  const thisMonthStart = startOfMonth(now)
  const previousMonthStart = sub(thisMonthStart, {months: 1})

  // console.log({
  //   weekEnd: thisWeekEnd.toISOString(),
  //   weekStart: thisWeekStart.toISOString(),
  //   previousWeekStart: previousWeekStart.toISOString(),
  //   thisMonthEnd: thisMonthEnd.toISOString(),
  //   thisMonthStart: thisMonthStart.toISOString(),
  //   previousMonthStart: previousMonthStart.toISOString(),
  // })

  const { data: lastWeeksArticles, error } = await supabase.from("articles")
    .select(SELECT_ARTICLES)
    .eq("created_by", user.id)
    .gt("published_at", thisWeekStart.toISOString())
    .lte("published_at", thisWeekEnd.toISOString())

  const { data: prevWeekArticles, error: lastWeekError } = await supabase.from("articles")
    .select("id")
    .eq("created_by", user.id)
    .gt("published_at", previousWeekStart.toISOString())
    .lte("published_at", thisWeekStart.toISOString())

  const { data: thisMonthsArticles, error: thisMonthError } = await supabase.from("articles")
    .select("id")
    .eq("created_by", user.id)
    .gt("published_at", thisMonthStart.toISOString())
    .lte("published_at", thisMonthEnd.toISOString())

  const { data: lastMonthsArticles, error: lastMonthError } = await supabase.from("articles")
    .select("id")
    .eq("created_by", user.id)
    .gt("published_at", previousMonthStart.toISOString())
    .lte("published_at", thisMonthStart.toISOString())

  const allErrors = [{
    msg: `${FN_NAME}: Error fetching this week's articles for user ${user.id}`,
    err: error
  }, {
    msg: `${FN_NAME}: Error fetching last week's articles for user ${user.id}`,
    err: lastWeekError
  }, {
    msg: `${FN_NAME}: Error fetching this months's articles for user ${user.id}`,
    err: thisMonthError
  }, {
    msg: `${FN_NAME}: Error fetching last month's articles for user ${user.id}`, 
    err: lastMonthError
  }]
  
  allErrors.forEach(({err, msg}) => {
    if (err) {
      console.error(msg)
      console.error(err)
      throw new Error()
    }
  })

  console.log({
    lastWeeksArticles: lastWeeksArticles?.length,
    prevWeekArticles: prevWeekArticles?.length,
    thisMonthsArticles: thisMonthsArticles?.length,
    lastMonthsArticles: lastMonthsArticles?.length
  })

  const startDate = `${thisWeekStart.getDate()} ${thisWeekStart.toLocaleString('default', { month: 'long' })}`
  const endDate = `${thisWeekEnd.getDate()} ${thisWeekEnd.toLocaleString('default', { month: 'long' })}`
  const subject = `Story Safe roundup: ${startDate} - ${endDate}`

  try {
    const { data, error } = await resend.emails.send({
      from: 'Story Safe <roundup@notifications.mystorysafe.com>',
      to: [user.email],
      subject,
      react: EmailTemplate({
        firstName: user.user_metadata?.first_name,
        lastWeeksArticles: lastWeeksArticles!,
        prevWeekArticles: prevWeekArticles!,
        thisMonthsArticles: thisMonthsArticles!,
        lastMonthsArticles: lastMonthsArticles!,
      }),
      text: 'Hello, this is a test email',
    });

    if (error) {
      console.error(error)
      return { data: null, error };
    }

    console.log(`${FN_NAME}: Email sent to ${user.email}`)
    return { data, error: null};
  } catch (error) {
    return { data: null, error };
  }
}

export default sendWeeklyRoundupEmail