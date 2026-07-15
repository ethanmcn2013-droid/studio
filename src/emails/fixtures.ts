/**
 * Development fixtures for the email prototypes.
 *
 * Every person, venue and school below is fictional and clearly a fixture.
 * Real prospects (for example the Lamb's Hill pilot) are deliberately not
 * used: prototype renders must never look like real correspondence.
 *
 * Dates are fixed strings in the en-IE register (Dublin time) so renders
 * are deterministic. Where a commercial fact is unresolved, the copy
 * avoids the claim and the template's `assumptions` list names it.
 */

export type SignInCodeData = {
  email: string;
  code: string;
  requestedAt: string;
  metaDate: string;
};

export type AccessReadyData = {
  firstName?: string;
  joinedOn: string;
  workspaceProduct: string;
  metaDate: string;
};

export type PaymentFailedData = {
  fullName: string;
  plan: string;
  amount: string;
  card: string;
  attemptedOn: string;
  nextAttemptOn: string;
  finalAttempt: boolean;
  metaDate: string;
};

export type DeletionScheduledData = {
  firstName?: string;
  requestedOn: string;
  scheduledFor: string;
  workspaces: string[];
  metaDate: string;
};

export type VenueOutreachData = {
  contactFirstName: string;
  venueName: string;
  venueRegion: string;
  metaDate: string;
};

export type SchoolOutreachData = {
  contactName: string;
  schoolName: string;
  town: string;
  metaDate: string;
};

export type StudentVerifiedData = {
  firstName: string;
  studentEmail: string;
  validUntil: string;
  metaDate: string;
};

export type DispatchIssueData = {
  issueLabel: string;
  headline: string;
  metaDate: string;
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
      metaDate: "16 Jul 2026",
    },
  },
  "long-address": {
    label: "Long email address",
    data: {
      email: "aoife.brennan-fitzgerald.weddings@stationhousehotel-events.example.ie",
      code: "073 245",
      requestedAt: "23:58, 31 December 2026 · Dublin time",
      metaDate: "31 Dec 2026",
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
      metaDate: "1 Sep 2026",
    },
  },
  "no-first-name": {
    label: "Missing first name",
    data: {
      firstName: undefined,
      joinedOn: "3 August",
      workspaceProduct: "https://tasks.signalstudio.ie",
      metaDate: "1 Sep 2026",
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
      metaDate: "14 Jul 2026",
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
      metaDate: "22 Jul 2026",
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
      workspaces: ["Brennan · Walsh wedding", "Freelance work"],
      metaDate: "16 Jul 2026",
    },
  },
  "many-workspaces": {
    label: "No first name · four workspaces",
    data: {
      firstName: undefined,
      requestedOn: "2 January 2027",
      scheduledFor: "Monday 1 February 2027",
      workspaces: [
        "Brennan · Walsh wedding",
        "Freelance work",
        "House move, Galway to Dublin",
        "Choir committee, autumn concert",
      ],
      metaDate: "2 Jan 2027",
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
      metaDate: "16 July 2026",
    },
  },
  "long-venue-name": {
    label: "Long venue name",
    data: {
      contactFirstName: "Caoimhe",
      venueName: "Ballyfarnon House and Walled Garden Estate",
      venueRegion: "Roscommon",
      metaDate: "16 July 2026",
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
      metaDate: "16 July 2026",
    },
  },
  "long-school-name": {
    label: "Long school name",
    data: {
      contactName: "Pádraig",
      schoolName: "Coláiste Mhuire agus Naomh Bríd Community College",
      town: "Ballaghaderreen",
      metaDate: "16 July 2026",
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
      metaDate: "16 Jul 2026",
    },
  },
};

export const dispatchIssueFixtures: FixtureSet<DispatchIssueData> = {
  default: {
    label: "Default",
    data: {
      issueLabel: "No. 1 · July 2026",
      headline: "The waitlist is open.",
      metaDate: "Jul 2026",
    },
  },
  "long-subject": {
    label: "Very long headline",
    data: {
      issueLabel: "No. 2 · August 2026",
      headline:
        "Timeline learns to hold a plan steady while everything around it moves, and the whole suite gets quieter about it.",
      metaDate: "Aug 2026",
    },
  },
};
