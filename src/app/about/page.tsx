import type { Metadata } from "next";
import { SiteFooter } from "@/components/landing/site-footer";

export const metadata: Metadata = {
  title: "About — studio.",
  description:
    "Ethan is a designer building software and motion graphics under the studio. umbrella.",
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
            className="mb-10 text-[11px] font-semibold uppercase tracking-[0.18em]"
            style={{ color: "var(--accent)" }}
          >
            About
          </div>

          {/* Two-column layout */}
          <div className="grid grid-cols-1 gap-10 md:grid-cols-[1fr_1fr] md:gap-16">
            {/* Left column — manifesto */}
            <div>
              <p
                className="leading-[1.7] text-ink-soft"
                style={{ fontSize: "clamp(0.9375rem, 0.875rem + 0.3vw, 1.0625rem)" }}
              >
                Ethan is a designer making focused software and motion graphics
                under the studio. umbrella. The work lives at the edge of
                product and craft — not enterprise, not consumer SaaS. Tools
                that disappear into the work they&rsquo;re there to support.
              </p>

              <p
                className="mt-5 leading-[1.7] text-ink-soft"
                style={{ fontSize: "clamp(0.9375rem, 0.875rem + 0.3vw, 1.0625rem)" }}
              >
                studio. is the workshop. The products — Tasks and Roadmap — are
                the output. Each one is specific, quiet, and finished.
              </p>
            </div>

            {/* Right column — products + closing line */}
            <div className="flex flex-col justify-between gap-10">
              {/* Product links */}
              <div className="flex flex-col gap-4">
                <div
                  className="text-[11px] font-semibold uppercase tracking-[0.18em]"
                  style={{ color: "var(--ink-faint)" }}
                >
                  Products
                </div>
                <div className="flex flex-col gap-3">
                  <a
                    href="https://tasks-nu-hazel.vercel.app"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between border-b border-border-soft pb-3 no-underline"
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
                    href="https://roadmap-ebon-eight.vercel.app"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between border-b border-border-soft pb-3 no-underline"
                  >
                    <span className="text-[14px] font-medium text-ink transition-colors group-hover:text-ink-soft">
                      Roadmap
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
                No team. No investors. One person, two tools, clear opinions.
              </p>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
