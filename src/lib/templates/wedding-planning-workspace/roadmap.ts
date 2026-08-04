import type { RoadmapSeed } from "../types";

/**
 * Roadmap seed, one "Planning Roadmap" project with the wedding
 * planning items grouped by status. Shape matches Roadmap product's
 * data model (workspaces → projects → tasks); status vocabulary is
 * Roadmap's enum. Item bodies are written for a shared update view
 * the couple, venue, and suppliers can read in under a minute.
 */
export const roadmap: RoadmapSeed = {
  anchor: {
    label: "The wedding day",
    prompt: "When is the wedding?",
    hint: "Every milestone below is placed relative to this day. You can move any of them afterwards.",
  },
  projects: [
    {
      slug: "planning",
      name: "Planning Roadmap",
      oneLiner:
        "What is decided, what is moving, and what needs attention before the day.",
      accent: "#be185d",
    },
  ],
  // Offsets are counted back from the wedding day and follow the real cadence
  // of the work: the venue is booked the better part of a year out, layout is
  // settled once the season is known, headcount and suppliers land in the last
  // six weeks, and the final three items are the week itself. A couple who
  // supplies the date gets a plan already shaped like their year.
  items: [
    {
      projectSlug: "planning",
      title: "Venue contract and deposit schedule",
      description: "Locked at booking. Final-week walkthrough date confirmed.",
      status: "shipped",
      anchorOffsetDays: -300,
    },
    {
      projectSlug: "planning",
      title: "Ceremony room layout agreed",
      description:
        "Venue, couple, and officiant have signed off on aisle direction, seating block, and signing-table placement.",
      status: "shipped",
      anchorOffsetDays: -150,
    },
    {
      projectSlug: "planning",
      title: "Confirm final guest numbers",
      description:
        "Couple to confirm the final headcount before the venue locks table layout and catering quantities.",
      status: "in-flight",
      anchorOffsetDays: -45,
    },
    {
      projectSlug: "planning",
      title: "Supplier arrival times need confirmation",
      description:
        "Photographer, florist, and band arrival times are not all confirmed yet. This is the main planning risk.",
      status: "waiting",
      anchorOffsetDays: -30,
    },
    {
      projectSlug: "planning",
      title: "Menu decisions sent to catering",
      description:
        "Venue has sent the couple's menu decisions to catering and is waiting for final dietary notes.",
      status: "in-flight",
      anchorOffsetDays: -25,
    },
    {
      projectSlug: "planning",
      title: "Final-week walkthrough",
      description:
        "Venue, planner, and couple walk through room setup, ceremony flow, supplier access, and backup weather plan.",
      status: "next",
      anchorOffsetDays: -6,
    },
    {
      projectSlug: "planning",
      title: "Day-of timeline shared with suppliers",
      description:
        "One-page run of show with arrival windows, ceremony cue, meal service, and band start time. Goes to every supplier.",
      status: "next",
      anchorOffsetDays: -4,
    },
    {
      projectSlug: "planning",
      title: "Weather backup plan confirmed",
      description:
        "Indoor ceremony fallback + supplier coverage if outdoor ceremony moves inside. Venue holds the final call.",
      status: "next",
      anchorOffsetDays: -2,
    },
  ],
};
