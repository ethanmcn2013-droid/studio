import type { CSSProperties } from "react";

/**
 * The three email-system directions under founder review · v2 craft pass.
 *
 * One shared component set (src/emails/components) renders every template;
 * a direction is pure presentation data plus a small number of structural
 * variants the components branch on. Content, fixtures and message metadata
 * never live here, so choosing a direction later deletes nothing but tokens.
 *
 *   hairline   · minimal operational trust  · engraved monochrome, one dot
 *   broadsheet · editorial product precision · the front page, fully made up
 *   letterhead · human founder-led warmth    · a letter that signs itself
 *
 * The v2 charters live in docs/email-system/elevation-charters.md. Three
 * deliberate divergences are contract, not drift: three date grammars,
 * three action constructions (engraved rule / filled ink / indigo pill),
 * three fallback stacks. The craft ledger (craft-ledger.md) records why.
 *
 * Shared colour truth comes from ds-foundation tokens.css (v2, 2026-07-02):
 * paper #ffffff, ink #111111, one indigo #4f46e5. Email clients cannot read
 * CSS variables, so the values are inlined here, once.
 */

// ── Suite colour truth (email-safe solids) ─────────────────────────────
export const INK = "#111111";
export const INK_SOFT = "#3f3f46";
export const INK_FAINT = "#71717a";
export const PAPER = "#ffffff";
export const PAPER_SOFT = "#fafafa";
export const PAPER_DEEP = "#f4f4f5";
export const INDIGO = "#4f46e5";
export const INDIGO_DEEP = "#4338ca";
export const INDIGO_TINT = "#eef2ff";
// --hairline is rgba(17,17,17,.10); email borders want solids.
export const HAIRLINE = "#e7e7e9";
export const HAIRLINE_SOFT = "#f1f1f3";
export const RED_DEEP = "#b91c1c"; // destructive text, AA on paper

export type DirectionId = "hairline" | "broadsheet" | "letterhead";

const MONTHS_FULL = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function parseISO(iso: string): { d: number; m: number; y: number } {
  const [y, m, d] = iso.split("-").map(Number);
  return { d, m: m - 1, y };
}

export type EmailDirection = {
  id: DirectionId;
  name: string;
  /** One-sentence thesis shown in the Email Lab. */
  thesis: string;
  /** The strategic pole this direction explores. */
  pole: string;

  // ── Face ─────────────────────────────────────────────────────────────
  /** Designed per direction: the fallback is the design most people see. */
  fontStack: string;
  monoStack: string;

  // ── One date grammar per direction (CL-01). Dates arrive as ISO. ────
  /** Eyebrow/folio register, e.g. "16 Jul 2026" / "16 JULY 2026". */
  formatDate: (iso: string) => string;
  /** Month-only register for folios, e.g. "JULY 2026". */
  formatMonth: (iso: string) => string;

  // ── Canvas ───────────────────────────────────────────────────────────
  canvasBg: string;
  surfaceBg: string;
  maxWidth: number;
  frame: {
    border: string | undefined;
    radius: number;
    canvasPad: number;
  };
  edgePad: number;

  // ── Type scale ───────────────────────────────────────────────────────
  h1: CSSProperties;
  lead: CSSProperties;
  body: CSSProperties;
  small: CSSProperties;
  /** Mono metadata register: one tracked-caps value per direction (CL-03). */
  label: CSSProperties;
  /** Image caption register (CL-04): each direction chooses one grammar. */
  caption: CSSProperties;

  // ── Rhythm (base-4; sections base-8) ─────────────────────────────────
  space: { para: number; block: number; section: number };

  // ── Structural variants the components branch on ────────────────────
  header: "rule" | "masthead" | "sheet";
  footer: "line" | "masthead" | "postal";
  cta: {
    /** engraved · 1px ink rule (Hairline) / ink · filled (Broadsheet) / pill · indigo (Letterhead) */
    variant: "engraved" | "ink" | "pill";
    bg: string;
    color: string;
    border: string | undefined;
    radius: number;
    /** Vertical, horizontal padding in px (also drives the VML fallback). */
    padV: number;
    padH: number;
    font: CSSProperties;
  };
  /** Text links: Hairline and Letterhead ration indigo (CL-16). */
  link: { color: string };
  imagery: {
    radius: number;
    border: string | undefined;
    /** Broadsheet sets a hairline between photograph and caption. */
    captionRule: boolean;
  };
  signature: "plain" | "byline" | "letter";
  /**
   * Dark behaviour under prefers-color-scheme: dark.
   *   adapt · the whole message re-colours to the direction's dark stock
   *   hold  · the sheet stays paper; only the room around it goes dark
   */
  dark: "adapt" | "hold";
  /** The designed dark stock (adapt) or dark room (hold). */
  darkPalette: {
    canvas: string;
    surface: string;
    text: string;
    soft: string;
    faint: string;
    hairline: string;
    panel: string;
  };
  /** Plain-text composition (CL-14): one rule convention per direction. */
  text: {
    /** Rule line under the header, or null for none (Letterhead). */
    rule: string | null;
    /** Secondary rule between sections, or null. */
    ruleSoft: string | null;
  };
};

