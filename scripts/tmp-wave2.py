# One-shot: wave-2 fixtures + registry wiring.
import io

def append(p, s):
    with io.open(p, "a", encoding="utf8") as f:
        f.write(s)

def sub(p, pairs):
    s = io.open(p, encoding="utf8").read()
    for a, b in pairs:
        assert a in s, (p, a[:60])
        s = s.replace(a, b)
    io.open(p, "w", encoding="utf8").write(s)

# ── fixtures ──
append(r"src\emails\fixtures.ts", u'''
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
      inviterName: "Caoimhe N\\u00ed Dhomhnaill-Fitzgerald",
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
      lines: [{ item: "Signal Studio Pro \\u00b7 14 July to 13 August 2026", amount: "\\u20ac12.00" }],
      total: "\\u20ac12.00",
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
      lines: [{ item: "Signal Studio Student \\u00b7 one year", amount: "\\u20ac9.99" }],
      total: "\\u20ac9.99",
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
      amount: "\\u20ac12.00",
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
      device: "iPhone \\u00b7 Safari",
      location: "Galway, Ireland",
      time: "21:40, 15 July 2026 \\u00b7 Irish time",
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
''')

# ── registry: imports ──
sub(r"src\emails\registry.tsx", [
 ('import { DispatchIssueEmail, dispatchIssueText } from "./templates/dispatch-issue";',
  '''import { DispatchIssueEmail, dispatchIssueText } from "./templates/dispatch-issue";
import { VerifyEmailEmail, verifyEmailText } from "./templates/verify-email";
import { WaitlistJoinedEmail, waitlistJoinedText } from "./templates/waitlist-joined";
import { WelcomeFirstWorkspaceEmail, welcomeFirstWorkspaceText } from "./templates/welcome-first-workspace";
import { WorkspaceInvitationEmail, workspaceInvitationText } from "./templates/workspace-invitation";
import { ReceiptEmail, receiptText } from "./templates/receipt";
import { RenewalUpcomingEmail, renewalUpcomingText } from "./templates/renewal-upcoming";
import { NewSignInEmail, newSignInText } from "./templates/new-sign-in";
import { ExportReadyEmail, exportReadyText } from "./templates/export-ready";
import { VenueCodesReadyEmail, venueCodesReadyText } from "./templates/venue-codes-ready";'''),
 ('''  venueOutreachFixtures,
  type FixtureSet,
} from "./fixtures";''',
  '''  venueOutreachFixtures,
  verifyEmailFixtures,
  waitlistJoinedFixtures,
  welcomeFixtures,
  workspaceInvitationFixtures,
  receiptFixtures,
  renewalUpcomingFixtures,
  newSignInFixtures,
  exportReadyFixtures,
  venueCodesReadyFixtures,
  type FixtureSet,
} from "./fixtures";'''),
])

