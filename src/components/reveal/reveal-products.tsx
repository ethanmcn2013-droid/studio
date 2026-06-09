/**
 * Reveal products — four typographic-poster rows. Position-clarity label
 * as mono eyebrow → giant wordmark → essence + meta. Hrefs point at the
 * real product subdomains via product-urls.ts.
 *
 * Each row's layout enters from both sides on scroll (left from -x,
 * right from +x) — directional, not generic fade-up. Per-character
 * hover lift on the wordmark is wired in RevealEngine, gated to
 * (hover: hover) devices.
 */

import {
  TASKS_URL,
  ROADMAP_URL,
  ANALYTICS_URL,
  NOTES_URL,
} from "@/lib/product-urls";

interface ProductRowProps {
  id: string;
  dataKey: "tasks" | "roadmap" | "analytics" | "notes";
  position: string;
  word: string;
  essence: string;
  pills: string[];
  cta: string;
  href: string;
  external?: boolean;
  comingSoon?: boolean;
}

function ProductRow({
  id,
  dataKey,
  position,
  word,
  essence,
  pills,
  cta,
  href,
  external,
  comingSoon,
}: ProductRowProps) {
  const linkProps = external
    ? { target: "_blank", rel: "noopener noreferrer" as const }
    : {};

  return (
    <a
      className="reveal-product-row reveal"
      id={id}
      data-key={dataKey}
      href={href}
      {...linkProps}
    >
      <div className="left">
        <div className="position">{position}</div>
        <span className="mark">
          <span className="word">{word}</span>
          <span className="dot" />
        </span>
      </div>
      <div className="right">
        <p className="essence">{essence}</p>
        <div className="meta">
          {pills.map((label, i) => (
            <span
              key={label}
              className={`pill${i === 0 && comingSoon ? " soon" : ""}`}
            >
              {label}
            </span>
          ))}
          <span className="open">
            {cta.replace(/\s*→\s*$/, "")}{" "}
            <span className="cta-arrow" aria-hidden>
              →
            </span>
          </span>
        </div>
      </div>
    </a>
  );
}

