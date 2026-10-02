import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site-url";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/hq/", "/redeem/", "/review"],
    },
    // No `host`. It is a retired Yandex directive, not part of the robots
    // standard, and other crawlers report it as an unknown line.
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
