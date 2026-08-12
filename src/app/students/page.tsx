import type { CSSProperties, ReactNode } from "react";
import type { Metadata } from "next";
import Link from "next/link";

import { SiteFooter } from "@/components/landing/site-footer";
import { CommitteeDisclosure } from "@/components/students/committee-disclosure";
import { TimelineTheLine } from "@/components/marketing/heroes/timeline/the-line";
import {
  COMMERCIAL_TERMS,
  formatEuroCents,
  getConsumerPricingPresentation,
  requireVerifiedAmount,
} from "@/lib/commercial-terms";

import { MODULE_RAILS, SEMESTER_MARKS, SEMESTER_TIMELINE_FIXTURE } from "./fixtures";
import styles from "./students.module.css";

/**
 * The student landing page · "The Semester".
 *
 * THE SHAPE. The same argument structure /venues proved, pointed at a
 * different reader. Six rungs in the order a semester arrives, each with an
 * id the contents in the relay head can reach, each a h2. The display type
 * belongs to the answers, not to the questions: the questions are navigation
 * and the page already has a table of contents, so they sit in a quiet
 * register beside the rung number while the answers take the page.
 *
 * WHAT IS SHOWN RATHER THAN SAID. Exactly one thing: the semester itself,
 * open, in the hero. The page's whole claim is that a semester can be one
 * view, so the first screen is that view rather than a sentence about it.
 * The artifact is the app's own `TimelineArtifact`, embedded through
 * `TimelineTheLine`, on a frozen fixture. Signal's briefing frame is
 * deliberately NOT embedded beside it: `the-read.tsx` hard-codes a
 * "Wednesday, 09:00" dateline stamped 2026-07-29 in its markup, and a July
 * timestamp inside an October semester would put two contradictory dates in
 * one scroll. Notes' frame is not embedded either, because its stream is
 * hard-coded wedding copy with no items prop. Both are reported rather than
 * bent.
 *
 * EVERY COMMERCIAL CLAIM COMES FROM THE CONTRACT. Not one price, limit,
 * eligibility clause or availability statement on this page is typed as a
 * literal. They are read from `contracts/commercial-terms.v2.json` through
 * `src/lib/commercial-terms.ts`, so a change to the ratified terms moves the
 * page rather than stranding it. The strings in COPY below are connective
 * only: section labels, the frame that tells a reader whose voice a sentence
 * is in, and the mono furniture.
 *
 * THE PROGRAMME NAME IS A RATIFIED VALUE TOO. "Student Edition" is
 * `plans.student.programmeName`, the same shape the venue plan uses for
 * `founding.programmeName`, and it is read once into STUDENT_PROGRAMME and
 * rendered in the four places the page names the programme: the hero eyebrow,
 * the metadata title, the OG title and the closing address strip. The plan's
 * own `publicName`, "Student", stays where it belongs, on the price card,
 * because that is the name of the thing a reader buys.
 *
 * THE PRICE NEVER TRAVELS WITHOUT ITS CONDITIONS, GEOMETRICALLY. The same
 * rule /venues makes physical: the price sentence is ledger row 01 and it
 * rides a sticky bar pinned above the ledger for the whole of its scroll, so
 * there is no scroll position from which a reader can see a condition without
 * the number, or the number without conditions under it. On this plan the
 * conditions matter more than usual, because the plan cannot currently be
 * bought at all.
 *
 * AND IT IS STATED AT DISPLAY SCALE ONCE. The carrier is the price card,
 * because the card is the object a student can act on: the figure, the
 * cadence, the ask and the support line are one thing, and rung 06's two index
 * rows sit directly under it. The number appears twice more on the page, at
 * reading size, in the "Across a year" row and in the ledger's own price row,
 * which is the honest state for a sticky condition bar.
 *
 * THREE WORKSPACES, NOT FOUR. The page this replaces named four modules
 * (Psychology, Law, Marketing, Statistics) as the sample semester while the
 * ratified plan carries a three-Workspace limit. The limit is now stated in
 * the ledger, in the price card, in rung 01, and the sample semester in
 * `fixtures.ts` runs on three modules so the picture and the plan agree.
 * Most semesters are bigger than three modules, and rung 01 says so in its
 * own index rather than leaving a reader to find the ceiling after paying.
 *
 * THE STRUCK PRICE. The €100/yr graduate rate that the retired app page
 * carried is gone and does not appear anywhere on this surface, per the
 * founder decision of 2026-08-12 (D3). The contract has no graduate plan.
 */

const PRICING = getConsumerPricingPresentation();
const STUDENT_PLAN = COMMERCIAL_TERMS.plans.student;
const GUESTS = COMMERCIAL_TERMS.guestSemantics;

