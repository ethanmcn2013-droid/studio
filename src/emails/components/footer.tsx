import { Link, Section, Text } from "@react-email/components";
import type { EmailDirection } from "../directions";
import { HAIRLINE, INK, INK_FAINT, INK_SOFT } from "../directions";
import { Wordmark } from "./shell";

export type FooterLink = { label: string; href: string };

/**
 * EmailFooter · SupportFooter and LegalFooter folded into one component
 * so no template can ship without the reason-you-received-this line.
 *
 *   line     (Hairline)   hairline rule, the reason line, one mono address
 *                         line whose email address keeps its true case.
 *   masthead (Broadsheet) the closing rule pair mirroring the folio,
 *                         wordmark + the suite tagline, links, reason line.
 *   postal   (Letterhead) almost nothing inside the sheet; the postal line
 *                         lives outside on the canvas (rendered by EmailShell).
 */
export function EmailFooter({
  direction,
  note,
  links,
}: {
  direction: EmailDirection;
  note: string;
  links?: FooterLink[];
}) {
  const d = direction;

  const linkRow =
    links && links.length > 0 ? (
      <Text style={{ margin: "0 0 8px", fontSize: 12, lineHeight: "20px" }}>
        {links.map((l, i) => (
          <span key={l.href}>
            {i > 0 ? <span style={{ color: INK_FAINT }}>{"  ·  "}</span> : null}
            <Link
              href={l.href}
              className="em-soft"
              style={{ color: INK_SOFT, textDecoration: "underline" }}
            >
              {l.label}
            </Link>
          </span>
        ))}
      </Text>
    ) : null;

  if (d.footer === "masthead") {
    return (
      <Section className="em-edge" style={{ padding: `0 ${d.edgePad}px 28px` }}>
        <div style={{ height: d.space.section }} />
        <div className="em-hair" style={{ borderTop: `1px solid ${HAIRLINE}` }} />
        <div
          className="em-rule-ink"
          style={{ borderTop: `2px solid ${INK}`, marginTop: 2 }}
        />
        <table
          width="100%"
          cellPadding={0}
          cellSpacing={0}
          role="presentation"
          style={{ borderCollapse: "collapse", marginTop: 14 }}
        >
          <tbody>
            <tr>
              <td>
                <Wordmark direction={d} size={13} />
              </td>
              <td
                align="right"
                className="em-faint"
                style={{ ...d.label, letterSpacing: "0.14em" }}
              >
                Clarity, not configuration.
              </td>
            </tr>
          </tbody>
        </table>
        <div style={{ height: 14 }} />
        {linkRow}
        <Text
          className="em-faint"
          style={{ margin: 0, fontSize: 12, lineHeight: "19px", color: INK_FAINT }}
        >
          {note}
        </Text>
      </Section>
    );
  }

  if (d.footer === "postal") {
    return (
      <Section className="em-edge" style={{ padding: `0 ${d.edgePad}px 36px` }}>
        <div style={{ height: d.space.section }} />
        {linkRow}
        <Text
          className="em-faint"
          style={{ margin: 0, fontSize: 12, lineHeight: "19px", color: INK_FAINT }}
        >
          {note}
        </Text>
      </Section>
    );
  }

  // line (Hairline)
  return (
    <Section className="em-edge" style={{ padding: `0 ${d.edgePad}px 24px` }}>
      <div style={{ height: d.space.section }} />
      <div className="em-hair" style={{ borderTop: `1px solid ${HAIRLINE}`, marginBottom: 14 }} />
      {linkRow}
      <Text
        className="em-faint"
        style={{ margin: "0 0 6px", fontSize: 12, lineHeight: "19px", color: INK_FAINT }}
      >
        {note}
      </Text>
      {/* One tracked-caps register (CL-03); the address keeps its case (CL-22). */}
      <Text className="em-faint" style={{ ...d.label, margin: 0 }}>
        Signal Studio · Dublin ·{" "}
        <Link
          href="mailto:hello@signalstudio.ie"
          style={{
            color: INK_FAINT,
            textDecoration: "underline",
            textTransform: "none" as const,
            letterSpacing: "0.02em",
          }}
        >
          hello@signalstudio.ie
        </Link>
      </Text>
    </Section>
  );
}
