import { test } from "node:test";
import assert from "node:assert/strict";
import { CHAPTERS, chapterAt, evaluateFilm } from "./clips";
import { FILM_DURATION, FILM_FRAMES, FPS } from "./model";
import { DotPlayer } from "./player";
import { renderContents } from "./render";

function filmPlayer() {
  const player = new DotPlayer();
  player.clip = "film";
  player.speed = 1.4;
  return player;
}

test("the complete film keeps finite circular geometry and a transparent stage", () => {
  assert.equal(FILM_FRAMES, 1845);
  assert.equal(FILM_DURATION, 30.75);
  for (let frame = 0; frame < FILM_FRAMES; frame++) {
    const pose = evaluateFilm(frame / FPS);
    const numbers = Object.values(pose).flatMap((value) =>
      typeof value === "number" ? [value] : Object.values(value),
    );
    assert.ok(numbers.every(Number.isFinite));
    for (const eye of [pose.left, pose.right]) {
      assert.ok(
        Math.hypot(eye.x, eye.y) + Math.hypot(eye.width / 2, eye.height / 2) +
          Math.abs(eye.curve * 5.5) <= 50,
        `Eye outside body at frame ${frame}`,
      );
    }
    const svg = renderContents(pose, { stage: "transparent", effects: true });
    assert.equal((svg.match(/data-part="body"/g) ?? []).length, 1);
    assert.match(svg, /<circle data-part="body" cx="0" cy="0" r="50"/);
    assert.doesNotMatch(svg, /<rect|data-part="shadow"|NaN|Infinity/);
  }
});

test("1.4× playback visits every authored chapter and loops in 21.964 seconds", () => {
  const player = filmPlayer();
  const visited = new Set<string>();
  const realDuration = FILM_DURATION / player.speed;
  let elapsed = 0;
  while (elapsed < realDuration - 1e-9) {
    visited.add(chapterAt(player.time).name);
    const delta = Math.min(1 / FPS, realDuration - elapsed);
    player.tick(delta);
    elapsed += delta;
  }
  // Account for floating-point rounding at the exact endpoint.
  player.tick(1e-8);
  assert.deepEqual([...visited], CHAPTERS.map((chapter) => chapter.name));
  assert.ok(player.time < 1e-6);
  assert.deepEqual(evaluateFilm(0), evaluateFilm(FILM_DURATION));
  assert.deepEqual(evaluateFilm(0), evaluateFilm((FILM_FRAMES - 1) / FPS));
});

test("pause and offscreen suspension retain film position and resume at 1.4×", () => {
  const player = filmPlayer();
  player.time = 19.5;
  for (const suspend of ["paused", "hidden"] as const) {
    player.playing = suspend !== "paused";
    player.visible = suspend !== "hidden";
    const before = player.pose();
    assert.equal(player.needsFrame, false);
    player.tick(60);
    assert.deepEqual(player.pose(), before);
  }
  player.visible = true;
  player.play();
  player.tick(0.1);
  assert.ok(Math.abs(player.time - 19.64) < 1e-9);
});

test("reduced motion shows a still full-size Dot and stops the film clock", () => {
  const player = filmPlayer();
  player.time = 20;
  player.setReduced(true);
  const still = player.pose();
  assert.equal(player.needsFrame, false);
  assert.equal(still.scale, 1);
  assert.equal(still.orbit + still.bead + still.satellites, 0);
  player.tick(1);
  assert.equal(player.time, 20);
  assert.deepEqual(player.pose(), still);
  player.setReduced(false);
  player.play();
  assert.equal(player.needsFrame, true);
  assert.deepEqual(player.pose(), evaluateFilm(20));
});
