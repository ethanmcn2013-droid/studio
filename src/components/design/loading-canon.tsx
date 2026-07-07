"use client";

import { useEffect, useRef, useState } from "react";

/**
 * The loading canon exhibit on /design §8: the ten ratified loading
 * moments from the review room (public/brand/loading-review-2026.html,
 * decision: loading-canon-2026-07), played one at a time on a specimen
 * stage. Every keyframe, duration, easing, and stagger here is ported
 * from that artifact, it is the canon, not an illustration of it.
 *
 * Format mirrors the Dot exhibit: an index rail on the left (click to
 * jump, click the active row to replay), the stage on the right, and
 * the reel advancing itself when left alone. The reel only runs while
 * the stage is on screen. Reduced motion pins every specimen to its
 * settled state and stops the reel; the rail still switches specimens.
 */

interface Moment {
  num: string;
  name: string;
  scope: string;
  cap: string;
  dur: string;
  ease: string;
  aria: string;
  hold: number; // ms on stage before the reel advances
}

const MOMENTS: Moment[] = [
  { num: "01", name: "Layer-0 Ready Dot", scope: "before chrome", cap: "Painted by the server at 0ms. No copy, no hold, just the mark, breathing.", dur: "0ms in · 1.8s breath", ease: "ease-breath", aria: "aria-hidden", hold: 4200 },
  { num: "02", name: "Wordmark Land", scope: "cold app entry", cap: "The destination's name assembles and its dot lands, so you know where you are.", dur: "rise 280ms · land 360ms", ease: "spring-glide", aria: "aria-hidden", hold: 4600 },
  { num: "03", name: "Suite Handoff", scope: "product switch", cap: "The press answers in 120ms and never blocks the trip. The destination owns the arrival.", dur: "press ≤120ms · land 360ms", ease: "spring-soft · spring-glide", aria: "aria-hidden", hold: 4800 },
  { num: "04", name: "Chrome Reveal", scope: "boot to content", cap: "Boot, chrome, content, in that order, once. Nothing ever re-blanks.", dur: "120 · 160 · 200ms", ease: "ease-out", aria: "aria-hidden", hold: 4400 },
  { num: "05", name: "Content Skeleton", scope: "after chrome", cap: "Once chrome exists, only the content region loads. Static after the reveal.", dur: "reveal 200ms · then static", ease: "ease-out", aria: "aria-hidden", hold: 3800 },
  { num: "06", name: "The Honest Wait", scope: "real delay only", cap: "After five real seconds, a plain sentence. Never a fake bar.", dur: "escalates at 5000ms", ease: "copy fades 200ms", aria: "role=status · polite", hold: 7000 },
  { num: "07", name: "Notes Quiet Capture", scope: "notebook init", cap: "The surface first, then the caret resolves. No fake text, ever.", dur: "sheet 760ms · caret 720ms", ease: "spring-glide · steps", aria: "aria-hidden", hold: 5200 },
  { num: "08", name: "Tasks Skeleton", scope: "list · board · detail", cap: "Each route reserves its real geometry. One pulse, mark level only.", dur: "rows 200ms · pulse 2.6s", ease: "ease-out · ease-breath", aria: "aria-hidden", hold: 4400 },
  { num: "09", name: "Timeline Thread", scope: "timeline only", cap: "The thread draws, the marker lands. The only shimmer in the whole system.", dur: "draw 600ms · shimmer 2.4s", ease: "spring-glide", aria: "aria-hidden", hold: 5200 },
  { num: "10", name: "Briefing Assembly", scope: "briefing · today", cap: "What is ready renders first. What is not is named, not spun for.", dur: "rows 320ms · stagger 180ms", ease: "ease-out · tick 3.6s", aria: "aria-busy on the well", hold: 5400 },
];

/* Moment 02 rotates through the four destinations, one per arrival. */
const PRODUCTS = [
  { name: "notes", gesture: "caret" },
  { name: "tasks", gesture: "pulse" },
  { name: "timeline", gesture: "slide" },
  { name: "signal", gesture: "tick" },
] as const;

