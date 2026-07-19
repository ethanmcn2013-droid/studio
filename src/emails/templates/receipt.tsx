import { Section, Text } from "@react-email/components";
import type { EmailDirection } from "../directions";
import { HAIRLINE, INK, INK_SOFT, TABULAR } from "../directions";
import type { ReceiptData } from "../fixtures";
import { EmailShell } from "../components/shell";
import { EmailHeading, LeadText, SmallText } from "../components/text";
import { SecondaryAction } from "../components/action";
import { KeyValueRows } from "../components/panels";
import type { TextDoc } from "../plaintext";

/**
 * billing.receipt · Utility mode.
 * The email people keep. Line items with tabular totals, the exact
 * facts, and a copy that can be filed. No button: a receipt is a
 * record, not a call to action.
 */
export function ReceiptEmail({
  direction,
  data,
}: {
  direction: EmailDirection;
  data: ReceiptData;
}) {
  const d = direction;
  return (
    <EmailShell
      direction={d}
      preheader={`${data.total} paid to Signal Studio. Receipt ${data.receiptNo}.`}
      category="Receipt"
      dateISO={data.metaDateISO}
      footerNote="You received this because a payment was made on your Signal Studio account. Keep it for your records."
    >
      {/* The amount is the headline (competitor-review steal 1, Stripe). */}
      <EmailHeading direction={d}>{data.total}, paid.</EmailHeading>
      <LeadText direction={d}>
        Thank you. The payment went through on {data.paidOn} and this email
        is your record of it.
      </LeadText>

      {/* The system's one table beyond key-value rows: line items. */}
      <Section style={{ margin: `${d.space.block}px 0` }}>
        <table
          width="100%"
          cellPadding={0}
          cellSpacing={0}
          role="presentation"
          style={{ borderCollapse: "collapse" }}
        >
          <tbody>
            {data.lines.map((line) => (
              <tr key={line.item}>
                <td
                  className="em-soft"
                  style={{
                    fontSize: d.body.fontSize,
                    lineHeight: "22px",
                    color: INK_SOFT,
                    padding: "9px 16px 9px 0",
                    borderBottom: `1px solid ${HAIRLINE}`,
                  }}
                >
                  {line.item}
                </td>
                <td
                  align="right"
                  className="em-soft"
                  style={{
                    fontSize: d.body.fontSize,
                    lineHeight: "22px",
                    color: INK_SOFT,
                    padding: "9px 0",
                    borderBottom: `1px solid ${HAIRLINE}`,
                    whiteSpace: "nowrap" as const,
                    ...TABULAR,
                  }}
                >
                  {line.amount}
                </td>
              </tr>
            ))}
            <tr>
              <td
                className="em-ink"
                style={{
                  fontSize: d.body.fontSize,
                  lineHeight: "22px",
                  fontWeight: 600,
                  color: INK,
                  padding: "10px 16px 0 0",
                }}
              >
                Total paid
              </td>
              <td
                align="right"
                className="em-ink"
                style={{
                  fontSize: d.body.fontSize,
                  lineHeight: "22px",
                  fontWeight: 600,
                  color: INK,
                  padding: "10px 0 0",
                  whiteSpace: "nowrap" as const,
                  ...TABULAR,
                }}
              >
                {data.total}
              </td>
            </tr>
          </tbody>
        </table>
      </Section>

      <KeyValueRows
        direction={d}
        rows={[
          { key: "Receipt", value: data.receiptNo },
          { key: "Paid on", value: data.paidOn },
          { key: "Card", value: data.card },
          { key: "Billed to", value: data.billedTo },
        ]}
      />
      {/* Every receipt has a hosted, print-clean twin (steal 2, Stripe). */}
      <SecondaryAction
        direction={d}
        href={data.receiptUrl}
        label="View this receipt · print or save as PDF"
      />
      <SmallText direction={d}>
        Need a different name or address on it, reply and we will reissue
        it.
      </SmallText>
    </EmailShell>
  );
}

export function receiptText(data: ReceiptData): TextDoc {
  return {
    category: "Receipt",
    dateISO: data.metaDateISO,
    heading: `${data.total}, paid.`,
    blocks: [
      { kind: "p", text: `Thank you. The payment went through on ${data.paidOn} and this email is your record of it.` },
      { kind: "facts", rows: [
        ...data.lines.map((l): [string, string] => [l.item, l.amount]),
        ["Total paid", data.total],
        ["Receipt", data.receiptNo],
        ["Card", data.card],
        ["Billed to", data.billedTo],
      ] },
      { kind: "link", label: "View this receipt, print or save as PDF", href: data.receiptUrl },
      { kind: "quiet", text: "Need a different name or address on it, reply and we will reissue it." },
    ],
    footerNote: "You received this because a payment was made on your Signal Studio account. Keep it for your records.",
  };
}
