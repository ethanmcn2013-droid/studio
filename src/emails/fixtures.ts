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
      requestedAt: "09:12, 16 July 2026 · Irish time",
      metaDateISO: "2026-07-16",
    },
  },
  "long-address": {
    label: "Long email address",
    data: {
      email: "aoife.brennan-fitzgerald.weddings@stationhousehotel-events.example.ie",
      code: "073 245",
      requestedAt: "23:58, 31 December 2026 · Irish time",
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
        "House move, Galway to Limerick",
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

// ── Wave 2 (2026-07-16, post lock-in) ──────────────────────────────────

export type VerifyEmailData = {
  email: string;
  verifyUrl: string;
  expiresHours: number;
  metaDateISO: string;
};

export type WaitlistJoinedData = {
  email: string;
  metaDateISO: string;
};

export type WelcomeData = {
  firstName?: string;
  workspaceName: string;
  workspaceUrl: string;
  metaDateISO: string;
};

export type WorkspaceInvitationData = {
  inviterName: string;
  inviterFirstName: string;
  inviterEmail: string;
  workspaceName: string;
  roleLine: string;
  expiresOn: string;
  acceptUrl: string;
  metaDateISO: string;
};

export type ReceiptData = {
  receiptNo: string;
  paidOn: string;
  lines: { item: string; amount: string }[];
  total: string;
  card: string;
  billedTo: string;
  receiptUrl: string;
  metaDateISO: string;
};

export type RenewalUpcomingData = {
  plan: string;
  amount: string;
  card: string;
  renewsOn: string;
  metaDateISO: string;
};

export type NewSignInData = {
  device: string;
  location: string;
  time: string;
  metaDateISO: string;
};

export type ExportReadyData = {
  contains: string;
  format: string;
  size: string;
  expiresOn: string;
  downloadUrl: string;
  metaDateISO: string;
};

export type VenueCodesReadyData = {
  venueName: string;
  contactFirstName: string;
  codeCount: number;
  codesUrl: string;
  metaDateISO: string;
};

export const verifyEmailFixtures: FixtureSet<VerifyEmailData> = {
  default: {
    label: "Default",
    data: {
      email: "aoife.brennan@example.ie",
      verifyUrl: "https://signalstudio.ie/verify/db-4f2a-example",
      expiresHours: 24,
      metaDateISO: "2026-07-16",
    },
  },
};

export const waitlistJoinedFixtures: FixtureSet<WaitlistJoinedData> = {
  default: {
    label: "Default",
    data: {
      email: "aoife.brennan@example.ie",
      metaDateISO: "2026-07-16",
    },
  },
};

export const welcomeFixtures: FixtureSet<WelcomeData> = {
  default: {
    label: "Default",
    data: {
      firstName: "Aoife",
      workspaceName: "Your first workspace",
      workspaceUrl: "https://tasks.signalstudio.ie",
      metaDateISO: "2026-07-16",
    },
  },
  "no-first-name": {
    label: "Missing first name",
    data: {
      firstName: undefined,
      workspaceName: "Your first workspace",
      workspaceUrl: "https://tasks.signalstudio.ie",
      metaDateISO: "2026-07-16",
    },
  },
};

export const workspaceInvitationFixtures: FixtureSet<WorkspaceInvitationData> = {
  default: {
    label: "Default",
    data: {
      inviterName: "Aoife Brennan",
      inviterFirstName: "Aoife",
      inviterEmail: "aoife.brennan@example.ie",
      workspaceName: "Brennan & Walsh wedding",
      roleLine: "Plan and edit everything in this workspace",
      expiresOn: "30 July 2026",
      acceptUrl: "https://tasks.signalstudio.ie/invite/x7c2-example",
      metaDateISO: "2026-07-16",
    },
  },
  "long-names": {
    label: "Long workspace and inviter names",
    data: {
      inviterName: "Caoimhe N\u00ed Dhomhnaill-Fitzgerald",
      inviterFirstName: "Caoimhe",
      inviterEmail: "caoimhe.nidhomhnaill.fitzgerald@example.ie",
      workspaceName: "Ballyfarnon House autumn wedding fair and open weekend",
      roleLine: "Read the plan and comment, without editing",
      expiresOn: "30 July 2026",
      acceptUrl: "https://tasks.signalstudio.ie/invite/x7c2-example",
      metaDateISO: "2026-07-16",
    },
  },
};

export const receiptFixtures: FixtureSet<ReceiptData> = {
  default: {
    label: "Pro monthly",
    data: {
      receiptNo: "SS-2026-004182",
      paidOn: "16 July 2026",
      lines: [{ item: "Signal Studio Pro \u00b7 14 July to 13 August 2026", amount: "\u20ac12.00" }],
      total: "\u20ac12.00",
      card: "Visa ending 4921",
      billedTo: "Aoife Brennan",
      receiptUrl: "https://signalstudio.ie/receipts/SS-2026-004182",
      metaDateISO: "2026-07-16",
    },
  },
  "student-year": {
    label: "Student year",
    data: {
      receiptNo: "SS-2026-004201",
      paidOn: "16 July 2026",
      lines: [{ item: "Signal Studio Student \u00b7 one year", amount: "\u20ac9.99" }],
      total: "\u20ac9.99",
      card: "Mastercard ending 0037",
      billedTo: "Jamie Murphy",
      receiptUrl: "https://signalstudio.ie/receipts/SS-2026-004201",
      metaDateISO: "2026-07-16",
    },
  },
};

export const renewalUpcomingFixtures: FixtureSet<RenewalUpcomingData> = {
  default: {
    label: "Default",
    data: {
      plan: "Signal Studio Pro",
      amount: "\u20ac12.00",
      card: "Visa ending 4921",
      renewsOn: "14 August 2026",
      metaDateISO: "2026-08-07",
    },
  },
};

export const newSignInFixtures: FixtureSet<NewSignInData> = {
  default: {
    label: "Default",
    data: {
      device: "iPhone \u00b7 Safari",
      location: "Galway, Ireland",
      time: "21:40, 15 July 2026 \u00b7 Irish time",
      metaDateISO: "2026-07-15",
    },
  },
};

export const exportReadyFixtures: FixtureSet<ExportReadyData> = {
  default: {
    label: "Default",
    data: {
      contains: "2 workspaces: every note, task, timeline and briefing",
      format: "One zip of open files: text, spreadsheet, calendar",
      size: "18 MB",
      expiresOn: "23 July 2026",
      downloadUrl: "https://signalstudio.ie/account/export/dl-91b2-example",
      metaDateISO: "2026-07-16",
    },
  },
};

export const venueCodesReadyFixtures: FixtureSet<VenueCodesReadyData> = {
  default: {
    label: "Default (fictional venue)",
    data: {
      venueName: "The Mill House",
      contactFirstName: "Niamh",
      codeCount: 10,
      codesUrl: "https://signalstudio.ie/venue/codes/mill-house-example",
      metaDateISO: "2026-07-16",
    },
  },
};
