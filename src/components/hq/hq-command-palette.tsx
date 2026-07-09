"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

/**
 * HqCommandPalette, ⌘K / Ctrl-K to reach any room without learning the IA.
 *
 * Navigation-only by design (safe, fast, no side effects): it jumps to the
 * rooms HQ already has. The registry is a static, client-safe list, the
 * deep operating modules (operating-system.ts, verdict.ts) are server-only,
 * and a palette should never drag those into the client bundle.
 *
 * Keyboard-first, in the brand register: paper surface, one indigo, hairline
 * dividers, mono eyebrows. Esc closes, ↑/↓ move, ⏎ opens. The whole point is
 * that the system is navigable in one keystroke, calm, not clever.
 */

type Room = {
  label: string;
  hint: string;
  href: string;
  /** extra words that should match this room when typed */
  keywords?: string;
};

// Curated, client-safe. Mirrors the rooms in operating-system.ts / HqShell.
const ROOMS: Room[] = [
  { label: "Home", hint: "the verdict + the rooms", href: "/hq", keywords: "dashboard start verdict" },
  { label: "Blueprint", hint: "the Founder Operating System map", href: "/hq/blueprint", keywords: "operating system north star map metrics" },
  { label: "Reporting", hint: "only the numbers that matter", href: "/hq/reporting", keywords: "metrics numbers traction kpi" },
  { label: "Data room", hint: "the one link for diligence", href: "/hq/data-room", keywords: "diligence lender investor due diligence data room launch countdown" },
  { label: "Financial model", hint: "projection · runway · unit economics", href: "/hq/financial-model", keywords: "finance model runway cac ltv revenue projection cash burn" },
  { label: "Cap table", hint: "ownership · share structure", href: "/hq/cap-table", keywords: "cap table equity shares ownership shareholders class a b founder circle" },
  { label: "Incorporation pack", hint: "CRO runbook + timeline", href: "/hq/incorporation", keywords: "incorporation cro company formation ltd limited registration constitution" },
  { label: "Demo film", hint: "hero product film scaffold", href: "/hq/demo-film", keywords: "demo film video motion storyboard remotion advert reel one wedding four views" },
  { label: "Loading review room", hint: "ten loading moments, one system", href: "/hq/loading-review", keywords: "loading loader skeleton dot wordmark suiteloader boundary motion spec review gallery specimens" },
  { label: "Copy Review", hint: "founder approval for every copy version", href: "/hq/copy-review", keywords: "copy founder approval content governance review queue guidance hall of fame" },
  { label: "CRM", hint: "the venue pipeline", href: "/hq/crm", keywords: "prospects pipeline outreach venues sales" },
  { label: "Marketing", hint: "the six-month plan", href: "/hq/marketing", keywords: "growth campaigns demand plan" },
  { label: "Market entry deck", hint: "70-slide go-to-market strategy", href: "/hq/market-entry", keywords: "deck slides gtm growth strategy presentation pitch" },
  { label: "Loan pack", hint: "the lender business plan deck", href: "/hq/loan-pack", keywords: "loan lender funding deck business plan facility" },
  { label: "Vault", hint: "every document the business runs on", href: "/hq/vault", keywords: "documents legal docs files" },
  { label: "Assets", hint: "brand kit, decks, exports", href: "/hq/assets", keywords: "brand deck press kit downloads" },
  { label: "Directors", hint: "the standing AI org", href: "/hq/org", keywords: "org chart directors people roles" },
  { label: "Atlas", hint: "how the systems connect", href: "/hq/atlas", keywords: "systems data flows crons architecture" },
  { label: "Atlas map", hint: "the living operating map, by lens", href: "/hq/atlas-map", keywords: "atlas map operating system lenses founder investor product design engineering ai launch overview mission control" },
  { label: "Access", hint: "grants, codes, venues, subscriptions", href: "/hq/entitlements", keywords: "access entitlements grants revoke codes redemptions venues subscriptions batches roster person licence license comp" },
  { label: "Partners", hint: "outreach + founder letters", href: "/hq/partners", keywords: "outreach letters venues sponsors" },
  { label: "Plan", hint: "the lender business plan", href: "/hq/plan", keywords: "business plan lender funding" },
  { label: "Founders Circle", hint: "the board / shareholder view", href: "/hq/founders-circle", keywords: "board shareholders circle investors" },
  { label: "Exit", hint: "back to signalstudio.ie", href: "/", keywords: "leave exit public site" },
];

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
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return ROOMS.map((r) => ({ r, s: score(r, q) }))
      .filter((x) => x.s > 0)
      .sort((a, b) => b.s - a.s)
      .map((x) => x.r);
  }, [query]);

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setActive(0);
  }, []);

  const go = useCallback(
    (href: string) => {
      close();
      router.push(href);
    },
    [close, router],
  );

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

  useEffect(() => {
    setActive(0);
  }, [query]);

  // Keep the active row in view.
  useEffect(() => {
    if (!open) return;
    const el = listRef.current?.querySelector<HTMLElement>('[data-active="true"]');
    el?.scrollIntoView({ block: "nearest" });
  }, [active, open]);

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
        aria-label="Jump to a room"
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
            placeholder="a room, a number, a document…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoComplete="off"
            spellCheck={false}
          />
          <kbd className="hq-cmdk-esc">esc</kbd>
        </div>

        <ul className="hq-cmdk-list" ref={listRef} role="listbox" aria-label="Rooms">
          {results.length === 0 ? (
            <li className="hq-cmdk-empty">Nothing here by that name.</li>
          ) : (
            results.map((room, i) => (
              <li key={room.href} role="option" aria-selected={i === active}>
                <button
                  type="button"
                  className="hq-cmdk-row"
                  data-active={i === active ? "true" : undefined}
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

        <div className="hq-cmdk-foot">
          <span><kbd>↑</kbd><kbd>↓</kbd> move</span>
          <span><kbd>⏎</kbd> open</span>
          <span><kbd>esc</kbd> close</span>
        </div>
      </div>
    </div>
  );
}
