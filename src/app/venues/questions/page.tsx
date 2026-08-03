import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/landing/site-footer";
import { VENUE_SITE_TRACKING, withTracking } from "@/lib/tracking";

export const metadata: Metadata = {
  title: "Questions venues ask · Signal Studio",
  description:
    "What your couples get, how long they have it, what it costs including VAT, what you see, what happens after the wedding, and the two questions with uncomfortable answers.",
  openGraph: {
    title: "Questions venues ask · Signal Studio",
    description:
      "The Venue Edition, answered plainly. Price including VAT, the couple’s term, what a venue sees, and the venue’s name as the only venue thing on a couple’s workspace.",
    type: "website",
  },
};

/**
 * E12.08 · the Venue Edition FAQ.
 *
 * The twelve answers are `E09.11-copy-system.md` §10.2, the FAQ of record
 * ratified by D-032 R3, reproduced verbatim with two departures, both recorded
 * in `evidence/E12.08-venue-faq.md`:
 *
 *   1. "Are you GDPR compliant?" uses E09.10 §6 Answer 1's INTERIM form. The
 *      full answer's conditions of use require E03.04 (DPA, security schedule)
 *      and E03.05 (couple privacy notice) to exist as drafts. Both are backlog.
 *      Publishing the full answer would list artifacts that do not exist.
 *   2. "Who do we contact when something goes wrong?" is new. §10.2 has no
 *      support answer and the task requires one. It is written from D-009
 *      point 5 and E09.10 §3.2 rung 5 and needs founder approval on its own.
 *
 * Two questions are deliberately absent, per §10.3: insurance (no policy is
 * recorded; the honest answer is given by a person, not on a page) and where
 * data is held (P15 blocks any region or transfer claim until E03.05).
 */

const venueHref = withTracking("/venues", {
  ...VENUE_SITE_TRACKING,
  artifact: "venue_page",
  touch: "venue_questions",
});

const privacyHref = withTracking("/venues/privacy", {
  ...VENUE_SITE_TRACKING,
  artifact: "venue_privacy",
  touch: "venue_questions",
});

/**
 * E12.14. This page carries E09.10 §6's governing rule twice, in the body and
 * again in the close: "Ask, and you get the current answer rather than a
 * comfortable one", then "I do not know, and I would rather find out and tell
 * you than guess." Both sentences invite a question, and the page offered no
 * way to ask one. Every link on it went to another Venue Edition page.
 *
 * That is worse than an ordinary missing call to action. The FAQ is the
 * surface a venue reaches when it has a question the page did not answer,
 * which is precisely the case E09.10's rule exists to handle, so this is the
 * one page where the ask has to be reachable.
 */
const contactHref = withTracking("/contact?subject=venue-edition", {
  ...VENUE_SITE_TRACKING,
  artifact: "venue_questions_ask",
  touch: "venue_questions",
});

type QuestionGroup = {
  eyebrow: string;
  heading: string;
  questions: Array<{ q: string; a: string[] }>;
};

