"use client";

import {
  animate,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "motion/react";
import type { AnimationPlaybackControls } from "motion";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { HANDOFF_DEFINITIONS, HANDOFF_OPTIONS, HANDOFF_PRODUCT_ORDER } from "./data";
import { EditorialCause } from "./editorial-cause";
import { LivingArtifact } from "./living-artifact";
import { ProvenanceRail } from "./provenance-rail";
import type {
  HandoffOption,
  HandoffProduct,
  HandoffProductSelection,
  HandoffSceneProps,
  HandoffViewport,
} from "./types";
import styles from "./product-handoff-lab.module.css";

const OPTION_INDEX: Record<HandoffOption, number> = {
  a: 0,
  b: 1,
  c: 2,
};

const PRODUCT_LABELS: Record<HandoffProductSelection, string> = {
  notes: "Notes",
  tasks: "Tasks",
  timeline: "Timeline",
  signal: "Signal",
  walk: "Product Walk",
};

const VIEWPORT_LABELS: Record<HandoffViewport, string> = {
  auto: "Responsive",
  mobile: "390",
  tablet: "768",
  desktop: "1440",
};

function setQueryValues(values: Record<string, string | null>) {
  const url = new URL(window.location.href);
  for (const [key, value] of Object.entries(values)) {
    if (value === null) url.searchParams.delete(key);
    else url.searchParams.set(key, value);
  }
  window.history.replaceState(null, "", url);
}

function clamp01(value: number) {
  return Math.max(0, Math.min(1, value));
}

function Scene({
  option,
  walkIndex,
  ...props
}: HandoffSceneProps & {
  option: HandoffOption;
  walkIndex?: number;
}) {
  const start = walkIndex === undefined ? 0 : walkIndex * 0.18;
  const end = walkIndex === undefined ? 1 : 0.46 + walkIndex * 0.18;
  const sceneProgress = useTransform(props.progress, (value) =>
    clamp01((value - start) / (end - start)),
  );
  const sceneProps = { ...props, progress: sceneProgress };

  if (option === "b") return <ProvenanceRail {...sceneProps} />;
  if (option === "c") return <EditorialCause {...sceneProps} />;
  return <LivingArtifact {...sceneProps} />;
}

export function ProductHandoffLab({
  initialMotion,
  initialOption,
  initialProduct,
  initialProgress,
  initialViewport,
}: {
  initialMotion: "auto" | "reduce";
  initialOption: HandoffOption;
  initialProduct: HandoffProductSelection;
  initialProgress: number | null;
  initialViewport: HandoffViewport;
}) {
  const systemReducedMotion = useReducedMotion();
  const [option, setOptionState] = useState(initialOption);
  const [product, setProductState] = useState(initialProduct);
  const [viewport, setViewportState] = useState(initialViewport);
  const [forcedReducedMotion, setForcedReducedMotion] = useState(
    initialMotion === "reduce",
  );
  const [slowMotion, setSlowMotion] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [replayKey, setReplayKey] = useState(0);
  const [responsiveCompact, setResponsiveCompact] = useState(false);
  const reduced = forcedReducedMotion || Boolean(systemReducedMotion);
  const compact =
    viewport === "mobile" || (viewport === "auto" && responsiveCompact);
  const progress = useMotionValue(
    reduced ? 1 : clamp01(initialProgress ?? 0),
  );
  const animationRef = useRef<AnimationPlaybackControls | null>(null);
  const progressInputRef = useRef<HTMLInputElement | null>(null);
  const progressOutputRef = useRef<HTMLOutputElement | null>(null);
  const pickerRef = useRef<HTMLElement | null>(null);
  const highlightRef = useRef<HTMLSpanElement | null>(null);
  const pickerItemRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const direction = HANDOFF_OPTIONS[OPTION_INDEX[option]];

  const stop = useCallback(() => {
    animationRef.current?.stop();
    animationRef.current = null;
    setPlaying(false);
  }, []);

  const play = useCallback(() => {
    if (reduced) {
      progress.set(1);
      setPlaying(false);
      return;
    }

    animationRef.current?.stop();
    const current = progress.get();
    if (current >= 0.999) progress.set(0);
    const from = progress.get();
    const duration = 3.2 * (slowMotion ? 4 : 1) * Math.max(0.12, 1 - from);

    setPlaying(true);
    animationRef.current = animate(progress, 1, {
      duration,
      ease: "linear",
      onComplete: () => {
        animationRef.current = null;
        setPlaying(false);
      },
    });
  }, [progress, reduced, slowMotion]);

  const pause = useCallback(() => {
    animationRef.current?.pause();
    setPlaying(false);
  }, []);

  const replay = useCallback(() => {
    stop();
    setReplayKey((value) => value + 1);
    if (reduced) {
      progress.set(1);
      return;
    }
    progress.set(0);
    window.requestAnimationFrame(play);
  }, [play, progress, reduced, stop]);

  const setOption = useCallback(
    (next: HandoffOption) => {
      stop();
      setOptionState(next);
      setReplayKey((value) => value + 1);
      setQueryValues({
        option: next,
        v: String(OPTION_INDEX[next] + 1),
      });
    },
    [stop],
  );

  const setProduct = useCallback(
    (next: HandoffProductSelection) => {
      stop();
      setProductState(next);
      setReplayKey((value) => value + 1);
      progress.set(reduced ? 1 : 0);
      setQueryValues({
        product: next,
        progress: reduced ? "1" : "0",
      });
    },
    [progress, reduced, stop],
  );

  const setViewport = useCallback((next: HandoffViewport) => {
    setViewportState(next);
    setQueryValues({
      viewport: next === "auto" ? null : next,
    });
  }, []);

  const toggleReducedMotion = useCallback(() => {
    stop();
    const next = !forcedReducedMotion;
    setForcedReducedMotion(next);
    progress.set(next || systemReducedMotion ? 1 : 0);
    setQueryValues({
      motion: next ? "reduce" : "auto",
      progress: next ? "1" : "0",
    });
  }, [
    forcedReducedMotion,
    progress,
    stop,
    systemReducedMotion,
  ]);

  const toggleSlowMotion = useCallback(() => {
    const next = !slowMotion;
    if (playing) pause();
    setSlowMotion(next);
  }, [pause, playing, slowMotion]);

  useEffect(() => {
    const unsubscribe = progress.on("change", (value) => {
      const bounded = clamp01(value);
      if (progressInputRef.current) {
        progressInputRef.current.value = String(bounded);
      }
      if (progressOutputRef.current) {
        progressOutputRef.current.textContent = `${Math.round(bounded * 100)}%`;
      }
    });

    progress.set(reduced ? 1 : clamp01(initialProgress ?? 0));
    return unsubscribe;
  }, [initialProgress, progress, reduced]);

  useEffect(() => {
    if (initialProgress === null && !reduced) {
      const frame = window.requestAnimationFrame(play);
      return () => window.cancelAnimationFrame(frame);
    }
    return undefined;
  }, [initialProgress, play, reduced]);

  useEffect(() => stop, [stop]);

  useEffect(() => {
    const query = window.matchMedia("(max-width: 767px)");
    const sync = () => setResponsiveCompact(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  const moveHighlight = useCallback(() => {
    const active = pickerItemRefs.current[OPTION_INDEX[option]];
    const highlight = highlightRef.current;
    if (!active || !highlight) return;
    highlight.style.width = `${active.offsetWidth}px`;
    highlight.style.transform = `translateX(${active.offsetLeft}px)`;
  }, [option]);

  useLayoutEffect(() => {
    moveHighlight();
    const first = window.requestAnimationFrame(() => {
      const second = window.requestAnimationFrame(() => {
        pickerRef.current?.setAttribute("data-ready", "");
      });
      return () => window.cancelAnimationFrame(second);
    });
    window.addEventListener("resize", moveHighlight);
    return () => {
      window.cancelAnimationFrame(first);
      window.removeEventListener("resize", moveHighlight);
    };
  }, [moveHighlight]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (
        target &&
        (/^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName) ||
          target.isContentEditable)
      ) {
        return;
      }
      if (event.metaKey || event.ctrlKey || event.altKey) return;

      const numeric = Number.parseInt(event.key, 10);
      if (numeric >= 1 && numeric <= HANDOFF_OPTIONS.length) {
        setOption(HANDOFF_OPTIONS[numeric - 1].id);
      } else if (
        event.key === "ArrowRight" &&
        pickerRef.current?.contains(document.activeElement)
      ) {
        const next = (OPTION_INDEX[option] + 1) % HANDOFF_OPTIONS.length;
        setOption(HANDOFF_OPTIONS[next].id);
      } else if (
        event.key === "ArrowLeft" &&
        pickerRef.current?.contains(document.activeElement)
      ) {
        const next =
          (OPTION_INDEX[option] - 1 + HANDOFF_OPTIONS.length) %
          HANDOFF_OPTIONS.length;
        setOption(HANDOFF_OPTIONS[next].id);
      } else if (event.key.toLowerCase() === "r") {
        replay();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [option, replay, setOption]);

  const selectedProducts = useMemo<HandoffProduct[]>(
    () => (product === "walk" ? HANDOFF_PRODUCT_ORDER : [product]),
    [product],
  );

  return (
    <main
      className={styles.lab}
      data-handoff-lab=""
      data-option={option}
      id="main"
    >
      <header className={styles.labHeader}>
        <p className={styles.labKicker}>Product Handoff study</p>
        <h1>One piece of work. Three ways to make the handoff visible.</h1>
        <p>
          The heroes stay locked. This room tests only the moment beneath them,
          using the same facts across every direction.
        </p>
      </header>

      <section aria-label="Review controls" className={styles.controls}>
        <div className={styles.controlGroup}>
          <span className={styles.controlLabel}>Product</span>
          <div className={styles.segmented}>
            {(
              [
                ...HANDOFF_PRODUCT_ORDER,
                "walk",
              ] as HandoffProductSelection[]
            ).map((item) => (
              <button
                aria-pressed={product === item}
                data-active={product === item ? "true" : undefined}
                key={item}
                onClick={() => setProduct(item)}
                type="button"
              >
                {PRODUCT_LABELS[item]}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.controlGroup}>
          <span className={styles.controlLabel}>Frame</span>
          <div className={styles.segmented}>
            {(Object.keys(VIEWPORT_LABELS) as HandoffViewport[]).map((item) => (
              <button
                aria-pressed={viewport === item}
                data-active={viewport === item ? "true" : undefined}
                key={item}
                onClick={() => setViewport(item)}
                type="button"
              >
                {VIEWPORT_LABELS[item]}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.playback}>
          <div className={styles.playbackButtons}>
            <button
              disabled={reduced}
              onClick={playing ? pause : play}
              type="button"
            >
              {playing ? "Pause" : "Play"}
            </button>
            <button onClick={replay} type="button">
              Replay
            </button>
            <button
              aria-pressed={slowMotion}
              data-active={slowMotion ? "true" : undefined}
              disabled={reduced}
              onClick={toggleSlowMotion}
              type="button"
            >
              {slowMotion ? "0.25×" : "1×"}
            </button>
            <button
              aria-pressed={reduced}
              data-active={reduced ? "true" : undefined}
              onClick={toggleReducedMotion}
              type="button"
            >
              Reduce motion
            </button>
          </div>
          <label className={styles.progressControl}>
            <span>Progress</span>
            <input
              aria-label="Animation progress"
              defaultValue={reduced ? 1 : initialProgress ?? 0}
              max="1"
              min="0"
              onInput={(event) => {
                stop();
                const value = clamp01(
                  Number.parseFloat(event.currentTarget.value),
                );
                progress.set(value);
                setQueryValues({ progress: value.toFixed(2) });
              }}
              ref={progressInputRef}
              step="0.01"
              type="range"
            />
            <output ref={progressOutputRef}>
              {Math.round((reduced ? 1 : initialProgress ?? 0) * 100)}%
            </output>
          </label>
        </div>
      </section>

      <section className={styles.directionNote}>
        <div>
          <span>{direction.name}</span>
          <p>{direction.axis}</p>
        </div>
        <p>{direction.cost}</p>
      </section>

      <div
        className={styles.previewFrame}
        data-testid="handoff-preview"
        data-viewport={viewport}
        data-walk={product === "walk" ? "true" : undefined}
      >
        <div className={styles.previewCanvas}>
          <div className={styles.walkGrid}>
            {selectedProducts.map((item) => {
              const definition = HANDOFF_DEFINITIONS[item];
              return (
                <section
                  aria-labelledby={`handoff-${option}-${item}`}
                  className={styles.previewScene}
                  key={`${option}-${item}-${replayKey}`}
                >
                  <span className={styles.srOnly} id={`handoff-${option}-${item}`}>
                    {definition.lead} {definition.body}
                  </span>
                  <Scene
                    compact={compact}
                    definition={definition}
                    option={option}
                    progress={progress}
                    reduced={reduced}
                    replayKey={replayKey}
                    walkIndex={
                      product === "walk"
                        ? HANDOFF_PRODUCT_ORDER.indexOf(item)
                        : undefined
                    }
                  />
                  {product !== "walk" && definition.nextHref && (
                    <a className={styles.nextLink} href={definition.nextHref}>
                      {definition.nextLabel}
                      <span aria-hidden="true">→</span>
                    </a>
                  )}
                </section>
              );
            })}
          </div>
        </div>
      </div>

      <section className={styles.reviewContract}>
        <p>Review contract</p>
        <ul>
          <li>The artifact keeps its source, date, owner, and receipt.</li>
          <li>Motion explains the transfer and then rests.</li>
          <li>Mobile keeps the idea without squeezing the desktop layout.</li>
          <li>Reduced motion shows the complete relationship immediately.</li>
        </ul>
      </section>

      <nav
        aria-label="Prototype variants"
        className="proto-picker"
        ref={pickerRef}
      >
        <span
          aria-hidden="true"
          className="proto-picker-highlight"
          ref={highlightRef}
        />
        {HANDOFF_OPTIONS.map((item, index) => (
          <button
            aria-current={option === item.id ? "true" : undefined}
            className="proto-picker-item"
            data-active={option === item.id ? "" : undefined}
            key={item.id}
            onClick={() => setOption(item.id)}
            ref={(node) => {
              pickerItemRefs.current[index] = node;
            }}
            type="button"
          >
            {item.name}
          </button>
        ))}
        <span
          aria-hidden="true"
          className="proto-picker-divider"
        />
        <button
          aria-label="Replay animation (R)"
          className="proto-picker-item proto-picker-replay"
          onClick={replay}
          type="button"
        >
          ↻
        </button>
      </nav>
    </main>
  );
}
