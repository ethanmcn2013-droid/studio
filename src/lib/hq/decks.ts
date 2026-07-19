/**
 * The Decks library — every board, sales, and diligence deck in one place,
 * each with an active thumbnail. Thumbnails are captured by
 * scripts/hq-redesign/deck-thumbs.mjs into public/hq/deck-thumbs/.
 */

export type DeckState = "READY" | "WORKING" | "SOURCE" | "GATED";

export type Deck = {
  id: string;
  name: string;
  state: DeckState;
  href: string;
  external?: boolean;
  /** URL the thumbnail script visits (defaults to href). */
  captureUrl?: string;
  /** Needs the HQ session cookie (internal /hq routes). */
  authed?: boolean;
  meta?: string;
  audience: string;
  note: string;
  hasThumb: boolean;
};

export const DECKS: Deck[] = [
  {
    id: "deck-pitch",
    name: "Investor pitch deck",
    state: "READY",
    href: "/hq/deck",
    captureUrl: "/brand/pitch-deck-2026.html",
    meta: "12-month plan",
    audience: "Shareholders",
    note: "The seed-round narrative: problem, wedge, product, market, and the ask. Route to Reporting for live numbers.",
    hasThumb: true,
  },
  {
    id: "deck-market-entry",
    name: "Market entry & growth",
    state: "READY",
    href: "/hq/market-entry",
    captureUrl: "/brand/market-entry-deck-2026.html",
    meta: "70 slides",
    audience: "Founder · shareholders",
    note: "The go-to-market companion to the business plan: where every euro of spend goes and exactly how the market is entered.",
    hasThumb: true,
  },
  {
    id: "deck-loan",
    name: "Business loan pack",
    state: "READY",
    href: "/hq/loan-pack",
    captureUrl: "/brand/business-loan-pack-2026.html",
    meta: "€40k facility",
    audience: "Lender",
    note: "The lender business plan for the €40k facility, with the Student Edition adjacent wedge. Password-gated on the public route.",
    hasThumb: true,
  },
  {
    id: "deck-plan",
    name: "Six-month marketing plan",
    state: "READY",
    href: "/hq/plan",
    captureUrl: "/hq/plan",
    authed: true,
    meta: "print-fidelity",
    audience: "Founder · shareholders",
    note: "The venue engine and hedge buckets as a board-readable growth plan. Print export at /hq/plan/print.",
    hasThumb: true,
  },
  {
    id: "deck-one-pagers",
    name: "Product one-pagers",
    state: "READY",
    href: "/hq/one-pagers",
    captureUrl: "/hq/one-pagers",
    authed: true,
    meta: "5 exports",
    audience: "Marketing · shareholders",
    note: "A4 print-ready one-pagers for Tasks, Timeline, Signal, Notes, and the brand.",
    hasThumb: true,
  },
  {
    id: "deck-motion-brief",
    name: "The Film System · motion brief",
    state: "READY",
    href: "/brand/motion-brief.html",
    external: true,
    captureUrl: "/brand/motion-brief.html",
    meta: "30 film specs",
    audience: "Creative",
    note: "The reference for every motion-graphic and advertising film: the strategy, the motion language, a phased production plan.",
    hasThumb: true,
  },
];

export function deckThumb(deck: Deck): string | undefined {
  return deck.hasThumb ? `/hq/deck-thumbs/${deck.id}.jpg` : undefined;
}
