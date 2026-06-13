import type { MetadataRoute } from "next";

/**
 * PWA manifest — Signal Studio umbrella.
 *
 * Home-screen install target for the suite. Used by iOS Safari
 * "Add to Home Screen" (which honours apple-touch-icon + theme-color
 * but ignores most of this), Android Chrome (full PWA), and the
 * desktop Chrome install prompt.
 *
 * theme_color is paper white, mirroring layout.tsx's viewport
 * themeColor — same R18 fix: a non-white address bar between
 * white-surface products reads as a dark flash on light→light
 * cross-domain navigation.
 *
 * `id` is product-scoped (not "/") so each suite product registers
 * as a distinct PWA identity even when origins are consolidated.
 *
 * Maskable icon at /icon1 (512×512) lives in icon1.tsx — content
 * inside the 80%-diameter safe zone so Android adaptive masks
 * don't clip the mark.
 *
 * Shortcuts are returning-user actions, not marketing destinations.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/signal-studio",
    name: "Signal Studio",
    short_name: "Studio",
    description:
      "Project management for the 80% not in tech. Four small tools that read as one system.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#ffffff",
    theme_color: "#ffffff",
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
        description: "Workspace, Event, Student — one page.",
      },
      {
        name: "Timeline",
        short_name: "Timeline",
        url: "/roadmap",
        description: "What's shipping next.",
      },
      {
        name: "Demo",
        short_name: "Demo",
        url: "/the-wedding",
        description: "What a finished timeline looks like.",
      },
    ],
  };
}
