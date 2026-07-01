import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/landing/site-footer";
import { ReadingProgress } from "@/components/reading-progress";
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

const examplePlanHref = withTracking(
  "https://timeline.signalstudio.ie/the-wedding",
  { ...VENUE_SITE_TRACKING, artifact: "example_plan" },
);
const demoHref = withTracking("/venues/demo", {
  ...VENUE_SITE_TRACKING,
  artifact: "venue_demo",
});
const contactHref = withTracking("/contact?subject=founding-venue", {
  ...VENUE_SITE_TRACKING,
  artifact: "contact",
});

/**
 * Founding Venue Programme — rebuilt 2026-05-26 (S·68).
 * Audience: warm leads who have already had an outreach conversation.
 * Job: prove the product is real, show the co-branded moment inline,
 * tease the coordinator view (coming for founding venues), state the
 * price plainly, and make the ask feel low-stakes.
 *
 * No fabricated product screenshot (DESIGN.md §8) — the mocks use
 * fictional venue and couple names throughout.
 */

// ── Coordinator wireframe mock data ─────────────────────────────
type CoordinatorStatus = "on-track" | "needs-attention" | "not-started";

const coordinatorRows: Array<{
  couple: string;
  date: string;
  status: CoordinatorStatus;
  lastActive: string;
}> = [
  {
    couple: "Aoife & Ciarán",
    date: "23 Jun 2026",
    status: "on-track",
    lastActive: "2 days ago",
  },
  {
    couple: "Emma & James",
    date: "4 Jul 2026",
    status: "needs-attention",
    lastActive: "1 week ago",
  },
  {
    couple: "Sarah & David",
    date: "12 Sep 2026",
    status: "not-started",
    lastActive: "—",
  },
  {
    couple: "Kate & Michael",
    date: "18 Oct 2026",
    status: "on-track",
    lastActive: "Yesterday",
  },
];

// ── Section data ─────────────────────────────────────────────────
const coupleExperience = [
  {
    title: "One clear place",
    copy: "Notes, decisions, tasks, and a plan anyone can forward — instead of a spreadsheet and a thread.",
  },
  {
    title: "Twelve months",
    copy: "The venue prepays the year. Each couple gets twelve months, then it drops to the free plan with a quiet prompt beforehand.",
  },
  {
    title: "Your name on it, quietly",
    copy: "When a couple opens their workspace, they see your venue's name at the top. Their plan stays the thing in focus.",
  },
  {
    title: "Nothing to learn",
    copy: "Plain English throughout. No training, no manual. They open it, and it is clear.",
  },
];

const foundingPerks = [
  {
    title: "A price that holds",
    copy: "€1,500 a year, locked for as long as you stay. Not an introductory rate that climbs. A standing that holds.",
  },
  {
    title: "A short conversation, once",
    copy: "What the planning year looks like from your side, and where it gets noisy. Thirty minutes, once — not a standing meeting.",
  },
  {
    title: "First look at what is next",
    copy: "Founding venues see new work before anyone else, and can say what should change while it still can.",
  },
  {
    title: "The coordinator view, first",
    copy: "The view that shows every couple's workspace at a glance — status, next step, days to event. Founding venues shape what it shows and get it before anyone else.",
  },
];

const mechanicLines = [
  "You pay once a year. Every couple you send gets twelve months of the full suite.",
  "Each couple gets a code. They open a workspace in under a minute.",
  "Your venue's name appears at the top of everything they see.",
  "Nothing for your team to run.",
];

