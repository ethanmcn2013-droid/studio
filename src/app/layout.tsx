import type { Metadata, Viewport } from "next";
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

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // Notch / home-indicator hardware: opt into the full screen so
  // env(safe-area-inset-*) becomes meaningful on iOS.
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "Signal Studio · Project management for the 80% not in tech.",
  description:
    "Project management for the 80% who don't work in tech. Four small tools — Signal Tasks, Signal Roadmap, Signal Analytics, Signal Notes — that read as one system. Plain English. Built for the work, not the workflow.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://signalstudio.ie"
  ),
  openGraph: {
    title: "Signal Studio · Project management for the 80% not in tech.",
    description:
      "Four small tools. Plain English. Built for the work, not the workflow.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // ── Consent / cookie stance (hardening P10) ─────────────────────
  // The apex sets NO non-essential cookies. The only cookie in the
  // codebase is the HQ sign-in session (httpOnly, sameSite=strict,
  // path=/hq) — strictly necessary, consent-exempt under GDPR/ePrivacy.
  // Vercel Web Analytics, if enabled, is cookieless and account-blind.
  // Therefore: NO cookie banner, by design — a banner for cookies that
  // don't exist is dark-pattern noise.
  // If a non-essential cookie/tracker is ever added: it requires PRIOR
  // opt-in consent (a real choice before it loads), never "by
  // continuing you agree". Revisit /privacy and this note together.
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded focus:bg-ink focus:px-3 focus:py-2 focus:text-sm focus:text-bg-elevated"
        >
          Skip to content
        </a>
        <SiteNav />
        {children}
      </body>
    </html>
  );
}
