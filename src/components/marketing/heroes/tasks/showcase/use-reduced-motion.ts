"use client";

import { useReducedMotion } from "motion/react";
import {
  EASE_OUT,
  EASE_IN_OUT,
  MOTION_FAST,
  MOTION_SLOW,
} from "@/components/marketing/heroes/tasks/lib/motion";

// View morph geometry: ≤ MOTION_SLOW (400ms). The suite contract
// reserves --motion-slow for the largest single beats; a full-canvas
// view morph qualifies as one of those beats.
export const MORPH_DURATION_S = MOTION_SLOW;

/**
 * The single layout transition every morphing card uses. Consuming
 * components must spread `transition` on their motion element so the
 * concert reads as one coordinated reshape rather than 16 swimming fish.
 */
export function useMorphTransition() {
  const reduce = useReducedMotion();
  if (reduce) {
    return {
      layout:    { duration: 0 },
      bodyOut:   { duration: 0 },
      bodyIn:    { duration: 0 },
      chrome:    { duration: 0 },
      todayDraw: { duration: 0 },
    };
  }
  return {
    // 400ms geometry (= MOTION_SLOW)
    layout:    { duration: MORPH_DURATION_S, ease: EASE_IN_OUT },
    // body fade-out: MOTION_FAST (140ms)
    bodyOut:   { duration: MOTION_FAST, ease: EASE_OUT },
    // body and chrome settle inside the same 400ms morph.
    bodyIn:    { duration: 0.22, delay: 0.18, ease: EASE_OUT },
    chrome:    { duration: 0.22, delay: 0.18, ease: EASE_OUT },
    todayDraw: { duration: 0.4, delay: 0.4, ease: EASE_IN_OUT },
  };
}

// Re-export for convenience at callsites that only need MORPH_DURATION_S
export { MOTION_FAST, MOTION_SLOW };
