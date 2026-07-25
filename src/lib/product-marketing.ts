import type { ProductId } from "@/lib/product-urls";

export type ProductMarketingDefinition = Readonly<{
  id: ProductId;
  name: string;
  position: string;
  headline: string;
  introduction: string;
  openLabel: string;
  details: ReadonlyArray<Readonly<{ title: string; copy: string }>>;
  boundary: string;
}>;

export const PRODUCT_MARKETING: Readonly<
  Record<ProductId, ProductMarketingDefinition>
> = Object.freeze({
  notes: {
    id: "notes",
    name: "Signal Notes",
    position: "Capture clarity",
    headline: "Keep the thought until it earns a task.",
    introduction:
      "A private notebook for the work as it happens. Capture it quickly, find it again, and move it into Tasks only when you decide it is ready.",
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
    boundary:
      "Notes is private by default. Promotion into Tasks is one-way and always initiated by the person who wrote the note.",
  },
  tasks: {
    id: "tasks",
    name: "Signal Tasks",
    position: "Execution clarity",
    headline: "Keep ownership clear without learning a new language.",
    introduction:
      "A shared place for live work, written in plain English. See what needs doing, who owns it, and what the week is asking for.",
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
    boundary:
      "Tasks runs the work. It does not turn every thought into a task or make a dashboard out of activity.",
  },
  timeline: {
    id: "timeline",
    name: "Signal Timeline",
    position: "Direction clarity",
    headline: "Give everyone one page that says where things stand.",
    introduction:
      "Shape the work into a plan people can read. Keep the owner view inside Signal Studio and publish only the timeline you mean to share.",
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
    boundary:
      "A public Timeline is an intentional artifact, not an open window into private Notes, Tasks, project names, or briefing content.",
  },
  signal: {
    id: "signal",
    name: "Signal",
    position: "Attention clarity",
    headline: "Know what actually needs you today.",
    introduction:
      "A briefing drawn from the work already in Signal Studio. It surfaces the few things that deserve attention without becoming another dashboard.",
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
    boundary:
      "Signal surfaces attention from authorised workspace data. It does not expose private work or make decisions on a person's behalf.",
  },
});
