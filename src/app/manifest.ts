import type { MetadataRoute } from "next";
import { SIGNAL_TILE } from "@/lib/brand/suite-mark";

/**
 * PWA manifest · Signal Studio umbrella.
 *
 * Home-screen install target for the suite. Used by iOS Safari
 * "Add to Home Screen" (which honours apple-touch-icon + theme-color
 * but ignores most of this), Android Chrome (full PWA), and the
 * desktop Chrome install prompt.
 *
 * background_color and theme_color are white, the ground of the maskable
 * icon, so the launch splash is the tile the launcher showed and never a
 * dark one. Each page still sends its own theme-color tag, which wins once
 * it loads; the home page keeps its own floor in each theme.
 *
 * `id` is product-scoped (not "/") so each suite product registers
 * as a distinct PWA identity even when origins are consolidated.
 *
 * Install icons: /icon2 (192) and /icon1 (512) are the mark with no
 * background, for launchers that draw transparency. /icon4 (192) and
 * /icon3 (512) are the maskable pair: the mark on white, inside the 80%
 * safe zone so an adaptive mask never clips it. The Apple touch icon is
 * linked from the page head and not listed here: it is a white tile, and
 * an "any" entry would let a launcher pick the tile over the floating mark.
 *
 * Shortcuts only name pages this site serves. /roadmap and /the-wedding
 * left with the estate cut and returned 404 from an installed copy.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/signal-studio",
    name: "Signal Studio",
    short_name: "Signal Studio",
    description:
      "Project management for people not in tech. Signal Studio tells you what needs you today, in words you would use yourself.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: SIGNAL_TILE,
    theme_color: SIGNAL_TILE,
    lang: "en-IE",
    dir: "ltr",
    categories: ["productivity", "business"],
    icons: [
      {
        src: "/icon2",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon4",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icon1",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon3",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    shortcuts: [
      {
        name: "Pricing",
        short_name: "Pricing",
        url: "/pricing",
        description: "Free, Student, Pro and Enterprise, one clear comparison.",
      },
      {
        name: "Join the waitlist",
        short_name: "Waitlist",
        url: "/waitlist",
        description: "Leave your email. Access opens in small batches.",
      },
      {
        name: "About",
        short_name: "About",
        url: "/about",
        description: "Who builds Signal Studio, and how to reach us.",
      },
    ],
  };
}
