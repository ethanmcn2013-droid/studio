"use client";

/**
 * RevealStory — one scene, four beats, twelve seconds. Walkover #2
 * (2026-06-07): the narrative demo that sits between Manifesto and
 * Products. A note becomes a task, the task lands on a public
 * roadmap, the public roadmap turns into tomorrow's Daily Signal.
 * The same line of work, four places it lives.
 *
 * Editorial register: no UI chrome. Each beat is a typographic card —
 * a mono eyebrow naming the surface ("note · 9:14" / "task · added" /
 * "roadmap · what people see" / "daily signal · tomorrow"), then the
 * one line of content that moves through the system.
 *
 * Behaviour:
 *   - One IntersectionObserver starts the timeline when the section
 *     enters view (one-shot, like reveal-products).
 *   - Each beat fades + lifts in on its own cue: 0, 3, 6, 9s. The
 *     final beat holds at t=12s with the gentle pulse on the dot.
 *   - prefers-reduced-motion → all four beats are visible immediately,
 *     no animation. No-JS users get the same static scene.
 *   - Scoped CSS in <style>. Class prefix `rsy-`. No global rules.
 */

import { useEffect, useRef } from "react";

const BEATS = [
  {
    eyebrow: "note · 9:14 am",
    body: "Couple wants the welcome sign moved closer to the door.",
    key: "notes",
  },
  {
    eyebrow: "task · added",
    body: "Move welcome sign — due Friday, owner Maeve.",
    key: "tasks",
  },
  {
    eyebrow: "roadmap · what people see",
    body: "This week: signage finalised. The couple can open this page without an account.",
    key: "roadmap",
  },
  {
    eyebrow: "daily signal · tomorrow",
    body: "One thing needs attention: the signage decision is two days from due.",
    key: "analytics",
  },
] as const;

export function RevealStory() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      root.classList.add("rsy-all-in");
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          io.unobserve(e.target);
          const beats = root.querySelectorAll<HTMLElement>(".rsy-beat");
          // Cue offsets: 0, 3, 6, 9s — twelve-second scene.
          [0, 3000, 6000, 9000].forEach((t, i) => {
            window.setTimeout(() => beats[i]?.classList.add("rsy-in"), t);
          });
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.2 },
    );
    io.observe(root);
    return () => io.disconnect();
  }, []);

  return (
    <section
      className="reveal-story"
      ref={ref}
      aria-label="One scene, four beats — a note becomes a task becomes a roadmap line becomes tomorrow's Daily Signal"
    >
      <div className="rsy-eyebrow">
        Walk through it <span className="gold">·</span> one note, four places it lives
      </div>
      <ol className="rsy-scene">
        {BEATS.map((b) => (
          <li
            key={b.key}
            className="rsy-beat"
            data-key={b.key}
            aria-label={`${b.eyebrow} — ${b.body}`}
          >
            <div className="rsy-beat-eyebrow">
              <span className="rsy-dot" data-key={b.key} aria-hidden />
              {b.eyebrow}
            </div>
            <p className="rsy-beat-body">{b.body}</p>
          </li>
        ))}
      </ol>
      <style>{RSY_CSS}</style>
    </section>
  );
}

const RSY_CSS = `
.reveal-story{max-width:760px;margin:0 auto;padding:96px 32px 96px;}
.reveal-story .rsy-eyebrow{font-family:var(--font-mono-stack);font-size:11px;
  color:var(--ink-500);letter-spacing:0.14em;text-transform:uppercase;
  margin-bottom:28px;display:flex;align-items:center;gap:12px;}
.reveal-story .rsy-eyebrow .gold{color:var(--accent);}
.reveal-story .rsy-eyebrow::after{content:'';flex:1;height:1px;background:var(--ink-200);}
.rsy-scene{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:0;}
.rsy-beat{display:grid;grid-template-columns:1fr;gap:10px;
  padding:28px 0;border-top:1px solid var(--ink-200);
  opacity:0;transform:translateY(10px);
  transition:opacity 560ms cubic-bezier(.16,1,.3,1),
             transform 560ms cubic-bezier(.16,1,.3,1);
  will-change:opacity,transform;}
.rsy-beat:last-child{border-bottom:1px solid var(--ink-200);}
.rsy-beat.rsy-in,
.reveal-story.rsy-all-in .rsy-beat{opacity:1;transform:translateY(0);}
.rsy-beat-eyebrow{font-family:var(--font-mono-stack);font-size:11px;
  color:var(--ink-500);letter-spacing:0.12em;text-transform:uppercase;
  display:inline-flex;align-items:center;gap:10px;}
.rsy-beat-body{font-size:clamp(18px,1.6vw,22px);line-height:1.45;
  color:var(--ink-900);margin:0;letter-spacing:-0.012em;
  font-weight:500;text-wrap:pretty;}
.rsy-dot{display:inline-block;width:.6em;height:.6em;border-radius:50%;
  background:var(--indigo-600);}
.rsy-dot[data-key="notes"]{width:.18em;height:.7em;border-radius:.04em;
  animation:rsy-blink 1.06s steps(1,end) infinite;}
.rsy-dot[data-key="tasks"]{width:.65em;height:.65em;border-radius:.1em;
  background:transparent;border:.075em solid var(--indigo-600);position:relative;}
.rsy-dot[data-key="tasks"]::after{content:'';position:absolute;
  left:20%;top:48%;width:.22em;height:.42em;border:solid var(--indigo-600);
  border-width:0 .075em .075em 0;transform:rotate(45deg);transform-origin:left top;}
.rsy-dot[data-key="roadmap"]{width:.18em;height:.18em;position:relative;}
.rsy-dot[data-key="roadmap"]::after{content:'';position:absolute;left:100%;top:50%;
  width:.9em;height:1px;background:var(--indigo-600);transform:translateY(-50%);
  margin-left:.18em;}
.rsy-dot[data-key="analytics"]{animation:rsy-heartbeat 2.2s ease-in-out infinite;}
@keyframes rsy-blink{0%,50%{opacity:1}50.01%,100%{opacity:0}}
@keyframes rsy-heartbeat{
  0%{transform:scale(1)}8%{transform:scale(1.55)}16%{transform:scale(1)}
  24%{transform:scale(1.35)}32%{transform:scale(1)}100%{transform:scale(1)}}
@media (prefers-reduced-motion:reduce){
  .rsy-beat{opacity:1!important;transform:none!important;transition:none!important;}
  .rsy-dot[data-key="notes"],
  .rsy-dot[data-key="analytics"]{animation:none!important;}
}
@media (max-width:880px){
  .reveal-story{padding:72px 24px 72px;}
  .rsy-beat{padding:22px 0;}
}
`;
