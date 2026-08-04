import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/landing/site-footer";
import { VENUE_SITE_TRACKING, withTracking } from "@/lib/tracking";

export const metadata: Metadata = {
  title: "What comes back to you · Signal Studio",
  description:
    "Signal Studio administers your invitations and sends you the record. What you see, what you never see, how small numbers are held back, and what happens at renewal.",
  openGraph: {
    title: "What comes back to you · Signal Studio",
    description:
      "The trust boundary on the venue's side of the Venue Edition, written out: the record you receive, the figures that are withheld, and the renewal terms.",
    type: "website",
  },
};

/**
 * E12.06 · the Venue Portal trust-and-renewal preview.
 *
 * Read D-032 point 1 before editing a word of this page. Venue identity at
 * launch is Option C: Signal HQ administers invitations on the venue's behalf
 * and the venue receives evidence rather than a login. No venue-authenticated
 * route is built before 1 September, and R-043 verified there is none today.
 * So this page previews what a venue RECEIVES. It must never depict a login,
 * a dashboard the venue reaches, a roster of people, a role picker, or any
 * number that reads as an entitlement ceiling.
 *
 * The launch-scope sentence in the "At launch" block is required verbatim by
 * D-032 R4 and E09.11 section 5.1a. It is not paraphrased and not softened.
 *
 * Suppression is described as the ratified RULE (D-011 point 3, D-032 R12),
 * not as the current code: R-027 and R-028 record that the shipped projector
 * does not yet implement the two-sided floor, and WP-07 owns those fixes.
 *
 * Full trace:
 * docs/execution/venue-edition-and-films/evidence/E12.06-venue-record-preview.md
 */

const contactHref = withTracking("/contact?subject=venue-edition", {
  ...VENUE_SITE_TRACKING,
  artifact: "venue_record_ask",
});

const venueHref = withTracking("/venues", {
  ...VENUE_SITE_TRACKING,
  artifact: "venue_record_back",
});

const couplePreviewHref = withTracking("/venues/couple-preview", {
  ...VENUE_SITE_TRACKING,
  artifact: "venue_record_couple_side",
});

const rhythm = [
  {
    title: "Your codes arrive in one batch",
    copy: "With a short note you can pass to couples. You hand one over as each couple books. When you need more, you email and they arrive.",
  },
  {
    title: "Signal Studio keeps the register",
    copy: "Issuing, reissuing and withdrawing an invitation are done here, by a named person, and every one of them is written down.",
  },
  {
    title: "The record comes back with your name on it",
    copy: "What was issued for your venue, and what was redeemed. Your name at the top, the figures underneath, nothing to log into.",
  },
];

const renewalTerms = [
  {
    term: "The rate",
    detail:
      "€1,000 a year, prepaid, including VAT at the prevailing rate. That is €500 a year less than the standard rate, for as long as you stay.",
  },
  {
    term: "How long it holds",
    detail:
      "The founding rate holds for as long as the agreement renews continuously without lapse. There is no clause that expires it into a higher number.",
  },
  {
    term: "If the venue changes hands",
    detail:
      "It follows the property. It survives a sale, an operator change and a rebrand. It does not travel to other venues a new owner brings.",
  },
  {
    term: "If the agreement ends",
    detail:
      "Any workspace a couple has already opened keeps its full term, and its Keepsake, whatever happens to your agreement. Only new invitations stop.",
  },
];

