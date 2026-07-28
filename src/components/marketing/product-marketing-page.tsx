import { SiteFooter } from "@/components/landing/site-footer";
import { ProductPills } from "@/components/layout/product-pills";
import { DayInWorkExperience } from "@/components/marketing/day-in-work/day-in-work-experience";
import { ProductHero } from "@/components/marketing/heroes/product-hero";
import { PRODUCT_MARKETING } from "@/lib/product-marketing";
import {
  PRODUCT_APP_URLS,
  type ProductId,
} from "@/lib/product-urls";
import styles from "./product-marketing-page.module.css";

export function ProductMarketingPage({ product }: { product: ProductId }) {
  const definition = PRODUCT_MARKETING[product];

  return (
    <>
      <main id="main" tabIndex={-1} className={styles.page}>
        <ProductPills current={product} />

        {/* 2026-07-28 — the real product heroes replace the static
            `ProductHeroGesture` and the generic copy column that framed it.
            Each hero carries its own headline and its own proof, so the
            copy column would have been a second, competing headline.
            `definition.headline` still drives page metadata and the boundary
            band below, so nothing downstream loses its source. */}
        <ProductHero product={product} />

        <div id="day-in-the-work">
          <DayInWorkExperience definition={definition} product={product} />
        </div>

        <section className={styles.boundary}>
          <p>What stays true</p>
          <div>
            <h2>{definition.boundary}</h2>
            <a href={PRODUCT_APP_URLS[product]}>{definition.openLabel}</a>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
