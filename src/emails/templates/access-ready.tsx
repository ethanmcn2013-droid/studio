import type { EmailDirection } from "../directions";
import type { AccessReadyData } from "../fixtures";
import { EmailShell } from "../components/shell";
import { BodyText, EmailHeading, LeadText, SmallText } from "../components/text";
import { PrimaryAction } from "../components/action";
import { ProductFrame } from "../components/imagery";

/**
 * access.ready · Guided product mode.
 * The waitlist promise being kept: access opened, here is the first step.
 * One image, one action, no feature dump.
 */
export function AccessReadyEmail({
  direction,
  data,
}: {
  direction: EmailDirection;
  data: AccessReadyData;
}) {
  const greeting = data.firstName ? `${data.firstName}, your` : "Your";
  return (
    <EmailShell
      direction={direction}
      preheader="Your place on the waitlist came up. Set up your first workspace."
      category="Access"
      metaLine={data.metaDate}
      footerNote={`You received this because you joined the Signal Studio waitlist on ${data.joinedOn}.`}
    >
      <EmailHeading direction={direction}>
        Signal Studio is open for you.
      </EmailHeading>
      <LeadText direction={direction}>
        {greeting} place on the waitlist came up today. Your account is ready,
        starting with one workspace on the Free plan. No card needed.
      </LeadText>
      <BodyText direction={direction}>
        Four products share that workspace. Tasks holds the live work.
        Timeline is the plan other people can read. Notes keeps your thinking
        private until you decide otherwise. Signal reads your week and tells
        you the few things that need attention.
      </BodyText>
      <ProductFrame
        direction={direction}
        src="/email-assets/product-still.png"
        alt="A Signal Studio workspace: a task list on the left, the week's timeline on the right, one item marked as needing attention."
        width={536}
        height={335}
        caption="One workspace, seen from the morning."
      />
      <PrimaryAction
        direction={direction}
        href={data.workspaceProduct}
        label="Open your workspace"
      />
      <SmallText direction={direction}>
        Start with the thing you are planning right now. The rest of the suite
        is there when you reach for it.
      </SmallText>
    </EmailShell>
  );
}
