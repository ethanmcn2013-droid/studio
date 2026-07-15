import { Section, Text } from "@react-email/components";
import type { EmailDirection } from "../directions";
import {
  FONT_MONO,
  HAIRLINE,
  INK,
  INK_FAINT,
  INK_SOFT,
  PAPER_SOFT,
  RED_DEEP,
} from "../directions";

/**
 * CodePanel · a one-time code set large enough to read across the room.
 * Plain text on a quiet panel: it survives image blocking, copies cleanly,
 * and screen readers announce it as text. Never an image, never split
 * into styled boxes per digit.
 */
export function CodePanel({
  direction,
  code,
}: {
  direction: EmailDirection;
  code: string;
}) {
  const d = direction;
  return (
    <Section
      className="em-panel"
      style={{
        margin: `${d.space.block}px 0`,
        padding: "20px 24px",
        backgroundColor: PAPER_SOFT,
        border: `1px solid ${HAIRLINE}`,
        borderRadius: Math.min(d.imagery.radius, 8),
        textAlign: "center" as const,
      }}
    >
      <Text
        className="em-ink"
        style={{
          fontFamily: FONT_MONO,
          fontSize: 30,
          lineHeight: "38px",
          fontWeight: 600,
          letterSpacing: "0.24em",
          color: INK,
          margin: 0,
        }}
      >
        {code}
      </Text>
    </Section>
  );
}

/**
 * KeyValueRows · exact facts in two columns. Utility mail leads with this:
 * dates, amounts and consequences stated once, precisely, outside prose.
 */
export function KeyValueRows({
  direction,
  rows,
}: {
  direction: EmailDirection;
  rows: { key: string; value: string; strong?: boolean }[];
}) {
  const d = direction;
  return (
    <Section style={{ margin: `${d.space.block}px 0` }}>
      <table width="100%" cellPadding={0} cellSpacing={0} style={{ borderCollapse: "collapse" }}>
        <tbody>
          {rows.map((r, i) => (
            <tr key={r.key}>
              <td
                className="em-faint"
                style={{
                  ...d.label,
                  padding: "9px 16px 9px 0",
                  borderTop: i === 0 ? undefined : `1px solid ${HAIRLINE}`,
                  verticalAlign: "top",
                  whiteSpace: "nowrap" as const,
                  width: 1,
                }}
              >
                {r.key}
              </td>
              <td
                className={r.strong ? "em-ink" : "em-soft"}
                style={{
                  fontSize: d.body.fontSize,
                  lineHeight: "22px",
                  color: r.strong ? INK : INK_SOFT,
                  fontWeight: r.strong ? 600 : 400,
                  padding: "8px 0",
                  borderTop: i === 0 ? undefined : `1px solid ${HAIRLINE}`,
                }}
              >
                {r.value}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Section>
  );
}

/**
 * SecurityNotice · the calm what-if-this-wasn't-you line. Quiet by design:
 * decorative urgency in security mail reads as phishing.
 */
export function SecurityNotice({
  direction,
  children,
}: {
  direction: EmailDirection;
  children: React.ReactNode;
}) {
  const d = direction;
  return (
    <Section
      style={{
        margin: `${d.space.block}px 0 0`,
        paddingTop: d.space.para,
        borderTop: `1px solid ${HAIRLINE}`,
      }}
      className="em-hair"
    >
      <Text className="em-faint" style={{ ...d.small, margin: 0 }}>
        {children}
      </Text>
    </Section>
  );
}

/**
 * PrivacyBoundary · states what stays private, as product behaviour.
 * Used wherever a message touches venue-sponsored or shared work.
 */
export function PrivacyBoundary({
  direction,
  children,
}: {
  direction: EmailDirection;
  children: React.ReactNode;
}) {
  const d = direction;
  return (
    <Section
      style={{
        margin: `${d.space.block}px 0`,
        paddingLeft: 14,
        borderLeft: `2px solid ${INK}`,
      }}
      className="em-hair"
    >
      <Text className="em-soft" style={{ ...d.small, color: INK_SOFT, margin: 0 }}>
        {children}
      </Text>
    </Section>
  );
}

/**
 * DestructiveActionPanel · deletion and its consequences, with the exact
 * date carried in ink, not colour. Red is reserved for the single line
 * naming what is permanently removed.
 */
export function DestructiveActionPanel({
  direction,
  date,
  willBeDeleted,
  unaffected,
}: {
  direction: EmailDirection;
  date: string;
  willBeDeleted: string;
  unaffected: string;
}) {
  const d = direction;
  return (
    <Section
      className="em-panel"
      style={{
        margin: `${d.space.block}px 0`,
        padding: "18px 22px",
        backgroundColor: PAPER_SOFT,
        border: `1px solid ${HAIRLINE}`,
        borderRadius: Math.min(d.imagery.radius, 8),
      }}
    >
      <Text className="em-faint" style={{ ...d.label, margin: "0 0 6px" }}>
        Scheduled for
      </Text>
      <Text
        className="em-ink"
        style={{ fontSize: 19, lineHeight: "26px", fontWeight: 600, color: INK, margin: "0 0 14px" }}
      >
        {date}
      </Text>
      <Text className="em-danger" style={{ ...d.small, color: RED_DEEP, margin: "0 0 8px" }}>
        Deleted permanently: {willBeDeleted}
      </Text>
      <Text className="em-soft" style={{ ...d.small, color: INK_SOFT, margin: 0 }}>
        Not affected: {unaffected}
      </Text>
    </Section>
  );
}
