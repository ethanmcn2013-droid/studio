import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "studio. — tools for the 80%";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * OG image — 1200×630.
 *
 * Antique-gold (#c9a96a) backdrop. Wordmark centered.
 * Type weight and letterSpacing match the landing's .wordmark class.
 * No sIde decoration — the color is the statement.
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
          background: "#c9a96a",
          fontFamily: "-apple-system, 'Helvetica Neue', sans-serif",
        }}
      >
        {/* Centered wordmark treatment */}
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            fontWeight: 600,
            fontSize: 380,
            letterSpacing: "-0.05em",
            color: "#18181b",
            marginLeft: "-0.3ch",
          }}
        >
          studio
          {/* Period in deep warm-brown — pops against gold field, stays in the gold family */}
          <span style={{ color: "#5b3f12" }}>.</span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
