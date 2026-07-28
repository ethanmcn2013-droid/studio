import { SiteFooter } from "@/components/landing/site-footer";
import { ProductPills } from "@/components/layout/product-pills";
import { ProductHandoff } from "@/components/marketing/handoff/product-handoff";
import { ProductHero } from "@/components/marketing/heroes/product-hero";
import { PRODUCT_MARKETING } from "@/lib/product-marketing";
import { type ProductId } from "@/lib/product-urls";
import styles from "./product-marketing-page.module.css";

/**
 * A product page is its hero, its handoff, and its close.
 *
 * 2026-07-28 — the shape settled in two steps. First the day-in-the-work tab
 * strip and the boundary band were cut, because the hero is the product
 * actually running and a tabbed retelling repeated its argument in a weaker
 * form. Then the two jobs the hero genuinely cannot do came back as one
 * section each:
 *
 *   handoff  the suite story. Each page shows the single moment its product
 *            passes work to the next, and links onward, so the four pages
 *            can be walked the way work moves: notes → tasks → timeline →
 *            signal → the waitlist.
 *   close    the conversion. One boundary sentence (the product's refusal,
 *            from `product-marketing.ts`) and one action. The old boundary
 *            band's copy, at a fraction of its height.
 */
export function ProductMarketingPage({ product }: { product: ProductId }) {
  const definition = PRODUCT_MARKETING[product];

  return (
    <>
      <main id="main" tabIndex={-1} className={styles.page}>
        <ProductPills current={product} />
        <ProductHero product={product} />
        <ProductHandoff product={product} />

        <section aria-label="Join the waitlist" className={styles.close}>
          <div className={styles.closeInner}>
            <p>{definition.boundary}</p>
            <a href="/waitlist">Join the waitlist</a>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
