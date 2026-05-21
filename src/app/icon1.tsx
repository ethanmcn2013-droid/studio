import { ImageResponse } from "next/og";

export const size = { width: 512, height: 512 };
export const contentType = "image/png";

/**
 * Android maskable icon — Signal Studio umbrella.
 *
 * Maskable spec requires all meaningful content to sit inside a
 * centred 80%-diameter circle so the OS can clip to circle, squircle,
 * teardrop, or rounded-square shapes without truncating the mark.
 * On a 512×512 canvas that's a 410px safe-zone diameter ≈ 51px
 * inset on every side.
 *
 * Composition: solid indigo field (the suite-locked accent), white
 * wordmark glyph "s." centred well inside the safe zone. The bleed
 * area outside the circle stays solid indigo so any clip shape
 * resolves to a clean indigo silhouette with the white mark intact.
 *
 * Apple-icon stays at 180×180 with the brand-soft tile + ink
 * wordmark — that's the iOS register. This file is purely the
 * Android maskable / Chrome install-prompt 512 asset.
 */
export default function MaskableIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#4f46e5",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, -apple-system, sans-serif",
          position: "relative",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            color: "#ffffff",
            fontSize: 220,
            fontWeight: 700,
            letterSpacing: "-0.06em",
          }}
        >
          <span style={{ display: "flex" }}>s</span>
          <span
            style={{
              display: "flex",
              width: 28,
              height: 28,
              borderRadius: 9999,
              background: "#ffffff",
              marginLeft: 12,
              marginBottom: 12,
            }}
          />
        </div>
      </div>
    ),
    size,
  );
}
