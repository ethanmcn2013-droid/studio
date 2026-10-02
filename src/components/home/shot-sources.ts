/**
 * Where the product captures live and which file a screen should take.
 *
 * Built by scripts/build-landing-shots.mjs into public/landing/. A desk
 * capture is 1440 CSS px wide and ships at 1x and 2x. A phone capture is
 * 390 CSS px wide and ships at 2x and 3x, so it is never drawn larger than
 * its own pixels, whatever the screen.
 *
 * SHOT_BOOT repeats this rule as plain script for the inline boot in
 * home-page.tsx, which runs before any module loads. Change them together.
 */
export type ShotTheme = "dark" | "light";

export const SHOT_BASE = "/landing/";

export function shotSources(shot: string, theme: ShotTheme) {
  const phone = /-phone$/.test(shot);
  const low = phone ? 2 : 1;
  const high = phone ? 3 : 2;
  const stem = `${SHOT_BASE}${shot}-${theme}-`;
  return {
    src: `${stem}${low}x.webp`,
    srcSet: `${stem}${low}x.webp ${low}x, ${stem}${high}x.webp ${high}x`,
  };
}

/** The canvas of each capture in CSS px, for the width and height attributes. */
export function shotSize(shot: string) {
  if (shot === "a-timeline-desk") return { width: 1440, height: 1000 };
  if (shot === "a-timeline-phone") return { width: 390, height: 920 };
  return /-phone$/.test(shot) ? { width: 390, height: 844 } : { width: 1440, height: 900 };
}

export const SHOT_BOOT =
  'function S(n,t){var p=/-phone$/.test(n),a=p?2:1,b=p?3:2,s="' +
  SHOT_BASE +
  '"+n+"-"+t+"-";return[s+a+"x.webp",s+a+"x.webp "+a+"x, "+s+b+"x.webp "+b+"x"]}';
