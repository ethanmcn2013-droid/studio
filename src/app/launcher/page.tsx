import type { Metadata, ResolvingMetadata } from "next";
import { SuiteSwitcher } from "@/components/layout/suite-switcher-pills";
import { SuiteLauncher } from "@/components/layout/suite-launcher";

/**
 * The signed-in variant of `/` (DESIGN.md §14).
 *
 * Nobody visits this address. src/proxy.ts rewrites a signed-in request for
 * `/` to it, so the URL stays `/`, and redirects a direct request for
 * `/launcher` back to `/`. It lives on a route of its own so that the public
 * home page reads nothing from the request and can be served from cache
 * (round 3, 2026-10-02). Before that, `/` chose between the two by reading
 * the proxy's `x-signal-authed` header.
 *
 * Rendered per request, as it always was. It keeps the layout's white
 * browser bar, and the global site nav hides itself here as it does on `/`.
 */
export const dynamic = "force-dynamic";

/* The address people see is `/`, so that is what this page calls itself:
   the layout's canonical and share address resolve against the route being
   rendered, which here is the internal one. */
export async function generateMetadata(
  _props: unknown,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { openGraph } = await parent;
  return {
    alternates: { canonical: "/" },
    openGraph: { ...(openGraph as Metadata["openGraph"]), url: "/" },
  };
}

export default function Launcher() {
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
