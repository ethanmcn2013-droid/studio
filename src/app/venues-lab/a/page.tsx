import type { CSSProperties, ReactNode } from "react";
import type { Metadata } from "next";
import Link from "next/link";

import { SiteFooter } from "@/components/landing/site-footer";
import { SignalTheRead } from "@/components/marketing/heroes/signal/the-read";
import { TimelineTheLine } from "@/components/marketing/heroes/timeline/the-line";

import {
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
  HOLD,
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
 * Venues lab · variant A · "The Relay".
 *
 * The landing page's signature structure, the product relay, pointed at the
 * venue. On the homepage the relay follows one detail through four products.
 * Here it follows the venue's own argument down the seven rungs, and the real
 * product appears only where a rung is better shown than told.
 *
 * Every class on this page is a `.reveal-*` class from globals.css unless it
 * comes from `venue-a.module.css`, which exists only for the objects the house
 * has no shape for. The header of that file lists them and quotes the register
 * each one borrows.
 *
 * COPY. Every claim, price, term and answer is imported from
 * `src/lib/venue-copy.ts`. The strings in COPY below are connective only:
 * section labels, the frame that tells a cold reader whose voice a sentence is
 * in, and the mono furniture. They are gathered in one place so a voice pass
 * can read them in a single sitting. No sentence here restates a ratified
 * claim.
 *
 * STRUCTURE. Exactly seven h3 rungs, in ladder order, each with an id the
 * contents in the relay head can reach. Two page-level objects that belong to
 * a rung rather than to the page sit inside that rung's chapter and span both
 * of its columns: the 17-row ledger inside rung 03, because it is the price's
 * conditions, and the reserved film frame inside rung 04, because the film is
 * what a couple opens and what a venue sees. Nothing else competes with the
 * seven.
 *
 * THE FAQ OF RECORD. Twelve questions are ratified; ten of their answers were
 * already set on this page word for word, so repeating them as a thirteenth
 * two-column block before the single ask cost 523 words and roughly 1,700px to
 * say nothing new. The two answers that are NOT stated anywhere else are kept,
 * each placed in the rung that raises the question. Every one of the twelve is
 * therefore still answered on the page, and the page is 400 words shorter for
 * it. This is a selection call, not a copy edit, and it is reversible in one
 * commit.
 *
 * NOT INSTRUMENTED. There is no page-view recorder in this repo:
 * `src/lib/venue-edition-analytics` does not resolve, `src/lib/tracking.ts`
 * is a URL query-param builder rather than an event recorder, and the live
 * `/venues` route is a server component with no analytics call. Rather than
 * invent an API, this page ships without instrumentation and the gap is
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
  /* The Signal frame's own label carries the timestamp, because the shared
     component's dateline stamp is off-canon and is suppressed in the module
     CSS. Three ratified strings claim the briefing arrives in the morning;
     this is the page's proof of it. */
  sampleSignal: "Sample product view · Wednesday, 09:00",

  eyebrow1: "What lands with the couple",
  foot1: "A booking → their wedding workspace",

  /* PLAIN_THREE is documented in venue-copy.ts as "the three sentences a venue
     says to a couple", so its "we" is the venue and its "they" is the couple.
     Nothing else on the page uses that pair: everywhere else the venue is
     "you" and the founder is "I". Without this frame a partner reading the
     display line cold parses "We can see that they opened it" as Signal Studio
     watching the venue, which is the opposite of what the rung says. */
  manifestoEyebrow: "Rung 02",
  manifestoFrame: "What a venue says to a couple",

  eyebrow3: "The number, and its conditions",
  foot3: "One number → seventeen conditions",
  holdsTerm: "What holds the rate",
  propertyTerm: "If the venue is sold",
  scaleTerm: "Across a year",
  vatTerm: "Is VAT on top",

  ledgerTitle: "The terms, in full",
  ledgerCount: "17 rows",

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
  accessTerm: "How long they have it",
  survivalTerm: "If your agreement ends",

  eyebrow7: "One of twenty-five",
  foot7: "Payment cleared → your number",
  roadmapTerm: "Where your requests go",
  notUsedTerm: "If your couples do not use it",
  whereTerm: "Where",

  closingPlace: "Limerick, 2026",
} as const;

