/**
 * Dot — the character's complete movement vocabulary.
 *
 * Ported faithfully from the ratified model sheet ("Meet Dot · Model Sheet
 * No. 01", Claude Design, direction locked 2026-07-06). Ten mood loops
 * authored on a 1.4s bar, eight micro-gestures, and the pure builders that
 * turn pose tables into WAAPI keyframes.
 *
 * The Laws of Dot that this data obeys:
 * - transform-only (translate / rotate / skewX / scale), volume held
 *   through every squash and stretch (impact frames exempt);
 * - the shadow is DERIVED from the body pose (shDerive), so it can never
 *   desync from the body;
 * - fear and defeat may shrink (nervous, cower are the scoped exemptions);
 * - rotation only when airborne (zoomies is the only spinner).
 *
 * Do not tune numbers here casually: they are the calibrated performance.
 */

export type EaseKey =
  | "io" | "i" | "o" | "l"
  | "pop" | "hang" | "snap" | "rise" | "dive" | "back" | "set" | "peek" | "out";

export const EASE: Record<EaseKey, string> = {
  io: "ease-in-out", i: "ease-in", o: "ease-out", l: "linear",
  pop: "cubic-bezier(.2,1,.4,1)", hang: "cubic-bezier(.2,.9,.4,1)", // ds-allow, Dot character choreography, model-sheet canon
  snap: "cubic-bezier(.3,0,.2,1)", rise: "cubic-bezier(.17,.84,.44,1)", // ds-allow, Dot character choreography, model-sheet canon
  dive: "cubic-bezier(.5,0,.9,.4)", back: "cubic-bezier(.3,1.3,.4,1)", // ds-allow, Dot character choreography, model-sheet canon
  set: "cubic-bezier(.3,1,.5,1)", peek: "cubic-bezier(.2,1.8,.4,1)", // ds-allow, Dot character choreography, model-sheet canon
  out: "cubic-bezier(.25,.8,.3,1)", // ds-allow, Dot character choreography, model-sheet canon
};

/** One authored pose: percent of the loop plus transform deltas. */
export interface Pose {
  t: number;
  x?: number;
  y?: number;
  sx?: number;
  sy?: number;
  k?: number; // skewX degrees
  r?: number; // rotate degrees (airborne only)
  e?: EaseKey;
  o?: number; // opacity, used by the excited droplet only
}

export type MoodKey =
  | "idle" | "curious" | "thinking" | "working" | "excited"
  | "nervous" | "impatient" | "setback" | "zoomies" | "sleep";

export type GestureKey =
  | "acknowledge" | "greeting" | "flinch" | "joy"
  | "annoyed" | "cower" | "wake" | "rally";

/* ── The ten loops (idle is generated per-loop, see buildIdlePoses) ── */

