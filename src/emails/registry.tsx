import type { ReactElement } from "react";
import type { EmailDirection } from "./directions";
import {
  accessReadyFixtures,
  deletionScheduledFixtures,
  dispatchIssueFixtures,
  paymentFailedFixtures,
  schoolOutreachFixtures,
  signInCodeFixtures,
  studentVerifiedFixtures,
  venueOutreachFixtures,
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
} from "./fixtures";
import type { TextDoc } from "./plaintext";
import { SignInCodeEmail, signInCodeText } from "./templates/sign-in-code";
import { AccessReadyEmail, accessReadyText } from "./templates/access-ready";
import { PaymentFailedEmail, paymentFailedText } from "./templates/payment-failed";
import { DeletionScheduledEmail, deletionScheduledText } from "./templates/deletion-scheduled";
import { VenueOutreachEmail, venueOutreachText } from "./templates/venue-outreach";
import { SchoolOutreachEmail, schoolOutreachText } from "./templates/school-outreach";
import { StudentVerifiedEmail, studentVerifiedText } from "./templates/student-verified";
import { DispatchIssueEmail, dispatchIssueText } from "./templates/dispatch-issue";
import { VerifyEmailEmail, verifyEmailText } from "./templates/verify-email";
import { WaitlistJoinedEmail, waitlistJoinedText } from "./templates/waitlist-joined";
import { WelcomeFirstWorkspaceEmail, welcomeFirstWorkspaceText } from "./templates/welcome-first-workspace";
import { WorkspaceInvitationEmail, workspaceInvitationText } from "./templates/workspace-invitation";
import { ReceiptEmail, receiptText } from "./templates/receipt";
import { RenewalUpcomingEmail, renewalUpcomingText } from "./templates/renewal-upcoming";
import { NewSignInEmail, newSignInText } from "./templates/new-sign-in";
import { ExportReadyEmail, exportReadyText } from "./templates/export-ready";
import { VenueCodesReadyEmail, venueCodesReadyText } from "./templates/venue-codes-ready";

/**
 * The template registry · message metadata lives here, never inside
 * layout components. Senders and tracking are the PROPOSED architecture
 * (docs/email-system/sender-architecture.md); today the suite sends only
 * from hello@signalstudio.ie and the proposal is a founder decision.
 */

export type EmailMode = "utility" | "guided" | "founder" | "editorial";
export type EmailClassification =
  | "transactional"
  | "operational"
  | "lifecycle"
  | "commercial"
  | "editorial";

export type TemplateDef<TData = unknown> = {
  id: string;
  name: string;
  mode: EmailMode;
  classification: EmailClassification;
  priority: "P0" | "P1" | "P2";
  sender: { name: string; address: string; proposed: boolean };
  replyTo: string;
  unsubscribe: string;
  tracking: string;
  subject: (data: TData) => string;
  preheader: (data: TData) => string;
  /** Provisional claims and open decisions the founder should see in the Lab. */
  assumptions: string[];
  sourceFile: string;
  fixtures: FixtureSet<TData>;
  render: (direction: EmailDirection, data: TData) => ReactElement;
  /** The designed plain-text twin (CL-14), composed per direction. */
  text: (data: TData) => TextDoc;
};

export type AnyTemplateDef = TemplateDef<any>;

function def<TData>(t: TemplateDef<TData>): AnyTemplateDef {
  return t as AnyTemplateDef;
}

