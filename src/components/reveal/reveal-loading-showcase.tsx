"use client";

/**
 * RevealLoadingShowcase — the operator's own loading-screen motion graphic,
 * shown off in-flow on the umbrella front door (replaces the prior /proof
 * scene at the operator's request).
 *
 * Ported from "Signal Studio · Loading · Wordmark Assembly v2".
 *
 * SAFETY (post-2026-05-18 SEV-0 loader incident — non-negotiable):
 *   - EVERYTHING is scoped: every class is `slx-*`, every @keyframes is
 *     `slx-*`. Zero global leakage. It cannot collide with the suite
 *     SuiteLoader / signal-loading-dot CSS.
 *   - It is IN-FLOW. The stage is `position:relative` inside a framed,
 *     fixed-aspect block. NOTHING here is `position:fixed`, `inset:0`,
 *     or high z-index. It can never cover a page.
 *   - rAF runs in an effect with strict cleanup; nothing leaks on unmount.
 *   - prefers-reduced-motion: the wordmark renders fully assembled and
 *     still — no rolling dot, no rAF loop. Brand present, zero motion.
 *
 * Typeface: bound to the site's existing Geist (var(--font-geist-sans/mono))
 * so the showcase is pixel-native to the page, not a foreign embed.
 */

import { useEffect, useRef } from "react";

const WORD = "signal studio";
const PERIOD = 5000;
const FADE_OUT_AT = 4700;
const RISE_DURATION = 260;
const RISE_LEAD = 70;

const META_PHASES: ReadonlyArray<readonly [number, number, string]> = [
  [0, 600, "connecting"],
  [600, 1500, "indexing inbox"],
  [1500, 2300, "reading roadmap"],
  [2300, 3100, "sampling analytics"],
  [3100, 3800, "opening the studio"],
  [3800, 5000, "ready"],
];

