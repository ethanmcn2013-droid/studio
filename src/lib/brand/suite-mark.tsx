/**
 * The ring and dot, as pixels.
 *
 * Redrawn 2026-10-02 (round 2, Q24) to match the mark the home page draws in
 * its header: the same indigo, a ring with a dot 41% of its width. The
 * earlier artwork used the anchor indigo, a 36% dot and a ring one soft
 * pixel wide at 16px.
 */
export const SIGNAL_INDIGO = "#6860ff"; // the home page mark, --lp-mark
/** For dark tab strips, where the mark above falls to about 3.6 to 1. */
export const SIGNAL_INDIGO_ON_DARK = "#8b87f8";
/**
 * The ground for the two icons that cannot float: the Apple touch icon (iOS
 * paints transparent pixels black) and the maskable install icon (a mask
 * needs a filled safe zone). White, never a dark tile. Every other icon has
 * no background at all.
 */
export const SIGNAL_TILE = "rgb(255, 255, 255)"; // ds-allow: a PNG renderer and the manifest cannot read tokens

/** Floating icons fill the frame. Tiles keep the mark inside the maskable safe zone. */
export const TAB_COVERAGE = 0.875;
export const TILE_COVERAGE = 0.56;

type SuiteMarkProps = {
  canvas: number;
  background?: string;
  coverage?: number;
};

/**
 * Whole-pixel geometry.
 *
 * The ring's outer width is an even number of pixels, so its centre sits on
 * a pixel corner and the ring is the same on all four sides. The stroke is
 * never under 2 pixels: at 16px a thinner ring turns to grey mush. At tab
 * sizes the dot is rounded to an even width for the same reason; above that
 * it is exactly 41% of the ring.
 */
export function suiteMarkMetrics(canvas: number, coverage = TAB_COVERAGE) {
  const ring = 2 * Math.round((canvas * coverage) / 2);
  const stroke = Math.max(2, Math.round(ring * 0.095));
  const dot = canvas <= 32 ? 2 * Math.round((ring * 0.41) / 2) : ring * 0.41;
  return { dot, ring, stroke };
}

export function SuiteMark({
  canvas,
  background = "transparent",
  coverage = TAB_COVERAGE,
}: SuiteMarkProps) {
  const { dot, ring, stroke } = suiteMarkMetrics(canvas, coverage);
  const centre = canvas / 2;

  return (
    <div
      style={{
        width: canvas,
        height: canvas,
        background,
        display: "flex",
      }}
    >
      <svg
        width={canvas}
        height={canvas}
        viewBox={`0 0 ${canvas} ${canvas}`}
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx={centre}
          cy={centre}
          r={(ring - stroke) / 2}
          fill="none"
          stroke={SIGNAL_INDIGO}
          strokeWidth={stroke}
        />
        <circle cx={centre} cy={centre} r={dot / 2} fill={SIGNAL_INDIGO} />
      </svg>
    </div>
  );
}
