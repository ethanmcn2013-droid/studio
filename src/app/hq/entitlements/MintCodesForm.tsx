"use client";

import { useActionState } from "react";
import { mintCodesAction, type MintResult } from "./actions";

const PLANS = ["Event", "Pro", "Student"] as const;

/** Mint codes for one venue. The server enforces the allotment cap with a
 *  race-safe conditional decrement, so an over-mint is refused there. */
export function MintCodesForm({
  sponsorId,
  sponsorName,
  remaining,
}: {
  sponsorId: string;
  sponsorName: string;
  remaining: number | null;
}) {
  const [state, action, pending] = useActionState<MintResult | null, FormData>(
    mintCodesAction,
    null,
  );

  return (
    <form action={action} className="flex flex-wrap items-end gap-2">
      <input type="hidden" name="sponsorId" value={sponsorId} />
      <label className="grid gap-1 text-[11px]">
        <span className="text-ink-quiet">Count</span>
        <input
          name="count"
          type="number"
          min={1}
          defaultValue={1}
          className="h-8 w-20 rounded border border-border-soft bg-bg px-2 text-[12px] outline-none focus:border-accent"
        />
      </label>
      <label className="grid gap-1 text-[11px]">
        <span className="text-ink-quiet">Plan</span>
        <select
          name="marketingTier"
          defaultValue="Event"
          className="h-8 rounded border border-border-soft bg-bg px-2 text-[12px] outline-none focus:border-accent"
        >
          {PLANS.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </label>
      <label className="grid gap-1 text-[11px]">
        <span className="text-ink-quiet">Days</span>
        <input
          name="durationDays"
          type="number"
          min={1}
          defaultValue={365}
          className="h-8 w-20 rounded border border-border-soft bg-bg px-2 text-[12px] outline-none focus:border-accent"
        />
      </label>
      <button
        type="submit"
        disabled={pending}
        className="h-8 rounded border border-border-soft bg-bg px-3 text-[12px] font-medium text-ink transition hover:border-accent disabled:opacity-50"
      >
        {pending ? "Minting…" : "Mint"}
      </button>
      {state && "ok" in state ? (
        <span className="text-[11.5px] text-ink-soft">Minted {state.minted} for {sponsorName}.</span>
      ) : state && "error" in state ? (
        <span className="text-[11.5px]" style={{ color: "var(--status-blocked)" }}>
          {state.error}
        </span>
      ) : remaining != null ? (
        <span className="text-[11px] text-ink-quiet">{remaining} of allotment remaining</span>
      ) : null}
    </form>
  );
}
