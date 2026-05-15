"use client";

/**
 * Proof Stage 1 capture reveal — the planner's notebook lines arrive
 * one at a time as the artefact enters the viewport, the way captures
 * actually land during a call: a line at a time, not all at once.
 *
 * Stage 1 only. Stages 2–4 stay static — they are the *result* of the
 * capture, not the act of it; animating them would over-tell.
 *
 * No animation library, consistent with the rest of /proof. Native
 * IntersectionObserver, one transition per line, opacity + transform
 * only. Server-rendered visible (no-JS / crawler / reduced-motion read
 * the full list); the component arms the hidden state pre-paint only
 * when motion is allowed, so there is no post-hydration flash.
 *
 * No character streaming — the brief is explicit, and streaming would
 * read as a typing gimmick, not as captured thought.
 */

import { useEffect, useLayoutEffect, useRef, useState } from "react";

const STAGGER_MS = 250;

// useLayoutEffect warns during SSR; fall back to useEffect there.
const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export function CaptureReveal({ lines }: { lines: readonly string[] }) {
  const ref = useRef<HTMLUListElement | null>(null);
  const [armed, setArmed] = useState(false);
  const [revealed, setRevealed] = useState(false);

  // Arm the hidden state before paint, but only when motion is allowed.
  useIsoLayoutEffect(() => {
    if (
      typeof window !== "undefined" &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setArmed(true);
    }
  }, []);

  useEffect(() => {
    if (!armed) return;
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setRevealed(true);
          io.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [armed]);

  let lineIndex = 0;

  return (
    <ul
      ref={ref}
      className={`space-y-2 font-mono text-[13.5px] leading-[1.6] text-ink-soft${
        armed ? " capture-armed" : ""
      }${revealed ? " is-in" : ""}`}
    >
      {lines.map((line, i) =>
        line === "" ? (
          <li key={i} aria-hidden className="h-2" />
        ) : (
          <li
            key={i}
            className="capture-line break-words"
            style={{ transitionDelay: `${lineIndex++ * STAGGER_MS}ms` }}
          >
            {line}
          </li>
        ),
      )}
    </ul>
  );
}
