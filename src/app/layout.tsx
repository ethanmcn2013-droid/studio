import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SiteNav } from "@/components/layout/site-nav";
import { DevBanner } from "@/components/dev-banner";
import { SITE_URL } from "@/lib/site-url";
import { COMMERCIAL_TERMS } from "@/lib/commercial-terms";
import { STUDIO_BROWSER_ICONS } from "@/lib/brand/browser-icons";
import { SHARE_CARD } from "@/lib/brand/share-card";
import { SOCIAL_PROFILE_URLS } from "@/lib/social-profiles";
import { recurringPrice } from "@/lib/structured-offer";
import { HOME_THEME_COLOR } from "@/components/home/theme-color";

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
  title: "Signal Studio · Project management for people not in tech.",
  description:
    "Project management for people not in tech. Signal Studio tells you what needs you today, in words you would use yourself, whether you run a venue, a trade crew, a studio or a school.",
  metadataBase: new URL(
    SITE_URL
  ),
  manifest: "/manifest.webmanifest",
  icons: STUDIO_BROWSER_ICONS,
  // "./" resolves against the page being rendered, so every page that does
  // not declare its own canonical names itself: the home page is
  // https://signalstudio.ie, /waitlist is /waitlist. Query strings (?theme=,
  // campaign tags) never reach the canonical.
  alternates: {
    canonical: "./",
  },
  openGraph: {
    title: "Signal Studio · Project management for people not in tech.",
    description:
      "Signal Studio tells you what needs you today, in words you would use yourself, whether you run a venue, a trade crew, a studio or a school.",
    type: "website",
    url: "./",
    siteName: "Signal Studio",
    locale: "en_IE",
    images: [SHARE_CARD],
  },
  twitter: {
    card: "summary_large_image",
    images: [SHARE_CARD],
  },
};

/**
 * The document behind every page, set before any stylesheet resolves.
 *
 * Every route paints white with a light colour scheme (D4, layer 0: no grey
 * void on a cross-origin first load, no dark UA canvas on a dark device).
 * The home page is the one exception: its root is `.lp`, dark first with a
 * light theme, and the document takes that root's floor so the scrollbar,
 * the overscroll area and native controls match the page. The two floors are
 * the ones the home page already keeps in theme-color.ts.
 *
 * This is a style block, not a style attribute, so a later rule can change
 * it without `!important`.
 */
const ROOT_CANVAS_CSS = [
  "html{background:#fff;color-scheme:light}",
  "body{background:#fff}",
  `html:has(.lp){background:${HOME_THEME_COLOR.dark};color-scheme:dark}`,
  `html:has(.lp[data-theme="light"]){background:${HOME_THEME_COLOR.light};color-scheme:light}`,
  "html:has(.lp) body{background:transparent}",
  // No script, light device: the page follows the device in CSS (home.css),
  // and so does the document behind it.
  `@media (prefers-color-scheme: light){html:has(.lp:not(.js)){background:${HOME_THEME_COLOR.light};color-scheme:light}}`,
].join("");

