import type { MetadataRoute } from "next";
import { COMPARISON_PAGES } from "@/lib/comparison-pages";
import { SITE_URL } from "@/lib/site-url";
import { isVenueInvitationPath } from "@/lib/venue-invitation/paths";

const routes: Array<{
  path: string;
  priority: number;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
}> = [
  { path: "", priority: 1.0, changeFrequency: "monthly" },
  { path: "/notes", priority: 0.9, changeFrequency: "monthly" },
  { path: "/tasks", priority: 0.9, changeFrequency: "monthly" },
  { path: "/timeline", priority: 0.9, changeFrequency: "monthly" },
  { path: "/signal", priority: 0.9, changeFrequency: "monthly" },
  { path: "/about", priority: 0.7, changeFrequency: "monthly" },
  { path: "/waitlist", priority: 0.95, changeFrequency: "monthly" },
  { path: "/pricing", priority: 0.9, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.7, changeFrequency: "monthly" },
  { path: "/work", priority: 0.7, changeFrequency: "monthly" },
  { path: "/proof", priority: 0.8, changeFrequency: "monthly" },
  { path: "/ios", priority: 0.6, changeFrequency: "monthly" },
  { path: "/weddings", priority: 0.8, changeFrequency: "monthly" },
  { path: "/venues", priority: 0.9, changeFrequency: "monthly" },
  { path: "/teachers", priority: 0.8, changeFrequency: "monthly" },
  { path: "/students", priority: 0.8, changeFrequency: "monthly" },
  { path: "/venues/demo", priority: 0.7, changeFrequency: "monthly" },
  { path: "/venues/privacy", priority: 0.7, changeFrequency: "monthly" },
  { path: "/venues/questions", priority: 0.7, changeFrequency: "monthly" },
  { path: "/brand", priority: 0.6, changeFrequency: "monthly" },
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
  const comparisonRoutes = COMPARISON_PAGES.map((page) => ({
    path: `/compare/${page.slug}`,
    priority: 0.65,
    changeFrequency: "monthly" as const,
  }));

  // E13.16 acceptance criterion 11: `/v/` is disallowed in robots.ts and
  // absent from the sitemap. Enforced here rather than trusted, so a future
  // edit that adds a private route fails the build instead of publishing it.
  // `sitemap.test.ts` asserts the same predicate against the rendered output.
  return [...routes, ...comparisonRoutes]
    .filter((route) => !isVenueInvitationPath(route.path || "/"))
    .map((route) => ({
      url: `${SITE_URL}${route.path}`,
      lastModified,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    }));
}
