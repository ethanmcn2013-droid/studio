import type { EmailDirection } from "../directions";
import type { ExportReadyData } from "../fixtures";
import { EmailShell } from "../components/shell";
import { BodyText, EmailHeading, LeadText } from "../components/text";
import { PrimaryAction } from "../components/action";
import { KeyValueRows } from "../components/panels";
import type { TextDoc } from "../plaintext";

/**
 * data.export-ready · Utility mode.
 * The promise that leaving is easy, kept. Exact expiry, exact contents,
 * one action, no commentary on why the export was requested.
 */
export function ExportReadyEmail({
  direction,
  data,
}: {
  direction: EmailDirection;
  data: ExportReadyData;
}) {
  return (
    <EmailShell
      direction={direction}
      preheader={`Your export is ready to download until ${data.expiresOn}.`}
      category="Your data"
      dateISO={data.metaDateISO}
      footerNote="You received this because a data export was requested for your Signal Studio account."
    >
      <EmailHeading direction={direction}>Your export is ready.</EmailHeading>
      <LeadText direction={direction}>
        Everything you asked for, packaged and ready. The download link
        works until {data.expiresOn}, then the file is deleted from our
        side.
      </LeadText>
      <KeyValueRows
        direction={direction}
        rows={[
          { key: "Contains", value: data.contains },
          { key: "Format", value: data.format },
          { key: "Size", value: data.size },
          { key: "Link expires", value: data.expiresOn, strong: true },
        ]}
      />
      <PrimaryAction
        direction={direction}
        href={data.downloadUrl}
        label="Download your export"
      />
      <BodyText direction={direction} last>
        If the link expires before you get to it, request a fresh export
        from your account any time. Nothing about your account changes
        either way.
      </BodyText>
    </EmailShell>
  );
}

export function exportReadyText(data: ExportReadyData): TextDoc {
  return {
    category: "Your data",
    dateISO: data.metaDateISO,
    heading: "Your export is ready.",
    blocks: [
      { kind: "p", text: `Everything you asked for, packaged and ready. The download link works until ${data.expiresOn}, then the file is deleted from our side.` },
      { kind: "facts", rows: [
        ["Contains", data.contains],
        ["Format", data.format],
        ["Size", data.size],
        ["Link expires", data.expiresOn],
      ] },
      { kind: "action", label: "Download your export", href: data.downloadUrl },
      { kind: "quiet", text: "If the link expires before you get to it, request a fresh export from your account any time. Nothing about your account changes either way." },
    ],
    footerNote: "You received this because a data export was requested for your Signal Studio account.",
  };
}
