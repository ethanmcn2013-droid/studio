"use client";

/**
 * SuiteSwitcher — canonical cross-product navigation component.
 *
 * Canonical source for ALL five repos (studio/tasks/roadmap/analytics/notes).
 * Copy byte-identical to each repo's src/components/layout/SuiteSwitcher.tsx.
 * Adjust only: the `currentProduct` prop + the `homeUrl` constant per repo.
 *
 * IA spec: DECISIONS.md D6, ISSUE_REGISTER.md P2-1.
 * Brand: DESIGN.md §14, BRAND.md §2, §5.
 *
 * ── Design contract ───────────────────────────────────────────────
 *
 * One switcher. One header line. One verb pattern. One footer link.
 * The trigger IS the wordmark — the left-side studio breadcrumb logo.
 * Clicking "signal studio." opens the switcher panel. No separate
 * "Products" button. No "Products ▾" label. The wordmark is the trigger.
 *
 * This matches the Notes/Timeline pattern and resolves the Tasks outlier
 * (D6: "Tasks SuiteChrome is the outlier causing 'signal studio.×3'").
 *
 * Panel anatomy:
 *   Header  — "signal studio." + "Four products, one studio." tagline
 *   List    — 4 product rows: word·  / verb / tagline
 *   Footer  — "Back to Signal Studio →" link → signalstudio.ie (same-tab)
 *
 * Verb pattern (locked — matches suite-launcher.tsx, IA_COHERENCE.md §1C):
 *   timeline  "Open timeline"
 *   tasks     "Open tasks"
 *   notes     "Open notes"
 *   signal    "Open signal"
 *
 * ── Accessibility ─────────────────────────────────────────────────
 *
 * The trigger button wraps the wordmark rendering. It uses aria-expanded
 * and aria-haspopup="listbox". The panel traps Escape and returns focus
 * to the trigger. Outside-click dismisses the panel.
 *
 * ── Reduced motion ────────────────────────────────────────────────
 *
 * No animation on the panel open/close — it appears and disappears
 * instantly. The brand does not animate chrome transitions.
 *
 * ── Usage ─────────────────────────────────────────────────────────
 *
 *   // In your app header, replace the wordmark link with:
 *   <SuiteSwitcher currentProduct="tasks" />
 *
 *   // The wordmark renders inline as the trigger. The panel floats
 *   // below it. No separate Link wrapper is needed.
 *
 * ── Per-repo customisation ────────────────────────────────────────
 *
 * This file is copied byte-identical. The only values that differ are:
 *   1. The `currentProduct` prop passed by the parent (marks the active row)
 *   2. The STUDIO_URL constant (all repos point to signalstudio.ie)
 *   3. The per-product URLs (swap from env vars or hardcoded per repo)
 *
 * Do not add per-product CSS classes, colours, or gestural differences
 * inside this component. The brand identity for loading and transitions
 * lives in SuiteLoader.tsx, not here.
 */

import { useEffect, useRef, useState } from "react";

// ── Product catalogue ──────────────────────────────────────────────

const STUDIO_URL = "https://signalstudio.ie";

type ProductSlug = "timeline" | "tasks" | "notes" | "signal";

const PRODUCTS: {
  slug: ProductSlug;
  word: string;
  verb: string;
  tagline: string;
  url: string;
}[] = [
  // Product order (operator-directed 2026-05-18): Notes → Tasks → Timeline→ Signal
  {
    slug: "notes",
    word: "notes",
    verb: "Open notes",
    tagline: "Capture clarity",
    url: "https://notes.signalstudio.ie/app",
  },
  {
    slug: "tasks",
    word: "tasks",
    verb: "Open tasks",
    tagline: "Execution clarity",
    url: "https://tasks.signalstudio.ie/app",
  },
  {
    slug: "timeline",
    word: "timeline",
    verb: "Open timeline",
    tagline: "Direction clarity",
    url: "https://timeline.signalstudio.ie/app",
  },
  {
    slug: "signal",
    word: "signal",
    verb: "Open signal",
    tagline: "Attention clarity",
    url: "https://signal.signalstudio.ie/app",
  },
];

const INDIGO = "#4f46e5";

// ── Props ──────────────────────────────────────────────────────────

interface SuiteSwitcherProps {
  /**
   * The currently active product. That row is shown with full opacity
   * and a checkmark indicator — it does not navigate (you are here).
   * Pass undefined on the marketing site (no active product).
   */
  currentProduct?: ProductSlug;
}

// ── Component ──────────────────────────────────────────────────────

