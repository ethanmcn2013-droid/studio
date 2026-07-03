import { ImageResponse } from "next/og";
import { SuiteMark } from "@/lib/brand/suite-mark";

export const size = { width: 512, height: 512 };
export const contentType = "image/png";

/**
 * Android maskable icon, dot + ring centred inside the 80% safe zone.
 * Paper field so adaptive masks clip cleanly without losing the mark.
 */
export default function MaskableIcon() {
  return new ImageResponse(<SuiteMark canvas={512} />, size);
}
