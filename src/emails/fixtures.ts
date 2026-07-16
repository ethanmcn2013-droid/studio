/**
 * Development fixtures for the email prototypes.
 *
 * Every person, venue and school below is fictional and clearly a fixture.
 * Real prospects (for example the Lamb's Hill pilot) are deliberately not
 * used: prototype renders must never look like real correspondence.
 *
 * Dates that drive the header slot are ISO (`metaDateISO`); each direction
 * formats them in its own single grammar (CL-01). Dates inside prose stay
 * written out in the en-IE register, sentence case, in every direction.
 * Where a commercial fact is unresolved, the copy avoids the claim and the
 * template's `assumptions` list names it.
 */

export type SignInCodeData = {
  email: string;
  code: string;
  requestedAt: string;
  metaDateISO: string;
};

export type AccessReadyData = {
  firstName?: string;
  joinedOn: string;
  workspaceProduct: string;
  metaDateISO: string;
};

export type PaymentFailedData = {
  fullName: string;
  plan: string;
  amount: string;
  card: string;
  attemptedOn: string;
  nextAttemptOn: string;
  finalAttempt: boolean;
  metaDateISO: string;
};

export type DeletionScheduledData = {
  firstName?: string;
  requestedOn: string;
  scheduledFor: string;
  workspaces: string[];
  metaDateISO: string;
};

export type VenueOutreachData = {
  contactFirstName: string;
  venueName: string;
  venueRegion: string;
  metaDateISO: string;
};

export type SchoolOutreachData = {
  contactName: string;
  schoolName: string;
  town: string;
  metaDateISO: string;
};

export type StudentVerifiedData = {
  firstName: string;
  studentEmail: string;
  validUntil: string;
  metaDateISO: string;
};

export type DispatchIssueData = {
  issueNo: number;
  monthISO: string;
  headline: string;
};

export type Fixture<T> = { label: string; data: T };
export type FixtureSet<T> = Record<string, Fixture<T>>;

export const signInCodeFixtures: FixtureSet<SignInCodeData> = {
  default: {
    label: "Default",
    data: {
      email: "aoife.brennan@example.ie",
      code: "482 916",
      requestedAt: "09:12, 16 July 2026 · Dublin time",
      metaDateISO: "2026-07-16",
    },
  },
  "long-address": {
    label: "Long email address",
    data: {
      email: "aoife.brennan-fitzgerald.weddings@stationhousehotel-events.example.ie",
      code: "073 245",
      requestedAt: "23:58, 31 December 2026 · Dublin time",
      metaDateISO: "2026-12-31",
    },
  },
};

export const accessReadyFixtures: FixtureSet<AccessReadyData> = {
  default: {
    label: "Default",
    data: {
      firstName: "Aoife",
      joinedOn: "12 June",
      workspaceProduct: "https://tasks.signalstudio.ie",
      metaDateISO: "2026-09-01",
    },
  },
  "no-first-name": {
    label: "Missing first name",
    data: {
      firstName: undefined,
      joinedOn: "3 August",
      workspaceProduct: "https://tasks.signalstudio.ie",
      metaDateISO: "2026-09-01",
    },
  },
};

export const paymentFailedFixtures: FixtureSet<PaymentFailedData> = {
  default: {
    label: "Default",
    data: {
      fullName: "Aoife Brennan",
      plan: "Signal Studio Pro",
      amount: "€12.00",
      card: "Visa ending 4921",
      attemptedOn: "14 July 2026",
      nextAttemptOn: "18 July 2026",
      finalAttempt: false,
      metaDateISO: "2026-07-14",
    },
  },
  "final-attempt": {
    label: "Final attempt · long name",
    data: {
      fullName: "Caoimhe Ní Dhomhnaill-Fitzgerald",
      plan: "Signal Studio Pro",
      amount: "€12.00",
      card: "Mastercard ending 0037",
      attemptedOn: "22 July 2026",
      nextAttemptOn: "26 July 2026",
      finalAttempt: true,
      metaDateISO: "2026-07-22",
    },
  },
};

export const deletionScheduledFixtures: FixtureSet<DeletionScheduledData> = {
  default: {
    label: "Default · two workspaces",
    data: {
      firstName: "Aoife",
      requestedOn: "16 July 2026",
      scheduledFor: "Saturday 15 August 2026",
      // Workspace names may contain anything; list punctuation must not
      // collide with them (CL-05), so names avoid list separators here
      // and the template joins with commas.
      workspaces: ["Brennan & Walsh wedding", "Freelance work"],
      metaDateISO: "2026-07-16",
    },
  },
  "many-workspaces": {
    label: "No first name · four workspaces",
    data: {
      firstName: undefined,
      requestedOn: "2 January 2027",
      scheduledFor: "Monday 1 February 2027",
      workspaces: [
        "Brennan & Walsh wedding",
        "Freelance work",
        "House move, Galway to Dublin",
        "Choir committee, autumn concert",
      ],
      metaDateISO: "2027-01-02",
    },
  },
};

export const venueOutreachFixtures: FixtureSet<VenueOutreachData> = {
  default: {
    label: "Default (fictional venue)",
    data: {
      contactFirstName: "Niamh",
      venueName: "The Mill House",
      venueRegion: "Mayo",
      metaDateISO: "2026-07-16",
    },
  },
  "long-venue-name": {
    label: "Long venue name",
    data: {
      contactFirstName: "Caoimhe",
      venueName: "Ballyfarnon House and Walled Garden Estate",
      venueRegion: "Roscommon",
      metaDateISO: "2026-07-16",
    },
  },
};

export const schoolOutreachFixtures: FixtureSet<SchoolOutreachData> = {
  default: {
    label: "Default (fictional school)",
    data: {
      contactName: "Máire",
      schoolName: "St Senan's Secondary School",
      town: "Ennis",
      metaDateISO: "2026-07-16",
    },
  },
  "long-school-name": {
    label: "Long school name",
    data: {
      contactName: "Pádraig",
      schoolName: "Coláiste Mhuire agus Naomh Bríd Community College",
      town: "Ballaghaderreen",
      metaDateISO: "2026-07-16",
    },
  },
};

export const studentVerifiedFixtures: FixtureSet<StudentVerifiedData> = {
  default: {
    label: "Default",
    data: {
      firstName: "Jamie",
      studentEmail: "j.murphy.2027@student.example-university.ie",
      validUntil: "1 October 2027",
      metaDateISO: "2026-07-16",
    },
  },
};

export const dispatchIssueFixtures: FixtureSet<DispatchIssueData> = {
  default: {
    label: "Default",
    data: {
      issueNo: 1,
      monthISO: "2026-07-01",
      headline: "The waitlist is open.",
    },
  },
  "long-subject": {
    label: "Very long headline",
    data: {
      issueNo: 2,
      monthISO: "2026-08-01",
      headline:
        "Timeline learns to hold a plan steady while everything around it moves, and the whole suite gets quieter about it.",
    },
  },
};
