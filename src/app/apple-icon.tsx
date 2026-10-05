import { ImageResponse } from "next/og";
import { SIGNAL_TILE, SuiteMark, TILE_COVERAGE } from "@/lib/brand/suite-mark";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/**
 * Apple touch icon: the ring and dot on white, full bleed. iOS fills
 * transparent pixels with black, so this one icon cannot float; white is the
 * ground instead, never a dark tile. No rounded corners: iOS rounds the tile
 * itself.
 */
export default function AppleIcon() {
  return new ImageResponse(
    <SuiteMark canvas={180} background={SIGNAL_TILE} coverage={TILE_COVERAGE} />,
    size,
  );
}
