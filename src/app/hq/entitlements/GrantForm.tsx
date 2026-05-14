"use client";

import { useActionState } from "react";
import { grantAction, type GrantFormResult } from "./actions";

export function GrantForm({
  tiers,
  sources,
}: {
  tiers: readonly string[];
  sources: readonly string[];
}) {
  const [state, formAction, pending] = useActionState<
    GrantFormResult | null,
    FormData
  >(grantAction, null);

  return (
    <form action={formAction} className="grid gap-3 rounded-md border border-border-soft bg-bg-elev p-4">
      <label className="grid gap-1 text-[12px]">
        <span className="font-medium text-ink">Clerk user id</span>
        <input
          name="userClerkId"
          required
          placeholder="user_3DOp2C8JU8K9kLr0CwURikCNqyr"
          className="h-9 rounded border border-border-soft bg-bg px-2 font-mono text-[11.5px] outline-none focus:border-accent"
        />
      </label>

      <div className="grid grid-cols-2 gap-3">
        <label className="grid gap-1 text-[12px]">
          <span className="font-medium text-ink">Tier</span>
          <select
            name="tier"
            defaultValue="workspace"
            className="h-9 rounded border border-border-soft bg-bg px-2 text-[12.5px] outline-none focus:border-accent"
          >
            {tiers.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-1 text-[12px]">
          <span className="font-medium text-ink">Source</span>
          <select
            name="source"
            defaultValue="compliments"
            className="h-9 rounded border border-border-soft bg-bg px-2 text-[12.5px] outline-none focus:border-accent"
          >
            {sources.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <label className="grid gap-1 text-[12px]">
          <span className="font-medium text-ink">Ref (sourceRef)</span>
          <input
            name="sourceRef"
            placeholder="hq-2026-05-14-jane"
            className="h-9 rounded border border-border-soft bg-bg px-2 font-mono text-[11.5px] outline-none focus:border-accent"
          />
        </label>
        <label className="grid gap-1 text-[12px]">
          <span className="font-medium text-ink">Duration (days)</span>
          <input
            name="durationDays"
            type="number"
            min={1}
            placeholder="blank = perpetual"
            className="h-9 rounded border border-border-soft bg-bg px-2 text-[12.5px] outline-none focus:border-accent"
          />
        </label>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="mt-1 h-9 rounded bg-ink px-4 text-[12.5px] font-medium text-bg-elev transition disabled:opacity-50"
      >
        {pending ? "Granting…" : "Grant"}
      </button>

      {state && "ok" in state && state.ok ? (
        <p className="text-[12px] text-emerald-600">
          {state.created ? "Granted ✓" : "Already existed (no-op)"} · id {state.id}
        </p>
      ) : state && "error" in state ? (
        <p className="text-[12px] text-rose-600">{state.error}</p>
      ) : null}
    </form>
  );
}
