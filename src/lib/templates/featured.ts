import type { TemplateAudience } from "@/components/marketing/template-pills";

/**
 * Featured templates surfaced on studio's `/templates` marketing page.
 *
 * Two shapes:
 *  - "anchor" → canonical four-layer WorkspaceTemplate from
 *    `src/lib/templates/index.ts` (seeds Tasks + Notes + Timeline + Signal).
 *    Suite-wide reach.
 *  - "specialty" → drop-in Tasks template (Tasks-only). Lifted by
 *    metadata mirror from `tasks/src/lib/templates.ts`. Single-layer.
 *
 * Honest-count rule (research steal #5 + segment-canon refusal): each
 * pill shows real count. Trades has 1, Wedding has 3 — we do not pad.
 *
 * Students is intentionally absent from this list and from the pill row.
 * The /templates page links to /for-students from below the grid, per
 * the segment-sequencing canon (2026-05-16): students never a paid wedge.
 *
 * Apply path — clicking a template card sends the visitor to Tasks at
 * `tasks.signalstudio.ie/templates/<id>`, where the existing apply flow
 * (auth check + workspace pick + `applyTemplateAction`) runs. The
 * studio surface is positioning + browse; Tasks owns the apply moment.
 */

const TASKS_URL =
  process.env.NEXT_PUBLIC_TASKS_URL ?? "https://tasks.signalstudio.ie";

export type FeaturedTemplate = {
  id: string;
  name: string;
  description: string;
  icon: string;
  audience: TemplateAudience;
  /** Suite-wide canonical (4-layer) vs Tasks-only drop-in. */
  shape: "anchor" | "specialty";
  /** Real count of tasks the template seeds. */
  taskCount: number;
  /** Deep-link to the Tasks apply surface. */
  applyHref: string;
};

export const FEATURED_TEMPLATES: FeaturedTemplate[] = [
  // ─── Wedding (3) ────────────────────────────────────────────
  {
    id: "wedding-planning-workspace",
    name: "Wedding planning workspace",
    description:
      "Venue, suppliers, guest decisions, final-week walkthrough. One calm list the couple, the planner, and the venue can read in under a minute.",
    icon: "target",
    audience: "wedding",
    shape: "anchor",
    taskCount: 18,
    applyHref: `${TASKS_URL}/templates/wedding-planning-workspace`,
  },
  {
    id: "wedding-3-month-countdown",
    name: "3-month countdown",
    description:
      "RSVPs, seating, vows, all the small fires before the big day.",
    icon: "ring",
    audience: "wedding",
    shape: "specialty",
    taskCount: 9,
    applyHref: `${TASKS_URL}/templates/wedding-3-month-countdown`,
  },
  {
    id: "wedding-day-of-run-of-show",
    name: "Day-of run of show",
    description:
      "Vendor arrivals, ceremony, reception, minute by minute, nothing forgotten.",
    icon: "clock",
    audience: "wedding",
    shape: "specialty",
    taskCount: 10,
    applyHref: `${TASKS_URL}/templates/wedding-day-of-run-of-show`,
  },

  // ─── Trades (1) ─────────────────────────────────────────────
  {
    id: "jobsite-punchlist",
    name: "Jobsite punchlist",
    description:
      "The end-of-job walkthrough list. Every callback handled before the final check clears.",
    icon: "wrench",
    audience: "trades",
    shape: "specialty",
    taskCount: 10,
    applyHref: `${TASKS_URL}/templates/jobsite-punchlist`,
  },

  // ─── Freelance (4) ──────────────────────────────────────────
  {
    id: "new-client-onboarding",
    name: "New client onboarding",
    description:
      "Kickoff doc, contract, payment terms, first invoice. Start clean, sleep easy.",
    icon: "briefcase",
    audience: "freelance",
    shape: "specialty",
    taskCount: 7,
    applyHref: `${TASKS_URL}/templates/new-client-onboarding`,
  },
  {
    id: "tax-season",
    name: "Tax season",
    description:
      "1099s, expenses, S-corp filings. Dread it less, finish it sooner.",
    icon: "receipt",
    audience: "freelance",
    shape: "specialty",
    taskCount: 7,
    applyHref: `${TASKS_URL}/templates/tax-season`,
  },
  {
    id: "apartment-move",
    name: "Apartment move",
    description:
      "Notice the landlord, hire movers, forward the mail. Survive the box maze.",
    icon: "box",
    audience: "freelance",
    shape: "specialty",
    taskCount: 9,
    applyHref: `${TASKS_URL}/templates/apartment-move`,
  },
  {
    id: "trip-planning",
    name: "Trip planning",
    description:
      "Flights, hotel, itinerary, everything you forget at the gate.",
    icon: "plane",
    audience: "freelance",
    shape: "specialty",
    taskCount: 8,
    applyHref: `${TASKS_URL}/templates/trip-planning`,
  },

  // ─── Marketing / small business (4) ─────────────────────────
  {
    id: "local-business-monthly-rhythm",
    name: "Monthly business rhythm",
    description:
      "Month-end close, payroll, suppliers, marketing, staff one-to-ones. A cadence that holds a small operation together.",
    icon: "calendar",
    audience: "marketing",
    shape: "anchor",
    taskCount: 18,
    applyHref: `${TASKS_URL}/templates/local-business-monthly-rhythm`,
  },
  {
    id: "product-launch",
    name: "Product launch",
    description:
      "Positioning, landing, email blast, post-mortem. Tell the story, not just the feature.",
    icon: "target",
    audience: "marketing",
    shape: "specialty",
    taskCount: 8,
    applyHref: `${TASKS_URL}/templates/product-launch`,
  },
  {
    id: "conference-booth-prep",
    name: "Conference booth prep",
    description:
      "Booth, swag, demo flow, lead capture. Show up looking like you meant to.",
    icon: "target",
    audience: "marketing",
    shape: "specialty",
    taskCount: 8,
    applyHref: `${TASKS_URL}/templates/conference-booth-prep`,
  },
  {
    id: "quarterly-review-prep",
    name: "Quarterly review prep",
    description:
      "Walk into your one-on-one with receipts, not vibes.",
    icon: "target",
    audience: "marketing",
    shape: "specialty",
    taskCount: 6,
    applyHref: `${TASKS_URL}/templates/quarterly-review-prep`,
  },
];

/** Pill labels in wedge-canon order (segment sequencing 2026-05-16). */
export const PILL_ORDER: TemplateAudience[] = [
  "wedding",
  "trades",
  "freelance",
  "marketing",
];

export const PILL_LABELS: Record<TemplateAudience, string> = {
  wedding: "Weddings",
  trades: "Trades",
  freelance: "Freelance",
  marketing: "Small business",
};

export function featuredCount(audience: TemplateAudience): number {
  return FEATURED_TEMPLATES.filter((t) => t.audience === audience).length;
}

export function featuredFor(audience: TemplateAudience): FeaturedTemplate[] {
  return FEATURED_TEMPLATES.filter((t) => t.audience === audience);
}
