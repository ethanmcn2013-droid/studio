import type { EmailDirection } from "../directions";
import type { StudentVerifiedData } from "../fixtures";
import { EmailShell } from "../components/shell";
import { BodyText, EmailHeading, LeadText } from "../components/text";
import { PrimaryAction } from "../components/action";
import { KeyValueRows } from "../components/panels";

/**
 * student.verification-approved · Guided product mode.
 * The one commercial fact is stated plainly: €9.99 a year, everything
 * included. The copy never describes how verification works, because
 * the method is an open founder decision.
 */
export function StudentVerifiedEmail({
  direction,
  data,
}: {
  direction: EmailDirection;
  data: StudentVerifiedData;
}) {
  return (
    <EmailShell
      direction={direction}
      preheader={`€9.99 a year, everything included, valid until ${data.validUntil}.`}
      category="Student Edition"
      dateISO={data.metaDateISO}
      footerNote="You received this because a student verification finished for this address."
    >
      <EmailHeading direction={direction}>
        Your student rate is active.
      </EmailHeading>
      <LeadText direction={direction}>
        {data.firstName}, your student email checked out. Signal Studio now
        costs you €9.99 a year, everything included.
      </LeadText>
      <KeyValueRows
        direction={direction}
        rows={[
          { key: "Plan", value: "Student · €9.99 a year" },
          { key: "Verified with", value: data.studentEmail },
          { key: "Covers", value: "Signal Tasks, Signal Timeline, Signal Notes and Signal" },
          { key: "Valid until", value: data.validUntil, strong: true },
        ]}
      />
      <BodyText direction={direction}>
        Around {data.validUntil} we will ask you to confirm you are still
        studying. One check a year, nothing in between.
      </BodyText>
      <PrimaryAction
        direction={direction}
        href="https://tasks.signalstudio.ie"
        label="Open your workspace"
      />
    </EmailShell>
  );
}

import type { TextDoc } from "../plaintext";

export function studentVerifiedText(data: StudentVerifiedData): TextDoc {
  return {
    category: "Student Edition",
    dateISO: data.metaDateISO,
    heading: "Your student rate is active.",
    blocks: [
      { kind: "p", text: `${data.firstName}, your student email checked out. Signal Studio now costs you \u20ac9.99 a year, everything included.` },
      { kind: "facts", rows: [
        ["Plan", "Student \u00b7 \u20ac9.99 a year"],
        ["Verified with", data.studentEmail],
        ["Covers", "Signal Tasks, Signal Timeline, Signal Notes and Signal"],
        ["Valid until", data.validUntil],
      ] },
      { kind: "p", text: `Around ${data.validUntil} we will ask you to confirm you are still studying. One check a year, nothing in between.` },
      { kind: "action", label: "Open your workspace", href: "https://tasks.signalstudio.ie" },
    ],
    footerNote: "You received this because a student verification finished for this address.",
  };
}
