"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { BlueprintSection } from "@/lib/hq/blueprint";

/**
 * BlueprintCanvas, the zoomable shell for the Founder Operating System map.
 *
 * Dependency-free by design (the repo already carries gsap/lenis, but a
 * blueprint map should not pull motion libs for a transform). It provides:
 *   - zoom in / out / reset (buttons, +/- and 0 keys, ctrl+wheel)
 *   - drag-to-pan when zoomed past 1×
 *   - a section legend that jumps to any of the ten anchors
 *
 * The server page renders all section DOM as `children`; this component
 * only owns the camera. Keeping the two split means section content stays
 * server-rendered (good for first paint + accessibility) while the map
 * interaction is purely client-side.
 */

const ZOOM_MIN = 0.5;
const ZOOM_MAX = 1.6;
const ZOOM_STEP = 0.1;

const clamp = (n: number, min: number, max: number) =>
  Math.min(max, Math.max(min, n));

export function BlueprintCanvas({
  sections,
  children,
}: {
  sections: BlueprintSection[];
  children: React.ReactNode;
}) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);
  const [active, setActive] = useState(sections[0]?.id ?? "");

  const zoomBy = useCallback((delta: number) => {
    setZoom((z) => Number(clamp(z + delta, ZOOM_MIN, ZOOM_MAX).toFixed(2)));
  }, []);

  const reset = useCallback(() => setZoom(1), []);

  // Keyboard camera controls, ignored while typing in a field.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.key === "+" || e.key === "=") {
        e.preventDefault();
        zoomBy(ZOOM_STEP);
      } else if (e.key === "-" || e.key === "_") {
        e.preventDefault();
        zoomBy(-ZOOM_STEP);
      } else if (e.key === "0") {
        e.preventDefault();
        reset();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [zoomBy, reset]);

  // Ctrl/⌘ + wheel = zoom (matches every map tool). Plain wheel scrolls.
  const onWheel = useCallback(
    (e: React.WheelEvent) => {
      if (!(e.ctrlKey || e.metaKey)) return;
      e.preventDefault();
      zoomBy(e.deltaY > 0 ? -ZOOM_STEP : ZOOM_STEP);
    },
    [zoomBy],
  );

  // Drag-to-pan, only meaningful once zoomed in past the viewport.
  const drag = useRef<{ x: number; y: number; left: number; top: number } | null>(null);
  const onPointerDown = (e: React.PointerEvent) => {
    if (zoom <= 1) return;
    const vp = viewportRef.current;
    if (!vp) return;
    // ignore drags that start on interactive elements
    if ((e.target as HTMLElement).closest("a,button")) return;
    drag.current = { x: e.clientX, y: e.clientY, left: vp.scrollLeft, top: vp.scrollTop };
    vp.setPointerCapture(e.pointerId);
    vp.dataset.panning = "true";
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const vp = viewportRef.current;
    if (!drag.current || !vp) return;
    vp.scrollLeft = drag.current.left - (e.clientX - drag.current.x);
    vp.scrollTop = drag.current.top - (e.clientY - drag.current.y);
  };
  const endPan = (e: React.PointerEvent) => {
    const vp = viewportRef.current;
    if (vp) {
      delete vp.dataset.panning;
      if (vp.hasPointerCapture(e.pointerId)) vp.releasePointerCapture(e.pointerId);
    }
    drag.current = null;
  };

  const jumpTo = (id: string) => {
    setActive(id);
    const el = document.getElementById(`bp-${id}`);
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Highlight the section currently in view in the legend.
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((en) => en.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id.replace("bp-", ""));
      },
      { rootMargin: "-30% 0px -55% 0px", threshold: [0, 0.25, 0.5] },
    );
    sections.forEach((s) => {
      const el = document.getElementById(`bp-${s.id}`);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, [sections]);

  return (
    <div className="bp-stage">
      {/* Legend rail, the minimap / jump list. */}
      <aside className="bp-legend" aria-label="Blueprint sections">
        <span className="bp-legend-title">the map</span>
        <ol className="bp-legend-list">
          {sections.map((s) => (
            <li key={s.id}>
              <button
                type="button"
                className="bp-legend-item"
                data-active={active === s.id ? "true" : undefined}
                onClick={() => jumpTo(s.id)}
              >
                <span className="bp-legend-num">{String(s.index).padStart(2, "0")}</span>
                <span className="bp-legend-label">{s.label}</span>
              </button>
            </li>
          ))}
        </ol>
      </aside>

      {/* Camera controls. */}
      <div className="bp-controls" role="group" aria-label="Zoom controls">
        <button type="button" onClick={() => zoomBy(-ZOOM_STEP)} aria-label="Zoom out" disabled={zoom <= ZOOM_MIN}>
          −
        </button>
        <button type="button" className="bp-controls-level" onClick={reset} aria-label="Reset zoom">
          {Math.round(zoom * 100)}%
        </button>
        <button type="button" onClick={() => zoomBy(ZOOM_STEP)} aria-label="Zoom in" disabled={zoom >= ZOOM_MAX}>
          +
        </button>
      </div>

      {/* The pannable viewport + scaled canvas. */}
      <div
        ref={viewportRef}
        className="bp-viewport"
        data-zoomed={zoom > 1 ? "true" : undefined}
        onWheel={onWheel}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endPan}
        onPointerCancel={endPan}
      >
        <div className="bp-canvas" style={{ "--bp-zoom": zoom } as React.CSSProperties}>
          {children}
        </div>
      </div>
    </div>
  );
}
