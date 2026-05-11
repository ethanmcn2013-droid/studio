import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "Signal Studio — Project Management without the project-manager voice";
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
              display: "inline-block",
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
