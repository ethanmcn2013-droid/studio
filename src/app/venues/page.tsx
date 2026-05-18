import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/landing/site-footer";
import { VENUE_SITE_TRACKING, withTracking } from "@/lib/tracking";

export const metadata: Metadata = {
  title: "Founding Venue Programme - Signal Studio",
  description:
    "Stand behind every couple's planning. The Venue Edition is patronage, paid once a year from €1,500 — the venue's name in a quiet line, nothing for the team to run. Founding venues lock €1,500 for as long as they stay.",
  openGraph: {
    title: "Founding Venue Programme - Signal Studio",
    description:
      "A venue stands behind its couples' planning — twelve months of Signal Studio each, co-branded, paid once a year. Patronage, not software.",
    type: "website",
  },
};

const weddingsHref = withTracking("/weddings", {
  ...VENUE_SITE_TRACKING,
  artifact: "weddings_page",
});
const examplePlanHref = withTracking("https://roadmap.signalstudio.ie/the-wedding", {
  ...VENUE_SITE_TRACKING,
  artifact: "example_plan",
});

/**
 * Founding Venue Programme offer page. Venue-facing — distinct from
 * /weddings (the couple-facing wedge). Rebuilt 2026-05-16 to the
 * ratified paid model (content/hq/decisions/venue-editions-paid-tier.md):
 * the venue PAYS Signal Studio. Every "free / with our compliments /
 * the gift / no card" string is gone — that model was reversed. The
 * mechanic is unchanged: per-couple codes, co-branded eyebrow, 12-month
 * couple duration, auto-drop to Free at month 12. No fabricated product
 * screenshot (DESIGN.md §8) — a hairline panel does the work, in the
 * suite's restrained register.
 */

const included = [
  {
    title: "A planning workspace for every couple",
    copy: "Notes, decisions, tasks, and a plan anyone can forward — one clear place instead of a spreadsheet and a thread.",
  },
  {
    title: "Twelve months, every couple",
    copy: "The venue prepays the year. Each couple gets twelve months of the full suite, then it drops to the free plan with a quiet prompt beforehand. No countdown in their face.",
  },
  {
    title: "Your name on it, quietly",
    copy: "When a couple opens their workspace, they are welcomed in your venue's name — a quiet line that you stand behind their planning, not a logo wall. Their plan stays the thing in focus.",
  },
  {
    title: "Nothing for your team to run",
    copy: "No install, no admin panel, no training. You hand a couple a code; they open a workspace. That is the whole operation on your side.",
  },
];

const founding = [
  {
    title: "A price that holds",
    copy: "€1,500 a year, locked for as long as you stay. The asset is permanence, not a discount that expires into a higher number.",
  },
  {
    title: "A short conversation, once",
    copy: "What the planning year looks like from your side, and where it gets noisy. Thirty minutes, once — not a standing meeting.",
  },
  {
    title: "First look at what is next",
    copy: "Founding venues see new work before anyone else, and can say what should change while it still can.",
  },
];