export function SuiteSwitcher({ currentProduct }: SuiteSwitcherProps) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // ── Outside-click + Escape dismiss ─────────────────────────────
  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={wrapRef} className="relative">
      {/* Trigger — the wordmark IS the switcher button. D6 contract. */}
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={
          open ? "Close Signal Studio product switcher" : "Open Signal Studio product switcher"
        }
        className="wordmark-hover flex items-baseline"
        style={{
          background: "none",
          border: "none",
          padding: 0,
          cursor: "pointer",
        }}
      >
        {/* Wordmark inline render — matches DESIGN.md §14 breadcrumb spec.
            Geist 600 · letter-spacing -0.025em · ink colour.
            The indigo dot is rendered as a literal period in the brand voice. */}
        <span
          className="wordmark"
          style={{
            fontFamily: "var(--font-geist-sans, Geist, system-ui, sans-serif)",
            fontWeight: 600,
            fontSize: "inherit",
            letterSpacing: "-0.025em",
            lineHeight: 1,
            color: "var(--ink, #111111)",
          }}
        >
          signal studio
          <span style={{ color: INDIGO }}>.</span>
        </span>
        {/* Caret — communicates trigger affordance without a chevron label */}
        <svg
          width="8"
          height="8"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
          style={{
            marginLeft: "0.35em",
            color: "var(--ink-quiet, #71717a)",
            transition: "transform 160ms ease-out",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            flexShrink: 0,
          }}
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {/* Panel — floats below trigger on desktop, fixed-position on mobile */}
      {open && (
        <div
          role="listbox"
          aria-label="Signal Studio products"
          className="fixed left-4 right-4 top-[64px] z-50 overflow-hidden rounded-xl border bg-paper shadow-[0_24px_60px_-24px_rgba(20,21,26,0.22)] sm:absolute sm:left-0 sm:right-auto sm:top-full sm:mt-2 sm:w-[300px]"
          style={{ borderColor: "var(--border-soft)" }}
        >
          {/* Header */}
          <div
            className="border-b px-3.5 py-2.5"
            style={{
              borderBottomColor:
                "color-mix(in srgb, var(--border-soft) 70%, transparent)",
            }}
          >
            <div className="text-[11px] font-medium tracking-[-0.005em] text-ink-soft">
              signal studio
              <span style={{ color: INDIGO }}>.</span>
            </div>
            <div className="mt-0.5 text-[10.5px] text-ink-quiet">
              Four products, one studio.
            </div>
          </div>

          {/* Product list */}
          <ul className="p-1" role="presentation">
            {PRODUCTS.map((p) => {
              const isCurrent = p.slug === currentProduct;
              return (
                <li key={p.slug} role="option" aria-selected={isCurrent}>
                  {isCurrent ? (
                    // Current product — not a link, you are here.
                    <div
                      className="flex items-center justify-between gap-3 rounded-md px-2.5 py-2"
                      style={{
                        background:
                          "color-mix(in srgb, var(--accent-soft) 60%, transparent)",
                      }}
                    >
                      <div className="min-w-0">
                        <div
                          className="text-[13px] font-semibold tracking-[-0.01em]"
                          style={{ color: INDIGO }}
                        >
                          {p.word}
                          <span style={{ color: INDIGO }}>·</span>
                        </div>
                        <div className="text-[11px] font-normal text-ink-quiet">
                          {p.tagline}
                        </div>
                      </div>
                      {/* "here" indicator */}
                      <svg
                        width="10"
                        height="10"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke={INDIGO}
                        strokeWidth="2.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden
                        style={{ flexShrink: 0 }}
                      >
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                    </div>
                  ) : (
                    <a
                      href={p.url}
                      onClick={() => setOpen(false)}
                      className="group flex items-center justify-between gap-3 rounded-md px-2.5 py-2 text-ink no-underline transition-colors hover:bg-paper-soft"
                    >
                      <div className="min-w-0">
                        <div className="text-[13px] font-semibold tracking-[-0.01em]">
                          {p.word}
                          <span style={{ color: INDIGO }}>·</span>
                        </div>
                        <div className="text-[11px] font-normal text-ink-quiet">
                          {p.tagline}
                        </div>
                      </div>
                      {/* Arrow on hover */}
                      <span className="shrink-0 text-ink-faint opacity-0 transition-opacity group-hover:opacity-100">
                        <svg
                          width="11"
                          height="11"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.4"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden
                        >
                          <path d="M7 17L17 7M17 7H8M17 7v9" />
                        </svg>
                      </span>
                    </a>
                  )}
                </li>
              );
            })}
          </ul>

          {/* Footer — §1F: "Back to Signal Studio →" same-tab (authed). */}
          <div
            className="border-t px-3.5 py-2.5"
            style={{
              borderTopColor:
                "color-mix(in srgb, var(--border-soft) 70%, transparent)",
            }}
          >
            <a
              href={STUDIO_URL}
              onClick={() => setOpen(false)}
              className="block text-[11px] text-ink-quiet no-underline transition-colors hover:text-ink"
            >
              Back to Signal Studio →
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
