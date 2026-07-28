import { SiteFooter } from "@/components/landing/site-footer";
import { ProductPills } from "@/components/layout/product-pills";
import { ProductHero } from "@/components/marketing/heroes/product-hero";
import { type ProductId } from "@/lib/product-urls";
import styles from "./product-marketing-page.module.css";

/**
 * A product page is its hero.
 *
 * 2026-07-28 — the "day in the work" tab strip and the "what stays true"
 * boundary band are both removed. They were built to carry the proof when the
 * hero was a static CSS gesture that could not carry anything. Now each hero
 * is the product actually running, so a tabbed retelling underneath repeated
 * the argument in a weaker form, and the boundary line closed a page the hero
 * had already made its point on.
 *
 * What is left is the pill row, the hero, and the footer.
 *
 * Copy for the retired sections stays in `src/lib/product-marketing.ts`
 * rather than being deleted, so nothing has to be rewritten if a section is
 * ever wanted back. The components that rendered them are gone; the words
 * are not.
 */
export function ProductMarketingPage({ product }: { product: ProductId }) {
  return (
    <>
      <main id="main" tabIndex={-1} className={styles.page}>
        <ProductPills current={product} />
        <ProductHero product={product} />
      </main>
      <SiteFooter />
    </>
  );
}
