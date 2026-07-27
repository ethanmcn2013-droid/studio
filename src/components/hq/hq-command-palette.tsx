"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { HQ_ROOMS, HQ_GROUPS, type HqGroupKey } from "@/lib/hq/rooms";

/**
 * HqCommandPalette — ⌘K / Ctrl-K to reach any room without learning the IA.
 *
 * Navigation-only by design (safe, fast, no side effects): it jumps to the
 * rooms HQ already has. The room list is sourced from the canonical registry
 * (`src/lib/hq/rooms.ts`, client-safe pure data) so the palette can never
 * drift from the nav, the group landings, or the contract test — the whole
 * point of the "a room exists iff it is in rooms.ts" rule.
 *
 * Delight Layer Phase 1: a typed argument chip scopes the jump. Type
 * `room:` (or `group:` / `in:`) and pick a group — Sell, Make, Money,
 * Company, Board — to narrow the list to that group's rooms before the free
 * text ranks what's left. One tab stop, Backspace pops the chip, click to
 * remove. In the brand register: paper surface, one indigo, hairline
 * dividers, mono eyebrows. Esc closes, ↑/↓ move, ⏎ opens.
 */

type Room = {
  label: string;
  hint: string;
  href: string;
  /** Owning group, or null for the navigational extras (Home, Exit). */
  group: HqGroupKey | null;
  /** Extra words that should match this room when typed. */
  keywords?: string;
};

// Home + Exit are navigation, not rooms; they bracket the registry-sourced
// list. Everything between is HQ_ROOMS, verbatim, so there is one source.
const ROOMS: Room[] = [
  {
    label: "Home",
    hint: "the verdict and the rooms",
    href: "/hq",
    group: null,
    keywords: "dashboard start verdict home",
  },
  ...HQ_ROOMS.map((room) => ({
    label: room.name,
    hint: room.summary,
    href: room.route,
    group: room.group,
    keywords: (room.aliases ?? []).join(" "),
  })),
  {
    label: "Exit",
    hint: "back to signalstudio.ie",
    href: "/",
    group: null,
    keywords: "leave exit public site",
  },
];

// The one argument facet: scope the jump to a group. Triggers are the words
// that, followed by ":", enter group-pick mode.
const GROUP_TRIGGERS = ["room", "group", "in"];

type GroupChip = { value: HqGroupKey; label: string };

/** Parse the raw query into a pending group-pick (trigger typed) or null. */
function matchGroupTrigger(query: string): { optionQuery: string } | null {
  const colon = query.indexOf(":");
  if (colon <= 0) return null;
  const raw = query.slice(0, colon).trim().toLowerCase();
  if (!GROUP_TRIGGERS.includes(raw)) return null;
  return { optionQuery: query.slice(colon + 1) };
}

function score(room: Room, q: string): number {
  if (!q) return 1;
  const hay = `${room.label} ${room.hint} ${room.keywords ?? ""}`.toLowerCase();
  if (room.label.toLowerCase().startsWith(q)) return 3;
  if (hay.includes(q)) return 2;
  // loose subsequence match so "rpt" finds "reporting"
  let i = 0;
  for (const ch of room.label.toLowerCase()) if (ch === q[i]) i++;
  return i === q.length ? 1 : 0;
}

