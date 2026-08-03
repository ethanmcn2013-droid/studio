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
  HOW_IT_REACHES_YOU,
  LADDER,
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
  WHY_NOT_CHARGE_COUPLES,
} from "@/lib/venue-copy";

import { FilmSlot } from "./film-slot";

/**
 * Venue landing page · variant B · "The Name".
 *
 * THE THESIS
 * A venue is buying one moment: its name, said once, at the top of a real
 * couple's real wedding plan. Rung 01 is that moment as one composition. The
 * claim and the thing it claims sit side by side in a single row: the ratified
 * question on the left, its answer at display size under it, and to the right
 * the real Signal Timeline with "Glenmara House" written on its top edge at a
 * size that matches what is being sold. The hairline draws under the name
 * while the claim is still on screen. Everything below descends from that row.
 *
 * WHAT THE 2026-08-03 PANEL CHANGED
 *   fused     the branding claim was a separate 80px manifesto a full screen
 *             below the artifact, so the two halves were never co-visible and
 *             the section title "Whose it is" appeared twice. It now lives in
 *             the rung-01 rail, the venue name went from 13px to display size,
 *             and the ladder counts 01 to 07 unbroken.
 *   cut       the twelve-question FAQ block was 25.6% of the page and eight of
 *             its answers were byte-identical to prose already delivered above
 *             it. Removed. The two answers it alone carried (FAQ 10, FAQ 11)
 *             moved into rung 07 where they belong. Verbatim duplication on
 *             the page is now zero.
 *   labelled  rungs 05 and 07 rendered ratified objection ANSWERS with their
 *             objections stripped, so "That is the failure I am most trying to
 *             avoid" had no referent. Rung 05 now runs as continuous prose so
 *             the anaphora resolves against TEAM_ASK; rung 07's answers carry
 *             their ratified questions.
 *   routed    seven anchors were defined and none was linked, so the only
 *             route to the price was the global nav, which answers with the
 *             wrong number. A contents band under the hero lists the ladder
 *             and puts "What it costs" one click from the top.
 *   sized     40 sentence-length labels were 10px uppercase mono. Questions,
 *             privacy labels and the seventeen commercial terms are now sans,
 *             sentence case, 13.5px to 16.5px. Mono caps is kept for what it
 *             is for: ordinals, kickers and frame labels.
 *
 * HOUSE GRAMMAR
 * Built from the composed classes in src/app/globals.css and the shipped
 * product components, not from a private visual language:
 *
 *   hero      .reveal-hero.reveal-hero-v2 / .reveal-headline-v2 /
 *             .reveal-headline-accent / .reveal-lede-v2 /
 *             .reveal-hero-actions / .reveal-action-primary / .reveal-sequence
 *   band      .reveal-wedge  (the house's hairline entry rail)
 *   sections  .reveal-relay (1240) / .reveal-relay-head / .reveal-relay-kicker
 *   the rule  .reveal-manifesto (1080) · the page's biggest type below the hero
 *   product   .reveal-relay-preview / .reveal-relay-sample /
 *             .reveal-relay-source / .reveal-relay-chapter /
 *             .reveal-relay-copy / -number / -eyebrow / -body / -foot
 *   closing   .reveal-closing / .reveal-closing-rule / -sign / -cta / -addr
 *   motion    .reveal · the house's own scroll-driven, baseline-visible,
 *             zero-JS reveal (globals.css:1246)
 *
 * Widths follow the system: hero copy at 1120, contents band and manifesto at
 * 1080, relay at 1240, closing at 760. Copy on the grid, artifact allowed past
 * it: the house rule stated in src/components/marketing/heroes/tasks/hero.tsx.
 *
 * COPY
 * Every venue-facing sentence comes from `@/lib/venue-copy`. Nothing is
 * retyped or paraphrased. Where a ratified string is split across two elements
 * (the hero accent word, the branding claim and its refrain, the film's two
 * sentences, the price argument, the founding range) it is split from the
 * imported constant at build time, so a copy change flows through instead of
 * silently going stale.
 *
 * THE COMPLETE LIST OF STRINGS ON THIS PAGE THAT ARE NOT IN venue-copy.ts.
 * Audited by walking every text node and every aria-label in <main> outside
 * the product embed and testing each against the file. Twelve, all structural,
 * none of them a claim:
 *   rendered   the rung ordinals "01" to "07"; "Notes", "Tasks", "Timeline",
 *              "Signal" (the product sequence, verbatim from the house hero at
 *              src/components/reveal/reveal-hero.tsx); "Sample workspace",
 *              "Mara and Finn" and "27 July" (the house source bar and the
 *              shared fixture); "Glenmara House" (the fixture venue);
 *              "Sample product view" (the house preview label); "The
 *              agreement, in full" and "17 lines" (the ledger caption and its
 *              row count); "The Founding 25" (approved terminology,
 *              venue-copy.ts:313)
 *   accessible "Contents"; "Sample workspace context" and "Notes to Tasks to
 *              Timeline to Signal", both lifted verbatim from the house
 *              components this page reuses. The closing region is named with
 *              the ratified CTA itself.
 * Nothing else. In particular there is no venue-facing sentence anywhere in
 * the accessibility tree that a visual read would miss.
 *
 * The ladder runs 01 to 07 in order. Fixture canon: Glenmara House, Mara and
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
 * Split a ratified string around one phrase so the house can put its single
 * indigo accent on it. If the phrase ever leaves the copy the split returns
 * one part and the line renders plain rather than wrong.
 */