const structuredData = [
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Signal Studio",
    legalName: "Signal Studio Limited",
    url: SITE_URL,
    email: "hello@signalstudio.ie",
    foundingDate: "2025",
    // A square logo (the 512px ring and dot), not the 1200x630 share card.
    logo: {
      "@type": "ImageObject",
      url: `${SITE_URL}/icon1`,
      width: 512,
      height: 512,
    },
    image: `${SITE_URL}${SHARE_CARD.url}`,
    founder: {
      "@type": "Person",
      name: "Ethan McNamara",
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Limerick",
      addressCountry: "IE",
    },
    // The same list the footer links to: src/lib/social-profiles.ts.
    sameAs: SOCIAL_PROFILE_URLS,
  },
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Signal Studio",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    url: SITE_URL,
    description:
      "Project management for people not in tech. Signal Studio tells you what needs you today, in words you would use yourself. Tasks, dates, files and people live together.",
    offers: [
      {
        "@type": "Offer",
        name: "Free",
        price: String(COMMERCIAL_TERMS.plans.free.amountCents / 100),
        priceCurrency: "EUR",
        availability: "https://schema.org/PreOrder",
        url: `${SITE_URL}/pricing#plans`,
      },
      {
        "@type": "Offer",
        name: "Student",
        price: String(COMMERCIAL_TERMS.plans.student.amountCents / 100),
        priceCurrency: "EUR",
        // Student is billed once a year; a bare price reads as one-off.
        ...recurringPrice(COMMERCIAL_TERMS.plans.student.amountCents, "P1Y"),
        availability: "https://schema.org/PreOrder",
        url: `${SITE_URL}/pricing#plans`,
      },
      {
        "@type": "Offer",
        name: "Pro",
        price: String(COMMERCIAL_TERMS.plans.pro.monthlyAmountCents / 100),
        priceCurrency: "EUR",
        ...recurringPrice(COMMERCIAL_TERMS.plans.pro.monthlyAmountCents, "P1M"),
        availability: "https://schema.org/PreOrder",
        url: `${SITE_URL}/pricing#plans`,
      },
      {
        "@type": "Offer",
        name: "Enterprise",
        availability: "https://schema.org/PreOrder",
        url: `${SITE_URL}/about?subject=enterprise#contact`,
      },
      {
        /* Venue Edition remains a separate commercial surface, not a fifth
           consumer pricing plan. Its price is deliberately omitted here:
           search structured data cannot carry the conditions presented next
           to that price on the venue page. That page is archived until
           launch and /venues redirects, so the offer points at the place a
           venue can ask about it today: the contact section on About. */
        "@type": "Offer",
        name: "Venue Edition",
        availability: "https://schema.org/PreOrder",
        url: `${SITE_URL}/about?subject=founding-venue#contact`,
      },
    ],
  },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // The layout reads nothing from the request (round 3, 2026-10-02), so a
  // page that reads nothing either can be prerendered. It used to read the
  // proxy's `x-signal-authed` header here to drop the marketing SiteNav for
  // the suite launcher; SiteNav now steps aside by address instead, on `/`
  // and on the launcher's internal route.
  return (
    <html
      lang="en-IE"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        {/* No analytics tag. GA4 was removed on 2026-08-12 under decision D2:
            it ran on every public page with no consent gate while the privacy
            policy claimed cookieless analytics only. Traffic counts come from
            Vercel Analytics, which sets no cookie. See docs/ANALYTICS.md. */}
        {/* D4 layer 0, the instant canvas: parsed before the linked
            stylesheet resolves, so there is no grey flash on a cross-origin
            first load and no dark UA void on a dark device. It also gives
            the home page its own floor; see ROOT_CANVAS_CSS above.
            LOADING_SYSTEM.md §2. */}
        <style dangerouslySetInnerHTML={{ __html: ROOT_CANVAS_CSS }} />
        {/* No feed link. The dispatch and its feed left the public estate on
            2026-09-11 and /changelog.rss redirects to the home page, so the
            head no longer advertises a feed that is not there. */}
        {/* D4, preconnect + DNS-prefetch to all 4 product origins.
            Marketing is the cross-product hub; establishing early connections
            shaves ~100-300ms from the first cross-domain navigation.
            Use preconnect (establishes TCP+TLS) + dns-prefetch fallback
            for browsers that don't support preconnect. */}
        {/* The three products are one app at app.signalstudio.ie. */}
        <link rel="preconnect" href="https://app.signalstudio.ie" />
        <link rel="dns-prefetch" href="https://app.signalstudio.ie" />
      </head>
      <body
        className="flex min-h-full flex-col"
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <a
          href="#main"
          className="skip-link"
        >
          Skip to content
        </a>
        <SiteNav />
        {children}
        <DevBanner />
      </body>
    </html>
  );
}
