"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { HQ_GROUPS, HQ_ROOMS } from "@/lib/hq/rooms";

/**
 * HqCommandPalette, ⌘K / Ctrl-K to reach anything without learning the IA.
 *
 * v2: generated, never hand-listed. Rooms come from the registry
 * (src/lib/hq/rooms.ts) so the palette cannot drift from reality — the
 * old static list shipped a dead /hq/copy-review entry for weeks. On top
 * of rooms it searches records (decisions, vault docs, atlas entries,
 * operator to-dos) from the guarded /hq/api/search-index endpoint,
 * fetched once per open session. Recent jumps render first on an empty
 * query (localStorage, five deep).
 *
 * Keyboard-first, in the brand register: paper surface, one indigo,
 * hairline dividers, mono eyebrows. Esc closes, ↑/↓ move, ⏎ opens.
 */

type PaletteEntry = {
  label: string;
  hint: string;
  href: string;
  keywords?: string;
  /** rooms outrank records; decided/archived rooms rank low */
  weight: number;
};

const RECENTS_KEY = "hq.palette.recents.v1";
const RECENTS_MAX = 5;

const LIFECYCLE_WEIGHT = { active: 1, decided: 0.6, archived: 0.4 } as const;

const STATIC_ENTRIES: PaletteEntry[] = [
  {
    label: "Today",
    hint: "the verdict + what needs you",
    href: "/hq",
    keywords: "home dashboard start verdict needs me attention",
    weight: 1.2,
  },
  ...HQ_GROUPS.map((group) => ({
    label: group.name,
    hint: group.gloss.toLowerCase().replace(/\.$/, ""),
    href: group.route,
    keywords: `group landing ${group.label}`,
    weight: 1.1,
  })),
  ...HQ_ROOMS.map((room) => ({
    label: room.name,
    hint: `${room.group} · ${room.summary.toLowerCase().replace(/\.$/, "")}`,
    href: room.route,
    keywords: `${room.slug.replace(/-/g, " ")} ${(room.aliases ?? []).join(" ")}`,
    weight: LIFECYCLE_WEIGHT[room.lifecycle],
  })),
  {
    label: "Venue codes",
    hint: "company · per-venue codes and allotment",
    href: "/hq/entitlements?tab=venues",
    keywords: "partners venues sponsors allotment codes mint redeemed",
    weight: 1,
  },
  {
    label: "Exit",
    hint: "back to signalstudio.ie",
    href: "/",
    keywords: "leave exit public site",
    weight: 0.5,
  },
];

type IndexRecord = { label: string; hint: string; href: string; keywords?: string };

