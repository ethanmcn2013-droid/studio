import type { ProductId } from "@/lib/product-urls";

export type ProductMarketingDefinition = Readonly<{
  id: ProductId;
  name: string;
  position: string;
  headline: string;
  introduction: string;
  openLabel: string;
  details: ReadonlyArray<Readonly<{ title: string; copy: string }>>;
  story: readonly [
    Readonly<{ number: string; title: string; copy: string }>,
    Readonly<{ number: string; title: string; copy: string }>,
    Readonly<{ number: string; title: string; copy: string }>,
  ];
  boundary: string;
}>;

export const PRODUCT_MARKETING: Readonly<
  Record<ProductId, ProductMarketingDefinition>
> = Object.freeze({
  notes: {
    id: "notes",
    name: "Signal Notes",
    position: "Capture clarity",
    headline: "Catch it before the day carries it away.",
    introduction:
      "A private notebook that opens ready. Write first. Decide what becomes work later.",
    openLabel: "Open Notes",
    details: [
      {
        title: "Capture first",
        copy: "Write before you organise. Notes stays quiet while the thought is still taking shape.",
      },
      {
        title: "Find it again",
        copy: "Search the notebook without building folders, boards, or a second system to maintain.",
      },
      {
        title: "Promote on purpose",
        copy: "Turn a note into work in Tasks when you choose. Signal Studio never invents a to-do for you.",
      },
    ],
    story: [
      {
        number: "08:14",
        title: "A thought arrives.",
        copy: "Write it before the first meeting.",
      },
      {
        number: "12:06",
        title: "The detail matters again.",
        copy: "Find the note by the words you remember.",
      },
      {
        number: "16:42",
        title: "One line earns action.",
        copy: "Move that line to Tasks when you are ready.",
      },
    ],
    boundary:
      "A note never becomes a task until you choose it. Capture and commitment stay separate.",
  },
  tasks: {
    id: "tasks",
    name: "Signal Tasks",
    position: "Execution clarity",
    headline: "Know what needs doing. Then do it.",
    introduction:
      "One place for the commitments, dates and people that keep real work moving.",
    openLabel: "Open Tasks",
    details: [
      {
        title: "One clear owner",
        copy: "Every task says who has it. No sprint vocabulary, configuration ceremony, or project-manager voice.",
      },
      {
        title: "The week in view",
        copy: "Move between board, list, calendar, and timeline views without rebuilding the work.",
      },
      {
        title: "Built to hand over",
        copy: "Invite the people doing the work, share the right output, and keep the source in one place.",
      },
    ],
    story: [
      {
        number: "MON",
        title: "The week opens.",
        copy: "Three commitments are due before Friday.",
      },
      {
        number: "WED",
        title: "One hand-off moves.",
        copy: "The owner changes. The work stays clear.",
      },
      {
        number: "FRI",
        title: "The last mark closes.",
        copy: "The project moves without a status meeting.",
      },
    ],
    boundary:
      "Tasks shows the work. It does not grade the person doing it or fill the screen with performance theatre.",
  },
  timeline: {
    id: "timeline",
    name: "Signal Timeline",
    position: "Direction clarity",
    headline: "Turn milestone tasks into a story anyone can follow.",
    introduction:
      "Shape a private owner draft, then publish a calm timeline that opens without an account.",
    openLabel: "Open Timeline",
    details: [
      {
        title: "Explain the plan",
        copy: "Turn dates, milestones, and decisions into a clear sequence without asking the reader to learn the tool.",
      },
      {
        title: "Curate before sharing",
        copy: "The owner decides what belongs in the public artifact. Private working detail stays out.",
      },
      {
        title: "One stable link",
        copy: "Share a read-only timeline that stays legible on a phone and does not require an account.",
      },
    ],
    story: [
      {
        number: "01",
        title: "The brief is agreed.",
        copy: "A marker appears from the task that matters.",
      },
      {
        number: "02",
        title: "The middle becomes clear.",
        copy: "Owner wording explains the change in plain English.",
      },
      {
        number: "03",
        title: "The link travels.",
        copy: "A client opens the story without a sign-in wall.",
      },
    ],
    boundary:
      "The public copy contains only the milestone wording, dates and states you choose. Private work stays private.",
  },
  signal: {
    id: "signal",
    name: "Signal",
    position: "Attention clarity",
    headline: "Start with the change that needs you.",
    introduction:
      "A daily briefing drawn from the work you already hold across Signal Studio.",
    openLabel: "Open Signal",
    details: [
      {
        title: "A briefing, not a dashboard",
        copy: "Read the useful part first. Evidence remains available when you need to understand why something surfaced.",
      },
      {
        title: "Built from the work",
        copy: "Signal reads the state of your workspace. It does not ask you to maintain a second reporting layer.",
      },
      {
        title: "Quiet when all is clear",
        copy: "No invented urgency and no score for the sake of a score. An honest all-clear is a valid result.",
      },
    ],
    story: [
      {
        number: "07:30",
        title: "The briefing arrives.",
        copy: "Two changes and one decision need attention.",
      },
      {
        number: "07:32",
        title: "The source opens.",
        copy: "A held-up task has the context needed to act.",
      },
      {
        number: "07:36",
        title: "The briefing is done.",
        copy: "The rest of the day belongs to the work.",
      },
    ],
    boundary:
      "Signal is a briefing, not another place to manage the work. Read it, act, then leave.",
  },
});
