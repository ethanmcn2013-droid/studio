"use client";

/**
 * RevealLoadingShowcase — the operator's loading-screen wordmark assembly,
 * lifted into the hero as the first brand moment. Unframed: NO cream box,
 * NO frame, NO corner chrome — it lives on the page's own white canvas as
 * a single signature animation.
 *
 * Behaviour (operator direction 2026-05-18):
 *   - Plays ONCE: the dot rolls in, the letters of "signal studio." rise
 *     as it passes, the impulse ripples — then it SETTLES and stays.
 *   - It does NOT re-loop the whole assembly. After it settles, only the
 *     dot keeps a gentle, slow pulse/squeeze (the period, breathing).
 *
 * SAFETY (post-2026-05-18 SEV-0 loader incident — non-negotiable):
 *   - Fully scoped: every class `slx-*`, every @keyframes `slx-*`.
 *   - IN-FLOW only. No position:fixed, no inset:0, no high z-index.
 *     It can never cover a page.
 *   - rAF runs for the roll only, then cancels itself; nothing leaks.
 *   - prefers-reduced-motion → wordmark renders fully assembled, still.
 *
 * Typeface bound to the site's Geist (var(--font-geist-*)) so it's
 * pixel-native to the hero, not a foreign embed.
 */

import { useEffect, useRef } from "react";

const WORD = "signal studio";
/**
 * Single source of truth for the assembly duration. MUST stay numerically
 * equal to --slx-dur in SLX_CSS below (ms here = s there). The rAF freezes
 * the letters at ROLL_MS; the CSS dot roll runs for --slx-dur. If they
 * drift, the dot and letters desync. Slowed 2.6s → 3.8s (operator: "slow
 * it a small bit so people don't miss it") — savorable, still crisp.
 */
const ROLL_MS = 3800;
const RISE_MS = 360; // per-letter rise; eased up from 260 to match the calmer pace
/**
 * Play the whole assembly this many times, then settle. Operator direction
 * 2026-05-18: play the hero card animation ONCE (reverses the earlier
 * "repeat twice just in case people miss it"). MUST equal --slx-iter in
 * SLX_CSS (CSS animation-iteration-count) or the dot and letters desync.
 */
const CYCLES = 1;

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
    if (!wordEl || !dotEl || !composerEl) return;

    wordEl.textContent = "";
    [...WORD].forEach((ch) => {
      const span = document.createElement("span");
      span.className = ch === " " ? "slx-letter slx-space" : "slx-letter";
      span.textContent = ch === " " ? " " : ch;
      wordEl.appendChild(span);
    });
    const letters = [...root.querySelectorAll<HTMLElement>(".slx-letter")];

    const freeze = () =>
      letters.forEach((el) => {
        el.style.opacity = "1";
        el.style.transform = "translateY(0)";
      });

    // First-visit-only (per-session): once the assembly has played through
    // this session, a returning visitor lands straight on the settled
    // wordmark — same static end-state as reduced-motion, without re-watching
    // the 3.8s roll on the marketing front door. A new tab/session replays it.
    let seen = false;
    try {
      seen = sessionStorage.getItem("slx-seen") === "1";
    } catch {
      seen = false; // storage blocked (private mode) → treat as first visit
    }

    if (reduce || seen) {
      freeze();
      root.classList.add("slx-settled");
      return;
    }

    let raf = 0;
    let centers: number[] = [];
    const risenAt: Array<number | null> = new Array(letters.length).fill(null);
    const start = performance.now();

    const measure = () => {
      const cl = composerEl.getBoundingClientRect().left;
      centers = letters.map((el) => {
        const r = el.getBoundingClientRect();
        return r.left + r.width / 2 - cl;
      });
    };
    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

    let lastCycle = 0;
    const frame = () => {
      const elapsed = performance.now() - start;
      if (elapsed >= ROLL_MS * CYCLES) {
        freeze();
        root.classList.add("slx-settled"); // settle → dot hands to breathe loop
        try {
          sessionStorage.setItem("slx-seen", "1"); // gate the next visit
        } catch {
          /* storage unavailable → the assembly simply replays next time */
        }
        return; // STOP after CYCLES plays — never an infinite loop
      }
      const cycle = Math.floor(elapsed / ROLL_MS);
      const t = elapsed - cycle * ROLL_MS; // time within the current play
      if (cycle !== lastCycle) {
        risenAt.fill(null); // drop letters so they re-rise with the 2nd roll
        lastCycle = cycle;
      }
      const cl = composerEl.getBoundingClientRect().left;
      const dr = dotEl.getBoundingClientRect();
      const dotX = dr.left + dr.width / 2 - cl;
      const dotOpacity = parseFloat(getComputedStyle(dotEl).opacity);

      letters.forEach((el, i) => {
        const lx = centers[i];
        if (lx === undefined) return;
        if (risenAt[i] === null && dotOpacity > 0.2 && lx - dotX < 70) {
          risenAt[i] = t;
        }
        if (risenAt[i] === null) {
          el.style.opacity = "0";
          el.style.transform = "translateY(115%)";
          return;
        }
        let p = Math.min(1, Math.max(0, (t - risenAt[i]!) / RISE_MS));
        p = easeOutCubic(p);
        el.style.opacity = p.toString();
        el.style.transform = `translateY(${(1 - p) * 115}%)`;
      });
      raf = requestAnimationFrame(frame);
    };

    raf = requestAnimationFrame(() => {
      measure();
      raf = requestAnimationFrame(frame);
    });
    window.addEventListener("resize", measure);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", measure);
    };
  }, []);

  return (
    <section
      className="reveal-loading-showcase"
      aria-label="Signal Studio"
    >
      <div className="slx" ref={rootRef} aria-hidden>
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
        </div>
      </div>
      <style>{SLX_CSS}</style>
    </section>
  );
}

