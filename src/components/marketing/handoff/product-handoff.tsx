"use client";

import Link from "next/link";
import { useRef, useSyncExternalStore } from "react";
import {
  useMotionValue,
  useReducedMotion,
  useScroll,
} from "motion/react";
import { HANDOFF_DEFINITIONS } from "@/components/marketing/handoff-lab/data";
import { LivingArtifact } from "@/components/marketing/handoff-lab/living-artifact";
import type { ProductId } from "@/lib/product-urls";
import styles from "./product-handoff.module.css";

const subscribeToHydration = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

function subscribeToCompactViewport(onChange: () => void) {
  const query = window.matchMedia("(max-width: 767px)");
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

function getCompactViewportSnapshot() {
  return window.matchMedia("(max-width: 767px)").matches;
}

/**
 * Product Handoff — one living piece of work changing product grammar.
 *
 * Direction A was selected for production on 2026-07-28. The source remains
 * visible while its destination properties resolve, so motion explains the
 * relationship instead of decorating it. The section stays in normal
 * document flow and scroll progress drives Motion values directly.
 */
export function ProductHandoff({ product }: { product: ProductId }) {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const hydrated = useSyncExternalStore(
    subscribeToHydration,
    getClientSnapshot,
    getServerSnapshot,
  );
  const compact = useSyncExternalStore(
    subscribeToCompactViewport,
    getCompactViewportSnapshot,
    getServerSnapshot,
  );
  const settledProgress = useMotionValue(1);
  const { scrollYProgress } = useScroll({
    target: stageRef,
    // Begin only after the source artifact itself enters the viewport, then
    // finish when the artifact reaches the viewport centre. The remainder of
    // the section stays settled so the completed relationship can be read.
    offset: ["start 78%", "start 50%"],
  });
  // Keep the server and first client render identical. Motion learns the
  // media preference in the browser; applying it after mount avoids a
  // reduced-motion hydration mismatch while still settling immediately.
  const reduced = hydrated && Boolean(prefersReducedMotion);
  const progress = reduced ? settledProgress : scrollYProgress;
  const definition = HANDOFF_DEFINITIONS[product];

  return (
    <section
      ref={sectionRef}
      className={styles.handoff}
      data-product-handoff=""
      data-product={product}
      data-reduced={reduced ? "true" : undefined}
      aria-label={`${definition.caption} Product Handoff`}
    >
      <div className={styles.canvas}>
        <LivingArtifact
          definition={definition}
          progress={progress}
          reduced={reduced}
          replayKey={0}
          compact={compact}
          stageRef={stageRef}
        />

        {definition.nextHref && definition.nextLabel ? (
          <div className={styles.next}>
            <Link href={definition.nextHref}>
              {definition.nextLabel}
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        ) : null}
      </div>
    </section>
  );
}
