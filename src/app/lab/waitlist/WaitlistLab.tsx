"use client";

/**
 * Waitlist lab. The Line is locked, so this is now a single-direction
 * review frame: a slim bar (with a Current link to compare against the
 * shipped /waitlist) over the on-system Line. Review-only, noindex.
 */

import Link from "next/link";
import { DirectionLine } from "./DirectionLine";

export function WaitlistLab() {
  return (
    <>
      <div className="wl-bar">
        <div className="wl-bar-left">
          <span className="wl-bar-tag">Waitlist lab</span>
          <span className="wl-bar-note">The Line · on-system · design pass 3</span>
        </div>
        <Link href="/waitlist" className="wl-bar-current" target="_blank">
          Current &rarr;
        </Link>
      </div>

      <DirectionLine />

      <style>{`
        .wl-bar {
          position: sticky;
          top: 0;
          z-index: 40;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          padding: 10px 18px;
          border-bottom: 1px solid var(--border);
          background: var(--bg-elev);
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
        }
      `}</style>
    </>
  );
}