// ── Page ─────────────────────────────────────────────────────────
export default function VenuesPage() {
  return (
    <>
      <ReadingProgress />
      <main id="main" tabIndex={-1} className="flex flex-1 flex-col">

        {/* ── Hero ── */}
        <section className="border-b border-border-soft px-6 pb-16 pt-14 md:pb-20 md:pt-20">
          <div className="mx-auto w-full max-w-[1040px]">
            <p
              className="mb-5 text-[11px] font-semibold uppercase text-ink-quiet"
              style={{ letterSpacing: "var(--tracking-eyebrow)" }}
            >
              Founding Venue Programme
            </p>
            <h1 className="max-w-3xl text-[clamp(2rem,1.4rem+3.2vw,5.4rem)] font-semibold leading-[1.02] tracking-[-0.04em] text-ink">
              Stand behind every couple who plans with you.
            </h1>
            <p className="mt-6 max-w-2xl text-[17px] leading-[1.65] text-ink-soft">
              Signal Studio gives every couple a clear place to plan their
              wedding. The Venue Edition puts your name on it — paid once a
              year, nothing for your team to run.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
              <Link
                href={contactHref}
                className="inline-flex min-h-11 items-center justify-center rounded-full bg-ink px-5 text-[14px] font-medium text-white transition-opacity hover:opacity-90"
              >
                Talk to us about your venue
              </Link>
              <Link
                href={demoHref}
                className="text-[14px] text-ink-soft underline decoration-border-soft underline-offset-[3px] transition-colors hover:text-ink hover:decoration-accent"
              >
                Watch one wedding Tuesday &rarr;
              </Link>
              <a
                href={examplePlanHref}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[14px] text-ink-soft underline decoration-border-soft underline-offset-[3px] transition-colors hover:text-ink hover:decoration-accent"
              >
                See what the couple opens &rarr;
              </a>
            </div>

            {/* Co-branded workspace mock */}
            <div className="mt-12 overflow-hidden rounded-[10px] border border-border-soft bg-bg-elev shadow-2">

              {/* Venue identity bar — the co-branded line */}
              <div className="flex items-center gap-2.5 border-b border-border-soft bg-bg px-4 py-2.5">
                <span
                  aria-hidden
                  className="h-2 w-2 flex-shrink-0 rounded-full"
                  style={{ background: "var(--accent)" }}
                />
                <span className="text-[11px] font-medium text-ink-soft">
                  Glenmara Estate · complimentary access
                </span>
              </div>

              {/* Workspace header */}
              <div className="flex flex-col gap-3 border-b border-border-soft px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-[18px] font-semibold tracking-[-0.025em] text-ink">
                    Aoife &amp; Ciarán
                  </p>
                  <p className="mt-0.5 text-[12px] text-ink-quiet">
                    Wedding planning workspace
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className="rounded-full px-2.5 py-1 text-[11px] font-semibold"
                    style={{ background: "var(--pill-ontrack-bg)", color: "var(--pill-ontrack-ink)" }}
                  >
                    On track
                  </span>
                  <span
                    className="text-[12px] font-medium"
                    style={{ color: "var(--flight)" }}
                  >
                    28 days to event
                  </span>
                </div>
              </div>

              {/* Status body */}
              <div className="grid gap-0 md:grid-cols-[1.35fr_0.65fr]">
                <div className="border-b border-border-soft p-5 md:border-b-0 md:border-r">
                  <p className="mb-2 text-[10px] font-semibold uppercase text-ink-quiet">
                    Current state
                  </p>
                  <p className="text-[26px] font-semibold tracking-[-0.03em] text-ink">
                    On track
                  </p>
                  <p className="mt-3 max-w-sm text-[13px] leading-[1.6] text-ink-soft">
                    Supplier timing confirmed. Guest numbers finalised.
                    Final week walkthrough booked with the venue.
                  </p>
                </div>
                <div className="p-5">
                  <p className="mb-3 text-[10px] font-semibold uppercase text-ink-quiet">
                    Next clear step
                  </p>
                  <p className="text-[14px] font-medium text-ink">
                    Final guest count to catering
                  </p>
                  <p
                    className="mt-1.5 text-[12px] font-medium"
                    style={{ color: "var(--flight)" }}
                  >
                    Due in 3 days
                  </p>
                </div>
              </div>

              {/* Timeline columns */}
              <div className="grid border-t border-border-soft md:grid-cols-3">
                {[
                  ["Now", "Final guest count", "Table plan draft"],
                  ["Next week", "Supplier walkthrough", "Menu confirmation"],
                  ["Final week", "Venue walkthrough", "Seating plan live"],
                ].map(([title, first, second]) => (
                  <div
                    key={title}
                    className="min-h-[140px] border-b border-border-soft p-5 last:border-b-0 md:border-b-0 md:border-r md:last:border-r-0"
                  >
                    <p className="text-[13px] font-semibold text-ink">{title}</p>
                    <div className="mt-4 space-y-3">
                      <MockLine label={first} />
                      <MockLine label={second} muted />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── The mechanic ── */}
        <section className="border-b border-border-soft px-6 py-14 md:py-16">
          <div className="mx-auto grid w-full max-w-[1040px] gap-8 md:grid-cols-[0.85fr_1.15fr] md:gap-16">
            <div>
              <p
                className="mb-3 text-[11px] font-semibold uppercase text-ink-quiet"
                style={{ letterSpacing: "var(--tracking-eyebrow)" }}
              >
                How it works
              </p>
              <h2 className="text-[clamp(1.35rem,1.1rem+1.2vw,2rem)] font-semibold leading-[1.1] tracking-[-0.03em] text-ink">
                Four lines. The whole operation.
              </h2>
            </div>
            <ol className="space-y-5">
              {mechanicLines.map((line, i) => (
                <li key={i} className="grid grid-cols-[auto_1fr] gap-4">
                  <span className="mt-0.5 text-[11px] font-semibold tabular-nums text-ink-quiet">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="text-[16px] leading-[1.6] text-ink-soft">
                    {line}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ── What couples experience ── */}
        <section className="border-b border-border-soft px-6 py-16 md:py-20">
          <div className="mx-auto w-full max-w-[1040px]">
            <div className="mb-10 grid gap-8 md:grid-cols-[0.85fr_1.15fr] md:gap-16">
              <div>
                <p
                  className="mb-3 text-[11px] font-semibold uppercase text-ink-quiet"
                  style={{ letterSpacing: "var(--tracking-eyebrow)" }}
                >
                  What your couples get
                </p>
                <h2 className="text-[clamp(1.35rem,1.1rem+1.2vw,2rem)] font-semibold leading-[1.1] tracking-[-0.03em] text-ink">
                  What your patronage gives them.
                </h2>
              </div>
              <p className="self-end text-[15px] leading-[1.65] text-ink-soft">
                The couple never sees a price. The venue pays so they never
                have to think about it.{" "}
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
            <div className="border-t border-border-soft">
              {coupleExperience.map((item) => (
                <div
                  key={item.title}
                  className="grid gap-2 border-b border-border-soft py-6 md:grid-cols-[0.9fr_1.1fr] md:gap-10"
                >
                  <h3 className="text-[15px] font-medium text-ink">
                    {item.title}
                  </h3>
                  <p className="text-[14px] leading-[1.6] text-ink-soft">
                    {item.copy}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Venue coordinator view — wireframe ── */}
        <section className="border-b border-border-soft bg-bg-deep px-6 py-16 md:py-20">
          <div className="mx-auto w-full max-w-[1040px]">
            <div className="mb-10 grid gap-8 md:grid-cols-[0.85fr_1.15fr] md:gap-16">
              <div>
                <p
                  className="mb-3 text-[11px] font-semibold uppercase text-ink-quiet"
                  style={{ letterSpacing: "var(--tracking-eyebrow)" }}
                >
                  Coming for founding venues
                </p>
                <h2 className="text-[clamp(1.35rem,1.1rem+1.2vw,2rem)] font-semibold leading-[1.1] tracking-[-0.03em] text-ink">
                  See every couple&rsquo;s plan from one place.
                </h2>
              </div>
              <p className="self-end text-[15px] leading-[1.65] text-ink-soft">
                A coordinator view is in development. Founding venues shape
                what it shows, and get it before anyone else.
              </p>
            </div>

            {/* Wireframe mock */}
            <div className="relative overflow-hidden rounded-[10px] border border-dashed border-border-soft">

              {/* Concept badge */}
              <div className="absolute right-4 top-4 z-10">
                <span
                  className="rounded-full border border-border-soft bg-bg px-2.5 py-1 text-[10px] font-semibold uppercase text-ink-quiet"
                  style={{ letterSpacing: "var(--tracking-eyebrow)" }}
                >
                  Concept
                </span>
              </div>

              {/* Header bar */}
              <div className="flex items-center justify-between border-b border-dashed border-border-soft bg-bg px-5 py-3.5 opacity-70">
                <div className="flex items-center gap-2.5">
                  <span
                    aria-hidden
                    className="h-2 w-2 flex-shrink-0 rounded-full"
                    style={{ background: "var(--accent)" }}
                  />
                  <span className="text-[13px] font-semibold text-ink">
                    All workspaces · Glenmara Estate
                  </span>
                </div>
                <span className="hidden text-[12px] text-ink-quiet sm:block">
                  4 couples · 3 active
                </span>
              </div>

              {/* Column headers — desktop only */}
              <div
                className="hidden border-b border-dashed border-border-soft px-5 py-2.5 opacity-60 md:grid"
                style={{
                  gridTemplateColumns: "2fr 1.2fr 1.4fr 1fr",
                }}
              >
                {["Couple", "Event date", "Status", "Last active"].map((h) => (
                  <span
                    key={h}
                    className="text-[10px] font-semibold uppercase text-ink-quiet"
                    style={{ letterSpacing: "var(--tracking-eyebrow)" }}
                  >
                    {h}
                  </span>
                ))}
              </div>

              {/* Rows */}
              <div className="divide-y divide-dashed divide-border-soft opacity-65">
                {coordinatorRows.map((row) => {
                  const s = statusMap[row.status];
                  return (
                    <div
                      key={row.couple}
                      className="grid grid-cols-[1fr_auto] items-center gap-x-4 px-5 py-4 md:grid-cols-[2fr_1.2fr_1.4fr_1fr] md:gap-0"
                    >
                      <span className="text-[14px] font-medium text-ink">
                        {row.couple}
                      </span>
                      <span className="hidden text-[13px] text-ink-soft md:block">
                        {row.date}
                      </span>
                      <span
                        className="inline-flex h-fit items-center rounded-full border border-border-soft px-2.5 py-1 text-[11px] font-semibold"
                        style={{ background: s.bg, color: s.color }}
                      >
                        {s.label}
                      </span>
                      <span className="hidden text-[12px] text-ink-quiet md:block">
                        {row.lastActive}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <p className="mt-4 text-[13px] text-ink-quiet">
              Founding venues shape this view before anyone else sees it.
            </p>
          </div>
        </section>

        {/* ── Pricing ── */}
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
                  number of sites. Every couple gets twelve months of the
                  full suite. No seats. No per-couple maths. The venue pays
                  so the couple never has to think about it.
                </p>
                <p className="mt-5 text-[16px] leading-[1.65] text-ink-soft">
                  The founding cohort — the first fifteen venues — lock
                  €1,500 a year for as long as they stay. Not an
                  introductory rate that climbs. A standing that holds.
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

        {/* ── What founding means ── */}
        <section className="border-b border-border-soft px-6 py-16 md:py-20">
          <div className="mx-auto w-full max-w-[1040px]">
            <p
              className="mb-3 text-[11px] font-semibold uppercase text-ink-quiet"
              style={{ letterSpacing: "var(--tracking-eyebrow)" }}
            >
              What founding means
            </p>
            <h2 className="max-w-3xl text-[clamp(1.5rem,1.2rem+1.5vw,2.25rem)] font-semibold leading-[1.1] tracking-[-0.03em] text-ink">
              You shape it. The price never moves.
            </h2>
            <div className="mt-10 border-t border-border-soft">
              {foundingPerks.map((item) => (
                <div
                  key={item.title}
                  className="grid gap-2 border-b border-border-soft py-6 md:grid-cols-[0.9fr_1.1fr] md:gap-10"
                >
                  <h3 className="text-[15px] font-medium text-ink">
                    {item.title}
                  </h3>
                  <p className="text-[14px] leading-[1.6] text-ink-soft">
                    {item.copy}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── The rhythm ── */}
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
              {[
                {
                  label: "Start.",
                  copy: "Once the year is settled, we send the codes and a short note you can pass to couples. Your coordinator gets one walkthrough, then it runs itself.",
                },
                {
                  label: "A soft window, about two weeks.",
                  copy: "Couples redeem and start planning. We watch quietly and stay out of the way unless you need us.",
                },
                {
                  label: "One short retro.",
                  copy: "A brief conversation about what worked and what did not. No recurring meetings, no reporting.",
                },
              ].map((item, i) => (
                <li key={i} className="grid grid-cols-[auto_1fr] gap-4">
                  <span className="text-[11px] font-semibold tabular-nums text-ink-quiet">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="text-[15px] leading-[1.6] text-ink-soft">
                    <span className="font-medium text-ink">{item.label} </span>
                    {item.copy}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ── Closing CTA ── */}
        <section className="px-6 py-16 md:py-24">
          <div className="mx-auto w-full max-w-[1040px]">
            <h2 className="max-w-3xl text-[clamp(1.5rem,1.2rem+1.5vw,2.25rem)] font-semibold leading-[1.1] tracking-[-0.03em] text-ink">
              We are taking a founding group of fifteen venues.
            </h2>
            <p className="mt-5 max-w-2xl text-[17px] leading-[1.65] text-ink-soft">
              No deck, no demo gate. A short conversation about whether
              this fits, and what your venue would pay.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
              <Link
                href={contactHref}
                className="inline-flex min-h-11 items-center justify-center rounded-full bg-ink px-5 text-[14px] font-medium text-white transition-opacity hover:opacity-90"
              >
                Talk to us about your venue
              </Link>
              <Link
                href={demoHref}
                className="text-[14px] text-ink-soft underline decoration-border-soft underline-offset-[3px] transition-colors hover:text-ink hover:decoration-accent"
              >
                Watch the venue demo &rarr;
              </Link>
              <a
                href={examplePlanHref}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[14px] text-ink-soft underline decoration-border-soft underline-offset-[3px] transition-colors hover:text-ink hover:decoration-accent"
              >
                See what the couple opens first &rarr;
              </a>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

// ── Helper components ────────────────────────────────────────────

function MockLine({
  label,
  muted = false,
}: {
  label: string;
  muted?: boolean;
}) {
  return (
    <div className="flex items-center gap-3">
      <span
        aria-hidden
        className="h-2 w-2 flex-shrink-0 rounded-full"
        style={{ background: muted ? "var(--ink-300)" : "var(--accent)" }}
      />
      <span
        className={
          muted
            ? "text-[13px] text-ink-quiet"
            : "text-[13px] font-medium text-ink"
        }
      >
        {label}
      </span>
    </div>
  );
}

const statusMap: Record<
  CoordinatorStatus,
  { label: string; bg: string; color: string }
> = {
  "on-track": { label: "On track", bg: "var(--pill-ontrack-bg)", color: "var(--pill-ontrack-ink)" },
  "needs-attention": {
    label: "Needs attention",
    bg: "var(--pill-attention-bg)",
    color: "var(--pill-attention-ink)",
  },
  "not-started": {
    label: "Not started",
    bg: "transparent",
    color: "var(--ink-quiet)",
  },
};
