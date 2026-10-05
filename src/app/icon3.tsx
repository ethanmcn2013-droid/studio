import { ImageResponse } from "next/og";
import { SIGNAL_TILE, SuiteMark, TILE_COVERAGE } from "@/lib/brand/suite-mark";

export const size = { width: 512, height: 512 };
export const contentType = "image/png";

/**
 * Maskable install icon, 512px. A launcher cuts its own shape out of this
 * one, so it has to be filled edge to edge: the ring and dot on white, inside
 * the 80% safe zone so the mask clips the field and never the mark.
 */
export default function MaskableIcon512() {
  return new ImageResponse(
    <SuiteMark canvas={512} background={SIGNAL_TILE} coverage={TILE_COVERAGE} />,
    size,
  );
}
