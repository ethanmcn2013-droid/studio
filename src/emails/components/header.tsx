import { Section } from "@react-email/components";
import type { EmailDirection } from "../directions";
import { HAIRLINE, INK } from "../directions";
import { Wordmark } from "./shell";

/**
 * BrandHeader · three treatments, one grammar.
 *
 *   rule     (Hairline)   one quiet line: wordmark left, mono category right,
 *                         a single hairline underneath.
 *   masthead (Broadsheet) mono dateline over a 2px ink rule with a thin
 *                         companion rule, the front-page pair.
 *   sheet    (Letterhead) the wordmark alone at the top of the letter with
 *                         a right-aligned date, no rule, air instead.
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

  if (d.header === "masthead") {
    return (
      <Section className="em-edge" style={{ padding: `28px ${d.edgePad}px 0` }}>
        <table width="100%" cellPadding={0} cellSpacing={0} style={{ borderCollapse: "collapse" }}>
          <tbody>
            <tr>
              <td style={{ paddingBottom: 10 }}>
                <Wordmark size={15} />
              </td>
              <td align="right" className="em-faint" style={{ ...d.label, paddingBottom: 10 }}>
                {[category, metaLine].filter(Boolean).join(" · ")}
              </td>
            </tr>
          </tbody>
        </table>
        <div
          className="em-hair"
          style={{ borderTop: `2px solid ${INK}`, borderBottom: `1px solid ${HAIRLINE}`, height: 3 }}
        />
        <div style={{ height: d.space.section }} />
      </Section>
    );
  }

  if (d.header === "sheet") {
    return (
      <Section className="em-edge" style={{ padding: `36px ${d.edgePad}px 0` }}>
        <table width="100%" cellPadding={0} cellSpacing={0} style={{ borderCollapse: "collapse" }}>
          <tbody>
            <tr>
              <td>
                <Wordmark size={13} />
              </td>
              <td align="right" className="em-faint" style={d.label}>
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
      <table width="100%" cellPadding={0} cellSpacing={0} style={{ borderCollapse: "collapse" }}>
        <tbody>
          <tr>
            <td style={{ paddingBottom: 14 }}>
              <Wordmark size={13} />
            </td>
            <td align="right" className="em-faint" style={{ ...d.label, paddingBottom: 14 }}>
              {[category, metaLine].filter(Boolean).join(" · ")}
            </td>
          </tr>
        </tbody>
      </table>
      <div className="em-hair" style={{ borderTop: `1px solid ${HAIRLINE}` }} />
      <div style={{ height: d.space.section }} />
    </Section>
  );
}
