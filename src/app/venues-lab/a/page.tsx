import type { CSSProperties, ReactNode } from "react";
import type { Metadata } from "next";
import Link from "next/link";

import { SiteFooter } from "@/components/landing/site-footer";
import { SignalTheRead } from "@/components/marketing/heroes/signal/the-read";
import { TimelineTheLine } from "@/components/marketing/heroes/timeline/the-line";

import {
  ACCESS_TERM,
  ACCESS_TERM_LONG,
  BRANDING,
  CAN_WE_SEE,
  COLLABORATION,
  COMMERCIAL_SUMMARY,
  COORDINATOR,
  CTA,
  CTA_HREF,
  CTA_SUPPORT,
  ENTITLEMENT,
  FAQ,
  FILM,
  FOUNDING_NUMBER,
  FOUNDING_RATE,
  GEOGRAPHY,
  HOW_IT_REACHES_YOU,
  KEEPSAKE,
  LADDER,
  NO_NAMES,
  NOT_TECHNICAL,
  OFFER_LINE,
  PER_WEDDING_SCALE,
  PLAIN_THREE,
  POSTPONEMENT,
  PRICE_FOUNDING,
  PRIVACY,
  ROADMAP,
  SURVIVAL,
  TEAM_ASK,
  VAT_ANSWER,
  WHAT_COUPLES_GET,
  WHO_ELSE,
  WHY_NOT_CHARGE_COUPLES,
} from "@/lib/venue-copy";

import { FilmSlot } from "./film-slot";
import { VENUE_SIGNAL_ITEMS, VENUE_TIMELINE_FIXTURE } from "./fixtures";
import styles from "./venue-a.module.css";

/**
 * The venue landing page · "The Relay".
 *
 * The landing page's signature structure, the product relay, pointed at the
 * venue. On the homepage the relay follows one detail through four products.
 * Here it follows the venue's own argument down the seven rungs, and the real
 * product appears only where a rung is better shown than told.
 *
 * THE HIERARCHY IS THE ANSWERS'. The seven ladder questions are navigation,
 * and they are set like navigation: a quiet 19-25px register beside the rung
 * number. The display type on this page belongs to the ratified answers, one
 * per rung, because the person this page is written for reads answers, not
 * furniture. In order: two live product views, the sentence that settles what
 * a venue can and cannot see, the price, the word "No.", the words "One
 * action.", the full access term, and "Nobody yet." over twenty-five open
 * places. Every one of those is an imported constant, and where a lead
 * sentence is lifted into display type the remainder is sliced from the same
 * constant, never retyped.
 *
 * THE PRICE NEVER TRAVELS WITHOUT ITS CONDITIONS, GEOMETRICALLY. The ratified
 * rule is that a surface carrying the number carries all seventeen rows. This
 * page makes that physical: the price sentence rides a sticky bar that stays
 * pinned above the ledger for the whole of its scroll, so there is no scroll
 * position from which a reader can see a condition without the number, or the
 * number without conditions under it.
 *
 * COPY. Every claim, price, term and answer is imported from
 * `src/lib/venue-copy.ts`. The strings in COPY below are connective only:
 * section labels, the frame that tells a cold reader whose voice a sentence
 * is in, and the mono furniture. No sentence here restates a ratified claim.
 *
 * STRUCTURE. Exactly seven h2 rungs, in ladder order, each with an id the
 * contents in the relay head can reach. The rungs sit at h2, not h3, because
 * the embedded timeline sample ships its own h2 document header (a deliberate
 * house decision inside timeline-artifact.tsx): with the rungs one level
 * above it, the sample card reads as one small sibling document after rung
 * 01, and can never own rungs 02 through 07 in a heading-list navigation.
 * The block titles inside a rung (the ledger, the film) are h3 under it. The
 * 17-row ledger lives inside rung 03 because it is the price's conditions;
 * the reserved film frame lives inside rung 04 because the film is what a
 * couple opens and what you see.
 *
 * THE FAQ OF RECORD. Twelve questions are ratified; ten of their answers were
 * already set on this page word for word. The two that are not are kept, each
 * in the rung that raises its question, so all twelve are answered without a
 * 523-word repeat block. Reversible in one commit.
 *
 * NOT INSTRUMENTED. There is no page-view recorder in this repo; rather than
 * invent an API the page ships without instrumentation and the gap is
 * reported.
 */
