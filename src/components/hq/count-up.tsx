"use client";

import { useEffect, useRef, useState } from "react";

/**
 * CountUp, a calm number that resolves into place on first paint.
 *
 * Brand check: motion here means "this just resolved from a live source",
 * nothing more. It is short, eased, and silent. Non-numeric values
 * ("unread", "—") render verbatim, never animated, never faked. SSR and
 * no-JS render the final value, so the number is correct without the
 * animation; the count is pure enhancement.
 *
 * It preserves any prefix (€) and suffix (%, k, /mo, /4) around the first
 * number it finds, animating only the integer part.
 */

const NUMERIC = /^(\D*)(\d[\d,]*)(\.\d+)?(.*)$/;
const DURATION = 620;
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

export function CountUp({
  value,
  className,
}: {
  value: string;
  className?: string;
}) {
  const match = value.match(NUMERIC);
  // Bail to verbatim render for anything that isn't "<prefix><number><suffix>".
  const target = match ? Number(match[2].replace(/,/g, "")) : null;
  const [shown, setShown] = useState<number | null>(target);
  const raf = useRef<number | null>(null);

  useEffect(() => {
    if (target == null) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || target === 0) {
      setShown(target);
      return;
    }
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / DURATION);
      setShown(Math.round(easeOut(p) * target));
      if (p < 1) raf.current = requestAnimationFrame(tick);
    };
    setShown(0);
    raf.current = requestAnimationFrame(tick);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [target]);

  if (target == null || !match) {
    return <span className={className}>{value}</span>;
  }

  const [, prefix, , decimal, suffix] = match;
  const body = shown == null ? value : shown.toLocaleString("en-IE");
  // Decimals are shown only at rest, never mid-count (keeps the motion calm).
  const tail = shown == null || shown === target ? (decimal ?? "") : "";

  return (
    <span className={className}>
      {prefix}
      {body}
      {tail}
      {suffix}
    </span>
  );
}
