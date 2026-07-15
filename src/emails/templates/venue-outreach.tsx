import type { EmailDirection } from "../directions";
import type { VenueOutreachData } from "../fixtures";
import { EmailShell } from "../components/shell";
import { BodyText } from "../components/text";
import { VideoPoster } from "../components/imagery";
import { PrivacyBoundary } from "../components/panels";
import { FounderSignature } from "../components/signature";

/**
 * outreach.venue-first · Founder mode.
 * A letter, not a campaign: personal opening, the film as an enclosure,
 * one ask, a real signature. No navigation, no feature grid, no button.
 * The email is property-specific even though the film is shared.
 */
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
      preheader={`For ${data.venueName}: the months of planning before the day.`}
      metaLine={data.metaDate}
      footerNote={`Ethan wrote this to ${data.venueName} directly. No list, no sequence. Reply and it lands with him. If you would rather not hear from Signal Studio again, say so and that is the end of it.`}
    >
      <BodyText direction={direction}>Hello {data.contactFirstName},</BodyText>
      <BodyText direction={direction}>
        Couples choose {data.venueName} for how considered the day itself
        feels. The months before it rarely feel that way. Their planning
        lives in group chats, spreadsheets and late-night lists, and none of
        it reflects the venue they chose.
      </BodyText>
      <BodyText direction={direction}>
        Signal Studio gives each of your couples one clear place to plan:
        their tasks, their timeline, their private notes, and a short morning
        briefing that points at the few things needing attention. Your name
        sits quietly at the top of their workspace. There is nothing for your
        team to set up or run.
      </BodyText>
      <PrivacyBoundary direction={direction}>
        The couple’s planning stays theirs. {data.venueName} never sees their
        notes or their lists. We would not build it any other way.
      </PrivacyBoundary>
      <BodyText direction={direction}>
        Sixty seconds on what the planning year looks like when{" "}
        {data.venueName} stands behind it.
      </BodyText>
      <VideoPoster
        direction={direction}
        src="/email-assets/poster-venues.png"
        alt="A Signal Tasks window showing one task, send final guest count to catering, marked with a thin indigo line. Make the planning feel as considered as the day. A 60 second film."
        href="https://signalstudio.ie/films/venues"
        width={536}
        height={302}
        caption="As considered as the day · the Signal Studio venue film"
        linkLabel="Watch the film"
        duration="60 seconds"
      />
      <BodyText direction={direction}>
        If it looks right for {data.venueName}, I will set your next couple
        up with a code, with my compliments. And if it is not for you, a
        one-line reply saying so is genuinely welcome.
      </BodyText>
      <BodyText direction={direction}>
        Worth twenty minutes? Reply and pick a morning.
      </BodyText>
      <FounderSignature direction={direction} closing="Thanks for your time," />
    </EmailShell>
  );
}
