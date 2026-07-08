import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/landing/site-footer";
import { TIMELINE_URL } from "@/lib/product-urls";
import { VENUE_SITE_TRACKING, withTracking } from "@/lib/tracking";

export const metadata: Metadata = {
  title: "Venue Edition Demo · Signal Studio",
  description:
    "One wedding Tuesday, shown across Signal Notes, Tasks, Timeline, and Signal. A venue-facing demo for the paid Venue Edition.",
  openGraph: {
    title: "Venue Edition Demo · Signal Studio",
    description:
      "A venue-facing product walkthrough: the meeting note, the owned work, the couple plan, and the morning briefing.",
    type: "website",
  },
};

const venueWaitlistHref = withTracking("/waitlist?useCase=venues", {
  ...VENUE_SITE_TRACKING,
  artifact: "venue_demo_waitlist",
  touch: "venue_demo",
});

const venueHref = withTracking("/venues", {
  ...VENUE_SITE_TRACKING,
  artifact: "venue_page",
});

const couplePlanRawHref = `${TIMELINE_URL.replace(/\/$/, "")}/the-wedding`;
const couplePlanHref = withTracking(couplePlanRawHref, {
  ...VENUE_SITE_TRACKING,
  artifact: "couple_plan",
});

function waitlistHref(product: string, artifact: string): string {
  return withTracking(`/waitlist?useCase=venues&product=${product}`, {
    ...VENUE_SITE_TRACKING,
    artifact,
    touch: "venue_demo",
  });
}

const demoSteps = [
  {
    time: "0:00",
    product: "Signal Notes",
    role: "Capture",
    title: "The venue call is captured before it becomes work.",
    copy:
      "Sarah and Tom's venue meeting becomes one private note: decisions, open questions, and the next supplier follow-ups in plain sentences. Nothing is shared until it is ready.",
    href: waitlistHref("notes", "venue_demo_notes"),
    cta: "Join Notes waitlist",
    venueEyebrow: "Founding Venue Preview · Sarah and Tom · June 2027",
    label: "Private note",
    lines: [
      "Florist can do the ceremony arch.",
      "Table runners need a second supplier or a simpler plan.",
      "Tom prefers the simpler table arrangement.",
      "Ask venue about supplier access for the morning.",
    ],
  },
  {
    time: "0:18",
    product: "Signal Tasks",
    role: "Work",
    title: "The right pieces become owned follow-ups.",
    copy:
      "The workspace already has the shape: venue, suppliers, guests, decisions, and final week. The couple starts with real work, not setup.",
    href: waitlistHref("tasks", "venue_demo_tasks"),
    cta: "Join Tasks waitlist",
    venueEyebrow: "Founding Venue Preview · wedding workspace",
    label: "Wedding workspace",
    lines: [
      "Confirm florist arrangement - Sarah - due Friday",
      "Send guest list to caterer - Tom - waiting on update",
      "Schedule menu tasting - venue - due next week",
      "Pay venue deposit second instalment - couple",
    ],
  },
  {
    time: "0:38",
    product: "Signal Timeline",
    role: "Plan",
    title: "The couple gets one readable plan.",
    copy:
      "The plan says what is done, what is underway, what is waiting on the couple, and what comes next. No account for people who only need to read.",
    href: couplePlanHref,
    cta: "Preview plan",
    venueEyebrow: "Public plan · no account needed",
    label: "Couple plan",
    lines: [
      "Venue booked - complete",
      "Guest list first draft - in progress",
      "Florist confirmed - waiting on table decision",
      "Final headcount - due four weeks out",
    ],
  },
  {
    time: "0:52",
    product: "Signal",
    role: "Attention",
    title: "The next morning is a short briefing, not a dashboard.",
    copy:
      "The briefing names the few things that need attention before they become another thread in the coordinator inbox.",
    href: waitlistHref("signal", "venue_demo_signal"),
    cta: "Join Signal waitlist",
    venueEyebrow: "Morning briefing · three things, not thirty",
    label: "Morning briefing",
    lines: [
      "Menu tasting is in four days and catering confirmation is still pending.",
      "Guest count changed twice this week; florist numbers may be out of date.",
      "Ceremony music has not moved since Tuesday.",
      "Nothing else needs attention today.",
    ],
  },
] as const;

