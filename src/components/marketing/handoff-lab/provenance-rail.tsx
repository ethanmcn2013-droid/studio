"use client";

import { cubicBezier, motion, useTransform } from "motion/react";
import { ArtifactSurface, describeArtifact } from "./artifact-surface";
import type { HandoffSceneProps } from "./types";
import styles from "./product-handoff-lab.module.css";

const PRODUCT_NAMES = ["Notes", "Tasks", "Timeline", "Signal"];
const PRODUCT_INDEX = {
  notes: 0,
  tasks: 1,
  timeline: 2,
  signal: 3,
} as const;

export function ProvenanceRail({
  definition,
  progress,
  reduced,
  replayKey,
}: HandoffSceneProps) {
  const signalEase = cubicBezier(0.77, 0, 0.175, 1);
  const segmentStart = `${PRODUCT_INDEX[definition.product] * 25}%`;
  const routeTransform = useTransform(
    progress,
    [0, 0.18, 0.68, 1],
    ["scaleX(0.02)", "scaleX(0.02)", "scaleX(1)", "scaleX(1)"],
  );
  const markerTransform = useTransform(
    progress,
    [0, 0.18, 0.68, 1],
    [
      "translate3d(0%, 0, 0)",
      "translate3d(0%, 0, 0)",
      "translate3d(100%, 0, 0)",
      "translate3d(100%, 0, 0)",
    ],
  );
  const sourceOpacity = useTransform(
    progress,
    [0, 0.18, 0.62, 1],
    [1, 1, 1, 1],
    { ease: signalEase },
  );
  const sourceTransform = useTransform(
    progress,
    [0, 0.18, 0.62, 1],
    [
      "translate3d(0, 0, 0)",
      "translate3d(0, 0, 0)",
      "translate3d(0, -8px, 0)",
      "translate3d(0, -8px, 0)",
    ],
    { ease: signalEase },
  );
  const destinationOpacity = useTransform(
    progress,
    [0, 0.42, 0.72, 1],
    [0.22, 0.22, 1, 1],
    { ease: signalEase },
  );
  const destinationTransform = useTransform(
    progress,
    [0, 0.42, 0.72, 1],
    [
      "translate3d(0, 10px, 0)",
      "translate3d(0, 10px, 0)",
      "translate3d(0, 0, 0)",
      "translate3d(0, 0, 0)",
    ],
    { ease: signalEase },
  );
  const receiptOpacity = useTransform(
    progress,
    [0, 0.68, 0.82, 1],
    [0, 0, 1, 1],
    { ease: signalEase },
  );
  const taskCompletion = useTransform(
    progress,
    [0, 0.24, 0.42, 1],
    [0, 0, 1, 1],
  );
  const taskCompletionInverse = useTransform(
    progress,
    [0, 0.24, 0.42, 1],
    [1, 1, 0, 0],
  );
  const taskCompletionTransform = useTransform(
    progress,
    [0, 0.24, 0.42, 1],
    ["scale(0.72)", "scale(0.72)", "scale(1)", "scale(1)"],
  );

  return (
    <article
      className={`${styles.scene} ${styles.railScene}`}
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

      <div aria-hidden="true" className={styles.railStage}>
        <div className={styles.suiteRoute}>
          {PRODUCT_NAMES.map((name) => (
            <span
              data-active={
                name.toLowerCase() === definition.product ? "true" : undefined
              }
              key={name}
            >
              {name}
            </span>
          ))}
          <span className={styles.suiteRouteEnd}>Work</span>
        </div>

        <div className={styles.railLine}>
          <motion.span
            className={styles.railFill}
            style={{
              left: segmentStart,
              transform: reduced ? "scaleX(1)" : routeTransform,
              width: "25%",
            }}
          />
          <motion.span
            className={styles.railMarker}
            style={{
              left: segmentStart,
              transform: reduced
                ? "translate3d(100%, 0, 0)"
                : markerTransform,
            }}
          >
            <span>{definition.payloadText}</span>
          </motion.span>
        </div>
        <p className={styles.railMobilePayload}>{definition.payloadText}</p>

        <div className={styles.railArtifacts}>
          <motion.div
            style={{
              opacity: reduced ? 1 : sourceOpacity,
              transform: reduced
                ? "translate3d(0, -8px, 0)"
                : sourceTransform,
            }}
          >
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
          </motion.div>
          <motion.div
            data-destination-artifact=""
            style={{
              opacity: reduced ? 1 : destinationOpacity,
              transform: reduced
                ? "translate3d(0, 0, 0)"
                : destinationTransform,
            }}
          >
            <ArtifactSurface compact state={definition.destination} />
          </motion.div>
        </div>

        <motion.p
          className={styles.railReceipt}
          style={{ opacity: reduced ? 1 : receiptOpacity }}
        >
          {definition.lineageLabel}
        </motion.p>
      </div>
    </article>
  );
}