const groups: QuestionGroup[] = [
  {
    eyebrow: "The product",
    heading: "What your couples get.",
    questions: [
      {
        q: "What do our couples actually get?",
        a: [
          "A private place to plan their wedding. Notes for the things they think of, the actual work laid out, a plan they can share with family and suppliers, and a short note in the morning when something needs attention. It opens ready to use. There is nothing to learn.",
        ],
      },
      {
        q: "How long do they have it?",
        a: [
          "18 months from when the couple opens it, or 3 months past the wedding, whichever is later. If they postpone, the term moves with them. It never moves earlier.",
        ],
      },
      {
        q: "How many couples does it cover?",
        a: [
          "Every couple who books their wedding with you, for as long as your licence is current. The price does not change with the number of weddings you run.",
        ],
      },
    ],
  },
  {
    eyebrow: "The price",
    heading: "What it costs, and what the rate does.",
    questions: [
      {
        q: "What does it cost?",
        a: [
          "€1,000 a year, prepaid. The standard rate is €1,500. Both prices include VAT at the prevailing rate, so the number you see is the number you pay. As one of the Founding 25 you pay €500 a year less, for as long as you stay. That rate holds for as long as the agreement renews continuously without lapse. It follows the property, so it survives a sale or a rebrand.",
        ],
      },
    ],
  },
  {
    eyebrow: "Your team",
    heading: "What lands on the coordinator’s desk.",
    questions: [
      {
        q: "What does my team have to do?",
        a: [
          "One action. Invite the couple after they book. There is nothing to run, nothing to set up, and no training day.",
        ],
      },
    ],
  },
  {
    eyebrow: "Privacy",
    heading: "What you see, and what you never see.",
    questions: [
      {
        q: "Can we see the couple’s workspace?",
        a: [
          "No. At launch you see your invitations and who opened them. Adoption figures follow later in the year. When they arrive they are across your couples as a group, with small numbers held back so a figure can never point at one couple. You never see what a couple is planning. There is no per-couple row, no ranking, and no list of who is behind. If a couple changes their wedding date, that does not appear anywhere. A postponement is their news to share.",
        ],
      },
      {
        q: "What if a couple wants to show us something?",
        a: [
          "They send it to you, the same way they would send it to their florist. There is no setting on our side that opens a couple’s workspace to a venue, and there is no request you can make that does it either.",
        ],
      },
      {
        q: "Does our branding go on it?",
        a: [
          "Your name does. One quiet line at the top of the couple’s workspace. Not a logo, not a colour, and not a message you write. Your name, said once.",
        ],
      },
    ],
  },
  {
    eyebrow: "After the wedding",
    heading: "What the couple keeps, and what happens if you stop.",
    questions: [
      {
        q: "What happens after the wedding?",
        a: [
          "The couple’s workspace stays open in Keepsake mode. Read-only, for as long as the service exists, with a one-click export they own.",
        ],
      },
      {
        q: "What happens if we stop?",
        a: [
          "Any workspace a couple has already opened keeps its full term and its Keepsake. Only new invitations stop.",
        ],
      },
    ],
  },
  {
    eyebrow: "Support",
    heading: "Who you reach, and how often.",
    questions: [
      {
        q: "Who do we contact when something goes wrong?",
        a: [
          "A named email address that reaches Ethan, and one thirty-minute call a year about how the planning year looks from your side. There is no support portal and no standing meeting.",
          "If a couple has a problem inside their own workspace, they contact Signal Studio directly. It does not land on your coordinator.",
        ],
      },
    ],
  },
  {
    eyebrow: "Straight answers",
    heading: "The two questions with uncomfortable answers.",
    questions: [
      {
        q: "Are you GDPR compliant?",
        a: [
          "Nobody can hand you a GDPR certificate, because there isn’t one. The paperwork is being written now and you will get all of it before you sign. I would rather show you a finished document than describe one.",
          "What is already fixed is the shape of it. Reporting is aggregate only, with small numbers held back so a figure can never point at one couple. Nothing anyone at Signal Studio sends you describes what a couple is planning. If you have someone who reads this sort of thing, I would rather they read it now.",
        ],
      },
      {
        q: "Has a solicitor reviewed this?",
        a: [
          "No. I drafted these documents against standard Irish and EU positions and put them through structured adversarial review, and each of those reviews is written down. That raises the floor. It is not a legal opinion and I will not record it as one.",
          "The first three founding agreements run a one-year initial term that renews on the same terms, so an early drafting error is correctable at renewal. Once €3,000 of founding revenue has cleared, a fixed-fee professional review is commissioned before the next venues sign. You are welcome to have your own solicitor read it. Most venues should.",
        ],
      },
    ],
  },
];

