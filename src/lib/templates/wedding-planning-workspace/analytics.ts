import type { AnalyticsHint } from "../types";

/**
 * Analytics hint, detector ids the briefing engine weights up for
 * workspaces created from this template. Consumed lazily at
 * briefing-build time; users never pick from these.
 *
 * Detector ids are forward-looking, the Analytics product surface is
 * marketing-only as of 2026-05-11 (see canonical state). When the
 * briefing pipeline ships, these ids become the contract.
 */
export const analytics: AnalyticsHint = {
  detectors: [
    "rsvp-deadline-approaching",
    "vendor-contract-pending",
    "supplier-payment-due",
    "final-week-countdown",
    "weather-backup-undecided",
    "guest-numbers-still-shifting",
  ],
  weights: {
    "rsvp-deadline-approaching": 1.5,
    "final-week-countdown": 2.0,
  },
};
