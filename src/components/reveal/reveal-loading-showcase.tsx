"use client";

/**
 * RevealLoadingShowcase — the operator's loading-screen wordmark assembly,
 * lifted into the hero as the first brand moment. Seamless: NO cream box,
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
const ROLL_MS = 2600; // single roll-in, then freeze

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

    if (reduce) {
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

    const frame = () => {
      const t = performance.now() - start;
      if (t >= ROLL_MS) {
        freeze();
        root.classList.add("slx-settled"); // hands the dot to the breathe loop
        return; // STOP — no re-loop
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
        let p = Math.min(1, Math.max(0, (t - risenAt[i]!) / 260));
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
/* HERO-SCALE: the assembling wordmark is the front-door hero. In-flow,
   overflow-clipped (the dot rolls in from off-canvas) — never fixed. */
.reveal-loading-showcase{display:flex;align-items:center;
  justify-content:center;width:100%;overflow:hidden;background:transparent;
  min-height:min(86vh,860px);
  padding:clamp(92px,15vh,184px) 16px clamp(36px,7vh,88px);}
.slx{
  --slx-ink:#111;--slx-indigo:#4f46e5;--slx-indigo-300:#a5b4fc;
  --slx-hairline:rgba(17,17,17,0.05);
  --slx-wm:clamp(58px,11.5vw,208px);
  --slx-roll:calc(var(--slx-wm) * 6);
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
  animation:slx-roll 2.6s cubic-bezier(.34,1.56,.64,1) forwards;z-index:3;}
/* after roll, the settled dot just breathes — a gentle pulse/squeeze, forever,
   WITHOUT re-running the word assembly. */
.slx-settled .slx-dot{animation:slx-breathe 3.4s ease-in-out infinite;}
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
.slx-t1{animation:slx-ghost1 2.6s cubic-bezier(.34,1.56,.64,1) forwards;}
.slx-t2{animation:slx-ghost2 2.6s cubic-bezier(.34,1.56,.64,1) forwards;}
.slx-t3{animation:slx-ghost3 2.6s cubic-bezier(.34,1.56,.64,1) forwards;}
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
  animation:slx-rip-fast 2.6s cubic-bezier(.22,.7,.2,1) forwards;z-index:1;}
.slx-ripple-slow{position:absolute;width:.16em;height:.16em;border-radius:50%;
  border:1px solid var(--slx-indigo-300);background:transparent;align-self:flex-end;
  margin-bottom:.06em;margin-left:.06em;opacity:0;transform:scale(1);
  animation:slx-rip-slow 2.6s cubic-bezier(.22,.7,.2,1) forwards;z-index:1;}
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
