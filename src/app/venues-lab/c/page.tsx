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
 * footer. Here it is the centrepiece, and the twelve questions are open
 * by default, because a forwarded reader will not click twelve
 * disclosures.
 *
 * The boldness is in INFORMATION DESIGN, not in visual register. The
 * visual register is the house style: .reveal-* classes from globals.css,
 * the real product surfaces inside .reveal-relay-preview, one indigo
 * moment per view, no new colour ground, no serif, system widths only.
 *
 * COPY. Every sentence of substance is imported from src/lib/venue-copy.ts
 * and rendered whole. This file writes only structural furniture: rung
 * markers, chapter eyebrows, chapter feet and index labels. The ladder
 * runs 1 to 7 in order. Nothing is reordered and nothing is paraphrased.
 * The one place a ratified string is not rendered as a single node is the
 * H1, where the accent word is sliced out of OFFER_LINE at render time by
 * indexOf, so the string is still the source and cannot drift.
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
import s from "./terms.module.css";

export const metadata: Metadata = {
  title: "The Founding 25 · Signal Studio",
  description: OFFER_LINE,
};

/**
 * The three parts of PRIVACY, kept as one array so they can only ever be
 * rendered together and so the index can count them rather than assert a
 * number by hand.
 */
const PRIVACY_PARTS = [
  { label: PRIVACY.seeLabel, text: PRIVACY.see },
  { label: PRIVACY.neverLabel, text: PRIVACY.never },
  { label: PRIVACY.launchLabel, text: PRIVACY.launch },
] as const;

const QUESTIONS_LABEL = "The questions";

/**
 * The contents. Seven rungs in ladder order, then the questions. The tag
 * column is derived from the ratified data, never typed, so the promise
 * the index makes ("seventeen rows, twelve answers") cannot drift away
 * from what the page actually carries.
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
  { n: "07", label: LADDER[6], href: "#c-founding", tag: null },
  {
    n: "08",
    label: QUESTIONS_LABEL,
    href: "#c-questions",
    tag: `${FAQ.length} answered`,
  },
] as const;

/**
 * Slices one word out of a ratified string so it can take
 * .reveal-headline-accent without the sentence being retyped. If the word
 * is ever edited out of the source the headline still renders in full,
 * just without the accent.
 */
function AccentWord({ text, word }: { text: string; word: string }) {
  const at = text.indexOf(word);
  if (at < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, at)}
      <span className="reveal-headline-accent">
        {text.slice(at, at + word.length)}
      </span>
      {text.slice(at + word.length)}
    </>
  );
}

