import type { ArtifactState } from "./types";
import { motion } from "motion/react";
import type { MotionValue } from "motion";
import styles from "./product-handoff-lab.module.css";

export function describeArtifact(
  state: ArtifactState,
  taskCompletes = false,
) {
  const facts = state.facts
    .map((fact) =>
      taskCompletes && state.kind === "tasks" && fact.label === "State"
        ? "State: In progress, then Done"
        : `${fact.label}: ${fact.value}`,
    )
    .join("; ");
  return `${state.productLabel}. ${state.text}. ${facts}.`;
}

function TaskMark({
  completion = 0,
  completionTransform,
}: {
  completion?: number | MotionValue<number>;
  completionTransform?: string | MotionValue<string>;
}) {
  const resolvedTransform =
    completionTransform ??
    (typeof completion === "number" && completion > 0
      ? "scale(1)"
      : "scale(0.72)");
  return (
    <span aria-hidden="true" className={styles.taskMark}>
      <motion.span
        className={styles.taskMarkFill}
        style={{
          opacity: completion,
          transform: resolvedTransform,
        }}
      />
      <motion.span
        className={styles.taskMarkTick}
        style={{ opacity: completion }}
      />
    </span>
  );
}
function TimelineMark() {
  return (
    <span aria-hidden="true" className={styles.timelineMark}>
      <span />
      <span />
      <span data-active="true" />
      <span />
    </span>
  );
}

function ArtifactBody({
  state,
  completion,
  completionTransform,
}: {
  state: ArtifactState;
  completion?: number | MotionValue<number>;
  completionTransform?: string | MotionValue<string>;
}) {
  if (state.kind === "notes") {
    return (
      <div className={styles.noteBody}>
        <span aria-hidden="true" className={styles.noteCaret} />
        <span>{state.text}</span>
      </div>
    );
  }

  if (state.kind === "tasks") {
    return (
      <div className={styles.taskBody}>
        <TaskMark
          completion={completion}
          completionTransform={completionTransform}
        />
        <span>{state.text}</span>
      </div>
    );
  }

  if (state.kind === "timeline") {
    return (
      <div className={styles.timelineBody}>
        <TimelineMark />
        <span>{state.text}</span>
      </div>
    );
  }

  return (
    <div className={styles.signalBody}>
      <span aria-hidden="true" className={styles.signalMarker} />
      <span className={styles.signalClaim}>
        {state.facts[0]?.value ?? "Now"}
      </span>
      <span>{state.text}</span>
    </div>
  );
}

export function ArtifactSurface({
  state,
  completion,
  completionInverse = 1,
  completionTransform,
  compact = false,
}: {
  state: ArtifactState;
  completion?: number | MotionValue<number>;
  completionInverse?: number | MotionValue<number>;
  completionTransform?: string | MotionValue<string>;
  compact?: boolean;
}) {
  return (
    <div
      className={styles.artifactSurface}
      data-compact={compact ? "true" : undefined}
      data-kind={state.kind}
    >
      <p className={styles.artifactLabel}>{state.productLabel}</p>
      <ArtifactBody
        completion={completion}
        completionTransform={completionTransform}
        state={state}
      />
      <dl className={styles.artifactFacts}>
        {state.facts.map((fact) => (
          <div key={`${fact.label}-${fact.value}`}>
            <dt>{fact.label}</dt>
            {state.kind === "tasks" && fact.label === "State" ? (
              <dd className={styles.taskStateValue}>
                <motion.span style={{ opacity: completionInverse }}>
                  {fact.value}
                </motion.span>
                <motion.span style={{ opacity: completion }}>Done</motion.span>
              </dd>
            ) : (
              <dd>{fact.value}</dd>
            )}
          </div>
        ))}
      </dl>
    </div>
  );
}
