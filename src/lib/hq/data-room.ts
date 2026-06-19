/**
 * The Data Room — the one curated index for an outsider doing diligence.
 *
 * The Asset hub is the full material library; this is the *ordered, board-
 * and lender-ready subset* — the "send this one link" view. It deliberately
 * shows honest states: `ready` links straight to the surface, `pending`
 * names what isn't built yet rather than hiding the gap, `external` is a
 * public page anyone can open.
 *
 * Pure, client-safe data. Keep figures pointing at their source (the loan
 * pack, reporting) rather than restating numbers here — restated numbers
 * are how decks drift (see the €40k/€50k fix, S·78).
 */

export type DataRoomState = "ready" | "pending" | "external";

export type DataRoomItem = {
  label: string;
  note: string;
  href?: string;
  state: DataRoomState;
};

export type DataRoomSection = {
  id: string;
  title: string;
  blurb: string;
  items: DataRoomItem[];
};

export const DATA_ROOM: DataRoomSection[] = [
  {
    id: "narrative",
    title: "The narrative",
    blurb: "What the company is, why now, and how the market is entered.",
    items: [
      { label: "Business plan", note: "Lender-grade plan · the case for funding.", href: "/hq/plan", state: "ready" },
      { label: "Market entry & growth deck", note: "70 slides · the go-to-market companion.", href: "/hq/market-entry", state: "ready" },
      { label: "Investor / seed deck", note: "12-month plan for shareholder conversations.", href: "/brand/pitch-deck-2026.html", state: "ready" },
      { label: "Founder operating system", note: "The whole company on one map.", href: "/hq/blueprint", state: "ready" },
    ],
  },
  {
    id: "the-ask",
    title: "The ask",
    blurb: "The €40k facility and exactly where it goes.",
    items: [
      { label: "Loan pack", note: "€40k facility · lender deck (password-gated).", href: "/hq/loan-pack", state: "ready" },
      { label: "Use of funds", note: "Where every euro goes — in the loan pack + market deck.", href: "/hq/market-entry", state: "ready" },
    ],
  },
  {
    id: "numbers",
    title: "The numbers",
    blurb: "Traction read live; the model behind it.",
    items: [
      { label: "Reporting", note: "Only the numbers that matter — read from source.", href: "/hq/reporting", state: "ready" },
      { label: "Live metrics", note: "9 of 11 blueprint metrics wired to the ledger + apps.", href: "/hq/blueprint#bp-metrics", state: "ready" },
      { label: "Financial model", note: "Cash-basis projection · revenue build, runway, unit economics.", href: "/hq/financial-model", state: "ready" },
    ],
  },
  {
    id: "company",
    title: "The company",
    blurb: "Who owns it and its legal standing.",
    items: [
      { label: "Founders Circle", note: "The board / shareholder view.", href: "/hq/founders-circle", state: "ready" },
      { label: "Cap table", note: "Class A voting (90%) · Class B Founder Circle (10%) · pre-incorporation.", href: "/hq/cap-table", state: "ready" },
      { label: "Incorporation pack", note: "CRO runbook + timeline · decisions confirmed, filing targeted July 2026.", href: "/hq/incorporation", state: "ready" },
    ],
  },
  {
    id: "product-brand",
    title: "Product & brand",
    blurb: "What's actually built, and the brand it's built in.",
    items: [
      { label: "Brand kit", note: "The live brand system + downloadable kit.", href: "/brand", state: "ready" },
      { label: "Product one-pagers", note: "Notes · Tasks · Timeline · Signal, one page each.", href: "/hq/one-pagers", state: "ready" },
      { label: "Review hub", note: "Open all four products in demo mode.", href: "/review", state: "external" },
    ],
  },
  {
    id: "legal-trust",
    title: "Legal & trust",
    blurb: "The documents the business runs on, and its data posture.",
    items: [
      { label: "Vault", note: "Every document the business runs on.", href: "/hq/vault", state: "ready" },
      { label: "Terms", note: "Public terms of service.", href: "/terms", state: "external" },
      { label: "Privacy", note: "Public privacy policy.", href: "/privacy", state: "external" },
      { label: "Security", note: "Security posture + practices.", href: "/security", state: "external" },
    ],
  },
  {
    id: "proof",
    title: "Proof",
    blurb: "Evidence the thing works — growing as the wedge converts.",
    items: [
      { label: "Venue sales pack", note: "Founder-signed venue material.", href: "/hq/assets", state: "ready" },
      { label: "Product demo film", note: "Motion-graphics demo — dependency, in progress.", state: "pending" },
      { label: "First venue case study", note: "Reserved — lands the day Gate 0 clears.", state: "pending" },
    ],
  },
];

export function dataRoomCounts() {
  const all = DATA_ROOM.flatMap((s) => s.items);
  return {
    total: all.length,
    ready: all.filter((i) => i.state === "ready" || i.state === "external").length,
    pending: all.filter((i) => i.state === "pending").length,
  };
}
