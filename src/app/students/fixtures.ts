import type { AudienceTimelineDto } from "@/components/marketing/heroes/timeline/audience-timeline";

/**
 * The sample semester shown in the hero's product view.
 *
 * Canon, and the reason this exists rather than the shipped hero fixture:
 * `TIMELINE_HERO_FIXTURE` is a couple's wedding plan, so embedding it here
 * would show a wedding on the student page. This one is a semester, and
 * `audienceKind: "module"` is what makes the artifact call itself a module
 * timeline rather than a wedding one.
 *
 * THREE MODULES, NOT FOUR. `commercial-terms.v2.json` gives Student Edition
 * three Workspaces, so a sample semester with four module Workspaces in it
 * would be a picture of a plan the plan does not sell. The page states the
 * limit in words; this fixture has to agree with it.
 *
 * Dates are frozen, never derived from the clock: a marketing surface must
 * read the same on every visit. `today` is 21 October 2026, mid-semester, and
 * the same date governs the provenance strip above the frame and the "Updated"
 * line inside it. The one `now` milestone sits a day ahead of `today` on
 * purpose, because the artifact derives a milestone's state from its date and
 * a "now" milestone dated in the past renders as overdue instead of current.
 */
export const SEMESTER_TIMELINE_FIXTURE: AudienceTimelineDto = {
  version: 1,
  audienceKind: "module",
  publicationId: "students-semester",
  label: "Semester one",
  ownerDisplayLabel: "Aoife",
  primaryDate: { label: "Semester ends", date: "2026-12-18" },
  lastUpdatedAt: "2026-10-21T08:40:00.000Z",
  today: "2026-10-21",
  sections: [
    {
      state: "covered",
      label: "Done",
      items: [
        {
          publicId: "s1",
          title: "Modules registered",
          date: "2026-09-14",
          state: "covered",
        },
        {
          publicId: "s2",
          title: "Statistics problem set one",
          date: "2026-10-02",
          state: "covered",
        },
        {
          publicId: "s3",
          title: "Marketing group formed",
          date: "2026-10-09",
          state: "covered",
        },
      ],
    },
    {
      state: "now",
      label: "Now",
      items: [
        {
          publicId: "s4",
          title: "Psychology midterm",
          date: "2026-10-22",
          state: "now",
        },
      ],
    },
    {
      state: "next",
      label: "Soon",
      items: [
        {
          publicId: "s5",
          title: "Marketing group presentation",
          date: "2026-11-06",
          state: "next",
        },
      ],
    },
    {
      state: "later",
      label: "Later",
      items: [
        {
          publicId: "s6",
          title: "Statistics problem set four",
          date: "2026-11-20",
          state: "later",
        },
        {
          publicId: "s7",
          title: "Psychology paper due",
          date: "2026-12-11",
          state: "later",
        },
      ],
    },
    {
      state: "cancelled",
      label: "Set aside",
      items: [
        {
          publicId: "s8",
          title: "A second study group slot",
          date: "2026-10-16",
          state: "cancelled",
        },
      ],
    },
  ],
};

/**
 * The module stack, the page's one authored object.
 *
 * Three module rails standing over one semester rail, each mark a piece of
 * work. It draws the sentence rung 01 states in words: three Workspaces, one
 * semester. Decorative by construction and hidden from assistive technology,
 * because the sentence beside it says the whole of its content.
 *
 * The marks are positions along the rail, not dates. The semester rail carries
 * the union of the three, which is the only claim the object makes: the
 * semester view is every module's work on one line.
 */
export type ModuleRail = Readonly<{ name: string; marks: readonly number[] }>;

export const MODULE_RAILS: readonly ModuleRail[] = [
  { name: "Psychology", marks: [12, 34, 58, 82] },
  { name: "Marketing", marks: [22, 46, 70] },
  { name: "Statistics", marks: [8, 30, 52, 74, 92] },
];

export const SEMESTER_MARKS: readonly number[] = [
  ...new Set(MODULE_RAILS.flatMap((rail) => rail.marks)),
].sort((left, right) => left - right);
