import type { EmailDirection } from "../directions";
import type { DeletionScheduledData } from "../fixtures";
import { EmailShell } from "../components/shell";
import { BodyText, EmailHeading, LeadText } from "../components/text";
import { PrimaryAction, SecondaryAction } from "../components/action";
import { DestructiveActionPanel } from "../components/panels";

/**
 * account.deletion-scheduled · Utility mode, destructive class.
 * Clarity and dignity: what goes, what stays, the exact date, the way
 * back, the way to keep a copy. No guilt, no "sad to see you go".
 */
export function DeletionScheduledEmail({
  direction,
  data,
}: {
  direction: EmailDirection;
  data: DeletionScheduledData;
}) {
  const workspaceCount =
    data.workspaces.length === 1
      ? "your workspace"
      : `all ${data.workspaces.length} of your workspaces`;
  return (
    <EmailShell
      direction={direction}
      preheader={`Deletion is scheduled for ${data.scheduledFor}. You can cancel until then.`}
      category="Account"
      metaLine={data.metaDate}
      footerNote="You received this because deletion was requested for the Signal Studio account under this address. If that was not you, cancel the deletion and change your password now."
    >
      <EmailHeading direction={direction}>
        Your account is scheduled for deletion.
      </EmailHeading>
      <LeadText direction={direction}>
        {data.firstName ? `${data.firstName}, you` : "You"} asked us to delete
        your Signal Studio account on {data.requestedOn}. Nothing is deleted
        yet. You can cancel any time before {data.scheduledFor} and everything
        stays exactly as it is.
      </LeadText>
      <DestructiveActionPanel
        direction={direction}
        date={data.scheduledFor}
        willBeDeleted={`your account and ${workspaceCount} (${data.workspaces.join(
          " · ",
        )}), including every note, task, timeline and briefing`}
        unaffected="billing records we must keep under Irish law, and any export you download before the date"
      />
      <BodyText direction={direction}>
        After {data.scheduledFor} the deletion is permanent. We cannot restore
        your work afterwards, and remaining copies age out of our backups
        within 90 days.
      </BodyText>
      <PrimaryAction
        direction={direction}
        href="https://signalstudio.ie/account/deletion"
        label="Cancel the deletion"
      />
      <SecondaryAction
        direction={direction}
        href="https://signalstudio.ie/account/export"
        label="Export a copy of your work first"
      />
    </EmailShell>
  );
}
