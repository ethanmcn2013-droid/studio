import { ImageResponse } from "next/og";
import { SIGNAL_FLOOR, SuiteMark, TILE_COVERAGE } from "@/lib/brand/suite-mark";

export const size = { width: 192, height: 192 };
export const contentType = "image/png";

/** Install icon, 192px: the size Android asks for first. Same tile as /icon1. */
export default function InstallIcon() {
  return new ImageResponse(
    <SuiteMark canvas={192} background={SIGNAL_FLOOR} coverage={TILE_COVERAGE} />,
    size,
  );
}
