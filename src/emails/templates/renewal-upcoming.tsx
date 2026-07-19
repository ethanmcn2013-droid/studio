import type { EmailDirection } from "../directions";
import type { RenewalUpcomingData } from "../fixtures";
import { EmailShell } from "../components/shell";
import { BodyText, EmailHeading, LeadText } from "../components/text";
import { SecondaryAction } from "../components/action";
import { KeyValueRows } from "../components/panels";
import type { TextDoc } from "../plaintext";

/**
 * billing.renewal-upcoming · Utility mode.
 * The trust move: say it before charging it. Deliberately buttonless;
 * telling someone you are about to take their money and handing them a
 * calm way out is the entire message.
 */
export function RenewalUpcomingEmail({
  direction,
  data,
}: {
  direction: EmailDirection;
  data: RenewalUpcomingData;
}) {
  return (
    <EmailShell
      direction={direction}
      preheader={`${data.amount} to ${data.card} on ${data.renewsOn}. No action needed.`}
      category="Billing"
      dateISO={data.metaDateISO}
      footerNote="You received this because your Signal Studio plan renews soon. We always say so before charging."
    >
      <EmailHeading direction={direction}>
        Your renewal is coming up.
      </EmailHeading>
      <LeadText direction={direction}>
        No action needed. This is the advance notice we always send before
        taking a payment.
      </LeadText>
      <KeyValueRows
        direction={direction}
        rows={[
          { key: "Plan", value: data.plan },
          { key: "Amount", value: data.amount },
          { key: "Card", value: data.card },
          { key: "Renews on", value: data.renewsOn, strong: true },
        ]}
      />
      <BodyText direction={direction}>
        If you would rather not renew, cancel any time before{" "}
        {data.renewsOn}. You keep full access until that date, and your
        plan moves to Free afterwards with everything still readable.
      </BodyText>
      <SecondaryAction
        direction={direction}
        href="https://signalstudio.ie/account/billing"
        label="Manage your plan"
      />
    </EmailShell>
  );
}

export function renewalUpcomingText(data: RenewalUpcomingData): TextDoc {
  return {
    category: "Billing",
    dateISO: data.metaDateISO,
    heading: "Your renewal is coming up.",
    blocks: [
      { kind: "p", text: "No action needed. This is the advance notice we always send before taking a payment." },
      { kind: "facts", rows: [
        ["Plan", data.plan],
        ["Amount", data.amount],
        ["Card", data.card],
        ["Renews on", data.renewsOn],
      ] },
      { kind: "p", text: `If you would rather not renew, cancel any time before ${data.renewsOn}. You keep full access until that date, and your plan moves to Free afterwards with everything still readable.` },
      { kind: "link", label: "Manage your plan", href: "https://signalstudio.ie/account/billing" },
    ],
    footerNote: "You received this because your Signal Studio plan renews soon. We always say so before charging.",
  };
}