export function HqCommandPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [chips, setChips] = useState<GroupChip[]>([]);
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const pending = useMemo(() => matchGroupTrigger(query), [query]);

  // Group options while picking: exclude already-chosen groups, filter by the
  // text after the trigger.
  const groupOptions = useMemo(() => {
    if (!pending) return [];
    const taken = new Set(chips.map((c) => c.value));
    const q = pending.optionQuery.trim().toLowerCase();
    return HQ_GROUPS.filter(
      (g) =>
        !taken.has(g.key) &&
        (!q || g.name.toLowerCase().includes(q) || g.label.includes(q)),
    );
  }, [pending, chips]);

  const results = useMemo(() => {
    if (pending) return [];
    const groups = new Set(chips.map((c) => c.value));
    const scoped =
      groups.size === 0
        ? ROOMS
        : ROOMS.filter((r) => r.group !== null && groups.has(r.group));
    const q = query.trim().toLowerCase();
    if (!q) {
      // Chips-only (or bare): registry order, which is already grouped.
      return scoped;
    }
    return scoped
      .map((r) => ({ r, s: score(r, q) }))
      .filter((x) => x.s > 0)
      .sort((a, b) => b.s - a.s)
      .map((x) => x.r);
  }, [pending, chips, query]);

  const listLength = pending ? groupOptions.length : results.length;
  const activeIdx = Math.min(active, Math.max(0, listLength - 1));

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setChips([]);
    setActive(0);
  }, []);

  const go = useCallback(
    (href: string) => {
      close();
      router.push(href);
    },
    [close, router],
  );

  const addChip = useCallback(
    (group: (typeof HQ_GROUPS)[number]) => {
      setChips((prev) => [...prev, { value: group.key, label: group.name }]);
      setQuery("");
      setActive(0);
    },
    [],
  );

  const removeChip = useCallback((index: number) => {
    setChips((prev) => prev.filter((_, i) => i !== index));
    setActive(0);
  }, []);

  // Global ⌘K / Ctrl-K toggle.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && (e.key === "k" || e.key === "K")) {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (open) requestAnimationFrame(() => inputRef.current?.focus());
  }, [open]);

  // Keep the active row in view.
  useEffect(() => {
    if (!open) return;
    const el = listRef.current?.querySelector<HTMLElement>('[data-active="true"]');
    el?.scrollIntoView({ block: "nearest" });
  }, [active, open, pending]);

  // Expose an opener for the visible ⌘K trigger in the nav.
  useEffect(() => {
    const opener = () => setOpen(true);
    window.addEventListener("hq:open-palette", opener);
    return () => window.removeEventListener("hq:open-palette", opener);
  }, []);

  if (!open) return null;

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      if (query !== "") setQuery("");
      else close();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (listLength) setActive((a) => (Math.min(a, listLength - 1) + 1) % listLength);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (listLength)
        setActive((a) => (Math.min(a, listLength - 1) - 1 + listLength) % listLength);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (pending) {
        const group = groupOptions[activeIdx];
        if (group) addChip(group);
      } else {
        const pick = results[activeIdx];
        if (pick) go(pick.href);
      }
    } else if (e.key === "Backspace" && query === "" && chips.length > 0) {
      e.preventDefault();
      removeChip(chips.length - 1);
    }
  };

  return (
    <div className="hq-cmdk" role="presentation" onMouseDown={close}>
      <div
        className="hq-cmdk-panel"
        role="dialog"
        aria-modal="true"
        aria-label="Jump to a room"
        onMouseDown={(e) => e.stopPropagation()}
        onKeyDown={onKeyDown}
      >
        <div className="hq-cmdk-search" onClick={() => inputRef.current?.focus()}>
          <span className="hq-cmdk-prompt" aria-hidden="true">
            jump to<span className="hq-cmdk-prompt-dot">.</span>
          </span>
          {chips.map((chip, index) => (
            <button
              key={chip.value}
              type="button"
              tabIndex={-1}
              className="hq-cmdk-chip hq-cmdk-chip-enter"
              aria-label={`Remove filter group ${chip.label}`}
              onMouseDown={(e) => e.preventDefault()}
              onClick={(e) => {
                e.stopPropagation();
                removeChip(index);
              }}
            >
              <span className="hq-cmdk-chip-key">group</span>
              <span className="hq-cmdk-chip-val">{chip.label}</span>
              <span className="hq-cmdk-chip-x" aria-hidden="true">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </span>
            </button>
          ))}
          <input
            ref={inputRef}
            className="hq-cmdk-input"
            placeholder={pending ? "a group…" : "a room, or room: to scope…"}
            value={query}
            role="combobox"
            aria-expanded="true"
            aria-controls="hq-cmdk-listbox"
            aria-autocomplete="list"
            onChange={(event) => {
              setQuery(event.target.value);
              setActive(0);
            }}
            autoComplete="off"
            spellCheck={false}
          />
          <kbd className="hq-cmdk-esc">esc</kbd>
        </div>

        {pending ? (
          <ul
            id="hq-cmdk-listbox"
            className="hq-cmdk-list"
            ref={listRef}
            role="listbox"
            aria-label="Groups"
          >
            {groupOptions.length === 0 ? (
              <li className="hq-cmdk-empty">No group by that name.</li>
            ) : (
              groupOptions.map((group, i) => (
                <li key={group.key} role="option" aria-selected={i === activeIdx}>
                  <button
                    type="button"
                    className="hq-cmdk-row"
                    data-active={i === activeIdx ? "true" : undefined}
                    onMouseMove={() => setActive(i)}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => addChip(group)}
                  >
                    <span className="hq-cmdk-row-label">{group.name}</span>
                    <span className="hq-cmdk-row-hint">{group.gloss}</span>
                  </button>
                </li>
              ))
            )}
          </ul>
        ) : (
          <ul
            id="hq-cmdk-listbox"
            className="hq-cmdk-list"
            ref={listRef}
            role="listbox"
            aria-label="Rooms"
          >
            {results.length === 0 ? (
              <li className="hq-cmdk-empty">Nothing here by that name.</li>
            ) : (
              results.map((room, i) => (
                <li key={room.href} role="option" aria-selected={i === activeIdx}>
                  <button
                    type="button"
                    className="hq-cmdk-row"
                    data-active={i === activeIdx ? "true" : undefined}
                    onMouseMove={() => setActive(i)}
                    onClick={() => go(room.href)}
                  >
                    <span className="hq-cmdk-row-label">{room.label}</span>
                    <span className="hq-cmdk-row-hint">{room.hint}</span>
                  </button>
                </li>
              ))
            )}
          </ul>
        )}

        <div className="hq-cmdk-foot">
          <span><kbd>↑</kbd><kbd>↓</kbd> move</span>
          <span><kbd>⏎</kbd> {pending ? "scope" : "open"}</span>
          <span><kbd>esc</kbd> {query ? "clear" : "close"}</span>
        </div>
      </div>
    </div>
  );
}