/** Shared tabular-figure declaration (CL-07, CL-20). */
export const TABULAR: CSSProperties = { fontVariantNumeric: "tabular-nums" };

const hairline: EmailDirection = {
  id: "hairline",
  name: "Hairline",
  thesis:
    "Engraved monochrome: one rule weight, one dot of indigo, and luxury spent exclusively on spacing.",
  pole: "Minimal operational trust",

  // Swiss grotesque: Helvetica first after Geist. The direction least
  // dependent on Geist; the thesis survives the fallback fully.
  fontStack:
    "Geist, 'Helvetica Neue', Helvetica, -apple-system, Arial, sans-serif",
  monoStack:
    "'Geist Mono', 'SF Mono', SFMono-Regular, Menlo, Consolas, monospace",

  // The ledger's date: abbreviated, unspaced by ceremony.
  formatDate: (iso) => {
    const { d, m, y } = parseISO(iso);
    return `${d} ${MONTHS_FULL[m].slice(0, 3)} ${y}`;
  },
  formatMonth: (iso) => {
    const { m, y } = parseISO(iso);
    return `${MONTHS_FULL[m].slice(0, 3)} ${y}`;
  },

  canvasBg: PAPER,
  surfaceBg: PAPER,
  maxWidth: 520,
  frame: { border: undefined, radius: 0, canvasPad: 48 },
  edgePad: 28,

  h1: {
    fontSize: 20,
    lineHeight: "28px",
    fontWeight: 600,
    letterSpacing: "-0.01em",
    color: INK,
  },
  lead: { fontSize: 15, lineHeight: "24px", color: INK_SOFT },
  body: { fontSize: 15, lineHeight: "24px", color: INK_SOFT },
  small: { fontSize: 13, lineHeight: "20px", color: INK_FAINT },
  label: {
    fontFamily:
      "'Geist Mono', 'SF Mono', SFMono-Regular, Menlo, Consolas, monospace",
    fontSize: 11,
    lineHeight: "16px",
    letterSpacing: "0.08em",
    textTransform: "uppercase" as const,
    color: INK_FAINT,
    ...TABULAR,
  },
  caption: {
    fontSize: 13,
    lineHeight: "20px",
    color: INK_FAINT,
  },

  space: { para: 12, block: 20, section: 32 },

  header: "rule",
  footer: "line",
  cta: {
    // The engraved action (CL-15): cheque-book furniture, not software.
    variant: "engraved",
    bg: PAPER,
    color: INK,
    border: `1px solid ${INK}`,
    radius: 4,
    padV: 11,
    padH: 22,
    font: { fontSize: 14, fontWeight: 600, letterSpacing: "0.01em" },
  },
  link: { color: INK }, // monochrome plus one dot: links are ink, underlined
  imagery: { radius: 4, border: `1px solid ${HAIRLINE}`, captionRule: false },
  signature: "plain",
  dark: "adapt",
  darkPalette: {
    canvas: "#141416",
    surface: "#141416",
    text: "#ececf0",
    soft: "#c6c6cc",
    faint: "#98989f",
    hairline: "#33333a",
    panel: "#1d1d21",
  },
  text: { rule: "-", ruleSoft: null },
};

