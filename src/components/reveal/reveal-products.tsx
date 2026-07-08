/**
 * Reveal products, four typographic-poster rows. Position-clarity label
 * as mono eyebrow → giant wordmark → essence + meta. Hrefs point at the
 * staged-access waitlist with product context.
 *
 * Each row's layout enters from both sides on scroll (left from -x,
 * right from +x), directional, not generic fade-up. Per-character
 * hover lift on the wordmark is wired in RevealEngine, gated to
 * (hover: hover) devices.
 */

interface ProductRowProps {
  id: string;
  // dataKey is the internal gesture-identity hook (drives the per-product
  // dot animation in globals.css). Kept stable across the 2026-06-13 rename
  // so the CSS selectors + hero anchors don't move; only the visible `word`
  // changed (roadmap→timeline, analytics→signal).
  dataKey: "tasks" | "timeline" | "signal" | "notes";
  position: string;
  word: string;
  essence: string;
  pills: string[];
  cta: string;
  href: string;
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
  comingSoon,
}: ProductRowProps) {
  return (
    <a
      className="reveal-product-row reveal"
      id={id}
      data-key={dataKey}
      href={href}
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
        {/* Editorial index line, not chips: hairline above, mono terms
            separated by middots, status dot on the first term. */}
        <div className="meta">
          {pills.map((label, i) => (
            <span
              key={label}
              className={`term${i === 0 && comingSoon ? " soon" : ""}`}
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
  const waitlistHref = (product: ProductRowProps["dataKey"]) =>
    `/waitlist?source=home_products&campaign=pre_access_waitlist&product=${product}&artifact=${product}_row&touch=site`;

  return (
    <section className="reveal-products">
      {/*
        Walkover #13 (2026-06-07): pushback on the "four products · one
        system" framing. The reader's mental model isn't products and a
        system, it's a day of work and where the parts of it live.
      */}
      <div className="reveal-products-head reveal">
        One day&rsquo;s work <span className="gold">·</span> four places it lives
      </div>
      <p className="reveal-products-connective">
        Notes is where it starts. Tasks is where it gets done. Timeline is what
        everyone else sees. Signal tells you where to look.
      </p>

      <ProductRow
        id="notes"
        dataKey="notes"
        position="Where work begins"
        word="notes"
        essence="Keep the thought until it earns a task."
        pills={["Private preview", "Capture"]}
        cta="Join the waitlist →"
        href={waitlistHref("notes")}
      />
      <ProductRow
        id="tasks"
        dataKey="tasks"
        position="Where the work happens"
        word="tasks"
        essence="Keep ownership clear without learning a new language."
        pills={["Private preview", "Multi-view"]}
        cta="Join the waitlist →"
        href={waitlistHref("tasks")}
      />
      <ProductRow
        id="timeline"
        dataKey="timeline"
        position="What people see"
        word="timeline"
        essence="Give everyone one page that says where things stand."
        pills={["Private preview", "Public timelines"]}
        cta="Join the waitlist →"
        href={waitlistHref("timeline")}
      />
      {/*
        Signal prominence (2026-06-07 walkover #3, renamed 2026-06-13): the
        product the suite hangs on. The wordmark reads `signal`, the product
        name, matching its siblings; the Daily Signal briefing it delivers
        lives in the pill + essence. The href + internal gesture key stay
        `analytics` (the dot identity / CSS hook); the URL is SIGNAL_URL.
      */}
      <ProductRow
        id="signal"
        dataKey="signal"
        position="What needs attention"
        word="signal"
        essence="What actually needs you today."
        pills={["Private preview", "Daily Signal"]}
        cta="Join the waitlist →"
        href={waitlistHref("signal")}
      />

      {/*
        Per-product dot identity (operator: "each product will have their own
        animated dot · every tiny piece feels individually cared for").
        Notes' signature, ported from the operator's Notes loader: the dot
        morphs into a blinking text caret, the "held thought, awaiting input"
        gesture. Scoped to the notes row only, in-flow, reduced-motion-safe,
        NO overlay/fixed (loader-safety canon). Seeds the pattern; the other
        products' gestures slot in here when their loaders land.
      */}
      <style>{`
        /* Notes · the dot IS the blinking text caret. No morph, start as
           caret, blink immediately. (Walkover #6, 2026-06-09: the morph
           wasn't replaying on reveal, so the row settled as a dot.) */
        .reveal-product-row[data-key="notes"] .dot{
          width:.075em;height:.78em;border-radius:.02em;
          transform-origin:center bottom;
          /* Seat the caret a touch lower so it sits on the baseline like a
             real text cursor (review 3 issue 42). */
          position:relative;top:.05em;
          animation:rpn-blink 1.06s steps(1,end) infinite;
        }
        @keyframes rpn-blink{0%,50%{opacity:1}50.01%,100%{opacity:0}}

        /* Tasks · the wordmark itself gets crossed out, the "done" gesture
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

        /* Timeline · the dot extrudes a milestone line, then drops a second
           dot at the end, a track being laid. Scoped to the product
           row; the hero stack still sweeps. (Walkover #5, 2026-06-07.) */
        .reveal-product-row[data-key="timeline"] .mark .dot{
          animation:none;
          position:relative;
        }
        .reveal-product-row[data-key="timeline"] .mark .dot::before{
          content:'';position:absolute;
          left:100%;top:50%;
          width:0;height:1px;
          background:var(--indigo-600);
          transform:translateY(-50%);
          animation:rptl-extrude 5.4s cubic-bezier(.22,.7,.2,1) infinite;
        }
        .reveal-product-row[data-key="timeline"] .mark .dot::after{
          content:'';position:absolute;
          left:calc(100% + 1.4em);top:50%;
          width:.14em;height:.14em;border-radius:50%;
          background:var(--indigo-600);
          transform:translate(-50%,-50%) scale(0);
          animation:rptl-milestone 5.4s cubic-bezier(.22,.7,.2,1) infinite;
        }
        @keyframes rptl-extrude{
          0%{width:0;opacity:1}
          40%{width:1.4em;opacity:1}
          80%{width:1.4em;opacity:1}
          100%{width:0;opacity:0}
        }
        @keyframes rptl-milestone{
          0%,38%{transform:translate(-50%,-50%) scale(0);opacity:0}
          48%{transform:translate(-50%,-50%) scale(1);opacity:1}
          80%{transform:translate(-50%,-50%) scale(1);opacity:1}
          100%{transform:translate(-50%,-50%) scale(0);opacity:0}
        }

        /* Signal · the dot pulses like a heartbeat —
           two quick beats, then a held rest. ECG cadence, not the
           discrete tick the hero stack runs. Scoped to the product
           row; hero stack still ticks through discrete samples.
           (Walkover #5, 2026-06-07.) */
        .reveal-product-row[data-key="signal"] .mark .dot{
          animation:rpsg-heartbeat 2.2s ease-in-out infinite;
        }
        @keyframes rpsg-heartbeat{
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
          .reveal-product-row[data-key="timeline"] .mark .dot::before,
          .reveal-product-row[data-key="timeline"] .mark .dot::after,
          .reveal-product-row[data-key="signal"] .mark .dot{
            animation:none}
          .reveal-product-row[data-key="tasks"] .mark .word::after{
            transform:scaleX(1);opacity:1}
        }
      `}</style>
    </section>
  );
}
