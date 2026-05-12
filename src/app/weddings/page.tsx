import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/landing/site-footer";
import { ROADMAP_URL, TASKS_URL } from "@/lib/product-urls";

export const metadata: Metadata = {
  title: "Wedding Planning Workspaces - Signal Studio",
  description:
    "Plain-language planning workspaces for venues, planners, couples, and suppliers who need the work behind a wedding to stay clear.",
  openGraph: {
    title: "Wedding Planning Workspaces - Signal Studio",
    description:
      "A clear workspace for notes, decisions, tasks, timelines, and updates behind a wedding.",
    type: "website",
  },
};

const trackingSuffix = "source=studio_weddings&segment=weddings&role=creator&campaign=founding_venue";

/**
 * Days-to-event for the hero mock. Static — the demo represents a
 * planner four weeks out, which is the moment the wedge most clearly
 * earns its keep (date held, decisions made, final-week work pending).
 * Replacing the abstract "Planning Roadmap - 2026-05-14" stamp with
 * calendar proximity is the 80% audience's actual mental model.
 */
const daysToEvent = 28;
const sharedUpdateHref = `${ROADMAP_URL.replace(/\/$/, "")}/wedding-planning/update?${trackingSuffix}&artefact=landing_page`;
const templateHref = `${TASKS_URL.replace(/\/$/, "")}/templates/wedding-planning-workspace?${trackingSuffix}&artefact=template`;
const notesDemoHref = `https://notes.signalstudio.ie/wedding-planning/?${trackingSuffix}&artefact=notes_demo`;
const analyticsDemoHref = `https://analytics.signalstudio.ie/wedding-planning/?${trackingSuffix}&artefact=analytics_demo`;

const clarityItems = [
  {
    title: "What is happening now",
    copy: "Guest numbers, catering notes, supplier timings, room setup, and final-week work stay visible in one place.",
  },
  {
    title: "What is held up",
    copy: "The workspace names the follow-up, the person, and the next decision without turning it into planning jargon.",
  },
  {
    title: "What changed",
    copy: "Couples, venues, planners, and suppliers can see the latest agreement before old messages create confusion.",
  },
  {
    title: "What happens next",
    copy: "The plan becomes a clear update people can forward, not another spreadsheet that needs explaining.",
  },
];

const ecosystemSteps = [
  {
    product: "Signal Notes",
    role: "Context",
    copy: "Capture the venue meeting, open questions, and decisions.",
    href: notesDemoHref,
    cta: "Open the venue meeting demo",
  },
  {
    product: "Signal Tasks",
    role: "Execution",
    copy: "Turn follow-ups into owned work with dates and blockers.",
    href: templateHref,
    cta: "Open the workspace template",
  },
  {
    product: "Signal Roadmap",
    role: "Direction",
    copy: "Show the planning timeline and what changed.",
    href: sharedUpdateHref,
    cta: "Open the shared update",
  },
  {
    product: "Signal Analytics",
    role: "Attention",
    copy: "Surface the few things that need attention before they become problems.",
    href: analyticsDemoHref,
    cta: "Open the daily briefing",
  },
];

