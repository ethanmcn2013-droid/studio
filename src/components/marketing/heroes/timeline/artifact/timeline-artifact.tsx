"use client";

import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type RefObject,
} from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { AudienceTimelineDto } from "../audience-timeline";
import { useHydrated } from "@/components/marketing/heroes/tasks/lib/use-hydrated";
import {
  buildTimelineArtifactModel,
  buildTimelineCountdown,
  formatTimelineDate,
  timelinePointStatus,
  type TimelineArtifactModel,
  type TimelineArtifactPoint,
} from "./timeline-artifact-model";
import styles from "./timeline-artifact.module.css";

type MetricMode = "progress" | "countdown";

type MetricFact = Readonly<{
  label: string;
  value: string;
  unit: string;
  receipt?: string;
  spoken: string;
  alternate: string;
}>;

type StageStyle = CSSProperties & {
  "--timeline-point-count": number;
  "--timeline-completion": string;
  "--timeline-rail-start": string;
  "--timeline-rail-end": string;
};

/**
 * GALLERY EDIT 2026-07-27 — entrance choreography.
 *
 * The rail used to draw in 400ms with the points following on a 12ms stagger
 * capped at 240ms, so everything had landed inside half a second and the
 * timeline read as appearing rather than arriving. It now draws over 1.15s on
 * a long tail, and each point wakes as the line reaches it: a point's delay is
 * its own position along the rail. The Today marker lands once the line has
 * passed it. Nothing is faster; it is the ordering that does the work.
 */
const RAIL_DRAW_S = 1.15;
const RAIL_START_S = 0.16;
const RAIL_EASE = [0.22, 1, 0.36, 1] as const;
const POINT_EASE = [0.34, 1.28, 0.44, 1] as const;

type PositionStyle = CSSProperties & {
  "--timeline-position": string;
};

const METRIC_EASE = [0.23, 1, 0.32, 1] as const;

/**
 * Motion's media-query hook can know the browser preference on the first
 * client render while the server cannot. Gate that value behind React's
 * hydration snapshot so SSR and the first hydration pass always choose the
 * same motion props and subtree. The real preference takes effect immediately
 * after hydration.
 */
function useArtifactReducedMotion(): boolean {
  const hydrated = useHydrated();
  const prefersReducedMotion = useReducedMotion();
  return hydrated && Boolean(prefersReducedMotion);
}

/**
 * Initial marketing proof is server-rendered in its settled state. Normal
 * choreography is armed only once the hydrated artifact actually enters the
 * viewport; reduced-motion visitors never enter an animated intermediate
 * state during hydration.
 */
function useArtifactChoreography(
  ref: RefObject<HTMLElement | null>,
): Readonly<{ reduceMotion: boolean; motionReady: boolean }> {
  const hydrated = useHydrated();
  const prefersReducedMotion = useReducedMotion();
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (!hydrated || prefersReducedMotion) return;
    const node = ref.current;
    if (!node) return;
    if (!("IntersectionObserver" in window)) {
      const timer = globalThis.setTimeout(() => setInView(true), 0);
      return () => globalThis.clearTimeout(timer);
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setInView(true);
        observer.disconnect();
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.15 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [hydrated, prefersReducedMotion, ref]);

  return {
    reduceMotion: hydrated && Boolean(prefersReducedMotion),
    motionReady: hydrated && !prefersReducedMotion && inView,
  };
}

export type TimelineArtifactProps = Readonly<{
  timeline: AudienceTimelineDto;
  compact?: boolean;
  embedded?: boolean;
  className?: string;
  onCopyLink?: () => void | Promise<void>;
  copyLinkLabel?: string;
}>;

function artifactKicker(timeline: AudienceTimelineDto): string {
  if (timeline.audienceKind === "couple") return "A shared wedding timeline";
  if (timeline.audienceKind === "class") return "A shared class timeline";
  return "A shared module timeline";
}

function artifactPurpose(timeline: AudienceTimelineDto): string {
  if (timeline.audienceKind === "couple") {
    return "Every decision, visit and small moment on the way to the day.";
  }
  return "A clear view of what is complete and what comes next.";
}

