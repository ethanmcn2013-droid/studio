import type { Viewport } from "next";
import { HomePage } from "@/components/home/home-page";
import { SiteFooter } from "@/components/landing/site-footer";
import { HOME_THEME_COLOR } from "@/components/home/theme-color";

/**
 * The browser bar on the public home page takes the page's floor, by the
 * device setting. This is all the server says, so the page can be built once
 * and served from cache. A visitor's own choice (`?theme=light|dark`, or the
 * switch) is settled in the browser: the page's boot script puts one
 * theme-color tag of its own first in the head while the page is parsed, and
 * the home runtime keeps it in step with the toggle after that.
 */
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: HOME_THEME_COLOR.light },
    { media: "(prefers-color-scheme: dark)", color: HOME_THEME_COLOR.dark },
  ],
};

/**
 * Home page, two variants, one URL (DESIGN.md §14).
 *
 * Signed out: this route. The marketing front door, "One Friday" (founder
 *         pick 2026-10-02): a working Home sample, the same first line in
 *         other trades' words, who it is for, then Projects, one Friday in
 *         Tasks, Timeline, Files, Analytics and the whiteboard, in the
 *         header's order. Dark first, with a light theme scoped to this
 *         page. It carries its own header; the global site nav hides itself
 *         on this route. The shared footer stays, without its mascot: the
 *         dot run above it is the page's one dot.
 *
 * Signed in: src/proxy.ts rewrites `/` to the internal `/launcher` route
 *         (src/app/launcher/page.tsx), which renders the suite launcher. The
 *         URL stays `/`.
 *
 * Round 3 (2026-10-02): this route reads nothing from the request, no header
 * and no query string, so it is prerendered and cacheable. It used to read
 * the proxy's `x-signal-authed` header to choose a variant, which made every
 * signed-out visit a fresh render with `no-store`.
 */
export default function Home() {
  return (
    <HomePage>
      <SiteFooter />
    </HomePage>
  );
}
