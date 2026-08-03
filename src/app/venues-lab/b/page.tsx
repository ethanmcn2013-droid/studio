import type { Metadata } from "next";
import Link from "next/link";

import { SiteFooter } from "@/components/landing/site-footer";
import { HOMEPAGE_RELAY_TIMELINE_FIXTURE } from "@/components/marketing/heroes/timeline/fixture";
import { TimelineTheLine } from "@/components/marketing/heroes/timeline/the-line";
import { VENUE_SITE_TRACKING, withTracking } from "@/lib/tracking";
import {
  BRANDING,
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
  LADDER,
  NOT_TECHNICAL,
  OFFER_LINE,
  OFFER_PARAGRAPH,
  PER_WEDDING_SCALE,
  PLAIN_THREE,
  PRICE_FOUNDING,
  PRICE_STANDARD,
  PRIVACY,
  ROADMAP,
  TEAM_ASK,
  WHAT_COUPLES_GET,
  WHO_ELSE,
  WHY_NOT_CHARGE_COUPLES,
} from "@/lib/venue-copy";

import { FilmSlot } from "./film-slot";

/**
 * Venue landing page · variant B · "The Name".
 *
 * THE THESIS
 * A venue is buying one moment: its name, said once, at the top of a real
 * couple's real wedding plan. So the page puts that moment directly under the
 * hero, at full scale, in the product chrome the rest of the site already
 * uses, and then spends the whole ladder descending from that one image. The
 * restraint is the product, not a limitation of it.
 *
 * HOUSE GRAMMAR
 * The page is built from the composed classes in src/app/globals.css and the
 * shipped product components, not from a private visual language:
 *
 *   hero      .reveal-hero.reveal-hero-v2 / .reveal-headline-v2 /
 *             .reveal-headline-accent / .reveal-lede-v2 /
 *             .reveal-hero-actions / .reveal-action-primary / .reveal-sequence
 *   sections  .reveal-relay (1240) / .reveal-relay-head / .reveal-relay-kicker
 *   the rule  .reveal-manifesto (1080) — the page's biggest type
 *   product   .reveal-relay-preview / .reveal-relay-sample /
 *             .reveal-relay-source / .reveal-relay-chapter /
 *             .reveal-relay-copy / -number / -eyebrow / -body / -foot
 *   closing   .reveal-closing / .reveal-closing-rule / -sign / -cta / -addr
 *   motion    .reveal — the house's own scroll-driven, baseline-visible,
 *             zero-JS reveal (globals.css:1246)
 *
 * Widths follow the system: copy on the grid at 1120 (hero) and 1080
 * (manifesto), artifact allowed past it at 1240 (relay). That relationship is
 * the house rule stated in src/components/marketing/heroes/tasks/hero.tsx:12.
 *
 * COPY
 * Every venue-facing sentence comes from `@/lib/venue-copy`. Nothing is
 * retyped or paraphrased. Where a ratified string is split across two
 * elements (the hero accent word, the branding refrain, the film's two
 * sentences) it is split from the imported constant at build time, so a copy
 * change flows through instead of silently going stale. The only strings
 * written here are structural: rung numbers, "Sample product view",
 * "Sample workspace", the ledger caption and the aspect note.
 *
 * The ladder runs 1 to 7 in order. Fixture canon: Glenmara House, Mara and
 * Finn.
 */

const VENUE_NAME = "Glenmara House";

/** The couple's plan. The homepage shows this same fixture, deliberately. */
const PLAN = HOMEPAGE_RELAY_TIMELINE_FIXTURE;
const PLAN_DATE = PLAN.lastUpdatedAt.slice(0, 10);

/** Split a ratified string on sentence boundaries. Never rewrites it. */
function sentences(source: string): string[] {
  return source.split(/(?<=\.)\s+/);
}

/**
 * Split a ratified string around one word so the house can put its single
 * indigo accent on it. If the word ever leaves the copy the split returns one
 * part and the line renders plain rather than wrong.
 */
function accentSplit(source: string, word: string): [string, string, string] {
  const at = source.indexOf(word);
  if (at < 0) return [source, "", ""];
  return [source.slice(0, at), word, source.slice(at + word.length)];
}

const [headBefore, headAccent, headAfter] = accentSplit(OFFER_LINE, "private");
const [signBefore, signAccent, signAfter] = accentSplit(CTA_SUPPORT, "not a form");