export default function VenuesLabC() {
  return (
    <>
      <main id="main" tabIndex={-1}>
        {/* ── Hero · .reveal-hero .reveal-hero-v2 ─────────────────── */}
        <section className="reveal-hero reveal-hero-v2" aria-labelledby="c-title">
          <div className="reveal-hero-v2-inner">
            <h1 id="c-title" className="reveal-headline-v2">
              <AccentWord text={OFFER_LINE} word="every" />
            </h1>

            <p className="reveal-lede-v2">{OFFER_PARAGRAPH}</p>

            <div className="reveal-hero-actions">
              <Link
                className="reveal-action reveal-action-primary"
                href={CTA_HREF}
              >
                {CTA}
                <span aria-hidden>→</span>
              </Link>
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

        {/* ── The index · early, not late ─────────────────────────── */}
        <nav className={s.index} aria-label="Contents">
          <p className="reveal-relay-kicker">Contents</p>
          <ol className={s.indexList}>
            {INDEX.map((row) => (
              <li key={row.n}>
                <a className={s.indexRow} href={row.href}>
                  <span className="reveal-relay-number">{row.n}</span>
                  <span className={s.indexLabel}>{row.label}</span>
                  <span className="reveal-relay-foot">{row.tag}</span>
                  <span className={s.indexArrow} aria-hidden>
                    ↓
                  </span>
                </a>
              </li>
            ))}
          </ol>
        </nav>

        {/* ── Rung 1 · what their couples get ─────────────────────── */}
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

          <div className="reveal-relay-source" aria-label="Sample workspace context">
            <span>Sample workspace</span>
            <strong>Mara and Finn</strong>
            <span aria-hidden>·</span>
            <span>Glenmara House</span>
            <span aria-hidden>·</span>
            <time dateTime="2026-07-30">30 July</time>
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

            <div className="reveal-relay-preview" data-product="timeline">
              <p className="reveal-relay-sample">Sample product view</p>
              <TimelineTheLine embedded timeline={TERMS_TIMELINE_FIXTURE} />
            </div>
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
            <div
              className={`reveal-relay-preview ${s.signalPreview}`}
              data-product="signal"
            >
              <p className="reveal-relay-sample">Sample product view</p>
              <SignalTheRead embedded items={TERMS_SIGNAL_ITEMS} />
            </div>
          </article>

          {/* The film. No file exists; the slot is reserved at 16:9 and
              shown in the state the founder will see it in. When the
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
                  <span className={s.filmMark} aria-hidden>
                    <svg viewBox="0 0 12 14" focusable="false">
                      <path d="M1 1l10 6-10 6z" fill="currentColor" />
                    </svg>
                  </span>
                </div>
                <p className={s.filmText}>{FILM.placeholder}</p>
              </div>
            </div>
          </article>
        </section>

        {/* ── Rung 2 · whose it is ────────────────────────────────── */}
        <section
          id="c-whose"
          className={s.band}
          aria-labelledby="c-whose-h"
        >
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

          <p className={s.lede}>{WHY_NOT_CHARGE_COUPLES}</p>
        </section>

        {/* ── Rung 3 · what it costs · the centrepiece ────────────── */}
        <section id="c-cost" className={s.band} aria-labelledby="c-cost-h">
          {/* The house accent rule, drawn as the terms arrive. This is the
              one indigo moment in this view. */}
          <span className="manifesto-rule" aria-hidden />

          <header className="reveal-relay-head reveal">
            <p className="reveal-relay-kicker">Rung 03 of seven</p>
            <h2 id="c-cost-h">{LADDER[2]}</h2>
            <p>{FOUNDING_RATE.difference}</p>
          </header>

          <div className={`${s.rate} reveal`}>
            <p className={s.price}>{PRICE_FOUNDING}</p>
            <div className={s.rateCol}>
              <p className="reveal-relay-eyebrow">The founding rate</p>
              <ul className={s.rateLines}>
                <li>{FOUNDING_RATE.price}</li>
                <li>{FOUNDING_RATE.lock}</li>
                <li>{FOUNDING_RATE.property}</li>
              </ul>
            </div>
          </div>

          <p className={s.scale}>{PER_WEDDING_SCALE}</p>

          {/* The seventeen rows. The price above never travels without
              them, so they are not a footnote and not a disclosure. */}
          <div
            className="reveal-relay-source"
            id="c-schedule-cap"
          >
            <span>The commercial summary</span>
            <strong>{COMMERCIAL_SUMMARY.length} rows</strong>
            <span aria-hidden>·</span>
            <span>complete</span>
          </div>

          <div className={`${s.scheduleWrap} reveal`}>
            <table className={s.schedule} aria-labelledby="c-schedule-cap">
              <tbody>
                {COMMERCIAL_SUMMARY.map(([term, value]) => (
                  <tr key={term}>
                    <th scope="row" className="reveal-relay-eyebrow">
                      {term}
                    </th>
                    <td>{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ── Rung 4 · what you see, and what you never see ───────── */}
        <section
          id="c-privacy"
          className={s.band}
          aria-labelledby="c-privacy-h"
        >
          <header className="reveal-relay-head reveal">
            <p className="reveal-relay-kicker">Rung 04 of seven</p>
            <h2 id="c-privacy-h">{LADDER[3]}</h2>
            <p>{CAN_WE_SEE}</p>
          </header>

          <div className={`${s.cols3} reveal`}>
            {PRIVACY_PARTS.map((part) => (
              <div key={part.label}>
                <p className="reveal-relay-eyebrow">{part.label}</p>
                <p className="reveal-relay-body">{part.text}</p>
              </div>
            ))}
          </div>

          <div className={s.rows}>
            <div className={`${s.rowsItem} reveal`}>
              <p className="reveal-relay-eyebrow">No per-couple row</p>
              <p>{NO_NAMES}</p>
            </div>
            <div className={`${s.rowsItem} reveal`}>
              <p className="reveal-relay-eyebrow">A change of date</p>
              <p>{POSTPONEMENT}</p>
            </div>
          </div>
        </section>

        {/* ── Rung 5 · what it asks of your team ──────────────────── */}
        <section id="c-team" className={s.band} aria-labelledby="c-team-h">
          <header className="reveal-relay-head reveal">
            <p className="reveal-relay-kicker">Rung 05 of seven</p>
            <h2 id="c-team-h">{LADDER[4]}</h2>
            <p>{TEAM_ASK}</p>
          </header>

          <div className={s.rows}>
            <div className={`${s.rowsItem} reveal`}>
              <p className="reveal-relay-eyebrow">The coordinator</p>
              <p>{COORDINATOR}</p>
            </div>
            <div className={`${s.rowsItem} reveal`}>
              <p className="reveal-relay-eyebrow">Nothing to learn</p>
              <p>{NOT_TECHNICAL}</p>
            </div>
            <div className={`${s.rowsItem} reveal`}>
              <p className="reveal-relay-eyebrow">How it reaches you</p>
              <p>{HOW_IT_REACHES_YOU}</p>
            </div>
          </div>
        </section>

        {/* ── Rung 6 · what happens at the end ────────────────────── */}
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

        {/* ── Rung 7 · one of twenty-five · .reveal-manifesto ─────── */}
        <section
          id="c-founding"
          className={`reveal-manifesto ${s.anchor}`}
          aria-labelledby="c-founding-h"
        >
          <div className="reveal-manifesto-eyebrow">
            Rung 07 of seven <span className="gold">·</span> {LADDER[6]}
          </div>
          {/* The biggest type on the page is the page admitting it has no
              customers yet. For this audience that is the strongest thing
              it can say, and it is said before it is asked. */}
          <h2 id="c-founding-h" className="reveal-manifesto-h2">
            {WHO_ELSE}
          </h2>
          <p className="reveal-manifesto-body">{FOUNDING_NUMBER}</p>
          <p className="reveal-manifesto-body">{ROADMAP}</p>
          <p className="reveal-manifesto-body">{HOLD}</p>
        </section>

        {/* ── The questions · all twelve answers open ─────────────── */}
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
            {FAQ.map((item, i) => (
              <div className={`${s.faqRow} reveal`} key={item.q}>
                <div>
                  <p className="reveal-relay-number">
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <h3 className={s.faqQ}>{item.q}</h3>
                </div>
                <p className={s.faqA}>{item.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Closing · .reveal-closing · one call to action ──────── */}
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