function progressFact(model: TimelineArtifactModel): MetricFact {
  return {
    label: "Milestones complete",
    value: String(model.percent),
    unit: "%",
    receipt: `${model.completedCount} of ${model.totalCount} settled`,
    spoken: `${model.percent} percent, ${model.completedCount} of ${model.totalCount} milestones complete`,
    alternate: `${model.percent}% complete`,
  };
}

function countdownFact(
  countdown: Exclude<ReturnType<typeof buildTimelineCountdown>, null | { kind: "past" }>,
  eventLabel: string,
): MetricFact {
  if (countdown.kind === "today") {
    return {
      label: `Until ${eventLabel.toLowerCase()}`,
      value: "Today",
      unit: "",
      spoken: `${eventLabel} is today`,
      alternate: `${eventLabel} today`,
    };
  }

  return {
    label: `Until ${eventLabel.toLowerCase()}`,
    value: String(countdown.days),
    unit: countdown.days === 1 ? "day" : "days",
    spoken: `${countdown.days} ${countdown.days === 1 ? "day" : "days"} remaining`,
    alternate: `${countdown.days} ${countdown.days === 1 ? "day" : "days"} left`,
  };
}

function MetricFace({ fact }: { fact: MetricFact }) {
  return (
    <span className={styles.metricFace} aria-hidden="true">
      <span className={styles.metricLabel}>{fact.label}</span>
      <span className={styles.metricPrimary}>
        <strong data-timeline-metric-value>{fact.value}</strong>
        {fact.unit ? <small>{fact.unit}</small> : null}
      </span>
      {fact.receipt ? <span className={styles.metricReceipt}>{fact.receipt}</span> : null}
    </span>
  );
}

