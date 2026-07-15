import type { Metadata } from "next";
import Image from "next/image";
import { SiteFooter } from "@/components/landing/site-footer";
import { MotionSpecimen } from "@/components/brand/motion-specimen";
import { ReadingProgress } from "@/components/reading-progress";
import { Arrive } from "@/components/design/arrive";
import { Dissolve } from "@/components/design/dissolve";
import { RestDot } from "@/components/design/rest-dot";
import { FlipCard } from "@/components/design/flip-card";
import { DotCharacter } from "@/components/design/dot/dot-character";
import { LoadingCanon } from "@/components/design/loading-canon";

export const metadata: Metadata = {
  title: "Design · Signal Studio",
  description:
    "It starts with a dot. The Signal Studio design system, the dot's construction, Dot the character and its ten moods, the naming rule, the plain-language rule, five motion gestures, ten loading moments, one typeface, three colours, the printed work, and the room where the rest was cut.",
  openGraph: {
    title: "Design · Signal Studio",
    description: "It starts with a dot.",
    type: "website",
  },
};

/* ══════════════════════════════════════════════════════════════════
   Page stylesheet, self-contained, tokens only.

   The named motion language (§6 documents it; everything here uses it):
   · The Arrival        , 16px rise, --motion-slow, spring-glide, once
   · The Acknowledgement, 140ms, --ease-out, on hover/focus
   · The Settle         , 1.15s squash & stretch cut of the ball canon
   The ball's and settle's per-segment curves are the licensed
   choreography exception (ds-allow), identical to the documents deck.
   ══════════════════════════════════════════════════════════════════ */