function readRecents(): string[] {
  try {
    const raw = window.localStorage.getItem(RECENTS_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}

function pushRecent(href: string) {
  try {
    const next = [href, ...readRecents().filter((h) => h !== href)].slice(0, RECENTS_MAX);
    window.localStorage.setItem(RECENTS_KEY, JSON.stringify(next));
  } catch {
    /* private mode etc — recents are a nicety, never an error */
  }
}

function score(entry: PaletteEntry, q: string): number {
  if (!q) return entry.weight;
  const hay = `${entry.label} ${entry.hint} ${entry.keywords ?? ""}`.toLowerCase();
  if (entry.label.toLowerCase().startsWith(q)) return 3 * entry.weight;
  if (hay.includes(q)) return 2 * entry.weight;
  // loose subsequence match so "rpt" finds "reporting"
  let i = 0;
  for (const ch of entry.label.toLowerCase()) if (ch === q[i]) i++;
  return i === q.length ? entry.weight : 0;
}

export function HqCommandPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [recents, setRecents] = useState<string[]>([]);
  const [records, setRecords] = useState<IndexRecord[]>([]);
  const fetchedRef = useRef(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const entries = useMemo<PaletteEntry[]>(() => {
    const recordEntries = records.map((r) => ({ ...r, weight: 0.8 }));
    return [...STATIC_ENTRIES, ...recordEntries];
  }, [records]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      const byHref = new Map(entries.map((e) => [e.href, e]));
      const recent = recents
        .map((href) => byHref.get(href))
        .filter((e): e is PaletteEntry => Boolean(e))
        .map((e) => ({ ...e, hint: `recent · ${e.hint}` }));
      const rest = entries.filter(
        (e) => !recents.includes(e.href) && !e.href.startsWith("/hq/api"),
      );
      // records stay out of the empty-query browse list — it is a room
      // directory until you type
      return [...recent, ...rest.filter((e) => e.weight >= 0.5).sort((a, b) => b.weight - a.weight)];
    }
    return entries
      .map((e) => ({ e, s: score(e, q) }))
      .filter((x) => x.s > 0)
      .sort((a, b) => b.s - a.s)
      .map((x) => x.e);
  }, [entries, query, recents]);

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setActive(0);
  }, []);

  const go = useCallback(
    (href: string) => {
      pushRecent(href);
      close();
      router.push(href);
    },
    [close, router],
  );

  // Opening reads recents and lazily fetches the record index — state
  // writes happen in the event handlers, not effects.
  const openPalette = useCallback(() => {
    setRecents(readRecents());
    if (!fetchedRef.current) {
      fetchedRef.current = true;
      fetch("/hq/api/search-index")
        .then((res) => (res.ok ? res.json() : { records: [] }))
        .then((data: { records?: IndexRecord[] }) => setRecords(data.records ?? []))
        .catch(() => {
          /* rooms still work without the record index */
        });
    }
    setOpen(true);
  }, []);

  // Global ⌘K / Ctrl-K toggle.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && (e.key === "k" || e.key === "K")) {
        e.preventDefault();
        if (open) close();
        else openPalette();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close, openPalette]);

  useEffect(() => {
    if (open) requestAnimationFrame(() => inputRef.current?.focus());
  }, [open]);

  // Keep the active row in view.
  useEffect(() => {
    if (!open) return;
    const el = listRef.current?.querySelector<HTMLElement>('[data-active="true"]');
    el?.scrollIntoView({ block: "nearest" });
  }, [active, open]);

  // Expose an opener for the visible ⌘K trigger in the nav.
  useEffect(() => {
    window.addEventListener("hq:open-palette", openPalette);
    return () => window.removeEventListener("hq:open-palette", openPalette);
  }, [openPalette]);

  if (!open) return null;

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      close();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(results.length - 1, a + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(0, a - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const pick = results[active];
      if (pick) go(pick.href);
    }
  };

  return (
    <div className="hq-cmdk" role="presentation" onMouseDown={close}>
      <div
        className="hq-cmdk-panel"
        role="dialog"
        aria-modal="true"
        aria-label="Jump anywhere in HQ"
        onMouseDown={(e) => e.stopPropagation()}
        onKeyDown={onKeyDown}
      >
        <div className="hq-cmdk-search">
          <span className="hq-cmdk-prompt" aria-hidden="true">
            jump to<span className="hq-cmdk-prompt-dot">.</span>
          </span>
          <input
            ref={inputRef}
            className="hq-cmdk-input"
            placeholder="a room, a decision, a document…"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActive(0);
            }}
            autoComplete="off"
            spellCheck={false}
          />
          <kbd className="hq-cmdk-esc">esc</kbd>
        </div>

        <ul className="hq-cmdk-list" ref={listRef} role="listbox" aria-label="Destinations">
          {results.length === 0 ? (
            <li className="hq-cmdk-empty">Nothing here by that name.</li>
          ) : (
            results.map((entry, i) => (
              <li key={`${entry.href}·${entry.label}`} role="option" aria-selected={i === active}>
                <button
                  type="button"
                  className="hq-cmdk-row"
                  data-active={i === active ? "true" : undefined}
                  onMouseMove={() => setActive(i)}
                  onClick={() => go(entry.href)}
                >
                  <span className="hq-cmdk-row-label">{entry.label}</span>
                  <span className="hq-cmdk-row-hint">{entry.hint}</span>
                </button>
              </li>
            ))
          )}
        </ul>

        <div className="hq-cmdk-foot">
          <span><kbd>↑</kbd><kbd>↓</kbd> move</span>
          <span><kbd>⏎</kbd> open</span>
          <span><kbd>esc</kbd> close</span>
        </div>
      </div>
    </div>
  );
}
