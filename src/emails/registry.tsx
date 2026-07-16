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
];

export function getTemplate(id: string): AnyTemplateDef | undefined {
  return TEMPLATES.find((t) => t.id === id);
}
