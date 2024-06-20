import { ScrapeReportEmailTemplate } from "@/email-templates/scrape-report";
import { Resend } from 'resend';
import { formatDistanceStrict } from "date-fns";

const resend = new Resend(process.env.RESEND_API_KEY)

const FN_NAME = "lib.sendScrapeReportEmail"

type Args = {
  emails: string[],
  report: {
    nUsers: number,
    successRate: number,
    successUserIds: string[],
    failureuserIds: string[],
    start: Date,
    end: Date
  }
}

const sendScrapeReportEmail = async ({emails, report}: Args): Promise<{data: any, error: any}> => {
  console.log(`${FN_NAME}: Called`)
  console.log(`${FN_NAME}: Sending scrape report email to ${emails}`)

  if(emails.length === 0) {
    throw new Error(`${FN_NAME}: emails missing`)
  }

  const duration = formatDistanceStrict(report.start, report.end)

  const subject = `Story Safe scrape report: ${report.start}`

  try {
    const { data, error } = await resend.emails.send({
      from: 'Story Safe <roundup@notifications.mystorysafe.com>',
      to: emails,
      subject,
      react: ScrapeReportEmailTemplate({ ...report, duration }),
      text: 'Hello, this is a test email',
    });

    if (error) {
      console.error(error)
      return { data: null, error };
    }

    console.log(`${FN_NAME}: Email sent to ${emails.join(", ")}`)
    return { data, error: null};
  } catch (error) {
    return { data: null, error };
  }
}

export default sendScrapeReportEmail