export const FRAMES: Partial<Record<MoodKey, Pose[]>> = {
  curious: [
    { t: 0, e: "io" }, { t: 6, e: "peek" },
    { t: 9, y: -3, sx: 0.96, sy: 1.05, e: "o" },
    { t: 13, sx: 1.03, sy: 0.97, e: "io" },
    { t: 18, e: "io" },
    { t: 26, x: 9, sx: 1.06, sy: 0.96, k: -9, e: "io" },
    { t: 33, x: 13, sx: 1.12, sy: 0.93, k: -11, e: "io" },
    { t: 38, x: 5, sx: 1.02, sy: 0.99, k: -4, e: "io" },
    { t: 44, x: 4, y: 1, sx: 1.16, sy: 0.85, k: -3, e: "i" },
    { t: 49, x: 27, y: -19, sx: 1.22, sy: 0.8, k: -12, e: "hang" },
    { t: 52, x: 44, y: -7, sx: 1.14, sy: 0.87, k: -7, e: "i" },
    { t: 55, x: 48, y: 1, sx: 1.24, sy: 0.79, e: "pop" },
    { t: 59, x: 48, y: -3, sx: 0.95, sy: 1.07, e: "io" },
    { t: 63, x: 48, sx: 1.03, sy: 0.98, e: "io" },
    { t: 67, x: 48, y: -2, sx: 0.975, sy: 1.045, e: "io" },
    { t: 72, x: 48, y: -2, sx: 0.975, sy: 1.045, k: 3, e: "io" },
    { t: 76, x: 48, sx: 1.04, sy: 0.97, e: "io" },
    { t: 81, x: 46, y: 1, sx: 1.14, sy: 0.87, k: 4, e: "i" },
    { t: 85, x: 24, y: -16, sx: 1.2, sy: 0.82, k: 10, e: "hang" },
    { t: 88, x: 4, y: -6, sx: 1.13, sy: 0.88, k: 5, e: "i" },
    { t: 90, y: 1, sx: 1.2, sy: 0.83, e: "pop" },
    { t: 94, y: -2, sx: 0.97, sy: 1.04, e: "io" },
    { t: 100 },
  ],
  thinking: [
    { t: 0, e: "io" }, { t: 6, e: "io" },
    { t: 12, y: 1, sx: 1.055, sy: 0.925, e: "io" },
    { t: 16, y: 1, sx: 1.06, sy: 0.918, e: "io" },
    { t: 22, y: 0.7, sx: 1.05, sy: 0.928, e: "io" },
    { t: 28, y: 1, sx: 1.062, sy: 0.916, e: "io" },
    { t: 34, y: 0.7, sx: 1.052, sy: 0.926, e: "io" },
    { t: 40, y: 1, sx: 1.06, sy: 0.918, e: "io" },
    { t: 44, x: -1, y: 1, sx: 1.06, sy: 0.918, k: 3, e: "io" },
    { t: 48, x: 1, y: 1, sx: 1.06, sy: 0.918, k: -3, e: "io" },
    { t: 52, y: 1.5, sx: 1.09, sy: 0.89, e: "rise" },
    { t: 56, y: -18, sx: 0.86, sy: 1.18, e: "hang" },
    { t: 60, y: -19.5, sx: 0.94, sy: 1.075, e: "io" },
    { t: 63, y: -18.5, sx: 0.985, sy: 1.02, e: "i" },
    { t: 67, sx: 1.12, sy: 0.9, e: "pop" },
    { t: 72, y: -4, sx: 0.965, sy: 1.045, e: "io" },
    { t: 77, sx: 1.02, sy: 0.99, e: "io" },
    { t: 82, y: -1, sx: 0.988, sy: 1.018, e: "io" },
    { t: 90, y: -0.5, sx: 0.996, sy: 1.008, e: "io" },
    { t: 95, sx: 1.004, sy: 0.998, e: "io" },
    { t: 100 },
  ],
  working: [
    { t: 0, e: "io" },
    { t: 6, x: 1.5, sx: 1.04, sy: 0.965, k: -7, e: "io" },
    { t: 12, x: 1.5, y: 0.7, sx: 1.085, sy: 0.92, k: -7, e: "snap" },
    { t: 17, x: 1.5, sx: 1.03, sy: 0.972, k: -7, e: "snap" },
    { t: 23, x: 1.5, y: 0.7, sx: 1.085, sy: 0.92, k: -7, e: "snap" },
    { t: 28, x: 1.5, sx: 1.03, sy: 0.972, k: -7, e: "snap" },
    { t: 34, x: 1.5, y: 0.7, sx: 1.085, sy: 0.92, k: -7, e: "snap" },
    { t: 39, x: 1.5, sx: 1.04, sy: 0.965, k: -7, e: "io" },
    { t: 42, y: -0.8, sx: 0.985, sy: 1.02, e: "io" },
    { t: 45, x: -1.5, sx: 1.04, sy: 0.965, k: 7, e: "io" },
    { t: 51, x: -1.5, y: 0.7, sx: 1.085, sy: 0.92, k: 7, e: "snap" },
    { t: 56, x: -1.5, sx: 1.03, sy: 0.972, k: 7, e: "snap" },
    { t: 62, x: -1.5, y: 0.7, sx: 1.085, sy: 0.92, k: 7, e: "snap" },
    { t: 67, x: -1.5, sx: 1.03, sy: 0.972, k: 7, e: "snap" },
    { t: 73, x: -1.5, y: 0.7, sx: 1.085, sy: 0.92, k: 7, e: "snap" },
    { t: 78, x: -1.5, sx: 1.04, sy: 0.965, k: 7, e: "io" },
    { t: 84, y: -1.8, sx: 0.975, sy: 1.04, e: "set" },
    { t: 92, y: 0.5, sx: 1.03, sy: 0.975, e: "io" },
    { t: 100 },
  ],
  excited: [
    { t: 0, e: "io" }, { t: 5, e: "io" },
    { t: 8, x: -2, sx: 1.01, sy: 0.99, k: 2, e: "io" },
    { t: 11, x: 2, sx: 1.01, sy: 0.99, k: -2, e: "io" },
    { t: 14, x: -1.5, sx: 1.01, sy: 0.99, k: 1, e: "io" },
    { t: 17, e: "i" },
    { t: 22, y: 2, sx: 1.18, sy: 0.855, e: "rise" },
    { t: 28, y: -34, sx: 0.84, sy: 1.2, e: "o" },
    { t: 33, y: -50, sx: 0.93, sy: 1.09, e: "io" },
    { t: 37, y: -54, sx: 0.985, sy: 1.02, e: "i" },
    { t: 44, y: -20, sx: 0.9, sy: 1.13, e: "i" },
    { t: 48, sx: 1.34, sy: 0.68, e: "hang" },
    { t: 54, y: -20, sx: 0.92, sy: 1.1, e: "i" },
    { t: 60, sx: 1.18, sy: 0.85, e: "pop" },
    { t: 65, y: -7, sx: 0.97, sy: 1.04, e: "i" },
    { t: 70, sx: 1.07, sy: 0.945, e: "pop" },
    { t: 77, y: -1, sx: 0.99, sy: 1.02, e: "io" },
    { t: 85, sx: 1.015, sy: 0.99, e: "io" },
    { t: 93, sx: 0.998, sy: 1.004, e: "io" },
    { t: 100 },
  ],
  nervous: [
    { t: 0, e: "io" }, { t: 5, e: "io" },
    { t: 9, x: -2.5, sx: 0.98, sy: 0.98, e: "io" },
    { t: 13, x: 2.5, sx: 0.965, sy: 0.965, e: "io" },
    { t: 17, x: -2.5, sx: 0.95, sy: 0.95, e: "io" },
    { t: 21, x: 2, sx: 0.94, sy: 0.94, e: "io" },
    { t: 25, x: -1.5, sx: 0.93, sy: 0.93, e: "o" },
    { t: 30, y: 1.2, sx: 0.9, sy: 0.86, e: "io" },
    { t: 38, x: 0.7, y: 1.2, sx: 0.9, sy: 0.86, e: "io" },
    { t: 42, x: -0.7, y: 1.2, sx: 0.9, sy: 0.86, e: "io" },
    { t: 46, y: 1.2, sx: 0.9, sy: 0.86, e: "io" },
    { t: 56, y: 0.5, sx: 0.93, sy: 0.99, e: "io" },
    { t: 64, y: -2, sx: 0.96, sy: 1.06, e: "io" },
    { t: 72, sx: 1.04, sy: 0.99, e: "io" },
    { t: 80, sx: 0.99, sy: 1.01, e: "io" },
    { t: 90, sx: 1.005, sy: 0.998, e: "io" },
    { t: 100 },
  ],
  impatient: [
    { t: 0, e: "snap" },
    { t: 4, y: -6, sx: 0.95, sy: 1.07, e: "snap" },
    { t: 8, sx: 1.09, sy: 0.91, e: "snap" },
    { t: 12, y: -6, sx: 0.95, sy: 1.07, e: "snap" },
    { t: 16, sx: 1.09, sy: 0.91, e: "snap" },
    { t: 20, y: -5, sx: 0.96, sy: 1.05, e: "snap" },
    { t: 24, sx: 1.06, sy: 0.94, e: "o" },
    { t: 28, e: "io" },
    { t: 34, x: 8, sx: 1.03, sy: 0.98, k: -8, e: "io" },
    { t: 38, x: 8, y: -0.6, sx: 1.022, sy: 0.99, k: -8, e: "io" },
    { t: 42, x: 8, sx: 1.03, sy: 0.98, k: -8, e: "back" },
    { t: 46, e: "i" },
    { t: 52, y: -2, sx: 0.97, sy: 1.04, e: "set" },
    { t: 58, y: 1.4, sx: 1.1, sy: 0.895, e: "l" },
    { t: 62, y: 1.2, sx: 1.085, sy: 0.9, e: "io" },
    { t: 66, y: 1.4, sx: 1.095, sy: 0.897, e: "io" },
    { t: 72, sx: 0.99, sy: 1.01, e: "snap" },
    { t: 78, y: -5, sx: 0.96, sy: 1.05, e: "snap" },
    { t: 82, sx: 1.07, sy: 0.93, e: "snap" },
    { t: 86, y: -5, sx: 0.96, sy: 1.05, e: "snap" },
    { t: 90, sx: 1.05, sy: 0.95, e: "o" },
    { t: 95, e: "l" },
    { t: 100 },
  ],
  setback: [
    { t: 0, e: "io" }, { t: 4, e: "io" },
    { t: 12, y: 0.6, sx: 1.04, sy: 0.93, k: -2, e: "io" },
    { t: 20, y: 1.1, sx: 1.03, sy: 0.875, k: -3, e: "io" },
    { t: 26, y: 1.4, sx: 1.02, sy: 0.86, k: -3, e: "io" },
    { t: 34, y: 1.1, sx: 1.045, sy: 0.88, k: -3, e: "io" },
    { t: 41, y: 1.35, sx: 1.02, sy: 0.858, k: -3, e: "io" },
    { t: 49, y: 1.05, sx: 1.05, sy: 0.89, k: -2, e: "io" },
    { t: 56, y: 1.25, sx: 1.032, sy: 0.872, k: -2, e: "io" },
    { t: 62, y: 1.3, sx: 1.045, sy: 0.865, k: -1, e: "i" },
    { t: 66, y: 1.9, sx: 1.09, sy: 0.83, e: "rise" },
    { t: 72, y: -3.5, sx: 0.955, sy: 1.065, e: "hang" },
    { t: 78, sx: 1.03, sy: 0.98, e: "pop" },
    { t: 85, y: -1, sx: 0.985, sy: 1.02, e: "io" },
    { t: 92, sx: 1.008, sy: 0.995, e: "io" },
    { t: 100 },
  ],
  zoomies: [
    { t: 0, e: "io" }, { t: 8, e: "io" },
    { t: 11, x: -3, sx: 1.01, sy: 0.99, e: "i" },
    { t: 14, y: 5.4, sx: 1.22, sy: 0.8, e: "dive" },
    { t: 17, x: -32, y: -26, sx: 1.5, sy: 0.6, r: -15, e: "l" },
    { t: 20, x: -58, y: -30, sx: 1.55, sy: 0.58, r: -30, e: "l" },
    { t: 23, x: -8, y: -47, sx: 1.5, sy: 0.6, r: -2, e: "l" },
    { t: 27, x: 52, y: -44, sx: 1.55, sy: 0.58, r: 30, e: "l" },
    { t: 31, x: 64, y: -24, sx: 1.5, sy: 0.6, r: 92, e: "l" },
    { t: 34, x: 60, y: -8, sx: 1.55, sy: 0.58, r: 150, e: "l" },
    { t: 38, x: 2, y: -5, sx: 1.5, sy: 0.6, r: 182, e: "l" },
    { t: 41, x: -52, y: -14, sx: 1.55, sy: 0.58, r: 212, e: "l" },
    { t: 44, x: -46, y: -40, sx: 1.5, sy: 0.6, r: 256, e: "l" },
    { t: 47, x: -30, y: -58, sx: 1.55, sy: 0.58, r: 286, e: "l" },
    { t: 50, x: 8, y: -45, sx: 1.5, sy: 0.6, r: 330, e: "l" },
    { t: 53, x: 44, y: -20, sx: 1.55, sy: 0.58, r: 360, e: "hang" },
    { t: 57, x: -7, y: -8, sx: 0.75, sy: 1.28, r: 352, e: "back" },
    { t: 61, y: 4, sx: 1.18, sy: 0.85, r: 360, e: "o" },
    { t: 65, y: 1.5, sx: 1.05, sy: 0.955, r: 360, e: "l" },
    { t: 71, y: 1.2, sx: 1.038, sy: 0.966, r: 360, e: "io" },
    { t: 77, y: 1.5, sx: 1.05, sy: 0.955, r: 360, e: "io" },
    { t: 83, y: 0.8, sx: 1.03, sy: 0.975, r: 360, e: "io" },
    { t: 91, sx: 1.012, sy: 0.992, r: 360, e: "io" },
    { t: 100, r: 360 },
  ],
  sleep: [
    { t: 0, e: "io" },
    { t: 4, y: -3, sx: 0.955, sy: 1.075, e: "l" },
    { t: 9, y: -3, sx: 0.955, sy: 1.075, e: "io" },
    { t: 14, y: 0.6, sx: 1.05, sy: 0.93, e: "io" },
    { t: 20, y: 1.1, sx: 1.075, sy: 0.915, e: "io" },
    { t: 27, y: 0.9, sx: 1.05, sy: 0.935, e: "io" },
    { t: 34, y: 1.15, sx: 1.08, sy: 0.912, e: "io" },
    { t: 42, y: 0.95, sx: 1.055, sy: 0.93, e: "io" },
    { t: 50, y: 1.15, sx: 1.08, sy: 0.912, e: "io" },
    { t: 59, y: 1, sx: 1.062, sy: 0.925, e: "io" },
    { t: 68, y: 1.12, sx: 1.077, sy: 0.913, e: "io" },
    { t: 76, y: 1.06, sx: 1.072, sy: 0.917, e: "io" },
    { t: 82, y: 1.1, sx: 1.075, sy: 0.915, e: "io" },
    { t: 87, x: 1.3, y: 1.07, sx: 1.073, sy: 0.916, k: 1.5, e: "io" },
    { t: 91, y: 1.09, sx: 1.074, sy: 0.915, e: "io" },
    { t: 95, y: 0.5, sx: 1.03, sy: 0.97, e: "io" },
    { t: 100 },
  ],
};