const DSN_CSS = `
.dsn ::selection {
  background: var(--accent);
  color: var(--paper);
}

/* ── The Arrival, the page's only scroll effect ── */
.dsn-arrive {
  opacity: 1;
}
.dsn-arrive.is-in {
  animation: dsn-arrive var(--motion-slow) var(--spring-glide) both;
}
@keyframes dsn-arrive {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* ── §1 · the opening, the dot lands as the period ── */
.dsn-open {
  animation: dsn-arrive var(--motion-slow) var(--spring-glide) 250ms both;
}
.dsn-period {
  display: inline-block;
  width: 0.15em;
  height: 0.15em;
  margin-left: 0.06em;
  border-radius: 50%;
  background: var(--accent);
  transform-origin: 50% 100%;
  animation: dsn-settle 1.15s linear 950ms both; /* ds-allow, settle choreography, ball-canon cut */
}
@keyframes dsn-settle {
  0%   { transform: translateY(-38vh) scale(0.94, 1.10); opacity: 0; animation-timing-function: cubic-bezier(0.55, 0, 0.85, 0.4); } /* ds-allow, settle choreography, ball-canon cut */
  6%   { opacity: 1; animation-timing-function: cubic-bezier(0.55, 0, 0.85, 0.4); } /* ds-allow, settle choreography, ball-canon cut */
  38%  { transform: translateY(0) scale(1.48, 0.52); animation-timing-function: cubic-bezier(0.15, 0.6, 0.3, 1); } /* ds-allow, settle choreography, ball-canon cut */
  52%  { transform: translateY(-0.55em) scale(0.88, 1.14); animation-timing-function: cubic-bezier(0.55, 0, 0.85, 0.45); } /* ds-allow, settle choreography, ball-canon cut */
  64%  { transform: translateY(0) scale(1.22, 0.80); animation-timing-function: cubic-bezier(0.25, 0.5, 0.4, 1); } /* ds-allow, settle choreography, ball-canon cut */
  76%  { transform: translateY(-0.18em) scale(0.96, 1.05); animation-timing-function: cubic-bezier(0.55, 0, 0.85, 0.45); } /* ds-allow, settle choreography, ball-canon cut */
  85%  { transform: translateY(0) scale(1.10, 0.91); animation-timing-function: cubic-bezier(0.3, 0.5, 0.5, 1); } /* ds-allow, settle choreography, ball-canon cut */
  92%  { transform: translateY(0) scale(0.97, 1.02); animation-timing-function: cubic-bezier(0.45, 0, 0.55, 1); } /* ds-allow, settle choreography, ball-canon cut */
  100% { transform: translateY(0) scale(1, 1); }
}

/* ── the ball, top-right, the dot in motion, deck parity ── */
.dsq-origin {
  position: absolute;
  top: 16px;
  right: clamp(24px, 6vw, 96px);
  width: 48px;
  height: 168px;
  pointer-events: none;
  z-index: 1;
}
.dsq-dot {
  position: absolute;
  left: 50%;
  bottom: 8px;
  width: 28px;
  height: 28px;
  margin-left: -14px;
  border-radius: 50%;
  background: var(--accent);
  transform-origin: 50% 100%;
  animation: dsq-bounce 4.2s linear infinite;
  will-change: transform;
}
.dsq-shadow {
  position: absolute;
  left: 50%;
  bottom: 2px;
  width: 30px;
  height: 4px;
  margin-left: -15px;
  border-radius: 50%;
  background: color-mix(in srgb, var(--accent) 35%, transparent);
  transform-origin: 50% 50%;
  animation: dsq-shadow 4.2s linear infinite;
}
@keyframes dsq-bounce {
  0%    { transform: translateY(0)     scale(1, 1);         animation-timing-function: cubic-bezier(0.45, 0, 0.55, 1); } /* ds-allow, squish-bounce choreography, documents-deck parity */
  7%    { transform: translateY(0)     scale(1.045, 0.965); animation-timing-function: cubic-bezier(0.45, 0, 0.55, 1); } /* ds-allow, squish-bounce choreography, documents-deck parity */
  14%   { transform: translateY(0)     scale(0.99, 1.01);   animation-timing-function: cubic-bezier(0.5, 0, 0.7, 0.2); } /* ds-allow, squish-bounce choreography, documents-deck parity */
  20%   { transform: translateY(0)     scale(1.45, 0.55);   animation-timing-function: cubic-bezier(0.15, 0.7, 0.3, 1); } /* ds-allow, squish-bounce choreography, documents-deck parity */
  24%   { transform: translateY(-29px)  scale(0.70, 1.42);  animation-timing-function: cubic-bezier(0.2, 0.6, 0.45, 1); } /* ds-allow, squish-bounce choreography, documents-deck parity */
  36%   { transform: translateY(-88px)  scale(0.95, 1.07);  animation-timing-function: cubic-bezier(0.35, 0.6, 0.6, 1); } /* ds-allow, squish-bounce choreography, documents-deck parity */
  43%   { transform: translateY(-97px)  scale(1.05, 0.96);  animation-timing-function: cubic-bezier(0.5, 0, 0.8, 0.3); } /* ds-allow, squish-bounce choreography, documents-deck parity */
  52%   { transform: translateY(-23px)  scale(0.76, 1.34);  animation-timing-function: cubic-bezier(0.6, 0, 0.8, 0.4); } /* ds-allow, squish-bounce choreography, documents-deck parity */
  55%   { transform: translateY(0)     scale(1.65, 0.42);   animation-timing-function: cubic-bezier(0.15, 0.6, 0.3, 1); } /* ds-allow, squish-bounce choreography, documents-deck parity */
  58.5% { transform: translateY(-19px)  scale(0.84, 1.22);  animation-timing-function: cubic-bezier(0.3, 0.55, 0.55, 1); } /* ds-allow, squish-bounce choreography, documents-deck parity */
  65%   { transform: translateY(-41px)  scale(0.99, 1.03);  animation-timing-function: cubic-bezier(0.55, 0, 0.85, 0.4); } /* ds-allow, squish-bounce choreography, documents-deck parity */
  72%   { transform: translateY(-5px)   scale(0.85, 1.19);  animation-timing-function: cubic-bezier(0.4, 0, 0.4, 1); } /* ds-allow, squish-bounce choreography, documents-deck parity */
  74%   { transform: translateY(0)     scale(1.36, 0.66);   animation-timing-function: cubic-bezier(0.25, 0.5, 0.4, 1); } /* ds-allow, squish-bounce choreography, documents-deck parity */
  78%   { transform: translateY(-10px)  scale(0.95, 1.07);  animation-timing-function: cubic-bezier(0.55, 0, 0.85, 0.45); } /* ds-allow, squish-bounce choreography, documents-deck parity */
  82%   { transform: translateY(0)     scale(1.17, 0.85);   animation-timing-function: cubic-bezier(0.3, 0.5, 0.5, 1); } /* ds-allow, squish-bounce choreography, documents-deck parity */
  86%   { transform: translateY(0)     scale(0.93, 1.075);  animation-timing-function: cubic-bezier(0.45, 0, 0.55, 1); } /* ds-allow, squish-bounce choreography, documents-deck parity */
  90%   { transform: translateY(0)     scale(1.05, 0.955);  animation-timing-function: cubic-bezier(0.45, 0, 0.55, 1); } /* ds-allow, squish-bounce choreography, documents-deck parity */
  93.5% { transform: translateY(0)     scale(0.975, 1.025); animation-timing-function: cubic-bezier(0.45, 0, 0.55, 1); } /* ds-allow, squish-bounce choreography, documents-deck parity */
  96.5% { transform: translateY(0)     scale(1.012, 0.99);  animation-timing-function: cubic-bezier(0.45, 0, 0.55, 1); } /* ds-allow, squish-bounce choreography, documents-deck parity */
  100%  { transform: translateY(0)     scale(1, 1); }
}
@keyframes dsq-shadow {
  0%    { transform: scale(1, 1);    opacity: 0.50; animation-timing-function: cubic-bezier(0.45, 0, 0.55, 1); } /* ds-allow, squish-bounce choreography, documents-deck parity */
  7%    { transform: scale(1.05, 1); opacity: 0.52; animation-timing-function: cubic-bezier(0.45, 0, 0.55, 1); } /* ds-allow, squish-bounce choreography, documents-deck parity */
  14%   { transform: scale(1, 1);    opacity: 0.50; animation-timing-function: cubic-bezier(0.5, 0, 0.7, 0.2); } /* ds-allow, squish-bounce choreography, documents-deck parity */
  20%   { transform: scale(1.48, 1); opacity: 0.62; animation-timing-function: cubic-bezier(0.2, 0.6, 0.45, 1); } /* ds-allow, squish-bounce choreography, documents-deck parity */
  24%   { transform: scale(0.78, 1); opacity: 0.30; animation-timing-function: cubic-bezier(0.35, 0.6, 0.6, 1); } /* ds-allow, squish-bounce choreography, documents-deck parity */
  36%   { transform: scale(0.44, 1); opacity: 0.13; animation-timing-function: cubic-bezier(0.5, 0, 0.8, 0.3); } /* ds-allow, squish-bounce choreography, documents-deck parity */
  43%   { transform: scale(0.40, 1); opacity: 0.10; animation-timing-function: cubic-bezier(0.6, 0, 0.8, 0.4); } /* ds-allow, squish-bounce choreography, documents-deck parity */
  52%   { transform: scale(0.80, 1); opacity: 0.33; animation-timing-function: cubic-bezier(0.15, 0.6, 0.3, 1); } /* ds-allow, squish-bounce choreography, documents-deck parity */
  55%   { transform: scale(1.62, 1); opacity: 0.62; animation-timing-function: cubic-bezier(0.3, 0.55, 0.55, 1); } /* ds-allow, squish-bounce choreography, documents-deck parity */
  58.5% { transform: scale(0.90, 1); opacity: 0.38; animation-timing-function: cubic-bezier(0.55, 0, 0.85, 0.4); } /* ds-allow, squish-bounce choreography, documents-deck parity */
  65%   { transform: scale(0.64, 1); opacity: 0.20; animation-timing-function: cubic-bezier(0.4, 0, 0.4, 1); } /* ds-allow, squish-bounce choreography, documents-deck parity */
  74%   { transform: scale(1.32, 1); opacity: 0.56; animation-timing-function: cubic-bezier(0.55, 0, 0.85, 0.45); } /* ds-allow, squish-bounce choreography, documents-deck parity */
  78%   { transform: scale(0.94, 1); opacity: 0.40; animation-timing-function: cubic-bezier(0.3, 0.5, 0.5, 1); } /* ds-allow, squish-bounce choreography, documents-deck parity */
  82%   { transform: scale(1.15, 1); opacity: 0.50; animation-timing-function: cubic-bezier(0.45, 0, 0.55, 1); } /* ds-allow, squish-bounce choreography, documents-deck parity */
  100%  { transform: scale(1, 1);    opacity: 0.50; }
}

/* ── §2 · construction study ── */
.dsn-cons {
  position: relative;
  border: 1px solid var(--hairline);
  border-radius: var(--r-3);
  background: var(--paper-elev);
  padding: clamp(28px, 5vw, 56px) clamp(20px, 4vw, 48px);
}
.dsn-cons-stage {
  position: relative;
  padding: 34px 0 26px;
}
.dsn-rule--cap { top: 34px; }
.dsn-rule--base { bottom: 26px; }
.dsn-rule {
  position: absolute;
  left: 0;
  right: 0;
  border-top: 1px dashed color-mix(in srgb, var(--ink) 18%, transparent);
}
.dsn-rule-label {
  position: absolute;
  right: 0;
  transform: translateY(-130%);
  font-family: var(--font-mono, monospace);
  font-size: 10px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--ink-faint);
}
.dsn-cons-mark {
  font-size: clamp(44px, 7vw, 76px);
  font-weight: 600;
  letter-spacing: -0.02em;
  line-height: 1;
  color: var(--ink);
}
/* The two dot primitives, shared by the construction study (§2) and the
   naming ledger (§4): em-relative, so they sit correctly at any size. */
.dsn .dot-period {
  display: inline-block;
  width: 0.15em;
  height: 0.15em;
  margin-left: 0.03em;
  border-radius: 50%;
  background: var(--accent);
}
.dsn .dot-middot {
  display: inline-block;
  width: 0.15em;
  height: 0.15em;
  margin-left: 0.05em;
  border-radius: 50%;
  background: var(--accent);
  transform: translateY(-0.62em);
}

/* ── §3 · the dot's five jobs ── */
.dsn-jobs {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  border: 1px solid var(--hairline);
  border-radius: var(--r-3);
  background: var(--paper-elev);
  overflow: hidden;
}
@media (min-width: 860px) { .dsn-jobs { grid-template-columns: repeat(5, 1fr); } }
@media (max-width: 859px) { .dsn-job:last-child { grid-column: span 2; } }
.dsn-job {
  border-right: 1px solid var(--hairline);
  border-bottom: 1px solid var(--hairline);
  padding: 26px 18px 20px;
}
.dsn-job-stage {
  position: relative;
  height: 56px;
  display: flex;
  align-items: center;
}
.dsn-job-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--accent);
}
.dsn-job--period .dsn-job-dot { position: relative; }
.dsn-job--period .dsn-job-dot::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border: 1.5px solid var(--accent);
  opacity: 0;
}
.dsn-arrive.is-in .dsn-job--period .dsn-job-dot::after {
  animation: dsn-job-broadcast 2.6s var(--spring-glide) 600ms 1 both;
}
@keyframes dsn-job-broadcast {
  0%   { opacity: 0.9; transform: scale(1); }
  70%  { opacity: 0;   transform: scale(3.4); }
  100% { opacity: 0;   transform: scale(3.4); }
}
.dsn-job--sweep .dsn-job-stage::after {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  border-top: 1px solid var(--hairline);
}
.dsn-job--sweep .dsn-job-dot {
  position: relative;
  z-index: 1;
  animation: dsn-job-sweep 5.4s var(--ease-out) infinite;
}
@keyframes dsn-job-sweep {
  0%   { transform: translateX(0); }
  42%  { transform: translateX(72px); }
  50%  { transform: translateX(72px); }
  92%  { transform: translateX(0); }
  100% { transform: translateX(0); }
}
.dsn-job--caret .dsn-job-dot {
  border-radius: 2px;
  width: 4px;
  height: 20px;
  animation: dsn-job-caret 1.1s steps(1, end) infinite;
}
@keyframes dsn-job-caret {
  0%, 49% { opacity: 1; }
  50%, 100% { opacity: 0; }
}
.dsn-job--pulse .dsn-job-dot {
  animation: dsn-job-pulse 2.6s ease-in-out infinite;
}
@keyframes dsn-job-pulse {
  0%, 30%, 100% { transform: scale(1); }
  10%           { transform: scale(1.35); }
}
.dsn-job--tick .dsn-job-dot {
  animation: dsn-job-tick 3.6s steps(1, end) infinite;
}
@keyframes dsn-job-tick {
  0%   { transform: translateY(8px); }
  25%  { transform: translateY(-10px); }
  50%  { transform: translateY(2px); }
  75%  { transform: translateY(-16px); }
  100% { transform: translateY(8px); }
}
.dsn-job-name {
  margin-top: 10px;
  font-size: 13.5px;
  font-weight: 600;
  color: var(--ink);
}
.dsn-job-line {
  margin-top: 3px;
  font-size: 12.5px;
  line-height: 1.5;
  color: var(--ink-quiet);
}

/* ── §4 · the character ──
   One stage, one Dot, ten moods. Layout only; every movement is owned
   by the WAAPI engine (components/design/dot). The stage geometry
   (102px body, shadow plate, floor at 128px) is the model sheet's,
   verbatim — the engine's pixel amplitudes are calibrated to it. */
.dsn-dot-lab {
  display: grid;
  grid-template-columns: minmax(260px, 320px) 1fr;
  gap: 40px;
  align-items: stretch;
}
@media (max-width: 900px) {
  .dsn-dot-lab { grid-template-columns: 1fr; gap: 24px; }
}
.dsn-dot-label {
  min-height: 96px;
  animation: dsn-dot-swap 220ms var(--ease-out) both;
}
@keyframes dsn-dot-swap {
  from { opacity: 0; }
  to   { opacity: 1; }
}
.dsn-dot-toprow { display: flex; align-items: baseline; gap: 10px; }
.dsn-dot-idx {
  font-family: var(--font-mono, monospace);
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.1em;
  color: var(--accent);
}
.dsn-dot-name {
  font-size: clamp(26px, 3vw, 34px);
  font-weight: 600;
  letter-spacing: -0.03em;
  line-height: 1;
  color: var(--ink);
}
.dsn-dot-cap {
  margin: 10px 0 0;
  font-size: 15.5px;
  line-height: 1.5;
  color: var(--ink-soft);
  max-width: 30ch;
}
.dsn-dot-note {
  margin: 6px 0 0;
  min-height: 20px;
  font-size: 13px;
  line-height: 1.5;
  color: var(--accent);
  transition: opacity 250ms var(--ease-out);
}
.dsn-dot-rail { margin-top: 10px; display: flex; flex-direction: column; }
@media (max-width: 900px) {
  .dsn-dot-rail { display: grid; grid-template-columns: 1fr 1fr; }
}
.dsn-dot-row {
  display: flex;
  align-items: baseline;
  gap: 11px;
  padding: 6.5px 12px;
  margin: 0 -12px;
  border: 0;
  background: none;
  border-radius: 6px;
  cursor: pointer;
  text-align: left;
  font: inherit;
}
@media (max-width: 900px) { .dsn-dot-row { margin: 0; } }
.dsn-dot-row:hover { background: color-mix(in srgb, var(--accent) 7%, transparent); }
.dsn-dot-row:focus-visible { outline: 1.5px solid var(--accent); outline-offset: -1px; }
.dsn-dot-tick {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--accent);
  flex: none;
  align-self: center;
  transition: opacity 0.2s ease;
}
.dsn-dot-rownum {
  font-family: var(--font-mono, monospace);
  font-size: 11px;
  letter-spacing: 0.08em;
  color: var(--ink-faint);
  width: 22px;
  flex: none;
  transition: color 0.2s ease;
}
.dsn-dot-rownum[data-on] { color: var(--accent); }
.dsn-dot-rowname {
  font-size: 14.5px;
  font-weight: 500;
  color: var(--ink-quiet);
  flex: 1;
  transition: color 0.2s ease;
}
.dsn-dot-rowname[data-on] { color: var(--ink); font-weight: 600; }
.dsn-dot-rowdur {
  font-family: var(--font-mono, monospace);
  font-size: 10px;
  letter-spacing: 0.06em;
  color: var(--ink-faint);
}
.dsn-dot-stage {
  position: relative;
  height: clamp(420px, 44vw, 540px);
  border: 1px solid var(--hairline);
  border-radius: var(--r-3);
  background: var(--paper);
  overflow: hidden;
}
.dsn-dot-corner { position: absolute; width: 12px; height: 12px; }
.dsn-dot-corner--tl { top: 10px; left: 10px; border-top: 1px solid var(--hairline); border-left: 1px solid var(--hairline); }
.dsn-dot-corner--tr { top: 10px; right: 10px; border-top: 1px solid var(--hairline); border-right: 1px solid var(--hairline); }
.dsn-dot-corner--bl { bottom: 10px; left: 10px; border-bottom: 1px solid var(--hairline); border-left: 1px solid var(--hairline); }
.dsn-dot-corner--br { bottom: 10px; right: 10px; border-bottom: 1px solid var(--hairline); border-right: 1px solid var(--hairline); }
.dsn-dot-meta {
  position: absolute;
  font-family: var(--font-mono, monospace);
  font-size: 10px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--ink-faint);
}
.dsn-dot-meta--tl { top: 20px; left: 26px; }
.dsn-dot-meta--tr { top: 20px; right: 26px; }
.dsn-dot-meta--bl { bottom: 20px; left: 26px; font-size: 9.5px; }
.dsn-dot-floor {
  position: absolute;
  left: 12%;
  right: 12%;
  bottom: 128px;
  height: 1px;
  background: var(--hairline);
}
.dsn-dot-rig {
  position: absolute;
  left: calc(50% - 51px);
  bottom: 128px;
  width: 102px;
  height: 102px;
}
.dsn-dot-shadow {
  position: absolute;
  left: -9px;
  top: 97px;
  width: 120px;
  height: 18px;
  border-radius: 50%;
  background: var(--ink);
  opacity: 0.15;
  filter: blur(11px);
  transform-origin: 50% 50%;
  will-change: transform, opacity;
}
.dsn-dot-ghostwrap { position: absolute; inset: 0; pointer-events: none; }
.dsn-dot-ghost {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: var(--accent);
  opacity: 0;
  transform-origin: 50% 50%;
  will-change: transform, opacity;
}
.dsn-dot-drop {
  position: absolute;
  left: 57px;
  top: 79px;
  width: 17px;
  height: 17px;
  border-radius: 50%;
  background: var(--accent);
  opacity: 0;
  pointer-events: none;
  will-change: transform, opacity;
}
.dsn-dot-body {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: var(--accent);
  transform-origin: 50% 100%;
  will-change: transform;
  cursor: grab;
}
.dsn-dot-body:focus-visible { outline: 2px solid var(--accent); outline-offset: 6px; }

/* ── §5 · naming ── */
.dsn-name-row {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 0 14px;
  padding: 18px 0;
  border-top: 1px solid var(--hairline);
}
.dsn-name-row:last-of-type { border-bottom: 1px solid var(--hairline); }
.dsn-name {
  font-size: clamp(24px, 3.6vw, 40px);
  font-weight: 600;
  letter-spacing: -0.015em;
  color: var(--ink);
}
.dsn-name-does {
  font-size: clamp(15px, 1.8vw, 18px);
  color: var(--ink-quiet);
}

/* ── §5 · the dissolve ── */
.dsn-dissolve { position: relative; }
.dsn-jargon {
  color: var(--ink-soft);
  max-width: 46ch;
  transition: color 900ms var(--ease-out);
}
.dsn-dissolve.is-done .dsn-jargon {
  color: color-mix(in srgb, var(--ink) 22%, transparent);
}
.dsn-strike {
  text-decoration: line-through;
  text-decoration-thickness: 2px;
  text-decoration-color: transparent;
  transition: text-decoration-color 700ms var(--ease-out) 250ms;
}
.dsn-dissolve.is-done .dsn-strike { text-decoration-color: var(--accent); }
.dsn-plain,
.dsn-plain-caption {
  opacity: 0;
  transform: translateY(16px);
  transition: opacity var(--motion-slow) var(--spring-glide) 900ms,
              transform var(--motion-slow) var(--spring-glide) 900ms;
}
.dsn-plain { margin-top: 28px; max-width: 30ch; }
.dsn-plain-caption { margin-top: 14px; transition-delay: 1050ms; }
.dsn-dissolve.is-done .dsn-plain,
.dsn-dissolve.is-done .dsn-plain-caption {
  opacity: 1;
  transform: translateY(0);
}

/* ── §6 · motion studies ── */
.dsn-studies {
  display: grid;
  grid-template-columns: 1fr;
  border: 1px solid var(--hairline);
  border-radius: var(--r-3);
  background: var(--paper-elev);
  overflow: hidden;
}
@media (min-width: 720px) { .dsn-studies { grid-template-columns: repeat(3, 1fr); } }
.dsn-study {
  border-right: 1px solid var(--hairline);
  border-bottom: 1px solid var(--hairline);
  padding: 26px 20px 20px;
}
.dsn-study-stage {
  height: 72px;
  display: flex;
  align-items: flex-end;
  padding-bottom: 10px;
}
.dsn-study-dot {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: var(--accent);
  transform-origin: 50% 100%;
}
.dsn-study--arrival .dsn-study-dot {
  animation: dsn-study-arrival 3.2s var(--spring-glide) infinite;
}
@keyframes dsn-study-arrival {
  0%        { opacity: 0; transform: translateY(16px); }
  15%, 78%  { opacity: 1; transform: translateY(0); }
  88%, 100% { opacity: 0; transform: translateY(16px); }
}
.dsn-study--ack .dsn-study-dot {
  animation: dsn-study-ack 2.4s var(--ease-out) infinite;
}
@keyframes dsn-study-ack {
  0%, 34%, 46%, 100% { transform: scale(1); }
  38%, 42%           { transform: scale(0.82); }
}
.dsn-study--settle .dsn-study-dot {
  animation: dsn-study-settle 4.2s linear infinite; /* ds-allow, settle choreography, ball-canon cut */
}
@keyframes dsn-study-settle {
  0%    { transform: translateY(-64px) scale(0.94, 1.10); opacity: 0; animation-timing-function: cubic-bezier(0.55, 0, 0.85, 0.4); } /* ds-allow, settle choreography, ball-canon cut */
  2%    { opacity: 1; animation-timing-function: cubic-bezier(0.55, 0, 0.85, 0.4); } /* ds-allow, settle choreography, ball-canon cut */
  11%   { transform: translateY(0) scale(1.48, 0.52); animation-timing-function: cubic-bezier(0.15, 0.6, 0.3, 1); } /* ds-allow, settle choreography, ball-canon cut */
  15%   { transform: translateY(-14px) scale(0.88, 1.14); animation-timing-function: cubic-bezier(0.55, 0, 0.85, 0.45); } /* ds-allow, settle choreography, ball-canon cut */
  19%   { transform: translateY(0) scale(1.22, 0.80); animation-timing-function: cubic-bezier(0.25, 0.5, 0.4, 1); } /* ds-allow, settle choreography, ball-canon cut */
  22%   { transform: translateY(-4px) scale(0.96, 1.05); animation-timing-function: cubic-bezier(0.55, 0, 0.85, 0.45); } /* ds-allow, settle choreography, ball-canon cut */
  25%   { transform: translateY(0) scale(1.10, 0.91); animation-timing-function: cubic-bezier(0.3, 0.5, 0.5, 1); } /* ds-allow, settle choreography, ball-canon cut */
  28%   { transform: translateY(0) scale(0.97, 1.02); animation-timing-function: cubic-bezier(0.45, 0, 0.55, 1); } /* ds-allow, settle choreography, ball-canon cut */
  31%, 88% { transform: translateY(0) scale(1, 1); opacity: 1; } /* rest, most of the loop is stillness */
  94%, 100% { transform: translateY(0) scale(1, 1); opacity: 0; }
}
.dsn-study-name {
  font-size: 13.5px;
  font-weight: 600;
  color: var(--ink);
}
.dsn-study-spec {
  margin-top: 3px;
  font-family: var(--font-mono, monospace);
  font-size: 10.5px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--ink-faint);
}
.dsn-study-line {
  margin-top: 8px;
  font-size: 12.5px;
  line-height: 1.5;
  color: var(--ink-quiet);
}

/* ── §8 loading lives in components/design/loading-canon.tsx: the ten
   review-room specimens, played on the shared dsn-dot stage grammar ── */

/* ── §9 · type specimen + colour ── */
.dsn-type-row {
  display: grid;
  grid-template-columns: 132px 1fr;
  gap: 18px;
  align-items: baseline;
  padding: 16px 0;
  border-top: 1px solid var(--hairline);
}
.dsn-type-row:last-of-type { border-bottom: 1px solid var(--hairline); }
.dsn-type-label {
  font-family: var(--font-mono, monospace);
  font-size: 10.5px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--ink-faint);
}

/* ── §9 · the card turn ──
   Hover, click, or Enter turns a card over to its reverse, holds a
   beat, and settles back. 3D transform only; the timing matches the
   FlipCard component's FLIP_MS. Reduced motion turns instantly. */
.dsn-flip {
  perspective: 1400px;
  cursor: pointer;
  outline: none;
}
.dsn-flip:focus-visible .dsn-flip-inner {
  box-shadow: 0 0 0 2px var(--accent);
  border-radius: var(--r-3);
}
.dsn-flip-inner {
  position: relative;
  transform-style: preserve-3d;
  transition: transform 640ms cubic-bezier(0.3, 0.7, 0.25, 1); /* ds-allow, card-turn choreography, one settle curve */
}
.dsn-flip[data-flipped="true"] .dsn-flip-inner {
  transform: rotateY(180deg);
}
.dsn-flip-face {
  border-radius: var(--r-3);
  border: 1px solid var(--hairline);
  background: var(--paper-elev);
  overflow: hidden;
  backface-visibility: hidden;
  box-shadow: 0 1px 2px color-mix(in srgb, var(--ink) 4%, transparent),
              0 12px 32px -18px color-mix(in srgb, var(--ink) 18%, transparent);
}
.dsn-flip-back {
  position: absolute;
  inset: 0;
  transform: rotateY(180deg);
}
/* The honest blank reverse: indigo stock, the mark alone. */
.dsn-flip-blank {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  background: var(--accent);
}
.dsn-flip-blank i {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--paper);
}
@media (prefers-reduced-motion: reduce) {
  .dsn-flip-inner { transition: none; }
}

/* ── §9–10 · plates ── */
.dsn-plate {
  border-radius: var(--r-3);
  border: 1px solid var(--hairline);
  background: var(--paper-elev);
  overflow: hidden;
  box-shadow: 0 1px 2px color-mix(in srgb, var(--ink) 4%, transparent),
              0 12px 32px -18px color-mix(in srgb, var(--ink) 18%, transparent);
  transition: transform var(--motion-fast) var(--ease-out),
              box-shadow var(--motion-fast) var(--ease-out);
}
.dsn-plate:hover {
  transform: translateY(-4px);
  box-shadow: 0 2px 3px color-mix(in srgb, var(--ink) 5%, transparent),
              0 22px 44px -20px color-mix(in srgb, var(--ink) 26%, transparent);
}
.dsn-reject {
  opacity: 0.55;
  filter: saturate(0.6);
  transition: opacity var(--motion-fast) var(--ease-out),
              filter var(--motion-fast) var(--ease-out);
}
.dsn-reject:hover { opacity: 1; filter: saturate(1); }

/* ── rest ── */
.dsn-bleed {
  position: relative;
  left: 50%;
  width: 100vw;
  transform: translateX(-50%);
  background: var(--ink);
}
.dsn-rest-dot {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: var(--accent);
  transform-origin: 50% 100%;
}
.dsn-rest-shadow {
  background: color-mix(in srgb, var(--accent) 30%, transparent);
}
/* Poke the closing dot and it answers: one volume-held bounce, shadow in
   sync, then still again. The page's single character moment. */
.dsn-rest.is-poked .dsn-rest-dot {
  animation: dsn-poke-dot 640ms linear; /* ds-allow, settle choreography, ball-canon cut */
}
.dsn-rest.is-poked .dsn-rest-shadow {
  animation: dsn-poke-shadow 640ms linear;
}
@keyframes dsn-poke-dot {
  0%   { transform: translateY(0) scale(1, 1); }
  16%  { transform: translateY(0) scale(1.34, 0.66); }
  42%  { transform: translateY(-11px) scale(0.90, 1.10); }
  60%  { transform: translateY(0) scale(1.18, 0.84); }
  76%  { transform: translateY(-4px) scale(0.96, 1.04); }
  88%  { transform: translateY(0) scale(1.06, 0.95); }
  100% { transform: translateY(0) scale(1, 1); }
}
@keyframes dsn-poke-shadow {
  0%   { transform: translateX(-50%) scaleX(1); }
  16%  { transform: translateX(-50%) scaleX(1.32); }
  42%  { transform: translateX(-50%) scaleX(0.82); }
  60%  { transform: translateX(-50%) scaleX(1.18); }
  76%  { transform: translateX(-50%) scaleX(0.95); }
  100% { transform: translateX(-50%) scaleX(1); }
}

/* ── reduced motion, everything already at rest ── */
@media (prefers-reduced-motion: reduce) {
  .dsn-open, .dsn-period, .dsn-arrive.is-in,
  .dsq-dot, .dsq-shadow,
  .dsn-job-dot, .dsn-study-dot,
  .dsn-dot-label,
  .dsn-rest.is-poked .dsn-rest-dot, .dsn-rest.is-poked .dsn-rest-shadow { animation: none !important; }
  .dsn-jargon, .dsn-strike::after, .dsn-plain, .dsn-plain-caption { transition: none !important; }
}
`;

