import { Link, Section, Text } from "@react-email/components";
import type { EmailDirection } from "../directions";
import { HAIRLINE, INK, INK_FAINT, INK_SOFT } from "../directions";
import { Wordmark } from "./shell";

export type FooterLink = { label: string; href: string };

/**
 * EmailFooter · SupportFooter and LegalFooter folded into one component
 * so no template can ship without the reason-you-received-this line.
 *
 *   line     (Hairline)   hairline rule, the reason line, one mono address line.
 *   masthead (Broadsheet) the closing double rule mirroring the header,
 *                         wordmark + suite tagline, links, reason line.
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
        <div
          className="em-hair"
          style={{ borderTop: `1px solid ${HAIRLINE}`, borderBottom: `2px solid ${INK}`, height: 3 }}
        />
        <table width="100%" cellPadding={0} cellSpacing={0} style={{ borderCollapse: "collapse", marginTop: 14 }}>
          <tbody>
            <tr>
              <td>
                <Wordmark size={13} />
              </td>
              <td align="right" className="em-faint" style={{ ...d.label, letterSpacing: "0.08em" }}>
                Clarity, not configuration.
              </td>
            </tr>
          </tbody>
        </table>
        <div style={{ height: 14 }} />
        {linkRow}
        <Text className="em-faint" style={{ margin: 0, fontSize: 12, lineHeight: "19px", color: INK_FAINT }}>
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
        <Text className="em-faint" style={{ margin: 0, fontSize: 12, lineHeight: "19px", color: INK_FAINT }}>
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
      <Text className="em-faint" style={{ margin: "0 0 6px", fontSize: 12, lineHeight: "19px", color: INK_FAINT }}>
        {note}
      </Text>
      <Text
        className="em-faint"
        style={{ ...d.label, margin: 0, letterSpacing: "0.06em" }}
      >
        Signal Studio · Dublin ·{" "}
        <Link href="mailto:hello@signalstudio.ie" style={{ color: INK_FAINT, textDecoration: "underline" }}>
          hello@signalstudio.ie
        </Link>
      </Text>
    </Section>
  );
}
