"use client";

import { useActionState, useState } from "react";
import { onboardVenueAction, type OnboardResult } from "./actions";
import {
  VENUE_EDITION_ANNUAL_PRICE_EUR,
  VENUE_EDITION_FOUNDING_ANNUAL_PRICE_EUR,
} from "@/lib/venue-edition";
import { fairUseCeilingFor } from "@/lib/venue-allotment";

const PLANS: Array<{ value: string; label: string }> = [
  { value: "founding", label: "Founding agreement" },
  { value: "paid", label: "Standard agreement" },
  { value: "pilot", label: "Pilot (no cash)" },
];

const MODES: Array<{ value: string; label: string }> = [
  { value: "unlimited", label: "Unlimited — every booked couple" },
  { value: "limited", label: "Limited — fixed allotment" },
];

/** Provision a venue's intended plan, term and issuance. Payment is separate.
 *
 *  Issuance defaults to unlimited, which is the ratified Venue Edition
 *  entitlement (D-020). It used to be a required number defaulting to ten, so
 *  ten was every venue's real entitlement against a page promising no seats. */
export function OnboardVenueForm() {
  const [state, action, pending] = useActionState<OnboardResult | null, FormData>(
    onboardVenueAction,
    null,
  );
  const [mode, setMode] = useState("unlimited");
  const [weddingCount, setWeddingCount] = useState("");
  const unlimited = mode === "unlimited";
  const parsedCount = weddingCount ? Number.parseInt(weddingCount, 10) : null;

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
          <span className="font-medium text-ink">Issuance</span>
          <select
            name="allotmentMode"
            value={mode}
            onChange={(event) => setMode(event.target.value)}
            className="h-9 rounded border border-border-soft bg-bg px-2 text-[12.5px] outline-none focus:border-accent"
          >
            {MODES.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
        </label>
        {unlimited ? (
          <label className="grid gap-1 text-[12px]">
            <span className="font-medium text-ink">Weddings a year</span>
            <input
              name="annualWeddingCount"
              type="number"
              min={0}
              value={weddingCount}
              onChange={(event) => setWeddingCount(event.target.value)}
              placeholder="asked after signature"
              className="h-9 rounded border border-border-soft bg-bg px-2 text-[12.5px] outline-none focus:border-accent"
            />
          </label>
        ) : (
          <label className="grid gap-1 text-[12px]">
            <span className="font-medium text-ink">Allotment</span>
            <input
              name="allotment"
              type="number"
              min={1}
              required
              className="h-9 rounded border border-border-soft bg-bg px-2 text-[12.5px] outline-none focus:border-accent"
            />
          </label>
        )}
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

      <div className="grid gap-1 text-[12px]">
        <span className="font-medium text-ink">Commercial terms</span>
        <div className="rounded border border-border-soft bg-bg px-2 py-2 text-[12.5px] text-ink-soft">
          Founding: €{VENUE_EDITION_FOUNDING_ANNUAL_PRICE_EUR.toLocaleString("en-IE")} / year ·
          standard: €{VENUE_EDITION_ANNUAL_PRICE_EUR.toLocaleString("en-IE")} / year · pilot: no cash.
          Both prices include VAT at the prevailing rate.
          Choosing a plan does not record payment. Record cleared payment separately.
        </div>
        {unlimited ? (
          <p className="text-[11.5px] text-ink-quiet">
            Fair-use ceiling {fairUseCeilingFor(parsedCount)} for this term. It alerts
            Signal HQ and keeps issuing. It never caps issuance, never sets the price,
            and never changes at renewal.
          </p>
        ) : null}
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
          {state.paid ? ", previous payment retained" : ", no payment recorded"}
          {state.allotmentMode === "unlimited"
            ? `, unlimited issuance (fair-use ceiling ${state.fairUseCeiling})`
            : ""}
          . Review its access below.
        </p>
      ) : state && "error" in state ? (
        <p className="text-[12px]" style={{ color: "var(--status-blocked)" }}>
          {state.error}
        </p>
      ) : null}
    </form>
  );
}
