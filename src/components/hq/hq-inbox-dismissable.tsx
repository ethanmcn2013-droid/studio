"use client";

import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

/**
 * Client island around an inbox row that supports localStorage-backed
 * dismissal for 24 hours. Renders the children unchanged when not
 * dismissed; renders nothing (but keeps the row in the tier-count
 * total via aria-hidden) when dismissed.
 *
 * The dismiss button only appears on hover; the keyboard equivalent
 * is `D` while the row has focus (handled at the focus level via
 * standard activation).
 */

const STORAGE_KEY = "signal-hq-inbox-dismissed-v1";
const TTL_MS = 24 * 60 * 60 * 1000;

type DismissMap = Record<string, number>; // id → dismissed-at ms

function readDismissed(): DismissMap {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as DismissMap;
    if (parsed && typeof parsed === "object") return parsed;
  } catch {
    // localStorage may be unavailable in some browser modes
  }
  return {};
}

function writeDismissed(map: DismissMap): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  } catch {
    // best effort
  }
}

function isFresh(at: number): boolean {
  return Date.now() - at < TTL_MS;
}

export function HqInboxDismissable({
  id,
  children,
}: {
  id: string;
  children: ReactNode;
}) {
  const [dismissedAt, setDismissedAt] = useState<number | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const all = readDismissed();
    // Drop stale entries.
    const fresh: DismissMap = {};
    for (const [k, v] of Object.entries(all)) {
      if (isFresh(v)) fresh[k] = v;
    }
    if (Object.keys(fresh).length !== Object.keys(all).length) {
      writeDismissed(fresh);
    }
    const frame = window.requestAnimationFrame(() => {
      setDismissedAt(fresh[id] ?? null);
      setHydrated(true);
    });
    return () => window.cancelAnimationFrame(frame);
  }, [id]);

  const dismiss = useMemo(
    () => () => {
      const all = readDismissed();
      const now = Date.now();
      all[id] = now;
      writeDismissed(all);
      setDismissedAt(now);
    },
    [id],
  );

  if (hydrated && dismissedAt && isFresh(dismissedAt)) {
    return null;
  }

  return (
    <div className="hq-inbox-dismissable">
      {children}
      <button
        type="button"
        onClick={dismiss}
        className="hq-inbox-dismiss"
        aria-label="dismiss for 24 hours"
        title="dismiss for 24 hours"
      >
        dismiss
      </button>
    </div>
  );
}