export function RevealLoadingShowcase() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const wordEl = root.querySelector<HTMLElement>(".slx-word");
    const dotEl = root.querySelector<HTMLElement>(".slx-composer > .slx-dot");
    const composerEl = root.querySelector<HTMLElement>(".slx-composer");
    const metaEl = root.querySelector<HTMLElement>(".slx-meta");
    if (!wordEl || !dotEl || !composerEl) return;

    // build letters
    wordEl.textContent = "";
    [...WORD].forEach((ch) => {
      const span = document.createElement("span");
      span.className = ch === " " ? "slx-letter slx-space" : "slx-letter";
      span.textContent = ch === " " ? " " : ch;
      wordEl.appendChild(span);
    });
    const letters = [...root.querySelectorAll<HTMLElement>(".slx-letter")];

    // reduced motion: assemble fully, no loop
    if (reduce) {
      letters.forEach((el) => {
        el.style.opacity = "1";
        el.style.transform = "translateY(0)";
      });
      root.classList.add("slx-static");
      if (metaEl) metaEl.textContent = "ready · studio";
      return;
    }

    let raf1 = 0;
    let raf2 = 0;
    let metaRaf = 0;
    let centers: number[] = [];
    let risenAt: Array<number | null> = new Array(letters.length).fill(null);
    let lastCycle = 0;
    const start = performance.now();

    const measure = () => {
      const cl = composerEl.getBoundingClientRect().left;
      centers = letters.map((el) => {
        const r = el.getBoundingClientRect();
        return r.left + r.width / 2 - cl;
      });
    };
    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

    const frame = () => {
      const now = performance.now();
      const elapsed = now - start;
      const t = elapsed % PERIOD;
      const cycle = Math.floor(elapsed / PERIOD);
      if (cycle !== lastCycle) {
        risenAt = new Array(letters.length).fill(null);
        lastCycle = cycle;
      }
      const cl = composerEl.getBoundingClientRect().left;
      const dr = dotEl.getBoundingClientRect();
      const dotX = dr.left + dr.width / 2 - cl;
      const dotOpacity = parseFloat(getComputedStyle(dotEl).opacity);

      letters.forEach((el, i) => {
        const lx = centers[i];
        if (lx === undefined) return;
        const distance = lx - dotX;
        if (t > FADE_OUT_AT) {
          const u = Math.min(1, (t - FADE_OUT_AT) / (PERIOD - FADE_OUT_AT));
          el.style.opacity = (risenAt[i] !== null ? 1 - u : 0).toString();
          el.style.transform = `translateY(${u * 6}%)`;
          return;
        }
        if (risenAt[i] === null && dotOpacity > 0.2 && distance < RISE_LEAD) {
          risenAt[i] = t;
        }
        if (risenAt[i] === null) {
          el.style.opacity = "0";
          el.style.transform = "translateY(115%)";
          return;
        }
        let p = Math.min(1, Math.max(0, (t - risenAt[i]!) / RISE_DURATION));
        p = easeOutCubic(p);
        el.style.opacity = p.toString();
        el.style.transform = `translateY(${(1 - p) * 115}%)`;
      });
      raf2 = requestAnimationFrame(frame);
    };

    const metaTick = () => {
      if (metaEl) {
        const t = (performance.now() - start) % PERIOD;
        const ph =
          META_PHASES.find((p) => t >= p[0] && t < p[1]) ??
          META_PHASES[META_PHASES.length - 1];
        metaEl.textContent = `${ph[2]} · ${String(Math.floor(t)).padStart(4, "0")} ms`;
      }
      metaRaf = requestAnimationFrame(metaTick);
    };

    raf1 = requestAnimationFrame(() => {
      measure();
      raf2 = requestAnimationFrame(frame);
    });
    metaRaf = requestAnimationFrame(metaTick);
    window.addEventListener("resize", measure);

    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
      cancelAnimationFrame(metaRaf);
      window.removeEventListener("resize", measure);
    };
  }, []);

  return (
    <section
      className="reveal-loading-showcase"
      aria-label="The Signal Studio loading screen"
    >
      <div className="reveal-loading-showcase-eyebrow reveal">
        Craft <span className="gold">·</span> this is what loading looks like
      </div>

      <div className="slx" ref={rootRef} aria-hidden>
        {/* In-flow framed stage — NOT a fixed overlay. */}
        <div className="slx-stage-frame">
          <div className="slx-chrome slx-tl">
            <span className="slx-wm">
              <span>signal studio</span>
              <span className="slx-dot-static" />
            </span>
          </div>
          <div className="slx-chrome slx-tr">
            <span className="slx-pip" />
            <span className="slx-meta">connecting · 0000 ms</span>
          </div>

          <div className="slx-stage">
            <div className="slx-composer">
              <span className="slx-word" />
              <span className="slx-trail slx-t1" />
              <span className="slx-trail slx-t2" />
              <span className="slx-trail slx-t3" />
              <span className="slx-ripple-slow" />
              <span className="slx-ripple" />
              <span className="slx-dot" />
            </div>
            <div className="slx-caption">the studio is ready</div>
          </div>

          <div className="slx-chrome slx-bl">
            <span>signalstudio.ie · always loading something good</span>
          </div>
        </div>
      </div>

      <style>{SLX_CSS}</style>
    </section>
  );
}

