import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site-url";

/**
 * The indexed public estate. Estate consolidation (2026-08-12) collapsed
 * every public surface onto this one domain: nine primary pages carrying
 * the commercial argument, and the background pages that must exist and
 * be findable without competing for attention.
 *
 * Two standing rules for this file:
 * 1. Never list a path that redirects. `/brand` sat here for weeks while
 *    308ing to `/design` — a sitemap entry that resolves to a redirect is
 *    a crawl-budget leak and a soft signal that the site is stale.
 * 2. Every entry is a page a stranger could usefully land on. Functional
 *    surfaces (`/redeem/[code]`) and gated ones (`/hq/*`) stay out.
 */
const routes: Array<{
  path: string;
  priority: number;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
}> = [
  // Primary — the pages that carry the argument.
  { path: "", priority: 1.0, changeFrequency: "monthly" },
  { path: "/notes", priority: 0.9, changeFrequency: "monthly" },
  { path: "/tasks", priority: 0.9, changeFrequency: "monthly" },
  { path: "/timeline", priority: 0.9, changeFrequency: "monthly" },
  { path: "/features/daily-briefing", priority: 0.9, changeFrequency: "monthly" },
  { path: "/venues", priority: 0.9, changeFrequency: "monthly" },
  { path: "/pricing", priority: 0.9, changeFrequency: "monthly" },
  { path: "/waitlist", priority: 0.95, changeFrequency: "monthly" },
  { path: "/students", priority: 0.8, changeFrequency: "monthly" },
  { path: "/about", priority: 0.7, changeFrequency: "monthly" },
  // Contact survives the consolidation: it is the Founding 25 CTA target
  // and builds a subject-prefilled, tracked mailto rather than a bare one.
  { path: "/contact", priority: 0.7, changeFrequency: "monthly" },

  // Background — must exist and be findable, not compete for attention.
  { path: "/design", priority: 0.6, changeFrequency: "monthly" },
  { path: "/principles", priority: 0.7, changeFrequency: "monthly" },
  { path: "/press", priority: 0.6, changeFrequency: "monthly" },
  { path: "/dispatch", priority: 0.7, changeFrequency: "weekly" },
  { path: "/privacy", priority: 0.3, changeFrequency: "yearly" },
  { path: "/terms", priority: 0.3, changeFrequency: "yearly" },
  { path: "/security", priority: 0.4, changeFrequency: "yearly" },
  { path: "/accessibility", priority: 0.3, changeFrequency: "yearly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return routes.map((route) => ({
    url: `${SITE_URL}${route.path}`,
    lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