function accentSplit(source: string, phrase: string): [string, string, string] {
  const at = source.indexOf(phrase);
  if (at < 0) return [source, "", ""];
  return [source.slice(0, at), phrase, source.slice(at + phrase.length)];
}

const [headBefore, headAccent, headAfter] = accentSplit(OFFER_LINE, "private");
const [signBefore, signAccent, signAfter] = accentSplit(CTA_SUPPORT, "not a form");

/** D-027.3, four sentences. The claim carries; the qualifications stay quiet. */
const RULE = sentences(BRANDING);
const [RULE_CLAIM, ...RULE_REST] = RULE;
const RULE_REFRAIN = RULE_REST.length > 1 ? RULE_REST[RULE_REST.length - 1] : "";
const RULE_MIDDLE = RULE_REST.length > 1 ? RULE_REST.slice(0, -1) : RULE_REST;
const [RULE_BEFORE, RULE_ACCENT, RULE_AFTER] = accentSplit(RULE_CLAIM ?? "", "Your name");

/** "Two minutes." / "What a couple opens, and what you see." */
const FILM_NOTE = sentences(FILM.note);

/**
 * Objection A2, two sentences. The claim goes to the manifesto slot and the
 * reason follows it, which is the house's own rhetorical shape (the homepage
 * runs "gives you less" and then explains it). Splitting inverts the anaphora,
 * so the eyebrow has to name what "That" is: the gift clause out of
 * PLAIN_THREE, which is exactly what the ratified first sentence means by
 * "something you gave them". A refrain, not a repeat: it is 47 characters,
 * carried once as a statement in rung 02 and once here.
 */
const WHY = sentences(WHY_NOT_CHARGE_COUPLES);
const WHY_REASON = WHY[0] ?? WHY_NOT_CHARGE_COUPLES;
const WHY_CLAIM = WHY.length > 1 ? WHY[WHY.length - 1] : "";
const [WHY_BEFORE, WHY_ACCENT, WHY_AFTER] = accentSplit(WHY_CLAIM, "the whole product");
const GIFT = sentences(PLAIN_THREE[0]).slice(-1)[0] ?? "";

/** The founding range, lifted out of its own sentence for weight. */
const [NUM_BEFORE, NUM_ACCENT, NUM_AFTER] = accentSplit(
  FOUNDING_NUMBER,
  "01/25 through 25/25",
);

/** Rung 06 read straight off the FAQ of record, so each question and its
 *  answer are the ratified pair by construction. */
const END_STOPS = [FAQ[1], FAQ[8], FAQ[9]];

/** Rung 07. The two answers the FAQ of record alone carried. */
const HONEST = [FAQ[11], FAQ[10]];

