import type { Metadata } from "next";
import { LegalDocument } from "@/components/legal/legal-document";

export const metadata: Metadata = {
  title: "Privacy — Signal Studio",
  description:
    "What Signal Studio collects, what it doesn't, where data lives, and how to request a copy or deletion.",
};

const SECTIONS = [
  {
    heading: "What we collect",
    body: [
      "Signing in to a Signal Studio product creates an account through Clerk, our authentication provider. Clerk stores your email, name (if you provide one), and an opaque user identifier. We never see your password.",
      "Inside each product, we store the work you create: tasks, notes, timeline items, briefing preferences. We store who made what, who shared what with whom, and when. We do not store anything you didn't enter yourself.",
      "If you reach out to hello@signalstudio.ie, we keep the message in a standard email inbox.",
    ],
  },
  {
    heading: "What we don't collect",
    body: [
      "No third-party advertising trackers. No fingerprinting. No session replay. No marketing pixels. No behavioural profiling.",
      "We use Vercel Analytics for anonymous traffic counts (which pages got visited, from which country, on which device class). It does not set cookies and it does not see your account.",
    ],
  },
  {
    heading: "Where data lives",
    body: [
      "Account records: Clerk (United States). Workspace and product data: Turso (managed libSQL, primarily Frankfurt). Error reports: Sentry (United States, with personal data scrubbed before send). Static hosting and serverless functions: Vercel (United States and edge regions).",
      "Outbound mail (briefing emails and operator notifications) is sent through Resend.",
      "Our subprocessors are listed below. We will update this list before adding a new one.",
    ],
  },
  {
    heading: "Subprocessors",
    body: [
      "Clerk — authentication.",
      "Turso — application database.",
      "Vercel — hosting, edge functions, anonymous analytics.",
      "Sentry — error monitoring (PII scrubbed at the SDK before transmission).",
      "Resend — outbound email delivery.",
      "Stripe — payments for paid plans, when applicable. Stripe stores card details; we never see them.",
      "Google Workspace — operator email at hello@signalstudio.ie.",
    ],
  },
  {
    heading: "Cookies",
    body: [
      "We set cookies only for sign-in sessions. No marketing cookies. No third-party trackers that need consent banners.",
    ],
  },
  {
    heading: "Your rights",
    body: [
      "If you are in the EU, EEA, or UK, the GDPR gives you the right to access, correct, export, restrict, or delete the personal data we hold about you. Send a request to hello@signalstudio.ie from the address on the account. We respond inside thirty days, usually faster.",
      "If you are in California, the CCPA gives you parallel rights. Same address, same response time.",
      "You can also close your account at any time and your data will be deleted within sixty days, except records we are required to retain (billing, fraud prevention).",
    ],
  },
  {
    heading: "Data retention",
    body: [
      "We keep your data while your account is active. When you close the account, we delete it within sixty days. Backups age out inside ninety days.",
      "Billing records and tax records are retained for as long as Irish tax law requires.",
    ],
  },
  {
    heading: "Changes to this policy",
    body: [
      "If we change this policy, we will say so on the changelog at signalstudio.ie/dispatch and date the change here. Material changes will be announced by email to active accounts.",
    ],
  },
  {
    heading: "Contact",
    body: [
      "Questions, complaints, data requests: hello@signalstudio.ie. The address is read by a person.",
      "The data controller is Ethan McNamara, Dublin, Ireland.",
    ],
  },
] as const;

export default function PrivacyPage() {
  return (
    <LegalDocument
      eyebrow="Privacy"
      title={<>What we collect, what we don&apos;t, where it lives.</>}
      intro={
        <>
          Signal Studio is built by a small team. The data discipline matches
          the brand discipline: less, named, accountable. This page tells you
          what we hold, who else touches it, and how to take it back.
        </>
      }
      updated="2026-05-12"
      sections={SECTIONS}
      footnote={
        <>
          No dark patterns, no buried clauses. If something here is unclear,
          that&rsquo;s a bug — write to hello@signalstudio.ie and we&rsquo;ll
          fix the wording or the system.
        </>
      }
    />
  );
}
