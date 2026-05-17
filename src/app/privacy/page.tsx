import type { Metadata } from "next";
import { SiteFooter } from "@/components/landing/site-footer";

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
      "Inside each product, we store the work you create: tasks, notes, roadmap items, briefing preferences. We store who made what, who shared what with whom, and when. We do not store anything you didn't enter yourself.",
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
    <>
      <main id="main" tabIndex={-1} className="flex flex-1 flex-col">
        <section className="mx-auto w-full max-w-[760px] px-6 pb-28 pt-16 md:pt-24">
          <div
            className="mb-6 text-[11px] font-semibold uppercase"
            style={{
              color: "var(--accent)",
              letterSpacing: "var(--tracking-eyebrow)",
            }}
          >
            Privacy
          </div>

          <h1 className="h-section mb-6 max-w-[620px] text-balance text-ink">
            What we collect, what we don&apos;t, where it lives.
          </h1>

          <p
            className="mb-2 max-w-[58ch] leading-[1.7] text-ink-soft"
            style={{ fontSize: "clamp(0.9375rem, 0.875rem + 0.3vw, 1.0625rem)" }}
          >
            Signal Studio is built by a small team. The data discipline matches
            the brand discipline: less, named, accountable. This page tells you
            what we hold, who else touches it, and how to take it back.
          </p>

          <p className="mb-16 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-faint">
            Last updated 2026-05-12
          </p>

          <div className="space-y-12">
            {SECTIONS.map((s) => (
              <section key={s.heading}>
                <h2 className="mb-4 text-[20px] font-semibold leading-snug tracking-[-0.015em] text-ink">
                  {s.heading}
                </h2>
                <div className="space-y-4 text-[15px] leading-[1.7] text-ink-soft">
                  {s.body.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