export default function WeddingsPage() {
  return (
    <>
      <main className="flex flex-1 flex-col">
        <section className="border-b border-border-soft px-6 pb-16 pt-14 md:pb-20 md:pt-20">
          <div className="mx-auto w-full max-w-[1040px]">
            <p
              className="mb-5 text-[11px] font-semibold uppercase"
              style={{
                color: "#be185d",
                letterSpacing: "var(--tracking-eyebrow)",
              }}
            >
              Weddings and events
            </p>
            <h1 className="max-w-4xl text-[clamp(2.5rem,1.7rem+3.8vw,5.4rem)] font-semibold leading-[0.98] tracking-[-0.045em] text-ink">
              Wedding planning workspaces for venues, planners, and couples.
            </h1>
            <p className="mt-6 max-w-2xl text-[17px] leading-[1.65] text-ink-soft">
              Signal Studio keeps the work behind a wedding clear: notes,
              decisions, tasks, timelines, and plain-language updates without
              spreadsheet chaos.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={sharedUpdateHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center justify-center rounded-full bg-ink px-5 text-[14px] font-medium text-white transition-opacity hover:opacity-90"
              >
                View the shared update
              </a>
              <Link
                href="/contact?subject=weddings"
                className="inline-flex min-h-11 items-center justify-center rounded-full border border-border px-5 text-[14px] font-medium text-ink-soft transition-colors hover:border-ink-quiet hover:text-ink"
              >
                Ask about the pilot
              </Link>
              <a
                href={templateHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center justify-center rounded-full border border-border px-5 text-[14px] font-medium text-ink-soft transition-colors hover:border-ink-quiet hover:text-ink"
              >
                Use the template
              </a>
            </div>

            <div className="mt-12 overflow-hidden rounded-[8px] border border-border-soft bg-bg-elev shadow-2">
              <div className="flex items-center justify-between border-b border-border-soft px-4 py-3">
                <div className="flex items-center gap-2">
                  <span
                    aria-hidden
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ background: "#be185d" }}
                  />
                  <span className="text-[13px] font-semibold text-ink">
                    Harbour House wedding
                  </span>
                </div>
                <span className="text-[11px] text-ink-quiet">Shared update</span>
              </div>

              <div className="grid gap-0 md:grid-cols-[1.35fr_0.65fr]">
                <div className="border-b border-border-soft p-5 md:border-b-0 md:border-r">
                  <p className="mb-2 text-[10px] font-semibold uppercase text-ink-quiet">
                    Current state
                  </p>
                  <h2 className="text-[30px] font-semibold tracking-[-0.035em] text-ink">
                    Needs attention
                  </h2>
                  <p className="mt-3 max-w-xl text-[14px] leading-[1.6] text-ink-soft">
                    Supplier arrival times need confirmation before the final
                    week moves cleanly again.
                  </p>
                </div>
                <div className="p-5">
                  <p className="mb-3 text-[10px] font-semibold uppercase text-ink-quiet">
                    Next clear step
                  </p>
                  <p className="text-[14px] font-medium text-ink">
                    Confirm final guest numbers
                  </p>
                  <p
                    className="mt-1 text-[12px] font-medium"
                    style={{ color: "var(--status-flight, #f59e0b)" }}
                  >
                    {daysToEvent} days to event
                  </p>
                </div>
              </div>

              <div className="grid border-t border-border-soft md:grid-cols-3">
                {[
                  ["Now", "Confirm guest numbers", "Menu notes to catering"],
                  ["Needs attention", "Supplier arrival times", "Dietary notes"],
                  ["Next", "Final-week walkthrough", "Weather backup plan"],
                ].map(([title, first, second]) => (
                  <div
                    key={title}
                    className="min-h-[150px] border-b border-border-soft p-5 last:border-b-0 md:border-b-0 md:border-r md:last:border-r-0"
                  >
                    <p className="text-[14px] font-semibold text-ink">{title}</p>
                    <div className="mt-5 space-y-4">
                      <PreviewLine label={first} />
                      <PreviewLine label={second} muted />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="px-6 py-16">
          <div className="mx-auto grid w-full max-w-[1040px] gap-8 lg:grid-cols-[0.75fr_1fr]">
            <div>
              <p className="mb-3 text-[11px] font-semibold uppercase text-ink-quiet">
                Why this fits weddings
              </p>
              <h2 className="text-[32px] font-semibold leading-[1.08] tracking-[-0.035em] text-ink">
                Everyone needs the plan. Not everyone needs planning software.
              </h2>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {clarityItems.map((item) => (
                <section
                  key={item.title}
                  className="rounded-[8px] border border-border-soft bg-bg-elev p-5"
                >
                  <h3 className="text-[15px] font-semibold text-ink">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-[13.5px] leading-[1.6] text-ink-soft">
                    {item.copy}
                  </p>
                </section>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-border-soft bg-bg-deep px-6 py-16">
          <div className="mx-auto w-full max-w-[1040px]">
            <div className="mb-8 max-w-2xl">
              <p className="mb-3 text-[11px] font-semibold uppercase text-ink-quiet">
                One workspace, four layers
              </p>
              <h2 className="text-[32px] font-semibold leading-[1.08] tracking-[-0.035em] text-ink">
                The collaboration loop is the product.
              </h2>
            </div>
            <div className="grid gap-3 md:grid-cols-4">
              {ecosystemSteps.map((step) => (
                <a
                  key={step.product}
                  href={step.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col rounded-[8px] border border-border-soft bg-bg p-5 transition-colors hover:border-ink-quiet"
                >
                  <p className="text-[11px] font-semibold uppercase text-ink-quiet">
                    {step.role}
                  </p>
                  <h3 className="mt-2 text-[15px] font-semibold text-ink">
                    {step.product}
                  </h3>
                  <p className="mt-4 text-[13.5px] leading-[1.6] text-ink-soft">
                    {step.copy}
                  </p>
                  <p className="mt-4 text-[12px] font-medium text-ink-quiet group-hover:text-ink">
                    {step.cta} <span aria-hidden>↗</span>
                  </p>
                </a>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href={templateHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center justify-center rounded-full bg-ink px-5 text-[14px] font-medium text-white transition-opacity hover:opacity-90"
              >
                Start from the wedding workspace
              </a>
              <p className="text-[13px] leading-[1.6] text-ink-quiet">
                The first template covers venue, supplier, guest, decision,
                and final-week work.
              </p>
            </div>
          </div>
        </section>

        <section className="px-6 py-16">
          <div className="mx-auto grid w-full max-w-[1040px] gap-8 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <p className="mb-3 text-[11px] font-semibold uppercase text-ink-quiet">
                Founding venue pilot
              </p>
              <h2 className="max-w-2xl text-[32px] font-semibold leading-[1.08] tracking-[-0.035em] text-ink">
                Give couples a clear planning workspace and help shape the
                product.
              </h2>
              <p className="mt-5 max-w-2xl text-[15px] leading-[1.65] text-ink-soft">
                Early venues and planners can use private wedding planning
                workspaces during beta in exchange for practical feedback from
                the people coordinating the day.
              </p>
            </div>
            <Link
              href="/contact?subject=founding-venue"
              className="inline-flex min-h-11 items-center justify-center rounded-full bg-ink px-5 text-[14px] font-medium text-white transition-opacity hover:opacity-90"
            >
              Start a pilot conversation
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

function PreviewLine({
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
        className="h-2 w-2 rounded-full"
        style={{ background: muted ? "var(--ink-300)" : "#be185d" }}
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
