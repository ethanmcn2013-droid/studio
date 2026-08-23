import { ImageResponse } from "next/og";

/**
 * The link-preview card for /about.
 *
 * The page's metadata export carries its own openGraph object, which in
 * Next's metadata resolution replaces the layout's wholesale and drops the
 * site-level image with it — so an About share rendered as a bare text stub
 * while declaring summary_large_image. File-based metadata outranks the
 * config object; this file restores og:image, twitter:image and the large
 * card for this segment.
 *
 * The card is the house card: the JSX below is quoted from
 * src/app/venues/opengraph-image.tsx (itself a verified copy of
 * src/app/opengraph-image.tsx — wordmark on the warm ground, indigo dot at
 * the baseline). It stays a copy, not an import: importing the site file
 * drags its runtime = "edge" segment config into this route through
 * Turbopack's static analysis, and the edge sandbox does not serve in the
 * Windows dev environment. If the house card changes, this file changes.
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
