import { Section } from "@react-email/components";
import type { EmailDirection } from "../directions";
import { HAIRLINE, INK, INK_SOFT } from "../directions";
import { Wordmark } from "./shell";

/**
 * BrandHeader · three treatments, one grammar each.
 *
 *   rule     (Hairline)   one quiet line: wordmark left, mono category and
 *                         ledger date right, a single hairline underneath.
 *   masthead (Broadsheet) the folio: wordmark left, SECTION · FULL DATE
 *                         right, over the heavy-and-hairline rule pair.
 *   sheet    (Letterhead) the wordmark alone; the letter dates itself in
 *                         words, sentence case, in the text face. No rule.
 */
export function BrandHeader({
  direction,
  category,
  metaLine,
}: {
  direction: EmailDirection;
  category?: string;
  metaLine?: string;
}) {
  const d = direction;
  const folio = [category, metaLine]
    .filter(Boolean)
    .join(" · ");

  if (d.header === "masthead") {
    return (
      <Section className="em-edge" style={{ padding: `28px ${d.edgePad}px 0` }}>
        <table
          width="100%"
          cellPadding={0}
          cellSpacing={0}
          role="presentation"
          style={{ borderCollapse: "collapse" }}
        >
          <tbody>
            <tr>
              <td style={{ paddingBottom: 10 }}>
                <Wordmark direction={d} size={15} />
              </td>
              <td
                align="right"
                className="em-faint"
                style={{ ...d.label, paddingBottom: 10 }}
              >
                {folio.toUpperCase()}
              </td>
            </tr>
          </tbody>
        </table>
        <div
          className="em-rule-ink"
          style={{ borderTop: `2px solid ${INK}` }}
        />
        <div
          className="em-hair"
          style={{ borderTop: `1px solid ${HAIRLINE}`, marginTop: 2 }}
        />
        <div style={{ height: d.space.section }} />
      </Section>
    );
  }

  if (d.header === "sheet") {
    return (
      <Section className="em-edge" style={{ padding: `36px ${d.edgePad}px 0` }}>
        <table
          width="100%"
          cellPadding={0}
          cellSpacing={0}
          role="presentation"
          style={{ borderCollapse: "collapse" }}
        >
          <tbody>
            <tr>
              <td>
                <Wordmark direction={d} size={13} />
              </td>
              <td
                align="right"
                className="em-soft"
                style={{
                  // Part of the letter, not furniture: text face, sentence case.
                  fontFamily: d.fontStack,
                  fontSize: 13,
                  lineHeight: "20px",
                  color: INK_SOFT,
                }}
              >
                {metaLine ?? ""}
              </td>
            </tr>
          </tbody>
        </table>
        <div style={{ height: d.space.section + 8 }} />
      </Section>
    );
  }

  // rule (Hairline)
  return (
    <Section className="em-edge" style={{ padding: `24px ${d.edgePad}px 0` }}>
      <table
        width="100%"
        cellPadding={0}
        cellSpacing={0}
        role="presentation"
        style={{ borderCollapse: "collapse" }}
      >
        <tbody>
          <tr>
            <td style={{ paddingBottom: 14 }}>
              <Wordmark direction={d} size={13} />
            </td>
            <td
              align="right"
              className="em-faint"
              style={{ ...d.label, paddingBottom: 14 }}
            >
              {folio}
            </td>
          </tr>
        </tbody>
      </table>
      <div className="em-hair" style={{ borderTop: `1px solid ${HAIRLINE}` }} />
      <div style={{ height: d.space.section }} />
    </Section>
  );
}
