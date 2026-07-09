"use client";

import { useTransition } from "react";
import { reconcileNowAction } from "./actions";

/** Run the reconcile-and-compensate job on demand: repairs
 *  code-redeemed-but-no-entitlement orphans and refreshes drift. */
export function ReconcileButton() {
  const [pending, start] = useTransition();
  return (
    <button
      type="button"
      onClick={() => start(async () => reconcileNowAction())}
      disabled={pending}
      className="rounded border border-border-soft bg-bg px-3 py-1.5 text-[12px] font-medium text-ink-soft transition hover:text-ink disabled:opacity-50"
    >
      {pending ? "Reconciling…" : "Reconcile now"}
    </button>
  );
}
