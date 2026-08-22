"use client";

import Link from "next/link";
import { useRef, type CSSProperties, type KeyboardEvent } from "react";
import styles from "./pricing.module.css";
import {
  usePricingSelection,
  type PricingPlanId,
} from "./pricing-selection";

export type { PricingPlanId } from "./pricing-selection";

export type PricingComparisonKey =
  | "bestFor"
  | "workspaces"
  | "editingGuests"
  | "price"
  | "access";

export type PricingPlan = Readonly<{
  id: PricingPlanId;
  useCase: string;
  name: string;
  price: string;
  cadence: string;
  fit: string;
  summary: string;
  facts: readonly Readonly<{ label: string; value: string }>[];
  window?: {
    kind: "forever" | "yearly" | "monthly";
    caption: string;
  };
  cta: string;
  href: string;
  microcopy: string;
  mobileSummary: string;
  comparison: Readonly<Record<PricingComparisonKey, string>>;
}>;

function nextIndexForKey(
  key: string,
  currentIndex: number,
  planCount: number,
): number | null {
  if (key === "Home") return 0;
  if (key === "End") return planCount - 1;
  if (key === "ArrowDown" || key === "ArrowRight") {
    return (currentIndex + 1) % planCount;
  }
  if (key === "ArrowUp" || key === "ArrowLeft") {
    return (currentIndex - 1 + planCount) % planCount;
  }
  return null;
}

export function PlanPicker({ plans }: { plans: readonly PricingPlan[] }) {
  const { selectedId, selectPlan } = usePricingSelection();
  const buttons = useRef<Array<HTMLButtonElement | null>>([]);

  function selectFromKeyboard(
    event: KeyboardEvent<HTMLButtonElement>,
    currentIndex: number,
  ) {
    const nextIndex = nextIndexForKey(event.key, currentIndex, plans.length);
    if (nextIndex === null) return;

    event.preventDefault();
    selectPlan(plans[nextIndex].id, buttons.current[nextIndex]);
    buttons.current[nextIndex]?.focus();
  }

  return (
    <div className={styles.ledger} data-pricing-ledger="">
      <div className={styles.ledgerHeader} aria-hidden="true">
        <span>Best for</span>
        <span>Plan</span>
        <span>Fit</span>
        <span>Price</span>
        <span>Choose</span>
      </div>

      <div role="group" aria-label="Choose a Signal Studio plan">
        {plans.map((plan, index) => {
          const active = plan.id === selectedId;
          const panelId = `pricing-plan-${plan.id}-details`;
          const buttonId = `pricing-plan-${plan.id}`;

          return (
            <div
              className={styles.planEntry}
              data-selected={active ? "true" : undefined}
              key={plan.id}
            >
              <button
                aria-controls={active ? panelId : undefined}
                aria-expanded={active}
                className={styles.planRow}
                id={buttonId}
                onClick={(event) => selectPlan(plan.id, event.currentTarget)}
                onKeyDown={(event) => selectFromKeyboard(event, index)}
                ref={(element) => {
                  buttons.current[index] = element;
                }}
                type="button"
              >
                <span className={styles.planUseCase}>{plan.useCase}</span>
                <strong className={styles.planName}>{plan.name}</strong>
                <span className={styles.planFit}>{plan.fit}</span>
                <span className={styles.planPrice}>
                  <strong>{plan.price}</strong>
                  <span>{plan.cadence}</span>
                </span>
                <span className={styles.planRowAction}>
                  <span>{active ? "Selected" : "View details"}</span>
                  <span aria-hidden="true" className={styles.planChevron} />
                </span>
              </button>

              {active ? (
                <section
                  aria-labelledby={buttonId}
                  className={styles.planPanel}
                  data-pricing-panel=""
                  id={panelId}
                  role="region"
                >
                  <div className={styles.planPanelCopy}>
                    <p className={styles.planPanelLabel}>{plan.name}</p>
                    <h3>{plan.summary}</h3>
                  </div>

                  <dl className={styles.planFacts}>
                    {plan.facts.map((fact) => (
                      <div key={fact.label}>
                        <dt>{fact.label}</dt>
                        <dd>{fact.value}</dd>
                      </div>
                    ))}
                  </dl>

                  {plan.window ? (
                    <div
                      className={styles.windowRail}
                      aria-hidden="true"
                      data-window-kind={plan.window.kind}
                    >
                      <span className={styles.windowTrack}>
                        {Array.from(
                          {
                            length:
                              plan.window.kind === "forever" ? 1 : 12,
                          },
                          (_, cell) => (
                            <span
                              key={cell}
                              style={{ "--cell": cell } as CSSProperties}
                            />
                          ),
                        )}
                      </span>
                      <p className={styles.windowCaption}>
                        {plan.window.caption}
                      </p>
                    </div>
                  ) : null}

                  <div className={styles.planDecision}>
                    <div className={styles.planPanelPrice}>
                      <strong>{plan.price}</strong>
                      <span>{plan.cadence}</span>
                    </div>
                    <Link
                      className={styles.planCta}
                      href={plan.href}
                      prefetch={false}
                    >
                      {plan.cta}
                    </Link>
                    <p>{plan.microcopy}</p>
                  </div>
                </section>
              ) : null}
            </div>
          );
        })}
      </div>

      <p className={styles.ledgerHint}>Your choice is not final.</p>

      <noscript>
        <div className={styles.noScriptPlans}>
          <p>Plan details and next steps</p>
          <ul>
            {plans.map((plan) => (
              <li key={plan.id}>
                <strong>{plan.name}</strong>
                <span>{plan.summary}</span>
                <Link href={plan.href} prefetch={false}>
                  {plan.cta}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </noscript>
    </div>
  );
}
