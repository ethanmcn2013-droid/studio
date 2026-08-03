"use client";

import { cubicBezier, motion, useTransform } from "motion/react";
import { ArtifactSurface, describeArtifact } from "./artifact-surface";
import type { HandoffProduct, HandoffSceneProps } from "./types";
import styles from "./product-handoff-lab.module.css";

const EDITORIAL_WORDS: Record<
  HandoffProduct,
  { source: string; destination: string }
> = {
  notes: { source: "Approved", destination: "Owned" },
  tasks: { source: "Done", destination: "Dated" },
  timeline: { source: "Dated", destination: "Read" },
  signal: { source: "Read", destination: "Owned" },
};

export function EditorialCause({
  definition,
  progress,
  reduced,
  replayKey,
}: HandoffSceneProps) {
  const signalEase = cubicBezier(0.77, 0, 0.175, 1);
  const words = EDITORIAL_WORDS[definition.product];
  const sourceOpacity = useTransform(
    progress,
    [0, 0.18, 0.56, 0.76, 1],
    [1, 1, 1, 1, 1],
    { ease: signalEase },
  );
  const sourceTransform = useTransform(
    progress,
    [0, 0.18, 0.6, 1],
    [
      "translate3d(0, 0, 0)",
      "translate3d(0, 0, 0)",
      "translate3d(0, -26%, 0)",
      "translate3d(0, -26%, 0)",
    ],
    { ease: signalEase },
  );
  const destinationOpacity = useTransform(
    progress,
    [0, 0.32, 0.62, 1],
    [0, 0, 1, 1],
    { ease: signalEase },
  );
  const destinationTransform = useTransform(
    progress,
    [0, 0.32, 0.62, 1],
    [
      "translate3d(0, 32%, 0)",
      "translate3d(0, 32%, 0)",
      "translate3d(0, 0, 0)",
      "translate3d(0, 0, 0)",
    ],
    { ease: signalEase },
  );
  const ruleTransform = useTransform(
    progress,
    [0, 0.18, 0.72, 1],
    ["scaleX(0.06)", "scaleX(0.06)", "scaleX(1)", "scaleX(1)"],
    { ease: signalEase },
  );
  const evidenceOpacity = useTransform(
    progress,
    [0, 0.38, 0.62, 1],
    [0, 0, 1, 1],
    { ease: signalEase },
  );
  const evidenceTransform = useTransform(
    progress,
    [0.38, 0.62, 1],
    [
      "translate3d(0, 12px, 0)",
      "translate3d(0, 0, 0)",
      "translate3d(0, 0, 0)",
    ],
    { ease: signalEase },
  );
  const taskCompletion = useTransform(
    progress,
    [0, 0.2, 0.38, 1],
    [0, 0, 1, 1],
  );
  const taskCompletionInverse = useTransform(
    progress,
    [0, 0.2, 0.38, 1],
    [1, 1, 0, 0],
  );
  const taskCompletionTransform = useTransform(
    progress,
    [0, 0.2, 0.38, 1],
    ["scale(0.72)", "scale(0.72)", "scale(1)", "scale(1)"],
  );

  return (
    <article
      className={`${styles.scene} ${styles.editorialScene}`}
      data-handoff-scene=""
      data-product={definition.product}
      data-reduced={reduced ? "true" : undefined}
      key={replayKey}
    >
      <div className={styles.editorialLead}>
        <p className={styles.sceneCaption}>{definition.caption}</p>
        <h2>{definition.lead}</h2>
        <p>{definition.body}</p>
      </div>
      <p className={styles.srOnly}>
        Source artifact:{" "}
        {describeArtifact(definition.source, definition.product === "tasks")}{" "}
        Destination artifact: {describeArtifact(definition.destination)}{" "}
        {definition.lineageLabel}
      </p>

      <div aria-hidden="true" className={styles.editorialStage}>
        <div className={styles.editorialWords}>
          <motion.span
            className={styles.editorialSourceWord}
            style={{
              opacity: reduced ? 1 : sourceOpacity,
              transform: reduced
                ? "translate3d(0, -26%, 0)"
                : sourceTransform,
            }}
          >
            {words.source}
          </motion.span>
          <motion.span
            className={styles.editorialDestinationWord}
            style={{
              opacity: reduced ? 1 : destinationOpacity,
              transform: reduced
                ? "translate3d(0, 0, 0)"
                : destinationTransform,
            }}
          >
            {words.destination}
            <i aria-hidden="true">.</i>
          </motion.span>
        </div>

        <motion.span
          className={styles.editorialRule}
          style={{ transform: reduced ? "scaleX(1)" : ruleTransform }}
        />

        <div className={styles.editorialEvidence}>
          <div>
            <ArtifactSurface
              compact
              completion={
                definition.product === "tasks"
                  ? reduced
                    ? 1
                    : taskCompletion
                  : 0
              }
              completionInverse={
                definition.product === "tasks"
                  ? reduced
                    ? 0
                    : taskCompletionInverse
                  : 1
              }
              completionTransform={
                definition.product === "tasks"
                  ? reduced
                    ? "scale(1)"
                    : taskCompletionTransform
                  : "scale(0.72)"
              }
              state={definition.source}
            />
          </div>
          <motion.span
            className={styles.editorialArrow}
            style={{ opacity: reduced ? 1 : evidenceOpacity }}
          >
            →
          </motion.span>
          <motion.div
            data-destination-artifact=""
            style={{
              opacity: reduced ? 1 : evidenceOpacity,
              transform: reduced
                ? "translate3d(0, 0, 0)"
                : evidenceTransform,
            }}
          >
            <ArtifactSurface compact state={definition.destination} />
          </motion.div>
        </div>

        <motion.p
          className={styles.editorialReceipt}
          style={{ opacity: reduced ? 1 : evidenceOpacity }}
        >
          {definition.lineageLabel}
        </motion.p>
      </div>
    </article>
  );
}
