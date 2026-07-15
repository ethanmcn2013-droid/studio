"use client";

/**
 * /brand motion specimen, one interactive cell in the "five
 * wordmarks, five motions" grid.
 *
 * - Auto-plays on initial scroll-in (the gesture restarts cleanly as
 *   the cell enters view, so it is never caught mid-cycle).
 * - Hover-in restarts the gesture (pointer devices only).
 * - Click (or Enter/Space) freezes the gesture mid-motion and
 *   emphasises the spec, duration + motion name, inline. Click again
 *   resumes from a clean restart.
 *
 * No animation library: the gesture itself is the existing CSS on
 * .brand-mark; this only toggles classes and animation-play-state, the
 * same restart trick the homepage RevealEngine uses. Reduced motion:
 * the gesture is already neutralised globally, so hover/scroll restart
 * is skipped and only the spec emphasis (a colour change) remains.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { Wordmark } from "@/components/brand/wordmark";

type Kind = "studio" | "tasks" | "timeline" | "signal" | "notes";

function glyph(kind: Kind) {
  if (kind === "studio") return "signal studio.";
  // Period for the finished things (notes. signal.), middot for the
  // working tools (tasks· timeline·) — same rule as the Wordmark itself.
  return kind + (kind === "notes" || kind === "signal" ? "." : "·");
}

export function MotionSpecimen({
  kind,
  name,
  cycle,
  className = "",
}: {
  kind: Kind;
  name: string;
  cycle: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [paused, setPaused] = useState(false);

  const mark = useCallback(
    () => ref.current?.querySelector<HTMLElement>(".brand-mark") ?? null,
    [],
  );

  const restart = useCallback(() => {
    const el = mark();
    if (!el) return;
    el.classList.remove("is-paused");
    el.classList.remove("is-live");
    // Force reflow so the animation starts from 0 again.
    void el.offsetWidth;
    el.classList.add("is-live");
  }, [mark]);

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
  }, [restart]);

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
      aria-label={`${glyph(kind)}, ${name}, ${cycle}. ${
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
        <span className="text-[var(--ink)]">{glyph(kind)}</span>
        <span>{kind === "studio" || kind === "signal" || kind === "notes" ? "noun" : "verb"}</span>
      </div>
      <div className="flex flex-1 items-center justify-center py-4">
        <Wordmark
          kind={kind}
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