const C = "/brand/collateral";

/* Five gestures, recast as the dot's five jobs (§3). Timings are the
   ratified cycles (DESIGN.md §5). */
const JOBS = [
  { cls: "dsn-job--period", name: "Ends the name", line: "signal studio., said once, seated on the baseline." },
  { cls: "dsn-job--caret", name: "Blinks while you think", line: "The caret in Notes. A thought mid-formation." },
  { cls: "dsn-job--pulse", name: "Pulses while work runs", line: "Tasks at rest breathe; under load they quicken." },
  { cls: "dsn-job--sweep", name: "Travels the plan", line: "Timeline's dot walks the line. Direction without urgency." },
  { cls: "dsn-job--tick", name: "Reads the signal", line: "Snaps between sample heights. Reading, not streaming." },
] as const;

/* Each name carries its own mark, per the §2 construction rule: the period
   ends the finished things, the middot marks the working tools. */
const NAMES = [
  { name: "notes", mark: "period", does: "holds notes." },
  { name: "tasks", mark: "middot", does: "holds tasks." },
  { name: "timeline", mark: "middot", does: "shows the plan." },
  { name: "signal", mark: "period", does: "tells you what changed." },
] as const;

const VOICE = [
  {
    num: "V·01",
    title: "Banned words.",
    body: "unleash · empower · seamless · magical · revolutionary · 10x · delight · crush · disrupt · synergy · leverage. Strike on sight.",
  },
  {
    num: "V·02",
    title: "Banned PM vocabulary.",
    body: "sprint · epic · backlog · burndown · velocity · ticket · stand-up · groom · refine. Talk like a person who has the work in front of them.",
  },
  {
    num: "V·03",
    title: "Refusal language is signature.",
    body: "Not a productivity suite. Not a project manager. Not an AI workspace. The brand introduces itself by saying what it isn't first.",
  },
] as const;

