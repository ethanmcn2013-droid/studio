import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site-url";
import { VENUE_INVITATION_ROBOTS_DISALLOW } from "@/lib/venue-invitation/paths";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/hq/",
        "/redeem/",
        "/review",
        // E13.16 section 3.1 and acceptance criterion 11. A private
        // invitation must not become a search result naming a venue that has
        // not agreed to anything.
        VENUE_INVITATION_ROBOTS_DISALLOW,
      ],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