/** D-027.3, four sentences. The claim carries; the qualifications stay quiet. */
const RULE = sentences(BRANDING);
const [RULE_CLAIM, ...RULE_REST] = RULE;
const RULE_REFRAIN = RULE_REST.length > 1 ? RULE_REST[RULE_REST.length - 1] : "";
const RULE_MIDDLE = RULE_REST.length > 1 ? RULE_REST.slice(0, -1) : RULE_REST;
const [RULE_CLAIM_BEFORE, RULE_CLAIM_ACCENT, RULE_CLAIM_AFTER] = accentSplit(
  RULE_CLAIM ?? "",
  "Your name",
);

/** "Two minutes." / "What a couple opens, and what you see." */
const FILM_NOTE = sentences(FILM.note);

/** Rung 6 read straight off the FAQ of record, so each label and its answer
 *  are the ratified pair by construction. */
const END_STOPS = [FAQ[1], FAQ[8], FAQ[9]];

/** Ratified ledger labels reused as row labels elsewhere on the page. */
const LEDGER_WHO_GETS = COMMERCIAL_SUMMARY[8];
const LEDGER_WHAT_HOLDS = COMMERCIAL_SUMMARY[4];
const LEDGER_STANDARD = COMMERCIAL_SUMMARY[1];

const heroHref = withTracking(CTA_HREF, {
  ...VENUE_SITE_TRACKING,
  artifact: "venues_lab_b_hero",
});

const closingHref = withTracking(CTA_HREF, {
  ...VENUE_SITE_TRACKING,
  artifact: "venues_lab_b_closing",
});

export const metadata: Metadata = {
  title: "The Founding 25 · Signal Studio",
  description: OFFER_LINE,
  openGraph: {
    title: "The Founding 25 · Signal Studio",
    description: OFFER_LINE,
    type: "website",
  },
};

/** One row of a rung: a mono label on the 0.29fr rail, the ratified sentence
 *  in the wide column. The grid is `.reveal-relay-chapter`'s, at list scale. */
function Item({
  label,
  index,
  children,
}: {
  label?: string;
  index?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="vb-item reveal">
      <div>
        {index ? <p className="reveal-relay-number">{index}</p> : null}
        {label ? <p className="reveal-relay-eyebrow">{label}</p> : null}
      </div>
      <div>{children}</div>
    </div>
  );
}

function RungHead({
  number,
  id,
  title,
  lead,
}: {
  number: string;
  id: string;
  title: string;
  lead?: string;
}) {
  return (
    <header className="reveal-relay-head reveal">
      <p className="reveal-relay-kicker">{number}</p>
      <h2 id={id}>{title}</h2>
      {lead ? <p>{lead}</p> : null}
    </header>
  );
}

