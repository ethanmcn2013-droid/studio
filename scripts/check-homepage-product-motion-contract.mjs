import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = (path) => readFileSync(new URL(path, import.meta.url), "utf8");

const relay = read("../src/components/reveal/reveal-product-relay.tsx");
const thread = read("../src/components/reveal/homepage-proof-thread.tsx");
const threadCss = read(
  "../src/components/reveal/homepage-proof-thread.module.css",
);
const boundary = read(
  "../src/components/marketing/delight/marketing-preview-motion.tsx",
);
const manifesto = read("../src/components/reveal/reveal-manifesto.tsx");
const wedding = read("../src/components/reveal/reveal-wedding-wedge.tsx");
const globals = read("../src/app/globals.css");
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
assert.match(
  relay,
  /<MarketingPreviewMotion[\s\S]*?product=\{chapter\.key\}[\s\S]*?startDelayMs=\{420\}/,
);
for (const hero of [
  "NotesBeforeItLeaves",
  "TasksTheBoard",
  "TimelineTheLine",
  "SignalTheRead",
]) {
  assert.match(relay, new RegExp(`<${hero}[\\s\\S]*?embedded`));
}

// The page carries one compact context and trust row, then four reduced
// chapters in the canonical suite order.
assert.equal(
  relay.match(/Real interfaces\. Fixed sample data\. No customer data\./g)
    ?.length,
  1,
);
assert.doesNotMatch(relay, /Sample product view|chapter\.number|number:\s*"0/);
assert.doesNotMatch(manifesto, /Built for the <strong>80%/);
assert.match(relay, /id=\{`relay-\$\{chapter\.key\}`\}/);
let previousProduct = -1;
for (const product of ["notes", "tasks", "timeline", "signal"]) {
  const productIndex = relay.indexOf(`key: "${product}"`);
  assert.ok(productIndex > previousProduct);
  previousProduct = productIndex;
}
for (const state of [
  "Private source",
  "Owned commitment",
  "Public milestone",
  "Sourced briefing",
]) {
  assert.match(relay, new RegExp(state));
}
for (const cta of [
  "See Signal Notes",
  "See Signal Tasks",
  "See Signal Timeline",
  "See Signal",
]) {
  assert.match(relay, new RegExp(cta));
}

// One observer records chapter crossings once; keyboard users get stable
// anchors, an explicit current label, and a skip path to the final receipt.
assert.equal(thread.match(/new IntersectionObserver/g)?.length, 1);
assert.match(thread, /href=\{`#relay-\$\{step\.key\}`\}/);
assert.match(thread, /Skip product proofs/);
assert.match(thread, /aria-current=\{isCurrent \? "step"/);
assert.match(thread, /\{isCurrent \? "Current" : hasArrived \? "Passed" : "Ahead"\}/);
assert.match(thread, /id="relay-receipt"/);
assert.match(thread, /One detail, accounted for\./);
assert.match(
  thread,
  /Private source[\s\S]*?owned commitment[\s\S]*?public milestone[\s\S]*?sourced briefing/,
);
assert.match(
  thread,
  /The source stayed private\. Every handoff kept its owner and receipt\./,
);
assert.match(
  threadCss,
  /proof-crossing-arrive 300ms var\(--ease-out\) 120ms both/,
);
assert.match(threadCss, /@media \(prefers-reduced-motion: reduce\)/);
assert.match(
  threadCss,
  /\.sequence\[data-active-proof="receipt"\] \.chapterList[\s\S]*?visibility:\s*hidden/,
);
assert.match(
  threadCss,
  /\.sequence\[data-active-proof="receipt"\] \.receiptDot[\s\S]*?opacity:\s*1/,
);
assert.match(
  wedding,
  /From the first venue note to the final headcount\./,
);
assert.match(wedding, /See Signal Studio for weddings/);

// Motion starts in the reading zone, remains deterministic for reduced-motion
// visitors, and exposes observable state for browser verification.
assert.match(boundary, /new IntersectionObserver/);
assert.match(boundary, /rootMargin:\s*"0px 0px -18% 0px"/);
assert.match(boundary, /useReducedMotion/);
assert.match(boundary, /data-motion-state=\{motionState\}/);
assert.match(boundary, /data-relay-motion/);
assert.match(boundary, /window\.setTimeout/);
assert.match(
  boundary,
  /createContext<PreviewMotionContextValue>\(\{[\s\S]*?hasStarted:\s*true,[\s\S]*?isVisible:\s*true/,
);

// Each product keeps its native choreography. Tasks additionally pauses its
// scripted scene loop once the embedded proof leaves the viewport.
assert.match(notes, /data-motion-started="true"/);
assert.doesNotMatch(notes, /grid-template-rows/);
assert.match(notes, /\.bil-item-source \.bil-item-inner/);
assert.match(tasks, /staticFrame=\{embedded && !previewMotion\.hasStarted\}/);
assert.match(tasks, /tasks-compact-proof/);
assert.match(tasks, /Commitment completed/);
assert.match(tasks, /homepageEmbedded=\{embedded\}/);
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
assert.match(
  signal,
  /not\(\[data-motion-started="true"\]\) \.rd-embedded \.rd-headline/,
);
assert.match(relay, /aria-hidden="true"[\s\S]*?inert/);
assert.match(globals, /content-visibility:\s*auto/);

console.log(
  "[homepage-product-motion-contract] ok (proof thread, four live proofs, editorial scale, accessible figures, compact mobile Tasks, receipt)",
);
