"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { evaluateFilm } from "@/lib/dot/clips";
import { DotPlayer } from "@/lib/dot/player";
import { paintContents, renderContents, type RenderOptions } from "@/lib/dot/render";

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

/* The artwork's box, in its own units: the SVG's viewBox and the canvas's frame. */
const BOX = { x: -70, y: -80, w: 140, h: 150 };

/**
 * The complete Dot Studio v2 film. One visible-only clock preserves the
 * authored sequence and pause position.
 *
 * The first frame is the film's own SVG, in the server's markup, and it is
 * all that reduced motion ever shows. The film itself is painted on a canvas
 * laid over it, from the same poses and the same paths (paintContents). It
 * used to replace the SVG's contents every frame, which had the browser
 * style and lay the page out sixty times a second while the footer was on
 * screen: about a quarter of the main thread. Painting a canvas does
 * neither. The clock still stops when the mascot is off screen, when the tab
 * is hidden and when it is paused.
 */
export function FooterDot() {
  const stageRef = useRef<HTMLButtonElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const playerRef = useRef<DotPlayer | null>(null);
  const [paused, setPaused] = useState(false);
  const reducedMotion = useSyncExternalStore(
    subscribeToMotionPreference,
    prefersReducedMotion,
    staticServerSnapshot,
  );

  useEffect(() => {
    const stage = stageRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!stage || !canvas || !ctx || reducedMotion) return;
    const player = (playerRef.current ??= new DotPlayer());
    player.clip = "film";
    player.speed = FILM_SPEED;
    player.loop = true;
    player.setReduced(false);
    player.playing = !paused;
    let intersecting = false;
    let frame: number | null = null;
    let lastTime: number | null = null;
    let width = 0;
    let height = 0;
    /* The canvas takes the button's size and the screen's density once, and again only
       when the button's size changes: never inside a frame. */
    const fit = () => {
      const box = stage.getBoundingClientRect();
      const density = Math.min(3, window.devicePixelRatio || 1);
      width = Math.max(1, Math.round(box.width * density));
      height = Math.max(1, Math.round(box.height * density));
      canvas.width = width;
      canvas.height = height;
      draw();
    };
    const draw = () => {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, width, height);
      // The same fit as the SVG: the whole box, centred, never stretched.
      const scale = Math.min(width / BOX.w, height / BOX.h);
      ctx.setTransform(scale, 0, 0, scale, (width - BOX.w * scale) / 2 - BOX.x * scale, (height - BOX.h * scale) / 2 - BOX.y * scale);
      paintContents(ctx, player.pose(), ARTWORK);
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
      stage.dataset.filmTime = player.time.toFixed(3);
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
    const resize = new ResizeObserver(fit);
    resize.observe(stage);
    document.addEventListener("visibilitychange", updatePlayback);
    fit();
    // From here the canvas is the picture and the SVG under it steps back.
    stage.dataset.painted = "true";
    updatePlayback();

    return () => {
      observer.disconnect();
      resize.disconnect();
      document.removeEventListener("visibilitychange", updatePlayback);
      if (frame !== null) cancelAnimationFrame(frame);
      player.visible = false;
      stage.dataset.running = "false";
      stage.dataset.filmTime = player.time.toFixed(3);
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
        viewBox={`${BOX.x} ${BOX.y} ${BOX.w} ${BOX.h}`}
        aria-hidden="true"
        focusable="false"
        dangerouslySetInnerHTML={POSTER}
      />
      <canvas ref={canvasRef} aria-hidden="true" />
    </button>
  );
}
