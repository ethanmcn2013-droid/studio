"use client";

/**
 * The "running a committee?" reveal on the student landing. A calm,
 * accessible disclosure: aria-expanded button, a panel that animates
 * open on grid-template-rows (no max-height guesswork), and `inert`
 * on the collapsed panel so its links stay out of the tab order and
 * the screen-reader cursor. Reduced-motion drops the transition.
 *
 * Kept generic so the one interactive moment on an otherwise static
 * page reads as part of the system, not a bespoke widget.
 */

import { useId, useState, type ReactNode } from "react";

export function CommitteeDisclosure({
  summary,
  children,
}: {
  summary: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  return (
    <div>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-4 rounded-xl border px-4 py-4 text-left text-[14px] font-medium text-ink transition-colors"
        style={{
          borderColor: open ? "var(--accent)" : "var(--border)",
          background: open ? "var(--accent-soft)" : "var(--paper)",
        }}
      >
        <span>{summary}</span>
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          aria-hidden
          className="flex-shrink-0 transition-transform duration-300 ease-out motion-reduce:transition-none"
          style={{
            color: "var(--accent)",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
          }}
        >
          <path
            d="M3.5 5.25L7 8.75l3.5-3.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <div
        id={panelId}
        inert={!open}
        className="grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none"
        style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden">
          <div className="pt-3">{children}</div>
        </div>
      </div>
    </div>
  );
}
