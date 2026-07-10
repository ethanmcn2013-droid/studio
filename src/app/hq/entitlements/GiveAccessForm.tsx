"use client";

import { useActionState } from "react";
import { giveAccessAction, type GiveAccessResult } from "./actions";

const PLANS = ["Pro", "Event", "Student"] as const;

export function GiveAccessForm() {
  const [state, action, pending] = useActionState<GiveAccessResult | null, FormData>(
    giveAccessAction,
    null,
  );

  return (
    <form action={action} className="grid gap-3 rounded-md border border-border-soft bg-bg-elev p-4">
      <label className="grid gap-1 text-[12px]">
        <span className="font-medium text-ink">Clerk user ids</span>
        <textarea
          name="clerkIds"
          required
          rows={3}
          placeholder="user_… one per line, or comma-separated"
          className="rounded border border-border-soft bg-bg px-2 py-1.5 font-mono text-[11.5px] outline-none focus:border-accent"
        />
      </label>

      <div className="grid grid-cols-2 gap-3">
        <label className="grid gap-1 text-[12px]">
          <span className="font-medium text-ink">Plan</span>
          <select
            name="marketingTier"
            defaultValue="Pro"
            className="h-9 rounded border border-border-soft bg-bg px-2 text-[12.5px] outline-none focus:border-accent"
          >
            {PLANS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
          <span className="text-[10.5px] text-ink-quiet">Pro and Student both map to Workspace.</span>
        </label>
        <label className="grid gap-1 text-[12px]">
          <span className="font-medium text-ink">Expires in (days)</span>
          <input
            name="durationDays"
            type="number"
            min={1}
            defaultValue={365}
            placeholder="blank = no expiry"
            className="h-9 rounded border border-border-soft bg-bg px-2 text-[12.5px] outline-none focus:border-accent"
          />
        </label>
      </div>

      <label className="grid gap-1 text-[12px]">
        <span className="font-medium text-ink">Reason</span>
        <input
          name="reason"
          required
          placeholder="why this cohort gets access"
          className="h-9 rounded border border-border-soft bg-bg px-2 text-[12.5px] outline-none focus:border-accent"
        />
      </label>

      <label className="grid gap-1 text-[12px]">
        <span className="font-medium text-ink">Batch name (optional)</span>
        <input
          name="batchLabel"
          placeholder="e.g. Launch press, leave blank for one-off grants"
          className="h-9 rounded border border-border-soft bg-bg px-2 text-[12.5px] outline-none focus:border-accent"
        />
      </label>

      <button
        type="submit"
        disabled={pending}
        className="mt-1 h-9 rounded px-4 text-[12.5px] font-medium text-white transition disabled:opacity-50"
        style={{ background: "var(--accent)" }}
      >
        {pending ? "Granting…" : "Give access"}
      </button>

      {state && "ok" in state ? (
        <p className="text-[12px] text-ink-soft">
          {state.granted} granted, {state.existed} already had it
          {state.invalid.length > 0 ? `, ${state.invalid.length} skipped (not a user id)` : ""}
          {state.batchSlug ? ` · batch ${state.batchSlug}` : ""}.
        </p>
      ) : state && "error" in state ? (
        <p className="text-[12px]" style={{ color: "var(--status-blocked)" }}>
          {state.error}
        </p>
      ) : null}
    </form>
  );
}
