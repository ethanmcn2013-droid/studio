import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SiteNav } from "@/components/layout/site-nav";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://signalstudio.ie";

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
    "Project management for the 80% who don't work in tech. Four small tools — Signal Roadmap, Signal Tasks, Signal Notes, Signal Analytics — that read as one system. Plain English. Built for the work, not the workflow.",
  metadataBase: new URL(
    SITE_URL
  ),
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
    founder: {
      "@type": "Person",
      name: "Ethan McNamara",
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Dublin",
      addressCountry: "IE",
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Signal Studio",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    url: SITE_URL,
    description:
      "Project management for the 80% who don't work in tech. Signal Tasks, Signal Roadmap, Signal Notes, and Signal Analytics read as one system.",
    offers: [
      {
        "@type": "Offer",
        name: "Workspace",
        price: "12",
        priceCurrency: "EUR",
        availability: "https://schema.org/InStock",
        url: `${SITE_URL}/pricing`,
      },
      {
        "@type": "Offer",
        name: "Event",
        price: "79",
        priceCurrency: "EUR",
        availability: "https://schema.org/InStock",
        url: `${SITE_URL}/pricing`,
      },
      {
        "@type": "Offer",
        name: "Venue Edition",
        priceSpecification: {
          "@type": "PriceSpecification",
          priceCurrency: "EUR",
          minPrice: "1500",
          maxPrice: "4000",
        },
        availability: "https://schema.org/InStock",
        url: `${SITE_URL}/venues`,
      },
    ],
  },
];

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
      <head>
        <link
          rel="alternate"
          type="application/rss+xml"
          title="Signal Studio — The dispatch"
          href={`${SITE_URL}/changelog.rss`}
        />
      </head>
      <body className="flex min-h-full flex-col">
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
        <SiteNav />
        {children}
      </body>
    </html>
  );
}
