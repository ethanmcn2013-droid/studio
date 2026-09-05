import type { EmailDirection } from "../directions";
import type { VenueOutreachData } from "../fixtures";
import type { TextDoc } from "../plaintext";
import { EmailShell } from "../components/shell";
import { BodyText } from "../components/text";
import { VideoPoster } from "../components/imagery";
import { PrivacyBoundary } from "../components/panels";
import { FounderSignature } from "../components/signature";

// Held January specimen. The exact plain-text send draft and two-touch cadence
// live in docs/strategy/VENUE_OUTREACH_SEQUENCE.md; rendering does not send.
const introduction = "I'm Ethan, the founder of Signal Studio.";
const offer = (venueName: string) => `With Venue Edition, ${venueName} can give booked couples one place for their private notes, tasks and wedding timeline, with your venue's name on their workspace.`;
const handoff = "Your venue pays annually. We prepare the access codes and support the couples; your team passes on the invitation. The couple does not pay for the sponsored access.";
const terms = "Venue Edition is €1,500 a year, prepaid and VAT-inclusive. A qualifying Founding 25 agreement is €1,000 a year on the same basis, held on continuous renewal without lapse.";
const privacy = "Your venue receives no private notes or task lists from the couple's workspace.";
const nextStep = (venueName: string) => `Would a twenty-minute conversation be useful for ${venueName}?`;
const footer = "One personal note and, if I hear nothing, one follow-up ten days later. If you would rather not hear from Signal Studio again, reply and I'll stop.";

export function VenueOutreachEmail({
  direction,
  data,
}: {
  direction: EmailDirection;
  data: VenueOutreachData;
}) {
  return (
    <EmailShell
      direction={direction}
      preheader={`For ${data.venueName}: a place for your couples to plan.`}
      dateISO={data.metaDateISO}
      postalContact={false}
      footerNote={footer}
    >
      <BodyText direction={direction}>Hello {data.contactFirstName},</BodyText>
      <BodyText direction={direction}>{introduction}</BodyText>
      <BodyText direction={direction}>{offer(data.venueName)}</BodyText>
      <BodyText direction={direction}>{handoff}</BodyText>
      <BodyText direction={direction}>{terms}</BodyText>
      <PrivacyBoundary direction={direction}>{privacy}</PrivacyBoundary>
      <BodyText direction={direction}>Here is the short film.</BodyText>
      <VideoPoster
        direction={direction}
        src="/email-assets/poster-venues.png"
        alt="A Signal Tasks window showing a task to send the final guest count to catering."
        href="https://signalstudio.ie/films/venues"
        width={536}
        height={302}
        caption="The Signal Studio venue film"
        linkLabel="Watch the film"
        duration="60 seconds"
        enclosureId="Film-Ven"
      />
      <BodyText direction={direction}>{nextStep(data.venueName)}</BodyText>
      <FounderSignature direction={direction} closing="Thanks for your time," />
    </EmailShell>
  );
}

export function venueOutreachText(data: VenueOutreachData): TextDoc {
  return {
    dateISO: data.metaDateISO,
    salutation: `Hello ${data.contactFirstName},`,
    blocks: [
      { kind: "p", text: introduction },
      { kind: "p", text: offer(data.venueName) },
      { kind: "p", text: handoff },
      { kind: "p", text: terms },
      { kind: "quiet", text: privacy },
      { kind: "p", text: "Here is the short film." },
      { kind: "link", label: "Watch the film (60 seconds)", href: "https://signalstudio.ie/films/venues" },
      { kind: "p", text: nextStep(data.venueName) },
    ],
    signature: { closing: "Thanks for your time,", name: "Ethan", role: "Founder, Signal Studio", email: "hello@signalstudio.ie" },
    enclosure: "Encl · Film-Ven · 60 seconds",
    footerNote: footer,
  };
}