/** The excited droplet: a tiny echo of the mark, thrown on the leap. */
export const DROP: Pose[] = [
  { t: 0, o: 0, e: "o" }, { t: 46, o: 0, e: "o" },
  { t: 48, x: 3, y: -6, o: 0.95, e: "o" },
  { t: 53, x: 14, y: -24, o: 0.95, e: "io" },
  { t: 57, x: 22, y: -26, o: 0.95, e: "i" },
  { t: 62, x: 30, y: 2, o: 0.95, e: "pop" },
  { t: 65, x: 30, y: 2, sx: 1.3, sy: 0.7, o: 0.9, e: "o" },
  { t: 68, x: 30, y: 1, o: 0.9, e: "io" },
  { t: 74, x: 28, y: -2, o: 0.9, e: "i" },
  { t: 80, x: 15, y: -12, o: 0.9, e: "io" },
  { t: 86, x: 5, y: -4, o: 0.85, e: "i" },
  { t: 91, x: 1, o: 0, e: "io" },
  { t: 100, x: 1, o: 0 },
];

/* ── Micro-gestures: played ADDITIVELY over whatever loop is running ── */

export const GESTURES: Record<GestureKey, { dur: number; f: Pose[] }> = {
  acknowledge: { dur: 0.7, f: [{ t: 0, e: "i" }, { t: 24, y: 1, sx: 1.1, sy: 0.9, e: "hang" }, { t: 54, y: -4, sx: 0.95, sy: 1.06, e: "i" }, { t: 76, y: 0.5, sx: 1.03, sy: 0.975, e: "pop" }, { t: 100 }] },
  greeting: { dur: 1.4, f: [{ t: 0, e: "io" }, { t: 9, y: -1.5, sx: 0.97, sy: 1.04, e: "back" }, { t: 20, y: 1, sx: 1.06, sy: 0.93, k: -16, e: "back" }, { t: 32, y: -1, sx: 0.97, sy: 1.03, k: 3, e: "io" }, { t: 44, y: 0.8, sx: 1.05, sy: 0.945, k: -12, e: "io" }, { t: 56, y: -0.5, sx: 0.985, sy: 1.015, k: 2, e: "io" }, { t: 66, sx: 1.005, k: -4, e: "io" }, { t: 74, sx: 1.005, k: 4, e: "io" }, { t: 82, k: -2, e: "io" }, { t: 100 }] },
  flinch: { dur: 0.7, f: [{ t: 0, e: "hang" }, { t: 18, y: -11, sx: 0.74, sy: 1.3, e: "i" }, { t: 34, sx: 1.3, sy: 0.72, e: "pop" }, { t: 50, y: -6, sx: 0.92, sy: 1.1, e: "i" }, { t: 64, sx: 1.08, sy: 0.94, e: "o" }, { t: 78, y: -1.5, sx: 0.985, sy: 1.015, e: "io" }, { t: 100 }] },
  joy: { dur: 1.05, f: [{ t: 0, e: "i" }, { t: 12, y: 1.5, sx: 1.16, sy: 0.84, e: "hang" }, { t: 26, y: -22, sx: 0.86, sy: 1.18, e: "o" }, { t: 36, y: -27, sx: 0.95, sy: 1.06, e: "i" }, { t: 48, sx: 1.26, sy: 0.74, e: "pop" }, { t: 58, y: -9, sx: 0.94, sy: 1.07, e: "i" }, { t: 68, sx: 1.1, sy: 0.92, e: "o" }, { t: 76, k: 5, sx: 1.02, sy: 0.99, e: "io" }, { t: 84, k: -5, sx: 1.01, sy: 0.99, e: "io" }, { t: 91, k: 2, sx: 1.005, e: "io" }, { t: 100 }] },
  annoyed: { dur: 1.05, f: [{ t: 0, e: "o" }, { t: 10, y: 1.5, sx: 1.12, sy: 0.86, e: "io" }, { t: 22, x: -4, y: 1, sx: 1.1, sy: 0.88, e: "io" }, { t: 32, x: 4, y: 1, sx: 1.1, sy: 0.88, e: "io" }, { t: 42, x: -3, y: 1, sx: 1.1, sy: 0.88, e: "io" }, { t: 50, x: 2, y: 1, sx: 1.1, sy: 0.88, e: "io" }, { t: 58, sx: 1.1, sy: 0.88, e: "o" }, { t: 68, y: -2, sx: 0.94, sy: 1.09, e: "io" }, { t: 80, sx: 1.05, sy: 0.96, e: "io" }, { t: 100 }] },
  cower: { dur: 1.4, f: [{ t: 0, e: "hang" }, { t: 10, y: 1, sx: 0.82, sy: 0.8, e: "io" }, { t: 18, x: -1.5, y: 1.2, sx: 0.8, sy: 0.78, e: "io" }, { t: 26, x: 1.5, y: 1.2, sx: 0.8, sy: 0.78, e: "io" }, { t: 34, x: -1, y: 1.2, sx: 0.8, sy: 0.78, e: "io" }, { t: 42, x: 0.5, y: 1.2, sx: 0.8, sy: 0.78, e: "io" }, { t: 55, y: 0.8, sx: 0.84, sy: 0.84, e: "io" }, { t: 70, y: 0.3, sx: 0.92, sy: 0.94, e: "io" }, { t: 84, sx: 1.02, e: "io" }, { t: 100 }] },
  wake: { dur: 1.4, f: [{ t: 0, e: "hang" }, { t: 8, y: -16, sx: 0.8, sy: 1.26, e: "i" }, { t: 17, y: 1, sx: 1.16, sy: 0.87, e: "pop" }, { t: 26, y: -2, sx: 0.96, sy: 1.05, e: "io" }, { t: 34, x: 2, y: -2, sx: 0.97, sy: 1.03, k: -8, e: "l" }, { t: 46, x: 2, y: -2, sx: 0.97, sy: 1.03, k: -8, e: "io" }, { t: 54, x: -2, y: -2, sx: 0.97, sy: 1.03, k: 8, e: "l" }, { t: 64, x: -2, y: -2, sx: 0.97, sy: 1.03, k: 8, e: "io" }, { t: 74, y: -1, sx: 0.99, sy: 1.01, e: "io" }, { t: 88, sx: 1.004, sy: 0.997, e: "io" }, { t: 100 }] },
  rally: { dur: 0.7, f: [{ t: 0, e: "i" }, { t: 18, y: 1, sx: 1.08, sy: 0.92, e: "hang" }, { t: 48, y: -8, sx: 0.94, sy: 1.07, e: "i" }, { t: 70, sx: 1.06, sy: 0.95, e: "pop" }, { t: 85, y: -0.8, sx: 0.99, sy: 1.01, e: "io" }, { t: 100 }] },
};