const MOTIONS: Array<{
  code: string;
  kind: "studio" | "tasks" | "timeline" | "signal" | "notes";
  name: string;
  cycle: string;
}> = [
  { code: "M·01", kind: "studio", name: "broadcast", cycle: "once" },
  { code: "M·02", kind: "notes", name: "caret", cycle: "1.1s" },
  { code: "M·03", kind: "tasks", name: "pulse", cycle: "2.6s" },
  { code: "M·04", kind: "timeline", name: "sweep", cycle: "5.4s" },
  { code: "M·05", kind: "signal", name: "tick", cycle: "3.6s" },
];

const STUDIES = [
  { cls: "dsn-study--arrival", name: "The Arrival", spec: "480ms · spring-glide", line: "How everything on this page enters. Sixteen pixels of rise, once." },
  { cls: "dsn-study--ack", name: "The Acknowledgement", spec: "140ms · ease-out", line: "How a button answers your hand. Quick enough to feel, too quick to watch." },
  { cls: "dsn-study--settle", name: "The Settle", spec: "1.15s · squash & stretch", line: "How the dot lands. Volume held constant through every frame." },
] as const;

const REJECTS = [
  { src: `${C}/cards/cardx-broadcast-front-preview.png`, alt: "Rejected card concept, Broadcast", w: 748, h: 522 },
  { src: `${C}/cards/cardx-dot-front-preview.png`, alt: "Rejected card concept, Dot", w: 748, h: 522 },
  { src: `${C}/cards/cardx-paper-front-preview.png`, alt: "Rejected card concept, Paper", w: 748, h: 522 },
  { src: `${C}/explorations/cafex-belief-preview.png`, alt: "Rejected café concept, Belief", w: 900, h: 1224 },
  { src: `${C}/explorations/cafex-indigo-preview.png`, alt: "Rejected café concept, Indigo", w: 900, h: 1224 },
  { src: `${C}/explorations/cafex-ink-preview.png`, alt: "Rejected café concept, Ink", w: 900, h: 1224 },
] as const;