export const TEMPLATES: AnyTemplateDef[] = [
  def({
    id: "auth.sign-in-code",
    name: "One-time sign-in code",
    mode: "utility",
    classification: "transactional",
    priority: "P0",
    sender: { name: "Signal Studio", address: "account@signalstudio.ie", proposed: true },
    replyTo: "hello@signalstudio.ie",
    unsubscribe: "Not applicable · transactional",
    tracking: "No open tracking, no click tracking",
    subject: (d) => `Your Signal Studio sign-in code is ${d.code}`,
    preheader: (d) => `It expires in 10 minutes. Requested ${d.requestedAt}.`,
    assumptions: [
      "Auth email is sent by Clerk today; this is the code-owned replacement path.",
      "account@signalstudio.ie is a proposed sender; hello@ is the only address in use.",
    ],
    sourceFile: "src/emails/templates/sign-in-code.tsx",
    fixtures: signInCodeFixtures,
    text: signInCodeText,
    render: (dir, data) => <SignInCodeEmail direction={dir} data={data} />,
  }),
  def({
    id: "access.ready",
    name: "Access is ready · welcome",
    mode: "guided",
    classification: "lifecycle",
    priority: "P0",
    sender: { name: "Signal Studio", address: "hello@signalstudio.ie", proposed: false },
    replyTo: "hello@signalstudio.ie",
    unsubscribe: "Not applicable · the message that opens the account",
    tracking: "No open tracking · first-party links only",
    subject: () => "Signal Studio is open for you",
    preheader: (d) => d.firstName
      ? `${d.firstName}, your place on the waitlist came up today.`
      : "Your place on the waitlist came up today.",
    assumptions: [
      "Access opens in small batches with no public date (live waitlist copy, contracts/commercial-terms.v1.json accessState waitlist_first).",
      "First workspace opens in Signal Tasks; founder may prefer the umbrella.",
    ],
    sourceFile: "src/emails/templates/access-ready.tsx",
    fixtures: accessReadyFixtures,
    text: accessReadyText,
    render: (dir, data) => <AccessReadyEmail direction={dir} data={data} />,
  }),
  def({
    id: "billing.payment-failed",
    name: "Payment failed",
    mode: "utility",
    classification: "transactional",
    priority: "P0",
    sender: { name: "Signal Studio", address: "billing@signalstudio.ie", proposed: true },
    replyTo: "hello@signalstudio.ie",
    unsubscribe: "Not applicable · transactional",
    tracking: "No open tracking, no click tracking",
    subject: (d) => `Payment failed for ${d.plan}`,
    preheader: (d) => `We could not charge ${d.card}. Nothing has changed yet.`,
    assumptions: [
      "Stripe handles dunning today (Tasks repo); this is the code-owned path.",
      "Pro is €12 a month. The annual price is contradicted across sources (€100 vs €120) and is deliberately not stated.",
      "signalstudio.ie/account/billing is a placeholder route.",
    ],
    sourceFile: "src/emails/templates/payment-failed.tsx",
    fixtures: paymentFailedFixtures,
    text: paymentFailedText,
    render: (dir, data) => <PaymentFailedEmail direction={dir} data={data} />,
  }),
  def({
    id: "account.deletion-scheduled",
    name: "Account deletion scheduled",
    mode: "utility",
    classification: "transactional",
    priority: "P0",
    sender: { name: "Signal Studio", address: "account@signalstudio.ie", proposed: true },
    replyTo: "hello@signalstudio.ie",
    unsubscribe: "Not applicable · transactional",
    tracking: "No open tracking, no click tracking",
    subject: (d) => `Your account will be deleted on ${d.scheduledFor}`,
    preheader: (d) => `Nothing is deleted yet. You can cancel until ${d.scheduledFor}.`,
    assumptions: [
      "Retention window (backups age out within 90 days) mirrors the live privacy page.",
      "account/deletion and account/export are placeholder routes.",
    ],
    sourceFile: "src/emails/templates/deletion-scheduled.tsx",
    fixtures: deletionScheduledFixtures,
    text: deletionScheduledText,
    render: (dir, data) => <DeletionScheduledEmail direction={dir} data={data} />,
  }),
  def({
    id: "outreach.venue-first",
    name: "Venue outreach · first contact",
    mode: "founder",
    classification: "commercial",
    priority: "P0",
    sender: { name: "Ethan McNamara", address: "hello@signalstudio.ie", proposed: false },
    replyTo: "hello@signalstudio.ie",
    unsubscribe: "Manual suppression · a reply saying no is honoured for good",
    tracking: "None · plain personal mail, no pixels, no tracked links",
    subject: (d) => `The months before the day at ${d.venueName}`,
    preheader: (d) => `One clear place for ${d.venueName} couples to plan. Private to them.`,
    assumptions: [
      "The venue film is not yet produced; the poster is a composed frame from the locked brief.",
      "€1,500 a year is deliberately left for the follow-up conversation, not first contact.",
      "signalstudio.ie/films/venues is a placeholder route.",
      "Venue and contact are fictional development fixtures.",
    ],
    sourceFile: "src/emails/templates/venue-outreach.tsx",
    fixtures: venueOutreachFixtures,
    text: venueOutreachText,
    render: (dir, data) => <VenueOutreachEmail direction={dir} data={data} />,
  }),
  def({
    id: "outreach.school-first",
    name: "School outreach · first contact",
    mode: "founder",
    classification: "commercial",
    priority: "P2",
    sender: { name: "Ethan McNamara", address: "hello@signalstudio.ie", proposed: false },
    replyTo: "hello@signalstudio.ie",
    unsubscribe: "Manual suppression · a reply saying no is honoured for good",
    tracking: "None · plain personal mail, no pixels, no tracked links",
    subject: (d) => `Planning the school year at ${d.schoolName}`,
    preheader: () => "A year of classes, planned privately, with no pupil database.",
    assumptions: [
      "BLOCKED for sending: segment-sequencing-2026-05 (Active, review 2026-08-16) forbids school outbound and pilots. Prototype for direction review only.",
      "The school film brief (docs/film-system/schools.md) is blocked at the commercial level and deliberately drafts no email caption; the caption here is a design placeholder.",
      "School and contact are fictional development fixtures.",
    ],
    sourceFile: "src/emails/templates/school-outreach.tsx",
    fixtures: schoolOutreachFixtures,
    text: schoolOutreachText,
    render: (dir, data) => <SchoolOutreachEmail direction={dir} data={data} />,
  }),
  def({
    id: "student.verification-approved",
    name: "Student verification approved",
    mode: "guided",
    classification: "transactional",
    priority: "P1",
    sender: { name: "Signal Studio", address: "hello@signalstudio.ie", proposed: false },
    replyTo: "hello@signalstudio.ie",
    unsubscribe: "Not applicable · transactional",
    tracking: "No open tracking, no click tracking",
    subject: () => "Your student rate is active",
    preheader: (d) => `€9.99 a year, everything included, valid until ${d.validUntil}.`,
    assumptions: [
      "€9.99 a year is the live pricing-page figure.",
      "The verification method is an open founder decision; the copy never describes one.",
      "Annual re-verification is implied by the pricing page and stated softly.",
    ],
    sourceFile: "src/emails/templates/student-verified.tsx",
    fixtures: studentVerifiedFixtures,
    text: studentVerifiedText,
    render: (dir, data) => <StudentVerifiedEmail direction={dir} data={data} />,
  }),
  def({
    id: "editorial.dispatch-issue",
    name: "Dispatch issue",
    mode: "editorial",
    classification: "editorial",
    priority: "P1",
    sender: { name: "Signal Studio", address: "dispatch@signalstudio.ie", proposed: true },
    replyTo: "hello@signalstudio.ie",
    unsubscribe: "Required · RFC 8058 one-click plus the footer link",
    tracking: "No open pixels · aggregate first-party link counts at most",
    subject: (d) => `The Dispatch · ${d.headline.replace(/\.$/, "")}`,
    preheader: () => "Signal Studio is open in small batches. One issue, one story.",
    assumptions: [
      "An email edition of the Dispatch does not exist yet; the Dispatch is the changelog at signalstudio.ie/dispatch. Founder decision required.",
      "All stories reference shipped public surfaces (waitlist, The Brief, Meet Dot).",
      "The long-headline fixture is layout-testing copy, not a product claim.",
      "dispatch@signalstudio.ie is a proposed sender.",
    ],
    sourceFile: "src/emails/templates/dispatch-issue.tsx",
    fixtures: dispatchIssueFixtures,
    text: dispatchIssueText,
    render: (dir, data) => <DispatchIssueEmail direction={dir} data={data} />,
  }),
  // ── Wave 2 (post lock-in, 2026-07-16) ──────────────────────────────
  def({
    id: "auth.verify-email",
    name: "Verify email",
    mode: "utility",
    classification: "transactional",
    priority: "P0",
    sender: { name: "Signal Studio", address: "account@signalstudio.ie", proposed: true },
    replyTo: "hello@signalstudio.ie",
    unsubscribe: "Not applicable \u00b7 transactional",
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
    unsubscribe: "Not applicable \u00b7 a single confirmation, no list",
    tracking: "No open tracking \u00b7 first-party links only",
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
    name: "Welcome \u00b7 first workspace",
    mode: "guided",
    classification: "lifecycle",
    priority: "P1",
    sender: { name: "Signal Studio", address: "hello@signalstudio.ie", proposed: false },
    replyTo: "hello@signalstudio.ie",
    unsubscribe: "Not applicable \u00b7 sent once at account creation",
    tracking: "No open tracking \u00b7 first-party links only",
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
    unsubscribe: "Not applicable \u00b7 person-to-person invitation",
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
    unsubscribe: "Not applicable \u00b7 transactional",
    tracking: "No open tracking, no click tracking",
    subject: (d) => `Receipt ${d.receiptNo} \u00b7 ${d.total} paid to Signal Studio`,
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
    unsubscribe: "Not applicable \u00b7 transactional",
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
    unsubscribe: "Not applicable \u00b7 security",
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
    unsubscribe: "Not applicable \u00b7 transactional",
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
    unsubscribe: "Not applicable \u00b7 operational, venue holds an Edition",
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

export function getTemplate(id: string): AnyTemplateDef | undefined {
  return TEMPLATES.find((t) => t.id === id);
}
