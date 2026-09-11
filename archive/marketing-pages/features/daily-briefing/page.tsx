import type { Metadata } from "next";
import Link from "next/link";
import { SignalTheRead } from "@/components/marketing/heroes/signal/the-read";
import { SiteFooter } from "@/components/landing/site-footer";
import { PRODUCT_MARKETING } from "@/lib/product-marketing";
import { PRODUCT_MARKETING_URLS } from "@/lib/product-urls";

const SITE_URL = "https://signalstudio.ie";

export const metadata: Metadata = {
  title: "The daily briefing · Built into Home · Signal Studio",
  description:
    "Signal Studio turns activity into a clear daily briefing. Home reads the work you already hold in Notes, Tasks and Timeline, and starts your day with the few things that need you.",
  alternates: { canonical: `${SITE_URL}/features/daily-briefing` },
};

/**
 * /features/daily-briefing — the daily-briefing story, carried over from
 * the retired /signal product page (Signal → Home consolidation,
 * 2026-08-04). Signal left the product line, not the product: the same
 * capability is presented here as what it now is — the intelligence
 * built into Home, not a fourth product. /signal 301s here.
 */
export default function DailyBriefingFeaturePage() {
  const definition = PRODUCT_MARKETING.signal;

  return (
    <>
      <main id="main" tabIndex={-1} className="bg-bg">
        <section className="mx-auto w-full max-w-[880px] px-5 pb-4 pt-16 sm:px-6 md:pt-24">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-quiet">
            Built into Home
          </p>
          <h1 className="mt-3 max-w-[24ch] text-[34px] font-semibold leading-[1.04] tracking-[-0.035em] text-ink md:text-[44px]">
            Your daily signal, built into Home.
          </h1>
          <p className="mt-5 max-w-[52ch] text-[16px] leading-[1.6] text-ink-soft md:text-[17px]">
            {definition.introduction} Open the app and start with what
            needs you — the system brings forward what matters and lets
            the rest wait.
          </p>
          <p className="mt-6 flex flex-wrap items-baseline gap-x-2 gap-y-1 text-[13px] text-ink-quiet">
            <span>Notes</span>
            <span aria-hidden>→</span>
            <span>Tasks</span>
            <span aria-hidden>→</span>
            <span>Timeline</span>
            <span aria-hidden>→</span>
            <span className="font-medium text-ink">your daily signal</span>
          </p>
        </section>

        <section
          aria-label="Today's Signal, sample briefing"
          className="mx-auto w-full max-w-[880px] px-5 py-10 sm:px-6"
        >
          <SignalTheRead embedded />
        </section>

        <section className="mx-auto w-full max-w-[880px] px-5 py-8 sm:px-6">
          <div className="grid gap-8 md:grid-cols-3">
            {definition.details.map((detail) => (
              <div key={detail.title}>
                <h2 className="text-[15px] font-semibold tracking-[-0.01em] text-ink">
                  {detail.title}
                </h2>
                <p className="mt-2 text-[13.5px] leading-[1.6] text-ink-soft">
                  {detail.copy}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section
          aria-label="A morning with the briefing"
          className="mx-auto w-full max-w-[880px] px-5 py-10 sm:px-6"
        >
          <ol className="divide-y divide-hairline-soft border-y border-hairline-soft">
            {definition.story.map((beat) => (
              <li
                key={beat.number}
                className="grid gap-1 py-4 sm:grid-cols-[72px_1fr] sm:gap-6"
              >
                <span className="font-mono text-[12px] tracking-[0.02em] text-ink-quiet">
                  {beat.number}
                </span>
                <span>
                  <span className="block text-[14.5px] font-medium text-ink">
                    {beat.title}
                  </span>
                  <span className="mt-0.5 block text-[13px] leading-relaxed text-ink-soft">
                    {beat.copy}
                  </span>
                </span>
              </li>
            ))}
          </ol>
          <p className="mt-6 max-w-[54ch] text-[13.5px] leading-[1.6] text-ink-quiet">
            {definition.boundary}
          </p>
        </section>

        <section className="mx-auto w-full max-w-[880px] px-5 pb-20 pt-8 sm:px-6">
          <div className="flex flex-col items-start gap-4 border-t border-hairline-soft pt-8 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-[40ch] text-[14px] leading-relaxed text-ink-soft">
              The briefing is part of every Signal Studio workspace — not
              a separate product, and never a separate price.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/waitlist?source=daily_briefing&campaign=pre_access_waitlist&artifact=feature_cta&touch=site"
                className="inline-flex items-center gap-1.5 rounded-lg bg-ink px-4 py-2.5 text-[13.5px] font-medium text-white transition-opacity hover:opacity-90"
              >
                Join the waitlist
                <span aria-hidden>→</span>
              </Link>
              <a
                href={PRODUCT_MARKETING_URLS.notes}
                className="text-[13px] font-medium text-ink-soft underline-offset-4 transition-colors hover:text-ink hover:underline"
              >
                See the products
              </a>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
