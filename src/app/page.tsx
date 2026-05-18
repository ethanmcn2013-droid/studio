import { headers } from "next/headers";
import { RevealEngine } from "@/components/reveal/reveal-engine";
import { RevealHero } from "@/components/reveal/reveal-hero";
import { RevealManifesto } from "@/components/reveal/reveal-manifesto";
import { RevealLoadingShowcase } from "@/components/reveal/reveal-loading-showcase";
import { ProductPills } from "@/components/layout/product-pills";
import { RevealProducts } from "@/components/reveal/reveal-products";
import { RevealClosing } from "@/components/reveal/reveal-closing";
import { SuiteLauncher } from "@/components/layout/suite-launcher";

/**
 * Home page — two variants, one URL (DESIGN.md §14).
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
    // Pills are an app-user affordance only — never on the public front door.
    return (
      <>
        <ProductPills />
        <SuiteLauncher />
      </>
    );
  }

  return (
    <main id="main" tabIndex={-1}>
      <RevealLoadingShowcase />
      <RevealHero />
      <RevealManifesto />
      <RevealProducts />
      <RevealClosing />
      <RevealEngine />
    </main>
  );
}
