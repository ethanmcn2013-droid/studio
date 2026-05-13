import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SiteNav } from "@/components/layout/site-nav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Signal Studio · Project Management for the 80% not in tech.",
  description:
    "Plain language software for clear work. Four small tools — Signal Tasks, Signal Roadmap, Signal Analytics, Signal Notes — built for the 80% who don't work in tech.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://signalstudio.ie"
  ),
  openGraph: {
    title: "Signal Studio · Project Management for the 80% not in tech.",
    description:
      "Four small tools. Plain English. Built for the 80%.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <SiteNav />
        {children}
      </body>
    </html>
  );
}
