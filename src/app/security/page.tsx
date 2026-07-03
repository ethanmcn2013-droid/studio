import type { Metadata } from "next";
import { LegalDocument } from "@/components/legal/legal-document";

export const metadata: Metadata = {
  title: "Security · Signal Studio",
  description:
    "How Signal Studio protects your data, transport, storage, access controls, monitoring, subprocessors, and how to report a vulnerability.",
};

const SECTIONS = [
  {
    heading: "Transport",
    body: [
      "All traffic to Signal Studio products is served over HTTPS. HSTS is enforced with a two-year max-age and includeSubDomains. The HSTS preload list submission is open.",
      "TLS is terminated at Vercel's edge. Outbound connections to Turso, Clerk, Stripe, Sentry, and Resend are also over TLS.",
    ],
  },
  {
    heading: "Headers",
    body: [
      "X-Frame-Options is set to DENY across the suite, so Signal Studio surfaces cannot be embedded in third-party frames.",
      "X-Content-Type-Options is set to nosniff. Referrer-Policy is strict-origin-when-cross-origin. Permissions-Policy disables camera, microphone, geolocation, and FLoC interest-cohort.",
      "Content-Security-Policy is deployed in Report-Only mode while we verify allowlist coverage in the wild. The CSP allowlist is per-product and narrowly scoped to the services each product actually loads.",
    ],
  },
  {
    heading: "Data storage",
    body: [
      "Application data lives in Turso (managed libSQL), primarily in the Frankfurt region. The database is encrypted at rest. Database tokens are scoped per surface, Signal, for example, reads the Signal Tasks workspace through a token that physically cannot write back.",
      "Static assets and serverless functions run on Vercel. Backups age out inside ninety days.",
    ],
  },
  {
    heading: "Authentication and access",
    body: [
      "Authentication is provided by Clerk. Multi-factor authentication is available on every account. We never see or store your password.",
      "Inside the operator stack, access to production data is limited to the operator account. Any third-party support access is logged.",
      "Public surfaces, shared timelines, shared updates, public templates, are visible to anyone with the link. You decide what to make public.",
    ],
  },
  {
    heading: "Monitoring",
    body: [
      "Errors are reported to Sentry. Before any error event is sent, the SDK scrubs the request: cookies, query strings, request bodies, sensitive headers (cookie, authorization, x-clerk-*, stripe-signature, svix-*, x-forwarded-for), and breadcrumbs from authentication and payment endpoints are deleted. The user object is reduced to an opaque identifier.",
      "Send-default-PII is disabled. We do not configure session replay.",
    ],
  },
  {
    heading: "Subprocessors",
    body: [
      "The current list of subprocessors lives in the privacy policy at signalstudio.ie/privacy and is updated before any new processor is added.",
    ],
  },
  {
    heading: "Reporting a vulnerability",
    body: [
      "If you find a security issue, write to hello@signalstudio.ie with the subject line \"security\". Include enough detail for us to reproduce it. Please do not exploit the issue beyond what is necessary to demonstrate it, and please do not share it publicly until we have had thirty days to fix it.",
      "We will acknowledge inside two working days and keep you updated until the issue is resolved. We do not currently run a paid bug bounty, but we will credit serious reports in the changelog at signalstudio.ie/dispatch unless you ask us not to.",
    ],
  },
  {
    heading: "What we will not pretend",
    body: [
      "Signal Studio is built by a small team. We do not publish SOC 2 reports. We do not promise an uptime SLA. We are not built for enterprise security requirements. We are honest about the controls we actually run. The controls above are the ones we actually run; we will tell you honestly if you ask about a control you do not see here.",
    ],
  },
] as const;

export default function SecurityPage() {
  return (
    <LegalDocument
      eyebrow="Security"
      title={<>The controls we actually run.</>}
      intro={
        <>
          A trust page should be specific, not aspirational. This one is. If
          something below is wrong, write to hello@signalstudio.ie and we will
          either fix the page or fix the system.
        </>
      }
      updated="2026-05-12"
      sections={SECTIONS}
    />
  );
}