function TimeLens({
  timeline,
  model,
}: {
  timeline: AudienceTimelineDto;
  model: TimelineArtifactModel;
}) {
  const reduceMotion = useArtifactReducedMotion();
  const countdown = buildTimelineCountdown(timeline.primaryDate?.date, timeline.today);
  const canCountDown = countdown?.kind === "future" || countdown?.kind === "today";
  const [requestedMode, setRequestedMode] = useState<MetricMode>("progress");
  const [announcement, setAnnouncement] = useState("");
  const mode: MetricMode = canCountDown ? requestedMode : "progress";
  const completion = progressFact(model);
  const remaining = canCountDown && timeline.primaryDate
    ? countdownFact(countdown, timeline.primaryDate.label)
    : null;
  const active = mode === "countdown" && remaining ? remaining : completion;
  const alternate = mode === "progress" ? remaining : completion;
  const direction = mode === "countdown" ? 1 : -1;
  const dateSpoken = timeline.primaryDate
    ? `${timeline.primaryDate.label}, ${formatTimelineDate(timeline.primaryDate.date, "long")}`
    : null;

  const face = (
    <>
      <span className={styles.metricViewport}>
        <AnimatePresence initial={false} mode="wait" custom={direction}>
          <motion.span
            className={styles.metricMotion}
            key={mode}
            custom={direction}
            initial={reduceMotion ? false : { opacity: 0, x: direction * 14 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, x: direction * -10 }}
            transition={{ duration: reduceMotion ? 0 : 0.14, ease: METRIC_EASE }}
          >
            <MetricFace fact={active} />
          </motion.span>
        </AnimatePresence>
        <motion.span
          className={styles.metricSweep}
          data-direction={direction > 0 ? "forward" : "back"}
          key={`sweep-${mode}`}
          initial={reduceMotion ? false : { opacity: 0.32, scaleX: 0 }}
          animate={
            reduceMotion
              ? { opacity: 0, scaleX: 1 }
              : { opacity: [0.32, 0.18, 0], scaleX: [0, 1, 1] }
          }
          transition={{
            duration: reduceMotion ? 0 : 0.22,
            ease: METRIC_EASE,
            times: reduceMotion ? undefined : [0, 0.72, 1],
          }}
          aria-hidden="true"
        />
      </span>
      {alternate ? (
        <span className={styles.metricAlternateViewport} aria-hidden="true">
          <AnimatePresence initial={false} mode="wait">
            <motion.span
              className={styles.metricAlternate}
              key={`alternate-${mode}`}
              initial={reduceMotion ? false : { opacity: 0, x: direction * -6 }}
              animate={{ opacity: 1, x: 0 }}
              exit={reduceMotion ? undefined : { opacity: 0, x: direction * 6 }}
              transition={{ duration: reduceMotion ? 0 : 0.14, ease: METRIC_EASE }}
            >
              Show {alternate.alternate}
            </motion.span>
          </AnimatePresence>
        </span>
      ) : null}
      {timeline.primaryDate ? (
        <span className={styles.metricDate} aria-hidden="true">
          <span>{timeline.primaryDate.label}</span>
          <time dateTime={timeline.primaryDate.date}>
            {formatTimelineDate(timeline.primaryDate.date)}
          </time>
        </span>
      ) : null}
    </>
  );

  if (!remaining) {
    return (
      <div className={styles.timeLensShell}>
        <div
          className={`${styles.timeLens} ${styles.timeLensStatic}`}
          data-timeline-metric
          data-metric-mode="progress"
          role="group"
          aria-label={`${completion.spoken}${dateSpoken ? `. ${dateSpoken}` : ""}`}
        >
          {face}
        </div>
      </div>
    );
  }

  const nextMode: MetricMode = mode === "progress" ? "countdown" : "progress";
  const nextFact = nextMode === "countdown" ? remaining : completion;
  const controlLabel = mode === "progress"
    ? `Show days remaining. Currently showing ${completion.spoken}.${dateSpoken ? ` ${dateSpoken}.` : ""}`
    : `Show milestone completion. Currently showing ${remaining.spoken}.${dateSpoken ? ` ${dateSpoken}.` : ""}`;

  return (
    <div className={styles.timeLensShell}>
      <button
        className={styles.timeLens}
        data-timeline-metric
        data-timeline-metric-toggle
        data-metric-mode={mode}
        type="button"
        aria-label={controlLabel}
        onClick={() => {
          setRequestedMode(nextMode);
          setAnnouncement(`Now showing ${nextFact.spoken}.`);
        }}
      >
        {face}
      </button>
      <span className={styles.screenReaderOnly} aria-live="polite" aria-atomic="true">
        {announcement}
      </span>
    </div>
  );
}

function ProductIdentity({
  timeline,
  onCopyLink,
  copyLinkLabel,
}: Pick<TimelineArtifactProps, "timeline" | "onCopyLink" | "copyLinkLabel">) {
  const [copyState, setCopyState] = useState<"idle" | "copying" | "copied" | "error">("idle");
  const sharedBy = timeline.ownerDisplayLabel ?? "Shared timeline";

  return (
    <div className={styles.productHeader}>
      <span className={styles.productMark} aria-label="timeline" data-timeline-wordmark>
        timeline<span aria-hidden="true" />
      </span>
      <div className={styles.productMeta}>
        <span>{sharedBy}</span>
        {onCopyLink ? (
          <button
            type="button"
            disabled={copyState === "copying"}
            onClick={async () => {
              setCopyState("copying");
              try {
                await onCopyLink();
                setCopyState("copied");
              } catch {
                setCopyState("error");
              }
            }}
          >
            {copyState === "copied" ? "Link copied" : copyLinkLabel ?? "Copy link"}
          </button>
        ) : null}
        <span className={styles.screenReaderOnly} aria-live="polite" aria-atomic="true">
          {copyState === "copied" ? "Timeline link copied." : null}
          {copyState === "error" ? "The link could not be copied." : null}
        </span>
      </div>
    </div>
  );
}

function MilestoneLabel({ point }: { point: TimelineArtifactPoint }) {
  return (
    <span className={styles.milestoneLabel} aria-hidden="true">
      <span>{timelinePointStatus(point)}</span>
      <strong>{point.item.title}</strong>
      <small>{point.item.date ? formatTimelineDate(point.item.date) : "Timing not set"}</small>
    </span>
  );
}

