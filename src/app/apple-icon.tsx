import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/**
 * Apple touch icon for the Signal Studio umbrella. Full
 * "signal studio." wordmark with antique-gold period (the
 * brand's signature mark). Brand-soft tile, ink wordmark,
 * gold period. Gold is reserved for the umbrella — never on
 * individual products. No transparency — Apple draws a tile
 * under transparent icons which would clash with the
 * brand-soft.
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
              color: "#c9a96a",
              fontWeight: 700,
              marginLeft: 1,
            }}
          >
            .
          </span>
        </div>
      </div>
    ),
    size,
  );
}
