import { ImageResponse } from "next/og";
import { SIGNAL_TILE, SuiteMark, TILE_COVERAGE } from "@/lib/brand/suite-mark";

export const size = { width: 192, height: 192 };
export const contentType = "image/png";

/** Maskable install icon, 192px. Same white tile as /icon3. */
export default function MaskableIcon192() {
  return new ImageResponse(
    <SuiteMark canvas={192} background={SIGNAL_TILE} coverage={TILE_COVERAGE} />,
    size,
  );
}
