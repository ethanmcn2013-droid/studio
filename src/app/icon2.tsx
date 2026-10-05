import { ImageResponse } from "next/og";
import { SuiteMark } from "@/lib/brand/suite-mark";
import { BROWSER_ICON_BACKGROUND } from "@/lib/brand/browser-icons";

export const size = { width: 192, height: 192 };
export const contentType = "image/png";

/** Install icon, 192px: the size Android asks for first. No background, as /icon1. */
export default function InstallIcon192() {
  return new ImageResponse(<SuiteMark canvas={192} background={BROWSER_ICON_BACKGROUND} />, size);
}
