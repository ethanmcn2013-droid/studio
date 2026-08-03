import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";
import { SiteNav } from "@/components/layout/site-nav";
import { DevBanner } from "@/components/dev-banner";
import { GoogleTag } from "@/components/analytics/google-tag";
import {
  NO_THIRD_PARTY_HEADER,
  PRIVATE_INVITATION_HEADER,
} from "@/lib/venue-invitation/paths";
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
        // D-021 (E12.14): every published price states that it is inclusive of
        // VAT at the prevailing rate. This offer is published on all 40-plus
        // studio routes and no copy sweep reads structured data, so it was the
        // one place the price travelled without that statement.
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price: String(VENUE_EDITION_ANNUAL_PRICE_EUR),
          priceCurrency: "EUR",
          valueAddedTaxIncluded: true,
          billingIncrement: 1,
          unitCode: "ANN",
        },
        availability: "https://schema.org/PreOrder",
        url: `${SITE_URL}/venues`,
      },
      // The Founding 25 rate is deliberately NOT published as structured data.
      // A price never travels without its conditions (E11.11 §3), and an Offer
      // object cannot carry "for as long as the agreement renews continuously
      // without lapse", "assigned when your payment clears" or "twenty-five
      // places". A machine-readable €1,000 with none of that attached is the
      // one form of the founding rate that cannot be corrected once quoted.
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

  // D-032 R8 (E12.14): GA4 comes off the Venue Edition commercial surfaces.
  // src/proxy.ts sets this header, because it is the only place in the App
  // Router that knows the pathname at layout time. The predicate itself lives
  // in one file, src/lib/venue-invitation/paths.ts, per E13.16 section 7.
  //
  // R-032, the site-wide consent position for every other public page, is a
  // separate and open founder call. Nothing here decides it: every route this
  // header does not name renders exactly what it rendered before.
  const noThirdParty = headersList.get(NO_THIRD_PARTY_HEADER) === "1";

  // E13.16 section 3.1 (E12.02): the private per-venue page carries one action,
  // so it carries no marketing navigation. Set by src/proxy.ts on `/v/*` only.
  // `/venues` is public and keeps its navigation.
  const isPrivateInvitation =
    headersList.get(PRIVATE_INVITATION_HEADER) === "1";

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
        {/* Google tag (gtag.js), production only. Off on the Venue Edition
            commercial surfaces (D-032 R8), on everywhere else, unchanged. */}
        {!noThirdParty && <GoogleTag />}
        {/* D4, belt-and-braces inline style: fires synchronously before the
            linked stylesheet resolves, preventing any grey flash on the
            document body. One-liner; only background is set here. */}
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
        {/* The four products are now one app at app.signalstudio.ie. */}
        <link rel="preconnect" href="https://app.signalstudio.ie" />
        <link rel="dns-prefetch" href="https://app.signalstudio.ie" />
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
        {!isAuthedLauncher && !isPrivateInvitation && <SiteNav />}
        {children}
        <DevBanner />
      </body>
    </html>
  );
}
