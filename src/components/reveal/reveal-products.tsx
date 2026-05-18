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
      <div className="reveal-products-head reveal">
        Four products <span className="gold">·</span> one system
      </div>
      <p className="reveal-products-connective">
        Notes is where it starts. Tasks is where it gets done. Roadmap is what
        everyone else sees. Analytics tells you where to look.
      </p>

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
        id="analytics"
        dataKey="analytics"
        position="What needs attention"
        word="analytics"
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
        .reveal-product-row[data-key="notes"] .dot{
          transform-origin:center bottom;
          animation:rpn-caret .55s cubic-bezier(.22,.7,.2,1) .25s 1 forwards,
                    rpn-blink 1.06s steps(1,end) .9s infinite;
        }
        @keyframes rpn-caret{
          0%{width:.16em;height:.16em;border-radius:50%}
          100%{width:.075em;height:.78em;border-radius:.02em}
        }
        @keyframes rpn-blink{0%,50%{opacity:1}50.01%,100%{opacity:0}}
        @media (prefers-reduced-motion:reduce){
          .reveal-product-row[data-key="notes"] .dot{
            animation:none;width:.075em;height:.78em;border-radius:.02em}
        }
      `}</style>
    </section>
  );
}