function detailNote(point: TimelineArtifactPoint): string {
  if (point.state === "complete") return "This milestone is part of the story so far.";
  if (point.isNext) return "This is the next point on the shared journey.";
  return "This milestone comes later on the shared journey.";
}

function MilestoneDetail({
  point,
  detailId,
  titleId,
}: {
  point: TimelineArtifactPoint;
  detailId: string;
  titleId: string;
}) {
  const reduceMotion = useArtifactReducedMotion();

  return (
    <section
      className={styles.detail}
      data-detail-state={point.state}
      data-selected-milestone={point.item.publicId}
      id={detailId}
      aria-labelledby={titleId}
    >
      <AnimatePresence initial={false} mode="wait">
        <motion.div
          className={styles.detailInner}
          key={point.item.publicId}
          initial={reduceMotion ? false : { opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduceMotion ? undefined : { opacity: 0, y: -4 }}
          transition={{ duration: reduceMotion ? 0 : 0.22, ease: METRIC_EASE }}
        >
          <div className={styles.detailLead}>
            <p className={styles.detailStatus}>{timelinePointStatus(point)}</p>
            <h3 id={titleId}>{point.item.title}</h3>
            <p>{detailNote(point)}</p>
          </div>
          <dl className={styles.detailFacts}>
            <div>
              <dt>Timing</dt>
              <dd>
                {point.item.date ? (
                  <time dateTime={point.item.date}>{formatTimelineDate(point.item.date, "long")}</time>
                ) : "Timing not set"}
              </dd>
            </div>
            <div>
              <dt>Place in the plan</dt>
              <dd>{timelinePointStatus(point)}</dd>
            </div>
          </dl>
        </motion.div>
      </AnimatePresence>
    </section>
  );
}

function Journey({
  timeline,
  model,
  idPrefix,
}: {
  timeline: AudienceTimelineDto;
  model: TimelineArtifactModel;
  idPrefix: string;
}) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const { reduceMotion, motionReady } = useArtifactChoreography(sectionRef);
  const settledWithoutChoreography = reduceMotion || !motionReady;
  const [selectedId, setSelectedId] = useState(model.defaultSelectedId);
  const [focusIndex, setFocusIndex] = useState(() => Math.max(
    0,
    model.points.findIndex((point) => point.item.publicId === model.defaultSelectedId),
  ));
  const [detailOpen, setDetailOpen] = useState(Boolean(model.defaultSelectedId));
  const pointRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const selectedPoint = model.points.find((point) => point.item.publicId === selectedId)
    ?? model.points.find((point) => point.item.publicId === model.defaultSelectedId)
    ?? null;
  const boundedFocusIndex = Math.min(
    Math.max(focusIndex, 0),
    Math.max(0, model.points.length - 1),
  );
  const sectionId = `${idPrefix}-timeline`;
  const instructionsId = `${idPrefix}-instructions`;
  const detailId = `${idPrefix}-detail`;
  const detailTitleId = `${idPrefix}-detail-title`;

  const scrollPointIntoView = (index: number, behavior: ScrollBehavior) => {
    const viewport = viewportRef.current;
    const point = model.points[index];
    if (!viewport || !point) return;
    if (viewport.scrollWidth <= viewport.clientWidth) return;
    const target = (point.position / 100) * viewport.scrollWidth - viewport.clientWidth / 2;
    viewport.scrollTo({ left: Math.max(0, target), behavior });
  };

  useEffect(() => {
    const index = model.points.findIndex((point) => point.item.publicId === model.defaultSelectedId);
    if (index < 0) return;
    const frame = requestAnimationFrame(() => scrollPointIntoView(index, "auto"));
    return () => cancelAnimationFrame(frame);
    // The initial centring belongs to the publication, not later focus movement.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [model.defaultSelectedId, model.points]);

  const focusPoint = (nextIndex: number) => {
    const bounded = Math.min(Math.max(nextIndex, 0), model.points.length - 1);
    setFocusIndex(bounded);
    pointRefs.current[bounded]?.focus();
    scrollPointIntoView(bounded, reduceMotion ? "auto" : "smooth");
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      focusPoint(index + 1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      focusPoint(index - 1);
    } else if (event.key === "Home") {
      event.preventDefault();
      focusPoint(0);
    } else if (event.key === "End") {
      event.preventDefault();
      focusPoint(model.points.length - 1);
    } else if (event.key === "Escape") {
      event.preventDefault();
      setDetailOpen(false);
    }
  };

  /**
   * GALLERY EDIT 2026-07-27 — rail bounds.
   *
   * The rail used to span the full stage (`inset-inline: 0`) while the points
   * are laid out inside a collision-safe inset, so grey line ran on past the
   * last milestone at both ends and the final point sat short of the end of
   * its own line. The rail now starts at the first point and stops at the
   * last, so the line is exactly as long as the plan it describes.
   */
  const railStart = model.points.length ? model.points[0].position : 0;
  const railEnd = model.points.length
    ? model.points[model.points.length - 1].position
    : 100;
  const railSpan = Math.max(0.0001, railEnd - railStart);
  const alongRail = (position: number) =>
    Math.max(0, Math.min(1, (position - railStart) / railSpan));

  /**
   * The ink rail now fills to Today rather than to percent-complete. It is a
   * "you are here" line: where the plan has got to in time. Completion is
   * already stated, in words and in figures, by the TimeLens above.
   */
  const todayFraction =
    model.todayPosition === null ? 0 : alongRail(model.todayPosition);

  const stageStyle: StageStyle = {
    "--timeline-point-count": Math.max(1, model.points.length),
    "--timeline-completion": `${model.percent}%`,
    "--timeline-rail-start": `${railStart}%`,
    "--timeline-rail-end": `${railEnd}%`,
  };
  const todayStyle: PositionStyle | undefined = model.todayPosition === null
    ? undefined
    : { "--timeline-position": `${model.todayPosition}%` };
  const nextMilestone = model.points.find((point) => point.isNext) ?? null;
  const todayLabel = model.todayPosition === null
    ? null
    : `Today, ${formatTimelineDate(timeline.today, "long")}.${nextMilestone ? ` Our next milestone is ${nextMilestone.item.title}.` : ""}`;
  const instructions = model.todayPosition === null
    ? "Milestones without dates are arranged in plan order. Use Left and Right Arrow to move between milestones, Home and End to jump, Enter or Space to select, and Escape to close milestone detail."
    : "The highlighted point is the plan’s next milestone. The Today dash shows the calendar position. Use Left and Right Arrow to move between milestones, Home and End to jump, Enter or Space to select, and Escape to close milestone detail.";

  return (
    <section
      className={styles.journey}
      data-motion-ready={motionReady ? "true" : undefined}
      id={sectionId}
      aria-labelledby={`${sectionId}-title`}
      ref={sectionRef}
    >
      {/* "Plan timeline", not "Project timeline": every marketing surface
          that embeds this artifact shows a wedding plan, and the visible
          register beside it says plan. A screen reader should not hear a
          different product than the page shows. */}
      <h2 className={styles.screenReaderOnly} id={`${sectionId}-title`}>Plan timeline</h2>
      <p className={styles.screenReaderOnly} id={instructionsId}>
        {instructions}
      </p>
      <div className={styles.railFrame}>
        <div className={styles.stageViewport} ref={viewportRef} data-timeline-scroll-viewport>
          <div className={styles.stage} style={stageStyle}>
            <div
              className={styles.progressGeometry}
              role="progressbar"
              aria-label="Plan elapsed"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(todayFraction * 100)}
              aria-valuetext={`Today. ${model.completedCount} of ${model.totalCount} milestones complete`}
            >
              {/* The grey rail draws first, then the ink fills it to Today.
                  Its draw is a CSS animation, not a Motion one: the rail is
                  structural, and a JS-driven transform starting at scaleX(0)
                  leaves the line invisible if the animation never advances,
                  which is exactly what happens when the page mounts in a
                  background tab. CSS finishes regardless. */}
              <span className={styles.baseRail} aria-hidden="true" />
              <motion.span
                className={styles.completedRail}
                key={`rail-x-${motionReady}`}
                initial={settledWithoutChoreography ? false : { scaleX: 0 }}
                animate={{ scaleX: todayFraction }}
                transition={{
                  duration: settledWithoutChoreography ? 0 : RAIL_DRAW_S * todayFraction + 0.12,
                  delay: settledWithoutChoreography ? 0 : RAIL_START_S,
                  ease: RAIL_EASE,
                }}
                aria-hidden="true"
              />
              <motion.span
                className={styles.completedRailVertical}
                key={`rail-y-${motionReady}`}
                initial={settledWithoutChoreography ? false : { scaleY: 0 }}
                animate={{ scaleY: todayFraction }}
                transition={{
                  duration: settledWithoutChoreography ? 0 : RAIL_DRAW_S * todayFraction + 0.12,
                  delay: settledWithoutChoreography ? 0 : RAIL_START_S,
                  ease: RAIL_EASE,
                }}
                aria-hidden="true"
              />
            </div>

            {todayLabel && todayStyle ? (
              <motion.span
                className={styles.todayMarker}
                data-today-marker
                style={todayStyle}
                role="img"
                aria-label={todayLabel}
                key={`today-${motionReady}`}
                initial={settledWithoutChoreography ? false : { opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: settledWithoutChoreography ? 0 : 0.34,
                  // Lands just after the ink rail arrives beneath it.
                  delay: settledWithoutChoreography
                    ? 0
                    : RAIL_START_S + todayFraction * RAIL_DRAW_S + 0.1,
                  ease: METRIC_EASE,
                }}
              >
                <span aria-hidden="true">Today</span>
              </motion.span>
            ) : null}

            {model.points.length ? (
              <ol className={styles.milestones} aria-describedby={instructionsId}>
                {model.points.map((point, index) => {
                  const selected = point.item.publicId === selectedPoint?.item.publicId;
                  const firstUnfinished = model.points.findIndex((candidate) => candidate.state !== "complete");
                  const persistentLabel = selected
                    || point.isNext
                    || index === Math.max(0, firstUnfinished - 1)
                    || index === model.points.length - 1;
                  const pointStyle: PositionStyle = { "--timeline-position": `${point.position}%` };
                  const timing = point.item.date ? formatTimelineDate(point.item.date, "long") : "Timing not set";

                  return (
                    <li
                      className={styles.milestone}
                      data-state={point.state}
                      data-selected={selected ? "true" : undefined}
                      data-labelled={persistentLabel ? "true" : "false"}
                      data-side={index % 2 === 0 ? "above" : "below"}
                      data-edge={index === 0 ? "start" : index === model.points.length - 1 ? "end" : undefined}
                      key={point.item.publicId}
                      style={pointStyle}
                    >
                      <button
                        className={styles.milestoneButton}
                        type="button"
                        tabIndex={index === boundedFocusIndex ? 0 : -1}
                        aria-current={point.isNext ? "step" : undefined}
                        aria-pressed={selected}
                        aria-expanded={selected ? detailOpen : false}
                        aria-controls={selected ? detailId : undefined}
                        aria-label={`${point.item.title}. ${timelinePointStatus(point)}. ${timing}. Milestone ${index + 1} of ${model.points.length}.`}
                        ref={(node) => { pointRefs.current[index] = node; }}
                        onFocus={() => setFocusIndex(index)}
                        onKeyDown={(event) => handleKeyDown(event, index)}
                        onClick={() => {
                          setFocusIndex(index);
                          setSelectedId(point.item.publicId);
                          setDetailOpen(true);
                        }}
                      >
                        {/* A point wakes when the drawing line reaches it, so
                            the milestones light up along the rail rather than
                            all at once. */}
                        <motion.span
                          className={styles.point}
                          key={`${point.item.publicId}-${motionReady}`}
                          initial={settledWithoutChoreography ? false : { opacity: 0, scale: 0.5 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{
                            duration: settledWithoutChoreography ? 0 : 0.46,
                            delay: settledWithoutChoreography
                              ? 0
                              : RAIL_START_S + alongRail(point.position) * RAIL_DRAW_S,
                            ease: POINT_EASE,
                          }}
                          aria-hidden="true"
                        />
                        <MilestoneLabel point={point} />
                      </button>
                    </li>
                  );
                })}
              </ol>
            ) : (
              <p className={styles.empty}>
                <strong>No milestones shared yet.</strong>
                <span>Milestones will appear here when they are ready.</span>
              </p>
            )}

            <span className={styles.startCap} aria-hidden="true">Start</span>
            <span className={styles.finishCap} aria-hidden="true">
              {model.percent === 100 ? "Complete" : timeline.primaryDate?.label ?? "Finish"}
            </span>
          </div>
        </div>
      </div>

      <p className={styles.screenReaderOnly} aria-live="polite" aria-atomic="true">
        {detailOpen && selectedPoint
          ? `${selectedPoint.item.title} selected. ${timelinePointStatus(selectedPoint)}.`
          : "Milestone detail closed."}
      </p>
      {detailOpen && selectedPoint ? (
        <MilestoneDetail point={selectedPoint} detailId={detailId} titleId={detailTitleId} />
      ) : null}
    </section>
  );
}

function PlanningDecisions({ timeline, model }: { timeline: AudienceTimelineDto; model: TimelineArtifactModel }) {
  if (!model.cancelled.length) return null;
  return (
    <details className={styles.decisions}>
      <summary>
        {model.cancelled.length} planning {model.cancelled.length === 1 ? "decision" : "decisions"}
      </summary>
      <div>
        {model.cancelled.map((item) => (
          <span key={item.publicId}>
            {item.title}
            {item.date ? <time dateTime={item.date}>{formatTimelineDate(item.date)}</time> : null}
          </span>
        ))}
      </div>
      <span className={styles.screenReaderOnly}>{timeline.label}</span>
    </details>
  );
}

export function TimelineArtifact({
  timeline,
  compact = false,
  embedded = false,
  className,
  onCopyLink,
  copyLinkLabel,
}: TimelineArtifactProps) {
  const reduceMotion = useArtifactReducedMotion();
  const reactId = useId().replaceAll(":", "");
  const model = useMemo(() => buildTimelineArtifactModel(timeline), [timeline]);

  return (
    <article
      className={[styles.artifact, className].filter(Boolean).join(" ")}
      data-timeline-artifact
      data-compact={compact ? "true" : undefined}
      data-embedded={embedded ? "true" : undefined}
      data-density={model.density}
    >
      <a className={styles.skipLink} href={`#${reactId}-timeline`}>Skip to timeline</a>
      <header className={styles.header}>
        <ProductIdentity
          timeline={timeline}
          onCopyLink={onCopyLink}
          copyLinkLabel={copyLinkLabel}
        />
        <div className={styles.titleRow}>
          <motion.div
            className={styles.headerCopy}
            initial={reduceMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.22, ease: METRIC_EASE }}
          >
            <p className={styles.heroKicker}>{artifactKicker(timeline)}</p>
            {/* POLISH 2026-07-28 — h2, not h1. On the marketing page the artifact
              is embedded under a real page heading; a shared plan's label is
              the document's title, not the page's. Size unchanged. */}
            <h2>{timeline.label}</h2>
            <p className={styles.purpose}>{artifactPurpose(timeline)}</p>
          </motion.div>
          <TimeLens timeline={timeline} model={model} />
        </div>
      </header>

      <Journey timeline={timeline} model={model} idPrefix={reactId} />
      <PlanningDecisions timeline={timeline} model={model} />

      <footer className={styles.footer}>
        <span>Updated {formatTimelineDate(timeline.lastUpdatedAt.slice(0, 10))}</span>
        <span>A Signal Studio product</span>
      </footer>
    </article>
  );
}