# ── registry: nine wave-2 defs before the closing bracket ──
sub(r"src\emails\registry.tsx", [
 ('''];

export function getTemplate''',
 u'''  // ── Wave 2 (post lock-in, 2026-07-16) ──────────────────────────────
  def({
    id: "auth.verify-email",
    name: "Verify email",
    mode: "utility",
    classification: "transactional",
    priority: "P0",
    sender: { name: "Signal Studio", address: "account@signalstudio.ie", proposed: true },
    replyTo: "hello@signalstudio.ie",
    unsubscribe: "Not applicable \\u00b7 transactional",
    tracking: "No open tracking, no click tracking",
    subject: () => "Confirm this address for Signal Studio",
    preheader: (d) => `One click and ${d.email} is yours. The link works for ${d.expiresHours} hours.`,
    assumptions: [
      "Verification email is sent by Clerk today; this is the code-owned replacement path.",
      "The verify link is a development fixture URL.",
    ],
    sourceFile: "src/emails/templates/verify-email.tsx",
    fixtures: verifyEmailFixtures,
    text: verifyEmailText,
    render: (dir, data) => <VerifyEmailEmail direction={dir} data={data} />,
  }),
  def({
    id: "access.waitlist-joined",
    name: "Waitlist joined",
    mode: "utility",
    classification: "lifecycle",
    priority: "P0",
    sender: { name: "Signal Studio", address: "hello@signalstudio.ie", proposed: false },
    replyTo: "hello@signalstudio.ie",
    unsubscribe: "Not applicable \\u00b7 a single confirmation, no list",
    tracking: "No open tracking \\u00b7 first-party links only",
    subject: () => "You are on the Signal Studio list",
    preheader: () => "One email when your access opens, and nothing before it.",
    assumptions: [
      "No waitlist confirmation is sent today; adding one is decision 9 in decisions-required.md and this prototype waits on it.",
      "Makes exactly one promise: a single email at access time. The send pipeline must honour it.",
    ],
    sourceFile: "src/emails/templates/waitlist-joined.tsx",
    fixtures: waitlistJoinedFixtures,
    text: waitlistJoinedText,
    render: (dir, data) => <WaitlistJoinedEmail direction={dir} data={data} />,
  }),
  def({
    id: "welcome.first-workspace",
    name: "Welcome \\u00b7 first workspace",
    mode: "guided",
    classification: "lifecycle",
    priority: "P1",
    sender: { name: "Signal Studio", address: "hello@signalstudio.ie", proposed: false },
    replyTo: "hello@signalstudio.ie",
    unsubscribe: "Not applicable \\u00b7 sent once at account creation",
    tracking: "No open tracking \\u00b7 first-party links only",
    subject: (d) => `${d.workspaceName} is ready`,
    preheader: () => "Put the first real thing in it. There is no welcome sequence.",
    assumptions: [
      "Distinct from access.ready: this is day zero after account creation, not the waitlist gate.",
      "Sent once; the no-welcome-sequence promise in the footer is a product commitment.",
    ],
    sourceFile: "src/emails/templates/welcome-first-workspace.tsx",
    fixtures: welcomeFixtures,
    text: welcomeFirstWorkspaceText,
    render: (dir, data) => <WelcomeFirstWorkspaceEmail direction={dir} data={data} />,
  }),
  def({
    id: "workspace.invitation",
    name: "Workspace invitation",
    mode: "guided",
    classification: "transactional",
    priority: "P0",
    sender: { name: "Signal Studio", address: "hello@signalstudio.ie", proposed: false },
    replyTo: "hello@signalstudio.ie",
    unsubscribe: "Not applicable \\u00b7 person-to-person invitation",
    tracking: "No open tracking, no click tracking",
    subject: (d) => `${d.inviterName} invited you to ${d.workspaceName}`,
    preheader: (d) => `${d.roleLine}. The invitation expires on ${d.expiresOn}.`,
    assumptions: [
      "Signal Tasks sends its own invite email today (tasks repo); this is the suite-level replacement path.",
      "Role wording comes from the entitlements model when it merges; the fixture line is provisional.",
    ],
    sourceFile: "src/emails/templates/workspace-invitation.tsx",
    fixtures: workspaceInvitationFixtures,
    text: workspaceInvitationText,
    render: (dir, data) => <WorkspaceInvitationEmail direction={dir} data={data} />,
  }),
  def({
    id: "billing.receipt",
    name: "Receipt",
    mode: "utility",
    classification: "transactional",
    priority: "P0",
    sender: { name: "Signal Studio", address: "billing@signalstudio.ie", proposed: true },
    replyTo: "hello@signalstudio.ie",
    unsubscribe: "Not applicable \\u00b7 transactional",
    tracking: "No open tracking, no click tracking",
    subject: (d) => `Receipt ${d.receiptNo} \\u00b7 ${d.total} paid to Signal Studio`,
    preheader: (d) => `Paid on ${d.paidOn}. Keep this for your records.`,
    assumptions: [
      "Stripe sends receipts today; this is the code-owned path.",
      "No VAT line yet: VAT registration and Stripe Tax are gated on the Ltd (decisions-required.md); the receipt gains a VAT breakdown when that lands.",
      "The hosted receipt URL is a placeholder route.",
    ],
    sourceFile: "src/emails/templates/receipt.tsx",
    fixtures: receiptFixtures,
    text: receiptText,
    render: (dir, data) => <ReceiptEmail direction={dir} data={data} />,
  }),
  def({
    id: "billing.renewal-upcoming",
    name: "Renewal upcoming",
    mode: "utility",
    classification: "transactional",
    priority: "P1",
    sender: { name: "Signal Studio", address: "billing@signalstudio.ie", proposed: true },
    replyTo: "hello@signalstudio.ie",
    unsubscribe: "Not applicable \\u00b7 transactional",
    tracking: "No open tracking, no click tracking",
    subject: (d) => `Your plan renews on ${d.renewsOn}`,
    preheader: (d) => `${d.amount} to ${d.card}. No action needed.`,
    assumptions: [
      "Advance renewal notice is a policy choice, not yet a shipped behaviour; the send pipeline must schedule it at least 7 days ahead.",
      "signalstudio.ie/account/billing is a placeholder route.",
    ],
    sourceFile: "src/emails/templates/renewal-upcoming.tsx",
    fixtures: renewalUpcomingFixtures,
    text: renewalUpcomingText,
    render: (dir, data) => <RenewalUpcomingEmail direction={dir} data={data} />,
  }),
  def({
    id: "security.new-sign-in",
    name: "New sign-in alert",
    mode: "utility",
    classification: "transactional",
    priority: "P1",
    sender: { name: "Signal Studio", address: "account@signalstudio.ie", proposed: true },
    replyTo: "hello@signalstudio.ie",
    unsubscribe: "Not applicable \\u00b7 security",
    tracking: "No open tracking, no click tracking",
    subject: () => "A new sign-in to your Signal Studio account",
    preheader: (d) => `${d.device}, near ${d.location}, ${d.time}. If this was you, do nothing.`,
    assumptions: [
      "Device and location detail depends on what the auth layer exposes; the fixture shape is the target.",
      "signalstudio.ie/account/sessions is a placeholder route.",
    ],
    sourceFile: "src/emails/templates/new-sign-in.tsx",
    fixtures: newSignInFixtures,
    text: newSignInText,
    render: (dir, data) => <NewSignInEmail direction={dir} data={data} />,
  }),
  def({
    id: "data.export-ready",
    name: "Data export ready",
    mode: "utility",
    classification: "transactional",
    priority: "P0",
    sender: { name: "Signal Studio", address: "account@signalstudio.ie", proposed: true },
    replyTo: "hello@signalstudio.ie",
    unsubscribe: "Not applicable \\u00b7 transactional",
    tracking: "No open tracking, no click tracking",
    subject: (d) => `Your export is ready until ${d.expiresOn}`,
    preheader: (d) => `${d.size}, ${d.format.toLowerCase()}.`,
    assumptions: [
      "Export format and the 7-day link window mirror the privacy page's promises; the pipeline does not exist yet.",
      "The download URL is a development fixture.",
    ],
    sourceFile: "src/emails/templates/export-ready.tsx",
    fixtures: exportReadyFixtures,
    text: exportReadyText,
    render: (dir, data) => <ExportReadyEmail direction={dir} data={data} />,
  }),
  def({
    id: "venue.codes-ready",
    name: "Venue codes ready",
    mode: "guided",
    classification: "operational",
    priority: "P0",
    sender: { name: "Signal Studio", address: "hello@signalstudio.ie", proposed: false },
    replyTo: "hello@signalstudio.ie",
    unsubscribe: "Not applicable \\u00b7 operational, venue holds an Edition",
    tracking: "No open tracking, no click tracking",
    subject: (d) => `${d.codeCount} couple codes for ${d.venueName}`,
    preheader: () => "One code per couple, 18 months each, nothing for your team to run.",
    assumptions: [
      "The entitlements engine (codes, batches, sponsors) is built on the unmerged feat/access-system branch; this email is its outbound face.",
      "The 18-month couple term is verified in contracts/commercial-terms.v1.json.",
      "The code-sheet URL is a placeholder route; venue and contact are fictional fixtures.",
    ],
    sourceFile: "src/emails/templates/venue-codes-ready.tsx",
    fixtures: venueCodesReadyFixtures,
    text: venueCodesReadyText,
    render: (dir, data) => <VenueCodesReadyEmail direction={dir} data={data} />,
  }),
];

export function getTemplate'''),
])

# ── tests: the registry now holds seventeen templates ──
sub(r"src\emails\render.test.ts", [
 ('test("registry holds exactly the eight prototype templates with unique ids", () => {\n  assert.equal(TEMPLATES.length, 8);',
  'test("registry holds exactly the seventeen prototype templates with unique ids", () => {\n  assert.equal(TEMPLATES.length, 17);'),
 ('  // 8 templates \\u00d7 3 directions with every fixture: at least the 24 canonical renders.\n  assert.ok(renders >= 24, `expected at least 24 renders, got ${renders}`);',
  '  // 17 templates \\u00d7 3 directions with every fixture: at least the 51 canonical renders.\n  assert.ok(renders >= 51, `expected at least 51 renders, got ${renders}`);'),
])

print("wave-2 wired")
