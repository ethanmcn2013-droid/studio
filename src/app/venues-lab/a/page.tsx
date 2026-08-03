import { Fragment, type ReactNode } from "react";
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
 * comes from `venue-a.module.css`, which exists only for the five objects the
 * house has no shape for. The header of that file lists them and quotes the
 * register each one borrows.
 *
 * COPY. Every claim, price, term and answer is imported from
 * `src/lib/venue-copy.ts`. The strings in COPY below are connective only:
 * section labels, the two headings that carry the compositional turn, and the
 * mono furniture. They are gathered in one place so a voice pass can read
 * them in a single sitting. No sentence here restates a ratified claim.
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

  sourceLabel: "Sample workspace",
  sourceCouple: "Mara and Finn",
  sourceVenue: "Glenmara House",
  sourceDateLabel: "27 July",
  sourceDate: "2026-07-27",

  railLabel: "The seven questions this page answers, in order",
  sampleView: "Sample product view",

  eyebrow1: "What lands with the couple",
  foot1: "A booking → their wedding workspace",

  manifestoEyebrow: "Rung 02",

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

  filmMeta: "Placeholder",

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
  whoElseTerm: "Who else is using it",
  whereTerm: "Where",

  faqNumber: "12 questions",
  faqTitle: "Questions",
  faqEyebrow: "Everything else, in one place",

  closingPlace: "Limerick, 2026",
} as const;

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

            <div className="reveal-hero-actions">
              <Link
                className="reveal-action reveal-action-primary"
                href={CTA_HREF}
              >
                {CTA}
                <span aria-hidden>→</span>
              </Link>
            </div>

            {/* The homepage's Notes → Tasks → Timeline → Signal rail,
                repurposed: the same device naming the seven rungs this
                page climbs. Even-numbered spans are the arrows, which is
                where .reveal-sequence puts its indigo. */}
            <p className="reveal-sequence" aria-label={COPY.railLabel}>
              {LADDER.map((rung, index) => (
                <Fragment key={rung}>
                  {index > 0 ? <span aria-hidden>→</span> : null}
                  <span>{rung}</span>
                </Fragment>
              ))}
            </p>
          </div>
        </section>

        {/* ── Relay, part one · .reveal-relay ────────────────────── */}
        <section className="reveal-relay" aria-labelledby="va-relay-title">
          <header className="reveal-relay-head">
            <p className="reveal-relay-kicker">{COPY.relayKicker}</p>
            <h2 id="va-relay-title">{COPY.relayHeading}</h2>
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
          <article className="reveal-relay-chapter">
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
                <p className="reveal-relay-sample">{COPY.sampleView}</p>
                <SignalTheRead embedded items={VENUE_SIGNAL_ITEMS} />
              </div>
            </div>
          </article>
        </section>

        {/* ── Rung 02 · whose it is · .reveal-manifesto ───────────
            Trust is won here, and it comes before price, so it breaks out
            of the relay and takes the page's one big statement. */}
        <section className="reveal-manifesto reveal" aria-labelledby="va-whose">
          <div className="reveal-manifesto-eyebrow">
            {COPY.manifestoEyebrow} <span className="gold">·</span>{" "}
            {LADDER[1]}
          </div>
          <h2 id="va-whose" className="reveal-manifesto-h2">
            {accent(PLAIN_THREE[1], "cannot", "em")}
          </h2>
          <p className="reveal-manifesto-body">{PLAIN_THREE[0]}</p>
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
          {/* Rung 03 · what it costs */}
          <article className="reveal-relay-chapter">
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
                <IndexRow
                  term={COPY.holdsTerm}
                  detail={FOUNDING_RATE.lock}
                />
                <IndexRow
                  term={COPY.propertyTerm}
                  detail={FOUNDING_RATE.property}
                />
                <IndexRow term={COPY.scaleTerm} detail={PER_WEDDING_SCALE} />
                <IndexRow term={COPY.vatTerm} detail={VAT_ANSWER} />
              </dl>
            </div>
          </article>

          {/* The price never travels without its conditions. All 17 rows,
              at relay width, on the .reveal-relay-chapter column ratio. */}
          <section
            className={`${styles.wideRow} reveal`}
            aria-labelledby="va-ledger"
          >
            <div className={styles.wideHead}>
              <h3 className={styles.wideTitle} id="va-ledger">
                {COPY.ledgerTitle}
              </h3>
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

          {/* Rung 04 · what you see, and what you never see */}
          <article className="reveal-relay-chapter">
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
                <IndexRow
                  term={COPY.postponementTerm}
                  detail={POSTPONEMENT}
                />
              </dl>
            </div>
          </article>

          {/* The film, in the same chrome as the product views. */}
          <section
            className={`${styles.wideRow} reveal`}
            aria-labelledby="va-film"
          >
            <div className={styles.wideHead}>
              <h3 className={styles.wideTitle} id="va-film">
                {FILM.label}
              </h3>
              <span className={styles.wideMeta}>{COPY.filmMeta}</span>
            </div>

            <FilmSlot />
            <p className={styles.filmNote}>{FILM.note}</p>
          </section>

          {/* Rung 05 · what it asks of your team. No product view: there is
              nothing for the team to run, and showing a surface here would
              contradict the sentence beside it. */}
          <article className="reveal-relay-chapter">
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
          <article className="reveal-relay-chapter">
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

          {/* Rung 07 · what being one of twenty-five means */}
          <article className="reveal-relay-chapter">
            <div className="reveal-relay-copy reveal">
              <p className="reveal-relay-number">07</p>
              <h3>{LADDER[6]}</h3>
              <p className="reveal-relay-eyebrow">{COPY.eyebrow7}</p>
              <p className="reveal-relay-body">{FOUNDING_NUMBER}</p>
              <p className="reveal-relay-foot">{COPY.foot7}</p>
            </div>

            <dl className={styles.index}>
              <IndexRow term={COPY.roadmapTerm} detail={ROADMAP} />
              <IndexRow term={COPY.whoElseTerm} detail={WHO_ELSE} />
              <IndexRow term={COPY.whereTerm} detail={GEOGRAPHY} />
            </dl>
          </article>

          {/* The FAQ of record. Twelve questions, as a definition list, so
              the page outline stays the seven rungs. */}
          <article className="reveal-relay-chapter">
            <div className="reveal-relay-copy reveal">
              <p className="reveal-relay-number">{COPY.faqNumber}</p>
              <h3>{COPY.faqTitle}</h3>
              <p className="reveal-relay-eyebrow">{COPY.faqEyebrow}</p>
            </div>

            <dl className={styles.index}>
              {FAQ.map((entry) => (
                <div className={styles.indexRow} key={entry.q}>
                  <dt className={styles.indexTermPlain}>{entry.q}</dt>
                  <dd className={styles.indexDetail}>{entry.a}</dd>
                </div>
              ))}
            </dl>
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

/** One term and its answer, on the .reveal-relay-chapter column ratio. */
function IndexRow({ term, detail }: { term: string; detail: string }) {
  return (
    <div className={styles.indexRow}>
      <dt className={styles.indexTerm}>{term}</dt>
      <dd className={styles.indexDetail}>{detail}</dd>
    </div>
  );
}
