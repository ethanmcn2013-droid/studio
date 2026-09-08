/** Browser tabs use the indigo dot and ring directly on the tab surface. */
export const BROWSER_ICON_BACKGROUND = "transparent";
export const STATIC_BROWSER_ICON = "signal-favicon-transparent-v1.ico";

/**
 * Explicit selection keeps the opaque 512px maskable icon out of browser tabs.
 * Next still adds the generated favicon.ico fallback; Apple keeps its tile.
 * Change the version when browser artwork changes to bypass cached tab icons.
 */
export const STUDIO_BROWSER_ICONS = {
  icon: [{
    url: "/icon?v=transparent-dot-ring-20260908",
    type: "image/png",
    sizes: "32x32",
  }],
  apple: [{
    url: "/apple-icon",
    type: "image/png",
    sizes: "180x180",
  }],
};
