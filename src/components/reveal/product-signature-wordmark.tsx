"use client";

import { useRef } from "react";
import { useInView, useReducedMotion } from "motion/react";
import styles from "./product-signature-wordmark.module.css";

type SignatureProduct = "notes" | "tasks" | "timeline" | "signal" | "home";

/**
 * The homepage's signature wordmarks, restored from the previous product
 * rows and refined to play once. Each mark describes its surface: capture,
 * completion, a published line — and Home carries the briefing pulse,
 * the signal settling where the day now starts (consolidation 2026-08).
 */
export function ProductSignatureWordmark({
  product,
}: {
  product: SignatureProduct;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const inView = useInView(ref, {
    once: true,
    margin: "-12% 0px",
  });
  const active = Boolean(prefersReducedMotion || inView);

  return (
    <span
      ref={ref}
      className={styles.wordmark}
      data-product-signature=""
      data-active={active ? "true" : undefined}
      data-product={product}
    >
      <span className={styles.word}>
        {product}
      </span>

      {product === "notes" ? (
        <span
          className={`${styles.mark} ${styles.notesCaret}`}
          aria-hidden="true"
        />
      ) : null}

      {product === "tasks" ? (
        <span
          className={`${styles.signature} ${styles.tasksStrike}`}
          aria-hidden="true"
        />
      ) : null}

      {product === "timeline" ? (
        <span
          className={`${styles.mark} ${styles.timelineOrigin}`}
          aria-hidden="true"
        >
          <span className={styles.timelineTrack} />
          <span className={styles.timelineMilestone} />
        </span>
      ) : null}

      {product === "signal" || product === "home" ? (
        <span
          className={`${styles.mark} ${styles.signalPulse}`}
          aria-hidden="true"
        />
      ) : null}
    </span>
  );
}
