"use client";

import { useEffect, useRef, type RefObject } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { PRODUCT_MARKETING_URLS } from "@/lib/product-urls";

const INDIGO = "#4f46e5";
const INK = "#111111";

type ProductSlug = "notes" | "tasks" | "timeline";

const PRODUCTS = [
  { slug: "notes"    as ProductSlug, name: "notes",    tagline: "Capture clarity",   description: "A quiet surface to think before you act.", url: PRODUCT_MARKETING_URLS.notes },
  { slug: "tasks"    as ProductSlug, name: "tasks",    tagline: "Execution clarity", description: "Track what matters without the noise.",    url: PRODUCT_MARKETING_URLS.tasks },
  { slug: "timeline" as ProductSlug, name: "timeline", tagline: "Direction clarity", description: "Show the plan. Keep everyone aligned.",    url: PRODUCT_MARKETING_URLS.timeline },
] as const;

/* ── Embedded stylesheet ──────────────────────────────────────────
   Self-contained so it works regardless of Turbopack/PostCSS cache.
   Injected once via <style> at render time.
   ─────────────────────────────────────────────────────────────── */
const PANEL_CSS = `
/* Panel shell, absolute below sticky nav, full-width backdrop */
.mpanel {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  z-index: 50;
  background: #ffffff;
  border-bottom: 1px solid rgba(17,17,17,0.08);
  box-shadow: 0 20px 48px -16px rgba(17,17,17,0.10), 0 4px 12px -4px rgba(17,17,17,0.05);
}

/* Inner content, centred, matches nav max-width */
.mpanel-inner {
  max-width: 760px;
  margin: 0 auto;
  padding: 24px 24px 28px;
}

/* Header label */
.mpanel-label {
  font-size: 10.5px;
  font-weight: 500;
  letter-spacing: 0.09em;
  text-transform: uppercase;
  color: #71717a;
  margin: 0 0 16px 2px;
  line-height: 1;
}

/* 4-column grid */
.mpanel-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

/* Card */
.mpanel-card {
  display: block;
  padding: 18px 16px 16px;
  border-radius: 10px;
  border: 1px solid transparent;
  text-decoration: none;
  color: #111111;
  background: transparent;
  cursor: pointer;
  transition:
    background 160ms var(--ease-out),
    border-color 160ms var(--ease-out),
    transform 120ms var(--ease-out);
}
.mpanel-card:focus-visible {
  outline: 2px solid #4f46e5;
  outline-offset: 2px;
  background: rgba(79,70,229,0.05);
  border-color: rgba(79,70,229,0.24);
}
.mpanel-card:active { transform: scale(0.985); }

/* Visual stage */
.mpanel-stage {
  height: 68px;
  display: flex;
  align-items: center;
  margin-bottom: 14px;
  overflow: hidden;
}

/* Product name */
.mpanel-name {
  font-size: 15px;
  font-weight: 500;
  letter-spacing: -0.025em;
  line-height: 1.2;
  color: #111111;
  margin-bottom: 3px;
}
.mpanel-dot { color: #4f46e5; }

/* Tagline */
.mpanel-tagline {
  font-size: 11.5px;
  color: #71717a;
  letter-spacing: 0.005em;
  margin-bottom: 8px;
  line-height: 1.4;
}

/* Description */
.mpanel-desc {
  font-size: 11px;
  color: var(--zinc-600);
  line-height: 1.55;
  margin-bottom: 12px;
}

/* CTA */
.mpanel-cta {
  display: flex;
  align-items: center;
  gap: 3px;
  font-size: 11px;
  font-weight: 500;
  color: #4f46e5;
  opacity: 1;
  transition: opacity 160ms ease-out;
}

/* ── Gesture animations ──────────────────────────────────────── */

/* notes · caret blink */
.mnotes-cursor { opacity: 1; }
@keyframes mnotes-caret {
  0%,49% { opacity: 1; }
  50%,100% { opacity: 0; }
}
.mpanel-card[data-slug="notes"] .mnotes-cursor {
  animation: mnotes-caret 760ms steps(1,end) 140ms 2;
}

/* tasks · pulse, staggered across 3 dots */
.mtasks-dot { transform-box: fill-box; transform-origin: center; }
.mtasks-dot-1,
.mtasks-dot-2,
.mtasks-dot-3 { transform: scale(1); }
@keyframes mtasks-pulse {
  0%,30%,100% { transform: scale(1); }
  10%         { transform: scale(1.28); }
  20%         { transform: scale(1); }
  40%         { transform: scale(1.14); }
  50%         { transform: scale(1); }
}
.mpanel-card[data-slug="tasks"] .mtasks-dot {
  animation: mtasks-pulse 1.1s var(--ease-out) 180ms 1 both;
}
.mpanel-card[data-slug="tasks"] .mtasks-dot-2 { animation-delay: 230ms; }
.mpanel-card[data-slug="tasks"] .mtasks-dot-3 { animation-delay: 280ms; }

/* roadmap · sweep */
.mroadmap-dot {
  transform-box: fill-box;
  transform-origin: center;
  transform: translateX(36px);
}
@keyframes mroadmap-sweep {
  0%   { transform: translateX(0);    opacity: 1; }
  60%  { transform: translateX(79px); opacity: 1; }
  62%  { transform: translateX(79px); opacity: 0; }
  70%  { transform: translateX(0);    opacity: 0; }
  78%  { transform: translateX(0);    opacity: 1; }
  100% { transform: translateX(0);    opacity: 1; }
}
.mpanel-card[data-slug="timeline"] .mroadmap-dot {
  animation: mroadmap-sweep 1.4s var(--ease-in-out) 220ms 1 both;
}

/* analytics · tick */
@keyframes mbar1 {
  0%  { transform: scaleY(0.55); } 25% { transform: scaleY(0.85); }
  50% { transform: scaleY(0.35); } 75% { transform: scaleY(1.00); }
}
@keyframes mbar2 {
  0%  { transform: scaleY(0.90); } 25% { transform: scaleY(0.45); }
  50% { transform: scaleY(1.00); } 75% { transform: scaleY(0.60); }
}
@keyframes mbar3 {
  0%  { transform: scaleY(0.40); } 25% { transform: scaleY(0.75); }
  50% { transform: scaleY(0.55); } 75% { transform: scaleY(0.25); }
}
@keyframes mbar4 {
  0%  { transform: scaleY(1.00); } 25% { transform: scaleY(0.55); }
  50% { transform: scaleY(0.80); } 75% { transform: scaleY(0.40); }
}

/* Footer row, quiet link to the design system */
.mpanel-foot {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 18px;
  padding-top: 14px;
  border-top: 1px solid var(--hairline);
  font-size: 12px;
  letter-spacing: 0.01em;
  color: var(--ink-quiet);
  text-decoration: none;
  transition: color 160ms ease;
}
.mpanel-foot:hover { color: var(--ink); }
.mpanel-foot svg { opacity: 0.7; }

@media (hover: hover) and (pointer: fine) {
  .mpanel-card:hover {
    background: rgba(79,70,229,0.05);
    border-color: rgba(79,70,229,0.18);
  }
}

/* Mobile, 2×2 grid */
@media (max-width: 640px) {
  .mpanel-grid { grid-template-columns: 1fr; gap: 10px; }
  .mpanel-inner { padding: 20px 16px 24px; }
  .mpanel-stage { height: 56px; }
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .mpanel-card {
    transition:
      background 160ms var(--ease-out),
      border-color 160ms var(--ease-out);
  }
  .mpanel-card:active { transform: none; }
  .mnotes-cursor, .mtasks-dot, .mroadmap-dot,   .mnotes-cursor { opacity: 1; }
  .mroadmap-dot  { transform: none; }
  }
`;

