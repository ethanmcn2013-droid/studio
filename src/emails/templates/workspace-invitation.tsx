import type { EmailDirection } from "../directions";
import type { WorkspaceInvitationData } from "../fixtures";
import { EmailShell } from "../components/shell";
import { EmailHeading, LeadText, SmallText } from "../components/text";
import { PrimaryAction } from "../components/action";
import { KeyValueRows } from "../components/panels";
import type { TextDoc } from "../plaintext";

/**
 * workspace.invitation · Guided mode.
 * The collaboration loop's hinge: someone the recipient knows asked
 * them in. The inviter's name is the subject and the argument; the
 * facts say exactly what accepting means before they click.
 */
export function WorkspaceInvitationEmail({
  direction,
  data,
}: {
  direction: EmailDirection;
  data: WorkspaceInvitationData;
}) {
  return (
    <EmailShell
      direction={direction}
      preheader={`${data.inviterName} invited you into ${data.workspaceName}. ${data.roleLine}`}
      category="Invitation"
      dateISO={data.metaDateISO}
      footerNote={`You received this because ${data.inviterName} entered this address in Signal Studio. Ignore it and nothing happens; the invitation simply expires.`}
    >
      <EmailHeading direction={direction}>
        {data.inviterName} invited you in.
      </EmailHeading>
      <LeadText direction={direction}>
        There is a workspace called {data.workspaceName} in Signal Studio,
        and {data.inviterFirstName} wants you in it.
      </LeadText>
      <KeyValueRows
        direction={direction}
        rows={[
          { key: "Workspace", value: data.workspaceName },
          { key: "Invited by", value: `${data.inviterName} · ${data.inviterEmail}` },
          { key: "You can", value: data.roleLine },
          { key: "Expires", value: data.expiresOn, strong: true },
        ]}
      />
      <PrimaryAction
        direction={direction}
        href={data.acceptUrl}
        label="Open the workspace"
      />
      <SmallText direction={direction}>
        No account yet, the link makes one from this address in about a
        minute. Free, no card.
      </SmallText>
    </EmailShell>
  );
}

export function workspaceInvitationText(data: WorkspaceInvitationData): TextDoc {
  return {
    category: "Invitation",
    dateISO: data.metaDateISO,
    heading: `${data.inviterName} invited you in.`,
    blocks: [
      { kind: "p", text: `There is a workspace called ${data.workspaceName} in Signal Studio, and ${data.inviterFirstName} wants you in it.` },
      { kind: "facts", rows: [
        ["Workspace", data.workspaceName],
        ["Invited by", `${data.inviterName} · ${data.inviterEmail}`],
        ["You can", data.roleLine],
        ["Expires", data.expiresOn],
      ] },
      { kind: "action", label: "Open the workspace", href: data.acceptUrl },
      { kind: "quiet", text: "No account yet, the link makes one from this address in about a minute. Free, no card." },
    ],
    footerNote: `You received this because ${data.inviterName} entered this address in Signal Studio. Ignore it and nothing happens; the invitation simply expires.`,
  };
}
