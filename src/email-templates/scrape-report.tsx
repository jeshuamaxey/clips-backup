import * as React from 'react';
import { Head, Html, Tailwind } from "@react-email/components";

interface ScrapeReportEmailTemplateProps {
  nUsers: number,
  successRate: number,
  successUserIds: string[],
  failureuserIds: string[],
  start: Date,
  end: Date
  duration: string
}

export const ScrapeReportEmailTemplate: React.FC<Readonly<ScrapeReportEmailTemplateProps>> = ({
  nUsers,
  successRate,
  successUserIds,
  failureuserIds,
  start,
  end,
  duration
}) => (
  <Html>
    <Tailwind>
      <Head></Head>
      <main className="mb-4">
        <h1 className="text-2xl">Scrape report: {start.toISOString()}</h1>

        <pre>
          {JSON.stringify({
            duration,
            nUsers,
            successRate,
            successUserIds,
            failureuserIds,
            start,
            end,
          }, null, 4)}
        </pre>
      </main>
    </Tailwind>
  </Html>
);