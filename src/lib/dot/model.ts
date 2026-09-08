/** Dot v2. A single radius and a single scale make body deformation impossible. */
export const DOT_VERSION = "2.0.0";
export const FPS = 60;
export const FILM_FRAMES = 1845;
export const FILM_DURATION = FILM_FRAMES / FPS;
export const COLORS = {
  indigo: "#4f46e5",
  ink: "#111111",
  paper: "#ffffff",
} as const;
export type DotColor = keyof typeof COLORS;
export type StageColor = "paper" | "night" | "transparent";
export type MoodId =
  | "idle"
  | "curious"
  | "thinking"
  | "working"
  | "excited"
  | "nervous"
  | "impatient"
  | "setback"
  | "zoomies"
  | "sleep";
export type PerformanceId =
  | "wink"
  | "surprise"
  | "notice"
  | "tiny"
  | "satellites"
  | "orbit";
export type GestureId =
  | "acknowledge"
  | "greeting"
  | "flinch"
  | "joy"
  | "annoyed"
  | "cower"
  | "wake"
  | "rally";
export type ClipId = MoodId | PerformanceId | "film" | "proof";
export type Eye = {
  x: number;
  y: number;
  width: number;
  height: number;
  angle: number;
  curve: number;
};
export type DotPose = {
  x: number;
  y: number;
  scale: number;
  roll: number;
  left: Eye;
  right: Eye;
  faceOpacity: number;
  orbit: number;
  orbitPhase: number;
  orbitDensity: number;
  bead: number;
  satellites: number;
  satellitePhase: number;
  shadow: number;
};
export const MOODS: ReadonlyArray<{
  id: MoodId;
  name: string;
  caption: string;
  duration: number;
  energy: "Quiet" | "Playful";
  poster: number;
}> = [
  {
    id: "idle",
    name: "Idle",
    caption: "Perfectly happy doing very little.",
    duration: 7,
    energy: "Quiet",
    poster: 0,
  },
  {
    id: "curious",
    name: "Curious",
    caption: "Something caught Dot’s eye.",
    duration: 5.6,
    energy: "Quiet",
    poster: 1.6,
  },
  {
    id: "thinking",
    name: "Thinking",
    caption: "Give that thought a little room.",
    duration: 5.6,
    energy: "Quiet",
    poster: 1.8,
  },
  {
    id: "working",
    name: "Working",
    caption: "A little focus goes a long way.",
    duration: 4.2,
    energy: "Quiet",
    poster: 1.4,
  },
  {
    id: "excited",
    name: "Excited",
    caption: "That feeling when it all comes together.",
    duration: 2.8,
    energy: "Playful",
    poster: 1.0,
  },
  {
    id: "nervous",
    name: "Nervous",
    caption: "A small breath. Then another.",
    duration: 2.8,
    energy: "Quiet",
    poster: 1.2,
  },
  {
    id: "impatient",
    name: "Impatient",
    caption: "Dot has been practising patience.",
    duration: 4.2,
    energy: "Playful",
    poster: 1.9,
  },
  {
    id: "setback",
    name: "Setback",
    caption: "A moment to regroup. Then try again.",
    duration: 5.6,
    energy: "Quiet",
    poster: 2.0,
  },
  {
    id: "zoomies",
    name: "Zoomies",
    caption: "Some energy simply needs somewhere to go.",
    duration: 5.6,
    energy: "Playful",
    poster: 2.5,
  },
  {
    id: "sleep",
    name: "Sleep",
    caption: "Even a little circle needs a rest.",
    duration: 9.8,
    energy: "Quiet",
    poster: 4.0,
  },
];
export const PERFORMANCES: ReadonlyArray<{
  id: PerformanceId;
  name: string;
  caption: string;
  duration: number;
  poster: number;
}> = [
  {
    id: "wink",
    name: "A little wink",
    caption: "Between you and Dot.",
    duration: 2.4,
    poster: 1,
  },
  {
    id: "surprise",
    name: "Oh, hello",
    caption: "Well, that was unexpected.",
    duration: 2.4,
    poster: 0.9,
  },
  {
    id: "notice",
    name: "A new arrival",
    caption: "There’s always something to notice.",
    duration: 2.8,
    poster: 1.2,
  },
  {
    id: "tiny",
    name: "Small moment",
    caption: "Still Dot. Just a little further away.",
    duration: 3.2,
    poster: 1.5,
  },
  {
    id: "satellites",
    name: "Good company",
    caption: "A little company, a little orbit.",
    duration: 3.8,
    poster: 1.6,
  },
  {
    id: "orbit",
    name: "Around we go",
    caption: "A small celebration with a wide orbit.",
    duration: 5.6,
    poster: 2.9,
  },
];
export const GESTURES: readonly GestureId[] = [
  "acknowledge",
  "greeting",
  "flinch",
  "joy",
  "annoyed",
  "cower",
  "wake",
  "rally",
];
export function clipInfo(id: ClipId) {
  if (id === "film")
    return {
      id,
      name: "A day with Dot",
      caption: "A little curiosity. A little chaos. Always Dot.",
      duration: FILM_DURATION,
      poster: 0,
    };
  if (id === "proof")
    return {
      id,
      name: "The first hello",
      caption: "A glance, a wink, a little recovery.",
      duration: 5,
      poster: 1.6,
    };
  return [...MOODS, ...PERFORMANCES].find((m) => m.id === id)!;
}
export function isClipId(value: unknown): value is ClipId {
  return (
    typeof value === "string" &&
    (
      [
        "film",
        "proof",
        ...MOODS.map((m) => m.id),
        ...PERFORMANCES.map((m) => m.id),
      ] as string[]
    ).includes(value)
  );
}
export function neutral(): DotPose {
  return {
    x: 0,
    y: 0,
    scale: 1,
    roll: 0,
    left: { x: -12, y: -12, width: 7.3, height: 18, angle: -14, curve: 0 },
    right: { x: 11, y: -14, width: 7.1, height: 17, angle: -14, curve: 0 },
    faceOpacity: 1,
    orbit: 0,
    orbitPhase: 0,
    orbitDensity: 3,
    bead: 0,
    satellites: 0,
    satellitePhase: 0,
    shadow: 0,
  };
}
export const clamp = (v: number, min = 0, max = 1) =>
  Math.max(min, Math.min(max, v));
