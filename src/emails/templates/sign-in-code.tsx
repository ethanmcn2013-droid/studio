import type { EmailDirection } from "../directions";
import type { SignInCodeData } from "../fixtures";
import { EmailShell } from "../components/shell";
import { EmailHeading, LeadText } from "../components/text";
import { CodePanel, KeyValueRows, SecurityNotice } from "../components/panels";

/**
 * auth.sign-in-code · Utility mode.
 * One job: put the code in front of the person who asked for it.
 * No button: the code is the action. No promotion, ever.
 */
export function SignInCodeEmail({
  direction,
  data,
}: {
  direction: EmailDirection;
  data: SignInCodeData;
}) {
  return (
    <EmailShell
      direction={direction}
      preheader={`Your code is ${data.code}. It expires in 10 minutes.`}
      category="Security"
      dateISO={data.metaDateISO}
      footerNote="You received this because someone asked to sign in to Signal Studio with this address."
    >
      <EmailHeading direction={direction}>Your sign-in code</EmailHeading>
      <LeadText direction={direction}>
        Enter this code to finish signing in. It expires in 10 minutes and
        works once.
      </LeadText>
      <CodePanel direction={direction} code={data.code} />
      <KeyValueRows
        direction={direction}
        rows={[
          { key: "For", value: data.email },
          { key: "Requested", value: data.requestedAt },
        ]}
      />
      <SecurityNotice direction={direction}>
        If you did not ask for this code, ignore this email. No one can sign
        in without it, and nothing about your account has changed.
      </SecurityNotice>
    </EmailShell>
  );
}

import type { TextDoc } from "../plaintext";

/** The plain-text twin's content, adjacent to the JSX so copy cannot drift far. */
export function signInCodeText(data: SignInCodeData): TextDoc {
  return {
    category: "Security",
    dateISO: data.metaDateISO,
    heading: "Your sign-in code",
    blocks: [
      { kind: "p", text: "Enter this code to finish signing in. It expires in 10 minutes and works once." },
      { kind: "code", code: data.code },
      { kind: "facts", rows: [["For", data.email], ["Requested", data.requestedAt]] },
      { kind: "quiet", text: "If you did not ask for this code, ignore this email. No one can sign in without it, and nothing about your account has changed." },
    ],
    footerNote: "You received this because someone asked to sign in to Signal Studio with this address.",
  };
}
