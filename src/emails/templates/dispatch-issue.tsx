import type { EmailDirection } from "../directions";
import type { DispatchIssueData } from "../fixtures";
import { EmailShell } from "../components/shell";
import {
  BodyText,
  EmailHeading,
  InlineLink,
  LeadText,
  MonoLabel,
  StoryNumber,
} from "../components/text";
import { PrimaryAction } from "../components/action";
import { ProductFrame } from "../components/imagery";
import { FounderSignature } from "../components/signature";

/**
 * editorial.dispatch-issue · Editorial mode.
 * One principal story (the front page, unnumbered), then a numbered
 * register where the numbers carry information (Broadsheet only; the
 * other directions refuse numbers). Every item is a shipped public
 * surface and destinations are links (CL-23). An email edition of the
 * Dispatch is itself a proposal under review.
 */
export function DispatchIssueEmail({
  direction,
  data,
}: {
  direction: EmailDirection;
  data: DispatchIssueData;
}) {
  const d = direction;
  const folio = `No ${data.issueNo} · ${d.formatMonth(data.monthISO)}`;
  return (
    <EmailShell
      direction={d}
      preheader="Signal Studio is open in small batches. One issue, one story."
      category="The Dispatch"
      metaLine={folio}
      footerNote="You are reading the Dispatch because you asked for it. It arrives when there is something worth saying, never on a schedule."
      footerLinks={[
        { label: "Stop these emails", href: "https://signalstudio.ie/dispatch/unsubscribe" },
        { label: "View in browser", href: "https://signalstudio.ie/dispatch" },
      ]}
    >
      <EmailHeading direction={d}>{data.headline}</EmailHeading>
      <LeadText direction={d}>
        Signal Studio opens in small batches, as each product and privacy
        gate is ready. The waitlist is how you hold a place, and it takes one
        email address.
      </LeadText>
      <BodyText direction={d}>
        Four products, one workspace: Tasks for the live work, Timeline for
        the plan other people can read, Notes for the thinking that is not
        ready for the room, and Signal, a briefing instead of a dashboard.
        Built for the 80% who do not work in tech.
      </BodyText>
      <ProductFrame
        direction={d}
        src="/email-assets/product-still.png"
        alt="A Signal Studio workspace: a task list beside the week's timeline, one item marked as needing attention."
        width={536}
        height={240}
        caption="One workspace, seen from the morning."
      />
      <PrimaryAction
        direction={d}
        href="https://signalstudio.ie/waitlist"
        label="Join the waitlist"
      />
      <MonoLabel direction={d}>Also this month</MonoLabel>
      <StoryNumber direction={d} n={2} />
      <BodyText direction={d}>
        The Brief. Signal’s homepage now opens like a front page: the noise
        of a working week set in newsprint, and the briefing pulled out of
        it. Read it at{" "}
        <InlineLink direction={d} href="https://signal.signalstudio.ie">
          signal.signalstudio.ie
        </InlineLink>
        .
      </BodyText>
      <StoryNumber direction={d} n={3} />
      <BodyText direction={d}>
        Meet Dot. The design page introduces the dot that carries the brand,
        drawn frame by frame, awake through a working day. See it at{" "}
        <InlineLink direction={d} href="https://signalstudio.ie/design">
          signalstudio.ie/design
        </InlineLink>
        .
      </BodyText>
      <FounderSignature direction={d} />
    </EmailShell>
  );
}

import type { TextDoc } from "../plaintext";

export function dispatchIssueText(data: DispatchIssueData): TextDoc {
  return {
    category: "The Dispatch",
    folio: `No ${data.issueNo}`,
    dateISO: data.monthISO,
    monthOnly: true,
    heading: data.headline,
    blocks: [
      { kind: "p", text: "Signal Studio opens in small batches, as each product and privacy gate is ready. The waitlist is how you hold a place, and it takes one email address." },
      { kind: "p", text: "Four products, one workspace: Tasks for the live work, Timeline for the plan other people can read, Notes for the thinking that is not ready for the room, and Signal, a briefing instead of a dashboard. Built for the 80% who do not work in tech." },
      { kind: "action", label: "Join the waitlist", href: "https://signalstudio.ie/waitlist" },
      { kind: "p", story: 2, text: "The Brief. Signal\u2019s homepage now opens like a front page: the noise of a working week set in newsprint, and the briefing pulled out of it. Read it at signal.signalstudio.ie." },
      { kind: "p", story: 3, text: "Meet Dot. The design page introduces the dot that carries the brand, drawn frame by frame, awake through a working day. See it at signalstudio.ie/design." },
    ],
    signature: { closing: "Thanks,", name: "Ethan", role: "Founder, Signal Studio" },
    footerNote: "You are reading the Dispatch because you asked for it. It arrives when there is something worth saying, never on a schedule.",
    footerLinks: [
      { label: "Stop these emails", href: "https://signalstudio.ie/dispatch/unsubscribe" },
      { label: "View in browser", href: "https://signalstudio.ie/dispatch" },
    ],
  };
}
