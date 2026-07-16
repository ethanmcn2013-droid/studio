import type { EmailDirection } from "../directions";
import type { VenueCodesReadyData } from "../fixtures";
import { EmailShell } from "../components/shell";
import { BodyText, EmailHeading, LeadText, SmallText } from "../components/text";
import { PrimaryAction } from "../components/action";
import { KeyValueRows, PrivacyBoundary } from "../components/panels";
import type { TextDoc } from "../plaintext";

/**
 * venue.codes-ready · Operational mode, venue-facing.
 * The venue wedge's working email: the code sheet that starts real
 * couples. Every venue-facing message restates the privacy boundary.
 */
export function VenueCodesReadyEmail({
  direction,
  data,
}: {
  direction: EmailDirection;
  data: VenueCodesReadyData;
}) {
  return (
    <EmailShell
      direction={direction}
      preheader={`${data.codeCount} couple codes for ${data.venueName}, ready to hand out.`}
      category="Venue Edition"
      dateISO={data.metaDateISO}
      footerNote={`You received this because ${data.venueName} holds a Signal Studio Venue Edition. Questions, reply and Ethan answers.`}
    >
      <EmailHeading direction={direction}>
        Your couple codes are ready.
      </EmailHeading>
      <LeadText direction={direction}>
        {data.contactFirstName}, the next batch for {data.venueName} is
        ready to hand out. One code per couple, whenever it suits your
        conversations.
      </LeadText>
      <KeyValueRows
        direction={direction}
        rows={[
          { key: "Venue", value: data.venueName },
          { key: "Codes", value: `${data.codeCount}, one per couple` },
          { key: "Each gives", value: "18 months of the full wedding workspace" },
          { key: "After that", value: "the couple keeps everything, free to read" },
        ]}
      />
      <BodyText direction={direction}>
        Hand a code to a couple and they are planning the same day: no
        set-up for your team, nothing to administer, nothing to support.
      </BodyText>
      <PrivacyBoundary direction={direction}>
        The couple’s planning stays theirs. {data.venueName} never sees
        their notes or their lists, and codes never expose who has done
        what.
      </PrivacyBoundary>
      <PrimaryAction
        direction={direction}
        href={data.codesUrl}
        label="Open the code sheet"
      />
      <SmallText direction={direction}>
        The sheet shows which codes are still unused, and nothing else.
      </SmallText>
    </EmailShell>
  );
}

export function venueCodesReadyText(data: VenueCodesReadyData): TextDoc {
  return {
    category: "Venue Edition",
    dateISO: data.metaDateISO,
    heading: "Your couple codes are ready.",
    blocks: [
      { kind: "p", text: `${data.contactFirstName}, the next batch for ${data.venueName} is ready to hand out. One code per couple, whenever it suits your conversations.` },
      { kind: "facts", rows: [
        ["Venue", data.venueName],
        ["Codes", `${data.codeCount}, one per couple`],
        ["Each gives", "18 months of the full wedding workspace"],
        ["After that", "the couple keeps everything, free to read"],
      ] },
      { kind: "p", text: "Hand a code to a couple and they are planning the same day: no set-up for your team, nothing to administer, nothing to support." },
      { kind: "quiet", text: `The couple’s planning stays theirs. ${data.venueName} never sees their notes or their lists, and codes never expose who has done what.` },
      { kind: "action", label: "Open the code sheet", href: data.codesUrl },
      { kind: "quiet", text: "The sheet shows which codes are still unused, and nothing else." },
    ],
    footerNote: `You received this because ${data.venueName} holds a Signal Studio Venue Edition. Questions, reply and Ethan answers.`,
  };
}
