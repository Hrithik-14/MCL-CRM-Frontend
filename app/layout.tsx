import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import { Shell } from "@/components/Shell";
import "./globals.css";

const montserrat = Montserrat({ variable: "--font-montserrat", subsets: ["latin"] });
const inter = Inter({ variable: "--font-inter", subsets: ["latin"], weight: ["500", "700"] });

export const metadata: Metadata = {
  title: "MCL CRM Platform",
  description: "MCL CRM platform",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${montserrat.variable} ${inter.variable} antialiased`}>
      <body className="font-sans">
        <Shell>{children}</Shell>
      </body>
    </html>
  );
}
