import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/landing/site-footer";
import { VENUE_SITE_TRACKING, withTracking } from "@/lib/tracking";

export const metadata: Metadata = {
  title: "What your venue sees · Signal Studio",
  description:
    "The whole list of what a venue can see about a couple’s planning, and the longer list of what it never sees. At launch you see your invitations and who opened them.",
  openGraph: {
    title: "What your venue sees · Signal Studio",
    description:
      "What a venue sees: its invitations and who opened them. What it never sees: the plan itself. The venue’s name is the only venue thing on a couple’s workspace.",
    type: "website",
  },
};

/**
 * E12.07 · the privacy explanation for the Venue Edition.
 *
 * Every claim on this page is written against a shipped read path or a ratified
 * decision, not against an idealised model:
 *
 *   src/lib/account/live/project-venue-access.ts   what the venue record holds
 *   src/lib/account/instrumentation/suppression.ts  the thresholds, as a rule
 *   src/lib/venue-lifecycle.ts                      invitation and sponsorship states
 *
 * Three things are deliberately NOT said here, and each omission is load-bearing:
 *   1. No published or shared surface is given a security or narrowness
 *      adjective of any kind. E09.11 §6.4 point 3 names the four phrases this
 *      rules out. `/p` is deliberately indexable (R-031, undecided), so the one
 *      permitted sentence is the findability one in `sharingLines` below.
 *   2. No artifact is described as existing when it does not. E03.04 and E03.05
 *      are both backlog, so the DPA, security schedule and couple privacy notice
 *      are described as being written, never as available.
 *   3. No fourth venue-visible thing, and no consent layer. D-001 point 4 fixes
 *      the list at three; D-027 point 4 leaves the consent mechanism unwired.
 */

const venueHref = withTracking("/venues", {
  ...VENUE_SITE_TRACKING,
  artifact: "venue_page",
  touch: "venue_privacy",
});

const questionsHref = withTracking("/venues/questions", {
  ...VENUE_SITE_TRACKING,
  artifact: "venue_questions",
  touch: "venue_privacy",
});

/**
 * E12.14. This page closed on "If something here is not clear, ask." and then
 * offered two links, both of which were navigation to another Venue Edition
 * page. There was no way to ask. A page whose closing heading names an action
 * it does not provide is a conversion defect twice over: the venue that is
 * convinced has nothing to click, and the one sentence on the page that
 * invites contact is the one sentence the page cannot honour.
 *
 * Same destination and the same `subject` as `/venues/couple-preview` and
 * `/venues/what-you-see`, so the four secondary commercial pages hand a venue
 * the same next step rather than three different ones.
 */
const contactHref = withTracking("/contact?subject=venue-edition", {
  ...VENUE_SITE_TRACKING,
  artifact: "venue_privacy_ask",
  touch: "venue_privacy",
});

// ── The reusable venue-facing privacy block (E09.11 §5.1, verbatim) ────────
// All three parts travel together. A surface that takes this block takes the
// launch-scope part with it (D-032 R4).
const privacyBlock = [
  {
    title: "What you see",
    copy: "Which invitations you sent, and which couples opened them. Adoption figures across your couples as a group. Small numbers are held back so a figure can never point at one couple.",
  },
  {
    title: "What you never see",
    copy: "What any couple is planning. There is no per-couple row, no ranking and no list of who is behind. If a couple changes their wedding date, that does not appear anywhere. A postponement is their news to share.",
  },
  {
    title: "At launch",
    copy: "At launch you see your invitations and who opened them. Adoption figures follow later in the year.",
  },
];

// ── The three permitted things (D-001 point 4, E09.10 §1.4) ────────────────
const threeThings = [
  {
    label: "Invitation administration",
    copy: "The invitations you sent, and the state each one is in: sent, opened, redeemed, expired or withdrawn. The dates that go with each state. Your own term start and end.",
  },
  {
    label: "Activation evidence",
    copy: "How many invitations you issued, and how many were redeemed. Two numbers, taken from the ledger, exact.",
  },
  {
    label: "Aggregate adoption evidence",
    copy: "Figures across your couples as a group, once they exist. They are not there at launch, and this page does not pretend otherwise.",
  },
];