function Eyebrow({ num, children }: { num?: string; children: React.ReactNode }) {
  return (
    <div
      className="mb-6 text-[11px] font-semibold uppercase"
      style={{ color: "var(--accent)", letterSpacing: "var(--tracking-eyebrow)" }}
    >
      {num ? (
        <span aria-hidden className="mr-2 font-mono font-normal text-ink-faint">
          {num}
        </span>
      ) : null}
      {children}
    </div>
  );
}

function SectionHead({
  num,
  eyebrow,
  title,
  children,
}: {
  num?: string;
  eyebrow: string;
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="max-w-[760px]">
      <Eyebrow num={num}>{eyebrow}</Eyebrow>
      <h2 className="text-balance text-[clamp(24px,3.2vw,34px)] font-semibold leading-[1.15] tracking-[-0.015em] text-ink">
        {title}
      </h2>
      {children ? (
        <p className="mt-3 max-w-[54ch] text-pretty text-[15.5px] leading-relaxed text-ink-soft">{children}</p>
      ) : null}
    </div>
  );
}

function SpecLine({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.08em] text-ink-quiet">
      {children}
    </p>
  );
}

function Plate({
  src,
  alt,
  width,
  height,
  className = "",
  reject = false,
  sizes = "(max-width: 768px) 100vw, (max-width: 1240px) 50vw, 400px",
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  reject?: boolean;
  sizes?: string;
}) {
  return (
    <div className={`dsn-plate ${reject ? "dsn-reject" : ""} ${className}`}>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        sizes={sizes}
        className="h-auto w-full"
      />
    </div>
  );
}

