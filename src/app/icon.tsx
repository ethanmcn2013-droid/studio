import { ImageResponse } from "next/og";
import { SuiteMark } from "@/lib/brand/suite-mark";
import { BROWSER_ICON_BACKGROUND } from "@/lib/brand/browser-icons";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

/** Browser tab icon: indigo dot + ring with no background. */
export default function Icon() {
  return new ImageResponse(<SuiteMark canvas={32} background={BROWSER_ICON_BACKGROUND} />, size);
}