const COPY = {
  relayKicker: "Seven questions, in order",
  relayHeading: "Everything a venue asks, in the order they ask it.",

  contentsLabel: "The seven questions this page answers, in order",

  heroJumpToTerms: "What it costs, and every condition on it",

  sourceLabel: "Sample workspace",
  sourceCouple: "Mara and Finn",
  sourceVenue: "Glenmara House",
  sourceDateLabel: "29 July",
  sourceDate: "2026-07-29",

  sampleView: "Sample product view",

  eyebrow1: "What lands with the couple",
  foot1: "A booking → their wedding workspace",

  /* PLAIN_THREE is documented in venue-copy.ts as "the three sentences a
     venue says to a couple", so its "we" is the venue and its "they" is the
     couple. Nothing else on the page uses that pair: everywhere else the
     venue is "you" and the founder is "I". Without this frame a partner
     reading the display line cold parses "We can see that they opened it" as
     Signal Studio watching the venue, the opposite of what the rung says.
     The frame therefore renders at reading size directly over the triple,
     not inside the 10px mono eyebrow: the page's biggest emotional claim
     must not hang its speaker on the page's smallest label. The eyebrow
     carries the bare numeral, the same grammar as every other chapter,
     and .manifestoNum redraws it in the relay number register (10px,
     --zinc-600, 0.16em, 24px drop) so the seven-numeral spine keeps one
     voice even where rung 02 breaks out of the relay grid. */
  manifestoEyebrow: "02",
  manifestoFrame: "What a venue says to a couple",

  eyebrow3: "The number, and its conditions",
  foot3: "One number → seventeen conditions",
  scaleTerm: "Across a year",
  vatTerm: "Is VAT on top",

  ledgerTitle: "The terms, in full",
  ledgerCount: "17 rows",
  ledgerGroups: [
    "The rate",
    "The couple’s workspace",
    "If it ends",
    "Your place, and theirs",
  ],

  eyebrow4: "Both halves, together",
  foot4: "What you see → what you never see",
  noNamesTerm: "Can we see who has not opened it",
  postponementTerm: "Does a date change show up",
  showUsTerm: "If a couple wants to show you something",

  filmMeta: "Reserved",

  eyebrow5: "One action, after they book",
  foot5: "One invitation → nothing to run",
  coordinatorTerm: "If it lands on the coordinator",
  notTechnicalTerm: "If nobody here is technical",
  reachesTerm: "How it reaches you",

  eyebrow6: "The term, and what outlives it",
  foot6: "The wedding → Keepsake",
  keepsakeTerm: "After the wedding",
  survivalTerm: "If your agreement ends",

  /* Not "One of twenty-five": that restated the rung's own h2 word for
     word, the only eyebrow that advanced nothing, at the page's emotional
     peak. This one does what its siblings do and names the rung's two
     objects: the rank of places, and the question "Nobody yet." answers. */
  eyebrow7: "The places, and who holds them",
  foot7: "Payment cleared → your number",
  roadmapTerm: "Where your requests go",
  notUsedTerm: "If your couples do not use it",
  whereTerm: "Where",

  closingProgramme: "The Founding 25",
  closingPlace: "Limerick, 2026",
} as const;

/**
 * The two ratified FAQ answers that say something no other sentence on this
 * page says. Looked up by question rather than by index, so a reorder of FAQ
 * cannot silently move an answer under the wrong term.
 */
const FAQ_BY_QUESTION = new Map(FAQ.map((entry) => [entry.q, entry.a]));
const SHOW_US_ANSWER = FAQ_BY_QUESTION.get(
  "What if a couple wants to show us something?",
);
const NOT_USED_ANSWER = FAQ_BY_QUESTION.get(
  "What if our couples just don't use it?",
);

/**
 * The ratified question whose answer opens "No." Rung 04's heading is a
 * statement, not a question, so without this frame the "No." is a one-beat
 * non-sequitur for a cold reader. Guarded like the two answers above: if the
 * question is ever reworded upstream, the frame disappears rather than
 * shipping a caption the FAQ of record no longer contains.
 */
const WORKSPACE_QUESTION = "Can we see the couple's workspace?";
const WORKSPACE_QUESTION_ON_RECORD = FAQ_BY_QUESTION.has(WORKSPACE_QUESTION);

