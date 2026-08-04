import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/landing/site-footer";
import { VENUE_SITE_TRACKING, withTracking } from "@/lib/tracking";

export const metadata: Metadata = {
  title: "What your couples see · Signal Studio",
  description:
    "The Venue Edition puts your venue's name in four places on the couple's side, and nowhere else. The words themselves, not a picture of a screen.",
  openGraph: {
    title: "What your couples see · Signal Studio",
    description:
      "Four places where a couple meets the venue name, written out. No logo, no colours, nothing depicted that is not built.",
    type: "website",
  },
};

/**
 * E12.05 · the branded couple-experience preview.
 *
 * Audience: a venue in a founding conversation who wants to know what its
 * name actually does on the couple's side before paying for a year.
 *
 * The hard rule this page is built against: a preview may only show what is
 * built (D-016). Every moment below was read out of the running source before
 * it was written down, and the trace is in
 * docs/execution/venue-edition-and-films/evidence/E12.05-couple-experience-preview.md.
 *
 * No screenshot, per DESIGN.md section 8 and because E05.12 has not locked the
 * interface yet. This page renders the words, which are stable, rather than a
 * picture of a screen, which is not.
 *
 * Venue branding is the venue's NAME ONLY (D-027 point 3, R-024). Glenmara
 * House is fictional and is the copy system's standing example venue
 * (E09.11 sections 5.3 and 6.3).
 */

const EXAMPLE_VENUE = "Glenmara House";

const contactHref = withTracking("/contact?subject=venue-edition", {
  ...VENUE_SITE_TRACKING,
  artifact: "couple_preview_ask",
});

const venueHref = withTracking("/venues", {
  ...VENUE_SITE_TRACKING,
  artifact: "couple_preview_back",
});

// ── The four moments, each verified against source ───────────────
const nameMoments: Array<{
  where: string;
  when: string;
  words: string;
  note: string;
}> = [
  {
    where: "The code page",
    when: "The first page a couple opens, before they have an account.",
    words: `${EXAMPLE_VENUE} is sponsoring your access to Signal Studio.`,
    note: "Your name is the first line on the page, set above the headline, and it is the headline as well.",
  },
  {
    where: "Setting up the account",
    when: "The sign-up step, once the code has been recognised.",
    words: EXAMPLE_VENUE,
    note: "Your name sits above the form while the couple creates their account, with the code they were given printed underneath it.",
  },
  {
    where: "The workspace, first open",
    when: "Once, the first time the couple reaches their wedding workspace.",
    words: `Compliments of ${EXAMPLE_VENUE}`,
    note: "One card, shown once. The couple can close it and it does not come back. It is not a banner that follows them around.",
  },
  {
    where: "The plan record",
    when: "In the couple's own plan settings, for as long as they have the workspace.",
    words: EXAMPLE_VENUE,
    note: "Recorded as who covered their access, beside the date their term ends. This is the one place your name stays.",
  },
];

const neverDoes = [
  {
    title: "It is your name, not your mark",
    copy: "No logo, no colours, no typeface of yours. The venue name is the whole of the branding, and that is a decision rather than a gap.",
  },
  {
    title: "You do not write into the couple's workspace",
    copy: "There is no venue message field and no place for words of yours. Nothing you type reaches the couple through us.",
  },
  {
    title: "Your name is not on what the couple publishes",
    copy: "If a couple shares their plan with family or suppliers, nothing on that page names you. Attribution on a published page is decided but not built.",
  },
  {
    title: "It is never a price tag",
    copy: "The couple never sees a figure, a card form or a trial. There is nothing for them to cancel and nothing for them to decline.",
  },
];

