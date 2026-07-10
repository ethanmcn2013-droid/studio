"use client";

import { useEffect, useMemo, useRef, useState } from "react";

export type SearchEntry = {
  kind: "director" | "council" | "tool";
  id: string;
  label: string;
  sub: string;
  /** Everything matchable, beyond the label. */
  hay: string;
};

function score(entry: SearchEntry, q: string): number {
  if (!q) return 1;
  const label = entry.label.toLowerCase();
  if (label.startsWith(q)) return 3;
  if (entry.hay.toLowerCase().includes(q)) return 2;
  let i = 0;
  for (const ch of label) if (ch === q[i]) i++;
  return i === q.length ? 1 : 0;
}

/**
 * `/`-key search over directors, councils, and tools. Picking a result jumps
 * to the right mode: directors focus in the chart, councils and tools open
 * their mode and highlight the card.
 */
export function OrgSearch({
  entries,
  onPick,
  onClose,
}: {
  entries: SearchEntry[];
  onPick: (entry: SearchEntry) => void;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return entries
      .map((e) => ({ e, s: score(e, q) }))
      .filter((r) => r.s > 0)
      .sort((a, b) => b.s - a.s)
      .map((r) => r.e)
      .slice(0, 12);
  }, [entries, query]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);
  useEffect(() => {
    setActive(0);
  }, [query]);

  function pick(e: SearchEntry | undefined) {
    if (e) onPick(e);
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      pick(results[active]);
    } else if (e.key === "Escape") {
      e.preventDefault();
      onClose();
    }
  }

  return (
    <div
      className="atlas-search-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="atlas-search" role="dialog" aria-label="Search the org">
        <input
          ref={inputRef}
          className="atlas-search-input"
          type="text"
          placeholder="Search directors, councils, tools"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={onKeyDown}
          aria-label="Search the org"
          aria-autocomplete="list"
        />
        {results.length ? (
          <ul className="atlas-search-list" role="listbox">
            {results.map((entry, i) => (
              <li
                key={`${entry.kind}-${entry.id}`}
                role="option"
                aria-selected={i === active}
                className="atlas-search-item"
                onMouseEnter={() => setActive(i)}
                onClick={() => pick(entry)}
              >
                <span>{entry.label}</span>
                <span className="atlas-search-item-kind">{entry.sub}</span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="atlas-search-empty">Nothing matches “{query}”.</div>
        )}
        <div className="atlas-search-foot">
          <span>
            <span className="atlas-kbd">↑</span>
            <span className="atlas-kbd">↓</span> move
          </span>
          <span>
            <span className="atlas-kbd">⏎</span> open
          </span>
          <span>
            <span className="atlas-kbd">esc</span> close
          </span>
        </div>
      </div>
    </div>
  );
}
