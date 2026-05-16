import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const runtime = "nodejs";

export const alt = "Signal Studio — Project Management for the 80% not in tech";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * OG image — 1200×630.
 *
 * Warm-stone backdrop (#fafaf7) with the umbrella wordmark centered.
 * Indigo dot (#4f46e5) at the baseline — the brand. Same construction
 * as every other wordmark in the suite, scaled up.
 *
 * Antique gold retired 2026-05-11 per the new brand guide (D01 —
 * Refined Indigo Dot).
 */
// Satori (next/og) ships with NO system fonts — a fontFamily of
// "-apple-system,…" renders nothing and the route returns an empty 200,
// which is exactly how this OG was silently broken on every shared link.
// The wordmark font is bundled (server-only, never in the browser
// bundle) and read off disk on the Node runtime. Self-hosted: the
// running function reads the committed asset, never Google. Node (not
// edge) because Turbopack can't resolve the edge import.meta.url asset
// URL at build; OG images are heavily cached so cold-start cost is moot.
const fontData = readFileSync(
  join(process.cwd(), "src/app/_og-assets/geist-500.ttf")
);

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
          fontFamily: "Geist",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            fontWeight: 500,
            fontSize: 280,
            letterSpacing: "-0.04em",
            color: "#111111",
          }}
        >
          signal studio
          <span
            style={{
              width: 44,
              height: 44,
              borderRadius: 999,
              background: "#4f46e5",
              marginLeft: 14,
              marginBottom: 18,
              display: "flex",
            }}
          />
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "Geist",
          data: fontData,
          weight: 500,
          style: "normal",
        },
      ],
    }
  );
}
