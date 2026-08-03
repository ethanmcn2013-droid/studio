/**
 * ═══════════════════════════════════════════════════════════════════
 * Variant C · "The Terms"
 *
 * THE THESIS. Three people read this page. The one nobody designs for is
 * the business partner it gets forwarded to, who never saw the covering
 * email and has to make sense of it cold. This variant is built for that
 * reader: the offer stated completely, in the open, with nothing held
 * back for a sales call.
 *
 * The governing commercial rule is the design. "A price never travels
 * without its conditions. If a surface can carry the number, it can carry
 * this block." Most companies bury the seventeen-row schedule in a
 * footer. Here it is the centrepiece — a real ledger with the price
 * pinned to the top of it, so the number physically cannot leave its
 * conditions while you read them — and the twelve questions are open by
 * default, because a forwarded reader will not click twelve disclosures.
 *
 * The boldness is in INFORMATION DESIGN, not in visual register. The
 * visual register is the house style: .reveal-* classes from globals.css,
 * the real product surfaces inside .reveal-relay-preview, one indigo
 * moment per view, no new colour ground, no serif, system widths only.
 *
 * ORDER. The seven rungs run 1 to 7 in order and nothing is reordered.
 * The twelve questions are not a rung, and they now sit between rung 6 and
 * rung 7 so that the page's largest sentence is also its last: the page
 * answers everything, then admits it has no customers yet, then asks one
 * thing. It no longer peaks and then talks for two more screens.
 *
 * COPY. Every sentence of substance is imported from src/lib/venue-copy.ts
 * and rendered whole. This file writes only structural furniture: rung
 * markers, chapter eyebrows, chapter feet, index labels and the four
 * cluster labels on the schedule. Two ratified strings have one phrase
 * sliced out at render time by indexOf so it can take a different weight
 * (the H1's accent word, and the lead of TEAM_ASK); the string is still
 * the source in both cases and cannot drift.
 *
 * FOUNDING_RATE.lock and FOUNDING_RATE.property are deliberately not
 * rendered. They are a permitted form, not a required one, and the
 * schedule states the same two facts in its own ratified wording at
 * "What holds it" and "If the venue is sold". Printing both put ~230
 * characters of near-duplicate on the page's centrepiece.
 * ═══════════════════════════════════════════════════════════════════
 */

import type { Metadata } from "next";
import Link from "next/link";

import { SiteFooter } from "@/components/landing/site-footer";
import { SignalTheRead } from "@/components/marketing/heroes/signal/the-read";
import { TimelineTheLine } from "@/components/marketing/heroes/timeline/the-line";
import { ProductSignatureWordmark } from "@/components/reveal/product-signature-wordmark";

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
  NOT_TECHNICAL,
  NO_NAMES,
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
  WHAT_COUPLES_GET,
  WHO_ELSE,
  WHY_NOT_CHARGE_COUPLES,
} from "@/lib/venue-copy";

import { TERMS_SIGNAL_ITEMS, TERMS_TIMELINE_FIXTURE } from "./fixtures";
import { LivePreview } from "./live-preview";
import s from "./terms.module.css";

export const metadata: Metadata = {
  title: "The Founding 25 · Signal Studio",
  description: OFFER_LINE,
};

/**
 * The three parts of PRIVACY, kept as one array so they can only ever be
 * rendered together and so the index can count them rather than assert a
 * number by hand. The third part spans the grid; it is still the same
 * array, still contiguous, still all three.
 */
const PRIVACY_PARTS = [
  { label: PRIVACY.seeLabel, text: PRIVACY.see },
  { label: PRIVACY.neverLabel, text: PRIVACY.never },
  { label: PRIVACY.launchLabel, text: PRIVACY.launch },
] as const;

const QUESTIONS_LABEL = "The questions";

/**
 * The seventeen rows, clustered into the four things a reader is actually
 * asking about. Only the start index of each cluster is written down; every
 * cluster takes everything up to the next one, and the last takes the
 * remainder, so the table always renders COMMERCIAL_SUMMARY in full and in
 * order however the array changes. Labels are wayfinding, not copy.
 */
const CLUSTER_STARTS = [
  { label: "The rate", at: 0 },
  { label: "The couple’s term", at: 8 },
  { label: "What survives", at: 12 },
  /* Not "Your place": the first row in this cluster is called that, and a
     label repeating its own first row reads as a stutter. "The Founding
     25" is the ratified term for exactly what these rows describe. */
  { label: "The Founding 25", at: 14 },
] as const;