/**
 * The two ratified FAQ answers that say something no other sentence on this
 * page says. Looked up by question rather than by index, so a reorder of FAQ
 * cannot silently move an answer under the wrong term.
 *
 * "How many couples does it cover?" is not among them, though it reads like a
 * third: its first sentence is ENTITLEMENT almost word for word and its second
 * is the opening sentence of PER_WEDDING_SCALE verbatim, and both of those are
 * already set, one in the hero lede and one in rung 03. Carrying it would have
 * put a verbatim repeat in the row directly under its own source.
 */
const FAQ_BY_QUESTION = new Map(FAQ.map((entry) => [entry.q, entry.a]));
const SHOW_US_ANSWER = FAQ_BY_QUESTION.get(
  "What if a couple wants to show us something?",
);
const NOT_USED_ANSWER = FAQ_BY_QUESTION.get(
  "What if our couples just don't use it?",
);

/** The twenty-five places. The first, and every fifth, is a major tick. */
const RANK = Array.from({ length: 25 }, (_, index) => index);
const RANK_SCALE = [1, 5, 10, 15, 20, 25];

/**
 * Wrap one exact substring of a ratified string in an accent span.
 *
 * The point is that the rendered text is provably the constant: the slices
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
                the close, after the ladder has earned it: the ratified copy
                source states that a second CTA is a defect, not an option.
                This anchor exists because a partner reading the page cold
                needs a route to the number without six screens of scroll. */}
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
                empty. A forwarded reader who never saw the email opens this
                page to find out what it costs, and that answer is six screens
                down. These are the only links on the page that are not the
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

          {/* Rung 01 · what their couples get. The one rung that promises
              two things, so it carries two product views. */}
          <article
            className={`reveal-relay-chapter ${styles.rung}`}
            id="va-rung-1"
          >
            <div className="reveal-relay-copy reveal">
              <p className="reveal-relay-number">01</p>
              <h3>{LADDER[0]}</h3>
              <p className="reveal-relay-eyebrow">{COPY.eyebrow1}</p>
              <p className="reveal-relay-body">{WHAT_COUPLES_GET}</p>
              <p className="reveal-relay-foot">{COPY.foot1}</p>
            </div>

            <div className={styles.previewStack}>
              <div className="reveal-relay-preview" data-product="timeline">
                <p className="reveal-relay-sample">{COPY.sampleView}</p>
                <TimelineTheLine embedded timeline={VENUE_TIMELINE_FIXTURE} />
              </div>

              <div className="reveal-relay-preview" data-product="signal">
                <p className="reveal-relay-sample">{COPY.sampleSignal}</p>
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
            of the relay and takes the page's one big statement. The three
            sentences run in their ratified order, and the middle one, the
            one that settles the whole question, gets the display register
            the other six rungs give only to their questions. */}
        <section
          className={`reveal-manifesto reveal ${styles.rung}`}
          id="va-rung-2"
          aria-labelledby="va-whose"
        >
          <div className="reveal-manifesto-eyebrow">
            {COPY.manifestoEyebrow} <span className="gold">·</span>{" "}
            {COPY.manifestoFrame}
          </div>

          <h3 id="va-whose" className={styles.rungHead}>
            {LADDER[1]}
          </h3>

          <p className="reveal-manifesto-body">{PLAIN_THREE[0]}</p>
          <p className={styles.answer}>
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
          {/* Rung 03 · what it costs. The price never travels without its
              conditions, so all 17 rows sit inside this chapter, spanning
              both of its columns and on its exact column ratio. */}
          <article
            className={`reveal-relay-chapter ${styles.rung}`}
            id="va-rung-3"
          >
            <div className="reveal-relay-copy reveal">
              <p className="reveal-relay-number">03</p>
              <h3>{LADDER[2]}</h3>
              <p className="reveal-relay-eyebrow">{COPY.eyebrow3}</p>
              <p className="reveal-relay-body">{FOUNDING_RATE.difference}</p>
              <p className="reveal-relay-foot">{COPY.foot3}</p>
            </div>

            <div>
              <p className={styles.priceFigure}>{PRICE_FOUNDING}</p>
              <p className={styles.priceUnder}>{FOUNDING_RATE.price}</p>

              <dl className={styles.index}>
                <IndexRow term={COPY.holdsTerm} detail={FOUNDING_RATE.lock} />
                <IndexRow
                  term={COPY.propertyTerm}
                  detail={FOUNDING_RATE.property}
                />
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

              <dl className={styles.ledger}>
                {COMMERCIAL_SUMMARY.map(([term, detail], index) => (
                  <div className={styles.ledgerRow} key={term}>
                    <dt className={styles.ledgerTerm}>
                      <span className={styles.ledgerNum} aria-hidden>
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span>{term}</span>
                    </dt>
                    <dd className={styles.ledgerDetail}>{detail}</dd>
                  </div>
                ))}
              </dl>
            </section>
          </article>

          {/* Rung 04 · what you see, and what you never see. The film sits
              here because what it shows is exactly this rung's sentence:
              what a couple opens, and what you see. */}
          <article
            className={`reveal-relay-chapter ${styles.rung}`}
            id="va-rung-4"
          >
            <div className="reveal-relay-copy reveal">
              <p className="reveal-relay-number">04</p>
              <h3>{LADDER[3]}</h3>
              <p className="reveal-relay-eyebrow">{COPY.eyebrow4}</p>
              <p className="reveal-relay-body">{CAN_WE_SEE}</p>
              <p className="reveal-relay-foot">{COPY.foot4}</p>
            </div>

            <div>
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

          {/* Rung 05 · what it asks of your team. No product view: there is
              nothing for the team to run, and showing a surface here would
              contradict the sentence beside it. */}
          <article
            className={`reveal-relay-chapter ${styles.rung}`}
            id="va-rung-5"
          >
            <div className="reveal-relay-copy reveal">
              <p className="reveal-relay-number">05</p>
              <h3>{LADDER[4]}</h3>
              <p className="reveal-relay-eyebrow">{COPY.eyebrow5}</p>
              <p className="reveal-relay-body">{TEAM_ASK}</p>
              <p className="reveal-relay-foot">{COPY.foot5}</p>
            </div>

            <dl className={styles.index}>
              <IndexRow term={COPY.coordinatorTerm} detail={COORDINATOR} />
              <IndexRow term={COPY.notTechnicalTerm} detail={NOT_TECHNICAL} />
              <IndexRow term={COPY.reachesTerm} detail={HOW_IT_REACHES_YOU} />
            </dl>
          </article>

          {/* Rung 06 · what happens at the end */}
          <article
            className={`reveal-relay-chapter ${styles.rung}`}
            id="va-rung-6"
          >
            <div className="reveal-relay-copy reveal">
              <p className="reveal-relay-number">06</p>
              <h3>{LADDER[5]}</h3>
              <p className="reveal-relay-eyebrow">{COPY.eyebrow6}</p>
              <p className="reveal-relay-body">{KEEPSAKE}</p>
              <p className="reveal-relay-foot">{COPY.foot6}</p>
            </div>

            <dl className={styles.index}>
              <IndexRow term={COPY.accessTerm} detail={ACCESS_TERM_LONG} />
              <IndexRow term={COPY.survivalTerm} detail={SURVIVAL} />
            </dl>
          </article>

          {/* Rung 07 · what being one of twenty-five means. The rank is the
              page's one authored object: twenty-five places drawn as a
              measure, every one of them open, standing directly over the
              ratified answer that says so in words. */}
          <article
            className={`reveal-relay-chapter ${styles.rung}`}
            id="va-rung-7"
          >
            <div className="reveal-relay-copy reveal">
              <p className="reveal-relay-number">07</p>
              <h3>{LADDER[6]}</h3>
              <p className="reveal-relay-eyebrow">{COPY.eyebrow7}</p>
              <p className="reveal-relay-body">{FOUNDING_NUMBER}</p>
              <p className="reveal-relay-foot">{COPY.foot7}</p>
            </div>

            <div>
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

              <p className={styles.answer}>
                {accent(WHO_ELSE, "Nobody yet.", "em")}
              </p>

              <dl className={styles.index}>
                <IndexRow term={COPY.roadmapTerm} detail={ROADMAP} />
                <IndexRow term={COPY.notUsedTerm} detail={NOT_USED_ANSWER} />
                <IndexRow term={COPY.whereTerm} detail={GEOGRAPHY} />
              </dl>
            </div>
          </article>
        </div>

        {/* ── The ask · .reveal-closing. One for the whole page. ─── */}
        <section className="reveal-closing reveal" aria-labelledby="va-ask">
          <div className="reveal-closing-rule" aria-hidden />
          <h2 id="va-ask" className="reveal-closing-sign">
            {accent(HOLD, "14 days", "em")}
          </h2>

          <p className={styles.closeSupport}>{CTA_SUPPORT}</p>

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
            <span>{GEOGRAPHY}</span>
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
 * `detail` is optional because the three answers lifted out of the FAQ are
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
