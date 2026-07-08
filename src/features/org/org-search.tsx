"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Director } from "@/lib/hq/elt";
import { roleTitle } from "./org-utils";

function score(hayLabel: string, hayAll: string, q: string): number {
  if (!q) return 1;
  const label = hayLabel.toLowerCase();
  if (label.startsWith(q)) return 3;
  if (hayAll.toLowerCase().includes(q)) return 2;
  let i = 0;
  for (const ch of label) if (ch === q[i]) i++;
  return i === q.length ? 1 : 0;
}

/** `/`-key search over the Directors. Enter focuses the match. */
export function OrgSearch({
  directors,
  onPick,
  onClose,
}: {
  directors: Director[];
  onPick: (id: string) => void;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return directors
      .map((d) => ({
        d,
        s: score(roleTitle(d.name), `${d.name} ${d.persona} ${d.shortName} ${d.owns.join(" ")}`, q),
      }))
      .filter((r) => r.s > 0)
      .sort((a, b) => b.s - a.s)
      .map((r) => r.d);
  }, [directors, query]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);
  useEffect(() => {
    setActive(0);
  }, [query]);

  function pick(d: Director | undefined) {
    if (d) onPick(d.id);
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
          placeholder="Search directors, personas, portfolios"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={onKeyDown}
          aria-label="Search the org"
          aria-autocomplete="list"
        />
        {results.length ? (
          <ul className="atlas-search-list" role="listbox">
            {results.map((d, i) => (
              <li
                key={d.id}
                role="option"
                aria-selected={i === active}
                className="atlas-search-item"
                onMouseEnter={() => setActive(i)}
                onClick={() => pick(d)}
              >
                <span>{roleTitle(d.name)}</span>
                <span className="atlas-search-item-kind">{d.shortName}</span>
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
            <span className="atlas-kbd">⏎</span> focus
          </span>
          <span>
            <span className="atlas-kbd">esc</span> close
          </span>
        </div>
      </div>
    </div>
  );
}