export default function VenuesPage() {
  // S·55 ratified: the CTA opens a real conversation, not a form-less
  // /contact page that silently discards every param forwarded to it.
  // Re-applied into main after the unmerged-branch hazard re-regressed
  // it on prod (84012b2 lived only on an unmerged branch). Now in main's
  // lineage so future deploys can't re-break it. Attribution for a
  // founder-run pilot of a few venues is the founder knowing which
  // venues he emailed — not URL plumbing that dies at a static page.
  const contactHref =
    "mailto:hello@signalstudio.ie?subject=Founding%20Venue%20Programme";

  return (
    <>
      <main id="main" tabIndex={-1} className="flex flex-1 flex-col">
        {/* Hero */}
        <section className="border-b border-border-soft px-6 pb-16 pt-14 md:pb-20 md:pt-20">
          <div className="mx-auto w-full max-w-[1040px]">
            <p
              className="mb-5 text-[11px] font-semibold uppercase text-ink-quiet"
              style={{ letterSpacing: "var(--tracking-eyebrow)" }}
            >
              Founding Venue Programme
            </p>
            <h1 className="max-w-4xl text-[clamp(2rem,1.4rem+3.2vw,5.4rem)] font-semibold leading-[1.02] tracking-[-0.04em] text-ink">
              Stand behind every couple who plans with you.
            </h1>
            <p className="mt-6 max-w-2xl text-[17px] leading-[1.65] text-ink-soft">
              Signal Studio gives every couple a clear place to plan their
              wedding. The Venue Edition lets a venue stand behind that — paid
              once a year, the venue&apos;s name in a quiet line at the top,
              nothing for the team to run. Patronage, not software.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
              <Link
                href={contactHref}
                className="inline-flex min-h-11 items-center justify-center rounded-full bg-ink px-5 text-[14px] font-medium text-white transition-opacity hover:opacity-90"
              >
                Talk to us about your venue
              </Link>
              <a
                href={examplePlanHref}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[14px] text-ink-soft underline decoration-border-soft underline-offset-[3px] transition-colors hover:text-ink hover:decoration-accent"
              >
                See an example plan &rarr;
              </a>
              <Link
                href={weddingsHref}
                className="text-[14px] text-ink-soft underline decoration-border-soft underline-offset-[3px] transition-colors hover:text-ink hover:decoration-accent"
              >
                See what the couple gets &rarr;
              </Link>
            </div>
          </div>
        </section>

        {/* Core venue promise */}
        <section className="border-b border-border-soft px-6 py-14 md:py-16">
          <div className="mx-auto w-full max-w-[1040px]">
            <p className="text-[clamp(1.25rem,1rem+1.2vw,1.75rem)] font-semibold leading-[1.25] tracking-[-0.025em] text-ink">
              Fewer confused couples.
            </p>
            <p className="mt-1 text-[clamp(1.25rem,1rem+1.2vw,1.75rem)] font-semibold leading-[1.25] tracking-[-0.025em] text-ink">
              Fewer repetitive emails.
            </p>
            <p className="mt-1 text-[clamp(1.25rem,1rem+1.2vw,1.75rem)] font-semibold leading-[1.25] tracking-[-0.025em] text-ink-soft">
              A better planning experience under your venue&apos;s name.
            </p>
          </div>
        </section>

        {/* The Venue Edition — the money, stated plainly */}
        <section className="border-b border-border-soft px-6 py-16 md:py-20">
          <div className="mx-auto w-full max-w-[1040px]">
            <p
              className="mb-3 text-[11px] font-semibold uppercase text-ink-quiet"
              style={{ letterSpacing: "var(--tracking-eyebrow)" }}
            >
              The Venue Edition
            </p>
            <h2 className="max-w-3xl text-[clamp(1.5rem,1.2rem+1.5vw,2.25rem)] font-semibold leading-[1.1] tracking-[-0.03em] text-ink">
              Paid once a year. The couple never sees a price.
            </h2>
            <div className="mt-10 grid gap-10 md:grid-cols-[1.2fr_0.8fr] md:gap-16">
              <div>
                <p className="text-[16px] leading-[1.65] text-ink-soft">
                  €1,500 to €4,000 a year, prepaid, set by venue size and
                  number of sites. Every couple the venue sends gets twelve
                  months of the full suite. No seats. No per-couple maths. No
                  contract jargon. The venue pays so the couple never has to
                  think about it.
                </p>
                <p className="mt-5 text-[16px] leading-[1.65] text-ink-soft">
                  The founding cohort — the first fifteen venues — lock
                  €1,500 a year for as long as they stay. Not an introductory
                  rate that climbs. A standing that holds.
                </p>
              </div>
              <div className="flex flex-col gap-3 border-t border-border-soft pt-7 md:border-l md:border-t-0 md:pl-10 md:pt-0">
                <span
                  className="text-[11px] font-semibold uppercase text-ink-quiet"
                  style={{ letterSpacing: "var(--tracking-eyebrow)" }}
                >
                  Annual · prepaid
                </span>
                <span className="text-[clamp(2rem,1.6rem+1.6vw,3rem)] font-semibold leading-none tracking-[-0.045em] text-ink">
                  €1,500–€4,000
                </span>
                <span className="text-[13px] leading-[1.5] text-ink-quiet">
                  a year, by venue size · founding venues lock €1,500
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* What couples get */}
        <section className="border-b border-border-soft px-6 py-16 md:py-20">
          <div className="mx-auto w-full max-w-[1040px]">
            <p
              className="mb-3 text-[11px] font-semibold uppercase text-ink-quiet"
              style={{ letterSpacing: "var(--tracking-eyebrow)" }}
            >
              What your couples get
            </p>
            <h2 className="max-w-3xl text-[clamp(1.5rem,1.2rem+1.5vw,2.25rem)] font-semibold leading-[1.1] tracking-[-0.03em] text-ink">
              What your patronage gives them.
            </h2>
            <div className="mt-10 border-t border-border-soft">
              {included.map((item) => (
                <div
                  key={item.title}
                  className="grid gap-2 border-b border-border-soft py-6 md:grid-cols-[0.9fr_1.1fr] md:gap-10"
                >
                  <h3 className="text-[16px] font-medium text-ink">
                    {item.title}
                  </h3>
                  <p className="text-[15px] leading-[1.6] text-ink-soft">
                    {item.copy}
                  </p>
                </div>
              ))}
            </div>
            <p className="mt-8 text-[15px] leading-[1.6] text-ink-soft">
              This is the plan a couple opens — calm, plain English, their
              venue&apos;s name in a quiet line at the top.{" "}
              <a
                href={examplePlanHref}
                target="_blank"
                rel="noopener noreferrer"
                className="text-ink underline decoration-border-soft underline-offset-[3px] transition-colors hover:decoration-accent"
              >
                See an example plan &rarr;
              </a>
            </p>
          </div>
        </section>

        {/* What founding means */}
        <section className="border-b border-border-soft px-6 py-16 md:py-20">
          <div className="mx-auto w-full max-w-[1040px]">
            <p
              className="mb-3 text-[11px] font-semibold uppercase text-ink-quiet"
              style={{ letterSpacing: "var(--tracking-eyebrow)" }}
            >
              What founding means
            </p>
            <h2 className="max-w-3xl text-[clamp(1.5rem,1.2rem+1.5vw,2.25rem)] font-semibold leading-[1.1] tracking-[-0.03em] text-ink">
              You shape it, and the price never moves.
            </h2>
            <div className="mt-10 border-t border-border-soft">
              {founding.map((item) => (
                <div
                  key={item.title}
                  className="grid gap-2 border-b border-border-soft py-6 md:grid-cols-[0.9fr_1.1fr] md:gap-10"
                >
                  <h3 className="text-[16px] font-medium text-ink">
                    {item.title}
                  </h3>
                  <p className="text-[15px] leading-[1.6] text-ink-soft">
                    {item.copy}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* The rhythm — feedback cadence */}
        <section className="border-b border-border-soft px-6 py-16 md:py-20">
          <div className="mx-auto w-full max-w-[1040px]">
            <p
              className="mb-3 text-[11px] font-semibold uppercase text-ink-quiet"
              style={{ letterSpacing: "var(--tracking-eyebrow)" }}
            >
              The rhythm
            </p>
            <h2 className="max-w-3xl text-[clamp(1.5rem,1.2rem+1.5vw,2.25rem)] font-semibold leading-[1.1] tracking-[-0.03em] text-ink">
              Light by design. We come to you, not the other way around.
            </h2>
            <ol className="mt-10 max-w-2xl space-y-6">
              <li className="grid grid-cols-[auto_1fr] gap-4">
                <span className="text-[11px] font-semibold tabular-nums text-ink-quiet">
                  01
                </span>
                <p className="text-[15px] leading-[1.6] text-ink-soft">
                  <span className="font-medium text-ink">Start.</span> Once the
                  year is settled, we send the codes and a short note you can
                  pass to couples. Your coordinator gets one walkthrough, then
                  it runs itself.
                </p>
              </li>
              <li className="grid grid-cols-[auto_1fr] gap-4">
                <span className="text-[11px] font-semibold tabular-nums text-ink-quiet">
                  02
                </span>
                <p className="text-[15px] leading-[1.6] text-ink-soft">
                  <span className="font-medium text-ink">
                    A soft window, about two weeks.
                  </span>{" "}
                  Couples redeem and start planning. We watch quietly and stay
                  out of the way unless you need us.
                </p>
              </li>
              <li className="grid grid-cols-[auto_1fr] gap-4">
                <span className="text-[11px] font-semibold tabular-nums text-ink-quiet">
                  03
                </span>
                <p className="text-[15px] leading-[1.6] text-ink-soft">
                  <span className="font-medium text-ink">
                    One short retro.
                  </span>{" "}
                  A brief conversation about what worked and what did not. That
                  is the whole commitment — no recurring meetings, no reporting.
                </p>
              </li>
            </ol>
          </div>
        </section>

        {/* Closing */}
        <section className="px-6 py-16 md:py-24">
          <div className="mx-auto w-full max-w-[1040px]">
            <h2 className="max-w-3xl text-[clamp(1.5rem,1.2rem+1.5vw,2.25rem)] font-semibold leading-[1.1] tracking-[-0.03em] text-ink">
              We are taking a founding group of fifteen venues.
            </h2>
            <p className="mt-5 max-w-2xl text-[17px] leading-[1.65] text-ink-soft">
              If your venue runs real wedding coordination and you want your
              couples planning with less noise, start a conversation. No deck,
              no demo gate — a short talk about whether this fits, and what
              your venue would pay.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
              <Link
                href={contactHref}
                className="inline-flex min-h-11 items-center justify-center rounded-full bg-ink px-5 text-[14px] font-medium text-white transition-opacity hover:opacity-90"
              >
                Talk to us about your venue
              </Link>
              <a
                href={examplePlanHref}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[14px] text-ink-soft underline decoration-border-soft underline-offset-[3px] transition-colors hover:text-ink hover:decoration-accent"
              >
                Or see an example plan first &rarr;
              </a>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
