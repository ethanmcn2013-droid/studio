"use client";

import { PRODUCT_APP_URLS } from "@/lib/product-urls";

/**
 * Signal · The Read — the settled end frame.
 *
 * The state the briefing rests in once the distillation has run, designed as
 * a product screen. Concept 2026-07-28; panel review executed same day.
 *
 * The premise is Signal's sharpest statement: here is what needs you now,
 * here is what needs you next, and nothing else is asking. Red needs you,
 * amber is coming, green is everything that does not — the same status ramp
 * the Tasks board wears, so a colour means one thing across the suite.
 *
 * What the panel changed (2026-07-28), and why:
 *
 *   1 · THE PING — the NOW marker broadcasts twice on arrival, then settles.
 *       The product is named Signal; this is the name made literal without
 *       turning the briefing into an ambient alert.
 *   2 · SOURCED LIGHT — the rectangular row washes are gone. Each marker now
 *       carries a soft radial bloom, so the colour visibly emanates from the
 *       dot instead of arriving as a painted panel with edges.
 *   3 · THE HANDOVER — the spine runs dot-to-dot, red into amber, and draws
 *       itself once on arrival. Now becoming next, drawn rather than stated.
 *       (The previous spine died mid-gap; its geometry is now anchored to
 *       both markers by construction.)
 *   4 · THE DISTILLATION — thirteen marks in the void beside the headline,
 *       eleven ghost, two lit in their tones, placed where they were found
 *       rather than sorted to the front. The filter made visible: the page's
 *       proof, promoted from 9.5px grey in the footer.
 *   5 · THE BREAK — the headline breaks on purpose, "Two things genuinely /
 *       need you.", so the second line lands as its own sentence and the
 *       marks occupy the quadrant the old rag left dead.
 *   6 · Receipt ticks doubled in size and inked up to visible.
 *   7 · Ordinals anchored: left edge aligned to the claim word below them.
 *
 * Held deliberately: buttons stay ink (a red fill reads as destructive, and
 * this action is "open", not "delete"); text tones stay mixed toward ink
 * (raw amber on paper is 2.15:1 and fails small-text contrast); the close
 * stays quiet. All motion is off under prefers-reduced-motion.
 */

const ITEMS = [
  {
    ordinal: "01",
    claim: "now" as const,
    title: "The final dietary list is still open.",
    why: "The venue team needs it before service notes lock for the 1 August tasting.",
    receipts: ["Notes + Tasks", "updated today"],
    action: "Open task",
    href: PRODUCT_APP_URLS.tasks,
  },
  {
    ordinal: "02",
    claim: "next" as const,
    title: "Invitations follow one week later.",
    why: "The public timeline puts them on 8 August, directly after the tasting.",
    receipts: ["Timeline", "current share"],
    action: "Open timeline",
    href: PRODUCT_APP_URLS.timeline,
  },
];

/**
 * The morning's read as marks: thirteen taken in, eleven cleared, two
 * surfaced. Heights are a quiet spectrum — noise at mixed amplitude, the two
 * signals standing tallest, sitting where they were found in the pile.
 */
const READ_MARKS: Array<{ h: number; tone?: "now" | "next" }> = [
  { h: 8 },
  { h: 11 },
  { h: 6 },
  { h: 16, tone: "now" },
  { h: 9 },
  { h: 12 },
  { h: 7 },
  { h: 10 },
  { h: 16, tone: "next" },
  { h: 8 },
  { h: 11 },
  { h: 7 },
  { h: 9 },
];

export type SignalReadItem = {
  ordinal: string;
  claim: "now" | "next";
  title: string;
  why: string;
  receipts: string[];
  action: string;
  href?: string;
};