/**
 * The ledger, grouped so it can be scanned as well as read. Row numbers stay
 * absolute, 01 through 17, because the rule is "all seventeen rows" and the
 * numbering is the proof of it. The slice boundaries follow the content:
 * rows 1-8 are the rate and what holds it, 9-12 are the couple's own
 * entitlement, 13-14 are the two ways it can end, 15-17 are the founding
 * place and the one row about the couple's side of the price.
 *
 * Row 01 is not in the first group's slice because it is rendered
 * separately, as the sticky row that pins the price over its sixteen
 * conditions. PRICE_ROW is the ratified pair itself; the figure span is
 * sliced from the row's own detail so the rendered text is provably the
 * constant, and if the detail ever stops opening with the figure the whole
 * sentence renders in the rest slot untouched.
 */
const PRICE_ROW = COMMERCIAL_SUMMARY[0];
const PRICE_ROW_FIGURE = PRICE_ROW[1].startsWith(PRICE_FOUNDING)
  ? PRICE_ROW[1].slice(0, PRICE_FOUNDING.length)
  : "";
const PRICE_ROW_REST = PRICE_ROW[1].slice(PRICE_ROW_FIGURE.length);

const LEDGER_GROUPS = [
  { label: COPY.ledgerGroups[0], rows: COMMERCIAL_SUMMARY.slice(1, 8), base: 1 },
  { label: COPY.ledgerGroups[1], rows: COMMERCIAL_SUMMARY.slice(8, 12), base: 8 },
  { label: COPY.ledgerGroups[2], rows: COMMERCIAL_SUMMARY.slice(12, 14), base: 12 },
  { label: COPY.ledgerGroups[3], rows: COMMERCIAL_SUMMARY.slice(14, 17), base: 14 },
] as const;

/** The postponement clause, sliced from the long form of the same term. */
const ACCESS_TERM_REST = ACCESS_TERM_LONG.startsWith(ACCESS_TERM)
  ? ACCESS_TERM_LONG.slice(ACCESS_TERM.length).trim()
  : "";

/** The twenty-five places. The first, and every fifth, is a major tick. */
const RANK = Array.from({ length: 25 }, (_, index) => index);
const RANK_SCALE = [1, 5, 10, 15, 20, 25];

/**
 * Split a ratified string after its first sentence, so a lead can be set in
 * display type and the remainder at reading size without retyping either.
 */
function splitLead(source: string): { lead: string; rest: string } {
  const at = source.indexOf(". ");
  if (at < 0) return { lead: source, rest: "" };
  return { lead: source.slice(0, at + 1), rest: source.slice(at + 2) };
}

/**
 * Word-internal straight apostrophes become the typographic U+2019 at render.
 * A glyph substitution, never an edit: wording, spacing and punctuation
 * structure are untouched, and a quote mark can never match the pattern
 * because it does not sit between two letters. The embedded product views
 * already set U+2019, so without this the page serves both glyphs within one
 * scroll. The verbatim-bound strings are unaffected in shape: the privacy
 * launch sentence and all seventeen commercial rows contain no apostrophe.
 */