const STUDENT_PRICE = formatEuroCents(requireVerifiedAmount("student"));
const FREE_PRICE = formatEuroCents(requireVerifiedAmount("free"));
const VAT_CLAUSE = COMMERCIAL_TERMS.vat.publicStatement;

/**
 * The programme name, from the contract. "Student Edition" is what the
 * acquisition programme is called; "Student" is what the plan is called and
 * what the price card renders. Both are ratified values in
 * `contracts/commercial-terms.v2.json`, so neither is typed on this page.
 */
const STUDENT_PROGRAMME = PRICING.plans.student.programmeName;

const STUDENT_WORKSPACES = PRICING.plans.student.workspaceLimit.toLowerCase();
const STUDENT_GUESTS = PRICING.plans.student.editingGuestLimit.toLowerCase();
const FREE_WORKSPACES = PRICING.plans.free.workspaceLimit.toLowerCase();
const FREE_GUESTS = PRICING.plans.free.editingGuestLimit.toLowerCase();

/**
 * A permission list from the contract, rendered as a sentence. The rows in
 * rung 05 are the only place on the estate where the guest semantics are
 * stated to a reader, so they are generated from the arrays rather than
 * retyped beside them.
 */
function permissions(actions: readonly string[]): string {
  const list =
    actions.length > 1
      ? `${actions.slice(0, -1).join(", ")} and ${actions[actions.length - 1]}`
      : (actions[0] ?? "");
  return `${list.charAt(0).toUpperCase()}${list.slice(1)}.`;
}

/**
 * The waitlist, with attribution. `/waitlist` reads source, campaign,
 * audience, artifact and touch (waitlist/page.tsx:36-41) and puts each into
 * the submitted record, so the two asks on this page carry different
 * artifacts and can be told apart afterwards.
 */
function waitlistHref(artifact: string): string {
  return `/waitlist?source=students&campaign=pre_access_waitlist&audience=student&artifact=${artifact}&touch=site`;
}

const LADDER = [
  "What a semester looks like when it is one system.",
  "What happens in the week two midterms land in.",
  "What happens in the last week of a paper.",
  "What happens when the job search starts as well.",
  "What stays private, and what you choose to share.",
  "What it costs, and every condition on it.",
] as const;

const COPY = {
  eyebrowHero: `${STUDENT_PROGRAMME} · Waitlist only`,
  heroJumpToTerms: "What it costs, and every condition on it",

  relayKicker: "Six parts, in order",
  relayHeading: "Everything a semester throws at you, in the order it arrives.",
  contentsLabel: "The six parts this page covers, in order",

  sourceLabel: "Sample workspace",
  sourceOwner: "Aoife",
  sourceTerm: "Semester one",
  sourceDateLabel: "21 October",
  sourceDate: "2026-10-21",
  sampleView: "Sample product view",

  /* What the embedded artifact IS, for anyone who cannot see it. The
     component's default names the wedding fixture it ships with, and this
     page supplies its own semester fixture, so it supplies its own name. */
  artifactLabel: "Signal Timeline sample semester plan",

  stackLabel: "One semester",

  eyebrow1: "Three workspaces, one semester",
  foot1: "Three modules → one line",

  eyebrow2: "The week that decides the grade",
  foot2: "Two exams → one order",

  eyebrow3: "Six jobs, one order",
  foot3: "The argument → the submission",

  eyebrow4: "The search that runs alongside",
  foot4: "Five emails → one real conversation",

  /* Rung 05 breaks out of the relay into the manifesto grammar, so its
     numeral is redrawn in the relay number register by .manifestoNum and
     the six-numeral spine keeps one voice. The frame renders at reading
     size directly over the triple rather than inside the 10px mono
     eyebrow: the page's biggest promise must not hang its meaning on the
     page's smallest label. */
  manifestoEyebrow: "05",
  manifestoFrame: "What a Signal Studio account does with your work",

  eyebrow6: "The number, and its conditions",
  foot6: "One number → twelve conditions",
  yearTerm: "Across a year",
  vatTerm: "Is VAT on top",

  ledgerTitle: "The terms, in full",
  ledgerCount: "13 rows",

  societySummary: "Running a committee or a society?",

  closingName: "Ethan McNamara",
  closingProgramme: STUDENT_PROGRAMME,
  closingPlace: "Limerick, 2026",
} as const;

/**
 * The commercial ledger. Row 01 is held out of the groups because it is
 * rendered separately, as the sticky row that pins the price over its twelve
 * conditions; the figure span is sliced from the row's own sentence so the
 * rendered text is provably the same string, and if the sentence ever stops
 * opening with the figure the whole of it renders untouched.
 *
 * Every detail below is composed from the ratified contract. Nothing here is
 * a number or a term typed by hand.
 */
