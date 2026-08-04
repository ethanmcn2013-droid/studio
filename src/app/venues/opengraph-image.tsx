import { ImageResponse } from "next/og";

/**
 * The link-preview card, for the page whose premise is being forwarded.
 *
 * This page's metadata export carries its own openGraph object so the card
 * text is the ratified OFFER_LINE, and in Next's metadata resolution that
 * object replaces the layout's wholesale, dropping the site-level image with
 * it: the forwarded partner and the coordinator met this page as a bare text
 * stub in WhatsApp or iMessage while the homepage's head, on the same server,
 * declares the full 1200x630 card. File-based metadata outranks the config
 * object, so this file restores og:image, twitter:image and the
 * summary_large_image card for this segment while the page keeps its own
 * og:title and og:description.
 *
 * The card is the house card: the JSX below is quoted from
 * src/app/opengraph-image.tsx (the wordmark on the warm ground, indigo dot
 * at the baseline, D01 Refined Indigo Dot), because the one place a venue
 * meets this page before its h1 must read as the same studio as the
 * homepage. It is a copy, not an import, deliberately: re-exporting or even
 * importing from the site file drags its runtime = "edge" segment config
 * into this route through Turbopack's static analysis, and the edge sandbox
 * does not serve in the Windows dev environment. This route runs the default
 * Node runtime instead. If the house card changes, this file changes with it.
 *
 * Three deliberate differences from the site file, all verified against the
 * served binary:
 *   1. The dot is display: "flex", not "inline-block". Satori lays out flex
 *      only, and the site file's inline-block dot crashes the renderer with
 *      an empty reply, on both runtimes. This is why the site's own
 *      /opengraph-image does not serve a binary in this environment; the
 *      meta tags the homepage declares still point at it. Reported upstream
 *      rather than fixed here, because the site file is shared surface.
 *   2. The wordmark is 170px, not 280. At the site file's 280 the mark sets
 *      ~1520px wide in a 1200px frame: it wraps to two clipped lines and
 *      pushes the dot off the canvas, which no one had seen because the
 *      route never served. 170 sets the mark on one line at ~78% of the
 *      width; the dot and its offsets are scaled by the same factor, so the
 *      construction and proportions are the site file's exactly.
 *   3. The alt: the site alt carries the "80% not in tech" positioning
 *      line, which is not this page's voice.
 */
export const alt = "Signal Studio";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          background: "#fafaf7",
          fontFamily: "-apple-system, 'Helvetica Neue', sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            fontWeight: 500,
            fontSize: 170,
            letterSpacing: "-0.04em",
            color: "#111111",
          }}
        >
          signal studio
          <span
            style={{
              width: 27,
              height: 27,
              borderRadius: 999,
              background: "#4f46e5",
              marginLeft: 9,
              marginBottom: 11,
              display: "flex",
            }}
          />
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
