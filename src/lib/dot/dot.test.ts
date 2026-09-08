import { test } from "node:test";
import assert from "node:assert/strict";
import { DotPlayer } from "./player";
import { evaluateClip, evaluateFilm, gesture } from "./clips";
import {
  MOODS,
  PERFORMANCES,
  GESTURES,
  FILM_FRAMES,
  FILM_DURATION,
  DOT_VERSION,
  clipInfo,
  parsePreset,
  blend,
  neutral,
  type DotPose,
  type ClipId,
} from "./model";
import { renderContents, renderSvg } from "./render";

const clips: ClipId[] = [
  ...MOODS.map((m) => m.id),
  ...PERFORMANCES.map((m) => m.id),
  "film",
  "proof",
];
function numbers(p: DotPose): number[] {
  return Object.values(p).flatMap((v) =>
    typeof v === "number" ? [v] : Object.values(v),
  );
}
function check(p: DotPose) {
  assert.ok(numbers(p).every(Number.isFinite));
  assert.ok(p.scale >= 0.12 && p.scale <= 1.15);
  for (const eye of [p.left, p.right]) {
    // Conservative bounding circle includes eye corners and the curve's displacement.
    assert.ok(
      Math.hypot(eye.x, eye.y) +
        Math.hypot(eye.width / 2, eye.height / 2) +
        Math.abs(eye.curve * 5.5) <=
        50,
      `Eye exceeds body: ${JSON.stringify(eye)}`,
    );
  }
}
test("every frame of all 18 timelines has finite, contained geometry and one circular body", () => {
  for (const clip of clips)
    for (let f = 0; f < Math.round(clipInfo(clip).duration * 60); f++) {
      const p = evaluateClip(clip, f / 60);
      check(p);
      const svg = renderContents(p, { stage: "transparent" });
      assert.equal((svg.match(/data-part="body"/g) || []).length, 1);
      assert.match(svg, /<circle data-part="body" cx="0" cy="0" r="50"/);
      assert.doesNotMatch(svg, /scale\([^)]*[ ,][^)]*\)|skew|NaN|Infinity/);
    }
});
test("the 1,845-frame film closes with an identical pose and no duplicate-frame export", () => {
  assert.equal(FILM_FRAMES, 1845);
  assert.equal(FILM_DURATION, 30.75);
  assert.deepEqual(evaluateFilm(0), evaluateFilm(FILM_DURATION));
  assert.deepEqual(evaluateFilm(0), evaluateFilm((FILM_FRAMES - 1) / 60));
});
test("every mood and performance returns to the same visible loop pose", () => {
  for (const clip of [...MOODS, ...PERFORMANCES]) {
    const a = evaluateClip(clip.id, 0),
      b = evaluateClip(clip.id, clip.duration);
    a.roll %= 360;
    b.roll %= 360;
    for (const p of [a, b]) {
      if (!p.orbit) {
        p.orbitPhase = 0;
        p.orbitDensity = 3;
      }
      if (!p.satellites) p.satellitePhase = 0;
    }
    assert.ok(
      numbers(a).every((v, i) => Math.abs(v - numbers(b)[i]) < 1e-9),
      clip.id,
    );
  }
});
test("all 90 mood switches preserve the interrupted pose at early, middle and late times", () => {
  for (const a of MOODS)
    for (const b of MOODS)
      if (a.id !== b.id)
        for (const u of [0.12, 0.5, 0.84]) {
          const p = new DotPlayer();
          p.clip = a.id;
          p.time = a.duration * u;
          const before = p.pose();
          p.select(b.id);
          assert.deepEqual(p.pose(), before);
          for (let i = 0; i < 20; i++) {
            p.tick(1 / 60);
            check(p.pose());
          }
        }
});
test("pause freezes all channels, including a reaction and spring release", () => {
  const p = new DotPlayer();
  p.tick(0.1);
  p.poke();
  p.tick(0.1);
  p.startDrag();
  p.moveDrag(70, -35);
  p.endDrag();
  p.tick(0.1);
  p.pause();
  const before = p.pose();
  for (let i = 0; i < 60; i++) p.tick(1 / 60);
  assert.deepEqual(p.pose(), before);
  assert.equal(p.needsFrame, false);
});
test("an interrupted spin takes the shortest recovery arc", () => {
  const a = neutral(),
    b = neutral();
  a.roll = 350;
  b.roll = 0;
  assert.equal(blend(a, b, 0.5).roll, 355);
});
test("reduced motion preserves the selected face without any moving body or active clock", () => {
  for (const mood of MOODS) {
    const p = new DotPlayer();
    p.select(mood.id);
    p.setReduced(true);
    const before = p.pose();
    p.tick(1);
    assert.deepEqual(p.pose(), before);
    assert.equal(p.clip, mood.id);
    assert.equal(p.needsFrame, false);
    assert.equal(p.poke(), false);
    assert.equal(before.scale, 1);
    assert.equal(
      before.x + before.y + before.orbit + before.bead + before.satellites,
      0,
    );
  }
});
test("hidden stages stop and resume without catching up elapsed wall time", () => {
  const p = new DotPlayer();
  p.tick(0.1);
  p.visible = false;
  p.tick(20);
  assert.equal(p.time, 0.1);
  assert.equal(p.needsFrame, false);
  p.visible = true;
  p.tick(20);
  assert.equal(p.time, 0.2);
});
test("rapid pokes never queue, and drag stays bounded and circular", () => {
  const p = new DotPlayer();
  assert.equal(p.poke(), true);
  for (let i = 0; i < 20; i++) assert.equal(p.poke(), false);
  p.startDrag();
  p.moveDrag(10000, -10000);
  assert.ok(Math.abs(p.pose().x) <= 22);
  assert.ok(Math.abs(p.pose().y) <= 18);
  assert.equal(p.pose().scale, 1);
  p.endDrag();
  for (let i = 0; i < 50; i++) p.tick(1 / 60);
  assert.deepEqual(p.drag, { x: 0, y: 0 });
});
test("all eight gestures settle and remain within the circular rig", () => {
  for (const id of GESTURES)
    for (let f = 0; f <= 60; f++)
      check(gesture(evaluateClip("idle", 0), id, f / 60));
});
test("pointer tracking cannot push a wide expression beyond the circular face", () => {
  for (const clip of clips)
    for (const x of [-6, 6])
      for (const y of [-4, 4]) {
        const p = new DotPlayer();
        p.clip = clip;
        p.time = clipInfo(clip).poster;
        p.gaze = { x, y };
        for (let i = 0; i < 30; i++) {
          p.tick(1 / 60);
          check(p.pose());
        }
      }
});
test("seeded motion and SVG export are deterministic and transparent", () => {
  const a = evaluateClip("idle", 2, 72);
  assert.deepEqual(a, evaluateClip("idle", 2, 72));
  assert.notDeepEqual(a, evaluateClip("idle", 2, 1));
  assert.equal(renderSvg(a), renderSvg(a));
  assert.doesNotMatch(renderSvg(a, { stage: "transparent" }), /<rect/);
});
test("loop ranges reject empty, reversed, infinite and out-of-bounds ranges", () => {
  const p = new DotPlayer();
  for (const range of [
    [0, 0],
    [2, 1],
    [-1, 1],
    [0, 100],
    [0, Infinity],
  ])
    assert.throws(() => p.setRegion(range[0], range[1]));
  p.setRegion(1, 2);
  for (let i = 0; i < 121; i++) p.tick(1 / 60);
  assert.ok(p.time >= 1 && p.time < 2);
});
test("preset round trip validates the complete schema and discards unknown fields", () => {
  const p = {
    version: DOT_VERSION,
    name: "Test",
    clip: "idle",
    seed: 7,
    color: "indigo",
    stage: "paper",
    speed: 1,
    effects: true,
  };
  assert.deepEqual(parsePreset({ ...p, script: "ignored" }), p);
  for (const patch of [
    { seed: NaN },
    { clip: "<script>" },
    { color: "url(x)" },
    { name: "" },
    { speed: "1" },
    { effects: 1 },
    { version: "0" },
  ])
    assert.throws(() => parsePreset({ ...p, ...patch }));
});