function typeset(source: string): string {
  return source.replace(/(\p{L})'(\p{L})/gu, "$1’$2");
}

const TEAM_ASK_SPLIT = splitLead(TEAM_ASK);
const WHO_ELSE_SPLIT = splitLead(WHO_ELSE);
const CAN_WE_SEE_SPLIT = splitLead(CAN_WE_SEE);

/**
 * Wrap one exact substring of a ratified string in an accent span. The slices
 * are taken from `source` itself, never retyped, and a substring that is not
 * found returns the untouched string rather than silently dropping copy.
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
  title: "The Founding 25 · Signal Studio",
  description: OFFER_LINE,
  openGraph: {
    title: "The Founding 25 · Signal Studio",
    description: OFFER_LINE,
    type: "website",
  },
};

export default function VenuesLabA() {
  return (
    <>
      <main id="main" tabIndex={-1} className={styles.page}>
        {/* ── Hero · .reveal-hero .reveal-hero-v2 ────────────────── */}
        <section
          className="reveal-hero reveal-hero-v2"
          aria-labelledby="va-title"
        >
          <div className="reveal-hero-v2-inner">
            <h1 id="va-title" className="reveal-headline-v2">
              {accent(OFFER_LINE, "private", "reveal-headline-accent")}
            </h1>

            <p className="reveal-lede-v2">{ENTITLEMENT}</p>

            {/* Navigation, not a second ask. The one call to action lives in
                the close, after the ladder has earned it. This anchor exists
                because a partner reading the page cold needs a route to the
                number without six screens of scroll. It lands on rung 03
                itself, not on the ledger head: the promise is "what it costs,
                and every condition on it", so the reader arrives on the
                number with the seventeen rows under it, instead of past the
                number with the ledger title behind the sticky site nav. */}
            <div className="reveal-hero-actions">
              <a
                className="reveal-action reveal-action-secondary"
                href="#va-rung-3"
              >
                {COPY.heroJumpToTerms}
                <span aria-hidden>↓</span>
              </a>
            </div>
          </div>
        </section>

        {/* ── Relay, part one · .reveal-relay ────────────────────── */}
        <section className="reveal-relay" aria-labelledby="va-relay-title">
          <header className="reveal-relay-head">
            <p className="reveal-relay-kicker">{COPY.relayKicker}</p>
            <h2 id="va-relay-title">{COPY.relayHeading}</h2>

            {/* The contents, in the slot where the house head sets its
                reading matter, under the h2. OFFER_PARAGRAPH used to sit
                here, but it restated the hero's lede and repeated a 24-word
                clause of WHAT_COUPLES_GET verbatim one scroll later, so the
                head now holds the one thing only it can say: the order.
                These are the only links on the page that are not the ask,
                and each one lands on its rung. */}
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
                      href={`#va-rung-${index + 1}`}
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

          <div
            className="reveal-relay-source"
            aria-label="Sample workspace context"
          >
            <span>{COPY.sourceLabel}</span>
            <strong>{COPY.sourceCouple}</strong>
            <span aria-hidden>·</span>
            <span>{COPY.sourceVenue}</span>
            <span aria-hidden>·</span>
            <time dateTime={COPY.sourceDate}>{COPY.sourceDateLabel}</time>
          </div>

          {/* Rung 01 · what their couples get. The one rung whose answer is
              better shown than said: the display object is the product
              itself, twice, and the words stay at reading size beside it. */}
          <article
            className={`reveal-relay-chapter ${styles.rung}`}
            id="va-rung-1"
          >
            <div className="reveal-relay-copy reveal">
              <p className="reveal-relay-number">01</p>
              <h2 className={styles.rungQ}>{LADDER[0]}</h2>
              <p className="reveal-relay-eyebrow">{COPY.eyebrow1}</p>
              <p className={styles.rungBody}>{WHAT_COUPLES_GET}</p>
              <p className="reveal-relay-foot">{COPY.foot1}</p>
            </div>

            <div className={styles.previewStack}>
              <div className="reveal-relay-preview" data-product="timeline">
                <p className="reveal-relay-sample">{COPY.sampleView}</p>
                <TimelineTheLine embedded timeline={VENUE_TIMELINE_FIXTURE} />
              </div>

              <div className="reveal-relay-preview" data-product="signal">
                <p className="reveal-relay-sample">{COPY.sampleView}</p>
                <SignalTheRead
                  embedded
                  items={VENUE_SIGNAL_ITEMS}
                  venue={COPY.sourceVenue}
                />
              </div>

              {/* The embedded views' motion primitives serve their initial
                  state as inline opacity and transform. With scripting
                  disabled that state would be final and the timeline card's
                  header copy would never appear. Scoped to the preview
                  frames; nothing the page itself authors hides behind
                  script. The :not() guard excludes decimal opacities: the
                  timeline's decorative metric sweep ships at opacity:0.32,
                  which the bare substring "opacity:0" also matches, and
                  rescuing it to full opacity un-designed it in no-JS. */}
              <noscript>
                <style>{`.reveal-relay-preview [style*="opacity:0"]:not([style*="opacity:0."]){opacity:1 !important;transform:none !important}`}</style>
              </noscript>
            </div>
          </article>
        </section>

        {/* ── Rung 02 · whose it is · .reveal-manifesto ───────────
            Trust is won here, and it comes before price, so it breaks out
            of the relay and takes the page's biggest statement: the middle
            of the three sentences a venue says to a couple, the one that
            settles the whole question. */}
        <section
          className={`reveal-manifesto reveal ${styles.rung}`}
          id="va-rung-2"
          aria-labelledby="va-whose"
        >
          <div className={`reveal-manifesto-eyebrow ${styles.manifestoNum}`}>
            {COPY.manifestoEyebrow}
          </div>

          <h2 id="va-whose" className={styles.rungQ}>
            {LADDER[1]}
          </h2>

          {/* The speaker, at reading size over the whole triple, adjacent
              enough that a display-skim reader who lands on the 67px line
              catches it one glance up. */}
          <p className={styles.answerFrame}>{COPY.manifestoFrame}</p>

          <p className="reveal-manifesto-body">{PLAIN_THREE[0]}</p>
          <p className={`${styles.answerLg} reveal`}>
            {accent(PLAIN_THREE[1], "cannot", "em")}
          </p>
          <p className="reveal-manifesto-body">{PLAIN_THREE[2]}</p>

          {/* WHY_NOT_CHARGE_COUPLES is founder voice, venue as "you". It
              used to render as a fourth paragraph under the frame above,
              inside the triple's "we/us" register, so a cold reader hit
              "something you gave them" mid-paragraph and had to re-derive
              the speaker. It lives in the index instead: every index row
              on the page is the founder answering a venue's question, so
              the object's own grammar carries the voice change, and the
              question the sentence answers is finally on the page. The
              term is the constant's own name in venue-copy.ts ("Why the
              couple never pays. Objection A2."), not a new claim. */}
          <dl className={`${styles.index} ${styles.indexAfter}`}>
            <IndexRow
              term="Why the couple never pays"
              detail={WHY_NOT_CHARGE_COUPLES}
            />
            <IndexRow term="Whose name goes on it" detail={BRANDING} />
            <IndexRow
              term="Who else the couple can bring in"
              detail={COLLABORATION}
            />
          </dl>
        </section>

        {/* ── Relay, part two · .reveal-relay ────────────────────── */}
        <div className="reveal-relay">
          {/* Rung 03 · what it costs. The number is the rung's display
              answer, and it never travels without its conditions: the
              sticky bar carries the ratified price sentence over the whole
              of the ledger's scroll. */}
          <article
            className={`reveal-relay-chapter ${styles.rung}`}
            id="va-rung-3"
          >
            <div className="reveal-relay-copy reveal">
              <p className="reveal-relay-number">03</p>
              <h2 className={styles.rungQ}>{LADDER[2]}</h2>
              <p className="reveal-relay-eyebrow">{COPY.eyebrow3}</p>
              <p className={styles.rungBody}>{FOUNDING_RATE.difference}</p>
              <p className="reveal-relay-foot">{COPY.foot3}</p>
            </div>

            <div className="reveal">
              <p className={styles.priceFigure}>{PRICE_FOUNDING}</p>

              <dl className={styles.index}>
                <IndexRow term={COPY.scaleTerm} detail={PER_WEDDING_SCALE} />
                <IndexRow term={COPY.vatTerm} detail={VAT_ANSWER} />
              </dl>
            </div>

            <section className={styles.spanBlock} aria-labelledby="va-ledger">
              <div className={styles.wideHead}>
                <h3 className={styles.wideTitle} id="va-ledger">
                  {COPY.ledgerTitle}
                </h3>
                <span className={styles.wideMeta}>{COPY.ledgerCount}</span>
              </div>

              {/* The rule, made physical: while any of the seventeen rows
                  is on screen, so is the number and its VAT clause. The
                  mechanism IS ledger row 01, rendered as a direct child of
                  the block that spans all four groups: a sticky element
                  travels only within its parent, so nesting the row inside
                  the first group would let the price scroll away after row
                  08. Standing above the groups it reads, at rest, as the
                  row that governs all of them; scrolled, it pins under the
                  site nav and the sixteen conditions pass beneath their
                  own price. One object, both jobs, and it needs no
                  animation support to be correct. */}
              {/* The dl itself carries the sticky position: a sticky element
                  travels only within its parent, and a wrapper exactly one
                  row tall would give it zero travel. As a direct child of
                  the spanBlock, its travel is the whole ledger. */}
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
            </section>
          </article>

          {/* Rung 04 · what you see, and what you never see. The display
              answer is the refusal itself. The film sits here because what
              it shows is exactly this rung's sentence: what a couple opens,
              and what you see. */}
          <article
            className={`reveal-relay-chapter ${styles.rung}`}
            id="va-rung-4"
          >
            <div className="reveal-relay-copy reveal">
              <p className="reveal-relay-number">04</p>
              <h2 className={styles.rungQ}>{LADDER[3]}</h2>
              <p className="reveal-relay-eyebrow">{COPY.eyebrow4}</p>
              <p className="reveal-relay-foot">{COPY.foot4}</p>
            </div>

            <div>
              {/* The rung's heading is a statement, so the ratified question
                  from the FAQ of record supplies the "Can we see" that the
                  "No." answers. Rung 07 pulls the same opening and the rank
                  visual supplies its question; here the question itself
                  does. */}
              {WORKSPACE_QUESTION_ON_RECORD ? (
                <p className={styles.answerFrame}>
                  {typeset(WORKSPACE_QUESTION)}
                </p>
              ) : null}
              {/* The display answer is the word "No.", one beat, the same
                  splitLead treatment as "One action." and "Nobody yet.":
                  the full 96-character sentence at the 48px register ran
                  four display lines in the page's densest chapter and the
                  refusal lost its snap. The remainder, including the
                  "You cannot", continues at reading size on the same left
                  edge; the .em marker stays with rung 02's display
                  "cannot", the page's one highlighted word per screen. */}
              <p className={`${styles.answer} reveal`}>
                {CAN_WE_SEE_SPLIT.lead}
              </p>
              <p className={styles.answerRest}>{CAN_WE_SEE_SPLIT.rest}</p>

              {/* Three parts, one object, because they travel together. */}
              <dl className={`${styles.index} ${styles.indexGroup}`}>
                <IndexRow term={PRIVACY.seeLabel} detail={PRIVACY.see} />
                <IndexRow term={PRIVACY.neverLabel} detail={PRIVACY.never} />
                <IndexRow term={PRIVACY.launchLabel} detail={PRIVACY.launch} />
              </dl>

              <dl className={`${styles.index} ${styles.indexAfter}`}>
                <IndexRow term={COPY.noNamesTerm} detail={NO_NAMES} />
                <IndexRow term={COPY.showUsTerm} detail={SHOW_US_ANSWER} />
                <IndexRow term={COPY.postponementTerm} detail={POSTPONEMENT} />
              </dl>
            </div>

            <section className={styles.spanBlock} aria-labelledby="va-film">
              <div className={styles.mediaGrid}>
                <div className={styles.mediaHead}>
                  <div className={styles.wideHead}>
                    <h3 className={styles.wideTitle} id="va-film">
                      {FILM.label}
                    </h3>
                    <span className={styles.wideMeta}>{COPY.filmMeta}</span>
                  </div>
                  <p className={styles.filmNote}>{FILM.note}</p>
                </div>

                <FilmSlot />
              </div>
            </section>
          </article>

          {/* Rung 05 · what it asks of your team. No product view and no
              large object: there is nothing for the team to run, and the
              quietest rung on the page is the proof of the sentence. */}
          <article
            className={`reveal-relay-chapter ${styles.rung}`}
            id="va-rung-5"
          >
            <div className="reveal-relay-copy reveal">
              <p className="reveal-relay-number">05</p>
              <h2 className={styles.rungQ}>{LADDER[4]}</h2>
              <p className="reveal-relay-eyebrow">{COPY.eyebrow5}</p>
              <p className="reveal-relay-foot">{COPY.foot5}</p>
            </div>

            <div>
              <p className={`${styles.answer} reveal`}>{TEAM_ASK_SPLIT.lead}</p>
              <p className={styles.answerRest}>{TEAM_ASK_SPLIT.rest}</p>

              <dl className={`${styles.index} ${styles.indexAfter}`}>
                <IndexRow term={COPY.coordinatorTerm} detail={COORDINATOR} />
                <IndexRow term={COPY.notTechnicalTerm} detail={NOT_TECHNICAL} />
                <IndexRow term={COPY.reachesTerm} detail={HOW_IT_REACHES_YOU} />
              </dl>
            </div>
          </article>

          {/* Rung 06 · what happens at the end. The display answer is the
              term itself, in full, because the bare figure is the one thing
              this page must never say. It is set one step under the spoken
              answers, in its own register: a 91-character contract sentence
              at the 48px register ran four display lines and gave rungs 05
              and 06 the same composed shape twice in a row. */}
          <article
            className={`reveal-relay-chapter ${styles.rung}`}
            id="va-rung-6"
          >
            <div className="reveal-relay-copy reveal">
              <p className="reveal-relay-number">06</p>
              <h2 className={styles.rungQ}>{LADDER[5]}</h2>
              <p className="reveal-relay-eyebrow">{COPY.eyebrow6}</p>
              <p className="reveal-relay-foot">{COPY.foot6}</p>
            </div>

            <div>
              <p className={`${styles.answerTerm} reveal`}>
                {accent(ACCESS_TERM, "whichever is later", "em")}
              </p>
              {ACCESS_TERM_REST ? (
                <p className={styles.answerRest}>{ACCESS_TERM_REST}</p>
              ) : null}

              <dl className={`${styles.index} ${styles.indexAfter}`}>
                <IndexRow term={COPY.keepsakeTerm} detail={KEEPSAKE} />
                <IndexRow term={COPY.survivalTerm} detail={SURVIVAL} />
              </dl>
            </div>
          </article>

          {/* Rung 07 · what being one of twenty-five means. The rank is the
              page's one authored object: twenty-five places drawn as a
              measure, every one of them open, standing directly over the
              two words that admit why. */}
          <article
            className={`reveal-relay-chapter ${styles.rung}`}
            id="va-rung-7"
          >
            <div className="reveal-relay-copy reveal">
              <p className="reveal-relay-number">07</p>
              <h2 className={styles.rungQ}>{LADDER[6]}</h2>
              <p className="reveal-relay-eyebrow">{COPY.eyebrow7}</p>
              <p className={styles.rungBody}>{FOUNDING_NUMBER}</p>
              <p className="reveal-relay-foot">{COPY.foot7}</p>
            </div>

            <div className={styles.rankColumn}>
              <div className={styles.rank} aria-hidden>
                <div className={styles.rankTicks}>
                  {RANK.map((index) => (
                    <span
                      className={styles.rankTick}
                      data-major={
                        index === 0 || (index + 1) % 5 === 0 ? "" : undefined
                      }
                      key={index}
                      style={{ "--i": index } as CSSProperties}
                    />
                  ))}
                </div>
                <div className={styles.rankScale}>
                  {RANK_SCALE.map((place) => (
                    <span key={place} style={{ "--n": place } as CSSProperties}>
                      {String(place).padStart(2, "0")}
                    </span>
                  ))}
                </div>
              </div>

              <p className={`${styles.answerLg} reveal`}>
                {WHO_ELSE_SPLIT.lead}
              </p>
              <p className={styles.answerRest}>{WHO_ELSE_SPLIT.rest}</p>

              <dl className={`${styles.index} ${styles.indexAfter}`}>
                <IndexRow term={COPY.roadmapTerm} detail={ROADMAP} />
                <IndexRow term={COPY.notUsedTerm} detail={NOT_USED_ANSWER} />
                <IndexRow term={COPY.whereTerm} detail={GEOGRAPHY} />
              </dl>
            </div>
          </article>
        </div>

        {/* ── The ask · .reveal-closing. One for the whole page, and the
            page ends on the person it reaches, not on a deadline. The
            14-day hold is stated once, in ledger row 15, where it belongs
            among the other conditions. ─────────────────────────────── */}
        <section className="reveal-closing reveal" aria-labelledby="va-ask">
          <div className="reveal-closing-rule" aria-hidden />
          <h2 id="va-ask" className="reveal-closing-sign">
            {accent(CTA_SUPPORT, "to me", "em")}
          </h2>

          <div className="reveal-closing-cta">
            <Link className="reveal-cta reveal-cta-primary" href={CTA_HREF}>
              {CTA}
              <span className="cta-arrow" aria-hidden>
                {" "}
                →
              </span>
            </Link>
          </div>

          <p className="reveal-closing-addr">
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

/**
 * One term and its answer.
 *
 * `detail` is optional because the two answers lifted out of the FAQ are
 * looked up by their ratified question string. A row whose answer cannot be
 * found renders nothing rather than an empty rule, so a rename upstream can
 * never ship a term with no answer under it.
 */
function IndexRow({ term, detail }: { term: string; detail?: string }) {
  if (!detail) return null;
  return (
    <div className={styles.indexRow}>
      <dt className={styles.indexTerm}>{typeset(term)}</dt>
      <dd className={styles.indexDetail}>{typeset(detail)}</dd>
    </div>
  );
}
