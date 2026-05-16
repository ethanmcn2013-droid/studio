"use client";

import { useEffect, useRef, useState } from "react";
import {
  ANALYTICS_URL,
  NOTES_URL,
  ROADMAP_URL,
  TASKS_URL,
} from "@/lib/product-urls";

type ProductSlug = "tasks" | "roadmap" | "notes" | "analytics";

const PRODUCTS: {
  slug: ProductSlug;
  word: string;
  tagline: string;
  url: string;
}[] = [
  { slug: "tasks", word: "tasks", tagline: "Execution clarity", url: TASKS_URL },
  { slug: "roadmap", word: "roadmap", tagline: "Direction clarity", url: ROADMAP_URL },
  { slug: "notes", word: "notes", tagline: "Capture clarity", url: NOTES_URL },
  { slug: "analytics", word: "analytics", tagline: "Attention clarity", url: ANALYTICS_URL },
];

const INDIGO = "#4f46e5";

/**
 * Umbrella-side product switcher. Mirrors the SuiteLauncher contract
 * used inside each product (Tasks/Roadmap/Analytics/Notes) — same
 * popover chrome, same product order — but the trigger here reads
 * "Products" because the user is on signalstudio.ie itself.
 */
export function ProductSwitcher() {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onDocClick(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={wrapRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Open Signal Studio product switcher"
        className="inline-flex items-center gap-1 text-[13px] text-ink-quiet transition-colors hover:text-ink"
        style={{ letterSpacing: "0.01em" }}
      >
        Products
        <svg
          width="10"
          height="10"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            transition: "transform 200ms",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
          }}
          aria-hidden
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      {open ? (
        <div
          role="menu"
          className="fixed left-4 right-4 top-[64px] z-50 overflow-hidden rounded-xl border bg-bg-elev shadow-[0_24px_60px_-24px_rgba(20,21,26,0.22)] sm:absolute sm:left-auto sm:right-0 sm:top-full sm:mt-2 sm:w-[280px]"
          style={{ borderColor: "var(--border-soft)" }}
        >
          <div
            className="border-b px-3.5 py-2.5"
            style={{ borderBottomColor: "color-mix(in srgb, var(--border-soft) 70%, transparent)" }}
          >
            <div className="text-[11px] font-medium tracking-[-0.005em] text-ink-soft">
              Signal Studio
            </div>
            <div className="mt-0.5 text-[10.5px] text-ink-quiet">
              Four products, one studio.
            </div>
          </div>
          <ul className="p-1">
            {PRODUCTS.map((p) => (
              <li key={p.slug}>
                <a
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  role="menuitem"
                  onClick={() => setOpen(false)}
                  className="group flex items-center justify-between gap-3 rounded-md px-2.5 py-2 text-ink no-underline transition-colors hover:bg-bg-deep"
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
                  <span className="text-ink-faint opacity-0 transition-opacity group-hover:opacity-100">
                    <svg
                      width="12"
                      height="12"
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
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