/** Ratified ledger labels reused as row labels elsewhere on the page. */
const LEDGER_PRICE = COMMERCIAL_SUMMARY[0];
const LEDGER_STANDARD = COMMERCIAL_SUMMARY[1];
const LEDGER_WHO_GETS = COMMERCIAL_SUMMARY[8];

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

/**
 * A ratified question and its ratified answer. Sentence case, sans, at reading
 * size: this is what a forwarded partner scans, and 10px tracked capitals is
 * the wrong instrument for a 44-character sentence.
 */
function Ask({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="vb-ask reveal">
      <p className="vb-ask-q">{label}</p>
      <p className="vb-ask-a">{children}</p>
    </div>
  );
}

/** A numbered statement. Mono ordinal on the rail, ratified sentence beside it. */
function Statement({ index, children }: { index: string; children: React.ReactNode }) {
  return (
    <div className="vb-item reveal">
      <p className="reveal-relay-number">{index}</p>
      <p className="vb-say">{children}</p>
    </div>
  );
}

function RungHead({
  number,
  id,
  title,
  children,
}: {
  number: string;
  id: string;
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <header className="reveal-relay-head reveal">
      <p className="reveal-relay-kicker">{number}</p>
      <h2 id={id}>{title}</h2>
      {children ? <p>{children}</p> : null}
    </header>
  );
}

