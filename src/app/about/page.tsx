import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/landing/site-footer";
import { ReadingProgress } from "@/components/reading-progress";
import { TASKS_URL, ROADMAP_URL, ANALYTICS_URL, NOTES_URL } from "@/lib/product-urls";

export const metadata: Metadata = {
  title: "About — Signal Studio",
  description:
    "Signal Studio builds operational clarity software for the 80% of the world that doesn't work in tech. Four products, one register, one job: show you what matters.",
};
export default function AboutPage() {
  return (
    <>
      <ReadingProgress />
      <main id="main" tabIndex={-1} className="flex flex-1 flex-col">
        <section className="mx-auto w-full max-w-[760px] px-6 pb-28 pt-16 md:pt-24">
          {/* Section label */}
          <div
            className="mb-6 text-[11px] font-semibold uppercase"
            style={{ color: "var(--accent)", letterSpacing: "var(--tracking-eyebrow)" }}
          >
            About
          </div>

          {/* Page H1 */}
          <h1 className="h-section mb-10 max-w-[620px] text-balance text-ink">
            Operational clarity software for the 80%.
          </h1>

          {/* Two-column layout */}
          <div className="grid grid-cols-1 gap-10 md:grid-cols-[1fr_1fr] md:gap-16">
            {/* Left column — manifesto */}
            <div>
              <p
                className="leading-[1.7] text-ink-soft"
                style={{ fontSize: "clamp(0.9375rem, 0.875rem + 0.3vw, 1.0625rem)" }}
              >
                Signal Studio builds software for the people the work routes
                through. Wedding planners. Tradespeople. Freelancers. Students.
                Small-business operators. The 80% of the world who run real work
                with real deadlines, and have no patience for a tool that wants
                them to learn project management first.
              </p>

              <p
                className="mt-5 leading-[1.7] text-ink-soft"
                style={{ fontSize: "clamp(0.9375rem, 0.875rem + 0.3vw, 1.0625rem)" }}
              >
                Four products. One register. One job: show you what matters.
                Signal Tasks runs the work. Signal Roadmap explains it. Signal
                Analytics surfaces what matters in it. Signal Notes captures it
                as it happens. Each solves one slice. Together they read as one
                system.
              </p>

              <p
                className="mt-5 leading-[1.7] text-ink-soft"
                style={{ fontSize: "clamp(0.9375rem, 0.875rem + 0.3vw, 1.0625rem)" }}
              >
                Not a productivity suite. Productivity tools tell you to do
                more. These ones tell you what matters. Not a project manager.
                Plain English, no sprints, no epics, no burndown. Not an AI
                workspace. The system is ambient. We don&rsquo;t market it.
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
                    href={NOTES_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex min-h-[56px] items-center justify-between border-b border-border-soft py-3 no-underline"
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
                  <a
                    href={TASKS_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex min-h-[56px] items-center justify-between border-b border-border-soft py-3 no-underline"
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
                    className="group flex min-h-[56px] items-center justify-between border-b border-border-soft py-3 no-underline"
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
                    className="group flex min-h-[56px] items-center justify-between border-b border-border-soft py-3 no-underline"
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
                  className="group flex min-h-[56px] items-center justify-between border-b border-border-soft py-3 no-underline"
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
                Boring on purpose. Built slowly. Everything important, nothing
                distracting.
              </p>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
