"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { evaluateFilm } from "@/lib/dot/clips";
import { DotPlayer } from "@/lib/dot/player";
import { renderContents, type RenderOptions } from "@/lib/dot/render";
import "./footer-dot.css";

const MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const FILM_SPEED = 1.4;
const ARTWORK: RenderOptions = { stage: "transparent", effects: true };
const POSTER = { __html: renderContents(evaluateFilm(0), ARTWORK) };

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
 * The complete Dot Studio v2 film, using its original transparent SVG renderer.
 * One visible-only clock preserves the authored sequence and pause position.
 */
export function FooterDot() {
  const stageRef = useRef<HTMLButtonElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const playerRef = useRef<DotPlayer | null>(null);
  const [paused, setPaused] = useState(false);
  const reducedMotion = useSyncExternalStore(
    subscribeToMotionPreference,
    prefersReducedMotion,
    staticServerSnapshot,
  );

  useEffect(() => {
    const stage = stageRef.current;
    const svg = svgRef.current;
    if (!stage || !svg) return;
    const player = (playerRef.current ??= new DotPlayer());
    player.clip = "film";
    player.speed = FILM_SPEED;
    player.loop = true;
    player.setReduced(reducedMotion);
    player.playing = !paused && !reducedMotion;
    let intersecting = false;
    let frame: number | null = null;
    let lastTime: number | null = null;
    const draw = () => {
      // The renderer accepts only numeric poses and a closed artwork palette.
      svg.innerHTML = renderContents(player.pose(), ARTWORK);
      stage.dataset.filmTime = player.time.toFixed(3);
    };
    const animate = (now: number) => {
      frame = null;
      if (!player.needsFrame) return;
      if (lastTime !== null) player.tick((now - lastTime) / 1000);
      lastTime = now;
      draw();
      frame = requestAnimationFrame(animate);
    };
    const updatePlayback = () => {
      player.visible = intersecting && !document.hidden;
      stage.dataset.running = String(player.needsFrame);
      if (player.needsFrame && frame === null) {
        lastTime = null;
        frame = requestAnimationFrame(animate);
      } else if (!player.needsFrame) {
        if (frame !== null) cancelAnimationFrame(frame);
        frame = null;
        lastTime = null;
      }
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
    draw();
    updatePlayback();

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", updatePlayback);
      if (frame !== null) cancelAnimationFrame(frame);
      player.visible = false;
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
      data-film-time="0"
      data-playback-rate={FILM_SPEED}
      aria-label={label}
      title={label}
      disabled={!!reducedMotion}
      onClick={() => setPaused((value) => !value)}
    >
      <svg
        ref={svgRef}
        viewBox="-70 -80 140 150"
        aria-hidden="true"
        focusable="false"
        dangerouslySetInnerHTML={POSTER}
      />
    </button>
  );
}
