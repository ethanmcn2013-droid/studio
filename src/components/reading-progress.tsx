"use client";

/**
 * Reading progress hairline, a 1px indigo bar fixed to the very top
 * of the viewport that fills as the reader scrolls a long-form page
 * (/about, /proof, /brand). No track, no percentage, no label: it is
 * a position, not a stat.
 *
 * Desktop only, gated at (min-width: 768px). On a phone the sticky
 * nav already owns the top edge and the bar competes for 1px it can't
 * spare; the brief says skip mobile if it doesn't earn its keep, and
 * here it doesn't.
 *
 * No animation library. scaleX is written directly inside a single
 * rAF-coalesced scroll handler, so it tracks the thumb at 60fps and
 * needs no transition (which also makes reduced-motion a non-issue —
 * it reflects position, it does not animate).
 */

import { useEffect, useRef, useState } from "react";

export function ReadingProgress() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const apply = () => setEnabled(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      if (ref.current) ref.current.style.transform = `scaleX(${p})`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      aria-hidden
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: 1,
        zIndex: 60,
        pointerEvents: "none",
      }}
    >
      <div
        ref={ref}
        style={{
          height: "100%",
          background: "var(--indigo, #4f46e5)",
          transformOrigin: "left",
          transform: "scaleX(0)",
          willChange: "transform",
        }}
      />
    </div>
  );
}
