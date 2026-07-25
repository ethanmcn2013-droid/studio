import Link from "next/link";
import { ProductPills } from "@/components/layout/product-pills";
import { SiteFooter } from "@/components/landing/site-footer";
import { PRODUCT_MARKETING } from "@/lib/product-marketing";
import {
  PRODUCT_APP_URLS,
  type ProductId,
} from "@/lib/product-urls";

export function ProductMarketingPage({ product }: { product: ProductId }) {
  const definition = PRODUCT_MARKETING[product];

  return (
    <>
      <main id="main" tabIndex={-1} className="flex-1">
        <ProductPills current={product} />

        <section className="border-b border-border-soft px-6 pb-16 pt-14 md:pb-24 md:pt-20">
          <div className="mx-auto w-full max-w-[1040px]">
            <p
              className="text-[11px] font-semibold uppercase text-ink-quiet"
              style={{ letterSpacing: "var(--tracking-eyebrow)" }}
            >
              {definition.name} · {definition.position}
            </p>
            <h1 className="mt-6 max-w-4xl text-[clamp(2.4rem,1.55rem+4.2vw,6.4rem)] font-semibold leading-[0.98] tracking-[-0.05em] text-ink">
              {definition.headline}
            </h1>
            <p className="mt-7 max-w-2xl text-[17px] leading-[1.65] text-ink-soft">
              {definition.introduction}
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3">
              <a
                href={PRODUCT_APP_URLS[product]}
                className="inline-flex min-h-11 items-center justify-center rounded-full bg-ink px-5 text-[14px] font-medium text-white transition-opacity hover:opacity-90"
              >
                {definition.openLabel}
              </a>
              <Link
                href={`/waitlist?source=product_page&product=${product}`}
                className="inline-flex min-h-11 items-center text-[14px] text-ink-soft underline decoration-border-soft underline-offset-[3px] transition-colors hover:text-ink hover:decoration-accent"
              >
                Join the waitlist
              </Link>
            </div>
          </div>
        </section>

        <section className="border-b border-border-soft px-6 py-16 md:py-20">
          <div className="mx-auto w-full max-w-[1040px]">
            <div className="grid border-t border-border-soft md:grid-cols-3">
              {definition.details.map((detail, index) => (
                <article
                  key={detail.title}
                  className="border-b border-border-soft py-7 md:min-h-[240px] md:border-b-0 md:border-r md:px-7 md:py-8 md:first:pl-0 md:last:border-r-0 md:last:pr-0"
                >
                  <p className="font-mono text-[11px] tabular-nums text-ink-faint">
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <h2 className="mt-8 text-[20px] font-semibold tracking-[-0.03em] text-ink">
                    {detail.title}
                  </h2>
                  <p className="mt-3 text-[14px] leading-[1.65] text-ink-soft">
                    {detail.copy}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="px-6 py-16 md:py-20">
          <div className="mx-auto grid w-full max-w-[1040px] gap-8 md:grid-cols-[0.7fr_1.3fr] md:gap-16">
            <p
              className="text-[11px] font-semibold uppercase text-ink-quiet"
              style={{ letterSpacing: "var(--tracking-eyebrow)" }}
            >
              The boundary
            </p>
            <p className="max-w-2xl text-[clamp(1.35rem,1.1rem+1.1vw,2rem)] font-medium leading-[1.35] tracking-[-0.03em] text-ink">
              {definition.boundary}
            </p>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
