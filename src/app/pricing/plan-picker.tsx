"use client";

import Link from "next/link";
import { useState } from "react";

export type PricingPlan = Readonly<{
  id: "free" | "student" | "pro" | "enterprise";
  useCase: string;
  name: string;
  price: string;
  cadence: string;
  summary: string;
  facts: readonly Readonly<{ label: string; value: string }>[];
  cta: string;
  href: string;
  recommended?: boolean;
}>;

export function PlanPicker({ plans }: { plans: readonly PricingPlan[] }) {
  const [selectedId, setSelectedId] = useState<PricingPlan["id"]>("pro");
  const selected = plans.find((plan) => plan.id === selectedId) ?? plans[0];

  return (
    <div>
      <div
        className="grid grid-cols-2 gap-2 md:grid-cols-4"
        data-delight="pricing-plans"
        data-delight-once
        role="group"
        aria-label="Choose what you are planning"
      >
        {plans.map((plan) => {
          const active = plan.id === selected.id;
          return (
            <div key={plan.id}>
              <button
                type="button"
                aria-pressed={active}
                className={`group flex min-h-[86px] w-full flex-col justify-between rounded-xl border p-3 text-left transition-[border-color,background-color,transform] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent md:min-h-[104px] md:p-4 ${
                  active
                    ? "border-accent bg-[var(--accent-soft)] text-ink"
                    : "border-border-soft bg-white text-ink-soft hover:-translate-y-0.5 hover:border-[var(--ink-ghost)]"
                }`}
                onClick={() => setSelectedId(plan.id)}
              >
                <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-ink-soft">
                  {plan.useCase}
                </span>
                <span className="mt-3 flex w-full items-end justify-between gap-2">
                  <strong className="text-[15px] font-semibold text-ink">{plan.name}</strong>
                  <span className="font-mono text-[12px] text-ink-soft">{plan.price}</span>
                </span>
              </button>
            </div>
          );
        })}
      </div>

      <article
        className="mt-5 overflow-hidden rounded-2xl border border-border-soft bg-white shadow-[0_24px_60px_-44px_rgba(15,23,42,0.45)]"
        aria-live="polite"
        aria-labelledby={`selected-${selected.id}`}
      >
        <div className="grid gap-8 p-6 md:grid-cols-[minmax(0,1fr)_auto] md:items-start md:p-8">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-[clamp(1.6rem,1.25rem+1vw,2.2rem)] font-semibold tracking-[-0.035em] text-ink" id={`selected-${selected.id}`}>
                {selected.name}
              </h3>
              {selected.recommended ? (
                <span className="rounded-full bg-accent px-2.5 py-1 text-[11px] font-semibold text-white">
                  Best for ongoing work
                </span>
              ) : null}
            </div>
            <p className="mt-3 max-w-[58ch] text-[15px] leading-7 text-ink-soft">{selected.summary}</p>
            <dl className="mt-6 grid gap-3 sm:grid-cols-3">
              {selected.facts.map((fact) => (
                <div className="min-w-0 rounded-lg bg-[var(--paper-soft)] p-3" key={fact.label}>
                  <dt className="text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-faint">{fact.label}</dt>
                  <dd className="mt-1 [overflow-wrap:anywhere] text-[13px] leading-5 text-ink">{fact.value}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="flex min-w-[190px] flex-col md:items-end">
            <span className="text-[clamp(2.2rem,1.8rem+1.5vw,3.2rem)] font-semibold tracking-[-0.055em] text-ink">{selected.price}</span>
            <span className="mt-1 text-[12px] text-ink-quiet">{selected.cadence}</span>
            <Link
              className="mt-5 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-accent px-5 text-[14px] font-semibold text-white no-underline transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent md:w-auto"
              href={selected.href}
            >
              {selected.cta}
            </Link>
            <span className="mt-2 text-center text-[11px] leading-4 text-ink-faint md:text-right">
              {selected.id === "enterprise" ? "A person will reply." : "Waitlist only. No charge today."}
            </span>
          </div>
        </div>
      </article>
    </div>
  );
}
