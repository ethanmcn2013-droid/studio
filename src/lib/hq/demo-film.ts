/**
 * Demo film, the production scaffold for the hero product film.
 *
 * This is a buildable brief, not the rendered film. It distills the Film
 * System (public/brand/motion-brief.html) into one executable shot list a
 * motion designer, or the founder on the Remotion pipeline, can build. The
 * technical precedent already exists: the analytics-demo repo renders a 30s
 * Remotion film (900 frames @ 30fps, horizontal + vertical), and this film
 * follows the same spec.
 *
 * Honesty contract: the film is NOT shot. This scaffold is the script +
 * storyboard + spec; the page says so and the production checklist tracks
 * what's left. Pure + client-safe (no server-only import).
 *
 * Source of truth for the motion language: motion-brief.html. If the brief
 * changes, reconcile here, don't let the two drift.
 */

export const FILM_META = {
  title: "One Wedding, Four Views",
  kind: "Hero product demo film",
  logline:
    "A venue coordinator runs a whole wedding through Signal Studio, a thought captured, turned into action, shown on a timeline, and surfaced as the one thing that needs attention, and it all resolves to the dot.",
  why:
    "The venue wedge needs a 30-second film that makes the four-products-one-system idea felt, not explained. It doubles as the homepage loop and the top of the market-entry deck.",
  status: "scaffold" as const,
  statusLabel: "Scaffold + Remotion skeleton ready · per-scene UI + render pending",
  revisedOn: "2026-06-20",
  // The buildable Remotion project, sibling to analytics-demo.
  build: {
    project: "demo-film/, standalone Remotion project (sibling of analytics-demo)",
    run: "npm install && npm start (Remotion Studio)",
    state:
      "Skeleton typechecks; both compositions (1920×1080 + 1080×1920, 900 frames) register and bundle. The five gestures and all seven scenes are wired; per-scene product UI is fill-in-the-shots. Render needs the Mac/motion pipeline.",
  },
  spec: {
    duration: "30s",
    frames: "900 frames @ 30fps",
    formats: "1920×1080 (hero) + 1080×1920 (vertical cut)",
    tool: "Remotion 4.x (same pipeline as analytics-demo)",
    type: "Geist / Geist Mono via @remotion/google-fonts",
    palette: "one indigo #4f46e5 on paper #fafaf7, never pure white",
    sound: "minimal, soft key taps, one indigo chime on the dot resolve",
  },
  livesAt: [
    "signalstudio.ie homepage loop",
    "top of the market-entry deck",
    "venue outreach + social cuts (vertical)",
  ],
  references: [
    { label: "The Film System, motion brief", href: "/brand/motion-brief.html", external: false },
    { label: "Technical precedent, analytics demo", href: "https://analytics.signalstudio.ie/demo", external: true },
  ] as Array<{ label: string; href: string; external: boolean }>,
};

/** The five-gesture motion alphabet, distilled from the brief. One per product, plus the dot. */
export const MOTION_GRAMMAR: Array<{ gesture: string; product: string; note: string }> = [
  { gesture: "The dot", product: "Signal Studio", note: "The hero. Everything opens and resolves here, one indigo dot, breathing." },
  { gesture: "The caret", product: "Notes", note: "A held thought awaiting input, the blink that becomes a capture." },
  { gesture: "The strikethrough", product: "Tasks", note: "Done, drawn across the word itself, the satisfying close." },
  { gesture: "Extrude + milestone", product: "Timeline", note: "A lane extends into the future; a diamond marks the date." },
  { gesture: "The heartbeat", product: "Signal", note: "A single pulse, the one thing that needs a human now." },
];

export type Scene = {
  t: string; // timecode window
  beat: string; // what the viewer sees
  gesture: string; // which motion-alphabet gesture leads
  caption: string; // words allowed on screen (kept to the brief's short list)
  sound: string;
};

export const STORYBOARD: Scene[] = [
  {
    t: "0:00–0:03",
    beat: "Paper. Silence. The indigo dot fades up and breathes once.",
    gesture: "The dot",
    caption: "Signal Studio.",
    sound: "room tone → one soft indigo chime",
  },
  {
    t: "0:03–0:07",
    beat: "A wedding enquiry is captured in three seconds, a line of text lands in Notes.",
    gesture: "The caret",
    caption: "Capture the thought.",
    sound: "two soft key taps",
  },
  {
    t: "0:07–0:12",
    beat: "The note becomes an owned, dated task list, the run-sheet writes itself.",
    gesture: "The strikethrough",
    caption: "Turn it into action.",
    sound: "a single completed-task tick",
  },
  {
    t: "0:12–0:17",
    beat: "The wedding lays out on a Timeline and is shared with the couple, a diamond on the date.",
    gesture: "Extrude + milestone",
    caption: "Show where it's going.",
    sound: "a low extend swell",
  },
  {
    t: "0:17–0:22",
    beat: "Signal surfaces the one thing due today, everything else falls quiet.",
    gesture: "The heartbeat",
    caption: "Surface what matters.",
    sound: "one pulse",
  },
  {
    t: "0:22–0:26",
    beat: "The four views collapse into one calm screen. The status meeting that never had to happen.",
    gesture: "The dot",
    caption: "Four products, one system.",
    sound: "the taps settle to silence",
  },
  {
    t: "0:26–0:30",
    beat: "Everything resolves back to the single breathing dot on paper.",
    gesture: "The dot",
    caption: "Calm coordination. signalstudio.ie",
    sound: "the indigo chime returns, once",
  },
];

export type ProdStatus = "done" | "todo" | "blocked";

export const PRODUCTION: Array<{ step: string; status: ProdStatus; note?: string }> = [
  { step: "Logline + concept locked", status: "done" },
  { step: "Storyboard / shot list (this scaffold)", status: "done" },
  { step: "Motion language reconciled with the Film System brief", status: "done" },
  { step: "Remotion composition skeleton, scenes + motion alphabet wired", status: "done", note: "demo-film/ · typechecks, both compositions register" },
  { step: "Founder sign-off on script + captions", status: "todo" },
  { step: "Fill in per-scene product UI mockups (replace placeholders)", status: "todo" },
  { step: "Render the hero cut (1920×1080) on the pipeline", status: "blocked", note: "needs the Mac / motion pipeline" },
  { step: "Vertical cut (1080×1920) for social + outreach", status: "blocked", note: "follows the hero cut" },
  { step: "Sound pass (taps, swell, indigo chime)", status: "todo" },
  { step: "Render + poster still; review gate", status: "todo" },
  { step: "Wire as the homepage loop + deck opener", status: "todo" },
];

export function productionProgress() {
  const done = PRODUCTION.filter((p) => p.status === "done").length;
  return { done, total: PRODUCTION.length };
}
