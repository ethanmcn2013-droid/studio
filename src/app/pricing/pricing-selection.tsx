"use client";

import Link from "next/link";
import {
  createContext,
  useContext,
  useCallback,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import styles from "./pricing.module.css";

export type PricingPlanId = "free" | "student" | "pro" | "enterprise";

type PricingSelection = Readonly<{
  selectedId: PricingPlanId;
  selectPlan: (id: PricingPlanId, trigger?: HTMLElement | null) => void;
}>;

const PricingSelectionContext = createContext<PricingSelection | null>(null);

export function PricingSelectionProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [selectedId, setSelectedId] = useState<PricingPlanId>("pro");
  const selectPlan = useCallback(
    (id: PricingPlanId, trigger?: HTMLElement | null) => {
      if (id === selectedId) return;
      const topBefore = trigger?.getBoundingClientRect().top;
      setSelectedId(id);
      if (topBefore === undefined || !trigger) return;
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          const topAfter = trigger.getBoundingClientRect().top;
          window.scrollBy({ top: topAfter - topBefore, behavior: "instant" });
        });
      });
    },
    [selectedId],
  );
  const value = useMemo(
    () => ({ selectedId, selectPlan }),
    [selectedId, selectPlan],
  );

  return (
    <PricingSelectionContext.Provider value={value}>
      {children}
    </PricingSelectionContext.Provider>
  );
}

export function usePricingSelection(): PricingSelection {
  const value = useContext(PricingSelectionContext);
  if (!value) {
    throw new Error("Pricing selection must be used inside its provider.");
  }
  return value;
}

export function PricingClosing({
  plans,
}: {
  plans: readonly Readonly<{
    id: PricingPlanId;
    name: string;
    cta: string;
    href: string;
  }>[];
}) {
  const { selectedId } = usePricingSelection();
  const selected = plans.find((plan) => plan.id === selectedId) ?? plans[0];
  const isEnterprise = selected.id === "enterprise";

  return (
    <section aria-labelledby="closing-title" className={styles.closing}>
      <div className={`${styles.closingInner} ${styles.shell}`}>
        <div>
          <p className={styles.closingEyebrow}>{selected.name} selected</p>
          <h2 id="closing-title">
            {isEnterprise
              ? "A clear agreement is part of the product."
              : "A clear price is part of the product."}
          </h2>
          <p>
            {isEnterprise
              ? "There is no charge to begin the conversation. Ethan confirms the scope, price, access and written terms before purchase."
              : "The waitlist does not charge you. Before paid access opens, we show the exact price, limits, renewal and access terms again."}
          </p>
        </div>
        <div className={styles.closingActions}>
          <Link
            className={styles.closingPrimary}
            href={selected.href}
            prefetch={false}
          >
            {selected.cta}
          </Link>
          <Link className={styles.closingSecondary} href="#plans">
            Review the plans
          </Link>
        </div>
      </div>
    </section>
  );
}
