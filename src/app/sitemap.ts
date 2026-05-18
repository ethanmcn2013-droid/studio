import type { MetadataRoute } from "next";
import { COMPARISON_PAGES } from "@/lib/comparison-pages";

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://signalstudio.ie";

const routes: Array<{
  path: string;
  priority: number;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
}> = [
  { path: "", priority: 1.0, changeFrequency: "monthly" },
  { path: "/about", priority: 0.7, changeFrequency: "monthly" },
  { path: "/pricing", priority: 0.9, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.7, changeFrequency: "monthly" },
  { path: "/work", priority: 0.7, changeFrequency: "monthly" },
  { path: "/proof", priority: 0.8, changeFrequency: "monthly" },
  { path: "/weddings", priority: 0.8, changeFrequency: "monthly" },
  { path: "/venues", priority: 0.9, changeFrequency: "monthly" },
  { path: "/venues/demo", priority: 0.7, changeFrequency: "monthly" },
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

  return [...routes, ...comparisonRoutes].map((route) => ({
    url: `${BASE_URL}${route.path}`,
    lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