export function RevealProducts() {
  return (
    <section className="reveal-products">
      {/*
        Walkover #13 (2026-06-07): pushback on the "four products · one
        system" framing. The reader's mental model isn't products and a
        system — it's a day of work and where the parts of it live.
      */}
      <div className="reveal-products-head reveal">
        One day&rsquo;s work <span className="gold">·</span> four places it lives
      </div>
      <p className="reveal-products-connective">
        Notes is where it starts. Tasks is where it gets done. Roadmap is what
        everyone else sees. Analytics tells you where to look.
      </p>

      <ProductRow
        id="notes"
        dataKey="notes"
        position="Where work begins"
        word="notes"
        essence="Catch what was said before it slips. Turn a note into a task in one tap. Nothing leaves until you send it."
        pills={["Private preview", "Capture"]}
        cta="Open the notebook →"
        href={NOTES_URL}
        external
      />
      <ProductRow
        id="tasks"
        dataKey="tasks"
        position="Where the work happens"
        word="tasks"
        essence="Run the work without the project-manager voice. One workspace, every view you need."
        pills={["Private preview", "Multi-view"]}
        cta="Open the workspace →"
        href={TASKS_URL}
        external
      />
      <ProductRow
        id="roadmap"
        dataKey="roadmap"
        position="What people see"
        word="roadmap"
        essence="Show where the work is going. One plain-English page anyone can open. No account, no jargon. Built for the people who never log in."
        pills={["Private preview", "Public roadmaps"]}
        cta="Open the roadmap →"
        href={ROADMAP_URL}
        external
      />
      {/*
        Daily Signal prominence (2026-06-07 walkover #3): the product the
        suite hangs on. The mono eyebrow now carries "Analytics" as the
        small position label; the wordmark itself reads `daily signal` —
        the noun customers actually receive. The href + gesture key
        stay on `analytics` (the product, the URL, the dot identity).
      */}
      <ProductRow
        id="analytics"
        dataKey="analytics"
        position="Analytics · what needs attention"
        word={"daily\u00a0signal"}
        essence="A morning briefing, not a dashboard. Three things, in plain English. Silence is the signal."
        pills={["Private preview", "Daily Signal"]}
        cta="Open the briefing →"
        href={ANALYTICS_URL}
        external
      />

      {/*
        Per-product dot identity (operator: "each product will have their own
        animated dot · every tiny piece feels individually cared for").
        Notes' signature, ported from the operator's Notes loader: the dot
        morphs into a blinking text caret — the "held thought, awaiting input"
        gesture. Scoped to the notes row only, in-flow, reduced-motion-safe,
        NO overlay/fixed (loader-safety canon). Seeds the pattern; the other
        products' gestures slot in here when their loaders land.
      */}
      <style>{`
        /* Notes · the dot IS the blinking text caret. No morph — start as
           caret, blink immediately. (Walkover #6, 2026-06-09: the morph
           wasn't replaying on reveal, so the row settled as a dot.) */
        .reveal-product-row[data-key="notes"] .dot{
          width:.075em;height:.78em;border-radius:.02em;
          transform-origin:center bottom;
          animation:rpn-blink 1.06s steps(1,end) infinite;
        }
        @keyframes rpn-blink{0%,50%{opacity:1}50.01%,100%{opacity:0}}

        /* Tasks · the wordmark itself gets crossed out — the "done" gesture
           rendered directly on the word, not in a checkbox glyph. A line
           draws left → right, holds, then clears. The dot is hidden; the
           strike IS the identity here. (Walkover #6, 2026-06-09.) */
        .reveal-product-row[data-key="tasks"] .mark .dot{
          display:none;
        }
        .reveal-product-row[data-key="tasks"] .mark .word{
          position:relative;
        }
        .reveal-product-row[data-key="tasks"] .mark .word::after{
          content:'';position:absolute;
          left:-.04em;top:58%;
          width:calc(100% + .08em);height:.055em;
          background:var(--indigo-600);
          transform-origin:left center;
          transform:scaleX(0);
          animation:rpt-strike 3.2s cubic-bezier(.22,.7,.2,1) .4s infinite;
          pointer-events:none;
        }
        @keyframes rpt-strike{
          0%   {transform:scaleX(0);transform-origin:left center;opacity:1}
          38%  {transform:scaleX(1);transform-origin:left center;opacity:1}
          72%  {transform:scaleX(1);transform-origin:right center;opacity:1}
          92%  {transform:scaleX(0);transform-origin:right center;opacity:0}
          100% {transform:scaleX(0);transform-origin:right center;opacity:0}
        }

        /* Roadmap · the dot extrudes a milestone line, then drops a second
           dot at the end — a track being laid. Scoped to the product
           row; the hero stack still sweeps. (Walkover #5, 2026-06-07.) */
        .reveal-product-row[data-key="roadmap"] .mark .dot{
          animation:none;
          position:relative;
        }
        .reveal-product-row[data-key="roadmap"] .mark .dot::before{
          content:'';position:absolute;
          left:100%;top:50%;
          width:0;height:1px;
          background:var(--indigo-600);
          transform:translateY(-50%);
          animation:rpr-extrude 5.4s cubic-bezier(.22,.7,.2,1) infinite;
        }
        .reveal-product-row[data-key="roadmap"] .mark .dot::after{
          content:'';position:absolute;
          left:calc(100% + 1.4em);top:50%;
          width:.14em;height:.14em;border-radius:50%;
          background:var(--indigo-600);
          transform:translate(-50%,-50%) scale(0);
          animation:rpr-milestone 5.4s cubic-bezier(.22,.7,.2,1) infinite;
        }
        @keyframes rpr-extrude{
          0%{width:0;opacity:1}
          40%{width:1.4em;opacity:1}
          80%{width:1.4em;opacity:1}
          100%{width:0;opacity:0}
        }
        @keyframes rpr-milestone{
          0%,38%{transform:translate(-50%,-50%) scale(0);opacity:0}
          48%{transform:translate(-50%,-50%) scale(1);opacity:1}
          80%{transform:translate(-50%,-50%) scale(1);opacity:1}
          100%{transform:translate(-50%,-50%) scale(0);opacity:0}
        }

        /* Daily Signal (Analytics row) · the dot pulses like a heartbeat —
           two quick beats, then a held rest. ECG cadence, not the
           discrete tick the hero stack runs. Scoped to the product
           row; hero stack still ticks through discrete samples.
           (Walkover #5, 2026-06-07.) */
        .reveal-product-row[data-key="analytics"] .mark .dot{
          animation:rpa-heartbeat 2.2s ease-in-out infinite;
        }
        @keyframes rpa-heartbeat{
          0%   {transform:translateY(-.04em) scale(1)}
          8%   {transform:translateY(-.04em) scale(1.55)}
          16%  {transform:translateY(-.04em) scale(1)}
          24%  {transform:translateY(-.04em) scale(1.35)}
          32%  {transform:translateY(-.04em) scale(1)}
          100% {transform:translateY(-.04em) scale(1)}
        }

        @media (prefers-reduced-motion:reduce){
          .reveal-product-row[data-key="notes"] .dot{
            animation:none;width:.075em;height:.78em;border-radius:.02em;opacity:1}
          .reveal-product-row[data-key="tasks"] .mark .word::after,
          .reveal-product-row[data-key="roadmap"] .mark .dot::before,
          .reveal-product-row[data-key="roadmap"] .mark .dot::after,
          .reveal-product-row[data-key="analytics"] .mark .dot{
            animation:none}
          .reveal-product-row[data-key="tasks"] .mark .word::after{
            transform:scaleX(1);opacity:1}
        }
      `}</style>
    </section>
  );
}
