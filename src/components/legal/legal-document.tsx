import type { ReactNode } from "react";
import { SiteFooter } from "@/components/landing/site-footer";
import { ReadingProgress } from "@/components/reading-progress";
import { DocContents } from "./doc-contents";

/**
 * Shared scaffold for the trust stack, /privacy, /terms, /security,
 * /accessibility. Principle 4 names the legal stack as one product
 * surface, so it gets one treatment: a numbered, deep-linkable
 * document with a quiet contents rail on wide screens.
 *
 * The brief is restraint, not decoration. A legal page earns care by
 * being navigable and honest, not by being loud, so the only moves
 * here are rhythm (numbered sections), orientation (the rail), and
 * the ability to send someone a link straight to "§ Refunds".
 */

export interface LegalSection {
  heading: string;
  body: readonly string[];
}

/** Stable, readable anchors: "Your rights" → "your-rights". */
function slugify(heading: string): string {
  return heading
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function LegalDocument({
  eyebrow,
  title,
  intro,
  updated,
  sections,
  footnote,
}: {
  eyebrow: string;
  title: ReactNode;
  intro: ReactNode;
  updated: string;
  sections: readonly LegalSection[];
  footnote?: ReactNode;
}) {
  const refs = sections.map((s) => ({ id: slugify(s.heading), heading: s.heading }));

  return (
    <>
      <ReadingProgress />
      <main id="main" tabIndex={-1} className="flex flex-1 flex-col">
        <div className="mx-auto grid w-full max-w-[960px] grid-cols-1 gap-x-14 px-6 pb-28 pt-16 md:pt-24 lg:grid-cols-[190px_minmax(0,1fr)]">
          <aside>
            <DocContents sections={refs} />
          </aside>

          <div className="max-w-[680px]">
            <div
              className="mb-6 text-[11px] font-semibold uppercase"
              style={{ color: "var(--accent)", letterSpacing: "var(--tracking-eyebrow)" }}
            >
              {eyebrow}
            </div>

            <h1 className="h-section mb-6 max-w-[620px] text-balance text-ink">{title}</h1>

            <p
              className="mb-2 max-w-[58ch] leading-[1.7] text-ink-soft"
              style={{ fontSize: "clamp(0.9375rem, 0.875rem + 0.3vw, 1.0625rem)" }}
            >
              {intro}
            </p>

            <p className="mb-16 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-faint">
              Last updated {updated}
            </p>

            <div className="space-y-14">
              {sections.map((s, i) => {
                const id = refs[i].id;
                return (
                  <section key={id} id={id} className="scroll-mt-28">
                    <a
                      href={`#${id}`}
                      className="group mb-4 flex items-baseline gap-3.5 no-underline"
                      aria-label={`Link to ${s.heading}`}
                    >
                      <span
                        className="font-mono text-[12px] tabular-nums text-[color:var(--ink-ghost)] transition-colors group-hover:text-[color:var(--accent)]"
                        style={{ letterSpacing: "0.02em" }}
                        aria-hidden
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <h2 className="text-[20px] font-semibold leading-snug tracking-[-0.015em] text-ink">
                        {s.heading}
                      </h2>
                    </a>
                    <div className="space-y-4 pl-[34px] text-[15px] leading-[1.7] text-ink-soft">
                      {s.body.map((p, j) => (
                        <p key={j}>{p}</p>
                      ))}
                    </div>
                  </section>
                );
              })}
            </div>

            {footnote ? (
              <p className="mt-16 max-w-[58ch] border-t border-border-soft pt-8 text-[13px] leading-[1.7] text-ink-faint">
                {footnote}
              </p>
            ) : null}
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
