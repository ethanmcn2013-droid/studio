/**
 * The browser bar colour on the public home page: the page's floor, in each
 * theme. These repeat --lp-floor from home.css because the address bar sits
 * outside the page root and cannot read its variables. The home browser spec
 * checks each against the painted floor, so the two cannot drift.
 */
export const HOME_THEME_COLOR = {
  dark: "rgb(12, 12, 13)", // ds-allow: the dark floor, --lp-floor
  light: "rgb(244, 243, 241)", // ds-allow: the light floor, --lp-floor
} as const;

export type HomeTheme = keyof typeof HOME_THEME_COLOR;
