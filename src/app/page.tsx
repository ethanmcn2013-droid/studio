import type { Viewport } from "next";
import { LandingPage } from "@/components/landing-v3/landing-page";
import { HOME_THEME_COLOR } from "@/components/home/theme-color";

/**
 * The browser bar on the public home page takes the page's floor, by the
 * device setting. This is all the server says, so the page can be built once
 * and served from cache.
 */
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: HOME_THEME_COLOR.light },
    { media: "(prefers-color-scheme: dark)", color: HOME_THEME_COLOR.dark },
  ],
};

/**
 * Home page, two variants, one URL.
 *
 * Signed out: this route. Landing v3 (2026-10-26), generated from the Design
 *         canvas into components/landing-v3: hero with a working board sample,
 *         the venue offer (Founding 25), Timeline, Analytics, Files, Chat, then
 *         the waitlist and planned pricing. Light and dark follow the device,
 *         set before paint by the page's boot script. The waitlist posts to the
 *         real joinWaitlistAction.
 *
 * Signed in: src/proxy.ts rewrites `/` to the internal `/launcher` route
 *         (src/app/launcher/page.tsx), which renders the suite launcher. The
 *         URL stays `/`.
 *
 * This route reads nothing from the request, so it is prerendered and
 * cacheable.
 */
export default function Home() {
  return <LandingPage />;
}
