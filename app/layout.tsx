import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import { Suspense } from "react";
import { FeedbackProvider } from "@/components/feedback";
import { Shell } from "@/components/Shell";
import { THEME_SCRIPT } from "@/lib/theme";
import "./globals.css";

const montserrat = Montserrat({ variable: "--font-montserrat", subsets: ["latin"] });
const inter = Inter({ variable: "--font-inter", subsets: ["latin"], weight: ["500", "700"] });

export const metadata: Metadata = {
  title: "MCL CRM Platform",
  description: "MCL CRM platform",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // suppressHydrationWarning: THEME_SCRIPT may add "dark" to <html> before React hydrates (that element only).
    <html lang="en" className={`${montserrat.variable} ${inter.variable} antialiased`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body className="font-sans">
        {/* Shell reads the pathname; on /leads/[id] that is only known at request time (cacheComponents). */}
        {/* Toasts and confirmations live above the Shell so they survive client-side navigation (e.g. login → dashboard). */}
        <FeedbackProvider>
          <Suspense>
            <Shell>{children}</Shell>
          </Suspense>
        </FeedbackProvider>
      </body>
    </html>
  );
}