export default function CouplePreviewPage() {
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
              The Founding 25 · the couple&rsquo;s side
            </p>
            <h1 className="max-w-3xl text-[clamp(2rem,1.4rem+3.2vw,5.4rem)] font-semibold leading-[1.02] tracking-[-0.04em] text-ink">
              Your name, where the couple actually meets it.
            </h1>
            <p className="mt-6 max-w-2xl text-[17px] leading-[1.65] text-ink-soft">
              Four places, and nowhere else. This page sets out the words
              themselves rather than a picture of a screen, so nothing on it
              can show you something the product does not do.
            </p>
            <p className="mt-4 max-w-2xl text-[14px] leading-[1.6] text-ink-quiet">
              {EXAMPLE_VENUE} is a made-up venue, used here so the lines read
              the way they will read. Your own name goes in the same four
              places.
            </p>
          </div>
        </section>

        {/* ── The four moments ── */}
        <section className="border-b border-border-soft px-6 py-16 md:py-20">
          <div className="mx-auto w-full max-w-[1040px]">
            <div className="mb-10 grid gap-8 md:grid-cols-[0.85fr_1.15fr] md:gap-16">
              <div>
                <p
                  className="mb-3 text-[11px] font-semibold uppercase text-ink-quiet"
                  style={{ letterSpacing: "var(--tracking-eyebrow)" }}
                >
                  Where your name appears
                </p>
                <h2 className="text-[clamp(1.35rem,1.1rem+1.2vw,2rem)] font-semibold leading-[1.1] tracking-[-0.03em] text-ink">
                  Four moments, in the order a couple meets them.
                </h2>
              </div>
              <p className="self-end text-[15px] leading-[1.65] text-ink-soft">
                Each line below is the line that is written today. Where the
                product copy around it is still being settled before the copy
                freeze, it is described rather than quoted, so this page never
                sells you a sentence that is about to change.
              </p>
            </div>

            <ol className="grid gap-4 md:grid-cols-2">
              {nameMoments.map((moment, i) => (
                <li
                  key={moment.where}
                  className="flex flex-col overflow-hidden rounded-[10px] border border-border-soft bg-bg-elev"
                >
                  <div className="flex items-baseline gap-3 border-b border-border-soft px-5 py-3.5">
                    <span className="text-[11px] font-semibold tabular-nums text-ink-quiet">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-[14px] font-medium text-ink">
                      {moment.where}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col gap-4 px-5 py-5">
                    <p className="text-[13px] leading-[1.6] text-ink-quiet">
                      {moment.when}
                    </p>
                    <div className="rounded-[8px] border border-border-soft bg-bg px-4 py-4">
                      <p
                        className="mb-2 text-[10px] font-semibold uppercase text-ink-faint"
                        style={{ letterSpacing: "var(--tracking-eyebrow)" }}
                      >
                        What the couple reads
                      </p>
                      <p className="text-[15px] leading-[1.5] text-ink">
                        {moment.words}
                      </p>
                    </div>
                    <p className="text-[13.5px] leading-[1.6] text-ink-soft">
                      {moment.note}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ── What the name never does ── */}
        <section className="border-b border-border-soft bg-bg-deep px-6 py-16 md:py-20">
          <div className="mx-auto w-full max-w-[1040px]">
            <p
              className="mb-3 text-[11px] font-semibold uppercase text-ink-quiet"
              style={{ letterSpacing: "var(--tracking-eyebrow)" }}
            >
              The limits, stated
            </p>
            <h2 className="max-w-3xl text-[clamp(1.5rem,1.2rem+1.5vw,2.25rem)] font-semibold leading-[1.1] tracking-[-0.03em] text-ink">
              What your name does not do.
            </h2>
            <p className="mt-5 max-w-2xl text-[15px] leading-[1.65] text-ink-soft">
              These are limits by decision, not by omission. A couple planning
              their wedding is not an advertising surface, and the restraint is
              what makes the one line worth having.
            </p>
            <div className="mt-10 border-t border-border-soft">
              {neverDoes.map((item) => (
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

        {/* ── What the couple gets ── */}
        <section className="border-b border-border-soft px-6 py-16 md:py-20">
          <div className="mx-auto grid w-full max-w-[1040px] gap-8 md:grid-cols-[0.85fr_1.15fr] md:gap-16">
            <div>
              <p
                className="mb-3 text-[11px] font-semibold uppercase text-ink-quiet"
                style={{ letterSpacing: "var(--tracking-eyebrow)" }}
              >
                What they get
              </p>
              <h2 className="text-[clamp(1.35rem,1.1rem+1.2vw,2rem)] font-semibold leading-[1.1] tracking-[-0.03em] text-ink">
                A private place to plan, for every couple who books with you.
              </h2>
            </div>
            <div className="space-y-5">
              <p className="text-[16px] leading-[1.65] text-ink-soft">
                Every couple who books their wedding with you gets a workspace,
                for as long as your licence is current. Notes, the actual work,
                a plan they can share with family and suppliers, and a short
                note in the morning when something needs attention.
              </p>
              <p className="text-[16px] leading-[1.65] text-ink-soft">
                Each couple keeps it for eighteen months from the day they open
                it, or three months past the wedding, whichever is later. A long
                engagement never runs out before the day.
              </p>
              <p className="text-[16px] leading-[1.65] text-ink-soft">
                Any workspace a couple has already opened keeps its full term,
                and its Keepsake, whatever happens to your agreement. Only new
                invitations stop.
              </p>
            </div>
          </div>
        </section>

        {/* ── The boundary ── */}
        <section className="border-b border-border-soft px-6 py-16 md:py-20">
          <div className="mx-auto w-full max-w-[1040px]">
            <p
              className="mb-3 text-[11px] font-semibold uppercase text-ink-quiet"
              style={{ letterSpacing: "var(--tracking-eyebrow)" }}
            >
              The boundary
            </p>
            <h2 className="max-w-3xl text-[clamp(1.5rem,1.2rem+1.5vw,2.25rem)] font-semibold leading-[1.1] tracking-[-0.03em] text-ink">
              What the couple is told about you.
            </h2>

            <div className="mt-10 grid gap-6 md:grid-cols-2">
              <div className="rounded-[10px] border border-border-soft bg-bg-elev p-6">
                <p
                  className="mb-4 text-[10px] font-semibold uppercase text-ink-faint"
                  style={{ letterSpacing: "var(--tracking-eyebrow)" }}
                >
                  In their words, in the product
                </p>
                <p className="text-[16px] leading-[1.6] text-ink">
                  This is yours. {EXAMPLE_VENUE} can see that you opened it.
                  They cannot see what is in it.
                </p>
                <p className="mt-5 text-[14px] leading-[1.6] text-ink-quiet">
                  And when they share it:
                </p>
                <p className="mt-2 text-[16px] leading-[1.6] text-ink">
                  Share this with anyone you like. They can read it without an
                  account. {EXAMPLE_VENUE} does not see who you share this
                  with.
                </p>
              </div>
              <div className="rounded-[10px] border border-border-soft bg-bg-elev p-6">
                <p
                  className="mb-4 text-[10px] font-semibold uppercase text-ink-faint"
                  style={{ letterSpacing: "var(--tracking-eyebrow)" }}
                >
                  The same boundary, from your side
                </p>
                <p className="text-[15px] leading-[1.6] text-ink-soft">
                  A couple can share their plan with their family, their
                  suppliers or their own planner. You do not see who they shared
                  it with, and you do not see what is in it. If a couple wants
                  you to have something, they send it to you the same way they
                  send it to anyone else.
                </p>
              </div>
            </div>

            <p className="mt-6 max-w-2xl text-[15px] leading-[1.65] text-ink-soft">
              At launch you see your invitations and who opened them. Adoption
              figures follow later in the year.
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
                "Keepsake. When a couple's planning term ends their workspace becomes read-only and stays open, for as long as the service exists, with a one-click export they own. That is what is being bought. The screen that shows it is not written yet.",
                "Product imagery. Nothing here is a screenshot. The interface is locked on 20 August and the real pictures follow it, because a picture taken before then would be out of date before you saw it.",
                "A page a couple publishes does not carry your name. That attribution is decided and it is not built, so this page does not count it as something you are getting.",
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
              If something here reads wrong, say so.
            </h2>
            <p className="mt-5 max-w-2xl text-[17px] leading-[1.65] text-ink-soft">
              The couple&rsquo;s side is the part a venue is actually putting
              its name to, so it is the part worth arguing about. Your place is
              held for fourteen days.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
              <Link
                href={contactHref}
                className="inline-flex min-h-11 items-center justify-center rounded-full bg-ink px-5 text-[14px] font-medium text-white transition-opacity hover:opacity-90"
              >
                Ask me a question
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
