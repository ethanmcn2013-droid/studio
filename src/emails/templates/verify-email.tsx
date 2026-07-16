import type { EmailDirection } from "../directions";
import type { VerifyEmailData } from "../fixtures";
import { EmailShell } from "../components/shell";
import { EmailHeading, LeadText } from "../components/text";
import { PrimaryAction } from "../components/action";
import { SecurityNotice } from "../components/panels";
import type { TextDoc } from "../plaintext";

/**
 * auth.verify-email · Utility mode.
 * The first email most people ever receive from Signal Studio. One job:
 * prove the address. Nothing else is allowed to happen here.
 */
export function VerifyEmailEmail({
  direction,
  data,
}: {
  direction: EmailDirection;
  data: VerifyEmailData;
}) {
  return (
    <EmailShell
      direction={direction}
      preheader={`Confirm ${data.email} and your account is ready.`}
      category="Security"
      dateISO={data.metaDateISO}
      footerNote="You received this because this address was used to create a Signal Studio account."
    >
      <EmailHeading direction={direction}>Confirm this address</EmailHeading>
      <LeadText direction={direction}>
        One click and {data.email} belongs to your Signal Studio account.
        The link works for {data.expiresHours} hours and once.
      </LeadText>
      <PrimaryAction
        direction={direction}
        href={data.verifyUrl}
        label="Confirm email address"
      />
      <SecurityNotice direction={direction}>
        If you did not create this account, ignore this email and nothing
        happens. No account exists until the address is confirmed.
      </SecurityNotice>
    </EmailShell>
  );
}

export function verifyEmailText(data: VerifyEmailData): TextDoc {
  return {
    category: "Security",
    dateISO: data.metaDateISO,
    heading: "Confirm this address",
    blocks: [
      { kind: "p", text: `One click and ${data.email} belongs to your Signal Studio account. The link works for ${data.expiresHours} hours and once.` },
      { kind: "action", label: "Confirm email address", href: data.verifyUrl },
      { kind: "quiet", text: "If you did not create this account, ignore this email and nothing happens. No account exists until the address is confirmed." },
    ],
    footerNote: "You received this because this address was used to create a Signal Studio account.",
  };
}