export function SignalTheRead({
  embedded = false,
  items = ITEMS,
}: {
  embedded?: boolean;
  items?: SignalReadItem[];
} = {}) {
  return (
    <section
      className={`rd${embedded ? " rd-embedded" : ""}`}
      aria-label={embedded ? "Signal daily briefing" : undefined}
      aria-labelledby={embedded ? undefined : "rd-title"}
    >
      {/* PORT NOTE 2026-07-28 — the app chrome bar (wordmark, context,
          search) is dropped on the marketing page. It existed in the gallery
          so the frame read as a product screen standing alone; here the site
          already has its own nav directly above, and two stacked chrome bars
          read as a screenshot pasted into a page rather than as the page. */}
      <div className="rd-page">
        <div className="rd-dateline">
          <span className="rd-kicker">
            <i className="rd-kicker-dot" aria-hidden="true" />
            Today&rsquo;s Signal
          </span>
          <span className="rd-stamp">
            <time dateTime="2026-07-29T09:00">Wednesday, 09:00</time>
            <span aria-hidden="true">·</span>
            The Orchard
          </span>
        </div>

        <div className="rd-head">
          {embedded ? (
            <h4 className="rd-headline">
              Two things genuinely
              <br className="rd-br" /> need you.
            </h4>
          ) : (
            <h1 className="rd-headline" id="rd-title">
              Two things genuinely
              <br className="rd-br" /> need you.
            </h1>
          )}

          <div className="rd-distill">
            <div
              className="rd-bars"
              role="img"
              aria-label="Thirteen items read this morning. Two surfaced. The rest cleared."
            >
              {READ_MARKS.map((mark, index) => (
                <i
                  data-tone={mark.tone}
                  key={index}
                  style={{ "--h": `${mark.h}px`, "--i": index } as React.CSSProperties}
                />
              ))}
            </div>
            <p className="rd-distill-caption">13 read · 2 surfaced</p>
          </div>
        </div>

        <ol className="rd-items">
          {items.map((item) => (
            <li className="rd-item" data-claim={item.claim} key={item.ordinal}>
              <div className="rd-rail">
                <span className="rd-ordinal">{item.ordinal}</span>
                <span className="rd-claim">
                  <i className="rd-marker" aria-hidden="true" />
                  {item.claim}
                </span>
              </div>

              <div className="rd-body">
                {embedded ? (
                  <h5 className="rd-item-title">{item.title}</h5>
                ) : (
                  <h2 className="rd-item-title">{item.title}</h2>
                )}
                <p className="rd-why">{item.why}</p>
                <p className="rd-receipts">
                  <span className="rd-receipt-label">Receipt</span>
                  {item.receipts.map((receipt) => (
                    <span className="rd-receipt" key={receipt}>
                      {receipt}
                    </span>
                  ))}
                </p>
              </div>

              <div className="rd-action">
                {embedded ? (
                  <span className="rd-action-label">
                    {item.claim === "now" ? "Task receipt" : "Timeline receipt"}
                  </span>
                ) : item.href ? (
                  <a className="rd-button" href={item.href}>
                    {item.action}
                  </a>
                ) : (
                  <span className="rd-action-label">{item.action}</span>
                )}
              </div>
            </li>
          ))}
        </ol>

        <footer className="rd-close">
          <p className="rd-close-read">
            That&rsquo;s the read.
            <span>Open Tasks when you&rsquo;re ready.</span>
          </p>
          <p className="rd-coverage">
            <i className="rd-clear-mark" aria-hidden="true" />
            <span className="rd-clear-note">The rest is clear</span>
          </p>
        </footer>
      </div>

      <style>{CSS}</style>
    </section>
  );
}

