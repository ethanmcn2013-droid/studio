"use client";

import { useState } from "react";
import { revokeRowAction, revokeAllAction } from "./actions";

/** Revoke one row. Graduated friction: the button opens the form; the row is
 *  restated; a reason is required; the operator must type REVOKE to arm the
 *  submit. The server re-checks the confirm word, so it can't be skipped. */
export function RevokeRow({
  entitlementId,
  lookup,
  tierLabel,
  source,
}: {
  entitlementId: string;
  lookup: string;
  tierLabel: string;
  source: string;
}) {
  const [open, setOpen] = useState(false);
  const [confirm, setConfirm] = useState("");
  const [reason, setReason] = useState("");
  const armed = confirm === "REVOKE" && reason.trim().length > 0;

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded border border-border-soft bg-bg px-2 py-1 text-[11px] font-medium text-ink-soft transition hover:text-ink"
      >
        Revoke
      </button>
    );
  }

  return (
    <form action={revokeRowAction} className="grid gap-2 rounded border border-border-soft bg-bg p-3 text-left">
      <input type="hidden" name="entitlementId" value={entitlementId} />
      <input type="hidden" name="lookup" value={lookup} />
      <p className="text-[11.5px] text-ink-soft">
        Revoke {tierLabel} ({source}) for cause. The row is kept and marked revoked, so it can be
        reinstated.
      </p>
      <input
        name="reason"
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        placeholder="reason (required)"
        className="h-8 rounded border border-border-soft bg-bg-elev px-2 text-[11.5px] outline-none focus:border-accent"
      />
      <input
        name="confirm"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        placeholder="type REVOKE"
        className="h-8 rounded border border-border-soft bg-bg-elev px-2 font-mono text-[11.5px] outline-none focus:border-accent"
      />
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={!armed}
          className="h-8 rounded border border-border-soft bg-bg-elev px-3 text-[11.5px] font-medium text-ink transition disabled:opacity-40"
        >
          Revoke row
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="h-8 rounded px-3 text-[11.5px] text-ink-quiet"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

/** Revoke every active row for a person at once. Higher friction: type
 *  REVOKE ALL. The server gathers the frozen active-id set and commits them
 *  as one drift-guarded bulk revoke. */
export function RevokeAll({ clerkId, activeCount }: { clerkId: string; activeCount: number }) {
  const [open, setOpen] = useState(false);
  const [confirm, setConfirm] = useState("");
  const [reason, setReason] = useState("");
  const armed = confirm === "REVOKE ALL" && reason.trim().length > 0;

  if (activeCount === 0) return null;

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded border border-border-soft bg-bg px-3 py-1.5 text-[12px] font-medium text-ink-soft transition hover:text-ink"
      >
        Revoke all access ({activeCount})
      </button>
    );
  }

  return (
    <form action={revokeAllAction} className="grid max-w-[380px] gap-2 rounded border border-border-soft bg-bg p-3">
      <input type="hidden" name="clerkId" value={clerkId} />
      <p className="text-[11.5px] text-ink-soft">
        Revoke all {activeCount} active rows for this person. Each is kept and marked revoked.
      </p>
      <input
        name="reason"
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        placeholder="reason (required)"
        className="h-8 rounded border border-border-soft bg-bg-elev px-2 text-[11.5px] outline-none focus:border-accent"
      />
      <input
        name="confirm"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        placeholder="type REVOKE ALL"
        className="h-8 rounded border border-border-soft bg-bg-elev px-2 font-mono text-[11.5px] outline-none focus:border-accent"
      />
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={!armed}
          className="h-8 rounded border border-border-soft bg-bg-elev px-3 text-[11.5px] font-medium text-ink transition disabled:opacity-40"
        >
          Revoke all
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="h-8 rounded px-3 text-[11.5px] text-ink-quiet"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