/* ── Mood metadata: the workday, in order ── */

export interface Mood {
  num: string;
  name: string;
  cap: string;
  dur: number; // seconds; all multiples of the 1.4s bar
  bars: number;
  poke: GestureKey;
  calm: boolean;
  origin: string;
  title: string;
  pose: Pose | Record<string, never>;
  ghosts?: boolean;
  drop?: boolean;
}

export const MOODS: Record<MoodKey, Mood> = {
  idle: { num: "01", name: "Idle", cap: "Alive. Counting dust motes.", dur: 7, bars: 5, poke: "flinch", calm: true, origin: "50% 100%", title: "poke Dot", pose: {} },
  curious: { num: "02", name: "Curious", cap: "Wait. What's that over there.", dur: 5.6, bars: 4, poke: "flinch", calm: true, origin: "50% 100%", title: "poke Dot", pose: { t: 0, x: 10, sx: 1.08, sy: 0.945, k: -10 } },
  thinking: { num: "03", name: "Thinking", cap: "Hold on. Let it cook.", dur: 5.6, bars: 4, poke: "annoyed", calm: true, origin: "50% 100%", title: "interrupt Dot, rude", pose: { t: 0, y: 1, sx: 1.06, sy: 0.918 } },
  working: { num: "04", name: "Working", cap: "Heads down. Making progress.", dur: 4.2, bars: 3, poke: "acknowledge", calm: true, origin: "50% 100%", title: "poke Dot, it keeps working", pose: { t: 0, x: 1.5, y: 0.4, sx: 1.06, sy: 0.945, k: -7 } },
  excited: { num: "05", name: "Excited", cap: "Shipped it. You saw that, right?", dur: 2.8, bars: 2, poke: "joy", calm: false, origin: "50% 100%", title: "congratulate Dot", drop: true, pose: { t: 0, y: 0.8, sx: 1.18, sy: 0.855 } },
  nervous: { num: "06", name: "Nervous", cap: "We're sure about this? Okay. Okay.", dur: 2.8, bars: 2, poke: "cower", calm: false, origin: "50% 100%", title: "startle Dot, please do not", pose: { t: 0, sx: 0.95, sy: 0.95 } },
  impatient: { num: "07", name: "Impatient", cap: "Any minute now. Aaany minute.", dur: 4.2, bars: 3, poke: "flinch", calm: true, origin: "50% 100%", title: "finally, attention", pose: { t: 0, sx: 1.07, sy: 0.935 } },
  setback: { num: "08", name: "Setback", cap: "That didn't work. Taking a breath.", dur: 5.6, bars: 4, poke: "rally", calm: true, origin: "50% 100%", title: "encourage Dot", pose: { t: 0, y: 1.1, sx: 1.03, sy: 0.875, k: -3 } },
  zoomies: { num: "09", name: "Zoomies", cap: "Discipline has left the building.", dur: 5.6, bars: 4, poke: "joy", calm: false, origin: "50% 50%", title: "good luck catching Dot", ghosts: true, pose: { t: 0, sx: 1.22, sy: 0.8 } },
  sleep: { num: "10", name: "Sleep", cap: "Powering down. Goodnight, room.", dur: 9.8, bars: 7, poke: "wake", calm: false, origin: "50% 100%", title: "wake Dot, consequences", pose: { t: 0, y: 1.1, sx: 1.075, sy: 0.915 } },
};