export function LoadingCanon() {
  const [active, setActive] = useState(0);
  const [seq, setSeq] = useState(0);
  const [inView, setInView] = useState(false);
  const [reduced, setReduced] = useState(false);
  const stageRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const h = () => setReduced(mq.matches);
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => setInView(!!entries[0]?.isIntersecting),
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // The reel: hold the current moment, then advance. Paused offscreen
  // and under reduced motion.
  useEffect(() => {
    if (!inView || reduced) return;
    const t = setTimeout(() => {
      setActive((a) => (a + 1) % MOMENTS.length);
      setSeq((s) => s + 1);
    }, MOMENTS[active].hold);
    return () => clearTimeout(t);
  }, [active, seq, inView, reduced]);

  const jump = (i: number) => {
    setActive(i);
    setSeq((s) => s + 1); // remount = replay, also when i === active
  };

  const M = MOMENTS[active];
  const product = PRODUCTS[seq % PRODUCTS.length];

  return (
    <div className="dsn-dot-lab mt-10">
      <div className="dsn-dot-side">
        <div className="dsn-dot-label" key={active}>
          <div className="dsn-dot-toprow">
            <span className="dsn-dot-idx">{M.num}</span>
            <span className="dsn-dot-name">{M.name}</span>
          </div>
          <p className="dsn-dot-cap">{M.cap}</p>
          <p className="ldc-spec">
            {M.dur} · {M.ease} · {M.aria}
          </p>
        </div>
        <div className="dsn-dot-rail" role="list">
          {MOMENTS.map((m, i) => {
            const on = i === active;
            return (
              <button
                key={m.num}
                type="button"
                role="listitem"
                className="dsn-dot-row"
                aria-current={on || undefined}
                aria-label={`Play ${m.name}.${on ? " Playing; activate to replay." : ""}`}
                onClick={() => jump(i)}
              >
                <span className="dsn-dot-tick" style={{ opacity: on ? 1 : 0 }} aria-hidden />
                <span className="dsn-dot-rownum" data-on={on || undefined}>{m.num}</span>
                <span className="dsn-dot-rowname" data-on={on || undefined}>{m.name}</span>
                <span className="dsn-dot-rowdur">{m.scope}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="dsn-dot-stagewrap">
        <div
          ref={stageRef}
          className="dsn-dot-stage ldc-stage"
          data-rm={reduced || undefined}
        >
          <i className="dsn-dot-corner dsn-dot-corner--tl" aria-hidden />
          <i className="dsn-dot-corner dsn-dot-corner--tr" aria-hidden />
          <i className="dsn-dot-corner dsn-dot-corner--bl" aria-hidden />
          <i className="dsn-dot-corner dsn-dot-corner--br" aria-hidden />
          <span className="dsn-dot-meta dsn-dot-meta--tl" aria-hidden>
            Specimen · {M.scope}
          </span>
          <span className="dsn-dot-meta dsn-dot-meta--tr" aria-hidden>{M.dur}</span>
          <span className="dsn-dot-meta dsn-dot-meta--bl" aria-hidden>
            {CAPTIONS[active]}
          </span>

          {/* Remount per (moment, seq): CSS animations restart clean. */}
          <div className="ldc-body" key={`${active}-${seq}`} aria-hidden>
            <Specimen index={active} product={product} />
          </div>
        </div>
      </div>
      <style dangerouslySetInnerHTML={{ __html: LDC_CSS }} />
    </div>
  );
}

/* Stage captions, verbatim from the review room. */
const CAPTIONS = [
  "server paint · no copy · no hold",
  "cold entry · the destination says its own name",
  "press never blocks nav · destination owns arrival",
  "boot 900ms · dot out 120 · chrome 160 · content 200",
  "content region only · static after reveal",
  "real 5.0s timer · a sentence, not a bar",
  "surface first · caret resolves · no fake text",
  "one pulse, mark level only",
  "content well only · shimmer is canonical here",
  "available slices first · aria-busy while fetching",
];

function Word({
  text,
  dotClass,
  stagger = 55,
  delay = 0,
  dotDelay,
  gestureDelay,
}: {
  text: string;
  dotClass: string;
  stagger?: number;
  delay?: number;
  dotDelay?: number;
  gestureDelay?: number;
}) {
  const dd = dotDelay ?? delay + text.length * stagger;
  const gd = gestureDelay ?? dd + 360;
  return (
    <span className="ldc-word">
      {text.split("").map((ch, i) => (
        <span key={i} className="ldc-letter" style={{ animationDelay: `${delay + i * stagger}ms` }}>
          {ch}
        </span>
      ))}
      <span className={`ldc-wdot ${dotClass}`} style={{ animationDelay: `${dd}ms, ${gd}ms` }} />
    </span>
  );
}

function Specimen({ index, product }: { index: number; product: (typeof PRODUCTS)[number] }) {
  switch (index) {
    case 0:
      return (
        <div className="ldc-center">
          <span className="ldc-bdot ldc-breath" />
        </div>
      );
    case 1:
      return (
        <div className="ldc-center">
          <span className="ldc-mark">
            <Word text={product.name} dotClass={`ldc-land ldc-g-${product.gesture}`} />
          </span>
        </div>
      );
    case 2:
      return (
        <div className="ldc-center">
          <div className="ldc-handoff">
            <div className="ldc-card ldc-src">
              <span className="ldc-mini">tasks<span className="ldc-wdot ldc-g-pulse-only" /></span>
            </div>
            <span className="ldc-arrow" />
            <div className="ldc-card">
              <span className="ldc-mini">
                <Word
                  text="signal"
                  dotClass="ldc-land ldc-g-tick"
                  stagger={45}
                  delay={140}
                  dotDelay={480}
                  gestureDelay={1200}
                />
              </span>
            </div>
          </div>
        </div>
      );
    case 3:
      return (
        <div className="ldc-shell">
          <div className="ldc-loader">
            <span className="ldc-bdot ldc-breath" />
          </div>
          <div className="ldc-chrome-top">
            <span className="ldc-mini">signal studio<span className="ldc-wdot ldc-still" /></span>
            <span className="ldc-mono">Products</span>
          </div>
          <div className="ldc-chrome-content">
            <div className="ldc-soft" style={{ height: 128 }} />
            <div className="ldc-stack">
              <div className="ldc-soft" style={{ height: 22, width: "78%" }} />
              <div className="ldc-soft" style={{ height: 16 }} />
              <div className="ldc-soft" style={{ height: 16, width: "84%" }} />
              <div className="ldc-soft" style={{ height: 64, marginTop: 8 }} />
            </div>
          </div>
        </div>
      );
    case 4:
      return (
        <div className="ldc-skel">
          <div className="ldc-skel-bar ldc-fade" style={{ animationDelay: "0ms" }}>
            <div className="ldc-soft" style={{ height: 20, width: "58%" }} />
            <div className="ldc-soft" style={{ height: 26 }} />
          </div>
          {[0, 1, 2].map((r) => (
            <div key={r} className="ldc-skel-row ldc-fade" style={{ animationDelay: `${40 + r * 40}ms` }}>
              <div className="ldc-soft" style={{ height: 13 }} />
              <div className="ldc-soft" style={{ height: 13, width: `${[100, 78, 64][r]}%` }} />
              <div className="ldc-soft" style={{ height: 13 }} />
            </div>
          ))}
        </div>
      );
    case 5:
      return (
        <div className="ldc-center">
          <div className="ldc-wait">
            <span className="ldc-bdot ldc-breath" />
            <span className="ldc-status">Opening the briefing</span>
          </div>
        </div>
      );
    case 6:
      return (
        <div className="ldc-center">
          <div className="ldc-notes">
            <div className="ldc-sheet">
              <div className="ldc-sheet-top">
                <span className="ldc-pin" />
                <span className="ldc-lock" />
              </div>
              <span className="ldc-rule" />
              <div className="ldc-lines">
                <span /><span /><span />
              </div>
            </div>
            <span className="ldc-notes-mark">notes<span className="ldc-wdot ldc-caret-morph" /></span>
          </div>
        </div>
      );
    case 7:
      return (
        <div className="ldc-tasks">
          <div className="ldc-tasks-title">
            <span className="ldc-mini">tasks<span className="ldc-wdot ldc-g-pulse-only" /></span>
            <span className="ldc-mono">Rows stay static</span>
          </div>
          <div className="ldc-variants">
            {(["List", "Board", "Detail"] as const).map((v, i) => (
              <div key={v} className="ldc-variant ldc-fade" style={{ animationDelay: `${i * 40}ms` }}>
                <span className="ldc-mono">{v}</span>
                {v === "Board" ? (
                  <div className="ldc-lane">
                    <div className="ldc-soft" style={{ height: 18 }} />
                    <div className="ldc-soft" style={{ height: 18, width: "74%" }} />
                    <div className="ldc-soft" style={{ height: 18, width: "88%" }} />
                  </div>
                ) : (
                  <>
                    <div className="ldc-soft" style={{ height: 24 }} />
                    <div className="ldc-soft" style={{ height: 24, width: v === "List" ? "82%" : "70%" }} />
                    <div className="ldc-soft" style={{ height: 24, width: v === "List" ? "92%" : "60%" }} />
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      );
    case 8:
      return (
        <div className="ldc-timeline">
          <div className="ldc-thread">
            <div className="ldc-thread-line" />
            <div className="ldc-thread-marker" />
          </div>
          <div className="ldc-thread-content">
            {[0, 1, 2].map((r) => (
              <div
                key={r}
                className="ldc-soft ldc-shimmer ldc-fade"
                style={{
                  height: r === 0 ? 18 : 14,
                  width: `${[56, 88, 72][r]}%`,
                  animationDelay: `${800 + r * 60}ms`,
                }}
              />
            ))}
          </div>
        </div>
      );
    default:
      return (
        <div className="ldc-brief">
          {[
            { t: "Needs attention", s: "Active read", chip: "Reading", dot: "tick" },
            { t: "Moving well", s: "Available first", chip: "Ready", dot: "on" },
            { t: "Quiet risks", s: "Unavailable is named", chip: "Unavailable", dot: "quiet" },
            { t: "Suggested focus", s: "Only if rendered here", chip: "Ready", dot: "on" },
          ].map((row, i) => (
            <div key={row.t} className="ldc-brow ldc-brise" style={{ animationDelay: `${i * 180}ms` }}>
              <span className={`ldc-rdot ldc-rdot--${row.dot}`} />
              <span className="ldc-btext">
                <strong>{row.t}</strong>
                <small>{row.s}</small>
              </span>
              <span className={`ldc-chip${row.dot === "quiet" ? " ldc-chip--quiet" : ""}`}>{row.chip}</span>
            </div>
          ))}
        </div>
      );
  }
}

/* ── The specimens' CSS: timings, easings, and staggers are the review
     room's, verbatim (loading-review-2026.html). ───────────────────── */
const LDC_CSS = `
.ldc-stage { height: clamp(380px, 36vw, 460px); }
.ldc-spec {
  margin: 8px 0 0;
  font-family: var(--font-mono, monospace);
  font-size: 10.5px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--ink-faint);
}
.ldc-body { position: absolute; inset: 0; }
.ldc-center {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
}
.ldc-mono {
  color: var(--ink-quiet);
  font-family: var(--font-mono, monospace);
  font-size: 10px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}
.ldc-soft {
  position: relative;
  overflow: hidden;
  border-radius: 8px;
  background: var(--paper-deep);
}

/* Primitives: the 10px boundary dot (DESIGN.md 13.3, hard px) and the
   wordmark dot at the 13.4 ceiling. */
.ldc-bdot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--accent);
  flex: 0 0 auto;
  transform-origin: center;
}
.ldc-wdot {
  display: inline-block;
  width: min(0.16em, 10px);
  height: min(0.16em, 10px);
  margin-left: 0.09em;
  border-radius: 999px;
  background: var(--accent);
  transform-origin: center;
  flex: 0 0 auto;
}
.ldc-word { display: inline-flex; align-items: baseline; }
.ldc-letter {
  display: inline-block;
  opacity: 0;
  transform: translateY(8px);
  animation: ldc-letter-rise 280ms var(--spring-glide) both;
}
.ldc-mark {
  display: inline-flex;
  align-items: baseline;
  color: var(--ink);
  font-size: clamp(34px, 4vw, 54px);
  font-weight: 650;
  letter-spacing: -0.05em;
  line-height: 0.95;
}
.ldc-mini {
  display: inline-flex;
  align-items: baseline;
  font-size: 21px;
  font-weight: 650;
  letter-spacing: -0.045em;
  color: var(--ink);
}
@keyframes ldc-letter-rise {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes ldc-dot-land {
  0%   { opacity: 0; transform: scale(0.42); }
  62%  { opacity: 1; transform: scale(1.14); }
  100% { opacity: 1; transform: scale(1); }
}
@keyframes ldc-breath {
  0%, 100% { opacity: 0.72; transform: scale(0.78); }
  50%      { opacity: 1; transform: scale(1); }
}
@keyframes ldc-g-pulse {
  0%, 35%, 100% { transform: scale(1); }
  12%           { transform: scale(1.22); }
  24%           { transform: scale(1); }
}
@keyframes ldc-g-tick {
  0%   { transform: translateY(0); }
  25%  { transform: translateY(-0.12em); }
  50%  { transform: translateY(0.03em); }
  75%  { transform: translateY(-0.07em); }
  100% { transform: translateY(0); }
}
@keyframes ldc-g-slide {
  0%   { transform: translateX(-0.55em); opacity: 0.35; }
  16%  { transform: translateX(0); opacity: 1; }
  100% { transform: translateX(0); opacity: 1; }
}
@keyframes ldc-g-caret {
  0%, 49%   { opacity: 1; }
  50%, 100% { opacity: 0; }
}
.ldc-breath { animation: ldc-breath 1.8s cubic-bezier(.45,0,.55,1) infinite; } /* ds-allow, loading canon choreography, ease-breath (review-room parity) */
.ldc-still { opacity: 1; }
.ldc-land { opacity: 0; }
.ldc-land.ldc-g-pulse { animation: ldc-dot-land 360ms var(--spring-glide) both, ldc-g-pulse 2.6s cubic-bezier(.45,0,.55,1) infinite; } /* ds-allow, loading canon choreography, ease-breath (review-room parity) */
.ldc-land.ldc-g-tick { animation: ldc-dot-land 360ms var(--spring-glide) both, ldc-g-tick 3.6s steps(1, end) infinite; }
.ldc-land.ldc-g-slide { animation: ldc-dot-land 360ms var(--spring-glide) both, ldc-g-slide 3.8s var(--spring-glide) infinite; }
.ldc-land.ldc-g-caret {
  width: 0.06em;
  height: 0.58em;
  border-radius: 1px;
  animation: ldc-dot-land 360ms var(--spring-glide) both, ldc-g-caret 1.1s steps(1, end) infinite;
}
.ldc-g-pulse-only { animation: ldc-g-pulse 2.6s cubic-bezier(.45,0,.55,1) infinite; } /* ds-allow, loading canon choreography, ease-breath (review-room parity) */
.ldc-fade {
  opacity: 0;
  animation: ldc-fade-up 200ms var(--ease-out) both;
}
@keyframes ldc-fade-up {
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* 03 · handoff */
.ldc-handoff {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
  gap: 18px;
  width: min(520px, 100%);
  align-items: center;
}
.ldc-card {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 86px;
  border: 1px solid var(--hairline);
  border-radius: 12px;
  background: var(--paper);
}
.ldc-src { animation: ldc-press 240ms cubic-bezier(.32,.72,0,1) both; } /* ds-allow, loading canon choreography, spring-soft (review-room parity) */
@keyframes ldc-press {
  0%, 100% { transform: translateY(0) scale(1); border-color: var(--hairline); }
  40%      { transform: translateY(1px) scale(0.995); border-color: color-mix(in srgb, var(--accent) 42%, var(--hairline)); }
}
.ldc-arrow { position: relative; width: 42px; height: 1px; background: var(--hairline); }
.ldc-arrow::after {
  content: "";
  position: absolute;
  right: 0;
  top: 50%;
  width: 7px;
  height: 7px;
  border-right: 1px solid var(--hairline);
  border-top: 1px solid var(--hairline);
  transform: translateY(-50%) rotate(45deg);
}

/* 04 · chrome reveal */
.ldc-shell {
  position: absolute;
  inset: 44px 26px 40px;
  overflow: hidden;
  border: 1px solid var(--hairline);
  border-radius: 12px;
  background: var(--paper);
}
.ldc-loader {
  position: absolute;
  inset: 0;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--paper);
  animation: ldc-field-out 120ms var(--ease-out) 900ms both;
}
@keyframes ldc-field-out {
  from { opacity: 1; }
  to   { opacity: 0; visibility: hidden; }
}
.ldc-chrome-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 46px;
  padding: 0 16px;
  border-bottom: 1px solid var(--hairline);
  opacity: 0;
  animation: ldc-chrome-in 160ms var(--ease-out) 980ms both;
}
.ldc-chrome-top .ldc-mini { font-size: 17px; }
@keyframes ldc-chrome-in {
  from { opacity: 0; transform: translateY(-6px); }
  to   { opacity: 1; transform: translateY(0); }
}
.ldc-chrome-content {
  display: grid;
  grid-template-columns: 0.65fr 1fr;
  gap: 12px;
  padding: 14px;
  opacity: 0;
  animation: ldc-content-in 200ms var(--ease-out) 1100ms both;
}
.ldc-stack { display: grid; gap: 8px; align-content: start; }
@keyframes ldc-content-in {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* 05 · skeleton */
.ldc-skel {
  position: absolute;
  inset: 48px 30px 44px;
  display: grid;
  gap: 10px;
  align-content: center;
}
.ldc-skel-bar {
  display: grid;
  grid-template-columns: 1fr 84px;
  gap: 12px;
  align-items: center;
}
.ldc-skel-row {
  display: grid;
  grid-template-columns: 18px 1fr 64px;
  gap: 10px;
  align-items: center;
  min-height: 42px;
  padding: 10px;
  border: 1px solid var(--hairline);
  border-radius: 10px;
  background: var(--paper);
}

/* 06 · honest wait, the 5000ms is a real delay, not a metaphor */
.ldc-wait { display: grid; justify-items: center; gap: 18px; }
.ldc-status {
  min-height: 20px;
  color: var(--ink-soft);
  font-size: 14.5px;
  font-weight: 600;
  opacity: 0;
  animation: ldc-fade-up 200ms var(--ease-out) 5000ms both;
}

/* 07 · notes quiet capture */
.ldc-notes {
  position: relative;
  width: min(100%, 380px);
  height: 210px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.ldc-sheet {
  position: absolute;
  inset: 18px 22px 10px;
  overflow: hidden;
  border: 1px solid var(--hairline);
  border-radius: 12px;
  background: var(--paper);
  box-shadow: 0 18px 34px color-mix(in srgb, var(--ink) 6%, transparent);
  opacity: 0;
  transform: translateY(10px) scale(0.985);
  animation: ldc-sheet-in 760ms var(--spring-glide) both;
}
@keyframes ldc-sheet-in {
  from { opacity: 0; transform: translateY(10px) scale(0.985); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}
.ldc-sheet-top {
  position: absolute;
  inset: 0 0 auto;
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 12px;
  border-bottom: 1px solid var(--hairline);
}
.ldc-pin {
  width: 6px;
  height: 6px;
  border-radius: 999px;
  background: var(--accent);
  box-shadow: 12px 0 0 var(--ink-ghost);
}
.ldc-lock {
  position: relative;
  width: 19px;
  height: 10px;
  border: 1px solid var(--hairline);
  border-radius: 999px;
}
.ldc-lock::before {
  content: "";
  position: absolute;
  top: 2px;
  left: 4px;
  width: 4px;
  height: 4px;
  border-radius: 999px;
  background: var(--accent);
}
.ldc-rule {
  position: absolute;
  left: 28px;
  right: 28px;
  top: 92px;
  height: 1px;
  background: color-mix(in srgb, var(--accent) 28%, var(--hairline));
  transform: scaleX(0);
  transform-origin: left center;
  animation: ldc-rule-draw 720ms var(--spring-glide) 420ms both;
}
@keyframes ldc-rule-draw { from { transform: scaleX(0); } to { transform: scaleX(1); } }
.ldc-lines {
  position: absolute;
  left: 34px;
  right: 34px;
  bottom: 26px;
  display: grid;
  gap: 8px;
}
.ldc-lines span {
  display: block;
  height: 7px;
  border-radius: 999px;
  background: color-mix(in srgb, var(--ink) 8%, var(--paper));
  opacity: 0;
  animation: ldc-fade-up 360ms var(--ease-out) both;
}
.ldc-lines span:nth-child(1) { width: 68%; animation-delay: 680ms; }
.ldc-lines span:nth-child(2) { width: 86%; animation-delay: 780ms; }
.ldc-lines span:nth-child(3) { width: 48%; animation-delay: 880ms; }
.ldc-notes-mark {
  position: relative;
  z-index: 2;
  display: inline-flex;
  align-items: baseline;
  color: var(--ink);
  font-size: clamp(38px, 4.6vw, 56px);
  font-weight: 650;
  line-height: 1;
  opacity: 0;
  animation: ldc-mark-land 520ms var(--spring-glide) 150ms both;
}
@keyframes ldc-mark-land {
  from { opacity: 0; transform: translateY(-4px); }
  to   { opacity: 1; transform: translateY(-14px); }
}
.ldc-caret-morph {
  width: 0.06em;
  height: 0.58em;
  border-radius: 1px;
  margin-left: 0.11em;
  animation:
    ldc-caret-morph 720ms var(--spring-glide) 300ms both,
    ldc-g-caret 1.1s steps(1, end) 1120ms infinite;
}
@keyframes ldc-caret-morph {
  0%, 48% { opacity: 1; transform: translateY(0.08em) scaleX(2.55) scaleY(0.18); }
  100%    { opacity: 1; transform: translateY(0.08em) scaleX(1) scaleY(1); }
}

/* 08 · tasks route-aware skeleton */
.ldc-tasks {
  position: absolute;
  inset: 44px 26px 40px;
  display: grid;
  grid-template-rows: auto 1fr;
  gap: 12px;
}
.ldc-tasks-title {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 16px;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--hairline);
}
.ldc-variants {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 10px;
  min-height: 0;
}
.ldc-variant {
  display: grid;
  gap: 8px;
  align-content: start;
  min-width: 0;
  padding: 10px;
  border: 1px solid var(--hairline);
  border-radius: 10px;
  background: var(--paper);
}
.ldc-lane {
  min-height: 96px;
  padding: 8px;
  border-radius: 8px;
  background: var(--paper-soft);
  display: grid;
  gap: 7px;
  align-content: start;
}

/* 09 · timeline thread, the one canonical shimmer */
.ldc-timeline {
  position: absolute;
  inset: 40px;
  display: grid;
  align-content: center;
  gap: 22px;
}
.ldc-thread { position: relative; height: 48px; }
.ldc-thread-line {
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  height: 1px;
  background: var(--accent);
  transform: scaleX(0);
  transform-origin: left center;
  animation: ldc-thread-draw 600ms var(--spring-glide) 200ms both;
}
@keyframes ldc-thread-draw { from { transform: scaleX(0); } to { transform: scaleX(1); } }
.ldc-thread-marker {
  position: absolute;
  left: 62%;
  top: calc(50% - 5px);
  width: 10px;
  height: 10px;
  border-radius: 999px;
  background: var(--paper);
  box-shadow: inset 0 0 0 2px var(--accent);
  opacity: 0;
  animation: ldc-marker-land 320ms var(--spring-glide) 620ms both;
}
@keyframes ldc-marker-land {
  from { opacity: 0; transform: translateX(-14px) scale(0.82); }
  to   { opacity: 1; transform: translateX(0) scale(1); }
}
.ldc-thread-content { display: grid; gap: 8px; max-width: 520px; }
.ldc-shimmer { background: color-mix(in srgb, var(--ink) 8%, var(--paper)); }
.ldc-shimmer::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, transparent, var(--paper-deep) 50%, transparent);
  transform: translateX(-100%);
  animation: ldc-shimmer-sweep 2.4s var(--ease-out) infinite;
}
@keyframes ldc-shimmer-sweep {
  from { transform: translateX(-100%); }
  to   { transform: translateX(100%); }
}

/* 10 · briefing assembly */
.ldc-brief {
  position: absolute;
  inset: 42px 30px 40px;
  display: grid;
  gap: 8px;
  align-content: center;
}
.ldc-brow {
  display: grid;
  grid-template-columns: 12px 1fr auto;
  gap: 11px;
  align-items: center;
  min-height: 48px;
  padding: 12px;
  border: 1px solid var(--hairline);
  border-radius: 10px;
  background: var(--paper);
}
.ldc-brise {
  opacity: 0;
  animation: ldc-fade-up 320ms var(--ease-out) both;
}
.ldc-rdot { width: 8px; height: 8px; border-radius: 999px; background: var(--accent); }
.ldc-rdot--quiet { background: var(--ink-ghost); }
.ldc-rdot--tick { animation: ldc-g-tick 3.6s steps(1, end) infinite; }
.ldc-btext strong {
  display: block;
  color: var(--ink);
  font-size: 13px;
  font-weight: 650;
  letter-spacing: -0.01em;
}
.ldc-btext small {
  color: var(--ink-quiet);
  font-family: var(--font-mono, monospace);
  font-size: 10px;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}
.ldc-chip {
  color: var(--accent-deep);
  font-family: var(--font-mono, monospace);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  white-space: nowrap;
}
.ldc-chip--quiet { color: var(--ink-quiet); }

/* Small screens: the three-up grids stack */
@media (max-width: 640px) {
  .ldc-variants { grid-template-columns: 1fr; }
  .ldc-handoff { grid-template-columns: 1fr; justify-items: center; }
  .ldc-arrow { width: 1px; height: 28px; }
  .ldc-arrow::after { right: 50%; top: auto; bottom: 0; transform: translateX(50%) rotate(135deg); }
  .ldc-tasks, .ldc-shell, .ldc-brief { inset: 44px 16px 40px; }
}

/* Reduced motion (or the stage's data-rm): every specimen pinned to its
   settled state, verbatim from the review room's rm block. */
[data-rm] .ldc-body *, [data-rm] .ldc-body *::before, [data-rm] .ldc-body *::after {
  animation: none !important;
}
[data-rm] .ldc-letter, [data-rm] .ldc-wdot { opacity: 1 !important; transform: none !important; }
[data-rm] .ldc-land { opacity: 1; }
[data-rm] .ldc-loader { opacity: 0; visibility: hidden; }
[data-rm] .ldc-chrome-top, [data-rm] .ldc-chrome-content { opacity: 1; transform: none; }
[data-rm] .ldc-fade, [data-rm] .ldc-brise { opacity: 1; transform: none; }
[data-rm] .ldc-sheet, [data-rm] .ldc-lines span { opacity: 1; transform: none; }
[data-rm] .ldc-notes-mark { opacity: 1; transform: translateY(-14px); }
[data-rm] .ldc-rule { transform: scaleX(1); }
[data-rm] .ldc-thread-line { transform: scaleX(1); }
[data-rm] .ldc-thread-marker { opacity: 1; transform: none; }
[data-rm] .ldc-status { opacity: 1; transform: none; }
[data-rm] .ldc-shimmer::after { display: none; }
@media (prefers-reduced-motion: reduce) {
  .ldc-body *, .ldc-body *::before, .ldc-body *::after { animation: none !important; }
  .ldc-letter, .ldc-wdot { opacity: 1 !important; transform: none !important; }
  .ldc-land { opacity: 1; }
  .ldc-loader { opacity: 0; visibility: hidden; }
  .ldc-chrome-top, .ldc-chrome-content { opacity: 1; transform: none; }
  .ldc-fade, .ldc-brise { opacity: 1; transform: none; }
  .ldc-sheet, .ldc-lines span { opacity: 1; transform: none; }
  .ldc-notes-mark { opacity: 1; transform: translateY(-14px); }
  .ldc-rule { transform: scaleX(1); }
  .ldc-thread-line { transform: scaleX(1); }
  .ldc-thread-marker { opacity: 1; transform: none; }
  .ldc-status { opacity: 1; transform: none; }
  .ldc-shimmer::after { display: none; }
}
`;