const CSS = `
.rd {
  --rd-rail: 132px;
  --rd-gutter: clamp(20px, 5vw, 72px);
  --rd-ease: cubic-bezier(0.16, 1, 0.3, 1); /* ds-allow — hero motion choreography */

  /* ── traffic light ──────────────────────────────────────────────────
     Tones are the design system's status ramp — the same three colouring
     the Tasks board. Pure hue is only ever spent on marks (dots, spine,
     blooms); small text takes the ink-mixed tone, because raw red on paper
     is 3.76:1 and raw amber is 2.15:1, both failing small-text contrast. */
  --rd-now: var(--status-blocked);
  --rd-now-ink: color-mix(in srgb, var(--status-blocked) 62%, var(--ink));
  --rd-next: var(--status-flight);
  --rd-next-ink: color-mix(in srgb, var(--status-flight) 46%, var(--ink));
  --rd-clear: var(--status-done);
  --rd-clear-ink: color-mix(in srgb, var(--status-done) 54%, var(--ink));

  /* PORT NOTE 2026-07-28 — was min-height 100svh, right for a standalone
     gallery route that owned the viewport. As a hero it is one band with a
     page beneath it, so it sizes to its own content and keeps a floor that
     holds the fold without pushing the rest of the page away. */
  min-height: clamp(560px, 74svh, 760px);
  background: var(--paper);
  color: var(--ink);
  font-family: var(--font-sans, var(--font-geist-sans));
  -webkit-font-smoothing: antialiased;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.rd.rd-embedded {
  min-height: auto;
  display: block;
}

.rd-embedded .rd-page {
  max-width: none;
  padding: clamp(26px, 4vw, 48px);
}

.marketing-preview-motion:not([data-motion-started="true"]) .rd-embedded *,
.marketing-preview-motion:not([data-motion-started="true"]) .rd-embedded *::before,
.marketing-preview-motion:not([data-motion-started="true"]) .rd-embedded *::after {
  animation: none !important;
}

.marketing-preview-motion:not([data-motion-started="true"]) .rd-embedded .rd-item[data-claim="now"] .rd-marker::after {
  animation: none;
}

.marketing-preview-motion[data-motion-started="true"] .rd-embedded .rd-headline {
  animation: rd-rise 420ms var(--rd-ease) both;
}

.marketing-preview-motion[data-motion-started="true"][data-motion-visible="false"] .rd-embedded *,
.marketing-preview-motion[data-motion-started="true"][data-motion-visible="false"] .rd-embedded *::before,
.marketing-preview-motion[data-motion-started="true"][data-motion-visible="false"] .rd-embedded *::after {
  animation-play-state: paused !important;
}

.rd-embedded .rd-ordinal,
.rd-embedded .rd-receipt-label {
  color: var(--zinc-600);
}

/* ── page ────────────────────────────────────────────────────────────── */

.rd-page {
  width: 100%;
  max-width: 1080px;
  margin: 0 auto;
  padding: clamp(36px, 6vw, 76px) var(--rd-gutter) clamp(48px, 8vw, 96px);
}

.rd-dateline {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 16px;
  font-family: var(--font-mono, var(--font-geist-mono));
  font-size: 10px;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--ink-faint);
}

.rd-kicker {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  color: var(--ink-soft);
}

.rd-kicker-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--ink);
}

.rd-stamp {
  display: inline-flex;
  gap: 7px;
  letter-spacing: 0.1em;
  text-transform: none;
}

/* ── head: headline + distillation ───────────────────────────────────── */

.rd-head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: clamp(20px, 4vw, 56px);
  margin-top: clamp(18px, 2.4vw, 30px);
}

/* The break is deliberate: "need you." lands as its own line. The old 18ch
   cap broke it by accident and left the upper-right quadrant dead. */
.rd-headline {
  margin: 0;
  /* POLISH 2026-07-28 — the shared headline register: one clamp, 600,
     -0.04em across all four product pages. */
  font-size: clamp(2.5rem, 1.2rem + 3.9vw, 4.4rem);
  font-weight: 600;
  line-height: 0.98;
  letter-spacing: -0.04em;
}

/* The filter made visible: thirteen taken in, two surfaced, sitting in the
   quadrant the headline's rag used to leave empty. The two lit marks are
   the two items below, placed where they were found in the pile. */
.rd-distill {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 10px;
  padding-bottom: clamp(6px, 1vw, 12px);
}

.rd-bars {
  display: flex;
  align-items: flex-end;
  gap: 4px;
  height: 16px;
}

.rd-bars i {
  width: 2px;
  height: var(--h);
  border-radius: 1px;
  background: var(--ink-ghost);
  transform-origin: bottom;
  animation: rd-bar 220ms var(--ease-out) calc(80ms + var(--i) * 8ms) both;
}

.rd-bars i[data-tone="now"] { background: var(--rd-now); }
.rd-bars i[data-tone="next"] { background: var(--rd-next); }

.rd-distill-caption {
  margin: 0;
  font-family: var(--font-mono, var(--font-geist-mono));
  font-size: 9px;
  letter-spacing: 0.13em;
  text-transform: uppercase;
  color: var(--ink-faint);
}

@keyframes rd-bar {
  from { transform: scaleY(0); opacity: 0; }
  to { transform: scaleY(1); opacity: 1; }
}

/* ── items ───────────────────────────────────────────────────────────── */

.rd-items {
  list-style: none;
  margin: clamp(32px, 5vw, 58px) 0 0;
  padding: 0;
  border-top: 1px solid var(--hairline);
}

.rd-item {
  --rd-pad: clamp(26px, 3.4vw, 42px);
  position: relative;
  display: grid;
  grid-template-columns: var(--rd-rail) minmax(0, 1fr) auto;
  gap: clamp(16px, 3vw, 40px);
  align-items: start;
  padding: var(--rd-pad) 0;
  border-bottom: 1px solid var(--hairline);
}

.rd-item[data-claim="now"]  { --rd-tone: var(--rd-now);  --rd-tone-ink: var(--rd-now-ink);  --rd-bloom-r: 120px; --rd-bloom: 11%; }
.rd-item[data-claim="next"] { --rd-tone: var(--rd-next); --rd-tone-ink: var(--rd-next-ink); --rd-bloom-r: 96px;  --rd-bloom: 8%; }

/* Sourced light. The colour emanates from the marker as a radial bloom and
   is gone before it reaches the copy — light with an origin, not a painted
   panel. Geometry is anchored to the marker's position in the rail. */
.rd-item::before {
  content: "";
  position: absolute;
  left: calc(4px - var(--rd-bloom-r));
  top: calc(var(--rd-pad) + 26px - var(--rd-bloom-r));
  width: calc(var(--rd-bloom-r) * 2);
  height: calc(var(--rd-bloom-r) * 2);
  border-radius: 50%;
  pointer-events: none;
  background: radial-gradient(
    circle,
    color-mix(in srgb, var(--rd-tone, transparent) var(--rd-bloom, 0%), transparent),
    transparent 62%
  );
}

/* The handover. Dot-to-dot, red into amber, drawn once on arrival. Both
   ends are anchored by construction: top offsets from this item's marker,
   bottom reaches through the border into the next item's marker, whose
   rail metrics are identical. */
.rd-item[data-claim="now"]:not(:last-child)::after {
  content: "";
  position: absolute;
  left: 3.5px;
  top: calc(var(--rd-pad) + 34px);
  bottom: calc(-1 * (var(--rd-pad) + 19px));
  width: 1px;
  background: linear-gradient(to bottom, var(--rd-now), var(--rd-next));
  transform-origin: top;
  animation: rd-draw 400ms var(--ease-in-out) 180ms both;
}

@keyframes rd-draw {
  from { transform: scaleY(0); }
  to { transform: scaleY(1); }
}

/* ── rail ────────────────────────────────────────────────────────────
   Fixed metrics, shared by the spine geometry above: 2px padding, 10px
   ordinal line, 10px gap, then the claim line with the 8px marker. */

.rd-rail {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-top: 2px;
  font-family: var(--font-mono, var(--font-geist-mono));
  font-size: 10px;
  letter-spacing: 0.15em;
  text-transform: uppercase;
}

/* Anchored: the ordinal's left edge aligns with the claim word below it
   (marker 8px + gap 10px), so the rail reads as one set column. */
.rd-ordinal {
  line-height: 1;
  margin-left: 18px;
  color: var(--ink-ghost);
  letter-spacing: 0.12em;
}

.rd-claim {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  line-height: 1;
  color: var(--rd-tone-ink, var(--ink-faint));
  font-weight: 600;
}

.rd-marker {
  position: relative;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  border: 1.5px solid var(--rd-tone, var(--ink-ghost));
  background: var(--rd-tone, var(--paper));
  flex: none;
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--rd-tone, transparent) 15%, transparent);
}

/* Two rings establish NOW on arrival, then the briefing settles. */
.rd-item[data-claim="now"] .rd-marker::after {
  content: "";
  position: absolute;
  inset: -2px;
  border-radius: 50%;
  border: 1px solid var(--rd-now);
  opacity: 0;
  animation: rd-ping 1400ms var(--ease-out) 420ms 2;
}

@keyframes rd-ping {
  0% { transform: scale(0.7); opacity: 0.55; }
  62%, 100% { transform: scale(2.8); opacity: 0; }
}

/* ── body ────────────────────────────────────────────────────────────── */

.rd-item-title {
  margin: 0;
  font-size: clamp(1.18rem, 0.82rem + 1.1vw, 1.6rem);
  font-weight: 560;
  line-height: 1.2;
  letter-spacing: -0.025em;
  text-wrap: balance;
}

.rd-why {
  margin: 11px 0 0;
  max-width: 58ch;
  font-size: clamp(14px, 0.72rem + 0.28vw, 15.5px);
  line-height: 1.58;
  color: var(--ink-soft);
}

/* Provenance, not decoration. Ticks inked up from ghost 3px to a visible
   6px — the row is the page's honesty and was whispering. */
.rd-receipts {
  margin: 16px 0 0;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  font-family: var(--font-mono, var(--font-geist-mono));
  font-size: 9px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--ink-faint);
}

.rd-receipt-label {
  color: var(--ink-ghost);
}

.rd-receipt {
  position: relative;
  padding-left: 16px;
}

.rd-receipt::before {
  content: "";
  position: absolute;
  left: 3px;
  top: 50%;
  width: 6px;
  height: 1px;
  background: var(--ink-faint);
}

/* ── actions ─────────────────────────────────────────────────────────── */

.rd-action {
  padding-top: 2px;
}

.rd-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  appearance: none;
  border: 1px solid var(--hairline);
  border-radius: 8px;
  background: var(--paper);
  color: var(--ink);
  font: inherit;
  font-size: 13px;
  font-weight: 500;
  letter-spacing: -0.005em;
  padding: 9px 16px;
  white-space: nowrap;
  cursor: pointer;
  text-decoration: none;
  transition:
    border-color var(--marketing-motion-fast) var(--marketing-ease-out),
    background var(--marketing-motion-fast) var(--marketing-ease-out),
    transform var(--marketing-motion-press) var(--marketing-ease-out);
}

/* The row's tone reaches the button on hover only, as a border. A filled
   red button would read as destructive — this action opens, it does not
   delete. */
@media (hover: hover) and (pointer: fine) {
  .rd-button:hover {
    border-color: color-mix(in srgb, var(--rd-tone, var(--ink-ghost)) 55%, var(--hairline));
    background: var(--paper-soft);
  }
}

.rd-button:active {
  transform: scale(0.98);
}

.rd-button:focus-visible {
  outline: 2px solid var(--rd-tone-ink, var(--accent));
  outline-offset: 2px;
}

/* The now item's action is the one thing on the page you are meant to
   press, so it stays ink: the strongest, quietest weight available. Its
   urgency is already carried by the marker, the label and the bloom. */
.rd-item[data-claim="now"] .rd-button {
  background: var(--ink);
  border-color: var(--ink);
  color: var(--paper);
}

@media (hover: hover) and (pointer: fine) {
  .rd-item[data-claim="now"] .rd-button:hover {
    background: color-mix(in srgb, var(--ink) 88%, var(--paper));
    border-color: var(--ink);
  }
}

.rd-action-label {
  display: inline-flex;
  align-items: center;
  min-height: 32px;
  color: var(--ink-faint);
  font-family: var(--font-mono, var(--font-geist-mono));
  font-size: 9px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

/* ── close ───────────────────────────────────────────────────────────── */

.rd-close {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 20px;
  flex-wrap: wrap;
  margin-top: clamp(24px, 3vw, 36px);
}

.rd-close-read {
  margin: 0;
  font-size: 15px;
  line-height: 1.5;
  color: var(--ink);
}

.rd-close-read span {
  color: var(--ink-faint);
  margin-left: 7px;
}

/* The third light. Red needs you, amber is coming, and this is the green:
   everything Signal read and cleared. The count lives with the marks in
   the head; the close keeps only the relief. */
.rd-coverage {
  margin: 0;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: var(--font-mono, var(--font-geist-mono));
  font-size: 9.5px;
  letter-spacing: 0.13em;
  text-transform: uppercase;
}

.rd-clear-mark {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  flex: none;
  background: var(--rd-clear);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--rd-clear) 14%, transparent);
}

.rd-clear-note {
  color: var(--rd-clear-ink);
}

@keyframes rd-rise {
  from { opacity: 0; transform: translateY(9px); }
  to { opacity: 1; transform: translateY(0); }
}

/* ── narrow ──────────────────────────────────────────────────────────── */

@media (max-width: 720px) {
  /* The forced break hands back to natural wrapping, and the marks step
     down under the headline. */
  .rd-br { display: none; }
  .rd-headline { max-width: 16ch; text-wrap: balance; }

  .rd-head {
    flex-direction: column;
    align-items: flex-start;
    gap: 18px;
  }

  .rd-distill { align-items: flex-start; padding-bottom: 0; }

  .rd-item {
    grid-template-columns: minmax(0, 1fr);
    gap: 14px;
  }

  /* The rail becomes a single line, and the spine and blooms go with the
     vertical layout they were drawn for. */
  .rd-rail {
    flex-direction: row;
    align-items: center;
    gap: 12px;
    padding-top: 0;
  }

  .rd-ordinal { margin-left: 0; }
  .rd-item::before { display: none; }
  .rd-item[data-claim="now"]:not(:last-child)::after { display: none; }

  .rd-action { padding-top: 4px; }
  .rd-button { width: 100%; }
  .rd-action-label { min-height: 0; }
}

@media (prefers-reduced-motion: reduce) {
  .rd-bars i,
  .rd-item[data-claim="now"]:not(:last-child)::after {
    animation: none;
  }

  .rd-item[data-claim="now"] .rd-marker::after {
    animation: none;
    opacity: 0;
  }

  .rd-button:active {
    transform: none;
  }
}
`;
