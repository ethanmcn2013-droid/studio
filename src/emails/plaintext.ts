import type { EmailDirection } from "./directions";

/**
 * The plain-text twin as a designed artifact (CL-14).
 *
 * Templates describe their message once as a TextDoc; the composer sets
 * it in the direction's plain-text grammar: Hairline types a bank
 * statement (hyphen rules, aligned facts), Broadsheet files the wire
 * edition (heavy rule, numbered stories), Letterhead types a letter
 * (no rules at all, a salutation, a signature, an enclosure line).
 * Measure is 72 characters. Links sit on their own lines.
 */

export const MEASURE = 72;

export type TextBlock =
  | { kind: "p"; text: string; story?: number }
  | { kind: "facts"; rows: [string, string][] }
  | { kind: "code"; code: string }
  | { kind: "action"; label: string; href: string }
  | { kind: "link"; label: string; href: string }
  | { kind: "quiet"; text: string };

export type TextDoc = {
  category?: string;
  /** Folio prefix, joined before the date (e.g. "No 1"). */
  folio?: string;
  dateISO?: string;
  /** Format dateISO in the month-only register (folios). */
  monthOnly?: boolean;
  heading?: string;
  salutation?: string;
  blocks: TextBlock[];
  signature?: { closing: string; name: string; role: string; email?: string };
  enclosure?: string;
  footerNote: string;
  footerLinks?: { label: string; href: string }[];
};

export function wrap(text: string, width = MEASURE): string {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = "";
  for (const w of words) {
    if (line && line.length + 1 + w.length > width) {
      lines.push(line);
      line = w;
    } else {
      line = line ? `${line} ${w}` : w;
    }
  }
  if (line) lines.push(line);
  return lines.join("\n");
}

function factsBlock(rows: [string, string][]): string {
  const width = Math.max(...rows.map(([k]) => k.length)) + 2;
  return rows
    .map(([k, v]) => `${(k.toUpperCase() + ":").padEnd(width + 1)} ${v}`)
    .join("\n");
}

export function composeText(d: EmailDirection, doc: TextDoc): string {
  const out: string[] = [];
  const rule = d.text.rule ? d.text.rule.repeat(MEASURE) : null;
  const ruleSoft = d.text.ruleSoft ? d.text.ruleSoft.repeat(MEASURE) : null;

  // ── Header ──
  const dateStr = doc.dateISO
    ? doc.monthOnly
      ? d.formatMonth(doc.dateISO)
      : d.formatDate(doc.dateISO)
    : "";
  const date = [doc.folio, dateStr].filter(Boolean).join(" · ");
  if (d.id === "letterhead") {
    // The letter dates itself; the header is the letterhead itself.
    out.push("Signal Studio");
    if (date) out.push(date);
    out.push("");
  } else {
    const headParts = ["Signal Studio", doc.category, date].filter(Boolean);
    out.push(
      d.id === "broadsheet"
        ? headParts.join(" · ").toUpperCase()
        : headParts.join(" · "),
    );
    if (rule) out.push(rule);
    out.push("");
  }

  if (doc.salutation) {
    out.push(doc.salutation);
    out.push("");
  }

  if (doc.heading) {
    out.push(wrap(doc.heading));
    out.push("");
  }

  // ── Blocks ──
  for (const b of doc.blocks) {
    switch (b.kind) {
      case "p": {
        if (b.story !== undefined && d.id === "broadsheet") {
          if (ruleSoft) {
            out.push(ruleSoft);
            out.push("");
          }
          const prefix = `${String(b.story).padStart(2, "0")} · `;
          const hung = wrap(b.text, MEASURE - prefix.length)
            .split("\n")
            .map((l, i) => (i === 0 ? prefix + l : " ".repeat(prefix.length) + l))
            .join("\n");
          out.push(hung);
        } else {
          out.push(wrap(b.text));
        }
        out.push("");
        break;
      }
      case "facts": {
        out.push(factsBlock(b.rows));
        out.push("");
        break;
      }
      case "code": {
        // The code stands alone, indented to be unmissable.
        out.push(`    ${b.code}`);
        out.push("");
        break;
      }
      case "action": {
        out.push(`${b.label}:`);
        out.push(b.href);
        out.push("");
        break;
      }
      case "link": {
        out.push(`${b.label}:`);
        out.push(b.href);
        out.push("");
        break;
      }
      case "quiet": {
        out.push(wrap(b.text));
        out.push("");
        break;
      }
    }
  }

  // ── Signature ──
  if (doc.signature) {
    const s = doc.signature;
    if (d.id === "letterhead") {
      out.push(s.closing);
      out.push("");
      out.push(s.name);
      out.push(s.role);
      if (s.email) out.push(s.email);
    } else if (d.id === "broadsheet") {
      out.push(`${s.name.toUpperCase()} · ${s.role.toUpperCase()}`);
    } else {
      out.push(`${s.name}, Signal Studio`);
    }
    out.push("");
  }

  if (doc.enclosure && d.id === "letterhead") {
    out.push(doc.enclosure);
    out.push("");
  }

  // ── Footer ──
  if (rule) out.push(rule);
  else if (ruleSoft) out.push(ruleSoft);
  out.push(wrap(doc.footerNote));
  if (doc.footerLinks && doc.footerLinks.length > 0) {
    out.push("");
    for (const l of doc.footerLinks) {
      out.push(`${l.label}:`);
      out.push(l.href);
    }
  }
  out.push("");
  out.push(
    d.id === "letterhead"
      ? "Signal Studio · Limerick, Ireland"
      : "Signal Studio · Limerick · hello@signalstudio.ie",
  );

  // Collapse any accidental double blanks, end with one newline.
  return out
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trimEnd()
    .concat("\n");
}
