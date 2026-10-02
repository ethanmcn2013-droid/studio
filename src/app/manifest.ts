import type { MetadataRoute } from "next";
import { HOME_THEME_COLOR } from "@/components/home/theme-color";

/**
 * PWA manifest · Signal Studio umbrella.
 *
 * Home-screen install target for the suite. Used by iOS Safari
 * "Add to Home Screen" (which honours apple-touch-icon + theme-color
 * but ignores most of this), Android Chrome (full PWA), and the
 * desktop Chrome install prompt.
 *
 * background_color and theme_color are the home page's dark floor, the
 * page an installed copy opens on (start_url is "/") and the ground the
 * install icons are drawn on. Each page still sends its own theme-color
 * tag, which wins once it loads: white everywhere except the home page.
 *
 * `id` is product-scoped (not "/") so each suite product registers
 * as a distinct PWA identity even when origins are consolidated.
 *
 * Install icons: /icon2 (192) and /icon1 (512), the mark inside the
 * 80% safe zone so an adaptive mask never clips it; /apple-icon (180).
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
    background_color: HOME_THEME_COLOR.dark,
    theme_color: HOME_THEME_COLOR.dark,
    lang: "en-IE",
    dir: "ltr",
    categories: ["productivity", "business"],
    icons: [
      {
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon2",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon2",
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
        src: "/icon1",
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
