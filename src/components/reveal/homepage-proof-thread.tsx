"use client";

import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import styles from "./homepage-proof-thread.module.css";

const STEPS = [
  { key: "notes", label: "Notes" },
  { key: "tasks", label: "Tasks" },
  { key: "timeline", label: "Timeline" },
  { key: "signal", label: "Signal" },
] as const;

type StepKey = (typeof STEPS)[number]["key"];
type ActiveKey = StepKey | "receipt" | null;

/**
 * One observer owns the homepage proof sequence. It records crossings rather
 * than mirroring scroll progress, so every handoff plays once and stays put.
 */
export function HomepageProofThread({ children }: { children: ReactNode }) {
  const sequenceRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<ActiveKey>(null);
  const [arrived, setArrived] = useState<ReadonlySet<StepKey>>(
    () => new Set<StepKey>(["notes"]),
  );
  const [receiptArrived, setReceiptArrived] = useState(false);

  useEffect(() => {
    const sequence = sequenceRef.current;
    if (!sequence) return;

    const targets = Array.from(
      sequence.querySelectorAll<HTMLElement>(
        "[data-proof-chapter], [data-proof-receipt]",
      ),
    );

    if (typeof IntersectionObserver === "undefined") {
      const fallbackFrame = window.requestAnimationFrame(() =>
        setActive("notes"),
      );
      return () => window.cancelAnimationFrame(fallbackFrame);
    }

    const intersectingTargets = new Set<HTMLElement>();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const target = entry.target as HTMLElement;

          if (entry.isIntersecting) {
            intersectingTargets.add(target);
          } else {
            intersectingTargets.delete(target);
          }
        });

        const viewportHeight = window.innerHeight;
        const readingLine = viewportHeight * 0.42;
        const zoneTop = viewportHeight * 0.3;
        const zoneBottom = viewportHeight * 0.52;
        const entering = [...intersectingTargets]
          .map((target) => {
            const rect = target.getBoundingClientRect();
            const distance =
              readingLine < rect.top
                ? rect.top - readingLine
                : readingLine > rect.bottom
                  ? readingLine - rect.bottom
                  : 0;

            return {
              target,
              rect,
              distance,
              order: targets.indexOf(target),
            };
          })
          .filter(
            ({ rect }) => rect.bottom > zoneTop && rect.top < zoneBottom,
          )
          .sort(
            (a, b) => a.distance - b.distance || b.order - a.order,
          )[0];

        if (!entering) {
          setActive(null);
          return;
        }

        const target = entering.target;
        if (target.hasAttribute("data-proof-receipt")) {
          setActive("receipt");
          setReceiptArrived(true);
          return;
        }

        const key = target.dataset.proofChapter as StepKey | undefined;
        const index = STEPS.findIndex((step) => step.key === key);
        if (!key || index < 0) return;

        setActive(key);
        setArrived((current) => {
          const next = new Set(current);
          for (let stepIndex = 0; stepIndex <= index; stepIndex += 1) {
            next.add(STEPS[stepIndex].key);
          }
          return next.size === current.size ? current : next;
        });
      },
      {
        rootMargin: "-30% 0px -48% 0px",
        threshold: 0,
      },
    );

    for (const target of targets) observer.observe(target);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      className={styles.sequence}
      data-active-proof={active ?? undefined}
      data-receipt-arrived={receiptArrived ? "true" : undefined}
      ref={sequenceRef}
    >
      <a className={styles.skip} href="#relay-receipt">
        Skip product proofs
      </a>

      <nav className={styles.chapterMap} aria-label="Product proof chapters">
        <div className={styles.railInner}>
          <span
            className={styles.threadLine}
            data-proof-thread-line
            aria-hidden="true"
          />
          <ol className={styles.chapterList}>
            {STEPS.map((step, index) => {
              const isCurrent = active === step.key;
              const hasArrived = arrived.has(step.key);

              return (
                <li
                  className={styles.chapterItem}
                  data-arrived={hasArrived ? "true" : undefined}
                  data-current={isCurrent ? "true" : undefined}
                  key={step.key}
                >
                  {index > 0 ? (
                    <span className={styles.crossing} aria-hidden="true" />
                  ) : null}
                  <a
                    className={styles.chapterLink}
                    href={`#relay-${step.key}`}
                    aria-current={isCurrent ? "step" : undefined}
                  >
                    <span className={styles.stop} aria-hidden="true" />
                    <span className={styles.chapterLabel}>{step.label}</span>
                    <span className={styles.currentText}>
                      {isCurrent ? "Current" : hasArrived ? "Passed" : "Ahead"}
                    </span>
                  </a>
                </li>
              );
            })}
          </ol>
          <span className={styles.receiptDot} aria-hidden="true" />
        </div>
      </nav>

      <div className={styles.story}>
        {children}

        <section
          className={styles.receipt}
          data-proof-receipt
          id="relay-receipt"
          aria-labelledby="relay-receipt-title"
        >
          <span className={styles.receiptMark} aria-hidden="true" />
          <p className={styles.receiptKicker}>The receipt</p>
          <h3 id="relay-receipt-title">One detail, accounted for.</h3>
          <p className={styles.provenance}>
            Private source <span aria-hidden="true">→</span> owned commitment{" "}
            <span aria-hidden="true">→</span> public milestone{" "}
            <span aria-hidden="true">→</span> sourced briefing
          </p>
          <p className={styles.receiptBody}>
            The source stayed private. Every handoff kept its owner and receipt.
          </p>
        </section>
      </div>
    </div>
  );
}