const PRICE_ROW = [
  "The price",
  `${STUDENT_PRICE} a year, ${VAT_CLAUSE}.`,
] as const;
const PRICE_ROW_FIGURE = PRICE_ROW[1].startsWith(STUDENT_PRICE)
  ? STUDENT_PRICE
  : "";
const PRICE_ROW_REST = PRICE_ROW[1].slice(PRICE_ROW_FIGURE.length);

type LedgerRow = readonly [term: string, detail: string];
type LedgerGroup = Readonly<{
  label: string;
  base: number;
  rows: readonly LedgerRow[];
}>;

const LEDGER_GROUPS: readonly LedgerGroup[] = [
  {
    label: "The rate",
    base: 1,
    rows: [
      [
        "How it is billed",
        `Once a ${STUDENT_PLAN.cadence}. You cannot pay monthly.`,
      ],
      [
        "What is included",
        `${PRICING.plans.student.workspaceLimit} workspaces and ${STUDENT_GUESTS} editing guests.`,
      ],
      [
        "Trials",
        COMMERCIAL_TERMS.trialPolicy.openPaidFeatureTrial
          ? "A trial of paid features is available."
          : "There is no free trial of paid features.",
      ],
    ],
  },
  {
    label: "Who it is for",
    base: 4,
    rows: [
      ["Who qualifies", "You have to be a student, and I check. Nothing else counts."],
      [
        "How long that lasts",
        "One year. I check again every year that you are still a student.",
      ],
      [
        "When it can be bought",
        "Only once student verification is enforced inside the product. That is not live, so nothing on this page can be bought today.",
      ],
    ],
  },
  {
    label: "What is not settled",
    base: 7,
    rows: [
      [
        "The verification standard",
        "Not published. The standard, the payment step and the renewal terms are all stated in full before paid access opens.",
      ],
      /* broadLaunchDate is null and broadLaunchPolicy is
         manual_go_no_go_only in the contract, and
         scripts/check-content-truth.mjs fails the build if either moves,
         so this row cannot drift into announcing a date. */
      [
        "The date",
        `There is no launch date. ${PRICING.availability} Each batch is a decision, not a schedule.`,
      ],
      [
        "The state of this plan",
        "The price and the terms are settled. The check they depend on is not built yet.",
      ],
    ],
  },
  {
    label: "The offers around it",
    base: 10,
    rows: [
      [
        "If you are not a student",
        `Free is ${FREE_PRICE} with ${FREE_WORKSPACES} Workspace and ${FREE_GUESTS} editing guests, and ${PRICING.plans.free.access.toLowerCase()}.`,
      ],
      [
        "If you run a society",
        "There is no society price. A society workspace is not part of the current offer, and the one that used to be advertised is retired.",
      ],
      [
        "If you are a school",
        `By quote, one conversation at a time. There is no published school price${
          COMMERCIAL_TERMS.schools.seatCommitment === null
            ? " and no seat commitment"
            : ""
        }.`,
      ],
    ],
  },
];

const SOCIETY_NOTES = [
  "A society or an event stays separate from academic module workspaces.",
  "Officer handover and long-term ownership need an explicit policy.",
  "Editing-member limits and viewer access are stated separately.",
  "No society price and no referral incentive is promised.",
] as const;

/**
 * Wrap one exact substring in an accent span. The slices are taken from the
 * source string itself, never retyped, and a substring that is not found
 * returns the untouched string rather than silently dropping copy.
 */
function accent(source: string, word: string, className: string): ReactNode {
  const at = source.indexOf(word);
  if (at < 0) return source;
  return (
    <>
      {source.slice(0, at)}
      <span className={className}>{word}</span>
      {source.slice(at + word.length)}
    </>
  );
}

export const metadata: Metadata = {
  title: `${STUDENT_PROGRAMME} · Signal Studio`,
  description: `Every module clear and the whole semester in one view. ${PRICING.plans.student.workspaceLimit} Workspaces, private Notes, Tasks with dates, a semester Timeline and a morning briefing across the lot. ${STUDENT_PRICE} a year for verified students. Waitlist only, and nothing is charged today.`,
  openGraph: {
    title: `${STUDENT_PROGRAMME} · Signal Studio`,
    description:
      "One module per workspace, grouped into a semester. Private Notes, Tasks with dates, a semester Timeline, and a morning briefing across the whole workload.",
    type: "website",
  },
};

