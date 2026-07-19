import type { EmailDirection } from "../directions";
import type { NewSignInData } from "../fixtures";
import { EmailShell } from "../components/shell";
import { EmailHeading, LeadText } from "../components/text";
import { SecondaryAction } from "../components/action";
import { KeyValueRows, SecurityNotice } from "../components/panels";
import type { TextDoc } from "../plaintext";

/**
 * security.new-sign-in · Utility mode.
 * Device, place, time, stated exactly, and a calm fork: if it was you,
 * do nothing. No red, no sirens; precision is the security signal.
 */
export function NewSignInEmail({
  direction,
  data,
}: {
  direction: EmailDirection;
  data: NewSignInData;
}) {
  return (
    <EmailShell
      direction={direction}
      preheader={`${data.device}, near ${data.location}, ${data.time}. If this was you, do nothing.`}
      category="Security"
      dateISO={data.metaDateISO}
      footerNote="You received this because your Signal Studio account was opened from a device we had not seen before."
    >
      <EmailHeading direction={direction}>
        A new sign-in to your account
      </EmailHeading>
      <LeadText direction={direction}>
        If this was you, there is nothing to do and nothing has changed.
      </LeadText>
      <KeyValueRows
        direction={direction}
        rows={[
          { key: "Device", value: data.device },
          { key: "Near", value: `${data.location} (approximate, from the connection)` },
          { key: "When", value: data.time, strong: true },
        ]}
      />
      <SecondaryAction
        direction={direction}
        href="https://signalstudio.ie/account/sessions"
        label="Review your signed-in devices"
      />
      <SecurityNotice direction={direction}>
        Not you? Change your password now and the unfamiliar device is
        signed out everywhere in under a minute.
      </SecurityNotice>
    </EmailShell>
  );
}

export function newSignInText(data: NewSignInData): TextDoc {
  return {
    category: "Security",
    dateISO: data.metaDateISO,
    heading: "A new sign-in to your account",
    blocks: [
      { kind: "p", text: "If this was you, there is nothing to do and nothing has changed." },
      { kind: "facts", rows: [
        ["Device", data.device],
        ["Near", `${data.location} (approximate, from the connection)`],
        ["When", data.time],
      ] },
      { kind: "link", label: "Review your signed-in devices", href: "https://signalstudio.ie/account/sessions" },
      { kind: "quiet", text: "Not you? Change your password now and the unfamiliar device is signed out everywhere in under a minute." },
    ],
    footerNote: "You received this because your Signal Studio account was opened from a device we had not seen before.",
  };
}
