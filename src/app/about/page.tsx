import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/landing/site-footer";
import { TASKS_URL, ROADMAP_URL, ANALYTICS_URL, NOTES_URL } from "@/lib/product-urls";

export const metadata: Metadata = {
  title: "About — Signal Studio",
  description:
    "Ethan is a designer building operational clarity software under the Signal Studio umbrella.",
};

/**
 * /about — two-column manifesto.
 *
 * Left: section label + the "who" paragraph.
 * Right: two product links + a quiet closing line.
 *
 * Typography reuses .h-section and existing token scale.
 * No new primitives introduced.
 */
export default function AboutPage() {
  return (
    <>
      <main className="flex flex-1 flex-col">
        <section className="mx-auto w-full max-w-[760px] px-6 pb-28 pt-16 md:pt-24">
          {/* Section label */}
          <div
            className="mb-6 text-[11px] font-semibold uppercase"
            style={{ color: "var(--accent)", letterSpacing: "var(--tracking-eyebrow)" }}
          >
            About
          </div>

          {/* Page H1 */}
          <h1 className="h-section mb-10 max-w-[560px] text-balance text-ink">
            One workshop. Four tools. Clear opinions.
          </h1>

          {/* Two-column layout */}
          <div className="grid grid-cols-1 gap-10 md:grid-cols-[1fr_1fr] md:gap-16">
            {/* Left column — manifesto */}
            <div>
              <p
                className="leading-[1.7] text-ink-soft"
                style={{ fontSize: "clamp(0.9375rem, 0.875rem + 0.3vw, 1.0625rem)" }}
              >
                Ethan is a designer building operational clarity software under
                the Signal Studio umbrella. The work lives at the edge of product
                and craft — not enterprise, not consumer SaaS. Tools that
                reduce ambiguity instead of adding information.
              </p>

              <p
                className="mt-5 leading-[1.7] text-ink-soft"
                style={{ fontSize: "clamp(0.9375rem, 0.875rem + 0.3vw, 1.0625rem)" }}
              >
                Signal Studio is the workshop. Four products are the output.
                Each one has a job, a refusal, and a place in the system.
              </p>

              <p
                className="mt-5 leading-[1.7] text-ink-soft"
                style={{ fontSize: "clamp(0.9375rem, 0.875rem + 0.3vw, 1.0625rem)" }}
              >
                Signal Tasks runs the work. Signal Roadmap explains it. Signal
                Analytics surfaces what matters in it. Signal Notes captures it
                as it happens. One slice each. Together, a system.
              </p>
            </div>

            {/* Right column — products + closing line */}
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
                    href={TASKS_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between border-b border-border-soft pb-3 no-underline"
                  >
                    <span className="text-[14px] font-medium text-ink transition-colors group-hover:text-ink-soft">
                      Signal Tasks
                    </span>
                    <span
                      className="text-[12.5px] text-ink-faint transition-colors group-hover:text-ink-quiet"
                      aria-hidden
                    >
                      &rarr;
                    </span>
                  </a>
                  <a
                    href={ROADMAP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between border-b border-border-soft pb-3 no-underline"
                  >
                    <span className="text-[14px] font-medium text-ink transition-colors group-hover:text-ink-soft">
                      Signal Roadmap
                    </span>
                    <span
                      className="text-[12.5px] text-ink-faint transition-colors group-hover:text-ink-quiet"
                      aria-hidden
                    >
                      &rarr;
                    </span>
                  </a>
                  <a
                    href={ANALYTICS_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between border-b border-border-soft pb-3 no-underline"
                  >
                    <span className="text-[14px] font-medium text-ink transition-colors group-hover:text-ink-soft">
                      Signal Analytics
                    </span>
                    <span
                      className="text-[12.5px] text-ink-faint transition-colors group-hover:text-ink-quiet"
                      aria-hidden
                    >
                      &rarr;
                    </span>
                  </a>
                  <a
                    href={NOTES_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between border-b border-border-soft pb-3 no-underline"
                  >
                    <span className="text-[14px] font-medium text-ink transition-colors group-hover:text-ink-soft">
                      Signal Notes
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

              {/* Product work — link to /work */}
              <div className="mt-2">
                <div
                  className="mb-3 text-[11px] font-semibold uppercase text-ink-faint"
                  style={{ letterSpacing: "var(--tracking-eyebrow)" }}
                >
                  Product work
                </div>
                <Link
                  href="/work"
                  className="group flex items-center justify-between border-b border-border-soft pb-3 no-underline"
                >
                  <span className="text-[14px] font-medium text-ink transition-colors group-hover:text-ink-soft">
                    See the system
                  </span>
                  <span
                    className="text-[12.5px] text-ink-faint transition-colors group-hover:text-ink-quiet"
                    aria-hidden
                  >
                    &rarr;
                  </span>
                </Link>
              </div>

              {/* Quiet closing note */}
              <p
                className="text-[12.5px] leading-[1.6] text-ink-faint"
                style={{ letterSpacing: "0.005em" }}
              >
                No team. No investors. One person, four tools, clear opinions.
              </p>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
