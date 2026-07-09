"use client";

/**
 * ProductPills, four pills at the top of the umbrella front door to jump
 * between products. One indigo dot marks the product in use; the dot glides
 * to whichever pill is hovered/focused, and on click it travels to the
 * target pill before the page navigates ("the cool dot transition").
 *
 * Product order (operator-directed 2026-05-18): Notes → Tasks → Timeline → Signal
 *
 * SAFETY (post-2026-05-18 SEV-0): fully scoped (`pp-*`), IN-FLOW only —
 * no position:fixed, no inset:0, no high z-index, no global @keyframes.
 * The dot moves via a CSS transform transition on a single in-bar element;
 * it can never cover a page. prefers-reduced-motion → instant move +
 * immediate navigation (no animated delay).
 */

import { useRef, useState, useCallback } from "react";
import {
  SIGNAL_URL,
  NOTES_URL,
  TIMELINE_URL,
  TASKS_URL,
} from "@/lib/product-urls";

type Product = { slug: string; label: string; href: string };

const PRODUCTS: Product[] = [
  { slug: "notes", label: "notes", href: NOTES_URL },
  { slug: "tasks", label: "tasks", href: TASKS_URL },
  { slug: "timeline", label: "timeline", href: TIMELINE_URL },
  { slug: "signal", label: "signal", href: SIGNAL_URL },
];

export function ProductPills({ current }: { current?: string }) {
  const barRef = useRef<HTMLDivElement>(null);
  const pillRefs = useRef<Array<HTMLAnchorElement | null>>([]);
  // active index drives the dot. Defaults to the in-use product if given,
  // else the home position (parked under the first pill, muted).
  const currentIdx = current
    ? PRODUCTS.findIndex((p) => p.slug === current)
    : -1;
  const [dotX, setDotX] = useState<number | null>(null);
  const [hovering, setHovering] = useState(false);

  const moveDotTo = useCallback((i: number) => {
    const bar = barRef.current;
    const pill = pillRefs.current[i];
    if (!bar || !pill) return;
    const br = bar.getBoundingClientRect();
    const pr = pill.getBoundingClientRect();
    setDotX(pr.left - br.left + pr.width / 2);
  }, []);

  const restDot = useCallback(() => {
    setHovering(false);
    if (currentIdx >= 0) moveDotTo(currentIdx);
    else setDotX(null);
  }, [currentIdx, moveDotTo]);

  const onPillClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, p: Product, i: number) => {
      const reduce =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce) return; // let the link navigate immediately
      e.preventDefault();
      moveDotTo(i);
      // Source press <=120ms, never delays navigation (loading canon law 8).
      // The dot starts travelling; the destination owns the arrival.
      window.setTimeout(() => {
        window.location.href = p.href;
      }, 120);
    },
    [moveDotTo],
  );

  return (
    <nav className="pp" aria-label="Jump to a product">
      <div
        className="pp-bar"
        ref={barRef}
        onMouseLeave={restDot}
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node)) restDot();
        }}
      >
        {PRODUCTS.map((p, i) => {
          const isCurrent = i === currentIdx;
          return (
            <a
              key={p.slug}
              ref={(el) => {
                pillRefs.current[i] = el;
              }}
              className={`pp-pill${isCurrent ? " pp-current" : ""}`}
              href={p.href}
              onMouseEnter={() => {
                setHovering(true);
                moveDotTo(i);
              }}
              onFocus={() => {
                setHovering(true);
                moveDotTo(i);
              }}
              onClick={(e) => onPillClick(e, p, i)}
              aria-current={isCurrent ? "page" : undefined}
            >
              <span className="pp-word">{p.label}</span>
              <span className="pp-period">.</span>
            </a>
          );
        })}
        <span
          className={`pp-dot${dotX === null ? " pp-dot-parked" : ""}${hovering ? " pp-dot-live" : ""}`}
          style={dotX === null ? undefined : { transform: `translateX(${dotX}px)` }}
          aria-hidden
        />
      </div>
      <style>{PP_CSS}</style>
    </nav>
  );
}

const PP_CSS = `
.pp{display:flex;justify-content:center;width:100%;
  padding:18px 16px 0;font-family:var(--font-geist-sans,system-ui,sans-serif);}
.pp-bar{position:relative;display:inline-flex;align-items:center;gap:4px;
  padding:6px;border:1px solid var(--border-soft,rgba(17,17,17,.08));
  border-radius:999px;background:var(--paper,#fff);}
.pp-pill{position:relative;display:inline-flex;align-items:baseline;
  padding:7px 16px 9px;border-radius:999px;text-decoration:none;
  color:var(--ink-quiet,#6b6b6b);font-size:14px;font-weight:500;
  letter-spacing:-.01em;transition:color .18s ease,background .18s ease;}
.pp-pill:hover,.pp-pill:focus-visible{color:var(--ink,#111);
  background:var(--paper-soft,#fafafa);outline:none;}
.pp-pill.pp-current{color:var(--ink,#111);}
.pp-period{color:var(--indigo,#4f46e5);font-weight:600;margin-left:1px;}
.pp-dot{position:absolute;bottom:3px;left:0;width:6px;height:6px;
  margin-left:-3px;border-radius:50%;background:var(--indigo,#4f46e5);
  opacity:0;transition:transform .34s cubic-bezier(.34,1.4,.5,1),opacity .2s ease;
  will-change:transform;pointer-events:none;}
.pp-dot.pp-dot-live{opacity:1;}
.pp-current ~ .pp-dot:not(.pp-dot-live){opacity:1;}
.pp-dot-parked{opacity:0;}
@media (prefers-reduced-motion:reduce){
  .pp-dot{transition:opacity .15s ease;}
}
`;