export default function DesignPage() {
  return (
    <>
      <ReadingProgress />
      <style dangerouslySetInnerHTML={{ __html: DSN_CSS }} />
      <main id="main" tabIndex={-1} className="dsn flex flex-1 flex-col overflow-x-clip">
        {/* ── 1 · The dot ─────────────────────────────────────── */}
        <section className="relative mx-auto flex min-h-[68vh] w-full max-w-[1240px] flex-col justify-center px-6 pb-10 pt-16 md:pt-20">
          <div aria-hidden className="dsq-origin hidden sm:block">
            <span className="dsq-dot" />
            <span className="dsq-shadow" />
          </div>

          <div className="max-w-[760px]">
            <div className="dsn-open">
              <Eyebrow num="01">Design</Eyebrow>
              <h1
                aria-label="It starts with a dot."
                className="text-balance text-[clamp(44px,7.4vw,88px)] font-semibold leading-[1.02] tracking-[-0.025em] text-ink"
              >
                <span aria-hidden>
                  It starts with a dot<span className="dsn-period" />
                </span>
              </h1>
            </div>
          </div>
        </section>

        {/* ── 2 · Two dots, actually ──────────────────────────── */}
        <Arrive as="section" className="mx-auto w-full max-w-[1240px] px-6 py-16 md:py-24">
          <SectionHead num="02" eyebrow="Construction" title="Two dots, actually.">
            The period sits on the baseline and ends a name. The middot floats
            toward cap-height and marks the working tools. Neither is
            decoration. Both are set, not placed.
          </SectionHead>

          <div className="mt-10 grid gap-5 md:grid-cols-2">
            <div className="dsn-cons">
              <div className="dsn-cons-stage">
                <span className="dsn-rule dsn-rule--cap">
                  <span className="dsn-rule-label">cap height</span>
                </span>
                <span className="dsn-rule dsn-rule--base">
                  <span className="dsn-rule-label">baseline</span>
                </span>
                <div className="dsn-cons-mark" aria-label="notes.">
                  notes<span className="dot-period" aria-hidden />
                </div>
              </div>
              <SpecLine>the period · 0.15em · baseline-seated · +0.02em bearing</SpecLine>
              <p className="mt-2 text-[13px] leading-relaxed text-ink-quiet">
                Ends the finished things: signal studio. notes. signal.
              </p>
            </div>

            <div className="dsn-cons">
              <div className="dsn-cons-stage">
                <span className="dsn-rule dsn-rule--cap">
                  <span className="dsn-rule-label">cap height</span>
                </span>
                <span className="dsn-rule dsn-rule--base">
                  <span className="dsn-rule-label">baseline</span>
                </span>
                <div className="dsn-cons-mark" aria-label="tasks·">
                  tasks<span className="dot-middot" aria-hidden />
                </div>
              </div>
              <SpecLine>the middot · 0.15em · lifted 0.62em · 10px ceiling</SpecLine>
              <p className="mt-2 text-[13px] leading-relaxed text-ink-quiet">
                Marks the working tools: tasks· timeline· Work, still moving.
              </p>
            </div>
          </div>
        </Arrive>

        {/* ── 3 · The dot becomes ─────────────────────────────── */}
        <Arrive as="section" className="mx-auto w-full max-w-[1240px] px-6 py-16 md:py-24">
          <SectionHead num="03" eyebrow="The thread" title="The dot becomes.">
            It ends our name. It blinks while you think. It pulses while work
            runs. It travels the plan. It reads the signal. One mark, five
            jobs, the whole system in miniature.
          </SectionHead>

          <div className="dsn-jobs mt-10">
            {JOBS.map((job) => (
              <div key={job.name} className={`dsn-job ${job.cls}`}>
                <div className="dsn-job-stage" aria-hidden>
                  <span className="dsn-job-dot" />
                </div>
                <div className="dsn-job-name">{job.name}</div>
                <div className="dsn-job-line">{job.line}</div>
              </div>
            ))}
          </div>
        </Arrive>

        {/* ── 4 · Meet Dot ────────────────────────────────────── */}
        <Arrive as="section" className="mx-auto w-full max-w-[1240px] px-6 py-16 md:py-24">
          <SectionHead num="04" eyebrow="The character" title="Meet Dot.">
            The same mark, given a working day. Ten moods on one 1.4 second
            bar: it idles, gets curious, ships something, takes a setback,
            and finally sleeps. Poke it. Drag it. Or let the reel run.
          </SectionHead>

          <DotCharacter />

          <SpecLine>
            transform only · volume held · the shadow is computed, never drawn · rotation only in the air
          </SpecLine>
        </Arrive>

        {/* ── 5 · Naming ──────────────────────────────────────── */}
        <Arrive as="section" className="mx-auto w-full max-w-[1240px] px-6 py-16 md:py-24">
          <SectionHead num="05" eyebrow="Names" title="Named so you don't have to ask." />
          <div className="mt-10 max-w-[860px]">
            {NAMES.map((n) => (
              <div key={n.name} className="dsn-name-row">
                <span className="dsn-name">
                  {n.name}
                  <span
                    className={n.mark === "period" ? "dot-period" : "dot-middot"}
                    aria-hidden
                  />
                </span>
                <span className="dsn-name-does">{n.does}</span>
              </div>
            ))}
          </div>
          <SpecLine>If a name needs explaining, it&rsquo;s the wrong name.</SpecLine>
        </Arrive>

        {/* ── 6 · The dissolve ────────────────────────────────── */}
        <Arrive as="section" className="mx-auto w-full max-w-[1240px] px-6 py-16 md:py-24">
          <SectionHead num="06" eyebrow="Plain language" title="Most project software talks like this:" />
          <div className="mt-10">
            <Dissolve />
          </div>
          <p className="mt-10 max-w-[54ch] text-pretty text-[15.5px] leading-relaxed text-ink-soft">
            We build for the 80% of people who don&rsquo;t work in tech. They
            don&rsquo;t need smaller ambitions. They need software in their
            own language.
          </p>

          {/* The vocabulary of the work, what the voice refuses to say. */}
          <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-3">
            {VOICE.map((v) => (
              <div
                key={v.num}
                className="rounded-[var(--r-3)] border border-[var(--hairline)] bg-[var(--paper-elev)] p-5"
              >
                <div className="mb-2 font-mono text-[10px] tracking-[0.06em] text-[var(--accent)]">
                  {v.num}
                </div>
                <h4 className="m-0 mb-1.5 text-[16px] font-medium tracking-[-0.015em] text-ink">
                  {v.title}
                </h4>
                <p className="m-0 text-[13.5px] leading-[1.5] text-ink-soft">{v.body}</p>
              </div>
            ))}
          </div>
        </Arrive>

        {/* ── 7 · Motion ──────────────────────────────────────── */}
        <Arrive as="section" className="mx-auto w-full max-w-[1240px] px-6 py-16 md:py-24">
          <SectionHead num="07" eyebrow="Motion" title="Nothing moves without a reason.">
            Five wordmarks, five gestures. The entire animation vocabulary of
            the suite. Hover to replay, click to freeze.
          </SectionHead>

          <div className="mt-10 grid grid-cols-2 overflow-hidden rounded-[var(--r-3)] border border-[var(--hairline)] bg-[var(--paper-elev)] sm:grid-cols-3 md:grid-cols-5">
            {MOTIONS.map((m) => (
              <MotionSpecimen key={m.code} kind={m.kind} name={m.name} cycle={m.cycle} />
            ))}
          </div>

          <div className="dsn-studies mt-5">
            {STUDIES.map((s) => (
              <div key={s.name} className={`dsn-study ${s.cls}`}>
                <div className="dsn-study-stage" aria-hidden>
                  <span className="dsn-study-dot" />
                </div>
                <div className="dsn-study-name">{s.name}</div>
                <div className="dsn-study-spec">{s.spec}</div>
                <div className="dsn-study-line">{s.line}</div>
              </div>
            ))}
          </div>
        </Arrive>

        {/* ── 8 · Loading ─────────────────────────────────────── */}
        <Arrive as="section" className="mx-auto w-full max-w-[1240px] px-6 py-16 md:py-24">
          <SectionHead num="08" eyebrow="Loading" title="Even waiting has a shape.">
            The easy version was one spinner. Instead, ten loading moments
            share one contract: a ten-pixel dot before anything else, one
            indigo, no fake progress, and nothing re-blanks once the chrome
            is up. The reel plays all ten; the index jumps.
          </SectionHead>

          <LoadingCanon />

          <SpecLine>
            ten moments · five products · one contract · no spinner in the system ·{" "}
            <a
              href="/brand/loading-review-2026.html"
              className="underline underline-offset-2 transition-colors hover:text-ink"
            >
              the review room
            </a>
          </SpecLine>
        </Arrive>

        {/* ── 9 · Type & colour ───────────────────────────────── */}
        <Arrive as="section" className="mx-auto w-full max-w-[1240px] px-6 py-16 md:py-24">
          <SectionHead num="09" eyebrow="Type &amp; colour" title="One typeface. Three colours.">
            Geist, at every size we use and no others. Ink, paper, indigo:
            the whole palette. Restraint is a feature.
          </SectionHead>

          <div className="mt-10 max-w-[860px]">
            <div>
              <div className="dsn-type-row">
                <span className="dsn-type-label">display · 600</span>
                <span className="text-[clamp(30px,3.6vw,44px)] font-semibold leading-[1.05] tracking-[-0.02em] text-ink">Clarity</span>
              </div>
              <div className="dsn-type-row">
                <span className="dsn-type-label">heading · 600</span>
                <span className="text-[clamp(20px,2.4vw,27px)] font-semibold tracking-[-0.015em] text-ink">for the 80%</span>
              </div>
              <div className="dsn-type-row">
                <span className="dsn-type-label">body · 400</span>
                <span className="text-[15.5px] leading-relaxed text-ink-soft">not in tech, who plan weddings, run crews, and coordinate volunteers.</span>
              </div>
              <div className="dsn-type-row">
                <span className="dsn-type-label">caption · 400</span>
                <span className="text-[12.5px] text-ink-quiet">The small print still gets set with intent.</span>
              </div>
              <div className="dsn-type-row">
                <span className="dsn-type-label">mono · 400</span>
                <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-ink-quiet">Specs, labels, and the truth</span>
              </div>
            </div>
          </div>

          {/* Named to the hex, indigo, paper, ink, the whole system in three cards. */}
          <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-[2fr_1fr]">
            <div
              className="flex min-h-[300px] flex-col justify-between overflow-hidden rounded-[var(--r-3)] p-8 text-white"
              style={{ background: "var(--accent)" }}
            >
              <div>
                <div className="font-mono text-[11px] uppercase tracking-[0.06em] opacity-70">
                  Indigo &middot; brand primary
                </div>
                <div className="my-3 text-[clamp(34px,4.4vw,44px)] font-medium tracking-[-0.025em]" style={{ fontFeatureSettings: "'tnum'" }}>
                  #4F46E5
                </div>
                <div className="max-w-[360px] text-[15.5px] leading-[1.45] opacity-90">
                  The dot, every primary action, every product accent. There is
                  no second brand colour.
                </div>
              </div>
              <div className="mt-6 flex flex-wrap gap-5 font-mono text-[11px] opacity-75">
                <span>oklch(0.51 0.24 273)</span>
                <span>RGB 79 70 229</span>
                <span>AA on white &middot; 6.3</span>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div
                className="flex aspect-[4/2.4] flex-col justify-between rounded-[var(--r-3)] border border-[var(--hairline)] p-5"
                style={{ background: "var(--paper)", color: "var(--ink)" }}
              >
                <div className="font-mono text-[11px] uppercase tracking-[0.06em] opacity-65">
                  Paper &middot; surface
                </div>
                <div className="text-[22px] font-medium tracking-[-0.02em]">#FFFFFF</div>
              </div>
              <div
                className="flex aspect-[4/2.4] flex-col justify-between rounded-[var(--r-3)] p-5"
                style={{ background: "var(--ink)", color: "var(--paper)" }}
              >
                <div className="font-mono text-[11px] uppercase tracking-[0.06em] opacity-65">
                  Ink &middot; off-black
                </div>
                <div className="text-[22px] font-medium tracking-[-0.02em]">#111111</div>
              </div>
            </div>
          </div>
        </Arrive>

        {/* ── 10 · Care you can hold ──────────────────────────── */}
        <Arrive as="section" className="mx-auto w-full max-w-[1240px] px-6 py-16 md:py-24">
          <SectionHead num="10" eyebrow="In the world" title="Care you can hold.">
            Three cards. 350–400gsm uncoated, rich black, one indigo matched
            across every piece. The QR goes where we go.
          </SectionHead>

          {/* One card per colour: indigo, paper, ink. The whole palette,
              held in the hand. Each one turns over when asked. */}
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <FlipCard
                front={`${C}/explorations/fpx-indigo-front-preview.png`}
                back={`${C}/explorations/fpx-indigo-back-preview.png`}
                frontAlt="Founding Partner card, indigo, numbered one of twenty-five."
                backAlt="Paper reverse with Ethan McNamara's founder contact details and same-day reply promise."
                width={748}
                height={522}
              />
              <SpecLine>the founding partner card · one of 25 · indigo</SpecLine>
            </div>
            <div>
              <FlipCard
                front={`${C}/identity/founder-card-back-preview.png`}
                back={`${C}/identity/founder-card-front-preview.png`}
                frontAlt="Founder card, paper face, name and contact details."
                backAlt="rich black with the wordmark and the QR."
                width={748}
                height={522}
              />
              <SpecLine>the founder&rsquo;s card · paper · QR on the reverse</SpecLine>
            </div>
            <div>
              <FlipCard
                front={`${C}/cards/cardx-duo-front-preview.png`}
                back={`${C}/cards/cardx-duo-back-preview.png`}
                frontAlt="Duo card, rich black face with QR."
                backAlt="indigo with the founder's name and contact."
                width={748}
                height={522}
              />
              <SpecLine>the duo card · ink face, indigo reverse · one QR</SpecLine>
            </div>
          </div>

          {/* the poster gets a spread of its own: ink field, paper caption */}
          <div className="dsn-bleed mt-16">
            <div className="mx-auto w-full max-w-[1240px] px-6 py-16 md:py-24">
              <div className="mx-auto max-w-[820px]">
                <Plate src={`${C}/identity/campaign-poster-preview.png`} alt="Poster, Ink, “Most projects never get called one.” in white and indigo on black" width={3280} height={4596} sizes="(max-width: 768px) 100vw, 820px" />
              </div>
              <p className="mx-auto mt-6 max-w-[820px] text-center font-mono text-[11px] uppercase tracking-[0.08em]" style={{ color: "color-mix(in srgb, var(--paper) 60%, transparent)" }}>
                the poster · A2 · rich black · one indigo
              </p>
            </div>
          </div>
        </Arrive>

        {/* ── 11 · The room ───────────────────────────────────── */}
        <Arrive as="section" className="mx-auto w-full max-w-[1240px] px-6 py-16 md:py-24">
          <SectionHead num="11" eyebrow="The room" title="Nothing ships its first draft.">
            Every surface here spent time in a room first: built several
            ways, compared side by side, cut to one. Signal&rsquo;s front page
            auditioned five ways. Six cards were designed; three shipped.
            Taste is mostly the word no.
          </SectionHead>
          <div className="mt-8 grid grid-cols-3 gap-4 md:grid-cols-6">
            {REJECTS.map((r) => (
              <Plate key={r.src} src={r.src} alt={r.alt} width={r.w} height={r.h} reject />
            ))}
          </div>
          <SpecLine>the concepts that lost · dimmed on purpose</SpecLine>
        </Arrive>

        {/* ── Rest ────────────────────────────────────────────── */}
        <Arrive as="section" className="mx-auto w-full max-w-[1240px] px-6 pb-8 pt-16 md:pt-24">
          <div className="max-w-[760px]">
            <RestDot />
            <p className="text-[clamp(20px,2.6vw,27px)] font-semibold leading-snug tracking-[-0.015em] text-ink">
              The products arrive 1 September.
              <br />
              The dot got here first.
            </p>
            <p className="mt-4 font-mono text-[12px] uppercase tracking-[0.08em] text-ink-quiet">
              hello@signalstudio.ie
            </p>
          </div>
        </Arrive>

        <SiteFooter />
      </main>
    </>
  );
}
