import type { Metadata } from "next";
import { SiteFooter } from "@/components/landing/site-footer";
import { ReadingProgress } from "@/components/reading-progress";

export const metadata: Metadata = {
  title: "About · Signal Studio",
  description:
    "Signal Studio builds operational clarity software for the 80% of the world that doesn't work in tech. Four products, one register, one job: show you what matters.",
};

function waitlistHref(product: string): string {
  return `/waitlist?source=about&campaign=pre_access_waitlist&product=${product}&artifact=about_products_${product}&touch=site`;
}

export default function AboutPage() {
  return (
    <>
      <ReadingProgress />
      <main id="main" tabIndex={-1} className="flex flex-1 flex-col">
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
                Four products, one system. Notes catches ideas before they get
                lost. Tasks keeps the work moving. Timeline shows everyone
                the plan. Signal tells you what changed and what needs you
                today.
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
                  Products
                </div>
                <div className="flex flex-col gap-3">
                  <a
                    href={waitlistHref("notes")}
                    className="group flex min-h-[56px] items-center justify-between border-b border-border-soft py-3 no-underline"
                  >
                    <span className="text-[14px] font-medium text-ink transition-colors group-hover:text-ink-soft">
                      Notes
                    </span>
                    <span
                      className="text-[12.5px] text-ink-faint transition-colors group-hover:text-ink-quiet"
                      aria-hidden
                    >
                      &rarr;
                    </span>
                  </a>
                  <a
                    href={waitlistHref("tasks")}
                    className="group flex min-h-[56px] items-center justify-between border-b border-border-soft py-3 no-underline"
                  >
                    <span className="text-[14px] font-medium text-ink transition-colors group-hover:text-ink-soft">
                      Tasks
                    </span>
                    <span
                      className="text-[12.5px] text-ink-faint transition-colors group-hover:text-ink-quiet"
                      aria-hidden
                    >
                      &rarr;
                    </span>
                  </a>
                  <a
                    href={waitlistHref("timeline")}
                    className="group flex min-h-[56px] items-center justify-between border-b border-border-soft py-3 no-underline"
                  >
                    <span className="text-[14px] font-medium text-ink transition-colors group-hover:text-ink-soft">
                      Timeline
                    </span>
                    <span
                      className="text-[12.5px] text-ink-faint transition-colors group-hover:text-ink-quiet"
                      aria-hidden
                    >
                      &rarr;
                    </span>
                  </a>
                  <a
                    href={waitlistHref("signal")}
                    className="group flex min-h-[56px] items-center justify-between border-b border-border-soft py-3 no-underline"
                  >
                    <span className="text-[14px] font-medium text-ink transition-colors group-hover:text-ink-soft">
                      Signal
                    </span>
                    <span
                      className="text-[12.5px] text-ink-faint transition-colors group-hover:text-ink-quiet"
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
                Boring on purpose. Built slowly, in Limerick. Everything
                important, nothing distracting.
              </p>
            </div>
          </div>
        </section>

        {/* Founder note, restrained, text-led, set apart on a soft inset panel */}
        <section className="mx-auto w-full max-w-[760px] px-6 pb-28">
          <div className="rounded-[14px] border border-border-soft bg-[var(--paper-soft)] px-7 py-10 md:px-12 md:py-14">
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
                Timeline shows what is next. Signal shows what needs attention.
              </p>

              <p
                className="mt-5 leading-[1.7] text-ink-soft"
                style={{ fontSize: "clamp(0.9375rem, 0.875rem + 0.3vw, 1.0625rem)" }}
              >
                Four products, one system, built so people can organise the work
                in front of them without learning a new language first.
              </p>

              {/* Signature */}
              <div className="mt-9 flex items-center gap-3 border-t border-border-soft pt-6">
                <span
                  aria-hidden
                  className="h-[7px] w-[7px] flex-shrink-0 rounded-full"
                  style={{ background: "var(--accent)" }}
                />
                <div className="leading-tight">
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
