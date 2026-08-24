import type {
  HandoffDefinition,
  HandoffOption,
  HandoffProduct,
} from "./types";

export const HANDOFF_PRODUCT_ORDER: HandoffProduct[] = [
  "notes",
  "tasks",
  "timeline",
  "signal",
];

export const HANDOFF_OPTIONS: Array<{
  id: HandoffOption;
  name: string;
  axis: string;
  cost: string;
}> = [
  {
    id: "a",
    name: "Living Artifact",
    axis: "One object changes grammar while its identity stays intact.",
    cost: "The most choreographed direction. It demands exact frame craft.",
  },
  {
    id: "b",
    name: "Provenance Rail",
    axis: "A continuous route makes the suite relationship architectural.",
    cost: "The clearest system view, but less intimate than one living object.",
  },
  {
    id: "c",
    name: "Editorial Cause",
    axis: "Large type states the cause. Product evidence arrives as the result.",
    cost: "The boldest composition. It uses more vertical space.",
  },
];

export const HANDOFF_DEFINITIONS: Record<
  HandoffProduct,
  HandoffDefinition
> = {
  notes: {
    product: "notes",
    caption: "Notes → Tasks",
    lead: "The approved line becomes work.",
    body: "It arrives owned and due. The note it came from stays private.",
    source: {
      kind: "notes",
      productLabel: "Private note",
      text: "Venue can open the side room after six",
      facts: [
        { label: "Visibility", value: "Private" },
        { label: "Captured", value: "8:41" },
      ],
    },
    destination: {
      kind: "tasks",
      productLabel: "Task",
      text: "Ask the venue to hold the side room",
      facts: [
        { label: "Source", value: "Approved line" },
        { label: "Due", value: "Fri" },
        { label: "Owner", value: "Mara" },
      ],
    },
    payloadText: "Venue can open the side room after six",
    nextHref: "/tasks",
    nextLabel: "Next: Tasks",
    lineageLabel: "Approved meaning retained. Private note stays put.",
  },
  tasks: {
    product: "tasks",
    caption: "Tasks → Timeline",
    lead: "Done moves the line.",
    body: "The public plan advances from completed work. Nobody writes a status.",
    source: {
      kind: "tasks",
      productLabel: "Task",
      text: "Confirm the catering tasting menu",
      facts: [
        { label: "State", value: "In progress" },
        { label: "Priority", value: "P1" },
      ],
    },
    destination: {
      kind: "timeline",
      productLabel: "Timeline milestone",
      text: "Menu confirmed",
      facts: [
        { label: "Date", value: "30 Jul" },
        { label: "Source", value: "Completed task" },
      ],
    },
    payloadText: "Confirm the catering tasting menu · done",
    nextHref: "/timeline",
    nextLabel: "Next: Timeline",
    lineageLabel: "Completion becomes a dated public fact.",
  },
  timeline: {
    product: "timeline",
    caption: "Timeline → Home",
    lead: "The plan feeds your briefing.",
    body: "The next dated moment arrives with its date and source intact.",
    source: {
      kind: "timeline",
      productLabel: "Timeline milestone",
      text: "Send the invitations",
      facts: [
        { label: "Date", value: "13 Aug" },
        { label: "State", value: "Next" },
      ],
    },
    destination: {
      kind: "signal",
      productLabel: "Tomorrow's briefing",
      text: "Invitations are due 13 Aug.",
      facts: [
        { label: "Receipt", value: "Timeline" },
        { label: "Observed", value: "Today" },
      ],
    },
    payloadText: "Send the invitations · 13 Aug · Timeline",
    nextHref: null,
    nextLabel: null,
    lineageLabel: "Date and Timeline receipt remain attached.",
  },
  signal: {
    product: "signal",
    caption: "Signal → the work",
    lead: "The read ends in the work.",
    body: "Every briefing line keeps the owner, date, and source that produced it.",
    source: {
      kind: "signal",
      productLabel: "This morning's read",
      text: "The final dietary list is still open.",
      facts: [
        { label: "Attention", value: "Now" },
        { label: "Receipt", value: "Tasks" },
      ],
    },
    destination: {
      kind: "tasks",
      productLabel: "Task",
      text: "Close the final dietary list",
      facts: [
        { label: "Owner", value: "Mara" },
        { label: "Due", value: "Today" },
      ],
    },
    payloadText: "Final dietary list · Tasks receipt",
    nextHref: null,
    nextLabel: null,
    lineageLabel: "The briefing resolves to owned work.",
  },
};
