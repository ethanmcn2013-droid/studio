import type { EmailDirection } from "../directions";
import type { SchoolOutreachData } from "../fixtures";
import { EmailShell } from "../components/shell";
import { BodyText } from "../components/text";
import { VideoPoster } from "../components/imagery";
import { PrivacyBoundary } from "../components/panels";
import { FounderSignature } from "../components/signature";

/**
 * outreach.school-first · Founder mode. PROTOTYPE ONLY.
 * The Active segment-sequencing decision (2026-05) forbids school
 * outbound and pilots today. This template exists so the founder can
 * judge the direction, not so anyone can send it. See the assumptions
 * list in the registry and docs/email-system/decisions-required.md.
 */
export function SchoolOutreachEmail({
  direction,
  data,
}: {
  direction: EmailDirection;
  data: SchoolOutreachData;
}) {
  return (
    <EmailShell
      direction={direction}
      preheader={`Planning the school year at ${data.schoolName}, without a pupil database.`}
      metaLine={data.metaDate}
      footerNote={`Ethan wrote this to ${data.schoolName} directly. No list, no sequence. Reply and it lands with him. If you would rather not hear from Signal Studio again, say so and that is the end of it.`}
    >
      <BodyText direction={direction}>Hello {data.contactName},</BodyText>
      <BodyText direction={direction}>
        Teachers plan several classes across one school year, and most
        planning tools want a database of pupils before they help with any of
        it. That trade never sits right, and in a school it should not have
        to.
      </BodyText>
      <BodyText direction={direction}>
        Signal Studio works the other way around. A teacher plans subjects,
        classes and the shape of the year in a private workspace. What gets
        shared is chosen, one thing at a time. Everything else stays the
        teacher’s own.
      </BodyText>
      <PrivacyBoundary direction={direction}>
        No pupil database. Signal Studio holds nothing about the children in
        a class: no names, no accounts, no grades. It is useful to the person
        teaching, not curious about the people taught.
      </PrivacyBoundary>
      <VideoPoster
        direction={direction}
        src="/email-assets/poster-schools.png"
        alt="A Signal Timeline showing a school year, with the spring term plan marked by a thin indigo line and published to a class page. Plan the classes, not the pupils. A 60 second film."
        href="https://signalstudio.ie/films/schools"
        width={536}
        height={302}
        caption="Plan the classes, not the pupils · the Signal Studio school film"
        linkLabel="Watch the film"
        duration="60 seconds"
      />
      <BodyText direction={direction}>
        If a quiet trial with two or three of your teachers would be worth
        twenty minutes of your time, reply and I will set it up around your
        calendar, not mine.
      </BodyText>
      <FounderSignature direction={direction} closing="Thanks for your time," />
    </EmailShell>
  );
}