export default function VenueRecordPreviewPage() {
  return (
    <>
      <main id="main" tabIndex={-1} className="flex flex-1 flex-col">

        {/* ── Hero ── */}
        <section className="border-b border-border-soft px-6 pb-14 pt-14 md:pb-16 md:pt-20">
          <div className="mx-auto w-full max-w-[1040px]">
            <p
              className="mb-5 text-[11px] font-semibold uppercase text-ink-quiet"
              style={{ letterSpacing: "var(--tracking-eyebrow)" }}
            >
              The Founding 25 · your side
            </p>
            <h1 className="max-w-3xl text-[clamp(2rem,1.4rem+3.2vw,5.4rem)] font-semibold leading-[1.02] tracking-[-0.04em] text-ink">
              What comes back to you.
            </h1>
            <p className="mt-6 max-w-2xl text-[17px] leading-[1.65] text-ink-soft">
              You do not log in and there is nothing for your team to run.
              Signal Studio keeps the register on your behalf and sends you the
              record, with your venue&rsquo;s name on it.
            </p>
            <p className="mt-4 max-w-2xl text-[14px] leading-[1.6] text-ink-quiet">
              This page sets out exactly what that record holds, exactly what it
              never holds, and the terms it renews on.
            </p>
          </div>
        </section>

        {/* ── At launch ── */}
        <section className="border-b border-border-soft bg-bg-deep px-6 py-14 md:py-16">
          <div className="mx-auto w-full max-w-[1040px]">
            <p
              className="mb-4 text-[11px] font-semibold uppercase text-ink-quiet"
              style={{ letterSpacing: "var(--tracking-eyebrow)" }}
            >
              At launch
            </p>
            <p className="max-w-3xl text-[clamp(1.25rem,1.05rem+1vw,1.75rem)] font-semibold leading-[1.25] tracking-[-0.025em] text-ink">
              At launch you see your invitations and which couples redeemed them. Adoption
              figures follow later in the year.
            </p>
            <p className="mt-5 max-w-2xl text-[15px] leading-[1.65] text-ink-soft">
              That sentence is on this page because you would otherwise find it
              out on the day, and be right to think nobody told you.
            </p>
          </div>
        </section>

        {/* ── What you see, what you never see ── */}
        <section className="border-b border-border-soft px-6 py-16 md:py-20">
          <div className="mx-auto w-full max-w-[1040px]">
            <p
              className="mb-3 text-[11px] font-semibold uppercase text-ink-quiet"
              style={{ letterSpacing: "var(--tracking-eyebrow)" }}
            >
              The boundary
            </p>
            <h2 className="max-w-3xl text-[clamp(1.5rem,1.2rem+1.5vw,2.25rem)] font-semibold leading-[1.1] tracking-[-0.03em] text-ink">
              Both halves, at the same weight.
            </h2>
            <div className="mt-10 grid gap-6 md:grid-cols-2">
              <div className="rounded-[10px] border border-border-soft bg-bg-elev p-6">
                <p
                  className="mb-4 text-[10px] font-semibold uppercase"
                  style={{
                    letterSpacing: "var(--tracking-eyebrow)",
                    color: "var(--accent)",
                  }}
                >
                  What you see
                </p>
                <p className="text-[15.5px] leading-[1.65] text-ink">
                  Which invitations you sent, and which couples redeemed them.
                  Adoption figures across your couples as a group. Small numbers
                  are held back so a figure can never point at one couple.
                </p>
              </div>
              <div className="rounded-[10px] border border-border-soft bg-bg-elev p-6">
                <p
                  className="mb-4 text-[10px] font-semibold uppercase text-ink-quiet"
                  style={{ letterSpacing: "var(--tracking-eyebrow)" }}
                >
                  What you never see
                </p>
                <p className="text-[15.5px] leading-[1.65] text-ink">
                  What any couple is planning. There is no per-couple row, no
                  ranking and no list of who is behind. If a couple changes their
                  wedding date, that does not appear anywhere. A postponement is
                  their news to share.
                </p>
              </div>
            </div>
            <p className="mt-6 max-w-2xl text-[14px] leading-[1.6] text-ink-quiet">
              Three things and no fourth: the invitations you sent, the evidence
              that a couple redeemed one, and adoption figures across the group.
              Nothing else about a couple reaches you through us.
            </p>
          </div>
        </section>

        {/* ── Suppression ── */}
        <section className="border-b border-border-soft px-6 py-16 md:py-20">
          <div className="mx-auto grid w-full max-w-[1040px] gap-8 md:grid-cols-[0.85fr_1.15fr] md:gap-16">
            <div>
              <p
                className="mb-3 text-[11px] font-semibold uppercase text-ink-quiet"
                style={{ letterSpacing: "var(--tracking-eyebrow)" }}
              >
                Why a figure goes missing
              </p>
              <h2 className="text-[clamp(1.35rem,1.1rem+1.2vw,2rem)] font-semibold leading-[1.1] tracking-[-0.03em] text-ink">
                A small number is a name.
              </h2>
            </div>
            <div className="space-y-5">
              <p className="text-[16px] leading-[1.65] text-ink-soft">
                You know exactly which couples you invited. So a figure of one,
                among forty, is a statement about one couple you could name. The
                other end is no better: thirty-nine out of forty identifies the
                one who did not.
              </p>
              <div className="rounded-[10px] border border-border-soft bg-bg-elev p-6">
                <p className="text-[15px] leading-[1.65] text-ink">
                  A count is withheld below a floor of three. A rate is withheld
                  below a floor of five. Withheld means the figure is not shown
                  and not implied, so you cannot work it back out.
                </p>
              </div>
              <p className="text-[16px] leading-[1.65] text-ink-soft">
                Two figures are not subject to that floor, because they are the
                record of your agreement rather than a measure of anybody: how
                many invitations were issued for your venue, and how many were
                opened. Those are exact at any size.
              </p>
              <p className="text-[14px] leading-[1.6] text-ink-quiet">
                This costs you resolution in your first weeks, when the numbers
                are smallest. That is the trade, and it is the right way round.
              </p>
            </div>
          </div>
        </section>

        {/* ── The rhythm ── */}
        <section className="border-b border-border-soft bg-bg-deep px-6 py-16 md:py-20">
          <div className="mx-auto w-full max-w-[1040px]">
            <p
              className="mb-3 text-[11px] font-semibold uppercase text-ink-quiet"
              style={{ letterSpacing: "var(--tracking-eyebrow)" }}
            >
              How it reaches you
            </p>
            <h2 className="max-w-3xl text-[clamp(1.5rem,1.2rem+1.5vw,2.25rem)] font-semibold leading-[1.1] tracking-[-0.03em] text-ink">
              Nothing to log into. That is deliberate.
            </h2>
            <p className="mt-5 max-w-2xl text-[15px] leading-[1.65] text-ink-soft">
              A venue was sold a standard of care for its couples, not a piece
              of software to administer. So the administration stays here, with
              a named person doing it, and what reaches you is the evidence.
            </p>
            <div className="mt-10 border-t border-border-soft">
              {rhythm.map((item, i) => (
                <div
                  key={item.title}
                  className="grid gap-2 border-b border-border-soft py-6 md:grid-cols-[auto_0.8fr_1.1fr] md:gap-8"
                >
                  <span className="text-[11px] font-semibold tabular-nums text-ink-quiet md:pt-1">
                    {String(i + 1).padStart(2, "0")}
                  </span>
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

        {/* ── Renewal ── */}
        <section className="border-b border-border-soft px-6 py-16 md:py-20">
          <div className="mx-auto w-full max-w-[1040px]">
            <p
              className="mb-3 text-[11px] font-semibold uppercase text-ink-quiet"
              style={{ letterSpacing: "var(--tracking-eyebrow)" }}
            >
              Renewal
            </p>
            <h2 className="max-w-3xl text-[clamp(1.5rem,1.2rem+1.5vw,2.25rem)] font-semibold leading-[1.1] tracking-[-0.03em] text-ink">
              What the second year costs, and what happens if there is not one.
            </h2>
            <div className="mt-10 border-t border-border-soft">
              {renewalTerms.map((item) => (
                <div
                  key={item.term}
                  className="grid gap-2 border-b border-border-soft py-6 md:grid-cols-[0.7fr_1.3fr] md:gap-10"
                >
                  <h3 className="text-[15px] font-medium text-ink">
                    {item.term}
                  </h3>
                  <p className="text-[15px] leading-[1.6] text-ink-soft">
                    {item.detail}
                  </p>
                </div>
              ))}
            </div>
            <p className="mt-8 max-w-2xl text-[15px] leading-[1.65] text-ink-soft">
              When a couple&rsquo;s planning term ends, their workspace stays
              open in Keepsake mode. Read-only, for as long as the service
              exists, with a one-click export they own, free.
            </p>
          </div>
        </section>

        {/* ── Not built yet ── */}
        <section className="border-b border-border-soft px-6 py-14 md:py-16">
          <div className="mx-auto w-full max-w-[1040px]">
            <p
              className="mb-3 text-[11px] font-semibold uppercase text-ink-quiet"
              style={{ letterSpacing: "var(--tracking-eyebrow)" }}
            >
              Not built yet
            </p>
            <h2 className="max-w-3xl text-[clamp(1.35rem,1.1rem+1.2vw,2rem)] font-semibold leading-[1.1] tracking-[-0.03em] text-ink">
              Three things this page is not showing you.
            </h2>
            <ol className="mt-8 max-w-2xl space-y-5">
              {[
                "A venue login. There is no venue account, no password of yours and no venue screen. Signal Studio administers your invitations and sends you the record. Nothing on this page describes a login, because there is not one.",
                "The adoption figures. The record you receive at launch covers your invitations and which were opened. The figures across your couples as a group follow later in the year.",
                "The Keepsake screen. The promise above is what is being bought and it is in the agreement. The screen a couple opens to see it is not written yet.",
              ].map((line, i) => (
                <li key={i} className="grid grid-cols-[auto_1fr] gap-4">
                  <span className="mt-0.5 text-[11px] font-semibold tabular-nums text-ink-quiet">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="text-[15px] leading-[1.6] text-ink-soft">
                    {line}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ── Closing ── */}
        <section className="px-6 py-16 md:py-24">
          <div className="mx-auto w-full max-w-[1040px]">
            <h2 className="max-w-3xl text-[clamp(1.5rem,1.2rem+1.5vw,2.25rem)] font-semibold leading-[1.1] tracking-[-0.03em] text-ink">
              If you want a figure this record does not carry, ask before you
              sign.
            </h2>
            <p className="mt-5 max-w-2xl text-[17px] leading-[1.65] text-ink-soft">
              Some of them are held back on purpose and will not be added. It is
              better that you know which, now. Your place is held for fourteen
              days.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
              <Link
                href={contactHref}
                className="inline-flex min-h-11 items-center justify-center rounded-full bg-ink px-5 text-[14px] font-medium text-white transition-opacity hover:opacity-90"
              >
                Ask me a question
              </Link>
              <Link
                href={couplePreviewHref}
                className="text-[14px] text-ink-soft underline decoration-border-soft underline-offset-[3px] transition-colors hover:text-ink hover:decoration-accent"
              >
                See the couple&rsquo;s side &rarr;
              </Link>
              <Link
                href={venueHref}
                className="text-[14px] text-ink-soft underline decoration-border-soft underline-offset-[3px] transition-colors hover:text-ink hover:decoration-accent"
              >
                Back to the Venue Edition &rarr;
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
