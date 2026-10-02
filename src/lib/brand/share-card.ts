/**
 * The link-preview card, one file for the whole site.
 *
 * It is a static PNG, drawn by scripts/brand/render-share-card.mjs in a real
 * browser with the site's own type, then committed. Before 2026-10-02 the
 * card was drawn per request by a route (`/opengraph-image`) whose markup
 * used a CSS value the image renderer rejects. The renderer threw after the
 * response had started, so production answered 200 with an empty body and
 * every share of the home page had no picture. A file cannot fail that way.
 *
 * The version is in the filename. Change the artwork, change the name, and
 * the long cache on /share/ never serves a stale card.
 *
 * Pages that declare their own `openGraph` or `twitter` object replace the
 * root layout's wholesale, picture included, so they list this card again.
 */
export const SHARE_CARD = {
  url: "/share/signal-studio-card-v2.png",
  width: 1200,
  height: 630,
  type: "image/png",
  alt: "Signal Studio. Project management for people not in tech.",
} as const;
