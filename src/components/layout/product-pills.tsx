"use client";

/**
 * ProductPills, three pills at the top of the umbrella front door to jump
 * between products (Signal → Home consolidation, 2026-08-04: Signal left
 * the product line). One indigo dot marks the product in use; the dot glides
 * to whichever pill is hovered/focused. Press moves it immediately, while
 * navigation remains native and is never delayed for the animation.
 *
 * Product order: Notes → Tasks → Timeline.
 *
 * SAFETY (post-2026-05-18 SEV-0): fully scoped (`pp-*`), IN-FLOW only —
 * no position:fixed, no inset:0, no high z-index, no global @keyframes.
 * The dot moves via a CSS transform transition on a single in-bar element;
 * it can never cover a page. prefers-reduced-motion → instant move +
 * immediate navigation (no animated delay).
 */

import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { PRODUCT_MARKETING_URLS } from "@/lib/product-urls";

type Product = { slug: string; label: string; href: string };

const PRODUCTS: Product[] = [
  { slug: "notes", label: "notes", href: PRODUCT_MARKETING_URLS.notes },
  { slug: "tasks", label: "tasks", href: PRODUCT_MARKETING_URLS.tasks },
  { slug: "timeline", label: "timeline", href: PRODUCT_MARKETING_URLS.timeline },
];

export function ProductPills({ current }: { current?: string }) {
  const barRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLSpanElement>(null);
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

  // The indicator must begin under the actual route, not at the bar origin.
  // Remeasure after layout and whenever responsive text/pill geometry changes.
  useLayoutEffect(() => {
    if (currentIdx < 0) return;

    const measure = () => moveDotTo(currentIdx);
    dotRef.current?.classList.remove("pp-dot-interactive");
    let cancelled = false;
    let geometryReady = false;
    let measureFrame: number | null = null;
    let interactiveFrame: number | null = null;
    const updateMeasuredGeometry = () => {
      if (geometryReady) measure();
    };
    const enableMeasuredGeometry = () => {
      if (cancelled) return;
      measureFrame = window.requestAnimationFrame(() => {
        if (cancelled) return;
        geometryReady = true;
        measure();
        interactiveFrame = window.requestAnimationFrame(() => {
          dotRef.current?.classList.add("pp-dot-interactive");
        });
      });
    };

    if (document.fonts) {
      void document.fonts.ready.then(enableMeasuredGeometry);
    } else {
      enableMeasuredGeometry();
    }
    window.addEventListener("resize", updateMeasuredGeometry);

    const observer =
      typeof ResizeObserver === "undefined"
        ? null
        : new ResizeObserver(updateMeasuredGeometry);
    if (barRef.current) observer?.observe(barRef.current);

    return () => {
      cancelled = true;
      if (measureFrame !== null) window.cancelAnimationFrame(measureFrame);
      if (interactiveFrame !== null) {
        window.cancelAnimationFrame(interactiveFrame);
      }
      window.removeEventListener("resize", updateMeasuredGeometry);
      observer?.disconnect();
    };
  }, [currentIdx, moveDotTo]);

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
              onPointerDown={() => moveDotTo(i)}
              aria-current={isCurrent ? "page" : undefined}
            >
              <span className="pp-word">{p.label}</span>
              <span className="pp-period">.</span>
            </a>
          );
        })}
        <span
          ref={dotRef}
          className={`pp-dot${dotX !== null ? " pp-dot-ready" : ""}${hovering ? " pp-dot-live" : ""}`}
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
  letter-spacing:-.01em;transition:color .16s var(--ease-out),
  background .16s var(--ease-out),transform .12s var(--ease-out);}
.pp-pill:focus-visible{color:var(--ink,#111);background:var(--paper-soft,#fafafa);
  outline:2px solid var(--accent);outline-offset:1px;}
.pp-pill:active{transform:scale(.98);}
.pp-pill.pp-current{color:var(--ink,#111);}
.pp-period{color:var(--indigo,#4f46e5);font-weight:600;margin-left:1px;}
.pp-dot{position:absolute;bottom:3px;left:0;width:6px;height:6px;
  margin-left:-3px;border-radius:50%;background:var(--indigo,#4f46e5);
  opacity:0;transition:opacity .16s var(--ease-out);pointer-events:none;}
.pp-dot.pp-dot-interactive{transition:transform .34s var(--ease-out),
  opacity .16s var(--ease-out);}
.pp-dot.pp-dot-live{opacity:1;}
.pp-current ~ .pp-dot.pp-dot-ready:not(.pp-dot-live){opacity:1;}
@media (hover:hover) and (pointer:fine){
  .pp-pill:hover{color:var(--ink);background:var(--paper-soft);}
}
@media (prefers-reduced-motion:reduce){
  .pp-dot,.pp-dot.pp-dot-interactive{transition:opacity .15s ease;}
  .pp-pill{transition:color .16s var(--ease-out),
    background .16s var(--ease-out);}
  .pp-pill:active{transform:none;}
}
`;