// ── The negative half (D-001.4, D-011.1, E09.11 §6.1, project-venue-access) ─
const neverVisible = [
  {
    title: "Any planning content",
    copy: "Notes, tasks, an unpublished Timeline, the morning briefing, comments, attachments. None of it reaches your record and none of it appears in any report.",
  },
  {
    title: "A per-couple row",
    copy: "There is no ranking and no list of who is behind. Aggregate is the product rather than a presentation choice.",
  },
  {
    title: "A wedding date change",
    copy: "A postponement is the couple’s news to share, not a line on a screen. It is not surfaced anywhere, to anyone.",
  },
  {
    title: "Who a couple shares their plan with",
    copy: "A couple sharing their plan is the couple’s own act. You are not a party to it and there is no view of it.",
  },
  {
    title: "A couple’s email address or account identifier",
    copy: "Your record holds neither. It holds your invitations, their states, their dates, and your term.",
  },
  {
    title: "A full invitation code, once it is in your record",
    copy: "Codes are masked there. The plain code exists where it has to and nowhere it does not.",
  },
];

// ── Suppression, stated as the ratified rule (D-011.3) ─────────────────────
const suppressionRules = [
  "A count of behaviour is held back unless at least three sponsored workspaces are eligible in the window.",
  "A percentage is held back unless at least five are.",
  "A held-back figure is never shown as a zero. Zero is a claim that nothing happened, which is a different sentence.",
];

// ── Sharing and publishing (E09.11 §6.3, §6.4 points 2 and 3) ──────────────
const sharingLines = [
  "A couple can share their plan with their family, their suppliers or their own planner. You do not see who they shared it with, and you do not see what is in it. If a couple wants you to have something, they send it to you the same way they send it to anyone else.",
  "There is no setting on our side that opens a couple’s workspace to a venue, and there is no request you can make that does it either.",
  "When a couple publishes their plan, the whole plan goes. Titles and tags are visible. Descriptions are not.",
  "A published page can be found by anyone with the address, including a search engine.",
  "So a published plan is a public page. We do not describe it as anything narrower than that, and nobody at your venue should either.",
];

// ── The venue’s name (D-027.3, D-011.2, D-020.3) ───────────────────────────
const nameLines = [
  {
    title: "On the couple’s workspace",
    copy: "Your name. One quiet line at the top. Not a logo, not a colour, and not a message you write. Your name, said once.",
  },
  {
    title: "On a page a couple publishes for guests",
    copy: "One line in the footer. No logo, no badge, nothing in the viewport. A wedding page that reads as marketing has stopped being the thing that was worth buying.",
  },
  {
    title: "If a couple cancels or moves venue",
    copy: "The sponsorship is released. The couple keeps everything they wrote, and your name comes off within twenty-four hours.",
  },
];

// ── What is not claimed (D-016, P3, P15) ───────────────────────────────────
const refusals = [
  "There is no GDPR certificate to hold, so no honest supplier claims one.",
  "The data processing agreement, the security schedule and the couple’s privacy notice are being written now. You get all of them before you sign. We would rather show you a finished document than describe one.",
  "No solicitor has reviewed these documents and no accountant has verified the financial position. Nothing here will imply otherwise.",
  "Where each supplier holds what it holds belongs in the security schedule, and that is not finished. Until it is, this page makes no claim about regions or transfers, and neither does anyone on a call.",
];

