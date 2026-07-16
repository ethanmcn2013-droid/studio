import type { EmailDirection } from "../directions";
import type { WelcomeData } from "../fixtures";
import { EmailShell } from "../components/shell";
import { BodyText, EmailHeading, LeadText, SmallText } from "../components/text";
import { PrimaryAction } from "../components/action";
import { ProductFrame } from "../components/imagery";
import type { TextDoc } from "../plaintext";

/**
 * welcome.first-workspace · Guided mode.
 * Day zero: the account exists, the first workspace is made, and there
 * is exactly one next step. Not a tour, not a checklist, not a sequence.
 */
export function WelcomeFirstWorkspaceEmail({
  direction,
  data,
}: {
  direction: EmailDirection;
  data: WelcomeData;
}) {
  const name = data.firstName ? `${data.firstName}, your` : "Your";
  return (
    <EmailShell
      direction={direction}
      preheader={`${data.workspaceName} is ready. Put the first real thing in it.`}
      category="Welcome"
      dateISO={data.metaDateISO}
      footerNote="You received this once, because you created a Signal Studio account. There is no welcome sequence."
    >
      <EmailHeading direction={direction}>
        {data.workspaceName} is ready.
      </EmailHeading>
      <LeadText direction={direction}>
        {name} workspace exists and it is empty, which is the correct state
        for the next ten minutes.
      </LeadText>
      <BodyText direction={direction}>
        Put one real thing in it: the next task on your mind, the date that
        is fixed, the thought that is not ready for anyone else. The suite
        works from whatever you give it. Tasks holds the work, Timeline
        shows the plan, Notes stays yours, and Signal starts reading your
        week once there is a week to read.
      </BodyText>
      <ProductFrame
        direction={direction}
        src="/email-assets/product-still.png"
        alt="A Signal Studio workspace: a task list beside the week's timeline, one item marked as needing attention."
        width={536}
        height={240}
        caption="One workspace, seen from the morning."
      />
      <PrimaryAction
        direction={direction}
        href={data.workspaceUrl}
        label="Open your workspace"
      />
      <SmallText direction={direction}>
        Stuck on anything, reply to this email and a person answers.
      </SmallText>
    </EmailShell>
  );
}

export function welcomeFirstWorkspaceText(data: WelcomeData): TextDoc {
  const name = data.firstName ? `${data.firstName}, your` : "Your";
  return {
    category: "Welcome",
    dateISO: data.metaDateISO,
    heading: `${data.workspaceName} is ready.`,
    blocks: [
      { kind: "p", text: `${name} workspace exists and it is empty, which is the correct state for the next ten minutes.` },
      { kind: "p", text: "Put one real thing in it: the next task on your mind, the date that is fixed, the thought that is not ready for anyone else. The suite works from whatever you give it. Tasks holds the work, Timeline shows the plan, Notes stays yours, and Signal starts reading your week once there is a week to read." },
      { kind: "action", label: "Open your workspace", href: data.workspaceUrl },
      { kind: "quiet", text: "Stuck on anything, reply to this email and a person answers." },
    ],
    footerNote: "You received this once, because you created a Signal Studio account. There is no welcome sequence.",
  };
}
