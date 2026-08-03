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
  OFFER_PARAGRAPH,
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
 * STRUCTURE. Exactly seven h3 rungs, in ladder order, each with an id the
 * contents in the relay head can reach. The 17-row ledger lives inside rung
 * 03 because it is the price's conditions; the reserved film frame lives
 * inside rung 04 because the film is what a couple opens and what you see.
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
     Signal Studio watching the venue, the opposite of what the rung says. */
  manifestoEyebrow: "Rung 02",
  manifestoFrame: "What a venue says to a couple",

  eyebrow3: "The number, and its conditions",
  foot3: "One number → seventeen conditions",
  scaleTerm: "Across a year",
  vatTerm: "Is VAT on top",

  ledgerTitle: "The terms, in full",
  ledgerCount: "17 rows",
  ledgerGroups: [
    "The rate",
    "The couple's workspace",
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

  eyebrow7: "One of twenty-five",
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
 * The ledger, grouped so it can be scanned as well as read. Row numbers stay
 * absolute, 01 through 17, because the rule is "all seventeen rows" and the
 * numbering is the proof of it. The slice boundaries follow the content:
 * rows 1-8 are the rate and what holds it, 9-12 are the couple's own
 * entitlement, 13-14 are the two ways it can end, 15-17 are the founding
 * place and the one row about the couple's side of the price.
 */
const LEDGER_GROUPS = [
  { label: COPY.ledgerGroups[0], rows: COMMERCIAL_SUMMARY.slice(0, 8), base: 0 },
  { label: COPY.ledgerGroups[1], rows: COMMERCIAL_SUMMARY.slice(8, 12), base: 8 },
  { label: COPY.ledgerGroups[2], rows: COMMERCIAL_SUMMARY.slice(12, 14), base: 12 },
  { label: COPY.ledgerGroups[3], rows: COMMERCIAL_SUMMARY.slice(14, 17), base: 14 },
] as const;

/**
 * The sticky bar's two halves, sliced from the ratified price sentence so the
 * rendered text is provably the constant. If the sentence ever stops opening
 * with the figure, the whole sentence renders in the rest slot untouched.
 */
const PRICE_SENTENCE_REST = FOUNDING_RATE.price.startsWith(PRICE_FOUNDING)
  ? FOUNDING_RATE.price.slice(PRICE_FOUNDING.length).trim()
  : FOUNDING_RATE.price;

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

const TEAM_ASK_SPLIT = splitLead(TEAM_ASK);
const WHO_ELSE_SPLIT = splitLead(WHO_ELSE);

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
                number without six screens of scroll. */}
            <div className="reveal-hero-actions">
              <a
                className="reveal-action reveal-action-secondary"
                href="#va-ledger"
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

            {/* The contents, in the left column the house grammar leaves
                empty. These are the only links on the page that are not the
                ask, and each one lands on its rung. */}
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

            <p>{OFFER_PARAGRAPH}</p>
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
              <h3 className={styles.rungQ}>{LADDER[0]}</h3>
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
          <div className="reveal-manifesto-eyebrow">
            {COPY.manifestoEyebrow} <span className="gold">·</span>{" "}
            {COPY.manifestoFrame}
          </div>

          <h3 id="va-whose" className={styles.rungQ}>
            {LADDER[1]}
          </h3>

          <p className="reveal-manifesto-body">{PLAIN_THREE[0]}</p>
          <p className={`${styles.answerLg} reveal`}>
            {accent(PLAIN_THREE[1], "cannot", "em")}
          </p>
          <p className="reveal-manifesto-body">{PLAIN_THREE[2]}</p>
          <p className="reveal-manifesto-body">{WHY_NOT_CHARGE_COUPLES}</p>

          <dl className={`${styles.index} ${styles.indexAfter}`}>
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
              <h3 className={styles.rungQ}>{LADDER[2]}</h3>
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
                <h4 className={styles.wideTitle} id="va-ledger">
                  {COPY.ledgerTitle}
                </h4>
                <span className={styles.wideMeta}>{COPY.ledgerCount}</span>
              </div>

              {/* The rule, made physical: while any of the seventeen rows
                  is on screen, so is the number and its VAT clause. */}
              <div className={styles.stickyBar}>
                <span className={styles.stickyFigure}>{PRICE_FOUNDING}</span>
                <span className={styles.stickyRest}>{PRICE_SENTENCE_REST}</span>
              </div>

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
              <h3 className={styles.rungQ}>{LADDER[3]}</h3>
              <p className="reveal-relay-eyebrow">{COPY.eyebrow4}</p>
              <p className="reveal-relay-foot">{COPY.foot4}</p>
            </div>

            <div>
              <p className={`${styles.answer} reveal`}>
                {accent(CAN_WE_SEE, "cannot", "em")}
              </p>

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
                    <h4 className={styles.wideTitle} id="va-film">
                      {FILM.label}
                    </h4>
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
              <h3 className={styles.rungQ}>{LADDER[4]}</h3>
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
              this page must never say. */}
          <article
            className={`reveal-relay-chapter ${styles.rung}`}
            id="va-rung-6"
          >
            <div className="reveal-relay-copy reveal">
              <p className="reveal-relay-number">06</p>
              <h3 className={styles.rungQ}>{LADDER[5]}</h3>
              <p className="reveal-relay-eyebrow">{COPY.eyebrow6}</p>
              <p className="reveal-relay-foot">{COPY.foot6}</p>
            </div>

            <div>
              <p className={`${styles.answer} reveal`}>
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
              <h3 className={styles.rungQ}>{LADDER[6]}</h3>
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
      <dt className={styles.indexTerm}>{term}</dt>
      <dd className={styles.indexDetail}>{detail}</dd>
    </div>
  );
}
