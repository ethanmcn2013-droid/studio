import { headers } from "next/headers";
import { RevealEngine } from "@/components/reveal/reveal-engine";
import { RevealHero } from "@/components/reveal/reveal-hero";
import { RevealManifesto } from "@/components/reveal/reveal-manifesto";
import { RevealLoadingShowcase } from "@/components/reveal/reveal-loading-showcase";
import { RevealWeddingWedge } from "@/components/reveal/reveal-wedding-wedge";
import { SuiteSwitcher } from "@/components/layout/suite-switcher-pills";
import { RevealProducts } from "@/components/reveal/reveal-products";
import { RevealClosing } from "@/components/reveal/reveal-closing";
import { SuiteLauncher } from "@/components/layout/suite-launcher";
import { SiteFooter } from "@/components/landing/site-footer";

/**
 * Home page, two variants, one URL (DESIGN.md §14).
 *
 * Authed: src/proxy.ts rewrites to / and sets x-signal-authed: 1.
 *         This component reads that header and renders the suite launcher.
 *
 * Unauthed: proxy passes through; renders the marketing hero as before.
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
      <main id="main" tabIndex={-1}>
        <RevealLoadingShowcase />
        <RevealHero />
        <RevealManifesto />
        <RevealWeddingWedge />
        <RevealProducts />
        <RevealClosing />
        <RevealEngine />
      </main>
      <SiteFooter />
    </>
  );
}