export const ORDER: MoodKey[] = [
  "idle", "curious", "thinking", "working", "excited",
  "nervous", "impatient", "setback", "zoomies", "sleep",
];

/** The autoplay reel: the workday, energy-paced (excited holds two loops). */
export const SEQ: { k: MoodKey; n: number }[] = [
  { k: "idle", n: 1 }, { k: "curious", n: 1 }, { k: "excited", n: 2 },
  { k: "zoomies", n: 1 }, { k: "working", n: 1 }, { k: "thinking", n: 1 },
  { k: "impatient", n: 1 }, { k: "nervous", n: 1 }, { k: "setback", n: 1 },
  { k: "sleep", n: 1 },
];

/* ── Pure builders ── */

const round = (n: number) => Math.round(n * 100) / 100;

/** One pose → a CSS transform string, scaled by the rig unit. */
export function toTransform(u: number, p: Pose | Record<string, never>): string {
  const q = p as Pose;
  return (
    "translate(" + round((q.x || 0) * u) + "px, " + round((q.y || 0) * u) + "px)" +
    " rotate(" + (q.r || 0) + "deg)" +
    " skewX(" + (q.k || 0) + "deg)" +
    " scale(" + (q.sx == null ? 1 : q.sx) + ", " + (q.sy == null ? 1 : q.sy) + ")"
  );
}

