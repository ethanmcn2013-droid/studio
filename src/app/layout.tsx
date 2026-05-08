import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "studio · tools for the 80%",
  description:
    "Studio builds focused software for people who don't work in tech. Two tools: Tasks and Roadmap.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://studio.vercel.app"
  ),
  openGraph: {
    title: "studio · tools for the 80%",
    description:
      "Studio builds focused software for people who don't work in tech.",
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
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
