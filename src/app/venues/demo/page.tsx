import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/landing/site-footer";
import { ROADMAP_URL, TASKS_URL, NOTES_URL, ANALYTICS_URL } from "@/lib/product-urls";
import { VENUE_SITE_TRACKING, withTracking } from "@/lib/tracking";

export const metadata: Metadata = {
  title: "Venue Edition Demo - Signal Studio",
  description:
    "One wedding Tuesday, shown across Signal Notes, Tasks, Roadmap, and Analytics. A venue-facing demo for the paid Venue Edition.",
  openGraph: {
    title: "Venue Edition Demo - Signal Studio",
    description:
      "A 60-second venue-facing demo: venue call, tasks, public plan, and morning briefing.",
    type: "website",
  },
};

const beats = [
  {
    time: "0:00",
    title: "The venue call",
    product: "Signal Notes",
    copy: "The planner captures the open questions, supplier names, deposits, and the date the couple needs held.",
    href: NOTES_URL,
  },
  {
    time: "0:18",
    title: "The work becomes visible",
    product: "Signal Tasks",
    copy: "Three notes become tasks. Florist quote. Marquee decision. Save-the-dates. No project setup before the work begins.",
    href: `${TASKS_URL}/templates/wedding-planning-workspace`,
  },
  {
    time: "0:38",
    title: "The couple gets one link",
    product: "Signal Roadmap",
    copy: "The public plan shows what changed, what is waiting, and what happens next. No login for the people who only need to read.",
    href: `${ROADMAP_URL}/the-wedding`,
  },
  {
    time: "0:52",
    title: "The next morning",
    product: "Signal Analytics",
    copy: "The briefing names the few things that need attention before they become a problem.",
    href: ANALYTICS_URL,
  },
];

const contactHref = withTracking("/contact?subject=founding-venue", {
  ...VENUE_SITE_TRACKING,
  artifact: "venue_demo_contact",
});

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
              Venue Edition · demo route
            </p>
            <h1 className="max-w-4xl text-[clamp(2rem,1.4rem+3.2vw,5.4rem)] font-semibold leading-[1.02] tracking-[-0.04em] text-ink">
              One wedding Tuesday, end to end.
            </h1>
            <p className="mt-6 max-w-2xl text-[17px] leading-[1.65] text-ink-soft">
              The 60-second version of what a venue is paying for: a couple
              gets a clearer planning year, and the coordinator gets fewer
              repetitive questions in the inbox.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
              <Link
                href={contactHref}
                className="inline-flex min-h-11 items-center justify-center rounded-full bg-ink px-5 text-[14px] font-medium text-white transition-opacity hover:opacity-90"
              >
                Start a venue conversation
              </Link>
              <Link
                href="/venues"
                className="text-[14px] text-ink-soft underline decoration-border-soft underline-offset-[3px] transition-colors hover:text-ink hover:decoration-accent"
              >
                Read the Venue Edition <span aria-hidden>→</span>
              </Link>
            </div>
          </div>
        </section>

        <section className="px-6 py-16 md:py-20">
          <div className="mx-auto w-full max-w-[1040px]">
            <div className="overflow-hidden rounded-[8px] border border-border-soft bg-bg-elev">
              <div className="grid border-b border-border-soft md:grid-cols-[1fr_auto]">
                <div className="p-5 md:p-7">
                  <p className="text-[11px] font-semibold uppercase text-ink-quiet">
                    Founder video script
                  </p>
                  <h2 className="mt-2 text-[28px] font-semibold leading-[1.1] tracking-[-0.03em] text-ink">
                    Show the actual workspace. No abstract montage.
                  </h2>
                </div>
                <div className="border-t border-border-soft p-5 md:border-l md:border-t-0 md:p-7">
                  <p className="font-mono text-[12px] text-ink-quiet">
                    Target length · 60 seconds
                  </p>
                </div>
              </div>
              <div className="divide-y divide-border-soft">
                {beats.map((beat) => (
                  <a
                    key={beat.time}
                    href={withTracking(beat.href, {
                      ...VENUE_SITE_TRACKING,
                      artifact: `venue_demo_${beat.product.toLowerCase().replaceAll(" ", "_")}`,
                    })}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="grid gap-4 p-5 transition-colors hover:bg-bg-deep md:grid-cols-[80px_0.8fr_1.2fr] md:p-7"
                  >
                    <span className="font-mono text-[12px] text-ink-quiet">
                      {beat.time}
                    </span>
                    <div>
                      <p className="text-[15px] font-semibold text-ink">
                        {beat.title}
                      </p>
                      <p className="mt-1 text-[12px] text-ink-quiet">
                        {beat.product}
                      </p>
                    </div>
                    <p className="max-w-2xl text-[14px] leading-[1.65] text-ink-soft">
                      {beat.copy}
                    </p>
                  </a>
                ))}
              </div>
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
              href={contactHref}
              className="inline-flex min-h-11 items-center justify-center rounded-full bg-ink px-5 text-[14px] font-medium text-white transition-opacity hover:opacity-90"
            >
              Start the conversation
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
