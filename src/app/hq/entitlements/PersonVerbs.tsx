"use client";

import { useState } from "react";
import { repointAction, viewAsAction } from "./actions";

/** Enter the read-only "view as" surface for this person. The click is logged
 *  as a view_as event before the read-only view opens. */
export function ViewAsButton({ clerkId }: { clerkId: string }) {
  return (
    <form action={viewAsAction}>
      <input type="hidden" name="clerkId" value={clerkId} />
      <button
        type="submit"
        className="rounded border border-border-soft bg-bg px-3 py-1.5 text-[12px] font-medium text-ink-soft transition hover:text-ink"
      >
        View as (read-only)
      </button>
    </form>
  );
}

/** Re-point this person's live access onto another Clerk id after an account
 *  merge. Type REPOINT to arm; the server re-checks the confirm word. */
export function RepointForm({ fromClerkId }: { fromClerkId: string }) {
  const [open, setOpen] = useState(false);
  const [to, setTo] = useState("");
  const [reason, setReason] = useState("");
  const [confirm, setConfirm] = useState("");
  const armed =
    confirm === "REPOINT" && reason.trim().length > 0 && to.trim().length > 0 && to.trim() !== fromClerkId;

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded border border-border-soft bg-bg px-3 py-1.5 text-[12px] font-medium text-ink-soft transition hover:text-ink"
      >
        Re-point access
      </button>
    );
  }

  return (
    <form action={repointAction} className="grid max-w-[420px] gap-2 rounded border border-border-soft bg-bg p-3">
      <input type="hidden" name="fromClerkId" value={fromClerkId} />
      <p className="text-[11.5px] text-ink-soft">
        Move all live access from this id to another. History stays under the old id.
      </p>
      <input
        name="toClerkId"
        value={to}
        onChange={(e) => setTo(e.target.value)}
        placeholder="live user_… to move access to"
        className="h-8 rounded border border-border-soft bg-bg-elev px-2 font-mono text-[11.5px] outline-none focus:border-accent"
      />
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
        placeholder="type REPOINT"
        className="h-8 rounded border border-border-soft bg-bg-elev px-2 font-mono text-[11.5px] outline-none focus:border-accent"
      />
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={!armed}
          className="h-8 rounded border border-border-soft bg-bg-elev px-3 text-[11.5px] font-medium text-ink transition disabled:opacity-40"
        >
          Re-point
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
