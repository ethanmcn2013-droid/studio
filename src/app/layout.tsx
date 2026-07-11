import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";
import { SiteNav } from "@/components/layout/site-nav";
import { DevBanner } from "@/components/dev-banner";
import { SITE_URL } from "@/lib/site-url";
import { VENUE_EDITION_ANNUAL_PRICE_EUR } from "@/lib/venue-edition";

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
  // R18 fix 2026-05-17: prevent the browser from painting a dark theme-color
  // frame during inter-domain navigation from/to dark-chrome OS tabs.
  // Both studio and tasks must declare white so the flash between white-surface
  // products is white→white, not dark→white.
  themeColor: "#ffffff",
};

export const metadata: Metadata = {
  title: "Signal Studio · Project management for the 80% not in tech.",
  description:
    "Project management for the 80% who don't work in tech. Four small tools · Signal Notes, Signal Tasks, Signal Timeline, Signal, that read as one system. Plain English. Built for the work, not the workflow.",
  metadataBase: new URL(
    SITE_URL
  ),
  manifest: "/manifest.webmanifest",
  openGraph: {
    title: "Signal Studio · Project management for the 80% not in tech.",
    description:
      "Four small tools. Plain English. Built for the work, not the workflow.",
    type: "website",
  },
};

const structuredData = [
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Signal Studio",
    url: SITE_URL,
    email: "hello@signalstudio.ie",
    foundingDate: "2025",
    logo: {
      "@type": "ImageObject",
      url: `${SITE_URL}/opengraph-image`,
      width: 1200,
      height: 630,
    },
    founder: {
      "@type": "Person",
      name: "Ethan McNamara",
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Limerick",
      addressCountry: "IE",
    },
    sameAs: [
      "https://www.linkedin.com/company/signalstudio-ie/",
      "https://x.com/SignalStudioIE",
      "https://www.instagram.com/signalstudioie/",
      "https://www.youtube.com/@SignalStudioIE",
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Signal Studio",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    url: SITE_URL,
    description:
      "Project management for the 80% who don't work in tech. Signal Notes, Signal Tasks, Signal Timeline, and Signal read as one system.",
    offers: [
      {
        "@type": "Offer",
        name: "Workspace",
        price: "12",
        priceCurrency: "EUR",
        availability: "https://schema.org/PreOrder",
        url: `${SITE_URL}/waitlist`,
      },
      {
        "@type": "Offer",
        name: "Event",
        price: "89",
        priceCurrency: "EUR",
        availability: "https://schema.org/PreOrder",
        url: `${SITE_URL}/waitlist`,
      },
      {
        "@type": "Offer",
        name: "Venue Edition",
        price: String(VENUE_EDITION_ANNUAL_PRICE_EUR),
        priceCurrency: "EUR",
        availability: "https://schema.org/PreOrder",
        url: `${SITE_URL}/venues`,
      },
    ],
  },
];

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Suppress the marketing SiteNav when the suite launcher is active.
  // The proxy (src/proxy.ts) sets x-signal-authed: 1 via a rewrite when
  // an authed user hits a marketing route. The SuiteLauncher renders its
  // own chrome; the marketing SiteNav must not stack on top of it.
  const headersList = await headers();
  const isAuthedLauncher = headersList.get("x-signal-authed") === "1";

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      // D4 Layer-0 instant canvas: these inline attributes fire before any
      // stylesheet resolves. background:#fff kills the browser-default grey
      // on cross-origin first load. colorScheme:light prevents the UA from
      // painting a dark-mode void even when the OS is in dark mode.
      // LOADING_SYSTEM.md §2, "Frame 1 of every cross-origin destination
      // is paper white field, no content."
      style={{ background: "#fff", colorScheme: "light" }}
    >
      <head>
        {/* D4, belt-and-braces inline style: fires synchronously before the
            linked stylesheet resolves, preventing any grey flash on the
            document body. One-liner; only background is set here. */}
        {/* eslint-disable-next-line react/no-danger */}
        <style dangerouslySetInnerHTML={{ __html: "html{background:#fff}" }} />
        <link
          rel="alternate"
          type="application/rss+xml"
          title="Signal Studio, The dispatch"
          href={`${SITE_URL}/changelog.rss`}
        />
        {/* D4, preconnect + DNS-prefetch to all 4 product origins.
            Marketing is the cross-product hub; establishing early connections
            shaves ~100-300ms from the first cross-domain navigation.
            Use preconnect (establishes TCP+TLS) + dns-prefetch fallback
            for browsers that don't support preconnect. */}
        <link rel="preconnect" href="https://tasks.signalstudio.ie" />
        <link rel="dns-prefetch" href="https://tasks.signalstudio.ie" />
        <link rel="preconnect" href="https://timeline.signalstudio.ie" />
        <link rel="dns-prefetch" href="https://timeline.signalstudio.ie" />
        <link rel="preconnect" href="https://signal.signalstudio.ie" />
        <link rel="dns-prefetch" href="https://signal.signalstudio.ie" />
        <link rel="preconnect" href="https://notes.signalstudio.ie" />
        <link rel="dns-prefetch" href="https://notes.signalstudio.ie" />
      </head>
      <body
        className="flex min-h-full flex-col"
        // D4, inline style on body: same reason as html above.
        // background:#fff fires before the stylesheet link resolves,
        // removing the grey void on cross-origin first paint.
        style={{ background: "#fff" }}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded focus:bg-ink focus:px-3 focus:py-2 focus:text-sm focus:text-bg-elevated"
        >
          Skip to content
        </a>
        {!isAuthedLauncher && <SiteNav />}
        {children}
        <DevBanner />
      </body>
    </html>
  );
}
