"use client";

import { useEffect, useRef, useState } from "react";

export function MotionCurve() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [sequence, setSequence] = useState(0);
  const [frozen, setFrozen] = useState(false);

  useEffect(() => {
    const node = rootRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(Boolean(entry?.isIntersecting)),
      { threshold: 0.4 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={rootRef}
      className="guidelines-curve"
      data-running={inView && !frozen || undefined}
    >
      <div className="guidelines-curve-stage" key={sequence}>
        <svg viewBox="0 0 600 300" role="img" aria-label="The Signal ease-out curve, fast arrival and a long settle.">
          <line x1="56" y1="248" x2="544" y2="248" />
          <line x1="56" y1="248" x2="56" y2="48" />
          <path d="M56 248 C168 48, 212 48, 544 48" />
          <circle cx="168" cy="48" r="4" />
          <circle cx="212" cy="48" r="4" />
        </svg>
        <span className="guidelines-curve-dot" aria-hidden />
      </div>
      <div className="guidelines-curve-copy">
        <div>
          <p>Fast arrival. Long settle.</p>
          <code>cubic-bezier(0.23, 1, 0.32, 1)</code>
        </div>
        <div>
          <button type="button" onClick={() => setSequence((value) => value + 1)}>
            Replay
          </button>
          <button
            type="button"
            aria-pressed={frozen}
            onClick={() => setFrozen((value) => !value)}
          >
            {frozen ? "Resume" : "Freeze"}
          </button>
        </div>
      </div>
    </div>
  );
}
