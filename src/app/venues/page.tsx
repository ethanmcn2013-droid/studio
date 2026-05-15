import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/landing/site-footer";

export const metadata: Metadata = {
  title: "Founding Venue Programme - Signal Studio",
  description:
    "Give every couple a clear planning workspace, on you. Founding venues sponsor 12 months of Signal Studio per couple, co-branded, with nothing to install.",
  openGraph: {
    title: "Founding Venue Programme - Signal Studio",
    description:
      "Sponsored wedding planning workspaces for your couples — 12 months free each, co-branded, no software for your team to run.",
    type: "website",
  },
};

const trackingSuffix =
  "source=studio_venues&segment=weddings&role=venue&campaign=founding_venue";

/**
 * Founding Venue Programme offer page. Venue-facing — distinct from
 * /weddings (the couple-facing wedge). Content is the canonical offer
 * from content/hq/campaigns/founding-venue.md + pilots/founding-venue-
 * pilot.md: what couples get, what founding status means, what we ask,
 * and the feedback rhythm. No fabricated product screenshot (DESIGN.md
 * §8) — a hairline "what's included" panel does the work a fake hero
 * mock would, in the suite's restrained register.
 */

const included = [
  {
    title: "A planning workspace for every couple",
    copy: "Notes, decisions, tasks, and a plan anyone can forward — one clear place instead of a spreadsheet and a thread.",
  },
  {
    title: "Twelve months, on the venue",
    copy: "Each couple's workspace is sponsored for a full year. It drops to the free plan at month twelve, with a quiet prompt beforehand. No card, no trial countdown.",
  },
  {
    title: "Your name on it, quietly",
    copy: "A co-branded line at the top of the workspace. An eyebrow, not a logo wall. The couple's plan stays the thing in focus.",
  },
  {
    title: "Nothing for your team to run",
    copy: "No install, no admin panel, no training. You hand a couple a code; they open a workspace. That is the whole operation on your side.",
  },
];

const asks = [
  {
    title: "A short conversation with your coordinator",
    copy: "What the planning year actually looks like from your side, and where it gets noisy. Thirty minutes, once.",
  },
  {
    title: "A line of feedback from a couple or two",
    copy: "Only the couples who want to. What helped, what got in the way. Plain words, not a survey.",
  },
  {
    title: "Permission to point to the work — if it is good",
    copy: "If the pilot earns it, we would like to describe it as a short case study. You see it before anyone else, and you can say no.",
  },
];

export default function VenuesPage() {
  return (
    <>
      <main className="flex flex-1 flex-col">
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
              Give every couple a plan they can read.
            </h1>
            <p className="mt-6 max-w-2xl text-[17px] leading-[1.65] text-ink-soft">
              A founding venue sponsors a clear planning workspace for every
              couple it works with — twelve months each, co-branded, with
              nothing for the venue team to install or manage.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
              <Link
                href="/contact?subject=founding-venue-programme"
                className="inline-flex min-h-11 items-center justify-center rounded-full bg-ink px-5 text-[14px] font-medium text-white transition-opacity hover:opacity-90"
              >
                Talk to us about your venue
              </Link>
              <Link
                href={`/weddings?${trackingSuffix}`}
                className="text-[14px] text-ink-soft underline decoration-border-soft underline-offset-[3px] transition-colors hover:text-ink hover:decoration-accent"
              >
                See what the couple gets &rarr;
              </Link>
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
              The gift is clarity, not another tool to learn.
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
          </div>
        </section>

        {/* What we ask */}
        <section className="border-b border-border-soft px-6 py-16 md:py-20">
          <div className="mx-auto w-full max-w-[1040px]">
            <p
              className="mb-3 text-[11px] font-semibold uppercase text-ink-quiet"
              style={{ letterSpacing: "var(--tracking-eyebrow)" }}
            >
              What we ask of you
            </p>
            <h2 className="max-w-3xl text-[clamp(1.5rem,1.2rem+1.5vw,2.25rem)] font-semibold leading-[1.1] tracking-[-0.03em] text-ink">
              Three small things, and only if it is working.
            </h2>
            <div className="mt-10 border-t border-border-soft">
              {asks.map((item) => (
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
                  <span className="font-medium text-ink">Start.</span> We send
                  the codes and a short note you can pass to couples. Your
                  coordinator gets one walkthrough, then it runs itself.
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
              We are taking a small first group of venues.
            </h2>
            <p className="mt-5 max-w-2xl text-[17px] leading-[1.65] text-ink-soft">
              If your venue runs real wedding coordination and you want your
              couples to plan with less noise, start a conversation. No deck, no
              demo gate — just a short talk about whether this fits.
            </p>
            <div className="mt-8">
              <Link
                href="/contact?subject=founding-venue-programme"
                className="inline-flex min-h-11 items-center justify-center rounded-full bg-ink px-5 text-[14px] font-medium text-white transition-opacity hover:opacity-90"
              >
                Talk to us about your venue
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
