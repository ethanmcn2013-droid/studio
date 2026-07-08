"use client";

/**
 * Waitlist lab switcher. Review-only showroom, three directions for the
 * public /waitlist page. A fixed top bar toggles between them full-bleed
 * so the founder can compare on-brand candidates before one is wired to
 * the real server action. Not linked from anywhere; noindex.
 */

import { useState } from "react";
import Link from "next/link";
import { DirectionDoorway } from "./DirectionDoorway";
import { DirectionLine } from "./DirectionLine";
import { DirectionOneThing } from "./DirectionOneThing";

const DIRECTIONS = [
  { key: "doorway", label: "A · The Doorway", note: "editorial, launch-date forward" },
  { key: "line", label: "B · The Line", note: "the dot becomes the queue" },
  { key: "onething", label: "C · One thing, first", note: "radical minimal" },
] as const;

type Key = (typeof DIRECTIONS)[number]["key"];

export function WaitlistLab() {
  const [active, setActive] = useState<Key>("doorway");

  return (
    <>
      <div className="wl-bar">
        <div className="wl-bar-left">
          <span className="wl-bar-tag">Waitlist lab</span>
          <span className="wl-bar-note">
            {DIRECTIONS.find((d) => d.key === active)?.note}
          </span>
        </div>
        <div className="wl-bar-switch" role="tablist" aria-label="Waitlist directions">
          {DIRECTIONS.map((d) => (
            <button
              key={d.key}
              role="tab"
              aria-selected={active === d.key}
              data-active={active === d.key}
              onClick={() => setActive(d.key)}
            >
              {d.label}
            </button>
          ))}
        </div>
        <Link href="/waitlist" className="wl-bar-current" target="_blank">
          Current &rarr;
        </Link>
      </div>

      <div className="wl-stage">
        {active === "doorway" ? <DirectionDoorway /> : null}
        {active === "line" ? <DirectionLine /> : null}
        {active === "onething" ? <DirectionOneThing /> : null}
      </div>

      <style>{`
        .wl-bar {
          position: sticky;
          top: 0;
          z-index: 40;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          flex-wrap: wrap;
          padding: 10px 18px;
          border-bottom: 1px solid var(--border);
          background: color-mix(in srgb, var(--bg-elev) 88%, transparent);
          backdrop-filter: blur(10px);
        }
        .wl-bar-left { display: flex; align-items: baseline; gap: 12px; min-width: 0; }
        .wl-bar-tag {
          color: var(--ink);
          font-family: var(--font-mono);
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }
        .wl-bar-note {
          color: var(--ink-quiet);
          font-size: 12px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .wl-bar-switch {
          display: flex;
          gap: 4px;
          padding: 3px;
          border: 1px solid var(--border-soft);
          border-radius: 999px;
          background: var(--bg);
        }
        .wl-bar-switch button {
          padding: 6px 14px;
          border: 0;
          border-radius: 999px;
          background: transparent;
          color: var(--ink-quiet);
          font-size: 12px;
          font-weight: 500;
          white-space: nowrap;
          cursor: pointer;
          transition: background var(--motion-base) var(--ease-out), color var(--motion-base) var(--ease-out);
        }
        .wl-bar-switch button:hover { color: var(--ink); }
        .wl-bar-switch button[data-active="true"] {
          background: var(--ink);
          color: var(--bg-elev);
        }
        .wl-bar-current {
          color: var(--ink-quiet);
          font-family: var(--font-mono);
          font-size: 11px;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          text-decoration: none;
          transition: color var(--motion-base) var(--ease-out);
        }
        .wl-bar-current:hover { color: var(--accent); }
        @media (max-width: 680px) {
          .wl-bar-note { display: none; }
          .wl-bar-switch button { padding: 6px 10px; font-size: 11px; }
        }
      `}</style>
    </>
  );
}
