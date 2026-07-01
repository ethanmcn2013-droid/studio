// One-pager document registry.
//
// Six exportable documents live on Signal HQ: four product one-pagers,
// one brand one-pager, and the marketing-plan deck export. This registry
// is the single source the /hq/one-pagers hub and the HQ nav read from —
// add a document here and it appears in both places.
//
// Brand canon (BRAND.md §4/§5, DESIGN.md §5, docs/ONE_PAGER_SPEC.md §1):
// every document is white with one indigo period. The per-product gesture
// is a typographic mark, never an icon. Names are full-form ("Signal
// Tasks", never bare "Signal").

export type OnePagerGesture = "pulse" | "sweep" | "tick" | "caret" | "broadcast";

export interface OnePagerDoc {
  /** URL slug under /hq/one-pagers (the deck uses its own /hq/plan/print). */
  slug: string;
  /** Full-form document name as it reads in the masthead. */
  wordmark: string;
  /** Mono eyebrow under the wordmark — uppercased at render. */
  eyebrow: string;
  /** One line for the hub index — what the document is. */
  summary: string;
  /** The product gesture, translated to a static typographic mark. */
  gesture: OnePagerGesture;
  /** Route to the print-ready page. */
  href: string;
  /** Page format — one-pagers are A4 portrait; the deck is landscape. */
  format: "a4-portrait" | "a4-landscape";
}

export const ONE_PAGERS: OnePagerDoc[] = [
  {
    slug: "tasks",
    wordmark: "signal tasks.",
    eyebrow: "Signal Tasks · Execution clarity",
    summary: "What needs doing, who owns it, what's stuck — in plain English.",
    gesture: "pulse",
    href: "/hq/one-pagers/tasks",
    format: "a4-portrait",
  },
  {
    slug: "roadmap",
    wordmark: "signal timeline.",
    eyebrow: "Signal Timeline· Direction clarity",
    summary: "A shareable timeline a non-technical reader understands in under a minute.",
    gesture: "sweep",
    href: "/hq/one-pagers/roadmap",
    format: "a4-portrait",
  },
  {
    slug: "analytics",
    wordmark: "signal.",
    eyebrow: "Signal · Attention clarity",
    summary: "A daily briefing, not a dashboard — the three things worth attention today.",
    gesture: "tick",
    href: "/hq/one-pagers/analytics",
    format: "a4-portrait",
  },
  {
    slug: "notes",
    wordmark: "signal notes.",
    eyebrow: "Signal Notes · Capture clarity",
    summary: "A private notebook that sends work forward when it's ready.",
    gesture: "caret",
    href: "/hq/one-pagers/notes",
    format: "a4-portrait",
  },
  {
    slug: "brand",
    wordmark: "signal studio.",
    eyebrow: "Signal Studio · The system",
    summary: "Five products, one discipline — the umbrella one-pager.",
    gesture: "broadcast",
    href: "/hq/one-pagers/brand",
    format: "a4-portrait",
  },
];

/** The deck export is registered for the hub but renders from its own route. */
export const DECK_EXPORT = {
  slug: "marketing-plan",
  wordmark: "signal studio.",
  eyebrow: "Six-month marketing plan",
  summary: "The marketing-plan deck, exported as a print-fidelity PDF.",
  href: "/hq/plan/print",
  format: "a4-landscape" as const,
};

export function getOnePager(slug: string): OnePagerDoc | undefined {
  return ONE_PAGERS.find((d) => d.slug === slug);
}