export default function StudentsPage() {
  return (
    <>
      <main id="main" tabIndex={-1} className={styles.page}>
        {/* ── Hero · .reveal-hero .reveal-hero-v2 ────────────────── */}
        <section
          className="reveal-hero reveal-hero-v2"
          aria-labelledby="st-title"
        >
          <div className="reveal-hero-v2-inner">
            <p className="reveal-relay-kicker">{COPY.eyebrowHero}</p>

            <h1 id="st-title" className="reveal-headline-v2">
              {accent(
                "Every module clear. The whole semester in view.",
                "semester",
                "reveal-headline-accent",
              )}
            </h1>

            <p className="reveal-lede-v2">
              Create a semester, add the modules once, and work inside the one
              that needs you now. Notes stay private. Tasks and fixed dates stay
              connected. The morning briefing looks across all of it.
            </p>

            {/* Navigation, not a second ask. The asks live where a reader
                can act on them: on the price card, and in the close. This
                anchor exists because the one thing a student wants first is
                the number, and it lands on rung 06 itself rather than on the
                ledger head, so the number arrives with its conditions under
                it instead of behind the sticky site nav. */}
            <div className="reveal-hero-actions">
              <a
                className="reveal-action reveal-action-secondary"
                href="#st-rung-6"
              >
                {COPY.heroJumpToTerms}
                <span aria-hidden>↓</span>
              </a>
            </div>

            {/* The semester, open. The one object on this page that is shown
                rather than said. */}
            <div className={styles.heroStage}>
              <div
                className="reveal-relay-source"
                /* role="group" makes the aria-label valid: a label on a
                   plain div is ARIA-prohibited (axe aria-prohibited-attr). */
                role="group"
                aria-label="Sample workspace context"
              >
                <span>{COPY.sourceLabel}</span>
                <strong>{COPY.sourceOwner}</strong>
                <span aria-hidden>·</span>
                <span>{COPY.sourceTerm}</span>
                <span aria-hidden>·</span>
                <time dateTime={COPY.sourceDate}>{COPY.sourceDateLabel}</time>
              </div>

              <div className="reveal-relay-preview" data-product="timeline">
                <p className="reveal-relay-sample">{COPY.sampleView}</p>
                <TimelineTheLine
                  embedded
                  timeline={SEMESTER_TIMELINE_FIXTURE}
                  label={COPY.artifactLabel}
                />
              </div>

              {/* The embedded view's motion primitives serve their initial
                  state as inline opacity and transform. With scripting
                  disabled that state would be final and the artifact's
                  header copy would never appear. The :not() guard excludes
                  decimal opacities: the artifact's decorative metric sweep
                  ships at opacity:0.32, which the bare substring
                  "opacity:0" also matches, and rescuing it to full opacity
                  un-designs it in no-JS. */}
              <noscript>
                <style>{`.reveal-relay-preview [style*="opacity:0"]:not([style*="opacity:0."]){opacity:1 !important;transform:none !important}`}</style>
              </noscript>
            </div>
          </div>
        </section>

        {/* ── Relay, part one · .reveal-relay ────────────────────── */}
        <section className="reveal-relay" aria-labelledby="st-relay-title">
          <header className="reveal-relay-head">
            <p className="reveal-relay-kicker">{COPY.relayKicker}</p>
            <h2 id="st-relay-title">{COPY.relayHeading}</h2>

            <nav className={styles.contents} aria-label={COPY.contentsLabel}>
              <ol className={styles.contentsList}>
                {LADDER.map((rung, index) => (
                  <li
                    className={styles.contentsItem}
                    key={rung}
                    style={{ "--i": index } as CSSProperties}
                  >
                    <a
                      className={styles.contentsLink}
                      href={`#st-rung-${index + 1}`}
                    >
                      <span className={styles.contentsNum}>
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className={styles.contentsText}>{rung}</span>
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          </header>

          {/* Rung 01 · the shape of a semester. The display object is the
              module stack: three module rails standing over one semester
              rail, which is the rung's sentence drawn. */}
          <article
            className={`reveal-relay-chapter ${styles.rung}`}
            id="st-rung-1"
          >
            <div className="reveal-relay-copy reveal">
              <p className="reveal-relay-number">01</p>
              <h2 className={styles.rungQ}>{LADDER[0]}</h2>
              <p className="reveal-relay-eyebrow">{COPY.eyebrow1}</p>
              <p className={styles.rungBody}>
                Each module gets a workspace of its own: its notes, its tasks,
                its dates. The semester holds them together, so moving between
                modules never means moving between tools.
              </p>
              <p className="reveal-relay-foot">{COPY.foot1}</p>
            </div>

            <div>
              {/* Decorative by construction: the sentence above states the
                  whole of the object's content, so it is hidden from
                  assistive technology rather than given a label that would
                  duplicate it. */}
              <div className={styles.stack} aria-hidden>
                {MODULE_RAILS.map((rail, row) => (
                  <div
                    className={styles.stackRow}
                    key={rail.name}
                    style={{ "--row": row } as CSSProperties}
                  >
                    <span className={styles.stackLabel}>{rail.name}</span>
                    <span className={styles.stackRail}>
                      {rail.marks.map((mark, index) => (
                        <span
                          className={styles.stackMark}
                          key={mark}
                          style={
                            {
                              "--p": `${mark}%`,
                              "--i": index,
                            } as CSSProperties
                          }
                        />
                      ))}
                    </span>
                  </div>
                ))}

                <div
                  className={`${styles.stackRow} ${styles.stackTotal}`}
                  style={{ "--row": MODULE_RAILS.length } as CSSProperties}
                >
                  <span className={styles.stackLabel}>{COPY.stackLabel}</span>
                  <span className={styles.stackRail}>
                    {SEMESTER_MARKS.map((mark, index) => (
                      <span
                        className={styles.stackMark}
                        key={mark}
                        style={
                          { "--p": `${mark}%`, "--i": index } as CSSProperties
                        }
                      />
                    ))}
                  </span>
                </div>
              </div>

              <dl className={styles.index}>
                <IndexRow
                  term="What a workspace holds"
                  detail="Private Notes, Tasks with dates and owners, and a Timeline for the module. One module, one workspace, so nothing bleeds between them."
                />
                <IndexRow
                  term="How many you get"
                  detail={`${PRICING.plans.student.workspaceLimit} Workspaces and ${STUDENT_GUESTS} editing guests. That is the size of a study group.`}
                />
                {/* The page's founding premise is three module Workspaces,
                    because that is the ratified plan limit, and most semesters
                    are bigger than that. Said plainly here rather than left
                    for a reader to discover after they have paid. Both counts
                    are composed from the contract. */}
                <IndexRow
                  term="If you take more modules"
                  detail={`Most semesters run to more than ${STUDENT_WORKSPACES} modules. ${PRICING.plans.student.workspaceLimit} is what the plan carries, so a Workspace goes to each module with graded work in it and the lighter ones share one.`}
                />
                <IndexRow
                  term="Where everything else goes"
                  detail={`A part-time job, a society or a trip home is an ordinary Workspace, not a module. It counts against the same ${STUDENT_WORKSPACES}.`}
                />
              </dl>
            </div>
          </article>

          {/* Rung 02 · midterm week. */}
          <article
            className={`reveal-relay-chapter ${styles.rung}`}
            id="st-rung-2"
          >
            <div className="reveal-relay-copy reveal">
              <p className="reveal-relay-number">02</p>
              <h2 className={styles.rungQ}>{LADDER[1]}</h2>
              <p className="reveal-relay-eyebrow">{COPY.eyebrow2}</p>
              <p className="reveal-relay-foot">{COPY.foot2}</p>
            </div>

            <div>
              <p className={`${styles.answer} reveal`}>
                The order beats the hours.
              </p>
              <p className={styles.answerRest}>
                Two exams in five days is not a studying problem. It is a
                sequencing problem. Written down once, in the order it actually
                happens, the week stops being decided at two in the morning.
              </p>

              <dl className={`${styles.index} ${styles.indexAfter}`}>
                <IndexRow
                  term="What goes on the list"
                  detail="A one-page review sheet for each module. The practice problems, redone rather than reread. The study-group slot. The eight hours before the exam. The items nobody puts on a study plan are the ones that decide the grade."
                />
                <IndexRow
                  term="What the board shows"
                  detail="The next piece of work inside each module, without flattening the whole semester into one crowded list."
                />
                <IndexRow
                  term="What it will not do"
                  detail="No red dots. No buzzing. One briefing in the morning, and then it leaves you alone."
                />
              </dl>
            </div>
          </article>

          {/* Rung 03 · the last week of a paper. The display answer is the
              page's second largest line, because it is the sentence the
              archived student copy got right and nothing else says. */}
          <article
            className={`reveal-relay-chapter ${styles.rung}`}
            id="st-rung-3"
          >
            <div className="reveal-relay-copy reveal">
              <p className="reveal-relay-number">03</p>
              <h2 className={styles.rungQ}>{LADDER[2]}</h2>
              <p className="reveal-relay-eyebrow">{COPY.eyebrow3}</p>
              <p className="reveal-relay-foot">{COPY.foot3}</p>
            </div>

            <div>
              <p className={`${styles.answerLg} reveal`}>
                {accent("A paper is six jobs, not one.", "six jobs", "em")}
              </p>
              <p className={styles.answerRest}>
                Pick the argument. Gather the sources. Outline. Draft. Edit.
                Submit. Done out of order, most of them get done twice, and the
                second time is at four in the morning.
              </p>

              <dl className={`${styles.index} ${styles.indexAfter}`}>
                <IndexRow
                  term="Where the thinking goes"
                  detail="Notes. Reading, lecture scraps and half-formed arguments, all private. Only the extract you choose becomes a task or a milestone."
                />
                <IndexRow
                  term="Where the dates go"
                  detail="The submission sits on the module Timeline, so it is visible from the semester view and not only from inside the module."
                />
                <IndexRow
                  term="If it moves"
                  detail="Move the date once. The Timeline and the morning briefing read from the same place, so neither of them keeps the old one."
                />
              </dl>
            </div>
          </article>

          {/* Rung 04 · the search that runs alongside. */}
          <article
            className={`reveal-relay-chapter ${styles.rung}`}
            id="st-rung-4"
          >
            <div className="reveal-relay-copy reveal">
              <p className="reveal-relay-number">04</p>
              <h2 className={styles.rungQ}>{LADDER[3]}</h2>
              <p className="reveal-relay-eyebrow">{COPY.eyebrow4}</p>
              <p className="reveal-relay-foot">{COPY.foot4}</p>
            </div>

            <div>
              <p className={`${styles.answer} reveal`}>
                The search does not wait for the degree.
              </p>
              <p className={styles.answerRest}>
                Applications are won on the parts that are not the CV. Five
                emails to real people before you submit. Three answers said out
                loud, on a timer, instead of read in your head. Two names on the
                team you can ask a real question about.
              </p>

              <dl className={`${styles.index} ${styles.indexAfter}`}>
                <IndexRow
                  term="Where it lives"
                  detail={`One of the ${STUDENT_WORKSPACES} Workspaces, beside the modules. Same dates, same board, same morning briefing.`}
                />
                <IndexRow
                  term="Who can see it"
                  detail="Nobody, until you invite them. A mentor or a friend can come in as an editing guest and mark up the draft."
                />
                <IndexRow
                  term="What comes after"
                  detail="The thank-you note, inside a day. It is one task, and it is the one most people skip."
                />
              </dl>
            </div>
          </article>
        </section>

        {/* ── Rung 05 · what stays private · .reveal-manifesto ────
            Trust is won here, and it comes before price, so it breaks out
            of the relay and takes the page's biggest statement. */}
        <section
          className={`reveal-manifesto reveal ${styles.rung}`}
          id="st-rung-5"
          aria-labelledby="st-private"
        >
          <div className={`reveal-manifesto-eyebrow ${styles.manifestoNum}`}>
            {COPY.manifestoEyebrow}
          </div>

          <h2 id="st-private" className={styles.rungQ}>
            {LADDER[4]}
          </h2>

          <p className={styles.answerFrame}>{COPY.manifestoFrame}</p>

          <p className="reveal-manifesto-body">
            Notes are private by default. Nothing you write there appears in
            another product, in a shared view, or in anybody else’s workspace.
          </p>
          <p className={`${styles.answerLg} reveal`}>
            {accent(
              "Nothing leaves your notes unless you move it.",
              "unless you move it",
              "em",
            )}
          </p>
          <p className="reveal-manifesto-body">
            A Timeline is shared when you publish it, and it shows what you put
            on it. Nothing else travels with it.
          </p>

          {/* The four access answers are one object because they only make
              sense together: each row is meaningless without the three
              beside it. Every value is read from the ratified contract's
              guestSemantics block. */}
          <dl className={`${styles.index} ${styles.indexGroup}`}>
            <IndexRow
              term="What an editing guest can do"
              detail={permissions(GUESTS.editingMembers)}
            />
            <IndexRow
              term="What a signed-in guest can do"
              detail={permissions(GUESTS.authenticatedGuests)}
            />
            <IndexRow
              term="What someone with the link can do"
              detail={permissions(GUESTS.linkViewers)}
            />
            <IndexRow
              term="Who can invite"
              detail="The workspace owner or an admin. Nobody else can add a person to your workspace."
            />
          </dl>

          <dl className={`${styles.index} ${styles.indexAfter}`}>
            {/* Only what the binding document says. The privacy policy's
                "What we don't collect" section rules out advertising trackers,
                fingerprinting, session replay, marketing pixels, behavioural
                profiling and model training on anything you write. It makes no
                representation about selling data, so this row no longer makes
                one either: the next row tells the reader the policy is the
                binding text, and a summary cannot promise more than the
                document it summarises. */}
            <IndexRow
              term="How this is paid for"
              detail="By the price on this page. No ads, no behavioural profiling, and nothing you write is used to train a model."
            />
            <IndexRow
              term="Where the full version is"
              detail={
                <>
                  The{" "}
                  <Link href="/privacy">privacy policy</Link> and the{" "}
                  <Link href="/terms">terms</Link> are the binding text. These
                  rows summarise them, and where they differ the policy wins.
                </>
              }
            />
          </dl>
        </section>

        {/* ── Relay, part two · .reveal-relay. relayResume drops the head
            padding the house reserves for a relay's own head, which part
            two does not have. ───────────────────────────────────────── */}
        <div className={`reveal-relay ${styles.relayResume}`}>
          {/* Rung 06 · what it costs. */}
          <article
            className={`reveal-relay-chapter ${styles.rung}`}
            id="st-rung-6"
          >
            <div className="reveal-relay-copy reveal">
              <p className="reveal-relay-number">06</p>
              <h2 className={styles.rungQ}>{LADDER[5]}</h2>
              <p className="reveal-relay-eyebrow">{COPY.eyebrow6}</p>
              <p className={styles.rungBody}>
                The price is set and the terms are final. I have not built the
                student check yet, so I cannot take your money today. The
                waitlist is the whole of the offer.
              </p>
              <p className="reveal-relay-foot">{COPY.foot6}</p>
            </div>

            {/* ONE CARRIER FOR THE NUMBER. The rung used to open with a bare
                95px figure and then repeat the price inside the card a few
                lines under it, which put the same €9.99 at display scale twice
                in one viewport. The card is the carrier: it is the object a
                student can act on, so it holds the figure, the cadence and the
                ask together, and the two index rows sit directly under it
                rather than orphaned between two statements of the same
                number. */}
            <div className="reveal">
              <article className={styles.priceCard} aria-labelledby="st-plan">
                <div className={styles.priceCardInner}>
                  <div>
                    <h3 className={styles.priceCardName} id="st-plan">
                      {STUDENT_PLAN.publicName}
                    </h3>
                    <p className={styles.priceCardSummary}>
                      One membership, once a year.{" "}
                      {PRICING.plans.student.workspaceLimit} Workspaces, private
                      Notes, Tasks with dates, a Timeline for each module, and a
                      morning briefing across the lot.
                    </p>
                    <dl className={styles.priceCardFacts}>
                      <div className={styles.priceCardFact}>
                        <dt>Eligibility</dt>
                        <dd>Verified student status</dd>
                      </div>
                      <div className={styles.priceCardFact}>
                        <dt>Workspaces</dt>
                        <dd>{PRICING.plans.student.workspaceLimit}</dd>
                      </div>
                      <div className={styles.priceCardFact}>
                        <dt>Editing guests</dt>
                        <dd>{PRICING.plans.student.editingGuestLimit}</dd>
                      </div>
                    </dl>
                  </div>

                  <div className={styles.priceCardAsk}>
                    <span className={styles.priceCardFigure}>
                      {STUDENT_PRICE}
                    </span>
                    <span className={styles.priceCardCadence}>
                      per {STUDENT_PLAN.cadence}
                    </span>
                    <Link
                      className={styles.priceCta}
                      href={waitlistHref("student_price_card")}
                    >
                      Join the student waitlist
                      <span aria-hidden>→</span>
                    </Link>
                    {/* Two lines, and the break is authored. Left to a
                        max-width the line broke inside the negation, as
                        "waitlist only · no" over "charge today", which reads
                        for a beat as the opposite of what it says. Each half
                        of the pair is its own line, so the break can only
                        fall on the separator. */}
                    <span className={styles.priceCardNote}>
                      <span className={styles.priceCardNoteLine}>
                        Waitlist only ·
                      </span>{" "}
                      <span className={styles.priceCardNoteLine}>
                        no charge today
                      </span>
                    </span>
                  </div>
                </div>
              </article>

              <dl className={`${styles.index} ${styles.indexAfter}`}>
                <IndexRow
                  term={COPY.yearTerm}
                  detail={`${STUDENT_PRICE} once a ${STUDENT_PLAN.cadence}, renewed only if you re-verify as a student.`}
                />
                <IndexRow
                  term={COPY.vatTerm}
                  detail={`No. ${PRICING.vatStatement}`}
                />
              </dl>
            </div>

            <section className={styles.spanBlock} aria-labelledby="st-ledger">
              <div className={styles.wideHead}>
                <h3 className={styles.wideTitle} id="st-ledger">
                  {COPY.ledgerTitle}
                </h3>
                <span className={styles.wideMeta}>{COPY.ledgerCount}</span>
              </div>

              {/* The rule made physical: while any of the twelve conditions
                  is on screen, so is the number and its VAT clause. The dl
                  itself carries the sticky position, as a direct child of
                  the block that spans all four groups, because a sticky
                  element travels only within its parent and nesting the row
                  inside the first group would let the price scroll away
                  after row 04. */}
              <dl className={`${styles.ledger} ${styles.stickyBar}`}>
                <div className={styles.ledgerRow}>
                  <dt className={styles.ledgerTerm}>
                    <span className={styles.ledgerNum} aria-hidden>
                      01
                    </span>
                    <span>{PRICE_ROW[0]}</span>
                  </dt>
                  <dd className={styles.ledgerDetail}>
                    <span className={styles.stickyFigure}>
                      {PRICE_ROW_FIGURE}
                    </span>
                    {PRICE_ROW_REST}
                  </dd>
                </div>
              </dl>

              {LEDGER_GROUPS.map((group) => (
                <div className={styles.ledgerGroup} key={group.label}>
                  <p className={styles.groupLabel}>{group.label}</p>
                  <dl className={styles.ledger}>
                    {group.rows.map(([term, detail], index) => (
                      <div className={styles.ledgerRow} key={term}>
                        <dt className={styles.ledgerTerm}>
                          <span className={styles.ledgerNum} aria-hidden>
                            {String(group.base + index + 1).padStart(2, "0")}
                          </span>
                          <span>{term}</span>
                        </dt>
                        <dd className={styles.ledgerDetail}>{detail}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              ))}

              {/* The society offer, kept deliberately secondary to the
                  academic one: it does not exist, so it does not get a
                  display line. It gets a panel a reader can open. */}
              <div className={styles.aside}>
                <CommitteeDisclosure summary={COPY.societySummary}>
                  <div className={styles.asidePanel}>
                    <p className={styles.asideTitle}>
                      A society workspace is not priced
                    </p>
                    <p className={styles.asideBody}>
                      It is not part of the current offer. Ownership at
                      handover, renewal, who counts as a member and what it
                      costs all need a decision before one can open.
                    </p>
                    <ul className={styles.asideList}>
                      {SOCIETY_NOTES.map((note) => (
                        <li key={note}>{note}</li>
                      ))}
                    </ul>
                  </div>
                </CommitteeDisclosure>
              </div>

              <p className={styles.note}>
                Joining the waitlist does not open an account and does not
                charge you. Before paid access opens, Signal Studio states the
                student verification standard, the payment step and the renewal
                terms plainly, on this page.
              </p>
            </section>
          </article>
        </div>

        {/* ── The ask · .reveal-closing. One for the whole page, and the
            page ends on what actually happens next rather than on a
            deadline it does not have. ───────────────────────────────── */}
        <section className="reveal-closing reveal" aria-labelledby="st-ask">
          <div className="reveal-closing-rule" aria-hidden />
          {/* The accent is narrow on purpose. Across a centred three-line
              sign, "when verification goes live" straddled the line break and
              painted as a stub on one line and a bar on the next, with the
              full stop outside the mark. The marked phrase is now two words
              and carries its own terminal period, and .signAccent forbids it
              breaking, so the mark closes the sentence as one object at every
              width. */}
          <h2 id="st-ask" className="reveal-closing-sign">
            {accent(
              "No date. No charge today. You’ll hear from me when verification goes live.",
              "goes live.",
              `em ${styles.signAccent}`,
            )}
          </h2>

          <div className="reveal-closing-cta">
            <Link
              className="reveal-cta reveal-cta-primary"
              href={waitlistHref("student_close")}
            >
              Join the student waitlist
              <span className="cta-arrow" aria-hidden>
                {" "}
                →
              </span>
            </Link>
          </div>

          {/* The close speaks in the first person once, so the address
              strip resolves that person by name where a letter would sign.
              Attribution furniture, not a new claim. */}
          <p className="reveal-closing-addr">
            <span>{COPY.closingName}</span>
            <span className="sep" aria-hidden>
              ·
            </span>
            <span>{COPY.closingProgramme}</span>
            <span className="sep" aria-hidden>
              ·
            </span>
            <span>{COPY.closingPlace}</span>
          </p>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

/** One term and its answer. */
function IndexRow({ term, detail }: { term: string; detail?: ReactNode }) {
  if (!detail) return null;
  return (
    <div className={styles.indexRow}>
      <dt className={styles.indexTerm}>{term}</dt>
      <dd className={styles.indexDetail}>{detail}</dd>
    </div>
  );
}
