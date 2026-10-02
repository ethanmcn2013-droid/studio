import { ImageResponse } from "next/og";
import { SIGNAL_FLOOR, SuiteMark, TILE_COVERAGE } from "@/lib/brand/suite-mark";

export const size = { width: 512, height: 512 };
export const contentType = "image/png";

/**
 * Install icon, 512px. The ring and dot on the home page floor, inside the
 * 80% safe zone so an adaptive mask clips the field and never the mark.
 * Also the square logo the structured data points at.
 */
export default function MaskableIcon() {
  return new ImageResponse(
    <SuiteMark canvas={512} background={SIGNAL_FLOOR} coverage={TILE_COVERAGE} />,
    size,
  );
}