export default function VenuesLabB() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <main className="vb" id="main" tabIndex={-1}>
        {/* ── Hero. The house hero, unmodified. ───────────────────── */}
        <section className="reveal-hero reveal-hero-v2" aria-labelledby="venue-title">
          <div className="reveal-hero-v2-inner">
            <h1 id="venue-title" className="reveal-headline-v2">
              {headBefore}
              <span className="reveal-headline-accent">{headAccent}</span>
              {headAfter}
            </h1>

            <p className="reveal-lede-v2">{OFFER_PARAGRAPH}</p>

            {/* Navigation, not a second ask. The one call to action lives in
                the close, after the ladder has earned it: the ratified copy
                source states that a second CTA is a defect, not an option.
                This anchor exists because a partner reading the page cold
                needs a route to the number without six screens of scroll. */}
            <div className="reveal-hero-actions">
              <a className="reveal-action reveal-action-secondary" href="#rung-03">
                What it costs, and every condition on it
                <span aria-hidden>↓</span>
              </a>
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

        {/* ── Contents. The ladder, verbatim, as the page's own route.
              This page is written to be forwarded to a partner who never
              saw the email, so it says what it contains before it starts,
              and the price is one click from the top rather than five
              screens down. Seven in-document anchors, no second ask. ── */}
        <nav className="reveal-wedge vb-contents" aria-label="Contents">
          <ol className="vb-contents-inner">
            {LADDER.map((title, index) => (
              <li key={title}>
                <a href={`#rung-0${index + 1}`}>
                  <span className="vb-contents-n" aria-hidden>
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="vb-contents-t">{title}</span>
                </a>
              </li>
            ))}
          </ol>
        </nav>

        {/* ── 01 · the moment itself, at full scale, with the claim that
              governs it in the same row. ─────────────────────────── */}
        <section className="reveal-relay" id="rung-01" aria-labelledby="rung-01-title">
          <RungHead number="01" id="rung-01-title" title={LADDER[0]}>
            {WHAT_COUPLES_GET}
          </RungHead>

          <div className="reveal-relay-source" aria-label="Sample workspace context">
            <span>Sample workspace</span>
            <strong>Mara and Finn</strong>
            <span aria-hidden>·</span>
            <span>{VENUE_NAME}</span>
            <span aria-hidden>·</span>
            <time dateTime={PLAN_DATE}>27 July</time>
          </div>

          <article className="reveal-relay-chapter vb-moment reveal">
            <div className="reveal-relay-copy">
              <p className="vb-ask-q vb-moment-q">{FAQ[7].q}</p>
              <h3>
                {RULE_BEFORE}
                <span className="reveal-headline-accent">{RULE_ACCENT}</span>
                {RULE_AFTER}
              </h3>
              {RULE_MIDDLE.map((line) => (
                <p className="reveal-relay-body" key={line}>
                  {line}
                </p>
              ))}
              {RULE_REFRAIN ? (
                <p className="reveal-relay-body vb-refrain">
                  <strong>{RULE_REFRAIN}</strong>
                </p>
              ) : null}
            </div>

            {/* The whole product, in one line, on the artifact's top edge.
                Not a logo, not a colour. */}
            <div className="reveal-relay-preview vb-preview" data-product="timeline">
              <p className="vb-venue">
                <span className="vb-venue-name">{VENUE_NAME}</span>
                <span className="vb-venue-rule" aria-hidden="true" />
              </p>

              <TimelineTheLine embedded timeline={PLAN} />

              <p className="reveal-relay-sample vb-sample-foot">Sample product view</p>
            </div>
          </article>

          <div className="vb-asks">
            <Ask label={LEDGER_WHO_GETS[0]}>{ENTITLEMENT}</Ask>
          </div>
        </section>

        {/* ── 02 to 03 · trust, then the number. ───────────────────── */}
        <div className="reveal-relay">
          {/* 02 · whose it is. Trust, and it comes before price. */}
          <article className="vb-rung" id="rung-02" aria-labelledby="rung-02-title">
            <RungHead number="02" id="rung-02-title" title={LADDER[1]}>
              {COLLABORATION}
            </RungHead>

            <div className="vb-items">
              {PLAIN_THREE.map((line, index) => (
                <Statement index={String(index + 1).padStart(2, "0")} key={line}>
                  {line}
                </Statement>
              ))}
            </div>

            <div className="vb-asks">
              <Ask label={FAQ[6].q}>{FAQ[6].a}</Ask>
            </div>
          </article>

          {/* 03 · what it costs. The number never travels alone. */}
          <article className="vb-rung" id="rung-03" aria-labelledby="rung-03-title">
            <RungHead number="03" id="rung-03-title" title={LADDER[2]} />

            <div className="reveal-relay-chapter vb-price reveal">
              <div className="reveal-relay-copy">
                <p className="reveal-relay-number">{LEDGER_PRICE[0]}</p>
                <h3>{PRICE_FOUNDING}</h3>
                <p className="reveal-relay-eyebrow">
                  {LEDGER_STANDARD[0]} · {PRICE_STANDARD}
                </p>
                <p className="reveal-relay-body">{FOUNDING_RATE.price}</p>
              </div>

              {/* Two paragraphs, not four. FOUNDING_RATE is a closed set of
                  permitted forms, not a list to recite: `.lock` and
                  `.property` are the long forms of ledger rows 05 and 06,
                  twenty lines below, and saying them twice is the thing the
                  panel called the page's worst habit. What stays is the one
                  fact the seventeen rows do not carry, which is what the
                  number is per wedding, and the founding difference, which
                  has to sit beside the standard rate to mean anything. */}
              <div>
                <p className="vb-say">{PER_WEDDING_SCALE}</p>
                <p className="vb-say">{FOUNDING_RATE.difference}</p>
              </div>
            </div>

            {/* A price never travels without its conditions. All seventeen,
                open on the page, no disclosure to click: this document gets
                forwarded to someone who will not press anything. */}
            <div className="vb-ledger">
              <div className="vb-ledger-head">
                <p className="reveal-relay-eyebrow">The agreement, in full</p>
                <p className="reveal-relay-foot">{COMMERCIAL_SUMMARY.length} lines</p>
              </div>

              <dl className="vb-ledger-list">
                {COMMERCIAL_SUMMARY.map(([term, value]) => (
                  <div className="vb-ledger-row reveal" key={term}>
                    <dt className="vb-ledger-term">{term}</dt>
                    <dd className="vb-ledger-value">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </article>
        </div>

        {/* ── the argument under the number. The eyebrow is the ledger's
              own last row, so "That" resolves. ─────────────────────── */}
        <section className="reveal-manifesto" aria-labelledby="why-title">
          <div className="reveal-manifesto-eyebrow">
            {LADDER[2]} <span className="gold">·</span> {GIFT}
          </div>

          <h2 id="why-title" className="reveal-manifesto-h2">
            {WHY_BEFORE}
            <span className="em">{WHY_ACCENT}</span>
            {WHY_AFTER}
          </h2>

          <p className="reveal-manifesto-body">{WHY_REASON}</p>
        </section>

        {/* ── 04 to 07 · the rest of the ladder. ───────────────────── */}
        <div className="reveal-relay">
          {/* 04 · what you see, and in the same breath what you never see.
                  Three parts, and they travel together. */}
          <article className="vb-rung" id="rung-04" aria-labelledby="rung-04-title">
            <RungHead number="04" id="rung-04-title" title={LADDER[3]} />

            <div className="vb-asks">
              <Ask label={PRIVACY.seeLabel}>{PRIVACY.see}</Ask>
              <Ask label={PRIVACY.neverLabel}>{PRIVACY.never}</Ask>
              <Ask label={PRIVACY.launchLabel}>{PRIVACY.launch}</Ask>
            </div>
          </article>

          {/* 05 · what it asks of your team. Continuous prose on purpose:
                  COORDINATOR opens "That is the failure I am most trying to
                  avoid", and the failure it points at is the training day
                  TEAM_ASK has just ruled out. Broken into numbered rows, as
                  it was before the panel, the pronoun had no referent and the
                  section read to the coordinator as a rebuttal to an
                  accusation she never made. */}
          <article className="vb-rung" id="rung-05" aria-labelledby="rung-05-title">
            <RungHead number="05" id="rung-05-title" title={LADDER[4]} />

            <div className="vb-prose reveal">
              <p className="vb-say">{TEAM_ASK}</p>
              <p className="vb-say">{COORDINATOR}</p>
              <p className="vb-say">{HOW_IT_REACHES_YOU}</p>
            </div>
          </article>

          {/* 06 · what happens at the end. */}
          <article className="vb-rung" id="rung-06" aria-labelledby="rung-06-title">
            <RungHead number="06" id="rung-06-title" title={LADDER[5]} />

            <div className="vb-asks">
              {END_STOPS.map((stop) => (
                <Ask label={stop.q} key={stop.q}>
                  {stop.a}
                </Ask>
              ))}
            </div>
          </article>

          {/* 07 · what being one of twenty-five means. */}
          <article className="vb-rung" id="rung-07" aria-labelledby="rung-07-title">
            <RungHead number="07" id="rung-07-title" title={LADDER[6]}>
              {NUM_BEFORE}
              <strong className="vb-range">{NUM_ACCENT}</strong>
              {NUM_AFTER}
            </RungHead>

            <div className="vb-prose reveal">
              <p className="vb-say">{ROADMAP}</p>
            </div>

            <div className="vb-asks">
              {HONEST.map((entry) => (
                <Ask label={entry.q} key={entry.q}>
                  {entry.a}
                </Ask>
              ))}
            </div>
          </article>
        </div>

        {/* ── the film. The longer version of rung 01, and a coda rather
              than a gate: no reader should meet an empty frame on the way
              to the number. ─────────────────────────────────────────── */}
        <section className="reveal-relay" aria-labelledby="film-title">
          <article className="reveal-relay-chapter vb-film-chapter reveal">
            <div className="reveal-relay-copy">
              <p className="vb-ask-q vb-moment-q">{FILM.label}</p>
              <h3 id="film-title">{FILM_NOTE[1]}</h3>
              <p className="reveal-relay-body">{FILM_NOTE[0]}</p>
            </div>

            <div className="reveal-relay-preview vb-preview">
              <FilmSlot
                aspect={FILM.aspect}
                placeholder={FILM.placeholder}
                posterAlt={FILM.posterAlt}
              />
              <p className="reveal-relay-sample vb-sample-foot">{FILM.label}</p>
            </div>
          </article>
        </section>

        {/* ── the ask. One, for the whole page. ───────────────────── */}
        <section className="reveal-closing" aria-label={CTA}>
          <div className="reveal-closing-rule vb-closing-rule" aria-hidden />

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
 * Every rule is scoped under `.vb` so nothing here can reach another route.
 *
 * Everything this page can say in the house grammar it says in the house
 * grammar. What is left is below, each block naming the house class its values
 * come from. There is no new colour, no easing and no duration that is not a
 * token, and no display size that is not already in globals.css.
 *
 * CONTRAST. Every pair below was computed against the token values in
 * src/ds/tokens.css. The lowest on the page is --ink-faint #71717a on --paper
 * #ffffff at 4.83:1, which is the house pairing. Nothing sits on --paper-deep
 * except .vb-film-line, and that is --ink-soft #3f3f46 at 10.9:1.
 */
const CSS = `
/* 1 · Rails. Two, both the house's: prose sits on the .reveal-relay-head rail
      (globals.css:324) so every question, answer and statement lines up with
      the h2 above it; artifacts keep the .reveal-relay-chapter rail
      (globals.css:383). The homepage runs the same two side by side. */
.vb .vb-asks,
.vb .vb-prose,
.vb .vb-item {
  display: grid;
  grid-template-columns: minmax(0, 0.34fr) minmax(0, 1fr);
  column-gap: clamp(30px, 7vw, 100px);
}
.vb .vb-asks > *,
.vb .vb-prose > * { grid-column: 2; }

/* 2 · Prose in the wide column. Values are .reveal-relay-head > p:last-child
      (globals.css:354). That rule is selector-scoped to the relay head, so it
      cannot be reached from a row, and no other house class carries body prose
      above 14px. */
.vb .vb-say {
  max-width: 62ch;
  margin: 0;
  color: var(--ink-soft);
  font-size: clamp(15px, 0.88rem + 0.26vw, 17px);
  line-height: 1.62;
}
.vb .vb-say + .vb-say { margin-top: 17px; }
.vb .vb-prose { padding-bottom: clamp(8px, 1vw, 16px); }

/* 3 · A ratified question and its ratified answer. The page's most-scanned
      element, so it is set in the reading face at reading size. Weight and
      colour are .reveal-relay-source strong (globals.css:378). */
.vb .vb-ask {
  padding: clamp(22px, 2.5vw, 30px) 0;
  border-top: 1px solid var(--border-soft);
}
.vb .vb-ask:first-child { border-top-color: var(--border); }
.vb .vb-ask-q {
  max-width: 46ch;
  margin: 0;
  color: var(--ink);
  font-size: clamp(15px, 0.88rem + 0.22vw, 16.5px);
  font-weight: 560;
  letter-spacing: -0.012em;
  line-height: 1.38;
  text-wrap: pretty;
}
.vb .vb-ask-a {
  max-width: 64ch;
  margin: 10px 0 0;
  color: var(--ink-soft);
  font-size: clamp(15px, 0.88rem + 0.26vw, 17px);
  line-height: 1.62;
}

/* 4 · A numbered statement. Ordinal on the rail, sentence beside it. This is
      the one place mono caps is right: it is a number. */
.vb .vb-items { display: block; }
.vb .vb-item {
  padding: clamp(22px, 2.5vw, 30px) 0;
  border-top: 1px solid var(--border-soft);
}
.vb .vb-item:first-child { border-top-color: var(--border); }
.vb .vb-item .reveal-relay-number { margin: 0; }

/* 5 · Layout only. Rungs are neighbours on the same ground, so DESIGN.md §4
      separates them with a hairline rather than with whitespace. Vertical
      rhythm is compressed against the house defaults across the page: this is
      a document a stranger reads top to bottom, not a front door. */
.vb .reveal-relay { padding-top: clamp(60px, 6.6vw, 96px); }
.vb .reveal-relay-head { padding-bottom: clamp(28px, 3.4vw, 46px); }
.vb .reveal-relay-chapter { padding: clamp(44px, 5vw, 76px) 0; }
.vb .reveal-manifesto.reveal-manifesto { padding: clamp(72px, 8.4vw, 116px) 0; }
.vb-rung {
  border-top: 1px solid var(--border);
  scroll-margin-top: 88px;
}
.vb-rung .reveal-relay-head { padding-top: clamp(48px, 5.6vw, 80px); }
/* The relay container's own padding-top already opened the band; a rung that
   opens one must not pay for the gap twice. */
.vb .reveal-relay > .vb-rung:first-child .reveal-relay-head { padding-top: 0; }
.vb .vb-range { color: var(--ink); font-weight: 560; }

/* 6 · Contents. The band chrome is .reveal-wedge (globals.css:1633); only the
      grid inside it is written here. Seven in-document anchors, no second ask:
      a forwarded partner asked "what does this cost" should not have to guess
      at a scrollbar. Inner width is the wedge's own 1080. */
.vb-contents { border-top-color: var(--border); }
.vb-contents-inner {
  width: min(1080px, calc(100% - 40px));
  margin: 0 auto;
  padding: clamp(12px, 1.4vw, 18px) 0;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0 clamp(20px, 3vw, 44px);
  list-style: none;
}
.vb-contents-inner li { min-width: 0; }
.vb-contents-inner a {
  min-height: 44px;
  display: grid;
  grid-template-columns: 24px minmax(0, 1fr);
  align-items: baseline;
  padding: 8px 0;
  color: var(--ink-soft);
  text-decoration: none;
  transition: color var(--motion-fast) var(--ease-out);
}
.vb-contents-n {
  color: var(--ink-faint);
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.14em;
}
.vb-contents-t {
  font-size: 13.5px;
  letter-spacing: -0.008em;
  line-height: 1.35;
  text-wrap: pretty;
}
@media (hover: hover) and (pointer: fine) {
  .vb-contents-inner a:hover { color: var(--accent); }
  .vb-contents-inner a:hover .vb-contents-n { color: var(--accent); }
}
.vb-contents-inner a:focus-visible {
  border-radius: 3px;
  outline: 2px solid var(--accent);
  outline-offset: 3px;
}

/* 7 · The moment. A wider rail than the house default so the claim can hold
      "Your name" on one line at .reveal-relay-copy h3 size (globals.css:411),
      and a block h3 because that rule is inline-flex, which will not wrap an
      accented phrase. */
.vb .vb-moment { grid-template-columns: minmax(0, 0.38fr) minmax(0, 1fr); }
.vb .vb-film-chapter { grid-template-columns: minmax(0, 0.42fr) minmax(0, 1fr); }
.vb .reveal-relay-copy h3 { display: block; }
.vb .vb-moment-q { margin-bottom: 20px; }
.vb .vb-moment .reveal-relay-body:first-of-type { margin-top: 22px; }
.vb .vb-refrain strong { color: var(--ink); font-weight: 560; }

/* 8 · The venue line: the venue's name inside the couple's workspace, at the
      size of the thing being sold. The one shape on this page the house has no
      class for. Nearest shipped precedent is the venue identity bar on /venues
      (src/app/venues/page.tsx:179), a hairline-bottom row of medium-weight
      text; the artifact's own document title (timeline-artifact.module.css
      .header h2) sets the register above it. Horizontal padding is the
      timeline preview's (globals.css:535) so the name sits on the artifact's
      own left edge, and the frame opens on the name rather than on a
      disclaimer: "Sample product view" moves to the foot of the frame, where
      the source bar above the artifact has already said the same thing. */
.vb-venue {
  position: relative;
  z-index: 1;
  margin: 0;
  padding: clamp(20px, 2.4vw, 30px) clamp(18px, 2.6vw, 34px) clamp(17px, 2vw, 24px);
  background: var(--paper);
}
.vb-venue-name {
  display: block;
  color: var(--ink);
  font-size: clamp(19px, 1rem + 0.62vw, 27px);
  font-weight: 540;
  letter-spacing: -0.028em;
  line-height: 1.05;
}
.vb-venue-rule {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 1px;
  background: var(--border-soft);
}
.vb .vb-preview .reveal-relay-sample {
  border-top: 1px solid var(--border-soft);
  border-bottom: 0;
}

/* 9 · The ledger. Seventeen conditions, two up, term over value: a different
      construction from every other row on the page on purpose, because it is a
      different kind of object. Grid flow is row-major, so the visual order and
      the DOM order are the same one. Type is sans at reading size for the same
      reason the questions are: "If a new owner brings other venues" is a
      sentence, not a tag. */
.vb-ledger { margin-top: clamp(38px, 4.4vw, 62px); }
.vb-ledger-head {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: space-between;
  gap: 8px 20px;
  padding-bottom: 12px;
}
.vb-ledger-head .reveal-relay-eyebrow,
.vb-ledger-head .reveal-relay-foot { margin: 0; }
.vb-ledger-list {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  column-gap: clamp(30px, 4.4vw, 72px);
  margin: 0;
  border-top: 1px solid var(--border);
}
.vb-ledger-row {
  padding: 14px 0 16px;
  border-bottom: 1px solid var(--border-soft);
}
.vb-ledger-term {
  margin: 0;
  color: var(--ink);
  font-size: 13.5px;
  font-weight: 560;
  letter-spacing: -0.008em;
  line-height: 1.3;
}
.vb-ledger-value {
  max-width: 48ch;
  margin: 6px 0 0;
  color: var(--ink-soft);
  font-size: 14px;
  line-height: 1.55;
}

/* 10 · The film slot: a reserved 16:9 frame. Nothing in the house reserves an
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
.vb-film-mark { width: 30px; height: 30px; color: var(--ink); opacity: 0.16; }
.vb-film-mark svg { width: 100%; height: 100%; fill: currentColor; display: block; }
.vb-film-line {
  max-width: 30ch;
  margin: 16px 0 0;
  color: var(--ink-soft);
  font-size: 14px;
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

/* 11 · Motion. Two additions to the house's own scroll-driven reveal
      (.reveal, globals.css:1246), and the page opens and closes on the same
      gesture: a rule drawing left to right. At the top it draws under the
      venue's name while the claim that explains it is still on screen; at the
      bottom it draws under nothing, which is what the closing rule is. Same
      gate, same reveal-fade keyframes, same easing and duration tokens.
      Outside the gate, no support or reduced motion, the name is simply there
      and both rules are simply at full width, which is the correct settled
      composition and not a stripped one. */
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
    .vb-closing-rule {
      transform-origin: left center;
      animation: vb-rule-open var(--motion-slow) var(--ease-out) both;
      animation-timeline: view();
      animation-range: entry 6% entry 46%;
    }
  }
}
@keyframes vb-rule-draw {
  from { width: 0; }
  to   { width: 100%; }
}
@keyframes vb-rule-open {
  from { transform: scaleX(0); }
  to   { transform: scaleX(1); }
}
@media (prefers-reduced-motion: reduce) {
  .vb-venue-name { opacity: 1 !important; translate: none !important; animation: none !important; }
  .vb-venue-rule { width: 100% !important; animation: none !important; }
  .vb-closing-rule { transform: none !important; animation: none !important; }
}

/* 12 · Responsive. Mirrors the house breakpoints in globals.css:554 and 583. */
@media (max-width: 1040px) {
  .vb-contents-inner { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
@media (max-width: 880px) {
  .vb .vb-asks,
  .vb .vb-prose,
  .vb .vb-item {
    grid-template-columns: minmax(0, 0.28fr) minmax(0, 1fr);
    column-gap: clamp(24px, 5vw, 44px);
  }
  .vb-ledger-list { grid-template-columns: minmax(0, 1fr); }

  /* Layout only, and the type is untouched. The house display h3 is sized for
     one-word product wordmarks (notes, tasks); this page puts a phrase in it,
     and between 640 and 880 globals.css:567 pins the left rail at
     minmax(160px, 0.28fr), which is narrower than the phrase. globals.css:620
     already collapses this chapter to one column at 640; the three chapters on
     this page reach that point one breakpoint earlier, which also gives the
     film frame the full width it wants on a tablet. The rows above keep their
     rail, because an ordinal always fits. */
  .vb .reveal-relay-chapter {
    grid-template-columns: minmax(0, 1fr);
    gap: clamp(22px, 3vw, 34px);
  }
  .vb .reveal-relay-chapter .reveal-relay-copy { padding-top: 0; }
}
@media (max-width: 640px) {
  .vb .vb-asks,
  .vb .vb-prose,
  .vb .vb-item {
    grid-template-columns: minmax(0, 1fr);
    row-gap: 10px;
  }
  .vb .vb-item { padding-block: 24px; }
  .vb .vb-say,
  .vb .vb-ask-a { max-width: 48ch; }
  .vb-contents-inner { grid-template-columns: minmax(0, 1fr); }
  .vb-venue { padding-inline: 12px; }
  .vb-film { padding: 16px; }
  .vb-film-crop { width: 10px; height: 10px; }
}
`;