export const mix = (a: number, b: number, t: number) => a + (b - a) * t;
export const smooth = (t: number) => {
  const x = clamp(t);
  return x * x * (3 - 2 * x);
};
export function envelope(
  t: number,
  a: number,
  b: number,
  c: number,
  d: number,
) {
  return (
    smooth((t - a) / Math.max(0.001, b - a)) *
    (1 - smooth((t - c) / Math.max(0.001, d - c)))
  );
}
/** Stable hash: no wall clock or mutable random source in the motion model. */
export function random(seed: number, key: number) {
  let x = (seed | 0) ^ Math.imul(key + 1, 0x9e3779b9);
  x ^= x >>> 16;
  x = Math.imul(x, 0x7feb352d);
  x ^= x >>> 15;
  return (x >>> 0) / 4294967296;
}
export function blend(a: DotPose, b: DotPose, amount: number): DotPose {
  const t = clamp(amount),
    p = neutral();
  for (const key of Object.keys(p) as (keyof DotPose)[]) {
    if (key === "left" || key === "right") {
      for (const e of Object.keys(p[key]) as (keyof Eye)[])
        p[key][e] = mix(a[key][e], b[key][e], t);
    } else if (key === "roll") {
      const delta = ((((b.roll - a.roll + 540) % 360) + 360) % 360) - 180;
      p.roll = a.roll + delta * t;
    } else p[key] = mix(a[key], b[key], t);
  }
  return p;
}
export type DotPreset = {
  version: typeof DOT_VERSION;
  name: string;
  clip: ClipId;
  seed: number;
  color: DotColor;
  stage: StageColor;
  speed: number;
  effects: boolean;
};
export function parsePreset(value: unknown): DotPreset {
  if (!value || typeof value !== "object")
    throw new Error("Choose a Dot preset file.");
  const p = value as Record<string, unknown>;
  if (p.version !== DOT_VERSION)
    throw new Error("This preset uses a different Dot version.");
  if (
    !isClipId(p.clip) ||
    typeof p.seed !== "number" ||
    !Number.isInteger(p.seed) ||
    p.seed < 0 ||
    p.seed > 2147483647
  )
    throw new Error("This preset has an unsupported performance or seed.");
  if (p.color !== "indigo" && p.color !== "ink" && p.color !== "paper")
    throw new Error("Choose an indigo, ink, or paper Dot.");
  if (p.stage !== "paper" && p.stage !== "night" && p.stage !== "transparent")
    throw new Error("This background is not supported.");
  if (
    ![0.25, 0.5, 1].includes(Number(p.speed)) ||
    typeof p.speed !== "number" ||
    typeof p.effects !== "boolean"
  )
    throw new Error("This preset has unsupported playback settings.");
  if (typeof p.name !== "string" || !p.name.trim() || p.name.length > 60)
    throw new Error("Give the preset a name of 1–60 characters.");
  return {
    version: DOT_VERSION,
    name: p.name.trim(),
    clip: p.clip,
    seed: p.seed,
    color: p.color,
    stage: p.stage,
    speed: p.speed,
    effects: p.effects,
  };
}
