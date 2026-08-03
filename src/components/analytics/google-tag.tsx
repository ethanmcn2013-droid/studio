"use client";

import { useEffect } from "react";
import Script from "next/script";
import { usePathname } from "next/navigation";
import { allowsThirdPartyAnalytics } from "@/lib/venue-edition-surfaces";

/**
 * Google Analytics 4 measurement ID for the Signal Studio web properties.
 * Single place to change it; imported by the root layout via <GoogleTag />.
 */
export const GA_MEASUREMENT_ID = "G-YHBS152PJK";

/**
 * The Google tag (gtag.js). Rendered from the root layout, and refused on the
 * Venue Edition commercial surfaces.
 *
 * D-032 R8 (Option B): `/venues`, `/v/*` and every Venue Edition commercial
 * page are measured server-side, first-party, with no cookie and no
 * third-party request. The list of those pages lives in
 * `@/lib/venue-edition-surfaces` and is read, never restated, so the gate the
 * browser applies and the pages the server counts cannot drift apart.
 *
 * `enabled` is passed from the server layout because `VERCEL_ENV` is not a
 * `NEXT_PUBLIC_` variable and does not reach the browser bundle. Preview and
 * local builds must not pollute the analytics property.
 *
 * Everywhere else on the site the tag still runs with no consent gate. That is
 * unchanged and still open: E09.04 §8.2 option A, a banner with Consent Mode
 * v2 default `denied`, is a separate decision for the rest of the site.
 */
export function GoogleTag({ enabled }: { enabled: boolean }) {
  const pathname = usePathname() ?? "";
  const allowed = allowsThirdPartyAnalytics(pathname);

  // Not rendering the script is not enough on its own, and this was proven in
  // a browser rather than reasoned about. Once gtag.js has loaded on an
  // ordinary page it stays loaded for the life of the document, and GA4's
  // enhanced measurement listens to history changes: a client-side navigation
  // from /about into /venues sent a `page_view` for /venues with no script of
  // ours rendered at all.
  //
  // `ga-disable-<MEASUREMENT_ID>` is Google's own opt-out flag, read at the
  // moment of every hit, so a tag already in the document sends nothing while
  // it is set. GA4 debounces the history-change page view, so an effect that
  // runs on the route commit lands well before the hit would leave. Verified
  // in a browser both ways: entering /venues sends nothing, leaving it for an
  // ordinary page resumes normally.
  useEffect(() => {
    if (!enabled) return;
    (window as unknown as Record<string, boolean>)[
      `ga-disable-${GA_MEASUREMENT_ID}`
    ] = !allowed;
  }, [enabled, allowed]);

  if (!enabled || !allowed) return null;
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-tag-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_MEASUREMENT_ID}');`}
      </Script>
    </>
  );
}
