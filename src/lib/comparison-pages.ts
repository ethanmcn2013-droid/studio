import { SIGNAL_URL, NOTES_URL, TIMELINE_URL, TASKS_URL } from "@/lib/product-urls";

export type ComparisonPage = {
  slug: string;
  title: string;
  description: string;
  eyebrow: string;
  h1: string;
  intro: string;
  sections: Array<{
    title: string;
    copy: string;
  }>;
  primaryCta: {
    label: string;
    href: string;
  };
  secondaryCta?: {
    label: string;
    href: string;
  };
};

export const COMPARISON_PAGES: ComparisonPage[] = [
  {
    slug: "aisle-planner-alternative-ireland",
    title: "Aisle Planner Alternative for Irish Venues - Signal Studio",
    description:
      "A plain-English wedding planning workspace for Irish venues that want couples to see the plan without learning planning software.",
    eyebrow: "Wedding venues",
    h1: "A planning layer your couples can actually read.",
    intro:
      "Aisle Planner can be the system behind a wedding business. Signal Studio is the layer a venue can hand to a couple: notes, tasks, the public plan, and the morning briefing, all written without software vocabulary.",
    sections: [
      {
        title: "Built for the venue handoff",
        copy: "The Venue Edition is paid once a year by the venue. Every couple gets twelve months of Signal Studio. The couple never sees a price, and the coordinator does not manage seats.",
      },
      {
        title: "One link for the people outside the work",
        copy: "Signal Timeline gives the couple, supplier, or family one readable plan. No login. No app to install. The public plan carries the latest state without exposing private notes.",
      },
      {
        title: "Less setup, fewer explanations",
        copy: "The wedding template starts with the work already shaped: venue, suppliers, guest numbers, decisions, and final-week follow-up. The first session is not a configuration exercise.",
      },
    ],
    primaryCta: {
      label: "See the Venue Edition",
      href: "/venues",
    },
    secondaryCta: {
      label: "Open the wedding workspace",
      href: `${TASKS_URL}/templates/wedding-planning-workspace`,
    },
  },
  {
    slug: "wedding-planning-workspace-for-venues",
    title: "Wedding Planning Workspace for Venues - Signal Studio",
    description:
      "Signal Studio gives wedding venues a paid annual planning workspace they can give every couple.",
    eyebrow: "Venue Edition",
    h1: "The plan everyone around the wedding can share.",
    intro:
      "A wedding venue does not need another admin system. It needs couples who arrive better organised, fewer repeated questions, and one plan everyone can read on a phone.",
    sections: [
      {
        title: "What the couple gets",
        copy: "A workspace for notes, decisions, tasks, and the shared plan. The venue's name sits quietly at the top. The wedding stays the thing in focus.",
      },
      {
        title: "What the coordinator gets",
        copy: "A clearer planning year. The same repeated questions still happen, but now the answer has a home that can be forwarded instead of rewritten.",
      },
      {
        title: "What the venue pays",
        copy: "The founding cohort locks EUR1,500 a year for as long as it stays. Larger or multi-site venues move into the EUR1,500-EUR4,000 annual band.",
      },
    ],
    primaryCta: {
      label: "Read the venue page",
      href: "/venues",
    },
    secondaryCta: {
      label: "Watch the venue demo",
      href: "/venues/demo",
    },
  },
  {
    slug: "notion-alternative-wedding-planners",
    title: "Notion Alternative for Wedding Planners - Signal Studio",
    description:
      "Signal Studio is a clearer wedding planning workspace for planners who need notes, tasks, a client plan, and a daily briefing without building a system first.",
    eyebrow: "Wedding planners",
    h1: "Not a wiki. A wedding workspace.",
    intro:
      "Notion is powerful when you want to design the system yourself. A planner in season usually does not. Signal Studio starts with the work already shaped and keeps the client-facing plan separate from private notes.",
    sections: [
      {
        title: "Notes stay private",
        copy: "Signal Notes catches the venue call, the half-formed thought, and the detail you are not ready to share. Only approved extracts become work.",
      },
      {
        title: "Tasks carry the follow-up",
        copy: "Signal Tasks turns the next action into owned work with dates and plain-language status. It does not ask the planner to become a project manager.",
      },
      {
        title: "Timeline is what the couple sees",
        copy: "Signal Timeline gives the couple the part they need: what changed, what is waiting, and what happens next.",
      },
    ],
    primaryCta: {
      label: "See the wedding proof",
      href: "/proof",
    },
    secondaryCta: {
      label: "Open Signal Notes",
      href: NOTES_URL,
    },
  },
  {
    slug: "trello-alternative-builders",
    title: "Trello Alternative for Builders - Signal Studio",
    description:
      "A plain-English workspace for builders and trades operators who need site notes, follow-ups, client updates, and a short briefing.",
    eyebrow: "Builders and trades",
    h1: "A board is not enough when the site keeps changing.",
    intro:
      "Trello gives you cards. Signal Studio gives the work around the cards somewhere to live: the site note, the task, the client-facing update, and the short read on what needs attention.",
    sections: [
      {
        title: "Capture the site note first",
        copy: "A builder can write what changed, what was decided, and what is still waiting before any of it is tidy enough to become a task.",
      },
      {
        title: "Turn the right parts into work",
        copy: "The window supplier, the electrician, the client tile choice: each can become a task when it earns the move from note to work.",
      },
      {
        title: "Give clients a readable update",
        copy: "A public plan lets the client understand what is happening without being invited into the private mess of the job.",
      },
    ],
    primaryCta: {
      label: "Read the proof scene",
      href: "/proof",
    },
    secondaryCta: {
      label: "Open Signal Tasks",
      href: TASKS_URL,
    },
  },
  {
    slug: "project-management-students-no-sprints",
    title: "Project Management for Students Without Sprints - Signal Studio",
    description:
      "A plain-English workspace for students carrying projects, deadlines, notes, group work, and a daily read on what needs attention.",
    eyebrow: "Students",
    h1: "No sprints. No epics. Just the work due next.",
    intro:
      "Students do not need the vocabulary of a software team. They need one place for the group project, the thesis chapter, the notes from supervision, and the few things that matter this week.",
    sections: [
      {
        title: "The student rate",
        copy: "The student tier carries the full Workspace plan for €9.99 a year, verified with any student email. The price does not become another thing to manage.",
      },
      {
        title: "Four views, same work",
        copy: "Board, list, timeline, calendar. The plan changes shape without asking the student to re-enter the work.",
      },
      {
        title: "A briefing, not a dashboard",
        copy: "Signal reads the work and writes a short briefing. What is late, what is moving, and what deserves attention today.",
      },
    ],
    primaryCta: {
      label: "See pricing",
      href: "/pricing",
    },
    secondaryCta: {
      label: "Open the briefing",
      href: SIGNAL_URL,
    },
  },
];

export function getComparisonPage(slug: string): ComparisonPage | undefined {
  return COMPARISON_PAGES.find((page) => page.slug === slug);
}