export default function VenueDemoPage() {
  return (
    <>
      <main id="main" tabIndex={-1} className="flex flex-1 flex-col">
        <section className="border-b border-border-soft px-6 pb-16 pt-14 md:pb-20 md:pt-20">
          <div className="mx-auto w-full max-w-[1040px]">
            <p
              className="mb-5 text-[11px] font-semibold uppercase text-ink-quiet"
              style={{ letterSpacing: "var(--tracking-eyebrow)" }}
            >
              Venue Edition demo
            </p>
            <h1 className="max-w-4xl text-[clamp(2rem,1.4rem+3.2vw,5.4rem)] font-semibold leading-[1.02] tracking-[-0.04em] text-ink">
              One wedding planning year, made readable.
            </h1>
            <p className="mt-6 max-w-2xl text-[17px] leading-[1.65] text-ink-soft">
              This is the concrete version of what a venue pays for: one
              meeting becomes owned work, one readable plan, and a short
              briefing before the inbox gets noisy.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
              <Link
                href={venueWaitlistHref}
                className="inline-flex min-h-11 items-center justify-center rounded-full bg-ink px-5 text-[14px] font-medium text-white transition-opacity hover:opacity-90"
              >
                Join the venue waitlist
              </Link>
              <a
                href={couplePlanHref}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[14px] text-ink-soft underline decoration-border-soft underline-offset-[3px] transition-colors hover:text-ink hover:decoration-accent"
              >
                See what the couple opens &rarr;
              </a>
              <Link
                href={venueHref}
                className="text-[14px] text-ink-soft underline decoration-border-soft underline-offset-[3px] transition-colors hover:text-ink hover:decoration-accent"
              >
                Read the Venue Edition &rarr;
              </Link>
            </div>
          </div>
        </section>

        <section className="px-6 py-16 md:py-20">
          <div className="mx-auto grid w-full max-w-[1040px] gap-8 lg:grid-cols-[0.78fr_1.22fr] lg:gap-14">
            <div>
              <p
                className="mb-3 text-[11px] font-semibold uppercase text-ink-quiet"
                style={{ letterSpacing: "var(--tracking-eyebrow)" }}
              >
                The walkthrough
              </p>
              <h2 className="text-[32px] font-semibold leading-[1.08] tracking-[-0.035em] text-ink">
                Four product moments. One planning year made calmer.
              </h2>
              <p className="mt-5 text-[15px] leading-[1.65] text-ink-soft">
                The venue does not operate these layers. The venue backs the
                couple, hands over a code, and the workspace carries the work
                from there.
              </p>
              <div className="mt-8 overflow-hidden rounded-[8px] border border-border-soft bg-bg-elev">
                <div className="border-b border-border-soft px-5 py-4">
                  <p className="text-[11px] font-semibold uppercase text-ink-quiet">
                    Venue mechanic
                  </p>
                </div>
                <ol className="divide-y divide-border-soft">
                  {[
                    "Venue pays once a year.",
                    "Each couple gets a code.",
                    "When access opens, the wedding workspace has one clear first step.",
                    "The couple never sees a price.",
                  ].map((line, i) => (
                    <li key={line} className="grid grid-cols-[auto_1fr] gap-3 px-5 py-4">
                      <span className="font-mono text-[11px] text-ink-quiet">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="text-[14px] leading-[1.55] text-ink-soft">
                        {line}
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            <div className="venue-demo-stack relative">
              <div className="absolute left-[18px] top-4 hidden h-[calc(100%-2rem)] w-px bg-border-soft md:block" />
              {demoSteps.map((step, index) => (
                <article
                  key={step.product}
                  className="venue-demo-card relative mb-4 rounded-[8px] border border-border-soft bg-bg-elev p-5 shadow-2 last:mb-0 md:ml-10 md:p-6"
                  style={{ animationDelay: `${index * 120}ms` }}
                >
                  <span
                    aria-hidden
                    className="absolute -left-[31px] top-6 hidden h-3.5 w-3.5 rounded-full border-2 border-bg md:block"
                    style={{ background: "var(--accent)" }}
                  />
                  <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-[12px] text-ink-quiet">
                        {step.time}
                      </span>
                      <span className="rounded-full border border-border-soft px-2.5 py-1 text-[11px] font-semibold uppercase text-ink-quiet">
                        {step.role}
                      </span>
                    </div>
                    <a
                      href={step.href}
                      className="text-[12px] font-medium text-ink-quiet underline decoration-border-soft underline-offset-[3px] transition-colors hover:text-ink hover:decoration-accent"
                    >
                      {step.cta} &rarr;
                    </a>
                  </div>
                  <h3 className="text-[22px] font-semibold leading-[1.15] tracking-[-0.025em] text-ink">
                    {step.title}
                  </h3>
                  <p className="mt-3 max-w-2xl text-[14px] leading-[1.65] text-ink-soft">
                    {step.copy}
                  </p>
                  <div className="mt-5 overflow-hidden rounded-[8px] border border-border-soft bg-bg">
                    <div className="flex items-center justify-between border-b border-border-soft px-4 py-3">
                      <div>
                        <p className="text-[11px] font-semibold uppercase text-ink-quiet">
                          {step.label}
                        </p>
                        <p className="mt-1 text-[11.5px] text-ink-faint">
                          {step.venueEyebrow}
                        </p>
                      </div>
                      <span className="venue-demo-pulse" aria-hidden />
                    </div>
                    <ul className="space-y-2 px-4 py-4 font-mono text-[12.5px] leading-[1.6] text-ink-soft">
                      {step.lines.map((line) => (
                        <li key={line} className="venue-demo-line">
                          {line}
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-border-soft bg-bg-deep px-6 py-16">
          <div className="mx-auto grid w-full max-w-[1040px] gap-6 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <p
                className="mb-3 text-[11px] font-semibold uppercase text-ink-quiet"
                style={{ letterSpacing: "var(--tracking-eyebrow)" }}
              >
                The ask
              </p>
              <h2 className="max-w-2xl text-[32px] font-semibold leading-[1.08] tracking-[-0.035em] text-ink">
                A venue conversation, not a checkout.
              </h2>
              <p className="mt-4 max-w-2xl text-[15px] leading-[1.65] text-ink-soft">
                The Venue Edition is priced like patronage because the buyer is
                choosing a standard of care for every couple it books.
              </p>
            </div>
            <Link
              href={venueWaitlistHref}
              className="inline-flex min-h-11 items-center justify-center rounded-full bg-ink px-5 text-[14px] font-medium text-white transition-opacity hover:opacity-90"
            >
              Join the venue waitlist
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
      <style>{`
        @media (prefers-reduced-motion: no-preference) {
          .venue-demo-card {
            opacity: 0;
            transform: translateY(16px);
            animation: venue-demo-rise 620ms cubic-bezier(.16,1,.3,1) forwards;
          }

          .venue-demo-line {
            animation: venue-demo-fade 2200ms ease-in-out infinite;
          }

          .venue-demo-line:nth-child(2) { animation-delay: 180ms; }
          .venue-demo-line:nth-child(3) { animation-delay: 360ms; }
          .venue-demo-line:nth-child(4) { animation-delay: 540ms; }

          .venue-demo-pulse {
            display: inline-block;
            width: 7px;
            height: 7px;
            border-radius: 999px;
            background: var(--accent);
            box-shadow: 0 0 0 0 color-mix(in srgb, var(--accent) 30%, transparent);
            animation: venue-demo-pulse 1800ms ease-out infinite;
          }
        }

        @keyframes venue-demo-rise {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes venue-demo-fade {
          0%, 100% { opacity: .62; }
          40%, 70% { opacity: 1; }
        }

        @keyframes venue-demo-pulse {
          70% {
            box-shadow: 0 0 0 9px color-mix(in srgb, var(--accent) 0%, transparent);
          }
          100% {
            box-shadow: 0 0 0 0 color-mix(in srgb, var(--accent) 0%, transparent);
          }
        }
      `}</style>
    </>
  );
}
