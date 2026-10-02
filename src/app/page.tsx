import type { Viewport } from "next";
import { headers } from "next/headers";
import { SuiteSwitcher } from "@/components/layout/suite-switcher-pills";
import { HomePage } from "@/components/home/home-page";
import { SuiteLauncher } from "@/components/layout/suite-launcher";
import { SiteFooter } from "@/components/landing/site-footer";
import { HOME_THEME_COLOR } from "@/components/home/theme-color";

/**
 * The browser bar on the signed-out home page takes the page's floor, by the
 * same rule the page uses for its theme: ?theme=light|dark, else the device
 * setting. The home runtime keeps it in step with the toggle after that.
 * The signed-in launcher returns nothing here, so it keeps the layout's
 * white bar, as does every other route.
 */
export async function generateViewport({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}): Promise<Viewport> {
  const headersList = await headers();
  if (headersList.get("x-signal-authed") === "1") return {};

  const { theme } = await searchParams;
  if (theme === "light" || theme === "dark") {
    return { themeColor: HOME_THEME_COLOR[theme] };
  }
  return {
    themeColor: [
      { media: "(prefers-color-scheme: light)", color: HOME_THEME_COLOR.light },
      { media: "(prefers-color-scheme: dark)", color: HOME_THEME_COLOR.dark },
    ],
  };
}

/**
 * Home page, two variants, one URL (DESIGN.md §14).
 *
 * Authed: src/proxy.ts rewrites to / and sets x-signal-authed: 1.
 *         This component reads that header and renders the suite launcher.
 *
 * Unauthed: proxy passes through; renders the marketing front door.
 *         "One Friday" (founder pick 2026-10-02): a working Home sample,
 *         who it is for, then Projects, one Friday in Tasks, Timeline,
 *         Files, Analytics and the whiteboard, in the header's order. Dark
 *         first, with a light theme scoped to this page. It carries its own
 *         header; the global site nav hides itself on this route. The shared
 *         footer stays, without the mascot film: the dot run above it is the
 *         page's one closing motion (round 2).
 *
 * The two-variant pattern avoids a redirect loop (authed redirect to /
 * would loop back to this page). The proxy rewrite keeps the URL clean.
 */
export default async function Home() {
  const headersList = await headers();
  const isAuthed = headersList.get("x-signal-authed") === "1";

  if (isAuthed) {
    // §14 (amended 2026-05-19): the canonical SuiteSwitcher pills, the
    // same component the four product app-chromes render, so the suite
    // feels like one surface. No `current` (you are on the umbrella, not
    // in a product); no umbrella anchor (you are already here). The
    // full-page launcher grid stays below as the richer "jump back in".
    return (
      <>
        <div className="flex w-full justify-center px-4 pt-[18px]">
          <SuiteSwitcher showUmbrella={false} />
        </div>
        <SuiteLauncher />
      </>
    );
  }

  return (
    <HomePage>
      <SiteFooter />
    </HomePage>
  );
}