export default function VenuesLabB() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <main id="main" tabIndex={-1}>
        {/* ── Hero. The house hero, unmodified. ───────────────────── */}
        <section className="reveal-hero reveal-hero-v2" aria-labelledby="venue-title">
          <div className="reveal-hero-v2-inner">
            <h1 id="venue-title" className="reveal-headline-v2">
              {headBefore}
              <span className="reveal-headline-accent">{headAccent}</span>
              {headAfter}
            </h1>

            <p className="reveal-lede-v2">{OFFER_PARAGRAPH}</p>

            <div className="reveal-hero-actions">
              <Link className="reveal-action reveal-action-primary" href={heroHref}>
                {CTA}
                <span aria-hidden>→</span>
              </Link>
            </div>

            <p
              className="reveal-sequence"
              aria-label="Notes to Tasks to Timeline to Signal"
            >
              <span>Notes</span>
              <span aria-hidden>→</span>
              <span>Tasks</span>
              <span aria-hidden>→</span>
              <span>Timeline</span>
              <span aria-hidden>→</span>
              <span>Signal</span>
            </p>
          </div>
        </section>

        {/* ── 01 · the moment itself, at full scale. ───────────────── */}
        <section className="reveal-relay" id="the-moment" aria-labelledby="rung-1">
          <RungHead number="01" id="rung-1" title={LADDER[0]} lead={WHAT_COUPLES_GET} />

          <div className="reveal-relay-preview reveal" data-product="timeline">
            <p className="reveal-relay-sample">Sample product view</p>

            {/* The whole product, in one line. Not a logo, not a colour. */}
            <p className="vb-venue">
              <span className="vb-venue-name">{VENUE_NAME}</span>
              <span className="vb-venue-rule" aria-hidden="true" />
            </p>

            <TimelineTheLine embedded timeline={PLAN} />
          </div>

          <div className="reveal-relay-source" aria-label="Sample workspace context">
            <span>Sample workspace</span>
            <strong>Mara and Finn</strong>
            <span aria-hidden>·</span>
            <span>{VENUE_NAME}</span>
            <span aria-hidden>·</span>
            <time dateTime={PLAN_DATE}>27 July</time>
          </div>

          <div className="vb-items">
            <Item label={LEDGER_WHO_GETS[0]}>
              <p className="vb-say">{ENTITLEMENT}</p>
            </Item>
          </div>
        </section>

        {/* ── the rule that governs the image above. Biggest type. ── */}
        <section className="reveal-manifesto" aria-labelledby="rule-title">
          <div className="reveal-manifesto-eyebrow">
            {LADDER[1]} <span className="gold">·</span> {FAQ[7].q}
          </div>

          <h2 id="rule-title" className="reveal-manifesto-h2">
            {RULE_CLAIM_BEFORE}
            <span className="em">{RULE_CLAIM_ACCENT}</span>
            {RULE_CLAIM_AFTER}
          </h2>

          {RULE_MIDDLE.map((line) => (
            <p className="reveal-manifesto-body" key={line}>
              {line}
            </p>
          ))}

          {RULE_REFRAIN ? (
            <p className="reveal-manifesto-body">
              <strong>{RULE_REFRAIN}</strong>
            </p>
          ) : null}
        </section>

        {/* ── the film. The longer version of the same moment. ────── */}
        <section className="reveal-relay" id="the-film" aria-labelledby="film-title">
          <article className="reveal-relay-chapter reveal">
            <div className="reveal-relay-copy">
              <p className="reveal-relay-number">{FILM.label}</p>
              <h3 id="film-title">{FILM_NOTE[0]}</h3>
              <p className="reveal-relay-body">{FILM_NOTE[1]}</p>
              <p className="reveal-relay-foot">16 : 9 · captions in English</p>
            </div>

            <div className="reveal-relay-preview">
              <p className="reveal-relay-sample">{FILM.label}</p>
              <FilmSlot
                aspect={FILM.aspect}
                placeholder={FILM.placeholder}
                posterAlt={FILM.posterAlt}
              />
            </div>
          </article>
        </section>

        {/* ── 02 to 07 · the ladder, descending from that image. ──── */}
        <section className="reveal-relay" id="the-ladder" aria-label="What a venue is buying">
          {/* 02 · whose it is. Trust, and it comes before price. */}
          <article className="vb-rung" aria-labelledby="rung-2">
            <RungHead number="02" id="rung-2" title={LADDER[1]} lead={COLLABORATION} />

            <div className="vb-items">
              {PLAIN_THREE.map((line, index) => (
                <Item index={String(index + 1).padStart(2, "0")} key={line}>
                  <p className="vb-say">{line}</p>
                </Item>
              ))}
              <Item label={FAQ[6].q}>
                <p className="vb-say">{FAQ[6].a}</p>
              </Item>
            </div>
          </article>

          {/* 03 · what it costs. The number never travels alone. */}
          <article className="vb-rung" aria-labelledby="rung-3">
            <RungHead number="03" id="rung-3" title={LADDER[2]} />

            <div className="reveal-relay-chapter reveal">
              <div className="reveal-relay-copy">
                <p className="reveal-relay-number">the founding rate</p>
                <h3>{PRICE_FOUNDING}</h3>
                <p className="reveal-relay-eyebrow">
                  {LEDGER_STANDARD[0]} · {PRICE_STANDARD}
                </p>
                <p className="reveal-relay-body">{FOUNDING_RATE.price}</p>
                <p className="reveal-relay-foot">{LEDGER_WHAT_HOLDS[1]}</p>
              </div>

              <div>
                <p className="vb-say">{PER_WEDDING_SCALE}</p>
                <p className="vb-say">{FOUNDING_RATE.difference}</p>
                <p className="vb-say">{FOUNDING_RATE.lock}</p>
                <p className="vb-say">{FOUNDING_RATE.property}</p>
              </div>
            </div>

            {/* A price never travels without its conditions. All seventeen. */}
            <div className="vb-ledger">
              <div className="vb-ledger-head">
                <p className="reveal-relay-eyebrow">The agreement, in full</p>
                <p className="reveal-relay-foot">{COMMERCIAL_SUMMARY.length} lines</p>
              </div>

              <dl>
                {COMMERCIAL_SUMMARY.map(([term, value]) => (
                  <div className="vb-ledger-row reveal" key={term}>
                    <dt className="reveal-relay-number">{term}</dt>
                    <dd className="reveal-relay-body">{value}</dd>
                  </div>
                ))}
              </dl>

              <p className="vb-say vb-ledger-note">{WHY_NOT_CHARGE_COUPLES}</p>
            </div>
          </article>

          {/* 04 · what you see, and in the same breath what you never see. */}
          <article className="vb-rung" aria-labelledby="rung-4">
            <RungHead number="04" id="rung-4" title={LADDER[3]} />

            <div className="vb-items">
              <Item label={PRIVACY.seeLabel}>
                <p className="vb-say">{PRIVACY.see}</p>
              </Item>
              <Item label={PRIVACY.neverLabel}>
                <p className="vb-say">{PRIVACY.never}</p>
              </Item>
              <Item label={PRIVACY.launchLabel}>
                <p className="vb-say">{PRIVACY.launch}</p>
              </Item>
            </div>
          </article>

          {/* 05 · what it asks of your team. */}
          <article className="vb-rung" aria-labelledby="rung-5">
            <RungHead number="05" id="rung-5" title={LADDER[4]} lead={TEAM_ASK} />

            <div className="vb-items">
              {[COORDINATOR, NOT_TECHNICAL, HOW_IT_REACHES_YOU].map((line, index) => (
                <Item index={String(index + 1).padStart(2, "0")} key={line}>
                  <p className="vb-say">{line}</p>
                </Item>
              ))}
            </div>
          </article>

          {/* 06 · what happens at the end. */}
          <article className="vb-rung" aria-labelledby="rung-6">
            <RungHead number="06" id="rung-6" title={LADDER[5]} />

            <div className="vb-items">
              {END_STOPS.map((stop) => (
                <Item label={stop.q} key={stop.q}>
                  <p className="vb-say">{stop.a}</p>
                </Item>
              ))}
            </div>
          </article>

          {/* 07 · what being one of twenty-five means. */}
          <article className="vb-rung" aria-labelledby="rung-7">
            <RungHead number="07" id="rung-7" title={LADDER[6]} lead={FOUNDING_NUMBER} />

            <div className="vb-items">
              {[ROADMAP, WHO_ELSE, HOLD, GEOGRAPHY].map((line, index) => (
                <Item index={String(index + 1).padStart(2, "0")} key={line}>
                  <p className="vb-say">{line}</p>
                </Item>
              ))}
            </div>
          </article>
        </section>

        {/* ── The FAQ of record. Twelve questions, ratified.
              Answers are open, never behind a disclosure: this page gets
              forwarded to a partner who will not click twelve times. ── */}
        <section
          className="reveal-relay"
          id="the-questions"
          aria-labelledby="questions-title"
        >
          <article className="vb-rung" aria-labelledby="questions-title">
            <div className="reveal-relay-chapter reveal">
              <div className="reveal-relay-copy">
                <p className="reveal-relay-number">Asked</p>
                <h3 id="questions-title">Every question, answered here</h3>
                <p className="reveal-relay-eyebrow">Nothing held for a call</p>
              </div>

              <div className="vb-items">
                {FAQ.map((entry) => (
                  <Item label={entry.q} key={entry.q}>
                    <p className="vb-say">{entry.a}</p>
                  </Item>
                ))}
              </div>
            </div>
          </article>
        </section>

        {/* ── the ask. One, for the whole page. ───────────────────── */}
        <section className="reveal-closing" aria-label="Ask a question">
          <div className="reveal-closing-rule" aria-hidden />

          <p className="reveal-closing-sign">
            {signBefore}
            <span className="em">{signAccent}</span>
            {signAfter}
          </p>

          <div className="reveal-closing-cta">
            <Link className="reveal-cta reveal-cta-primary" href={closingHref}>
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
            <span>The Founding 25</span>
          </p>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}

