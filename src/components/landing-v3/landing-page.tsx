import { LANDING_ONLY } from "@/lib/landing-only";
import LandingV3 from "./landing-v3";

/**
 * The public home page, redesign v3 (Design canvas, October 2026). The page renders its own header,
 * footer and waitlist; the waitlist posts to the real joinWaitlistAction. In landing-only mode it
 * leaves out links to pages that would only redirect home.
 *
 * Theme: the stylesheet follows the device setting before any script runs, so nothing is written to
 * the page before React hydrates it. After hydration `?theme=light|dark` can override the device.
 */
export function LandingPage() {
  return <LandingV3 landingOnly={LANDING_ONLY} />;
}
