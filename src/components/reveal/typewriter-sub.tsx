"use client";

/**
 * Typewriter sub-hero, the line types in letter by letter at the same
 * moment the headline finishes its word-stagger. A vertical caret sits
 * at the end of the typed text and continues blinking after the line
 * completes, the "live document" gesture: the work is still happening.
 *
 * Honors prefers-reduced-motion: text appears instantly, caret renders
 * but does not blink.
 *
 * Timing coordinates with reveal-engine.tsx, that timeline fades the
 * .reveal-subhead wrapper in at ~0.35s, so the typewriter starts just
 * after (~0.7s). Fast cadence keeps the hero from making the visitor
 * wait on the UI (Kowalski: speed first).
 */

import { useEffect, useState } from "react";

interface TypewriterSubProps {
  text: string;
  /** ms per character. Default 28ms ≈ 36 cps, brisk, not a wait. */
  speed?: number;
  /** ms delay before the first character types in. Default 700ms to
   * coordinate with reveal-engine.tsx's subhead fade-in. */
  startDelayMs?: number;
}

export function TypewriterSub({
  text,
  speed = 28,
  startDelayMs = 700,
}: TypewriterSubProps) {
  const [displayed, setDisplayed] = useState("");
  const [started, setStarted] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  // Detect reduced-motion once on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mql.matches);
  }, []);

  // Kick off typing after the configured start delay (or immediately
  // when reduced-motion is preferred, settle to final text and skip
  // the per-character animation).
  useEffect(() => {
    if (reduceMotion) {
      setDisplayed(text);
      setStarted(true);
      return;
    }
    const id = window.setTimeout(() => setStarted(true), startDelayMs);
    return () => window.clearTimeout(id);
  }, [startDelayMs, text, reduceMotion]);

  // Per-character append
  useEffect(() => {
    if (!started || reduceMotion) return;
    if (displayed.length >= text.length) return;
    const id = window.setTimeout(() => {
      setDisplayed(text.slice(0, displayed.length + 1));
    }, speed);
    return () => window.clearTimeout(id);
  }, [started, displayed, text, speed, reduceMotion]);

  return (
    <p className="reveal-subhead" aria-label={text}>
      <span aria-hidden>{displayed}</span>
      {started && <span className="reveal-cursor" aria-hidden />}
    </p>
  );
}
