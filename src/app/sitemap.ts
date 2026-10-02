import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site-url";

/**
 * The indexed public estate.
 *
 * Cut to eight on 2026-09-11. Before that it listed seventeen, eleven of
 * which were the three product pages, the two campaign wedges, the
 * dispatch and the trust pages — all published ahead of a launch that has
 * not happened. Those routes now live in `archive/marketing-pages/`; this
 * file is the record of what is actually being offered to a stranger.
 *
 * Three standing rules for this file:
 * 1. Never list a path that redirects. `/brand` sat here for weeks while
 *    308ing to `/design` — a sitemap entry that resolves to a redirect is
 *    a crawl-budget leak and a soft signal that the site is stale.
 * 2. Every entry is a page a stranger could usefully land on. Functional
 *    surfaces (`/redeem/[code]`) and gated ones (`/hq/*`) stay out.
 * 3. Every entry is reachable from the nav or the footer. A page the site
 *    itself never links to does not belong in the map it hands a crawler.
 * 4. `lastModified` is the day the page last changed in a way a reader
 *    would see, written by hand in the same change. It used to be the
 *    moment of the request, the same for every page and new on every
 *    crawl, which tells a crawler nothing and teaches it to ignore the field.
 */
const routes: Array<{
  path: string;
  lastModified: string;
  priority: number;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
}> = [
  // The argument.
  { path: "", lastModified: "2026-10-02", priority: 1.0, changeFrequency: "monthly" },
  { path: "/waitlist", lastModified: "2026-10-02", priority: 0.95, changeFrequency: "monthly" },
  { path: "/pricing", lastModified: "2026-10-02", priority: 0.9, changeFrequency: "monthly" },
  // Contact is an anchored section on /about (D5), so the subject-prefilled
  // tracked mailto lives at /about#contact rather than on a page of its own.
  { path: "/about", lastModified: "2026-10-02", priority: 0.8, changeFrequency: "monthly" },

  // Background — must exist and be findable, not compete for attention.
  { path: "/principles", lastModified: "2026-09-11", priority: 0.7, changeFrequency: "monthly" },
  { path: "/press", lastModified: "2026-09-08", priority: 0.6, changeFrequency: "monthly" },
  { path: "/privacy", lastModified: "2026-09-08", priority: 0.3, changeFrequency: "yearly" },
  { path: "/terms", lastModified: "2026-09-08", priority: 0.3, changeFrequency: "yearly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: `${SITE_URL}${route.path}`,
    lastModified: route.lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
