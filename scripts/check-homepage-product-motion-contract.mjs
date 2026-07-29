import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = (path) => readFileSync(new URL(path, import.meta.url), "utf8");

const relay = read("../src/components/reveal/reveal-product-relay.tsx");
const boundary = read(
  "../src/components/marketing/delight/marketing-preview-motion.tsx",
);
const notes = read(
  "../src/components/marketing/heroes/notes/before-it-leaves.tsx",
);
const tasks = read("../src/components/marketing/heroes/tasks/hero.tsx");
const tasksDemo = read(
  "../src/components/marketing/heroes/tasks/showcase/cinematic-demo.tsx",
);
const timeline = read(
  "../src/components/marketing/heroes/timeline/the-line.tsx",
);
const signal = read(
  "../src/components/marketing/heroes/signal/the-read.tsx",
);

// The homepage must render the real product artifacts inside one shared
// visibility boundary. A still thumbnail is not an acceptable substitute.
assert.match(relay, /<MarketingPreviewMotion product=\{chapter\.key\}>/);
for (const hero of [
  "NotesBeforeItLeaves",
  "TasksTheBoard",
  "TimelineTheLine",
  "SignalTheRead",
]) {
  assert.match(relay, new RegExp(`<${hero}[\\s\\S]*?embedded`));
}

// Motion starts in the reading zone, remains deterministic for reduced-motion
// visitors, and exposes observable state for browser verification.
assert.match(boundary, /new IntersectionObserver/);
assert.match(boundary, /rootMargin:\s*"0px 0px -18% 0px"/);
assert.match(boundary, /useReducedMotion/);
assert.match(boundary, /data-motion-state=\{motionState\}/);
assert.match(boundary, /data-relay-motion/);
assert.match(
  boundary,
  /createContext<PreviewMotionContextValue>\(\{[\s\S]*?hasStarted:\s*true,[\s\S]*?isVisible:\s*true/,
);

// Each product keeps its native choreography. Tasks additionally pauses its
// scripted scene loop once the embedded proof leaves the viewport.
assert.match(notes, /data-motion-started="true"/);
assert.match(tasks, /staticFrame=\{embedded && !previewMotion\.hasStarted\}/);
assert.match(
  tasks,
  /embedded &&[\s\S]*?previewMotion\.hasStarted &&[\s\S]*?!previewMotion\.isVisible/,
);
assert.match(
  tasksDemo,
  /while \(remaining > 0 && aliveRef\.current\)[\s\S]*?pausedRef\.current/,
);
assert.match(tasksDemo, /data-cinematic-demo-snapshot/);
assert.match(timeline, /embedded \? previewMotion\.hasStarted : opened/);
assert.match(timeline, /animation-play-state:\s*paused !important/);
assert.match(signal, /data-motion-visible="false"/);

console.log(
  "[homepage-product-motion-contract] ok (four live proofs, reading-zone start, reduced-motion settlement, offscreen pause)",
);
