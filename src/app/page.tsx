import { headers } from "next/headers";
import { RevealHero } from "@/components/reveal/reveal-hero";
import { SuiteSwitcher } from "@/components/layout/suite-switcher-pills";
import { RevealProductRelay } from "@/components/reveal/reveal-product-relay";
import { RevealClosing } from "@/components/reveal/reveal-closing";
import { SuiteLauncher } from "@/components/layout/suite-launcher";
import { SiteFooter } from "@/components/landing/site-footer";
import "@/components/reveal/floor-and-sheet.css";

/**
 * Home page, two variants, one URL (DESIGN.md §14).
 *
 * Authed: src/proxy.ts rewrites to / and sets x-signal-authed: 1.
 *         This component reads that header and renders the suite launcher.
 *
 * Unauthed: proxy passes through; renders the marketing front door.
 *         Direction A, "Floor and sheet" (founder pick 2026-09-03): the
 *         suite's own geometry, an ink floor with white sheets lifted off
 *         it, and the three products shown as real scenes that play once.
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
    <>
      <main id="main" tabIndex={-1} className="floor-page">
        <RevealHero />
        <RevealProductRelay />
        <RevealClosing />
      </main>
      <div className="floor-footer">
        <SiteFooter />
      </div>
    </>
  );
}