export function buildBody(poses: Pose[], u: number, amp = 1): Keyframe[] {
  return poses.map((p) => {
    let q: Pose = p;
    if (amp !== 1) {
      q = {
        t: p.t,
        x: (p.x || 0) * amp, y: (p.y || 0) * amp, k: (p.k || 0) * amp, r: p.r || 0,
        sx: 1 + ((p.sx == null ? 1 : p.sx) - 1) * amp,
        sy: 1 + ((p.sy == null ? 1 : p.sy) - 1) * amp,
      };
    }
    return { offset: p.t / 100, transform: toTransform(u, q), easing: EASE[p.e || "io"] };
  });
}

/**
 * The shadow is derived from the body pose: it thins and fades with
 * altitude (quadratic falloff over 34 units) and widens with the squash.
 * Because it is computed, it cannot desync.
 */
export function shDerive(p: Pose | Record<string, never>): { s: number; o: number } {
  const q = p as Pose;
  const h = Math.max(0, -(q.y || 0));
  const g = Math.max(0, 1 - Math.min(h, 34) / 34);
  const g2 = g * g;
  const sx = q.sx == null ? 1 : q.sx;
  const w = Math.min(1.45, Math.max(0.6, sx));
  const wo = Math.min(1.35, Math.max(0.75, sx));
  return {
    s: Math.round((0.5 + (w - 0.5) * g2) * 1000) / 1000,
    o: Math.round((0.05 + (0.15 * wo - 0.05) * g2) * 1000) / 1000,
  };
}

