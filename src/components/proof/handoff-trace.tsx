"use client";

/**
 * Proof handoff trace — a 1px indigo hairline that draws downward as
 * each stage hands off to the next (1→2, 2→3, 3→4). The /proof thesis
 * is "the handoffs are the product"; this draws that handoff once, on
 * viewport entry, then goes quiet.
 *
 * No animation library. /proof is otherwise a zero-JS server page; the
 * GSAP/Lenis engine is homepage-only and far too heavy for three
 * hairlines. This is a native IntersectionObserver (threshold 0.3,
 * once) plus a single stroke-dashoffset transition.
 *
 * Reduced motion: the line renders fully drawn on mount, so the
 * connective meaning survives without any motion.
 */

import { useEffect, useRef, useState } from "react";

export function HandoffTrace() {
  const ref = useRef<SVGSVGElement | null>(null);
  const [drawn, setDrawn] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduce) {
      setDrawn(true);
      return;
    }

    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setDrawn(true);
          io.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    io.observe(el);

    return () => io.disconnect();
  }, []);

  return (
    <div className="proof-trace" aria-hidden="true">
      <svg
        ref={ref}
        width="1"
        height="44"
        viewBox="0 0 1 44"
        className={drawn ? "proof-trace-svg is-drawn" : "proof-trace-svg"}
      >
        <line
          x1="0.5"
          y1="0"
          x2="0.5"
          y2="44"
          stroke="#4F46E5"
          strokeWidth="1"
          pathLength={1}
        />
      </svg>
    </div>
  );
}
