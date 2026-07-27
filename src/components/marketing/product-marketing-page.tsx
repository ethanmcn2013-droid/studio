import Link from "next/link";
import type { CSSProperties } from "react";
import { SiteFooter } from "@/components/landing/site-footer";
import { ProductPills } from "@/components/layout/product-pills";
import { DayInWorkExperience } from "@/components/marketing/day-in-work/day-in-work-experience";
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

        <section className={styles.hero} data-product={product}>
          <div className={styles.heroCopy}>
            <p>
              {definition.name} · {definition.position}
            </p>
            <h1>{definition.headline}</h1>
            <span>{definition.introduction}</span>
            <div className={styles.heroActions}>
              <a href={PRODUCT_APP_URLS[product]}>{definition.openLabel}</a>
              <Link href="#day-in-the-work">See it in the work</Link>
            </div>
          </div>
          <ProductHeroGesture product={product} />
        </section>

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

function ProductHeroGesture({ product }: { product: ProductId }) {
  return (
    <div
      aria-label={`${product} product gesture`}
      className={styles.gesture}
      data-product={product}
      role="img"
    >
      <div className={styles.gestureChrome}>
        <span>{product}</span>
        <small>Product gesture</small>
      </div>
      {product === "notes" ? (
        <div className={styles.notesGesture}>
          <p>
            The place cards should use the invitation paper
            <i aria-hidden />
          </p>
          <span>Wedding notes</span>
          <span>Venue walk-through</span>
          <span>Supplier ideas</span>
        </div>
      ) : null}
      {product === "tasks" ? (
        <div className={styles.tasksGesture}>
          {[
            ["Approve the run-sheet", "Done"],
            ["Confirm the menu", "Wednesday"],
            ["Choose the music", "Friday"],
          ].map(([label, receipt], index) => (
            <p key={label}>
              <i data-done={index === 0 ? "true" : undefined} aria-hidden>
                {index === 0 ? "✓" : ""}
              </i>
              <span>{label}</span>
              <small>{receipt}</small>
            </p>
          ))}
        </div>
      ) : null}
      {product === "timeline" ? (
        <div className={styles.timelineGesture}>
          <p>Mara &amp; Finn</p>
          <div>
            <b aria-hidden />
            {["Venue", "Invitations", "Wedding day"].map((label, index) => (
              <i
                aria-label={label}
                key={label}
                style={{ "--point": index } as CSSProperties}
              />
            ))}
          </div>
          <span>The line travels once. The story stays clear.</span>
        </div>
      ) : null}
      {product === "signal" ? (
        <div className={styles.signalGesture}>
          <p>Good morning.</p>
          <h2>One decision is holding the day.</h2>
          <div>
            {[38, 62, 48, 82, 54, 70, 45].map((height, index) => (
              <i
                aria-hidden
                key={`${height}-${index}`}
                style={
                  {
                    "--bar-height": `${height}%`,
                    "--bar-index": index,
                  } as CSSProperties
                }
              />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
