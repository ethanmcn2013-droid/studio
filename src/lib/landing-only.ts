/** Temporary public launch boundary. Set false to restore the retained estate. */
export const LANDING_ONLY = true;

/** Only private operations, metadata and supporting media escape the public boundary. */
export const LANDING_ONLY_SOURCE =
  "/:path((?!api(?:/|$)|hq(?:/|$)|_next(?:/|$)|brand/business-loan-pack-2026\\.html$|(?:robots\\.txt|sitemap\\.xml|manifest\\.webmanifest|opengraph-image|about/opengraph-image|twitter-image)$|.*\\.(?:svg|png|jpe?g|gif|webp|avif|woff2?|ttf|eot|ico|css|js|map|mp4|webm)$).+)";
