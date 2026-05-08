"use client";

import { useEffect, useRef } from "react";

interface WordmarkProps {
  className?: string;
  /** Show the settling animation on the period. Default true. */
  animate?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
  /** Render as a plain span instead of a heading element. */
  as?: "span" | "div" | "h1";
}

const SIZE: Record<string, string> = {
  sm: "text-base",
  md: "text-2xl",
  lg: "text-4xl",
  xl: "text-[clamp(2.25rem,1.6rem+2.8vw,4rem)]",
};

/**
 * Studio wordmark: "studio."
 *
 * Signature: the period is accent-gold and fades in 200ms after mount —
 * a settling gesture, not a pulse. Quieter than Tasks' heartbeat dot,
 * quieter than Roadmap's slide. Studio is the workshop; it doesn't
 * announce itself.
 */
export function Wordmark({
  className = "",
  animate = true,
  size = "md",
  as: Tag = "span",
}: WordmarkProps) {
  const periodRef = useRef<HTMLSpanElement>(null);

  // Trigger the settle animation after hydration. CSS animation handles
  // the timing (200ms delay, 300ms fade) so this is just ensuring the
  // element is mounted before the class applies.
  useEffect(() => {
    const el = periodRef.current;
    if (!el || !animate) return;
    // The animation runs via the .studio-period class in globals.css.
    // Nothing to do — CSS handles it. This hook is a no-op safety net
    // for future imperative control if needed.
  }, [animate]);

  const sizeClass = SIZE[size] ?? SIZE.md;

  return (
    <Tag
      className={`inline-flex select-none items-baseline font-semibold tracking-[-0.05em] ${sizeClass} ${className}`}
    >
      <span
        className="wordmark"
        style={{ fontWeight: 600 }}
      >
        studio
      </span>
      <span
        ref={periodRef}
        aria-hidden
        className={animate ? "studio-period" : ""}
        style={{
          color: "var(--accent)",
          fontWeight: 600,
          opacity: animate ? undefined : 1,
        }}
      >
        .
      </span>
    </Tag>
  );
}
