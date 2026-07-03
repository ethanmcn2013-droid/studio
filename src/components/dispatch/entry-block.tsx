"use client";

import { useId, useState, type ReactNode } from "react";
import type { DispatchEntry } from "@/lib/changelog";

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

function formatHumanDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return iso;
  return `${d} ${MONTHS[m - 1]} ${y}`;
}

type EntryBlockProps = {
  entry: DispatchEntry;
  /**
   * Pre-rendered body paragraphs. We render markdown server-side in the
   * parent (so `renderInline` keeps running in a server boundary) and pass
   * the ReactNode array in. The client only owns the expand/collapse state.
   */
  bodyNodes: ReactNode;
  /** Optional pre-rendered bold-lead. */
  boldLeadNode: ReactNode;
};

/**
 * Dispatch entry with mobile collapse.
 *
 * Desktop (≥640px): full entry always visible. The `dispatch-body` block
 * is `sm:!block`, so the collapse only applies to mobile.
 *
 * Mobile (<640px): header + headline + bold-lead are always visible. The
 * body collapses behind a "Read full" button. On expand, the button
 * disappears and the body fades in. No animation past a 200ms opacity.
 *
 * The bold-lead is the existing TL;DR in the dispatch shape (BRAND.md
 * §6.5), bold, leading sentence that names the impact. Collapsing the
 * body below it preserves the skim-and-decide read on phones without
 * paginating or shortening the narrative for desktop readers.
 */
export function EntryBlock({ entry, bodyNodes, boldLeadNode }: EntryBlockProps) {
  const [expanded, setExpanded] = useState(false);
  const id = useId();
  const bodyId = `dispatch-body-${id}`;

  return (
    <article className="border-t border-border-soft pt-10 first:border-t-0 first:pt-0">
      <header className="mb-4 flex flex-wrap items-baseline gap-x-4 gap-y-1 font-mono text-[11.5px] uppercase tracking-wide text-ink-quiet">
        <time dateTime={entry.date}>{formatHumanDate(entry.date)}</time>
        <span aria-hidden className="text-border">·</span>
        <span className="lowercase text-accent">{entry.verb}</span>
      </header>

      <h2 className="mb-5 max-w-[58ch] text-[22px] font-semibold leading-[1.15] tracking-[-0.015em] text-ink">
        {entry.headline}
      </h2>

      {boldLeadNode ? (
        <p className="mb-5 max-w-[58ch] text-[16px] font-medium leading-[1.55] text-ink">
          {boldLeadNode}
        </p>
      ) : null}

      <div
        id={bodyId}
        className={`max-w-[58ch] space-y-4 text-[15px] leading-[1.6] text-ink-soft sm:!block ${expanded ? "block" : "hidden"}`}
      >
        {bodyNodes}
      </div>

      {!expanded ? (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          aria-expanded={false}
          aria-controls={bodyId}
          className="mt-1 inline-flex min-h-[44px] items-center text-[14px] text-accent transition-opacity hover:opacity-70 sm:hidden"
        >
          Read full <span aria-hidden className="ml-1">→</span>
        </button>
      ) : null}
    </article>
  );
}
