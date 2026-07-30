// Signal Design System 2.0 motion values for motion/react.
// Predetermined interface motion uses only 80 / 140 / 220 / 400ms.

import { useReducedMotion } from "motion/react";

export const MOTION_INSTANT = 0.08;
export const MOTION_FAST = 0.14;
export const MOTION_BASE = 0.22;
export const MOTION_SLOW = 0.4;

export const EASE_OUT = [0.23, 1, 0.32, 1] as const;
export const EASE_IN_OUT = [0.77, 0, 0.175, 1] as const;

/** Returns the suite ease-out, or instant linear under reduced motion. */
export function useReducedMotionEase(): readonly number[] {
  const reduced = useReducedMotion();
  return reduced ? [0, 0, 1, 1] : EASE_OUT;
}
