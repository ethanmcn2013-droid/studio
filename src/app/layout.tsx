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
  title: "Signal Studio · Project Management for people not in tech.",
  description:
    "Plain-language project management for people who need clear work without tech-team jargon. Signal Tasks, Signal Roadmap, Signal Analytics, Signal Notes.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://signalstudio.ie"
  ),
  openGraph: {
    title: "Signal Studio · Project Management for people not in tech.",
    description:
      "Four products. One operating system for clarity. Everything important. Nothing distracting.",
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
