import { GeistSans } from "geist/font/sans";
import "./globals.css";
import Query from "@/providers/queryClient";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "@/components/ui/toaster";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "My Story Safe",
  description: "A tool for journalists to securely backup published work and showcase it to editors.",
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={GeistSans.className}>
      <body className="bg-background text-foreground">
        <main className="min-h-screen flex flex-col items-center">
          <Query>
            {children}
            <ReactQueryDevtools buttonPosition="bottom-left" initialIsOpen={false} />
          </Query>
          <Toaster />
        </main>
      </body>
    </html>
  );
}
