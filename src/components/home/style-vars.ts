import type { CSSProperties } from "react";

/** Inline style with the page's `--lp-*` custom properties, typed. */
export function v(style: Record<string, string | number>): CSSProperties {
  return style as CSSProperties;
}
