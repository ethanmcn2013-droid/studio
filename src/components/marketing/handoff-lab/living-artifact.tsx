"use client";

import { cubicBezier, motion, useTransform } from "motion/react";
import { ArtifactSurface, describeArtifact } from "./artifact-surface";
import type { HandoffSceneProps } from "./types";
import styles from "./product-handoff-lab.module.css";

export function LivingArtifact({
  definition,
  progress,
  reduced,
  replayKey,
  compact,
  stageRef,
}: HandoffSceneProps) {
  const signalEase = cubicBezier(0.77, 0, 0.175, 1);
  const sourceFinal = compact
    ? "translate3d(-2%, -18%, 0) scale(0.72)"
    : "translate3d(-16%, -24%, 0) scale(0.68)";
  const destinationFrames: [string, string, string, string, string] = compact
    ? [
        "translate3d(0%, 50%, 0) scale(0.9)",
        "translate3d(0%, 50%, 0) scale(0.9)",
        "translate3d(2%, 52%, 0) scale(0.91)",
        "translate3d(4%, 56%, 0) scale(0.92)",
        "translate3d(4%, 56%, 0) scale(0.92)",
      ]
    : [
        "translate3d(0%, 42%, 0) scale(0.92)",
        "translate3d(0%, 42%, 0) scale(0.92)",
        "translate3d(8%, 44%, 0) scale(0.96)",
        "translate3d(14%, 48%, 0) scale(1)",
        "translate3d(16%, 48%, 0) scale(1)",
      ];
  const sourceTransform = useTransform(
    progress,
    [0, 0.18, 0.58, 1],
    [
      "translate3d(0%, 0%, 0) scale(1)",
      "translate3d(0%, 0%, 0) scale(1)",
      compact
        ? "translate3d(-1%, -12%, 0) scale(0.82)"
        : "translate3d(-12%, -15%, 0) scale(0.8)",
      sourceFinal,
    ],
    { ease: signalEase },
  );
  const destinationOpacity = useTransform(
    progress,
    [0, 0.48, 0.62, 0.76, 1],
    [0, 0, 0.1, 1, 1],
    { ease: signalEase },
  );
  const destinationTransform = useTransform(
    progress,
    [0, 0.18, 0.58, 0.82, 1],
    destinationFrames,
    { ease: signalEase },
  );
  const fragmentOpacity = useTransform(
    progress,
    [0, 0.16, 0.26, 0.54, 0.68, 0.74, 1],
    [0, 0, 1, 1, 1, 0, 0],
    { ease: signalEase },
  );
  const desktopFragmentFrames: Record<
    (typeof definition)["product"],
    [string, string]
  > = {
    notes: [
      "translate3d(-28%, -2%, 0) scale(0.98)",
      "translate3d(30%, 42%, 0) scale(1)",
    ],
    tasks: [
      "translate3d(-24%, 2%, 0) scale(1)",
      "translate3d(28%, 45%, 0) scale(0.88)",
    ],
    timeline: [
      "translate3d(-26%, 0%, 0) scale(1)",
      "translate3d(30%, 44%, 0) scale(0.82)",
    ],
    signal: [
      "translate3d(-22%, 6%, 0) scale(0.86)",
      "translate3d(29%, 46%, 0) scale(1.04)",
    ],
  };
  const compactFragmentFrames: typeof desktopFragmentFrames = {
    notes: [
      "translate3d(-12%, 0%, 0) scale(0.96)",
      "translate3d(12%, 44%, 0) scale(0.96)",
    ],
    tasks: [
      "translate3d(-10%, 2%, 0) scale(1)",
      "translate3d(10%, 46%, 0) scale(0.84)",
    ],
    timeline: [
      "translate3d(-10%, 0%, 0) scale(1)",
      "translate3d(12%, 46%, 0) scale(0.78)",
    ],
    signal: [
      "translate3d(-8%, 6%, 0) scale(0.86)",
      "translate3d(11%, 48%, 0) scale(1)",
    ],
  };
  const fragmentFrames = compact
    ? compactFragmentFrames
    : desktopFragmentFrames;
  const fragmentTransform = useTransform(
    progress,
    [0.18, 0.68],
    fragmentFrames[definition.product],
    { ease: signalEase },
  );
  const sourceWashOpacity = useTransform(
    progress,
    [0, 0.18, 0.3, 0.56, 0.72, 1],
    [0, 0, 0.78, 0.78, 0, 0],
    { ease: signalEase },
  );
  const threadTransform = useTransform(
    progress,
    [0, 0.18, 0.66, 1],
    ["scaleX(0.04)", "scaleX(0.04)", "scaleX(1)", "scaleX(1)"],
    { ease: signalEase },
  );
  const receiptOpacity = useTransform(
    progress,
    [0, 0.68, 0.82, 1],
    [0, 0, 1, 1],
    { ease: signalEase },
  );
  const receiptTransform = useTransform(
    progress,
    [0.68, 0.82, 1],
    [
      "translate3d(0, 10px, 0)",
      "translate3d(0, 0, 0)",
      "translate3d(0, 0, 0)",
    ],
    { ease: signalEase },
  );
  const taskCompletion = useTransform(
    progress,
    [0, 0.24, 0.38, 1],
    [0, 0, 1, 1],
    { ease: signalEase },
  );
  const taskCompletionInverse = useTransform(
    progress,
    [0, 0.24, 0.38, 1],
    [1, 1, 0, 0],
    { ease: signalEase },
  );
  const taskCompletionTransform = useTransform(
    progress,
    [0, 0.24, 0.38, 1],
    ["scale(0.72)", "scale(0.72)", "scale(1)", "scale(1)"],
    { ease: signalEase },
  );
  const destinationLabelOpacity = useTransform(
    progress,
    [0, 0.5, 0.7, 1],
    [0, 0, 1, 1],
    { ease: signalEase },
  );

  return (
    <article
      className={styles.scene}
      data-handoff-scene=""
      data-product={definition.product}
      data-reduced={reduced ? "true" : undefined}
      key={replayKey}
    >
      <div className={styles.sceneHeader}>
        <p className={styles.sceneCaption}>{definition.caption}</p>
        <div>
          <h2>{definition.lead}</h2>
          <p>{definition.body}</p>
        </div>
      </div>
      <p className={styles.srOnly}>
        Source artifact:{" "}
        {describeArtifact(definition.source, definition.product === "tasks")}{" "}
        Destination artifact: {describeArtifact(definition.destination)}{" "}
        {definition.lineageLabel}
      </p>

      <div
        ref={stageRef}
        aria-hidden="true"
        className={styles.livingStage}
        data-handoff-stage=""
      >
        <div className={styles.livingLedger}>
          <span className={styles.livingLedgerId}>Artifact / Wedding 024</span>
          <span className={styles.livingLedgerState}>Source retained</span>
        </div>
        <span className={styles.originWord}>Origin</span>
        <motion.span
          className={styles.destinationWord}
          style={{ opacity: reduced ? 1 : destinationLabelOpacity }}
        >
          New state
        </motion.span>

        <motion.div
          className={`${styles.livingSurface} ${styles.livingSource}`}
          data-source-artifact=""
          style={{
            transform: reduced ? sourceFinal : sourceTransform,
          }}
        >
          <ArtifactSurface
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
          <motion.span
            className={styles.livingSourceWash}
            style={{ opacity: reduced ? 0 : sourceWashOpacity }}
          />
        </motion.div>

        <motion.div
          className={styles.livingFragment}
          style={{
            opacity: reduced ? 0 : fragmentOpacity,
            transform: reduced
              ? fragmentFrames[definition.product][1]
              : fragmentTransform,
          }}
        >
          <span>{definition.payloadText}</span>
        </motion.div>

        <motion.span
          className={styles.livingThread}
          style={{
            transform: reduced ? "scaleX(1)" : threadTransform,
          }}
        />

        <motion.div
          className={`${styles.livingSurface} ${styles.livingDestination}`}
          data-destination-artifact=""
          style={{
            opacity: reduced ? 1 : destinationOpacity,
            transform: reduced
              ? destinationFrames[destinationFrames.length - 1]
              : destinationTransform,
          }}
        >
          <ArtifactSurface state={definition.destination} />
        </motion.div>

        <motion.p
          className={styles.lineageReceipt}
          style={{
            opacity: reduced ? 1 : receiptOpacity,
            transform: reduced
              ? "translate3d(0, 0, 0)"
              : receiptTransform,
          }}
        >
          {definition.lineageLabel}
        </motion.p>
      </div>
    </article>
  );
}
