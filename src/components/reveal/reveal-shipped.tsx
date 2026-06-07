/**
 * Reveal shipped rail — walkover row 8 (Da Vinci's plea).
 *
 * "What we shipped recently" — pulled from `content/dispatch/*.md` at
 * build time, top three entries by date. The rail proves the page is
 * not a brochure: shipped beats keep arriving. Each row is
 * date · verb · headline; the rail links to /dispatch for the full
 * history. Server-rendered, no JS, reduced-motion-safe by construction.
 *
 * Sits between RevealProducts and RevealClosing — proof of velocity
 * after the four-product walk, before the close.
 */

import Link from "next/link";
import { readDispatchEntries, type DispatchEntry } from "@/lib/changelog";

const VERB_COLOR: Record<DispatchEntry["verb"], string> = {
  ships: "var(--accent)",
  tightens: "var(--ink-700)",
  cuts: "var(--ink-700)",
  holds: "var(--ink-500)",
  reads: "var(--ink-500)",
};

export async function RevealShipped() {
  const all = await readDispatchEntries();
  const entries = all.slice(0, 3);
  if (entries.length === 0) return null;

  return (
    <section
      className="reveal-shipped"
      aria-label="Recent dispatch entries"
    >
      <div className="reveal-shipped-head">
        <span className="reveal-shipped-eyebrow">
          Recent dispatch <span className="gold">·</span> what shipped
        </span>
        <Link href="/dispatch" className="reveal-shipped-link">
          Read every entry
          <span aria-hidden> →</span>
        </Link>
      </div>
      <ol className="reveal-shipped-list">
        {entries.map((entry, i) => (
          <li key={`${entry.date}-${i}`} className="reveal-shipped-row">
            <div className="reveal-shipped-meta">
              <time
                className="reveal-shipped-date"
                dateTime={entry.date}
              >
                {entry.date}
              </time>
              <span
                className="reveal-shipped-verb"
                style={{ color: VERB_COLOR[entry.verb] }}
              >
                {entry.verb}
              </span>
            </div>
            <p className="reveal-shipped-headline">{entry.headline}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
