import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/landing/site-footer";

export const metadata: Metadata = {
  title: "Principles — Signal Studio",
  description:
    "Five refusals Signal Studio sustains across the suite. The moat is discipline, not feature.",
};

const PRINCIPLES = [
  {
    n: "1",
    title: "One voice across the suite.",
    body:
      "Every page, every empty state, every error message, every email passes through the same register. Declarative. Plain English. No exclamation marks. No three-adjective trios. No project-manager voice. No AI-marketing register. Drift is treated as a bug. The voice is checked at the door before anything ships.",
    why: "An incumbent cannot retrofit this without alienating the users paying them for the jargon. The discipline is the moat.",
  },
  {
    n: "2",
    title: "Every product publishes its refusals.",
    body:
      "Each product in the suite has a locked refusals list in its PRODUCT.md. Tasks refuses sprints, epics, and per-seat pricing. Roadmap refuses private workspaces, team tiers, comment threading, and a public directory. Notes refuses sharing on raw notes — only creator-approved extracts cross the boundary. Analytics refuses the LLM in the path — every sentence is human-written, slot-filled by rules.",
    why: "Notion cannot refuse to be a wiki; it is a wiki. Asana cannot refuse to surface metrics; metrics are its conversion bait. We can refuse, because refusing is what makes the brand.",
  },
  {
    n: "3",
    title: "One accent colour across the suite.",
    body:
      "Brand indigo, used as a single accent across umbrella and products. The same shape from a 16px favicon to a billboard. Differentiation comes from per-product wordmark gestures — pulse, slide, tick, caret — not from per-product palette. Antique gold was retired the day the brand guide flattened the umbrella to one indigo.",
    why: "Category-colour fragmentation is how a four-product suite stops reading as one product. We refuse it.",
  },
  {
    n: "4",
    title: "Suite coherence is a single product surface.",
    body:
      "Cross-product navigation, footer chrome, the changelog, the contact page, the legal stack — these live once, in one place, and every product points to them. A visitor moving from Tasks to Roadmap to Analytics should feel one continuous voice, not three separate brands sharing a parent company.",
    why: "An incumbent attacking one of these has to attack all four — against a brand that has been speaking with one voice while they did so.",
  },
  {
    n: "5",
    title: "Audience first. Always. Before any feature decision.",
    body:
      "Every cycle asks one question: would a wedding planner, a freelance designer, a tradesperson, a student, a small-business operator, or a teacher use this? If yes, build it. If not, refuse it — even if it would look good in a comparison table. The 80% who don't work in tech do not need a special vocabulary. They need software that learned them, not the other way around.",
    why: "This is the most load-bearing discipline of all because it is the one most easily abandoned under growth pressure.",
  },
] as const;

export default function PrinciplesPage() {
  return (
    <>
      <main className="flex flex-1 flex-col">
        <section className="mx-auto w-full max-w-[760px] px-6 pb-16 pt-16 md:pt-24">
          <div
            className="mb-6 text-[11px] font-semibold uppercase"
            style={{
              color: "var(--accent)",
              letterSpacing: "var(--tracking-eyebrow)",
              fontFamily: "var(--font-mono-stack)",
            }}
          >
            Principles
          </div>

          <h1 className="h-section mb-6 max-w-[620px] text-balance text-ink">
            Five refusals we sustain across the suite.
          </h1>

          <p
            className="mb-3 max-w-[58ch] leading-[1.7] text-ink-soft"
            style={{ fontSize: "clamp(0.9375rem, 0.875rem + 0.3vw, 1.0625rem)" }}
          >
            A reasonable critique of every brand position is &ldquo;any
            incumbent could ship that.&rdquo; It is true. The category leaders
            could remove jargon, refuse a wiki, refuse a metric dashboard, ship
            an honest pricing page tomorrow. None of it requires technology
            that does not exist.
          </p>

          <p className="mb-3 max-w-[58ch] text-[15.5px] leading-[1.7] text-ink-soft">
            They will not. Not because they cannot, but because the discipline
            would alienate the customers who are already paying them.
          </p>

          <p className="max-w-[58ch] text-[15.5px] leading-[1.7] text-ink-soft">
            The moat is not a feature. The moat is what gets refused, every
            week, for years. These are the five refusals.
          </p>
        </section>

        <section className="border-t border-border-soft py-16">
          <div className="mx-auto w-full max-w-[760px] px-6">
            <ul className="space-y-16">
              {PRINCIPLES.map((p) => (
                <li key={p.n}>
                  <div className="mb-5 flex items-baseline gap-4">
                    <span
                      className="font-mono text-[42px] font-semibold leading-none"
                      style={{
                        color: "var(--accent)",
                        letterSpacing: "-0.04em",
                      }}
                      aria-hidden
                    >
                      {p.n}
                    </span>
                    <h2 className="text-balance text-[24px] font-semibold leading-[1.2] tracking-[-0.02em] text-ink md:text-[28px]">
                      {p.title}
                    </h2>
                  </div>
                  <p className="mb-4 max-w-[58ch] text-[15.5px] leading-[1.7] text-ink-soft">
                    {p.body}
                  </p>
                  <p
                    className="max-w-[58ch] border-l border-border-soft pl-4 text-[14px] leading-[1.65] text-ink-quiet"
                  >
                    {p.why}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="border-t border-border-soft py-16">
          <div className="mx-auto w-full max-w-[760px] px-6">
            <div
              className="mb-4 text-[11px] font-semibold uppercase"
              style={{
                color: "var(--ink-quiet)",
                letterSpacing: "var(--tracking-eyebrow)",
                fontFamily: "var(--font-mono-stack)",
              }}
            >
              Honest dissent
            </div>
            <h2 className="mb-5 max-w-[620px] text-balance text-[24px] font-semibold leading-[1.2] tracking-[-0.02em] text-ink">
              Discipline moats are slower than feature moats.
            </h2>
            <p className="mb-4 max-w-[58ch] text-[15.5px] leading-[1.7] text-ink-soft">
              There will be cycles where Signal Studio looks behind because an
              incumbent shipped a feature we refused. That is the moat
              working, not failing. The metric that tells us it is paying out
              is the language readers use back to us. When a user says back
              &ldquo;this isn&rsquo;t a dashboard&rdquo; or &ldquo;this
              doesn&rsquo;t talk like Jira&rdquo; — without prompting — the
              discipline is compounding.
            </p>
            <p className="max-w-[58ch] text-[15.5px] leading-[1.7] text-ink-soft">
              When users start describing Signal Studio with the incumbents&rsquo;
              vocabulary instead of ours, the moat has been breached. We will
              fix that.
            </p>

            <div className="mt-12 flex flex-wrap gap-x-6 gap-y-3 text-[14px] text-ink">
              <Link
                href="/proof"
                className="underline decoration-border-soft underline-offset-[3px] transition-colors hover:text-accent hover:decoration-accent"
              >
                See the suite in motion
              </Link>
              <Link
                href="/about"
                className="underline decoration-border-soft underline-offset-[3px] transition-colors hover:text-accent hover:decoration-accent"
              >
                Read the manifesto
              </Link>
              <Link
                href="/dispatch"
                className="underline decoration-border-soft underline-offset-[3px] transition-colors hover:text-accent hover:decoration-accent"
              >
                Follow what we ship
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
