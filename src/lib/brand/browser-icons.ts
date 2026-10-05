/** Browser tabs use the indigo ring and dot directly on the tab surface. */
export const BROWSER_ICON_BACKGROUND = "transparent";
export const STATIC_BROWSER_ICON = "signal-favicon-transparent-v1.ico";

/** Change this when the artwork changes, to get past cached tab icons. */
export const BROWSER_ICON_VERSION = "floating-20261005";

/**
 * Every icon link the site sends, declared once.
 *
 * - /favicon.ico holds 16, 32, 48 and 256px frames, and says so. Safari and
 *   anything that asks for /favicon.ico by habit get this.
 * - /icon.svg is what Chrome, Edge and Firefox pick. It carries a
 *   prefers-color-scheme rule, so the mark lightens on a dark tab strip.
 * - /icon is the 32px PNG, for readers that take neither.
 * - /apple-icon is the 180px home-screen tile: the mark on white, full
 *   bleed, no baked corners (iOS rounds it itself). It is the one link here
 *   with a background, because iOS paints transparent pixels black.
 *
 * The 192 and 512px install icons are listed in the manifest, not here, so
 * a tile never lands in a browser tab.
 */
export const STUDIO_BROWSER_ICONS = {
  icon: [
    {
      url: `/favicon.ico?v=${BROWSER_ICON_VERSION}`,
      type: "image/x-icon",
      sizes: "16x16 32x32 48x48 256x256",
    },
    {
      url: `/icon.svg?v=${BROWSER_ICON_VERSION}`,
      type: "image/svg+xml",
      sizes: "any",
    },
    {
      url: `/icon?v=${BROWSER_ICON_VERSION}`,
      type: "image/png",
      sizes: "32x32",
    },
  ],
  apple: [
    {
      url: `/apple-icon?v=${BROWSER_ICON_VERSION}`,
      type: "image/png",
      sizes: "180x180",
    },
  ],
};
