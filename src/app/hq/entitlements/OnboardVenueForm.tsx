"use client";

import { useActionState } from "react";
import { onboardVenueAction, type OnboardResult } from "./actions";

const PLANS: Array<{ value: string; label: string }> = [
  { value: "founding", label: "Founding (paid)" },
  { value: "paid", label: "Paid" },
  { value: "pilot", label: "Pilot (no cash)" },
];

/** Create a venue and record its payment, term, and allotment in one step —
 *  the no-terminal replacement for the venue CLI scripts. */
export function OnboardVenueForm() {
  const [state, action, pending] = useActionState<OnboardResult | null, FormData>(
    onboardVenueAction,
    null,
  );

  return (
    <form action={action} className="grid gap-3 rounded-md border border-border-soft bg-bg-elev p-4">
      <div className="grid gap-3 md:grid-cols-2">
        <label className="grid gap-1 text-[12px]">
          <span className="font-medium text-ink">Venue name</span>
          <input
            name="name"
            required
            placeholder="Lamb's Hill"
            className="h-9 rounded border border-border-soft bg-bg px-2 text-[12.5px] outline-none focus:border-accent"
          />
        </label>
        <label className="grid gap-1 text-[12px]">
          <span className="font-medium text-ink">Contact email</span>
          <input
            name="contactEmail"
            type="email"
            required
            placeholder="events@lambshill.ie"
            className="h-9 rounded border border-border-soft bg-bg px-2 text-[12.5px] outline-none focus:border-accent"
          />
        </label>
      </div>

      <div className="grid gap-3 md:grid-cols-4">
        <label className="grid gap-1 text-[12px]">
          <span className="font-medium text-ink">Plan</span>
          <select
            name="venuePlan"
            defaultValue="founding"
            className="h-9 rounded border border-border-soft bg-bg px-2 text-[12.5px] outline-none focus:border-accent"
          >
            {PLANS.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-1 text-[12px]">
          <span className="font-medium text-ink">Allotment</span>
          <input
            name="allotment"
            type="number"
            min={1}
            required
            defaultValue={10}
            className="h-9 rounded border border-border-soft bg-bg px-2 text-[12.5px] outline-none focus:border-accent"
          />
        </label>
        <label className="grid gap-1 text-[12px]">
          <span className="font-medium text-ink">Annual (EUR)</span>
          <input
            name="annualAmountEur"
            type="number"
            min={0}
            step="0.01"
            placeholder="0.00"
            className="h-9 rounded border border-border-soft bg-bg px-2 text-[12.5px] outline-none focus:border-accent"
          />
        </label>
        <label className="grid gap-1 text-[12px]">
          <span className="font-medium text-ink">Term (months)</span>
          <input
            name="termMonths"
            type="number"
            min={1}
            defaultValue={12}
            className="h-9 rounded border border-border-soft bg-bg px-2 text-[12.5px] outline-none focus:border-accent"
          />
        </label>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="h-9 justify-self-start rounded px-4 text-[12.5px] font-medium text-white transition disabled:opacity-50"
        style={{ background: "var(--accent)" }}
      >
        {pending ? "Onboarding…" : "Onboard venue"}
      </button>

      {state && "ok" in state ? (
        <p className="text-[12px] text-ink-soft">
          {state.created ? "Created" : "Updated"} {state.slug}
          {state.paid ? ", marked paid" : ""}. Mint its codes below.
        </p>
      ) : state && "error" in state ? (
        <p className="text-[12px]" style={{ color: "var(--rose, #9f1239)" }}>
          {state.error}
        </p>
      ) : null}
    </form>
  );
}
