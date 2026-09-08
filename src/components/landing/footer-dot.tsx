"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import "./footer-dot.css";

const MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeToMotionPreference(onChange: () => void) {
  const preference = window.matchMedia(MOTION_QUERY);
  preference.addEventListener("change", onChange);
  return () => preference.removeEventListener("change", onChange);
}

function prefersReducedMotion() {
  return window.matchMedia(MOTION_QUERY).matches;
}

function staticServerSnapshot() {
  return true;
}

/**
 * Dot Studio v2's rigid, 50-unit circle and asymmetric eyes, in its idle pose.
 * This small footer performance keeps the artwork independent of the studio's
 * authoring UI. The circle stays round; gaze, blinks, and a hop carry the mood.
 */
export function FooterDot() {
  const stageRef = useRef<HTMLButtonElement>(null);
  const [paused, setPaused] = useState(false);
  const reducedMotion = useSyncExternalStore(
    subscribeToMotionPreference,
    prefersReducedMotion,
    staticServerSnapshot,
  );

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    let intersecting = false;
    const updatePlayback = () => {
      stage.dataset.running = String(
        intersecting && !document.hidden && !paused && !reducedMotion,
      );
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        intersecting = entry?.isIntersecting ?? false;
        updatePlayback();
      },
      { threshold: 0.25 },
    );
    observer.observe(stage);
    document.addEventListener("visibilitychange", updatePlayback);
    updatePlayback();

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", updatePlayback);
      stage.dataset.running = "false";
    };
  }, [paused, reducedMotion]);

  const label = reducedMotion
    ? "Dot, the Signal Studio mascot"
    : paused
      ? "Play Dot animation"
      : "Pause Dot animation";

  return (
    <button
      ref={stageRef}
      type="button"
      className="footer-dot"
      data-running="false"
      aria-label={label}
      title={label}
      disabled={!!reducedMotion}
      onClick={() => setPaused((value) => !value)}
    >
      <svg viewBox="-70 -80 140 150" aria-hidden="true" focusable="false">
        <g className="footer-dot-body">
          <circle r="50" fill="var(--accent, #4f46e5)" />
          <g className="footer-dot-gaze" fill="#ffffff">
            <g transform="translate(-4 -17) rotate(-14)">
              <g className="footer-dot-eye">
                <rect x="-3.65" y="-9" width="7.3" height="18" rx="3.65" />
              </g>
            </g>
            <g transform="translate(19 -19) rotate(-14)">
              <g className="footer-dot-eye footer-dot-eye-right">
                <rect x="-3.55" y="-8.5" width="7.1" height="17" rx="3.55" />
              </g>
            </g>
          </g>
        </g>
      </svg>
    </button>
  );
}
