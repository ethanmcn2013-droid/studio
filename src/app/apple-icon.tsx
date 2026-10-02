import { ImageResponse } from "next/og";
import { SIGNAL_FLOOR, SuiteMark, TILE_COVERAGE } from "@/lib/brand/suite-mark";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/**
 * Apple touch icon: the ring and dot on the home page floor, full bleed.
 * No rounded corners and no transparent pixels. iOS rounds the tile itself
 * and fills anything transparent with black.
 */
export default function AppleIcon() {
  return new ImageResponse(
    <SuiteMark canvas={180} background={SIGNAL_FLOOR} coverage={TILE_COVERAGE} />,
    size,
  );
}
