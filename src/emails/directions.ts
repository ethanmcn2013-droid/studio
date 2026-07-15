import type { CSSProperties } from "react";

/**
 * The three email-system directions under founder review.
 *
 * One shared component set (src/emails/components) renders every template;
 * a direction is pure presentation data plus a small number of structural
 * variants the components branch on. Content, fixtures and message metadata
 * never live here, so choosing a direction later deletes nothing but tokens.
 *
 *   hairline   · minimal operational trust  · quiet, infrastructure-like
 *   broadsheet · editorial product precision · typographic, masthead-led
 *   letterhead · human founder-led warmth    · a letter on a sheet of paper
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

// Geist first for the clients that load it from the OS or ignore it
// gracefully; the fallbacks are the real contract.
export const FONT_SANS =
  "Geist, -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Helvetica, Arial, sans-serif";
export const FONT_MONO =
  "'Geist Mono', ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace";

export type DirectionId = "hairline" | "broadsheet" | "letterhead";

export type EmailDirection = {
  id: DirectionId;
  name: string;
  /** One-sentence thesis shown in the Email Lab. */
  thesis: string;
  /** The strategic pole this direction explores. */
  pole: string;

  // ── Canvas ───────────────────────────────────────────────────────────
  /** Page colour behind the message. */
  canvasBg: string;
  /** The message surface itself. */
  surfaceBg: string;
  maxWidth: number;
  /** Outer container treatment. */
  frame: {
    border: string | undefined;
    radius: number;
    /** Vertical breathing room above and below the surface. */
    canvasPad: number;
  };
  /** Horizontal edge padding inside the surface. */
  edgePad: number;

  // ── Type scale ───────────────────────────────────────────────────────
  h1: CSSProperties;
  lead: CSSProperties;
  body: CSSProperties;
  small: CSSProperties;
  /** Mono metadata register (eyebrows, key-value labels, date lines). */
  label: CSSProperties;

  // ── Rhythm ───────────────────────────────────────────────────────────
  space: { para: number; block: number; section: number };

  // ── Structural variants the components branch on ────────────────────
  header: "rule" | "masthead" | "sheet";
  footer: "line" | "masthead" | "postal";
  cta: {
    variant: "compact" | "ink" | "pill";
    bg: string;
    color: string;
    radius: number;
    pad: string;
    font: CSSProperties;
  };
  /** Product imagery and film-poster framing. */
  imagery: {
    radius: number;
    border: string | undefined;
    /** Mono caption under the frame, or plain-text caption. */
    caption: "mono" | "plain";
  };
  signature: "plain" | "byline" | "letter";
  /**
   * Dark behaviour under prefers-color-scheme: dark.
   *   adapt · the whole message re-colours to a dark surface
   *   hold  · the surface stays paper, only the canvas dims (the letter
   *           metaphor survives the inbox theme)
   */
  dark: "adapt" | "hold";
};

const hairline: EmailDirection = {
  id: "hairline",
  name: "Hairline",
  thesis:
    "The email equivalent of a well-set bank letter: one rule, one column, one action, nothing that performs.",
  pole: "Minimal operational trust",

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
    fontFamily: FONT_MONO,
    fontSize: 11,
    lineHeight: "16px",
    letterSpacing: "0.08em",
    textTransform: "uppercase" as const,
    color: INK_FAINT,
  },

  space: { para: 12, block: 20, section: 28 },

  header: "rule",
  footer: "line",
  cta: {
    variant: "compact",
    bg: INDIGO,
    color: PAPER,
    radius: 6,
    pad: "10px 18px",
    font: { fontSize: 14, fontWeight: 600, letterSpacing: "0" },
  },
  imagery: { radius: 6, border: `1px solid ${HAIRLINE}`, caption: "plain" },
  signature: "plain",
  dark: "adapt",
};

const broadsheet: EmailDirection = {
  id: "broadsheet",
  name: "Broadsheet",
  thesis:
    "A front page, not a flyer: masthead rules, numbered sections and product stills treated like photographs with captions.",
  pole: "Editorial product precision",

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
    fontFamily: FONT_MONO,
    fontSize: 11,
    lineHeight: "16px",
    letterSpacing: "0.14em",
    textTransform: "uppercase" as const,
    color: INK_FAINT,
  },

  space: { para: 14, block: 26, section: 40 },

  header: "masthead",
  footer: "masthead",
  cta: {
    variant: "ink",
    bg: INK,
    color: PAPER,
    radius: 2,
    pad: "12px 24px",
    font: { fontSize: 14, fontWeight: 600, letterSpacing: "0.01em" },
  },
  imagery: { radius: 2, border: `1px solid ${HAIRLINE}`, caption: "mono" },
  signature: "byline",
  dark: "adapt",
};

const letterhead: EmailDirection = {
  id: "letterhead",
  name: "Letterhead",
  thesis:
    "A letter on Signal Studio paper: a real salutation, short paragraphs, a signature you can reply to, and one quiet action.",
  pole: "Human founder-led warmth",

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
  label: {
    fontFamily: FONT_MONO,
    fontSize: 11,
    lineHeight: "16px",
    letterSpacing: "0.08em",
    textTransform: "uppercase" as const,
    color: INK_FAINT,
  },

  space: { para: 14, block: 22, section: 32 },

  header: "sheet",
  footer: "postal",
  cta: {
    variant: "pill",
    bg: INDIGO,
    color: PAPER,
    radius: 999,
    pad: "12px 24px",
    font: { fontSize: 14, fontWeight: 600, letterSpacing: "0" },
  },
  imagery: { radius: 8, border: `1px solid ${HAIRLINE}`, caption: "plain" },
  signature: "letter",
  dark: "hold",
};

export const DIRECTIONS: Record<DirectionId, EmailDirection> = {
  hairline,
  broadsheet,
  letterhead,
};

export const DIRECTION_IDS = Object.keys(DIRECTIONS) as DirectionId[];
