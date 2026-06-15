"use client";

/**
 * A press boilerplate that a writer can lift in one tap. Two jobs:
 *
 *  1. Render multi-paragraph copy correctly. The old markup put
 *     {"\n\n"} between paragraphs inside a blockquote, which HTML
 *     collapses to a single space — the 400-word boilerplate rendered
 *     as one wall. Paragraphs are real <p> elements now.
 *
 *  2. Copy clean plain text. A press page exists to be used on a
 *     deadline; making someone marquee-select a justified paragraph is
 *     the opposite of hosted. The button copies the text with real
 *     punctuation and confirms quietly — no toast, no colour flash,
 *     just the label changing to "Copied" for a beat.
 */

import { useState } from "react";

export function CopyableQuote({ paragraphs }: { paragraphs: readonly string[] }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(paragraphs.join("\n\n"));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard blocked (insecure context / permissions). The text is
      // right there to select by hand; failing silently beats an alert.
    }
  }

  return (
    <blockquote
      className="relative rounded-xl border border-border-soft px-5 py-4 pr-[84px] text-[15px] leading-[1.65] text-ink"
      style={{ background: "var(--bg-elev, white)" }}
    >
      <button
        type="button"
        onClick={copy}
        aria-label={copied ? "Copied to clipboard" : "Copy to clipboard"}
        className="absolute right-3 top-3 inline-flex items-center rounded-md border border-border-soft px-2.5 py-1 font-mono text-[10.5px] font-semibold uppercase tracking-[0.1em] text-ink-faint transition-colors hover:border-[color:var(--accent)] hover:text-[color:var(--accent)]"
      >
        <span aria-live="polite">{copied ? "Copied" : "Copy"}</span>
      </button>
      <div className="space-y-3">
        {paragraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
    </blockquote>
  );
}
