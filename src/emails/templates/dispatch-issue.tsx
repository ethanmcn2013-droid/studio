import type { EmailDirection } from "../directions";
import type { DispatchIssueData } from "../fixtures";
import { EmailShell } from "../components/shell";
import { BodyText, EmailHeading, LeadText, MonoLabel } from "../components/text";
import { PrimaryAction } from "../components/action";
import { ProductFrame } from "../components/imagery";
import { FounderSignature } from "../components/signature";

/**
 * editorial.dispatch-issue · Editorial mode.
 * One principal story, a short "also" list, and out. Every item below
 * is a shipped public surface; the Dispatch never announces intentions.
 * An email edition of the Dispatch is itself a proposal under review.
 */
export function DispatchIssueEmail({
  direction,
  data,
}: {
  direction: EmailDirection;
  data: DispatchIssueData;
}) {
  return (
    <EmailShell
      direction={direction}
      preheader="Signal Studio is open in small batches. One issue, one story."
      category="The Dispatch"
      metaLine={data.issueLabel}
      footerNote="You are reading the Dispatch because you asked for it. It arrives when there is something worth saying, never on a schedule."
      footerLinks={[
        { label: "Stop these emails", href: "https://signalstudio.ie/dispatch/unsubscribe" },
        { label: "View in browser", href: "https://signalstudio.ie/dispatch" },
      ]}
    >
      <EmailHeading direction={direction}>{data.headline}</EmailHeading>
      <LeadText direction={direction}>
        Signal Studio opens in small batches, as each product and privacy
        gate is ready. The waitlist is how you hold a place, and it takes one
        email address.
      </LeadText>
      <BodyText direction={direction}>
        Four products, one workspace: Tasks for the live work, Timeline for
        the plan other people can read, Notes for the thinking that is not
        ready for the room, and Signal, a briefing instead of a dashboard.
        Built for the 80% who do not work in tech.
      </BodyText>
      <ProductFrame
        direction={direction}
        src="/email-assets/product-still.png"
        alt="A Signal Studio workspace: a task list beside the week's timeline, one item marked as needing attention."
        width={536}
        height={335}
        caption="One workspace, seen from the morning."
      />
      <PrimaryAction
        direction={direction}
        href="https://signalstudio.ie/waitlist"
        label="Join the waitlist"
      />
      <MonoLabel direction={direction}>Also this month</MonoLabel>
      <BodyText direction={direction}>
        The Brief. Signal’s homepage now opens like a front page: the noise
        of a working week set in newsprint, and the briefing pulled out of
        it. At signal.signalstudio.ie.
      </BodyText>
      <BodyText direction={direction}>
        Meet Dot. The design page introduces the dot that carries the brand,
        drawn frame by frame, awake through a working day. At
        signalstudio.ie/design.
      </BodyText>
      <FounderSignature direction={direction} />
    </EmailShell>
  );
}