export default function VenuePrivacyPage() {
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
              Venue Edition · privacy
            </p>
            <h1 className="max-w-3xl text-[clamp(2rem,1.4rem+2.6vw,4rem)] font-semibold leading-[1.04] tracking-[-0.04em] text-ink">
              What you see, and what you never see.
            </h1>
            <p className="mt-6 max-w-2xl text-[17px] leading-[1.65] text-ink-soft">
              Every claim about what a venue can see carries what it cannot, in
              the same place, at the same weight. That is the product rather
              than a caveat on it. This page is both halves.
            </p>
          </div>
        </section>

        {/* ── The block ── */}
        <section className="border-b border-border-soft bg-bg-deep px-6 py-14 md:py-16">
          <div className="mx-auto grid w-full max-w-[1040px] gap-8 md:grid-cols-3 md:gap-10">
            {privacyBlock.map((item) => (
              <div key={item.title} className="flex flex-col gap-3">
                <h2 className="text-[15px] font-semibold text-ink">
                  {item.title}
                </h2>
                <p className="text-[14px] leading-[1.65] text-ink-soft">
                  {item.copy}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Three things ── */}
        <section className="border-b border-border-soft px-6 py-16 md:py-20">
          <div className="mx-auto w-full max-w-[1040px]">
            <div className="mb-10 grid gap-8 md:grid-cols-[0.85fr_1.15fr] md:gap-16">
              <div>
                <p
                  className="mb-3 text-[11px] font-semibold uppercase text-ink-quiet"
                  style={{ letterSpacing: "var(--tracking-eyebrow)" }}
                >
                  The permitted list
                </p>
                <h2 className="text-[clamp(1.35rem,1.1rem+1.2vw,2rem)] font-semibold leading-[1.1] tracking-[-0.03em] text-ink">
                  Three things. There is no fourth.
                </h2>
              </div>
              <p className="self-end text-[15px] leading-[1.65] text-ink-soft">
                The list of what a venue can be shown is fixed at three. It is
                not a starting point and it does not grow with the
                relationship. At launch Signal Studio administers your
                invitations and sends you the record, so there is no login for
                your team to keep and no dashboard to learn.
              </p>
            </div>
            <div className="border-t border-border-soft">
              {threeThings.map((item, i) => (
                <div
                  key={item.label}
                  className="grid gap-2 border-b border-border-soft py-6 md:grid-cols-[auto_0.8fr_1.1fr] md:gap-8"
                >
                  <span className="text-[11px] font-semibold tabular-nums text-ink-quiet md:pt-1">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="text-[15px] font-medium text-ink">
                    {item.label}
                  </h3>
                  <p className="text-[14px] leading-[1.6] text-ink-soft">
                    {item.copy}
                  </p>
                </div>
              ))}
            </div>
            <p className="mt-6 max-w-2xl text-[14px] leading-[1.65] text-ink-quiet">
              If a fourth thing ever appears in front of you, that is a defect.
              Tell us and it comes out.
            </p>
          </div>
        </section>

        {/* ── What opened means ── */}
        <section className="border-b border-border-soft px-6 py-14 md:py-16">
          <div className="mx-auto grid w-full max-w-[1040px] gap-8 md:grid-cols-[0.85fr_1.15fr] md:gap-16">
            <div>
              <p
                className="mb-3 text-[11px] font-semibold uppercase text-ink-quiet"
                style={{ letterSpacing: "var(--tracking-eyebrow)" }}
              >
                One word, defined
              </p>
              <h2 className="text-[clamp(1.35rem,1.1rem+1.2vw,2rem)] font-semibold leading-[1.1] tracking-[-0.03em] text-ink">
                What “opened” means.
              </h2>
            </div>
            <div className="space-y-4 self-end">
              <p className="text-[15px] leading-[1.65] text-ink-soft">
                Opened means the couple loaded the page their invitation points
                at, and nothing else. It is explicitly not an email open.
              </p>
              <p className="text-[15px] leading-[1.65] text-ink-soft">
                Cold outreach from Signal Studio carries no open pixel either.
                That was decided rather than left to chance: open tracking on an
                email to people you want a trust relationship with is a bad
                trade.
              </p>
            </div>
          </div>
        </section>

        {/* ── Never visible ── */}
        <section className="border-b border-border-soft px-6 py-16 md:py-20">
          <div className="mx-auto w-full max-w-[1040px]">
            <p
              className="mb-3 text-[11px] font-semibold uppercase text-ink-quiet"
              style={{ letterSpacing: "var(--tracking-eyebrow)" }}
            >
              The negative half
            </p>
            <h2 className="max-w-3xl text-[clamp(1.5rem,1.2rem+1.5vw,2.25rem)] font-semibold leading-[1.1] tracking-[-0.03em] text-ink">
              What never reaches you, in full.
            </h2>
            <div className="mt-10 grid gap-x-12 gap-y-8 md:grid-cols-2">
              {neverVisible.map((item) => (
                <div key={item.title} className="flex flex-col gap-2">
                  <h3 className="text-[15px] font-medium text-ink">
                    {item.title}
                  </h3>
                  <p className="text-[14px] leading-[1.6] text-ink-soft">
                    {item.copy}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-10 border-t border-border-soft pt-7">
              <p className="max-w-2xl text-[15px] leading-[1.65] text-ink-soft">
                One thing worth saying plainly, because it cuts the other way.
                You know which couple you sent each invitation to, so when an
                invitation is redeemed you can work out who redeemed it. Signal
                Studio cannot. We never learn which couples hold a booking with
                you, and no figure we publish is ever labelled with your
                couples. The denominator is invitations redeemed, and it stays
                that way for exactly this reason.
              </p>
            </div>
          </div>
        </section>

        {/* ── Suppression ── */}
        <section className="border-b border-border-soft bg-bg-deep px-6 py-16 md:py-20">
          <div className="mx-auto w-full max-w-[1040px]">
            <div className="mb-10 grid gap-8 md:grid-cols-[0.85fr_1.15fr] md:gap-16">
              <div>
                <p
                  className="mb-3 text-[11px] font-semibold uppercase text-ink-quiet"
                  style={{ letterSpacing: "var(--tracking-eyebrow)" }}
                >
                  Small numbers
                </p>
                <h2 className="text-[clamp(1.35rem,1.1rem+1.2vw,2rem)] font-semibold leading-[1.1] tracking-[-0.03em] text-ink">
                  A figure that points at one couple is not published.
                </h2>
              </div>
              <p className="self-end text-[15px] leading-[1.65] text-ink-soft">
                Adoption figures do not exist yet. When they arrive, this is
                the rule they arrive under, and it is a rule about the figure
                rather than a setting on a screen.
              </p>
            </div>
            <ol className="max-w-3xl space-y-5">
              {suppressionRules.map((rule, i) => (
                <li key={i} className="grid grid-cols-[auto_1fr] gap-4">
                  <span className="mt-0.5 text-[11px] font-semibold tabular-nums text-ink-quiet">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="text-[15px] leading-[1.6] text-ink-soft">
                    {rule}
                  </p>
                </li>
              ))}
            </ol>
            <p className="mt-8 max-w-3xl text-[15px] leading-[1.65] text-ink-soft">
              Your invitation and redemption counts are a different kind of
              number and they are treated differently. They are the record of
              what you were given under the agreement, so they are exact at any
              size and they are never held back.
            </p>
            <p className="mt-5 max-w-2xl text-[14px] leading-[1.65] text-ink-quiet">
              Three and five are constants in the code that produces the
              figures. They are not per-account settings, and there is no
              version of this that a venue, a coordinator or Signal Studio
              turns off for one account.
            </p>
          </div>
        </section>

        {/* ── Sharing ── */}
        <section className="border-b border-border-soft px-6 py-16 md:py-20">
          <div className="mx-auto w-full max-w-[1040px]">
            <p
              className="mb-3 text-[11px] font-semibold uppercase text-ink-quiet"
              style={{ letterSpacing: "var(--tracking-eyebrow)" }}
            >
              Sharing and publishing
            </p>
            <h2 className="max-w-3xl text-[clamp(1.5rem,1.2rem+1.5vw,2.25rem)] font-semibold leading-[1.1] tracking-[-0.03em] text-ink">
              When a couple shares their plan, it is the couple’s act.
            </h2>
            <div className="mt-9 max-w-3xl space-y-5">
              {sharingLines.map((line, i) => (
                <p
                  key={i}
                  className="text-[15px] leading-[1.65] text-ink-soft"
                >
                  {line}
                </p>
              ))}
            </div>
          </div>
        </section>

        {/* ── The venue name ── */}
        <section className="border-b border-border-soft px-6 py-16 md:py-20">
          <div className="mx-auto w-full max-w-[1040px]">
            <p
              className="mb-3 text-[11px] font-semibold uppercase text-ink-quiet"
              style={{ letterSpacing: "var(--tracking-eyebrow)" }}
            >
              Your name
            </p>
            <h2 className="max-w-3xl text-[clamp(1.5rem,1.2rem+1.5vw,2.25rem)] font-semibold leading-[1.1] tracking-[-0.03em] text-ink">
              The venue name, and nothing beside it.
            </h2>
            <div className="mt-10 border-t border-border-soft">
              {nameLines.map((item) => (
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

        {/* ── Refusals ── */}
        <section className="border-b border-border-soft px-6 py-16 md:py-20">
          <div className="mx-auto w-full max-w-[1040px]">
            <p
              className="mb-3 text-[11px] font-semibold uppercase text-ink-quiet"
              style={{ letterSpacing: "var(--tracking-eyebrow)" }}
            >
              What is not claimed
            </p>
            <h2 className="max-w-3xl text-[clamp(1.5rem,1.2rem+1.5vw,2.25rem)] font-semibold leading-[1.1] tracking-[-0.03em] text-ink">
              The things a supplier is tempted to say, and does not.
            </h2>
            <div className="mt-9 max-w-3xl space-y-5">
              {refusals.map((line, i) => (
                <p key={i} className="text-[15px] leading-[1.65] text-ink-soft">
                  {line}
                </p>
              ))}
            </div>
            <p className="mt-8 text-[14px] leading-[1.65] text-ink-quiet">
              The full answers to the questions venues ask about data
              protection and legal review are on the{" "}
              <Link
                href={questionsHref}
                className="text-ink underline decoration-border-soft underline-offset-[3px] transition-colors hover:decoration-accent"
              >
                questions page
              </Link>
              .
            </p>
          </div>
        </section>

        {/* ── Closing ── */}
        <section className="px-6 py-16 md:py-20">
          <div className="mx-auto w-full max-w-[1040px]">
            <h2 className="max-w-3xl text-[clamp(1.35rem,1.1rem+1.2vw,2rem)] font-semibold leading-[1.1] tracking-[-0.03em] text-ink">
              If something here is not clear, ask.
            </h2>
            <p className="mt-5 max-w-2xl text-[16px] leading-[1.65] text-ink-soft">
              If you ask something this page does not cover, the answer is that
              we do not know yet, and we would rather find out and tell you
              than guess.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
              <Link
                href={contactHref}
                className="inline-flex min-h-11 items-center justify-center rounded-full bg-ink px-5 text-[14px] font-medium text-white transition-opacity hover:opacity-90"
              >
                Ask me a question
              </Link>
              <Link
                href={questionsHref}
                className="text-[14px] text-ink-soft underline decoration-border-soft underline-offset-[3px] transition-colors hover:text-ink hover:decoration-accent"
              >
                Read the questions venues ask &rarr;
              </Link>
              <Link
                href={venueHref}
                className="text-[14px] text-ink-soft underline decoration-border-soft underline-offset-[3px] transition-colors hover:text-ink hover:decoration-accent"
              >
                The Founding 25 &rarr;
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
