import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/landing/site-footer";
import { ReadingProgress } from "@/components/reading-progress";
import { MarketingDelightController } from "@/components/marketing/delight/marketing-delight-controller";

export const metadata: Metadata = {
  title: "About · Signal Studio",
  description:
    "Signal Studio builds operational clarity software for the 80% of the world that doesn't work in tech. Three products, one register, one job: show you what matters.",
};

function waitlistHref(product: string): string {
  return `/waitlist?source=about&campaign=pre_access_waitlist&product=${product}&artifact=about_products_${product}&touch=site`;
}

export default function AboutPage() {
  return (
    <>
      <ReadingProgress />
      <main id="main" tabIndex={-1} className="flex flex-1 flex-col">
        <MarketingDelightController />
        <section className="mx-auto w-full max-w-[760px] px-6 pb-16 pt-16 md:pb-20 md:pt-24">
          {/* Section label */}
          <div
            className="mb-6 text-[11px] font-semibold uppercase"
            style={{ color: "var(--accent)", letterSpacing: "var(--tracking-eyebrow)" }}
          >
            About
          </div>

          {/* Page H1 */}
          <h1 className="h-section mb-10 max-w-[620px] text-balance text-ink">
            For the 80% who don&rsquo;t work in tech.
          </h1>

          <div className="mb-12 flex flex-wrap gap-3">
            <Link
              href="/#system"
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-accent px-5 text-[14px] font-semibold text-white no-underline transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              See the system at work
            </Link>
            <Link
              href="/waitlist?source=about&campaign=pre_access_waitlist&artifact=about_primary&touch=site"
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-ink px-5 text-[14px] font-semibold text-ink no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              Join the waitlist
            </Link>
          </div>

          {/* Two-column layout */}
          <div className="grid grid-cols-1 gap-10 md:grid-cols-[1fr_1fr] md:gap-16">
            {/* Left column, manifesto */}
            <div>
              <p
                className="leading-[1.7] text-ink-soft"
                style={{ fontSize: "clamp(0.9375rem, 0.875rem + 0.3vw, 1.0625rem)" }}
              >
                Signal Studio makes work software for people who don&rsquo;t work
                in software. Wedding planners. Tradespeople. Students. Small
                businesses. People with real deadlines who shouldn&rsquo;t
                have to learn project management to meet them.
              </p>

              <p
                className="mt-5 leading-[1.7] text-ink-soft"
                style={{ fontSize: "clamp(0.9375rem, 0.875rem + 0.3vw, 1.0625rem)" }}
              >
                Three products, one system. Notes catches ideas before they get
                lost. Tasks keeps the work moving. Timeline shows everyone
                the plan. A daily briefing in Home tells you what changed and
                what needs you today.
              </p>

              <p
                className="mt-5 leading-[1.7] text-ink-soft"
                style={{ fontSize: "clamp(0.9375rem, 0.875rem + 0.3vw, 1.0625rem)" }}
              >
                No sprints. No dashboards to babysit. No new vocabulary. If
                software needs a training course, it has already failed
                you.
              </p>
            </div>

            {/* Right column, products + closing line */}
            <div className="flex flex-col justify-between gap-10">
              {/* Product links */}
              <div className="flex flex-col gap-4">
                <div
                  className="text-[11px] font-semibold uppercase"
                  style={{ color: "var(--ink-faint)", letterSpacing: "var(--tracking-eyebrow)" }}
                >
                  The suite
                </div>
                <div className="flex flex-col gap-3">
                  <a
                    href={waitlistHref("notes")}
                    className="about-product-link group flex min-h-[56px] items-center justify-between border-b border-border-soft py-3 no-underline"
                  >
                    <span className="text-[14px] font-medium text-ink transition-colors">
                      Notes
                    </span>
                    <span
                      className="about-product-arrow text-[12.5px] text-ink-faint transition-colors"
                      aria-hidden
                    >
                      &rarr;
                    </span>
                  </a>
                  <a
                    href={waitlistHref("tasks")}
                    className="about-product-link group flex min-h-[56px] items-center justify-between border-b border-border-soft py-3 no-underline"
                  >
                    <span className="text-[14px] font-medium text-ink transition-colors">
                      Tasks
                    </span>
                    <span
                      className="about-product-arrow text-[12.5px] text-ink-faint transition-colors"
                      aria-hidden
                    >
                      &rarr;
                    </span>
                  </a>
                  <a
                    href={waitlistHref("timeline")}
                    className="about-product-link group flex min-h-[56px] items-center justify-between border-b border-border-soft py-3 no-underline"
                  >
                    <span className="text-[14px] font-medium text-ink transition-colors">
                      Timeline
                    </span>
                    <span
                      className="about-product-arrow text-[12.5px] text-ink-faint transition-colors"
                      aria-hidden
                    >
                      &rarr;
                    </span>
                  </a>
                  <a
                    href="/features/daily-briefing"
                    className="about-product-link group flex min-h-[56px] items-center justify-between border-b border-border-soft py-3 no-underline"
                  >
                    <span className="text-[14px] font-medium text-ink transition-colors">
                      Daily briefing
                    </span>
                    <span
                      className="about-product-arrow text-[12.5px] text-ink-faint transition-colors"
                      aria-hidden
                    >
                      &rarr;
                    </span>
                  </a>
                </div>
              </div>

              {/* Quiet closing note */}
              <p
                className="text-[12.5px] leading-[1.6] text-ink-faint"
                style={{ letterSpacing: "0.005em" }}
              >
                Built slowly in Limerick. Quiet by default, precise when it matters.
              </p>
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-[900px] px-6 pb-20" aria-labelledby="about-evidence-heading">
          <div className="border-y border-border-soft py-10">
            <div className="max-w-[620px]">
              <div className="text-[11px] font-semibold uppercase text-accent" style={{ letterSpacing: "var(--tracking-eyebrow)" }}>The operating proof</div>
              <h2 className="mt-3 text-balance text-[clamp(1.6rem,1.35rem+1vw,2.4rem)] font-semibold tracking-[-0.035em] text-ink" id="about-evidence-heading">
                The boundary is part of the product.
              </h2>
            </div>
            <div className="mt-7 grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl bg-[var(--paper-soft)] p-4">
                <strong className="text-[14px] text-ink">Private capture</strong>
                <p className="mt-2 text-[13px] leading-6 text-ink-soft">A note stays private until you choose the exact wording that becomes a task.</p>
              </div>
              <div className="rounded-xl bg-[var(--paper-soft)] p-4">
                <strong className="text-[14px] text-ink">Receipted handoff</strong>
                <p className="mt-2 text-[13px] leading-6 text-ink-soft">Notes and Tasks keep reciprocal provenance, so the source and action never drift apart.</p>
              </div>
              <div className="rounded-xl bg-[var(--paper-soft)] p-4">
                <strong className="text-[14px] text-ink">Reviewed sharing</strong>
                <p className="mt-2 text-[13px] leading-6 text-ink-soft">Timeline publishes a frozen link-only copy after you review what viewers can see.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Founder note, restrained, text-led, set apart on a soft inset panel */}
        <section className="mx-auto w-full max-w-[760px] px-6 pb-28">
          <div
            className="rounded-[14px] border border-border-soft bg-[var(--paper-soft)] px-7 py-10 md:px-12 md:py-14"
            data-delight="about-founder"
            data-delight-once
          >
            <div className="mx-auto max-w-[560px]">
              {/* Eyebrow */}
              <div
                className="mb-5 text-[11px] font-semibold uppercase text-ink-faint"
                style={{ letterSpacing: "var(--tracking-eyebrow)" }}
              >
                Founder Note
              </div>

              {/* Headline, secondary to the page H1 */}
              <h2
                className="mb-7 text-balance font-semibold text-ink"
                style={{
                  fontSize: "clamp(1.375rem, 1.1rem + 1vw, 1.875rem)",
                  lineHeight: 1.12,
                  letterSpacing: "-0.025em",
                }}
              >
                Built for the work people actually manage.
              </h2>

              {/* Lead, the thesis, set slightly stronger */}
              <p
                className="leading-[1.6] text-ink"
                style={{ fontSize: "clamp(1.0625rem, 1rem + 0.4vw, 1.1875rem)" }}
              >
                Project management software was built by tech companies, for tech
                companies.
              </p>

              <p
                className="mt-5 leading-[1.7] text-ink-soft"
                style={{ fontSize: "clamp(0.9375rem, 0.875rem + 0.3vw, 1.0625rem)" }}
              >
                That is not a criticism. It explains why so many tools make sense
                to the people who built them, and feel strangely distant to
                everyone else. They arrive with a vocabulary of their own:
                sprints, epics, backlogs, tickets, workflows, statuses,
                dependencies.
              </p>

              {/* Pivot line */}
              <p
                className="mt-6 leading-[1.6] text-ink"
                style={{ fontSize: "clamp(0.9375rem, 0.875rem + 0.3vw, 1.0625rem)" }}
              >
                Useful words in the right rooms. Heavy everywhere else.
              </p>

              <p
                className="mt-6 leading-[1.7] text-ink-soft"
                style={{ fontSize: "clamp(0.9375rem, 0.875rem + 0.3vw, 1.0625rem)" }}
              >
                Most people do not begin with a methodology. They begin with
                something that needs to happen. A wedding to plan. A college year
                to keep on top of. A venue team trying to stay aligned. A small
                business keeping customers, deadlines, and ideas moving.
              </p>

              <p
                className="mt-5 leading-[1.7] text-ink-soft"
                style={{ fontSize: "clamp(0.9375rem, 0.875rem + 0.3vw, 1.0625rem)" }}
              >
                The barrier is not only technical. It is linguistic. It is the
                quiet assumption that you already know the method, the vocabulary,
                and the shape the work is supposed to take.
              </p>

              <p
                className="mt-5 leading-[1.7] text-ink-soft"
                style={{ fontSize: "clamp(0.9375rem, 0.875rem + 0.3vw, 1.0625rem)" }}
              >
                You open a tool looking for clarity, then spend your energy
                translating real work into someone else&rsquo;s system.
              </p>

              {/* Turn of the essay */}
              <p
                className="mt-6 leading-[1.6] text-ink"
                style={{ fontSize: "clamp(0.9375rem, 0.875rem + 0.3vw, 1.0625rem)" }}
              >
                We built Signal Studio to remove that translation layer.
              </p>

              <p
                className="mt-6 leading-[1.7] text-ink-soft"
                style={{ fontSize: "clamp(0.9375rem, 0.875rem + 0.3vw, 1.0625rem)" }}
              >
                Notes are where the work starts. Tasks are what needs doing.
                Timeline shows what is next. The daily briefing shows what
                needs attention.
              </p>

              <p
                className="mt-5 leading-[1.7] text-ink-soft"
                style={{ fontSize: "clamp(0.9375rem, 0.875rem + 0.3vw, 1.0625rem)" }}
              >
                Three products, one system, built so people can organise the work
                in front of them without learning a new language first.
              </p>

              {/* Signature */}
              <div className="about-founder-signature mt-9 flex items-center gap-3 pt-6">
                <span
                  aria-hidden
                  className="about-founder-dot h-[7px] w-[7px] flex-shrink-0 rounded-full"
                  style={{ background: "var(--accent)" }}
                />
                <div className="about-founder-identity leading-tight">
                  <div className="text-[14px] font-medium text-ink">
                    Ethan McNamara
                  </div>
                  <div className="text-[12.5px] text-ink-faint">
                    Founder, Signal Studio
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
