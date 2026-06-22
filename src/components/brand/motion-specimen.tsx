"use client";

/**
 * /brand motion specimen — one interactive cell in the "five
 * wordmarks, five motions" grid.
 *
 * - Auto-plays on initial scroll-in (the gesture restarts cleanly as
 *   the cell enters view, so it is never caught mid-cycle).
 * - Hover-in restarts the gesture (pointer devices only).
 * - Click (or Enter/Space) freezes the gesture mid-motion and
 *   emphasises the spec — duration + motion name — inline. Click again
 *   resumes from a clean restart.
 *
 * No animation library: the gesture itself is the existing CSS on
 * .brand-mark; this only toggles classes and animation-play-state, the
 * same restart trick the homepage RevealEngine uses. Reduced motion:
 * the gesture is already neutralised globally, so hover/scroll restart
 * is skipped and only the spec emphasis (a colour change) remains.
 */

import { useEffect, useRef, useState } from "react";
import { Wordmark } from "@/components/brand/wordmark";

type Variant = "signal" | "tasks" | "roadmap" | "analytics" | "notes";

// The visible word (post 2026-06-13 rename: roadmap→timeline,
// analytics→signal). The `variant` key stays on the internal gesture
// identity; only the displayed word changes.
function wordFor(variant: Variant): string {
  if (variant === "roadmap") return "timeline";
  if (variant === "analytics") return "signal";
  return variant;
}

function glyph(variant: Variant) {
  if (variant === "signal") return "signal studio.";
  return wordFor(variant) + (variant === "notes" ? "." : "·");
}

export function MotionSpecimen({
  variant,
  name,
  cycle,
  className = "",
}: {
  variant: Variant;
  name: string;
  cycle: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [paused, setPaused] = useState(false);

  const mark = () =>
    ref.current?.querySelector<HTMLElement>(".brand-mark") ?? null;

  const restart = () => {
    const el = mark();
    if (!el) return;
    el.classList.remove("is-paused");
    el.classList.remove("is-live");
    // Force reflow so the animation starts from 0 again.
    void el.offsetWidth;
    el.classList.add("is-live");
  };

  // Auto-play on initial scroll-in: restart once when the cell enters.
  useEffect(() => {
    if (
      typeof window === "undefined" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }
    const node = ref.current;
    if (!node) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          restart();
          io.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  const reduced = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const toggle = () => {
    const el = mark();
    if (!el) return;
    if (paused) {
      setPaused(false);
      restart();
    } else {
      setPaused(true);
      el.classList.add("is-paused");
    }
  };

  return (
    <div
      ref={ref}
      role="button"
      tabIndex={0}
      aria-pressed={paused}
      aria-label={`${glyph(variant)} — ${name}, ${cycle}. ${
        paused ? "Frozen. Activate to resume." : "Activate to freeze the motion."
      }`}
      data-paused={paused}
      className={`motion-specimen flex aspect-[1.05] cursor-pointer flex-col justify-between p-6 outline-none focus-visible:ring-2 focus-visible:ring-[var(--indigo)] focus-visible:ring-inset ${className}`}
      onMouseEnter={() => {
        if (!paused && !reduced()) restart();
      }}
      onClick={toggle}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          toggle();
        }
      }}
    >
      <div className="flex items-center justify-between font-mono text-[10px] tracking-[0.04em] text-[var(--ink-faint)]">
        <span className="text-[var(--ink)]">{glyph(variant)}</span>
        <span>{variant === "signal" || variant === "notes" ? "noun" : "verb"}</span>
      </div>
      <div className="flex flex-1 items-center justify-center py-4">
        <Wordmark
          variant={variant}
          size="md"
          animate
        />
      </div>
      <div className="motion-specimen-spec flex items-center justify-between font-mono text-[10px] tracking-[0.04em] text-[var(--ink-faint)]">
        <span>{name}</span>
        <span>{cycle}</span>
      </div>
    </div>
  );
}