const SCHEDULE_CLUSTERS = CLUSTER_STARTS.map((cluster, i) => ({
  label: cluster.label,
  rows: COMMERCIAL_SUMMARY.slice(
    cluster.at,
    CLUSTER_STARTS[i + 1]?.at ?? COMMERCIAL_SUMMARY.length,
  ),
})).filter((cluster) => cluster.rows.length > 0);

/**
 * The contents, in page order. The number column carries the rung number,
 * so the questions — which are not a rung — carry none. The tag column is
 * derived from the ratified data, never typed, so the promise the index
 * makes cannot drift away from what the page actually carries.
 */
const INDEX = [
  { n: "01", label: LADDER[0], href: "#c-couples", tag: null },
  { n: "02", label: LADDER[1], href: "#c-whose", tag: null },
  {
    n: "03",
    label: LADDER[2],
    href: "#c-cost",
    tag: `${COMMERCIAL_SUMMARY.length} rows`,
  },
  {
    n: "04",
    label: LADDER[3],
    href: "#c-privacy",
    tag: `${PRIVACY_PARTS.length} parts`,
  },
  { n: "05", label: LADDER[4], href: "#c-team", tag: null },
  { n: "06", label: LADDER[5], href: "#c-end", tag: null },
  {
    n: null,
    label: QUESTIONS_LABEL,
    href: "#c-questions",
    tag: `${FAQ.length} answered`,
  },
  { n: "07", label: LADDER[6], href: "#c-founding", tag: null },
] as const;

/**
 * Slices one phrase out of a ratified string so it can take a different
 * weight or colour without the sentence being retyped. If the phrase is
 * ever edited out of the source the string still renders in full, just
 * without the emphasis.
 */
function Emphasis({
  text,
  phrase,
  className,
}: {
  text: string;
  phrase: string;
  className: string;
}) {
  const at = text.indexOf(phrase);
  if (at < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, at)}
      <span className={className}>{text.slice(at, at + phrase.length)}</span>
      {text.slice(at + phrase.length)}
    </>
  );
}