export function buildShadow(poses: Pose[], u: number): Keyframe[] {
  return poses.map((p) => {
    const d = shDerive(p);
    return {
      offset: p.t / 100,
      transform: "translateX(" + round((p.x || 0) * u) + "px) scaleX(" + d.s + ")",
      opacity: d.o,
      easing: EASE[p.e || "io"],
    };
  });
}

export function buildShadowAdd(poses: Pose[], u: number, amp = 1): Keyframe[] {
  return poses.map((p) => {
    const d = shDerive(p);
    return {
      offset: p.t / 100,
      transform:
        "translateX(" + round((p.x || 0) * u * amp) + "px) scaleX(" +
        Math.round((1 + (d.s - 1) * amp) * 1000) / 1000 + ")",
      easing: EASE[p.e || "io"],
    };
  });
}

export function buildGhost(poses: Pose[], u: number): Keyframe[] {
  return poses.map((p) => ({
    offset: p.t / 100,
    transform: toTransform(u, p),
    opacity: p.t >= 17 && p.t <= 53 ? (p.t >= 53 ? 0.55 : 0.85) : 0,
    easing: EASE[p.e || "l"],
  }));
}

/**
 * Idle is never the same loop twice: glance direction, reach, and beat
 * timing vary within authored bounds. Variation, not randomness.
 */