/* ── Per-product gesture visuals ─────────────────────────────── */

function NotesVisual() {
  return (
    <svg width="88" height="52" viewBox="0 0 88 52" fill="none" aria-hidden>
      <rect x="0" y="4"  width="72" height="2" rx="1" fill={INK} opacity="0.10" />
      <rect x="0" y="14" width="84" height="2" rx="1" fill={INK} opacity="0.10" />
      <rect x="0" y="24" width="60" height="2" rx="1" fill={INK} opacity="0.10" />
      <rect x="0" y="34" width="44" height="2" rx="1" fill={INK} opacity="0.10" />
      <rect x="47" y="30" width="1.5" height="10" rx="0.75" fill={INDIGO} className="mnotes-cursor" />
    </svg>
  );
}

function TasksVisual() {
  return (
    <svg width="88" height="52" viewBox="0 0 88 52" fill="none" aria-hidden>
      <circle cx="5" cy="9"  r="4" fill={INDIGO} className="mtasks-dot mtasks-dot-1" />
      <rect x="16" y="7"  width="64" height="2" rx="1" fill={INK} opacity="0.12" />
      <circle cx="5" cy="25" r="4" fill={INDIGO} className="mtasks-dot mtasks-dot-2" />
      <rect x="16" y="23" width="50" height="2" rx="1" fill={INK} opacity="0.12" />
      <circle cx="5" cy="41" r="4" fill={INDIGO} className="mtasks-dot mtasks-dot-3" />
      <rect x="16" y="39" width="58" height="2" rx="1" fill={INK} opacity="0.12" />
    </svg>
  );
}