export default function VenuesLabC() {
  return (
    <>
      <main id="main" tabIndex={-1}>
        {/* ── Hero · .reveal-hero-v2 · 1120 ───────────────────────── */}
        <section className="reveal-hero reveal-hero-v2" aria-labelledby="c-title">
          <div className="reveal-hero-v2-inner">
            <h1 id="c-title" className="reveal-headline-v2">
              <Emphasis
                text={OFFER_LINE}
                phrase="every"
                className="reveal-headline-accent"
              />
            </h1>

            <p className="reveal-lede-v2">{OFFER_PARAGRAPH}</p>

            {/* Navigation, not a second ask. The one call to action lives in
                the close, after the ladder has earned it: the ratified copy
                source states that a second CTA is a defect, not an option.
                This anchor exists because a partner reading the page cold
                needs a route to the number without six screens of scroll. */}
            <div className="reveal-hero-actions">
              <a className="reveal-action reveal-action-secondary" href="#c-cost">
                What it costs, and every condition on it
                <span aria-hidden>↓</span>
              </a>
            </div>

            {/* The house mono rail, carrying what the page holds. Every
                figure is counted off the ratified data at render time. */}
            <p className="reveal-sequence">
              <span>{LADDER.length} sections</span>
              <span aria-hidden>·</span>
              <span>{COMMERCIAL_SUMMARY.length} rows of terms</span>
              <span aria-hidden>·</span>
              <span>{FAQ.length} questions answered</span>
            </p>
          </div>
        </section>

        {/* ── The index · early, not late · holds the hero's 1120 ──
            A contents page: number, label, hairline leader, count. It
            keeps the hero measure rather than stepping in 20px, so the
            page makes one deliberate step from 1120 to 1080 at the first
            section rather than a stagger that reads as an error. */}
        <nav className={s.index} aria-label="Contents">
          <p className="reveal-relay-kicker">Contents</p>
          <ol className={s.indexList}>
            {INDEX.map((row) => (
              <li key={row.label}>
                <a className={s.indexRow} href={row.href}>
                  <span className={`reveal-relay-number ${s.indexNumber}`}>
                    {row.n}
                  </span>
                  <span className={s.indexLabel}>{row.label}</span>
                  <span className={s.indexLeader} aria-hidden />
                  {row.tag ? (
                    <span className="reveal-relay-foot">{row.tag}</span>
                  ) : null}
                  <span className={s.indexArrow} aria-hidden>
                    ↓
                  </span>
                </a>
              </li>
            ))}
          </ol>
        </nav>

        {/* ── Rung 1 · what their couples get · 1240 ──────────────── */}
        <section
          id="c-couples"
          className={`reveal-relay ${s.relay}`}
          aria-labelledby="c-couples-h"
        >
          <header className="reveal-relay-head reveal">
            <p className="reveal-relay-kicker">Rung 01 of seven</p>
            <h2 id="c-couples-h">{LADDER[0]}</h2>
            <p>{WHAT_COUPLES_GET}</p>
          </header>

          {/* Provenance for both product views. It carries the morning as
              well as the date, because the Signal chapter below is
              captioned "the note in the morning" and the component's own
              dateline is suppressed here (see terms.module.css). */}
          <div className="reveal-relay-source" aria-label="Sample workspace context">
            <span>Sample workspace</span>
            <strong>Mara and Finn</strong>
            <span aria-hidden>·</span>
            <span>Glenmara House</span>
            <span aria-hidden>·</span>
            <time dateTime="2026-07-29T09:00">Wednesday 29 July, 09:00</time>
          </div>

          <article className="reveal-relay-chapter" data-product="timeline">
            <div className="reveal-relay-copy">
              <p className="reveal-relay-number">01</p>
              <h3>
                <ProductSignatureWordmark product="timeline" />
              </h3>
              <p className="reveal-relay-eyebrow">The plan they can share</p>
              <p className="reveal-relay-body">{COLLABORATION}</p>
              <p className="reveal-relay-foot">
                Their plan → family and suppliers
              </p>
            </div>

            <LivePreview product="timeline" sample="Sample product view">
              <TimelineTheLine embedded timeline={TERMS_TIMELINE_FIXTURE} />
            </LivePreview>
          </article>

          <article className="reveal-relay-chapter" data-product="signal">
            <div className="reveal-relay-copy">
              <p className="reveal-relay-number">02</p>
              <h3>
                <ProductSignatureWordmark product="signal" />
              </h3>
              <p className="reveal-relay-eyebrow">The note in the morning</p>
              <p className="reveal-relay-body">{PLAIN_THREE[1]}</p>
              <p className="reveal-relay-foot">
                Their briefing → the couple only
              </p>
            </div>

            {/* s.signalPreview suppresses this component's hardcoded
                off-canon dateline stamp. See terms.module.css. */}
            <LivePreview
              product="signal"
              sample="Sample product view"
              className={s.signalPreview}
            >
              <SignalTheRead
                embedded
                items={TERMS_SIGNAL_ITEMS}
                venue="Glenmara House"
              />
            </LivePreview>
          </article>

          {/* The film. No file exists; the slot is reserved at 16:9 and
              shown in the state the founder will see it in. It carries a
              registration mark, not a play control: a forwarded partner
              must never press something that cannot answer. When the
              master lands, the poster field below becomes
              <video poster preload="none" playsInline> with a
              <track kind="captions" srcLang="en" src="....vtt" />, and
              nothing around it has to move. */}
          <article className="reveal-relay-chapter">
            <div className="reveal-relay-copy">
              <p className="reveal-relay-number">03</p>
              <h3>{FILM.label}</h3>
              <p className="reveal-relay-eyebrow">Not yet rendered</p>
              <p className="reveal-relay-body">{FILM.note}</p>
              <p className="reveal-relay-foot">
                {FILM.aspect} · poster first · never autoplay
              </p>
            </div>

            <div className="reveal-relay-preview" data-product="film">
              <p className="reveal-relay-sample">Film slot</p>
              <div className={s.filmStage}>
                <div
                  className={s.filmPoster}
                  style={{ aspectRatio: FILM.aspect }}
                  role="img"
                  aria-label={FILM.posterAlt}
                >
                  <span className={s.filmMark} aria-hidden />
                </div>
                <p className={s.filmText}>{FILM.placeholder}</p>
              </div>
            </div>
          </article>
        </section>

        {/* ── Rung 2 · whose it is · 1080 ─────────────────────────── */}
        <section id="c-whose" className={s.band} aria-labelledby="c-whose-h">
          <header className="reveal-relay-head reveal">
            <p className="reveal-relay-kicker">Rung 02 of seven</p>
            <h2 id="c-whose-h">{LADDER[1]}</h2>
            <p>{BRANDING}</p>
          </header>

          <div className={s.rows}>
            {PLAIN_THREE.map((line, i) => (
              <div className={`${s.rowsItem} reveal`} key={line}>
                <p className="reveal-relay-number">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <p>{line}</p>
              </div>
            ))}
          </div>

          {/* A coda, not an orphan: it takes the section's own left edge
              and a full-width rule, so it reads as the section closing
              rather than as a paragraph that missed the column. */}
          <p className={s.coda}>{WHY_NOT_CHARGE_COUPLES}</p>
        </section>

        {/* ── Rung 3 · what it costs · the ledger · 1080 ───────────
            The page's one invented object. The price is pinned to the top
            of the schedule, so on any screen tall enough it is impossible
            to read a condition without the number in view, and impossible
            to read the number without the conditions under it. */}
        <section id="c-cost" className={s.band} aria-labelledby="c-cost-h">
          <header className="reveal-relay-head reveal">
            <p className="reveal-relay-kicker">Rung 03 of seven</p>
            <h2 id="c-cost-h">{LADDER[2]}</h2>
            <p>{FOUNDING_RATE.difference}</p>
          </header>

          <div className={s.ledger}>
            {/* The one indigo moment in this view, drawn directly above
                the number as the ledger enters. */}
            <span className="manifesto-rule" aria-hidden />

            <div className={s.priceBar}>
              <p className={s.price}>{PRICE_FOUNDING}</p>
              <div className={s.priceCol}>
                <p className="reveal-relay-eyebrow">The founding rate</p>
                <p className={s.priceLine}>{FOUNDING_RATE.price}</p>
              </div>
            </div>

            <table className={s.schedule}>
              <caption className={s.scheduleCaption}>
                The commercial summary · {COMMERCIAL_SUMMARY.length} rows,
                complete
              </caption>
              {/* The term column ends exactly on the page spine, so the
                  value column starts on the same axis as every other
                  content column on the page. See --rail. */}
              <colgroup>
                <col className={s.colTerm} />
                <col />
              </colgroup>
              {SCHEDULE_CLUSTERS.map((cluster) => (
                <tbody key={cluster.label}>
                  <tr className={s.clusterRow}>
                    <th scope="rowgroup" colSpan={2}>
                      {cluster.label}
                    </th>
                  </tr>
                  {cluster.rows.map(([term, value]) => (
                    <tr className={s.row} key={term}>
                      <th scope="row">{term}</th>
                      <td>
                        <span className={s.value}>{value}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              ))}
            </table>

            {/* The one permitted arithmetic sentence, on the ledger's own
                value axis, so it reads as a note on the schedule rather
                than a fourth left edge in the section. */}
            <p className={s.scaleNote}>{PER_WEDDING_SCALE}</p>
          </div>
        </section>

        {/* ── Rung 4 · what you see, and what you never see · 1080 ──
            The coordinator's kill question, so it gets the page's most
            legible promise: display labels, body at the same size the
            operational copy gets, and the see / never-see pair set
            against each other across one rule. */}
        <section id="c-privacy" className={s.band} aria-labelledby="c-privacy-h">
          <header className="reveal-relay-head reveal">
            <p className="reveal-relay-kicker">Rung 04 of seven</p>
            <h2 id="c-privacy-h">{LADDER[3]}</h2>
            <p>{CAN_WE_SEE}</p>
          </header>

          <div className={s.promises}>
            {PRIVACY_PARTS.map((part, i) => (
              <div
                className={`${s.promise} ${i === 2 ? s.promiseWide : ""} reveal`}
                key={part.label}
              >
                <p className={s.promiseLabel}>{part.label}</p>
                <p className={s.promiseText}>{part.text}</p>
              </div>
            ))}

            <div className={`${s.promise} ${s.promiseAfter} reveal`}>
              <p className={s.promiseLabel}>No per-couple row</p>
              <p className={s.promiseText}>{NO_NAMES}</p>
            </div>
            <div className={`${s.promise} ${s.promiseAfter} reveal`}>
              <p className={s.promiseLabel}>A change of date</p>
              <p className={s.promiseText}>{POSTPONEMENT}</p>
            </div>
          </div>
        </section>

        {/* ── Rung 5 · what it asks of your team · 1080 ────────────
            The ask itself is the display type, not a lede under the
            heading, because this is the section the coordinator reads. */}
        <section id="c-team" className={s.band} aria-labelledby="c-team-h">
          <header className="reveal-relay-head reveal">
            <p className="reveal-relay-kicker">Rung 05 of seven</p>
            <h2 id="c-team-h">{LADDER[4]}</h2>
          </header>

          <p className={`${s.ask} reveal`}>
            <Emphasis text={TEAM_ASK} phrase="One action." className={s.askLead} />
          </p>

          <div className={s.notes}>
            <div className={`${s.note} reveal`}>
              <p className={s.noteLabel}>The coordinator</p>
              <p className={s.noteText}>{COORDINATOR}</p>
            </div>
            <div className={`${s.note} reveal`}>
              <p className={s.noteLabel}>Nothing to learn</p>
              <p className={s.noteText}>{NOT_TECHNICAL}</p>
            </div>
            <div className={`${s.note} reveal`}>
              <p className={s.noteLabel}>How it reaches you</p>
              <p className={s.noteText}>{HOW_IT_REACHES_YOU}</p>
            </div>
          </div>
        </section>

        {/* ── Rung 6 · what happens at the end · 1080 ─────────────── */}
        <section id="c-end" className={s.band} aria-labelledby="c-end-h">
          <header className="reveal-relay-head reveal">
            <p className="reveal-relay-kicker">Rung 06 of seven</p>
            <h2 id="c-end-h">{LADDER[5]}</h2>
            <p>{ACCESS_TERM_LONG}</p>
          </header>

          <div className={`${s.ending} reveal`}>
            <p>{KEEPSAKE}</p>
            <p>{SURVIVAL}</p>
          </div>
        </section>

        {/* ── The questions · all twelve answers open · 1080 ───────
            Not a rung, so it does not disturb the ladder, and placed
            before rung 7 so the page's largest sentence is also its
            last. Two up, at the size the rest of the page is set in;
            this is the reference layer, not the fine print. */}
        <section
          id="c-questions"
          className={s.band}
          aria-labelledby="c-questions-h"
        >
          <header className="reveal-relay-head reveal">
            <p className="reveal-relay-kicker">
              {FAQ.length} questions · every answer in full
            </p>
            <h2 id="c-questions-h">{QUESTIONS_LABEL}</h2>
            <p>{CTA_SUPPORT}</p>
          </header>

          <div className={s.faq}>
            {FAQ.map((item) => {
              /* The last question is the one the next section exists to
                 answer. Printing WHO_ELSE here at 16px and again at 92px
                 four hundred pixels later would be the same sentence
                 twice in one screen, so the question stands and the
                 climax answers it. Nothing is dropped: the answer is on
                 the page in full, in the largest type on it. */
              const answeredByClimax = item.a === WHO_ELSE;
              return (
                <div
                  className={`${s.faqCell} ${answeredByClimax ? s.faqHinge : ""} reveal`}
                  key={item.q}
                >
                  <h3 className={s.faqQ}>{item.q}</h3>
                  {answeredByClimax ? (
                    <a className={s.faqHingeLink} href="#c-founding">
                      Answered below
                      <span aria-hidden> ↓</span>
                    </a>
                  ) : (
                    <p className={s.faqA}>{item.a}</p>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* ── Rung 7 · one of twenty-five · the climax · 1000 ──────
            Its own measure and its own size, so it cannot be mistaken
            for a seventh routine section: 92px against the sections'
            74px, under the hero's 104px. The biggest type on the page is
            the page admitting it has no customers yet. For this audience
            that is the strongest thing it can say, and it is now the
            last thing said. */}
        <section
          id="c-founding"
          className={`reveal-manifesto ${s.anchor}`}
          aria-labelledby="c-founding-h"
        >
          <div className="reveal-manifesto-eyebrow">
            Rung 07 of seven <span className="gold">·</span> {LADDER[6]}
          </div>
          <h2
            id="c-founding-h"
            className={`reveal-manifesto-h2 ${s.climaxH2}`}
          >
            {WHO_ELSE}
          </h2>
          <p className="reveal-manifesto-body">{FOUNDING_NUMBER}</p>
          <p className="reveal-manifesto-body">{ROADMAP}</p>
          <p className="reveal-manifesto-body">{HOLD}</p>
        </section>

        {/* ── Closing · .reveal-closing · one call to action · 760 ── */}
        <section className="reveal-closing">
          <div className="reveal-closing-rule" aria-hidden />
          <p className="reveal-closing-sign">{ENTITLEMENT}</p>

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
            <a href="mailto:hello@signalstudio.ie">hello@signalstudio.ie</a>
            <span className="sep" aria-hidden>
              ·
            </span>
            <span>{GEOGRAPHY}</span>
          </p>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