/* Fully scoped. Single-iteration roll → freeze; only the dot keeps a slow breathe. */
const SLX_CSS = `
/* HERO-PRELUDE: the assembling wordmark is the brand signature, but it
   no longer eats the first viewport. Walkover #1 (2026-06-07): demoted
   from min(86vh,860px) to ~28vh so the proposition (H1 + subhead) wins
   the first frame. In-flow, overflow-clipped (dot rolls in off-canvas)
   — never fixed. */
.reveal-loading-showcase{display:flex;align-items:center;
  justify-content:center;width:100%;overflow:hidden;background:transparent;
  min-height:clamp(300px,40vh,460px);
  padding:clamp(44px,6vh,92px) 16px clamp(8px,1.5vh,24px);}
.slx{
  --slx-ink:#111;--slx-indigo:#4f46e5;--slx-indigo-300:#a5b4fc;
  --slx-hairline:rgba(17,17,17,0.05);
  /* Wordmark scale: the umbrella name is the first brand moment and must
     read as the dominant element — clearly larger than the H1 proposition
     below it (which tops out at 66px). It must ALSO never overflow: the
     parent is overflow:hidden, so an oversize mark gets clipped on both
     sides. "signal studio" is ~6.3em wide, so the vw term is the fit
     guarantee (~13vw ≈ 82% of viewport width on one line) and the cap keeps
     it from ballooning on large monitors. History: clamp(34,5.6vw,84) →
     clamp(50,8.6vw,118) → doubled to clamp(100,17.2vw,236) which OVERFLOWED
     and clipped the mark on every screen ≤1440 (2026-06-18 fix). Now a
     true-hero scale that always fits one line. Signal Review 2026-06-22:
     aligned to the shared product-hero wordmark scale clamp(56,12vw,168)
     — notes/tasks/timeline/signal all render their hero mark at this size,
     so the umbrella must match (was clamp(46,12.6vw,152), reading smaller
     than every product). "signal studio" is ~6.3em wide, so at the 168px
     cap the line is ~1058px (fits ≥1340px) and the 12vw term holds it to
     ~76vw below that — still inside the overflow-clipped parent. */
  --slx-wm:clamp(56px,12vw,168px);
  --slx-roll:calc(var(--slx-wm) * 6);
  --slx-dur:3.8s; /* MUST equal ROLL_MS in the component (3800). */
  --slx-iter:1;   /* MUST equal CYCLES in the component. */
  width:100%;display:flex;justify-content:center;background:transparent;
  font-family:var(--font-geist-sans,system-ui,sans-serif);}
.slx *{box-sizing:border-box;}
.slx-stage{position:relative;display:flex;align-items:center;
  justify-content:center;min-height:calc(var(--slx-wm) * 1.7);}
.slx-composer{position:relative;display:inline-flex;align-items:baseline;
  font-weight:500;font-size:var(--slx-wm);line-height:.95;
  letter-spacing:-.03em;color:var(--slx-ink);
  padding-bottom:calc(var(--slx-wm) * .22);}
.slx-composer::before{content:'';position:absolute;
  left:calc(-1 * var(--slx-wm) * 1.4);right:calc(-1 * var(--slx-wm) * .7);
  bottom:calc(var(--slx-wm) * .13);height:1px;background:var(--slx-hairline);}
.slx-word{display:inline-flex;gap:0;position:relative;z-index:1;}
.slx-letter{display:inline-block;opacity:0;transform:translateY(115%);
  color:var(--slx-ink);will-change:opacity,transform;}
.slx-space{display:inline-block;width:.28em;}
.slx-settled .slx-letter{opacity:1!important;transform:none!important;}

.slx-dot{position:relative;width:.16em;height:.16em;border-radius:50%;
  background:var(--slx-indigo);margin-left:.06em;align-self:flex-end;
  margin-bottom:.06em;transform-origin:center bottom;
  animation:slx-roll var(--slx-dur,3.8s) cubic-bezier(.34,1.56,.64,1) var(--slx-iter,2) forwards;z-index:3;}
/* after roll, the settled dot just breathes — a gentle pulse/squeeze, forever,
   WITHOUT re-running the word assembly. */
.slx-settled .slx-dot{animation:slx-breathe 3.8s ease-in-out infinite;}
/* When the mark settles immediately (returning visitor this session, or
   reduced-motion) the trail ghosts and ripples must not fire their one-shot
   roll — suppress them so it reads as a clean static wordmark. During a
   normal first play these have already completed by the time .slx-settled
   lands, so this is a no-op for the animated path. */
.slx-settled .slx-trail,
.slx-settled .slx-ripple,
.slx-settled .slx-ripple-slow{animation:none!important;opacity:0!important;}
@keyframes slx-roll{
 0%{transform:translate(calc(-1 * var(--slx-roll)),0) scale(1,1);opacity:0}
 6%{transform:translate(calc(-1 * var(--slx-roll)),0) scale(1,1);opacity:1}
 55%{transform:translate(calc(-0.03 * var(--slx-wm)),0) scale(1,1);opacity:1}
 60%{transform:translate(0,0) scale(1,1);opacity:1}
 66%{transform:translate(0,0) scale(1.9,.42);opacity:1}
 70%{transform:translate(0,0) scale(1.84,.46);opacity:1}
 78%{transform:translate(0,calc(-0.07 * var(--slx-wm))) scale(.76,1.3);opacity:1}
 86%{transform:translate(0,0) scale(1.18,.85);opacity:1}
 93%{transform:translate(0,0) scale(.98,1.03);opacity:1}
 100%{transform:translate(0,0) scale(1,1);opacity:1}}
@keyframes slx-breathe{
 0%,100%{transform:translate(0,0) scale(1,1);opacity:1}
 50%{transform:translate(0,0) scale(.82,.82);opacity:.86}}

.slx-trail{position:absolute;width:.16em;height:.16em;border-radius:50%;
  background:var(--slx-indigo);align-self:flex-end;margin-bottom:.06em;
  margin-left:.06em;opacity:0;z-index:2;}
.slx-t1{animation:slx-ghost1 var(--slx-dur,3.8s) cubic-bezier(.34,1.56,.64,1) var(--slx-iter,2) forwards;}
.slx-t2{animation:slx-ghost2 var(--slx-dur,3.8s) cubic-bezier(.34,1.56,.64,1) var(--slx-iter,2) forwards;}
.slx-t3{animation:slx-ghost3 var(--slx-dur,3.8s) cubic-bezier(.34,1.56,.64,1) var(--slx-iter,2) forwards;}
@keyframes slx-ghost1{0%,8%{transform:translate(calc(-1 * var(--slx-roll)),0);opacity:0}
 22%{transform:translate(calc(-0.85 * var(--slx-roll)),0);opacity:.45}
 42%{transform:translate(calc(-0.2 * var(--slx-roll)),0);opacity:.22}
 55%,100%{transform:translate(calc(-0.1 * var(--slx-roll)),0);opacity:0}}
@keyframes slx-ghost2{0%,11%{transform:translate(calc(-1 * var(--slx-roll)),0);opacity:0}
 25%{transform:translate(calc(-0.78 * var(--slx-roll)),0);opacity:.32}
 42%{transform:translate(calc(-0.28 * var(--slx-roll)),0);opacity:.15}
 55%,100%{transform:translate(calc(-0.16 * var(--slx-roll)),0);opacity:0}}
@keyframes slx-ghost3{0%,14%{transform:translate(calc(-1 * var(--slx-roll)),0);opacity:0}
 28%{transform:translate(calc(-0.7 * var(--slx-roll)),0);opacity:.2}
 42%{transform:translate(calc(-0.35 * var(--slx-roll)),0);opacity:.09}
 55%,100%{transform:translate(calc(-0.24 * var(--slx-roll)),0);opacity:0}}

.slx-ripple{position:absolute;width:.16em;height:.16em;border-radius:50%;
  border:1px solid var(--slx-indigo);background:transparent;align-self:flex-end;
  margin-bottom:.06em;margin-left:.06em;opacity:0;transform:scale(1);
  animation:slx-rip-fast var(--slx-dur,3.8s) cubic-bezier(.22,.7,.2,1) var(--slx-iter,2) forwards;z-index:1;}
.slx-ripple-slow{position:absolute;width:.16em;height:.16em;border-radius:50%;
  border:1px solid var(--slx-indigo-300);background:transparent;align-self:flex-end;
  margin-bottom:.06em;margin-left:.06em;opacity:0;transform:scale(1);
  animation:slx-rip-slow var(--slx-dur,3.8s) cubic-bezier(.22,.7,.2,1) var(--slx-iter,2) forwards;z-index:1;}
@keyframes slx-rip-fast{0%,63%{transform:scale(1);opacity:0}
 66%{transform:scale(1);opacity:.65}88%{transform:scale(10);opacity:0}
 100%{transform:scale(10);opacity:0}}
@keyframes slx-rip-slow{0%,63%{transform:scale(1);opacity:0}
 66%{transform:scale(1);opacity:.4}100%{transform:scale(20);opacity:0}}

@media (prefers-reduced-motion:reduce){
 .slx-dot,.slx-trail,.slx-ripple,.slx-ripple-slow{animation:none!important}
 .slx-dot{transform:none;opacity:1}
 .slx-letter{opacity:1!important;transform:none!important}}
`;
