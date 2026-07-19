import type { DirectionId } from "./directions";

/**
 * The v2 elevation loop's outcome per email × direction: how many
 * critique rounds it took and the Taste Arbiter's final score. The Lab
 * shows these beside each preview; docs/email-system/elevation-tracker.md
 * is the narrative record. Nothing ships below 9.5.
 */

export type ElevationRecord = { rounds: number; score: number };

export const ELEVATION: Record<string, Record<DirectionId, ElevationRecord>> = {
  "auth.sign-in-code": {
    hairline: { rounds: 3, score: 9.8 },
    broadsheet: { rounds: 3, score: 9.6 },
    letterhead: { rounds: 3, score: 9.5 },
  },
  "access.ready": {
    hairline: { rounds: 3, score: 9.5 },
    broadsheet: { rounds: 3, score: 9.7 },
    letterhead: { rounds: 3, score: 9.6 },
  },
  "billing.payment-failed": {
    hairline: { rounds: 3, score: 9.8 },
    broadsheet: { rounds: 3, score: 9.6 },
    letterhead: { rounds: 3, score: 9.5 },
  },
  "account.deletion-scheduled": {
    hairline: { rounds: 3, score: 9.7 },
    broadsheet: { rounds: 3, score: 9.7 },
    letterhead: { rounds: 3, score: 9.8 },
  },
  "outreach.venue-first": {
    hairline: { rounds: 3, score: 9.5 },
    broadsheet: { rounds: 3, score: 9.5 },
    letterhead: { rounds: 3, score: 9.9 },
  },
  "outreach.school-first": {
    hairline: { rounds: 3, score: 9.5 },
    broadsheet: { rounds: 3, score: 9.5 },
    letterhead: { rounds: 3, score: 9.8 },
  },
  "student.verification-approved": {
    hairline: { rounds: 3, score: 9.6 },
    broadsheet: { rounds: 3, score: 9.5 },
    letterhead: { rounds: 3, score: 9.7 },
  },
  "editorial.dispatch-issue": {
    hairline: { rounds: 3, score: 9.5 },
    broadsheet: { rounds: 3, score: 9.9 },
    letterhead: { rounds: 3, score: 9.6 },
  },
};
