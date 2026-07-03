"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * HqStatusDot, the company's pulse, made global.
 *
 * Signal Studio's whole identity is one dot. This makes it alive: its
 * colour is the verdict (the same one the masthead derives), its slow
 * breath says "this is fresh", and hovering/focusing it expands the one
 * line that is the company right now, then it collapses again. No new
 * page, no panel.
 *
 * Brand language matches the masthead exactly:
 *   calm      → ink     (nothing owes you an answer)
 *   one-thing → indigo  (exactly one thing matters)
 *   on-fire   → red     (acute, costing you now)
 *
 * It reads the authed /hq/status. A 401/“locked” simply leaves the dot
 * idle (a quiet hairline ring), it never invents a verdict it can't read.
 * Reduced-motion holds the colour with no breath; meaning survives.
 */

type Level = "calm" | "one-thing" | "on-fire";
type Status =
  | { state: "idle" }
  | { state: "ok"; level: Level; headline: string; action: string; actionHref: string | null; generatedAt: string };

export function HqStatusDot() {
  const pathname = usePathname();
  const [status, setStatus] = useState<Status>({ state: "idle" });
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let alive = true;
    fetch("/hq/status", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (!alive || !d || d.error) return;
        setStatus({
          state: "ok",
          level: d.level,
          headline: d.headline,
          action: d.action,
          actionHref: d.actionHref,
          generatedAt: d.generatedAt,
        });
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
    // Re-read when the room changes, the verdict can move as you work.
  }, [pathname]);

  const level = status.state === "ok" ? status.level : null;

  const hoverOpen = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(true);
  };
  const hoverClose = () => {
    closeTimer.current = setTimeout(() => setOpen(false), 120);
  };

  const stamp =
    status.state === "ok"
      ? new Date(status.generatedAt).toLocaleTimeString("en-IE", {
          hour: "2-digit",
          minute: "2-digit",
        })
      : null;

  return (
    <div
      className="hq-statusdot"
      data-level={level ?? "idle"}
      data-open={open ? "true" : undefined}
      onMouseEnter={hoverOpen}
      onMouseLeave={hoverClose}
    >
      <button
        type="button"
        className="hq-statusdot-btn"
        aria-label={
          status.state === "ok"
            ? `Company status: ${status.headline}`
            : "Company status"
        }
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        onFocus={hoverOpen}
        onBlur={hoverClose}
      >
        <span className="hq-statusdot-dot" aria-hidden="true" />
      </button>

      {open && status.state === "ok" ? (
        <div className="hq-statusdot-pop" role="status">
          <span className="hq-statusdot-pop-level" data-level={status.level}>
            {status.level === "on-fire"
              ? "on fire"
              : status.level === "one-thing"
                ? "one thing"
                : "calm"}
          </span>
          <p className="hq-statusdot-pop-headline">{status.headline}</p>
          {status.actionHref ? (
            <Link href={status.actionHref} className="hq-statusdot-pop-action">
              {status.action}
            </Link>
          ) : (
            <p className="hq-statusdot-pop-action">{status.action}</p>
          )}
          {stamp ? <span className="hq-statusdot-pop-stamp">derived {stamp}</span> : null}
        </div>
      ) : null}
    </div>
  );
}