/**
 * The private CSS, in full, in one place so its size can be read at a glance.
 *
 * Everything this page can say in the house grammar it says in the house
 * grammar. What is left is below, each block naming the house class its
 * values come from. There is no new colour, no easing and no duration that is
 * not a token, and no display size that is not already in globals.css.
 */
const CSS = `
/* 1 · Prose in a chapter's wide column.
      Values are .reveal-relay-head > p:last-child (globals.css:354). That
      rule is selector-scoped to the relay head, so it cannot be reached from
      a chapter row, and no other house class carries body prose above 14px. */
.vb-say {
  max-width: 62ch;
  margin: 0;
  color: var(--ink-soft);
  font-size: clamp(15px, 0.88rem + 0.26vw, 17px);
  line-height: 1.62;
}
.vb-say + .vb-say { margin-top: 17px; }

/* 2 · Layout only. Rungs are neighbours on the same ground, so DESIGN.md §4
      separates them with a hairline rather than with whitespace. */
.vb-rung { border-top: 1px solid var(--border); }
.vb-rung .reveal-relay-head { padding-top: clamp(64px, 9vw, 116px); }
.vb-items { display: block; }

/* 3 · Layout only. The .reveal-relay-chapter grid (globals.css:383) at list
      scale, so every label on the page sits on the same 0.29fr rail. */
.vb-item {
  display: grid;
  grid-template-columns: minmax(190px, 0.29fr) minmax(0, 1fr);
  gap: clamp(28px, 5vw, 72px);
  padding: clamp(26px, 3.4vw, 40px) 0;
  border-top: 1px solid var(--border-soft);
}
.vb-item .reveal-relay-number,
.vb-item .reveal-relay-eyebrow { margin: 0; }

/* 4 · The venue line: the venue's name inside the couple's workspace.
      The one shape on this page the house has no class for. Nearest shipped
      precedent is the venue identity bar on /venues (src/app/venues/page.tsx:179),
      a hairline-bottom row of small medium-weight text. This is that, in
      tokens, with the horizontal padding of the timeline preview rule
      (globals.css:535) so the name sits on the artifact's own left edge. */
.vb-venue {
  position: relative;
  z-index: 1;
  margin: 0;
  padding: 15px clamp(18px, 2.6vw, 34px) 15px;
  background: var(--paper);
}
.vb-venue-name {
  display: block;
  color: var(--ink);
  font-size: 13px;
  font-weight: 540;
  letter-spacing: -0.01em;
  line-height: 1.2;
}
.vb-venue-rule {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 1px;
  background: var(--border-soft);
}

/* 5 · The ledger. The same two columns as .reveal-relay-chapter at row
      scale, so the seventeen conditions line up with every other row on the
      page. Type is .reveal-relay-number (term) and .reveal-relay-body
      (value); only the grid and the measure are written here. */
.vb-ledger { margin-top: clamp(52px, 6vw, 88px); }
.vb-ledger-head {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: space-between;
  gap: 8px 20px;
  padding-bottom: 14px;
}
.vb-ledger-head .reveal-relay-eyebrow,
.vb-ledger-head .reveal-relay-foot { margin: 0; }
.vb-ledger dl { margin: 0; }
.vb-ledger-row {
  display: grid;
  grid-template-columns: minmax(190px, 0.29fr) minmax(0, 1fr);
  gap: clamp(20px, 4vw, 72px);
  padding: 15px 0;
  border-top: 1px solid var(--border-soft);
}
.vb-ledger-row:first-child { border-top-color: var(--border); }
.vb-ledger-row dt,
.vb-ledger-row dd { margin: 0; }
.vb-ledger-row .reveal-relay-body { max-width: 52ch; }
.vb-ledger-note { margin-top: clamp(30px, 3.4vw, 44px); }

/* 6 · The film slot: a reserved 16:9 frame. Nothing in the house reserves an
      empty aspect box, and the empty state is the state that ships. Sits
      inside .reveal-relay-preview, so the chrome is the house's. */
.vb-film {
  position: relative;
  display: grid;
  place-items: center;
  padding: 24px;
  background: var(--paper-deep);
}
.vb-film-centre { display: grid; justify-items: center; }
.vb-film-mark { width: 30px; height: 30px; color: var(--ink); opacity: 0.14; }
.vb-film-mark svg { width: 100%; height: 100%; fill: currentColor; display: block; }
.vb-film-line {
  max-width: 30ch;
  margin: 15px 0 0;
  color: var(--ink-faint);
  font-size: 13px;
  line-height: 1.5;
  text-align: center;
}
.vb-film-crop {
  position: absolute;
  width: 13px;
  height: 13px;
  border: 1px solid var(--border);
}
.vb-film-crop[data-corner="tl"] { top: 12px; left: 12px; border-right: 0; border-bottom: 0; }
.vb-film-crop[data-corner="tr"] { top: 12px; right: 12px; border-left: 0; border-bottom: 0; }
.vb-film-crop[data-corner="bl"] { bottom: 12px; left: 12px; border-right: 0; border-top: 0; }
.vb-film-crop[data-corner="br"] { bottom: 12px; right: 12px; border-left: 0; border-top: 0; }
.vb-film-ratio {
  position: absolute;
  right: 14px;
  bottom: 12px;
  color: var(--ink-ghost);
  font-family: var(--font-mono);
  font-size: 9px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}
.vb-film-media { width: 100%; height: 100%; object-fit: cover; }
.vb-film-play {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  border: 0;
  background: transparent;
  cursor: pointer;
}
.vb-film-play:focus-visible { outline: 2px solid var(--accent); outline-offset: -4px; }
.vb-film-play-label {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}

/* 7 · Motion. One addition to the house's own scroll-driven reveal
      (.reveal, globals.css:1246): the name arrives, and the line it sits on
      draws under it. Same gate, same reveal-fade keyframes, same easing and
      duration tokens. Outside the gate, no support or reduced motion, the
      name is simply there and the line is simply full width, which is the
      correct settled composition. */
@media (prefers-reduced-motion: no-preference) {
  @supports (animation-timeline: view()) {
    .vb-venue-name {
      animation: reveal-fade var(--motion-slow) var(--ease-out) both;
      animation-timeline: view();
      animation-range: entry 8% entry 42%;
    }
    .vb-venue-rule {
      width: 0;
      animation: vb-rule-draw var(--motion-slow) var(--ease-out) both;
      animation-timeline: view();
      animation-range: entry 14% entry 52%;
    }
  }
}
@keyframes vb-rule-draw {
  from { width: 0; }
  to   { width: 100%; }
}
@media (prefers-reduced-motion: reduce) {
  .vb-venue-name { opacity: 1 !important; translate: none !important; animation: none !important; }
  .vb-venue-rule { width: 100% !important; animation: none !important; }
}

/* 8 · Responsive. Mirrors the house breakpoints in globals.css:554 and 583. */
@media (max-width: 880px) {
  .vb-item,
  .vb-ledger-row { grid-template-columns: minmax(160px, 0.28fr) minmax(0, 1fr); }
  .vb-item { gap: clamp(24px, 4vw, 40px); }

  /* Layout only, and the type is untouched. The house display h3 is sized for
     one-word product wordmarks (notes, tasks); this page puts a phrase in it,
     and between 640 and 880 globals.css:567 pins the left rail at
     minmax(160px, 0.28fr), which is narrower than the word. globals.css:620
     already collapses this chapter to one column at 640; the two chapters on
     this page reach that point one breakpoint earlier, which also gives the
     film frame the full width it wants on a tablet. The list rows above keep
     their rail, because a mono label always fits. */
  .reveal-relay .reveal-relay-chapter {
    grid-template-columns: minmax(0, 1fr);
    gap: clamp(22px, 3vw, 34px);
  }
  .reveal-relay .reveal-relay-chapter .reveal-relay-copy { padding-top: 0; }
}
@media (max-width: 640px) {
  .vb-item,
  .vb-ledger-row {
    grid-template-columns: minmax(0, 1fr);
    gap: 10px;
  }
  .vb-item { padding-block: 26px; }
  .vb-say,
  .vb-ledger-row .reveal-relay-body { max-width: 48ch; }
  .vb-venue { padding-inline: 12px; }
  .vb-film { padding: 16px; }
  .vb-film-crop { width: 10px; height: 10px; }
}
`;
