import type { MetadataRoute } from "next";

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://signalstudio.ie";

/**
 * Apex robots (hardening P10).
 *
 * The apex IS the public marketing site — it should be indexed (the
 * goal's `Disallow: /` rule is for the private preview subdomains,
 * which live in their own repos and must carry their own robots; that
 * is cross-repo and out of this repo's reach — flagged, not done here).
 *
 * What the apex must keep out of the index:
 *   /hq      — password-gated operating surface (proxy-protected)
 *   /redeem  — per-code private redemption links (also per-page
 *              `robots: { index:false }`; this is belt-and-braces and
 *              keeps the codes out of crawl logs entirely)
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/hq", "/redeem"],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}