function RoadmapVisual() {
  return (
    <svg width="88" height="52" viewBox="0 0 88 52" fill="none" aria-hidden>
      <rect x="2" y="26" width="82" height="1.5" rx="0.75" fill={INK} opacity="0.09" />
      <rect x="2"  y="20" width="1.5" height="12" rx="0.75" fill={INK} opacity="0.18" />
      <rect x="30" y="20" width="1.5" height="12" rx="0.75" fill={INK} opacity="0.18" />
      <rect x="57" y="20" width="1.5" height="12" rx="0.75" fill={INK} opacity="0.18" />
      <rect x="83" y="20" width="1.5" height="12" rx="0.75" fill={INK} opacity="0.18" />
      <circle cx="4" cy="26.75" r="5" fill={INDIGO} className="mroadmap-dot" />
    </svg>
  );
}

const VISUAL_MAP: Record<ProductSlug, () => React.ReactElement> = {
  notes:    NotesVisual,
  tasks:    TasksVisual,
  timeline: RoadmapVisual,
};

/* ── Component ───────────────────────────────────────────────── */

interface Props {
  open: boolean;
  onClose: () => void;
  triggerRef: RefObject<HTMLButtonElement | null>;
}

export function ProductsMegaPanel({ open, onClose, triggerRef }: Props) {
  const panelRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        window.requestAnimationFrame(() => triggerRef.current?.focus());
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose, triggerRef]);

  return (
    <>
      {/* Embedded stylesheet, self-contained, no build-cache dependency */}
      <style dangerouslySetInnerHTML={{ __html: PANEL_CSS }} />

      <AnimatePresence initial={false}>
        {open ? (
      <motion.nav
        key="products-mega-panel"
        ref={panelRef}
        id="products-mega-panel"
        aria-label="Signal Studio products"
        className="mpanel"
        initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -4 }}
        transition={{
          duration: reducedMotion ? 0.01 : 0.22,
          ease: [0.23, 1, 0.32, 1],
        }}
      >
        <div className="mpanel-inner">
          <p className="mpanel-label">Notes. Tasks. Timeline. One clear system.</p>

          <div className="mpanel-grid">
            {PRODUCTS.map((product, i) => {
              const Visual = VISUAL_MAP[product.slug];
              return (
                <motion.a
                  key={product.slug}
                  href={product.url}
                  onClick={onClose}
                  className="mpanel-card"
                  data-slug={product.slug}
                  initial={reducedMotion ? false : { opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: reducedMotion ? 0.01 : 0.2,
                    delay: reducedMotion ? 0 : i * 0.035,
                    ease: [0.23, 1, 0.32, 1],
                  }}
                >
                  <div className="mpanel-stage" aria-hidden>
                    <Visual />
                  </div>

                  <div className="mpanel-name">
                    {product.name}<span className="mpanel-dot">·</span>
                  </div>

                  <div className="mpanel-tagline">{product.tagline}</div>

                  <div className="mpanel-desc">{product.description}</div>

                  <div className="mpanel-cta">
                    Open
                    <svg width="9" height="9" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2.4"
                      strokeLinecap="round" strokeLinejoin="round">
                      <path d="M7 17L17 7M17 7H8M17 7v9" />
                    </svg>
                  </div>
                </motion.a>
              );
            })}
          </div>

          <a href="/design" onClick={onClose} className="mpanel-foot">
            <span>One system behind all three, see the design</span>
            <svg width="9" height="9" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.4"
              strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M7 17L17 7M17 7H8M17 7v9" />
            </svg>
          </a>
        </div>
      </motion.nav>
        ) : null}
      </AnimatePresence>
    </>
  );
}
