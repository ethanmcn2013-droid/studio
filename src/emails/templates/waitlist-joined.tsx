import type { EmailDirection } from "../directions";
import type { WaitlistJoinedData } from "../fixtures";
import { EmailShell } from "../components/shell";
import { BodyText, EmailHeading, InlineLink, LeadText } from "../components/text";
import type { TextDoc } from "../plaintext";

/**
 * access.waitlist-joined · Lifecycle mode.
 * The reply the waitlist has never sent. Deliberately buttonless: the
 * message is "we heard you, we will write once", and it makes exactly
 * one promise it can keep. No position numbers, no scarcity, no drip.
 */
export function WaitlistJoinedEmail({
  direction,
  data,
}: {
  direction: EmailDirection;
  data: WaitlistJoinedData;
}) {
  return (
    <EmailShell
      direction={direction}
      preheader="You are on the list. One email when your access opens, and nothing before it."
      category="Access"
      dateISO={data.metaDateISO}
      footerNote={`You received this because ${data.email} joined the Signal Studio waitlist. If that was not you, reply and we will remove it.`}
    >
      <EmailHeading direction={direction}>You are on the list.</EmailHeading>
      <LeadText direction={direction}>
        Signal Studio opens in small batches, as each product and privacy
        gate is ready. When your place comes up, we will send one email and
        your account will be waiting in it.
      </LeadText>
      <BodyText direction={direction}>
        Until then, nothing. No countdowns, no nurture sequence, no news you
        did not ask for. If you want to see what we are building in the
        meantime, the record is public:{" "}
        <InlineLink direction={direction} href="https://signalstudio.ie/dispatch">
          signalstudio.ie/dispatch
        </InlineLink>
        .
      </BodyText>
    </EmailShell>
  );
}

export function waitlistJoinedText(data: WaitlistJoinedData): TextDoc {
  return {
    category: "Access",
    dateISO: data.metaDateISO,
    heading: "You are on the list.",
    blocks: [
      { kind: "p", text: "Signal Studio opens in small batches, as each product and privacy gate is ready. When your place comes up, we will send one email and your account will be waiting in it." },
      { kind: "p", text: "Until then, nothing. No countdowns, no nurture sequence, no news you did not ask for." },
      { kind: "link", label: "What we are building, on the record", href: "https://signalstudio.ie/dispatch" },
    ],
    footerNote: `You received this because ${data.email} joined the Signal Studio waitlist. If that was not you, reply and we will remove it.`,
  };
}
