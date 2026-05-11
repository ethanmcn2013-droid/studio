import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/**
 * Apple touch icon for the Signal Studio umbrella. Full
 * "signal studio." wordmark with the indigo dot bottom-right —
 * the brand's signature mark per the new brand guide (D01,
 * locked 2026-05-11). Same indigo as every other product —
 * the umbrella shares one indigo with the suite; per-product
 * gestures encode the difference. No transparency — Apple
 * draws a tile under transparent icons which would clash with
 * the brand-soft.
 */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#eef2ff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 22,
          fontFamily: "system-ui, -apple-system, sans-serif",
          position: "relative",
          borderRadius: 36,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            color: "#14151a",
            fontSize: 50,
            fontWeight: 700,
            letterSpacing: "-0.05em",
          }}
        >
          <span style={{ display: "flex" }}>signal&nbsp;studio</span>
          <span
            style={{
              display: "flex",
              width: 12,
              height: 12,
              borderRadius: 999,
              background: "#4f46e5",
              marginLeft: 6,
              alignSelf: "flex-end",
              marginBottom: 6,
            }}
          />
        </div>
      </div>
    ),
    size,
  );
}
