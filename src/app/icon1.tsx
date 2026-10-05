import { ImageResponse } from "next/og";
import { SuiteMark } from "@/lib/brand/suite-mark";
import { BROWSER_ICON_BACKGROUND } from "@/lib/brand/browser-icons";

export const size = { width: 512, height: 512 };
export const contentType = "image/png";

/**
 * Install icon, 512px: the ring and dot with no background, for launchers
 * and shortcuts that draw transparency. Also the square logo the structured
 * data points at.
 */
export default function InstallIcon512() {
  return new ImageResponse(<SuiteMark canvas={512} background={BROWSER_ICON_BACKGROUND} />, size);
}