export default function VenueQuestionsPage() {
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
              Venue Edition · questions venues ask
            </p>
            <h1 className="max-w-3xl text-[clamp(2rem,1.4rem+2.6vw,4rem)] font-semibold leading-[1.04] tracking-[-0.04em] text-ink">
              The questions, answered the way they get asked.
            </h1>
            <p className="mt-6 max-w-2xl text-[17px] leading-[1.65] text-ink-soft">
              Each answer says what exists, then says plainly what does not. Two
              of them are answers most suppliers would rather not put in writing,
              which is the reason they are here rather than saved for a call.
            </p>
          </div>
        </section>

        {/* ── Groups ── */}
        {groups.map((group) => (
          <section
            key={group.eyebrow}
            className="border-b border-border-soft px-6 py-14 md:py-16"
          >
            <div className="mx-auto grid w-full max-w-[1040px] gap-8 md:grid-cols-[0.7fr_1.3fr] md:gap-14">
              <div>
                <p
                  className="mb-3 text-[11px] font-semibold uppercase text-ink-quiet"
                  style={{ letterSpacing: "var(--tracking-eyebrow)" }}
                >
                  {group.eyebrow}
                </p>
                <h2 className="text-[clamp(1.25rem,1.05rem+1vw,1.75rem)] font-semibold leading-[1.15] tracking-[-0.03em] text-ink">
                  {group.heading}
                </h2>
              </div>
              <div className="border-t border-border-soft">
                {group.questions.map((item) => (
                  <div
                    key={item.q}
                    className="border-b border-border-soft py-6 last:border-b-0 last:pb-0"
                  >
                    <h3 className="text-[16px] font-medium leading-[1.4] text-ink">
                      {item.q}
                    </h3>
                    <div className="mt-3 space-y-3">
                      {item.a.map((paragraph, i) => (
                        <p
                          key={i}
                          className="text-[15px] leading-[1.65] text-ink-soft"
                        >
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        ))}

        {/* ── Two questions not on this page ── */}
        <section className="border-b border-border-soft bg-bg-deep px-6 py-14 md:py-16">
          <div className="mx-auto grid w-full max-w-[1040px] gap-8 md:grid-cols-[0.7fr_1.3fr] md:gap-14">
            <div>
              <p
                className="mb-3 text-[11px] font-semibold uppercase text-ink-quiet"
                style={{ letterSpacing: "var(--tracking-eyebrow)" }}
              >
                Not on this page
              </p>
              <h2 className="text-[clamp(1.25rem,1.05rem+1vw,1.75rem)] font-semibold leading-[1.15] tracking-[-0.03em] text-ink">
                Two questions that get answered by a person.
              </h2>
            </div>
            <div className="space-y-4 self-center">
              <p className="text-[15px] leading-[1.65] text-ink-soft">
                Whether Signal Studio carries insurance, and where each supplier
                holds what it holds. Both have real answers and neither is
                written down here, because each one needs the conversation
                around it and one of them is still being verified.
              </p>
              <p className="text-[15px] leading-[1.65] text-ink-soft">
                Ask, and you get the current answer rather than a comfortable
                one.
              </p>
            </div>
          </div>
        </section>

        {/* ── Closing ── */}
        <section className="px-6 py-16 md:py-20">
          <div className="mx-auto w-full max-w-[1040px]">
            <h2 className="max-w-3xl text-[clamp(1.35rem,1.1rem+1.2vw,2rem)] font-semibold leading-[1.1] tracking-[-0.03em] text-ink">
              If it is not on this page, the answer is still an answer.
            </h2>
            <p className="mt-5 max-w-2xl text-[16px] leading-[1.65] text-ink-soft">
              I do not know, and I would rather find out and tell you than
              guess.
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
                The Founding 25 &rarr;
              </Link>
              <Link
                href={privacyHref}
                className="text-[14px] text-ink-soft underline decoration-border-soft underline-offset-[3px] transition-colors hover:text-ink hover:decoration-accent"
              >
                What your venue sees &rarr;
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
