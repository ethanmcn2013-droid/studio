"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { AtlasLens, AtlasLensConfig, AtlasObject } from "../types";
import { typeLabel } from "../utils/view";

type Item = {
  kind: "node" | "lens";
  id: string;
  label: string;
  sub: string;
  kindLabel: string;
};

function scoreItem(hayLabel: string, hayAll: string, q: string): number {
  if (!q) return 1;
  const label = hayLabel.toLowerCase();
  if (label.startsWith(q)) return 3;
  if (hayAll.toLowerCase().includes(q)) return 2;
  let i = 0;
  for (const ch of label) if (ch === q[i]) i++;
  return i === q.length ? 1 : 0;
}

/**
 * Object search. Opened with `/`. Finds any node or lens and jumps to it.
 * Global ⌘K stays HQ's nav palette; this is scoped to the map to avoid a
 * double-bind (see docs/atlas/technical-plan.md §8).
 */
export function AtlasSearch({
  nodes,
  lenses,
  onPickNode,
  onPickLens,
  onClose,
}: {
  nodes: AtlasObject[];
  lenses: AtlasLensConfig[];
  onPickNode: (id: string) => void;
  onPickLens: (id: AtlasLens) => void;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const allItems: Item[] = useMemo(
    () => [
      ...nodes.map((n) => ({
        kind: "node" as const,
        id: n.id,
        label: n.name,
        sub: n.description,
        kindLabel: typeLabel(n.type),
      })),
      ...lenses.map((l) => ({
        kind: "lens" as const,
        id: l.id,
        label: `${l.label} lens`,
        sub: l.tagline,
        kindLabel: "Lens",
      })),
    ],
    [nodes, lenses],
  );

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return allItems
      .map((it) => ({ it, s: scoreItem(it.label, `${it.label} ${it.sub}`, q) }))
      .filter((r) => r.s > 0)
      .sort((a, b) => b.s - a.s)
      .map((r) => r.it);
  }, [allItems, query]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  function pick(item: Item | undefined) {
    if (!item) return;
    if (item.kind === "lens") onPickLens(item.id as AtlasLens);
    else onPickNode(item.id);
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
      <div className="atlas-search" role="dialog" aria-label="Search the Atlas">
        <input
          ref={inputRef}
          className="atlas-search-input"
          type="text"
          placeholder="Search systems and lenses"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setActive(0);
          }}
          onKeyDown={onKeyDown}
          aria-label="Search the Atlas"
          aria-autocomplete="list"
        />
        {results.length ? (
          <ul className="atlas-search-list" role="listbox">
            {results.map((it, i) => (
              <li
                key={`${it.kind}-${it.id}`}
                role="option"
                aria-selected={i === active}
                className="atlas-search-item"
                onMouseEnter={() => setActive(i)}
                onClick={() => pick(it)}
              >
                <span>{it.label}</span>
                <span className="atlas-search-item-kind">{it.kindLabel}</span>
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
