"use client";

/**
 * The Dissolve — §5's signature moment.
 *
 * A paragraph of real PM-software jargon sits on the page. When it
 * crosses into view, the jargon dims to near-silence, the terms that
 * caused the trouble take an indigo strike, and the plain-language
 * version arrives beneath it on the page's one entrance curve.
 *
 * Runs once per visit. Reduced motion (or JS off): the finished state
 * is the resting state — jargon already dimmed and struck, plain
 * version already present. Nothing is withheld from anyone.
 */

import { useEffect, useRef, useState } from "react";

type Piece = { text: string; strike?: boolean };

/* The "before" — assembled from phrases project software actually
   uses. Struck pieces are the vocabulary; the rest is connective
   tissue that goes quiet with it. */
const JARGON: Piece[] = [
  { text: "Leverage " },
  { text: "the Q3 workstream kickoff", strike: true },
  { text: " to " },
  { text: "align stakeholders", strike: true },
  { text: " on " },
  { text: "sprint cadence", strike: true },
  { text: ", " },
  { text: "socialize the updated RACI", strike: true },
  { text: ", and " },
  { text: "circle back on burndown deltas", strike: true },
  { text: " async." },
];

export function Dissolve() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDone(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            // Let the reader take the jargon in before it goes quiet.
            window.setTimeout(() => setDone(true), 900);
            io.disconnect();
          }
        }
      },
      { threshold: 0.5 },
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={`dsn-dissolve ${done ? "is-done" : ""}`}>
      <p className="dsn-jargon text-[clamp(17px,2.2vw,22px)] font-medium leading-relaxed tracking-[-0.01em]">
        {JARGON.map((piece, i) =>
          piece.strike ? (
            <span key={i} className="dsn-strike">
              {piece.text}
            </span>
          ) : (
            <span key={i}>{piece.text}</span>
          ),
        )}
      </p>

      <p className="dsn-plain text-[clamp(20px,2.6vw,27px)] font-semibold leading-snug tracking-[-0.015em] text-ink">
        Here&rsquo;s what&rsquo;s happening this week. Who&rsquo;s doing it.
        What&rsquo;s stuck.
      </p>

      <p className="dsn-plain-caption font-mono text-[11px] uppercase tracking-[0.08em] text-ink-quiet">
        Same information · fewer barriers
      </p>
    </div>
  );
}