const broadsheet: EmailDirection = {
  id: "broadsheet",
  name: "Broadsheet",
  thesis:
    "The front page, fully made up: one folio grammar, numbered stories, and photographs the picture desk chose.",
  pole: "Editorial product precision",

  // Chosen grotesque (the Compositor's serif dissent is on record).
  fontStack:
    "Geist, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
  monoStack:
    "'Geist Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",

  // The folio: full month, capitals.
  formatDate: (iso) => {
    const { d, m, y } = parseISO(iso);
    return `${d} ${MONTHS_FULL[m].toUpperCase()} ${y}`;
  },
  formatMonth: (iso) => {
    const { m, y } = parseISO(iso);
    return `${MONTHS_FULL[m].toUpperCase()} ${y}`;
  },

  canvasBg: PAPER,
  surfaceBg: PAPER,
  maxWidth: 600,
  frame: { border: undefined, radius: 0, canvasPad: 44 },
  edgePad: 32,

  h1: {
    fontSize: 31,
    lineHeight: "36px",
    fontWeight: 600,
    letterSpacing: "-0.03em",
    color: INK,
  },
  lead: { fontSize: 17, lineHeight: "27px", color: INK_SOFT },
  body: { fontSize: 15, lineHeight: "25px", color: INK_SOFT },
  small: { fontSize: 13, lineHeight: "20px", color: INK_FAINT },
  label: {
    fontFamily:
      "'Geist Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
    fontSize: 11,
    lineHeight: "16px",
    letterSpacing: "0.14em",
    textTransform: "uppercase" as const,
    color: INK_FAINT,
    ...TABULAR,
  },
  // The picture desk's caption: mono, sentence case, quiet tracking.
  caption: {
    fontFamily:
      "'Geist Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
    fontSize: 12,
    lineHeight: "19px",
    letterSpacing: "0.02em",
    color: INK_SOFT,
  },

  space: { para: 14, block: 26, section: 40 },

  header: "masthead",
  footer: "masthead",
  cta: {
    variant: "ink",
    bg: INK,
    color: PAPER,
    border: undefined,
    radius: 2,
    padV: 13,
    padH: 26,
    font: { fontSize: 14, fontWeight: 600, letterSpacing: "0.02em" },
  },
  link: { color: INDIGO }, // indigo lives in links and the dot, never rules
  imagery: { radius: 2, border: `1px solid ${HAIRLINE}`, captionRule: true },
  signature: "byline",
  dark: "adapt",
  darkPalette: {
    canvas: "#1a1a1c",
    surface: "#1a1a1c",
    text: "#f0f0f2",
    soft: "#c8c8cd",
    faint: "#9b9ba3",
    hairline: "#3a3a3f",
    panel: "#242428",
  },
  text: { rule: "=", ruleSoft: "-" },
};

const letterhead: EmailDirection = {
  id: "letterhead",
  name: "Letterhead",
  thesis:
    "A letter that signs itself: dated in words, warm in measure, with the founder's name as the design element.",
  pole: "Human founder-led warmth",

  // Humanist order: the platform faces first after Geist (SF on the
  // Apple clients where most venue and school correspondents read mail).
  fontStack:
    "Geist, -apple-system, 'Segoe UI', 'Helvetica Neue', Helvetica, Arial, sans-serif",
  monoStack:
    "'Geist Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",

  // The letter dates itself in words, sentence case, in the text face.
  formatDate: (iso) => {
    const { d, m, y } = parseISO(iso);
    return `${d} ${MONTHS_FULL[m]} ${y}`;
  },
  formatMonth: (iso) => {
    const { m, y } = parseISO(iso);
    return `${MONTHS_FULL[m]} ${y}`;
  },

  canvasBg: PAPER_SOFT,
  surfaceBg: PAPER,
  maxWidth: 560,
  frame: { border: `1px solid ${HAIRLINE}`, radius: 10, canvasPad: 40 },
  edgePad: 40,

  h1: {
    fontSize: 22,
    lineHeight: "30px",
    fontWeight: 600,
    letterSpacing: "-0.015em",
    color: INK,
  },
  lead: { fontSize: 16, lineHeight: "26px", color: INK_SOFT },
  body: { fontSize: 16, lineHeight: "26px", color: INK_SOFT },
  small: { fontSize: 13, lineHeight: "20px", color: INK_FAINT },
  // Letterhead nearly abolishes its mono register: the enclosure line
  // and fact labels only.
  label: {
    fontFamily:
      "'Geist Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
    fontSize: 11,
    lineHeight: "16px",
    letterSpacing: "0.08em",
    textTransform: "uppercase" as const,
    color: INK_FAINT,
    ...TABULAR,
  },
  caption: {
    fontSize: 13,
    lineHeight: "20px",
    color: INK_SOFT,
  },

  space: { para: 14, block: 24, section: 32 },

  header: "sheet",
  footer: "postal",
  cta: {
    variant: "pill",
    bg: INDIGO,
    color: PAPER,
    border: undefined,
    radius: 999,
    padV: 12,
    padH: 26,
    font: { fontSize: 14, fontWeight: 600, letterSpacing: "0" },
  },
  link: { color: INK }, // one warm action: only the pill (and the dot) is indigo
  imagery: { radius: 8, border: `1px solid ${HAIRLINE}`, captionRule: false },
  signature: "letter",
  dark: "hold",
  darkPalette: {
    // The room, not the letter: the sheet holds paper in the dark.
    canvas: "#161618",
    surface: PAPER,
    text: INK,
    soft: INK_SOFT,
    faint: INK_FAINT,
    hairline: HAIRLINE,
    panel: PAPER_SOFT,
  },
  text: { rule: null, ruleSoft: null },
};

export const DIRECTIONS: Record<DirectionId, EmailDirection> = {
  hairline,
  broadsheet,
  letterhead,
};

export const DIRECTION_IDS = Object.keys(DIRECTIONS) as DirectionId[];