export function buildIdlePoses(): Pose[] {
  const R = Math.random;
  const j = () => (R() - 0.5) * 2.4;
  const d1 = R() > 0.35 ? 1 : -1;
  const d2 = -d1;
  const g1 = 5.5 + R() * 2.5;
  const g2 = 4 + R() * 2;
  return [
    { t: 0, e: "io" },
    { t: 7 + j() * 0.4, y: -2, sx: 0.985, sy: 1.03 + R() * 0.01, e: "io" },
    { t: 14, sx: 1.02, sy: 0.985, e: "io" },
    { t: 20 + j() * 0.4, e: "io" },
    { t: 27, y: -1.5, sx: 0.99, sy: 1.02, e: "io" },
    { t: 33, sx: 1.012, sy: 0.99, e: "io" },
    { t: 38 + j() * 0.4, e: "peek" },
    { t: 44 + j(), x: d1 * g1, sx: 1.02, sy: 0.985, k: -d1 * 7, e: "io" },
    { t: 49, x: d1 * g1, y: -0.4, sx: 1.014, sy: 0.995, k: -d1 * 7, e: "io" },
    { t: 54 + j(), x: d1 * g1, sx: 1.02, sy: 0.985, k: -d1 * 7, e: "pop" },
    { t: 58, e: "peek" },
    { t: 64 + j(), x: d2 * g2, sx: 1.012, sy: 0.99, k: -d2 * 5, e: "io" },
    { t: 68, x: d2 * g2, y: -0.3, sx: 1.008, sy: 0.996, k: -d2 * 5, e: "io" },
    { t: 71.5, x: d2 * g2, sx: 1.012, sy: 0.99, k: -d2 * 5, e: "io" },
    { t: 75, e: "i" },
    { t: 80 + j() * 0.4, y: -2.5, sx: 0.97, sy: 1.05, e: "set" },
    { t: 87, y: 1, sx: 1.06, sy: 0.94, e: "io" },
    { t: 94, sx: 0.995, sy: 1.005, e: "io" },
    { t: 100 },
  ];
}

/** Cursor awareness: a soft additive gaze toward the visitor's side. */
export function gazePoses(side: 1 | -1): Pose[] {
  return [
    { t: 0, e: "io" },
    { t: 14, x: side * 3.5, k: -side * 5, sx: 1.012, sy: 0.992, e: "io" },
    { t: 52, x: side * 3.5, k: -side * 5, sx: 1.012, sy: 0.992, e: "io" },
    { t: 64, x: side * 3.5, y: -0.4, k: -side * 5, sx: 1.008, sy: 0.996, e: "io" },
    { t: 82, e: "io" },
    { t: 100 },
  ];
}