/* Fully scoped — every selector under .slx, every keyframe slx-*. */
const SLX_CSS = `
.slx{
  --slx-stone-50:#fafaf7;--slx-stone-500:#8c887e;--slx-ink:#111;
  --slx-indigo:#4f46e5;--slx-indigo-300:#a5b4fc;
  --slx-hairline-2:rgba(17,17,17,0.06);
  --slx-wm:clamp(40px,7vw,104px);
  --slx-roll:calc(var(--slx-wm) * 9.5);
  width:100%;
}
.slx *{box-sizing:border-box;}
.slx-stage-frame{
  position:relative;width:100%;
  aspect-ratio:16/7;min-height:340px;max-height:560px;
  overflow:hidden;border-radius:16px;
  background:var(--slx-stone-50);color:var(--slx-ink);
  border:1px solid var(--slx-hairline-2);
  font-family:var(--font-geist-sans,system-ui,sans-serif);
}
.slx-chrome{position:absolute;font-family:var(--font-geist-mono,ui-monospace,monospace);
  font-size:11px;letter-spacing:.08em;text-transform:uppercase;
  color:var(--slx-stone-500);display:inline-flex;align-items:center;gap:12px;}
.slx-tl{top:24px;left:24px;}.slx-tr{top:24px;right:24px;}.slx-bl{bottom:24px;left:24px;}
.slx-pip{width:6px;height:6px;border-radius:50%;background:var(--slx-indigo);
  display:inline-block;animation:slx-pip 1.6s cubic-bezier(.45,.05,.55,.95) infinite;}
@keyframes slx-pip{0%,100%{opacity:1}50%{opacity:.35}}
.slx-stage{position:absolute;inset:0;display:flex;flex-direction:column;
  align-items:center;justify-content:center;gap:48px;}
.slx-composer{position:relative;display:inline-flex;align-items:baseline;
  font-family:var(--font-geist-sans,system-ui,sans-serif);font-weight:500;
  font-size:var(--slx-wm);line-height:.95;letter-spacing:-.03em;
  color:var(--slx-ink);padding-bottom:calc(var(--slx-wm) * .25);}
.slx-composer::before{content:'';position:absolute;
  left:calc(-1 * var(--slx-wm) * 3.8);right:calc(-1 * var(--slx-wm) * .9);
  bottom:calc(var(--slx-wm) * .15);height:1px;background:var(--slx-hairline-2);}
.slx-word{display:inline-flex;gap:0;position:relative;z-index:1;}
.slx-letter{display:inline-block;opacity:0;transform:translateY(115%);
  color:var(--slx-ink);will-change:opacity,transform;}
.slx-space{display:inline-block;width:.28em;}
.slx-static .slx-letter{opacity:1!important;transform:none!important;}
.slx-static .slx-dot,.slx-static .slx-trail,.slx-static .slx-ripple,
.slx-static .slx-ripple-slow{animation:none!important;}
.slx-static .slx-dot{opacity:1;transform:none;}
.slx-static .slx-caption{opacity:1;animation:none!important;}
.slx-dot{position:relative;width:.16em;height:.16em;border-radius:50%;
  background:var(--slx-indigo);margin-left:.06em;align-self:flex-end;
  margin-bottom:.06em;transform-origin:center bottom;
  animation:slx-roll 5s cubic-bezier(.34,1.56,.64,1) infinite;z-index:3;}
@keyframes slx-roll{
 0%{transform:translate(calc(-1 * var(--slx-roll)),0) scale(1,1);opacity:0}
 4%{transform:translate(calc(-1 * var(--slx-roll)),0) scale(1,1);opacity:1}
 33%{transform:translate(calc(-0.03 * var(--slx-wm)),0) scale(1,1);opacity:1}
 35%{transform:translate(0,0) scale(1,1);opacity:1}
 38%{transform:translate(0,0) scale(1.55,.55);opacity:1}
 41%{transform:translate(0,0) scale(1.96,.4);opacity:1}
 43%{transform:translate(0,0) scale(1.88,.43);opacity:1}
 48%{transform:translate(0,calc(-0.075 * var(--slx-wm))) scale(.74,1.34);opacity:1}
 53%{transform:translate(0,0) scale(1.24,.82);opacity:1}
 57%{transform:translate(0,0) scale(.96,1.05);opacity:1}
 60%{transform:translate(0,0) scale(1,1);opacity:1}
 68%{transform:translate(0,0) scale(.86,.86);opacity:.86}
 77%{transform:translate(0,0) scale(1,1);opacity:1}
 92%{transform:translate(0,0) scale(1,1);opacity:1}
 100%{transform:translate(0,0) scale(1,1);opacity:0}}
.slx-trail{position:absolute;width:.16em;height:.16em;border-radius:50%;
  background:var(--slx-indigo);align-self:flex-end;margin-bottom:.06em;
  margin-left:.06em;opacity:0;z-index:2;}
.slx-t1{animation:slx-ghost1 5s cubic-bezier(.34,1.56,.64,1) infinite;}
.slx-t2{animation:slx-ghost2 5s cubic-bezier(.34,1.56,.64,1) infinite;}
.slx-t3{animation:slx-ghost3 5s cubic-bezier(.34,1.56,.64,1) infinite;}
@keyframes slx-ghost1{0%,5%{transform:translate(calc(-1 * var(--slx-roll)),0);opacity:0}
 14%{transform:translate(calc(-0.85 * var(--slx-roll)),0);opacity:.5}
 26%{transform:translate(calc(-0.2 * var(--slx-roll)),0);opacity:.26}
 33%,100%{transform:translate(calc(-0.1 * var(--slx-roll)),0);opacity:0}}
@keyframes slx-ghost2{0%,7%{transform:translate(calc(-1 * var(--slx-roll)),0);opacity:0}
 16%{transform:translate(calc(-0.78 * var(--slx-roll)),0);opacity:.36}
 26%{transform:translate(calc(-0.28 * var(--slx-roll)),0);opacity:.18}
 33%,100%{transform:translate(calc(-0.16 * var(--slx-roll)),0);opacity:0}}
@keyframes slx-ghost3{0%,9%{transform:translate(calc(-1 * var(--slx-roll)),0);opacity:0}
 18%{transform:translate(calc(-0.7 * var(--slx-roll)),0);opacity:.24}
 26%{transform:translate(calc(-0.35 * var(--slx-roll)),0);opacity:.11}
 33%,100%{transform:translate(calc(-0.24 * var(--slx-roll)),0);opacity:0}}
.slx-ripple{position:absolute;width:.16em;height:.16em;border-radius:50%;
  border:1px solid var(--slx-indigo);background:transparent;align-self:flex-end;
  margin-bottom:.06em;margin-left:.06em;opacity:0;transform:scale(1);
  animation:slx-ripple-fast 5s cubic-bezier(.22,.7,.2,1) infinite;z-index:1;}
.slx-ripple-slow{position:absolute;width:.16em;height:.16em;border-radius:50%;
  border:1px solid var(--slx-indigo-300);background:transparent;align-self:flex-end;
  margin-bottom:.06em;margin-left:.06em;opacity:0;transform:scale(1);
  animation:slx-ripple-slow 5s cubic-bezier(.22,.7,.2,1) infinite;z-index:1;}
@keyframes slx-ripple-fast{0%,39%{transform:scale(1);opacity:0}
 41%{transform:scale(1);opacity:.7}60%{transform:scale(11);opacity:0}
 100%{transform:scale(11);opacity:0}}
@keyframes slx-ripple-slow{0%,39%{transform:scale(1);opacity:0}
 41%{transform:scale(1);opacity:.45}74%{transform:scale(22);opacity:0}
 100%{transform:scale(22);opacity:0}}
.slx-caption{font-family:var(--font-geist-mono,ui-monospace,monospace);
  font-size:11px;letter-spacing:.08em;text-transform:uppercase;
  color:var(--slx-stone-500);opacity:0;
  animation:slx-caption 5s cubic-bezier(.22,.7,.2,1) infinite;}
@keyframes slx-caption{0%,62%{opacity:0;transform:translateY(4px)}
 74%,92%{opacity:1;transform:translateY(0)}100%{opacity:0;transform:translateY(0)}}
.slx-wm{display:inline-flex;align-items:baseline;
  font-family:var(--font-geist-sans,system-ui,sans-serif);font-weight:500;
  letter-spacing:-.025em;line-height:.95;font-size:14px;color:var(--slx-ink);
  text-transform:none;}
.slx-dot-static{width:.16em;height:.16em;border-radius:50%;
  background:var(--slx-indigo);margin-left:.06em;align-self:flex-end;
  margin-bottom:.06em;flex:0 0 auto;}
@media (max-width:640px){.slx-bl{display:none}.slx-stage-frame{aspect-ratio:4/3}}
@media (prefers-reduced-motion:reduce){
 .slx-dot,.slx-trail,.slx-ripple,.slx-ripple-slow,.slx-pip,.slx-caption{animation:none!important}
 .slx-letter{opacity:1!important;transform:none!important}
 .slx-caption{opacity:1!important}}
`;
