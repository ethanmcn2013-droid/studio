import type { EmailDirection } from "../directions";
import type { PaymentFailedData } from "../fixtures";
import { EmailShell } from "../components/shell";
import { BodyText, EmailHeading, LeadText } from "../components/text";
import { PrimaryAction } from "../components/action";
import { KeyValueRows, SecurityNotice } from "../components/panels";

/**
 * billing.payment-failed · Utility mode.
 * Exact amounts, exact dates, exact consequences. No urgency theatre:
 * the facts are urgent enough, and the work is never held hostage.
 */
export function PaymentFailedEmail({
  direction,
  data,
}: {
  direction: EmailDirection;
  data: PaymentFailedData;
}) {
  return (
    <EmailShell
      direction={direction}
      preheader={`We could not charge ${data.card}. Nothing has changed yet.`}
      category="Billing"
      dateISO={data.metaDateISO}
      footerNote="You received this because billing for your Signal Studio account needs attention."
    >
      <EmailHeading direction={direction}>
        A payment did not go through.
      </EmailHeading>
      <LeadText direction={direction}>
        We tried to charge {data.amount} for {data.plan} and the bank declined
        it. Your workspaces and your work are untouched.
      </LeadText>
      <KeyValueRows
        direction={direction}
        rows={[
          { key: "Plan", value: data.plan },
          { key: "Amount", value: data.amount },
          { key: "Card", value: data.card },
          { key: "Attempted", value: data.attemptedOn },
          {
            key: data.finalAttempt ? "Plan changes" : "Next attempt",
            value: data.nextAttemptOn,
            strong: true,
          },
        ]}
      />
      {data.finalAttempt ? (
        <BodyText direction={direction}>
          That was the final attempt. On {data.nextAttemptOn} your plan moves
          to Free. You keep every workspace and everything stays readable.
          Paid features pause until a payment goes through, and picking the
          plan back up later starts exactly where you left off.
        </BodyText>
      ) : (
        <BodyText direction={direction}>
          We will try the card once more on {data.nextAttemptOn}. If that
          attempt also fails, your plan moves to Free: you keep every
          workspace, everything stays readable, and paid features pause until
          a payment goes through.
        </BodyText>
      )}
      <PrimaryAction
        direction={direction}
        href="https://signalstudio.ie/account/billing"
        label="Update your card"
      />
      <SecurityNotice direction={direction}>
        Signal Studio never asks for card details by email. Update your card
        inside your account only.
      </SecurityNotice>
    </EmailShell>
  );
}

import type { TextDoc } from "../plaintext";

export function paymentFailedText(data: PaymentFailedData): TextDoc {
  return {
    category: "Billing",
    dateISO: data.metaDateISO,
    heading: "A payment did not go through.",
    blocks: [
      { kind: "p", text: `We tried to charge ${data.amount} for ${data.plan} and the bank declined it. Your workspaces and your work are untouched.` },
      { kind: "facts", rows: [
        ["Plan", data.plan],
        ["Amount", data.amount],
        ["Card", data.card],
        ["Attempted", data.attemptedOn],
        [data.finalAttempt ? "Plan changes" : "Next attempt", data.nextAttemptOn],
      ] },
      { kind: "p", text: data.finalAttempt
        ? `That was the final attempt. On ${data.nextAttemptOn} your plan moves to Free. You keep every workspace and everything stays readable. Paid features pause until a payment goes through, and picking the plan back up later starts exactly where you left off.`
        : `We will try the card once more on ${data.nextAttemptOn}. If that attempt also fails, your plan moves to Free: you keep every workspace, everything stays readable, and paid features pause until a payment goes through.` },
      { kind: "action", label: "Update your card", href: "https://signalstudio.ie/account/billing" },
      { kind: "quiet", text: "Signal Studio never asks for card details by email. Update your card inside your account only." },
    ],
    footerNote: "You received this because billing for your Signal Studio account needs attention.",
  };
}
