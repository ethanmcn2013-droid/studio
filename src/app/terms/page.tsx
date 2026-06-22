import type { Metadata } from "next";
import { LegalDocument } from "@/components/legal/legal-document";

export const metadata: Metadata = {
  title: "Terms — Signal Studio",
  description:
    "The agreement between you and Signal Studio when you use Signal Tasks, Timeline, Signal, or Notes.",
};

const SECTIONS = [
  {
    heading: "Acceptance",
    body: [
      "Using any Signal Studio product means you accept these terms. If you do not accept them, do not use the product. If you are using a Signal Studio product on behalf of an organisation, you confirm that you have the authority to bind that organisation.",
    ],
  },
  {
    heading: "What Signal Studio is",
    body: [
      "Signal Studio is a small suite of four products: Signal Notes, Signal Tasks, Signal Timeline, and Signal. Each one is a separate web application. Each one stores the work you create and lets you share it with people you invite.",
      "The suite is operated by Ethan McNamara, a sole trader registered in Ireland.",
    ],
  },
  {
    heading: "Your account",
    body: [
      "You are responsible for everything that happens under your account. Keep your sign-in credentials private. If you suspect someone else has accessed your account, contact hello@signalstudio.ie immediately.",
      "You must be at least 16 years old to create an account.",
      "We may suspend or close an account that is being used to harm other people, send spam, scrape data at scale, or otherwise abuse the service. We will say what we observed before we act.",
    ],
  },
  {
    heading: "Acceptable use",
    body: [
      "Don't use Signal Studio products to host illegal content, share material that infringes someone else's rights, distribute malware, conduct security research without authorisation, or attempt to bypass paid-plan limits.",
      "Don't impersonate another person or organisation in your account profile or in shared workspaces.",
    ],
  },
  {
    heading: "Your content",
    body: [
      "You keep ownership of everything you put into a Signal Studio product. We do not claim a licence to your content beyond what is necessary to operate the service for you (storing it, displaying it back to you, transmitting it to people you share it with).",
      "Public timelines, shared updates, and other public surfaces are visible to anyone with the link. You choose what to make public. We don't index public surfaces for our own benefit beyond making them work.",
    ],
  },
  {
    heading: "Paid plans",
    body: [
      "Some Signal Studio products have a paid plan. Pricing lives at signalstudio.ie/pricing and is the only source of truth — anything else is illustrative.",
      "Payments are processed by Stripe. We never see your card details. Subscriptions renew automatically until you cancel. Cancelling stops the next renewal but does not refund the current period.",
      "We may change pricing for new subscribers at any time. Existing subscribers will keep their current price for at least the remainder of the term they paid for, and we will give thirty days' notice before increasing it.",
    ],
  },
  {
    heading: "Refunds",
    body: [
      "If a paid plan does not work as described inside the first thirty days, write to hello@signalstudio.ie and we will refund what you paid for that period.",
      "If the service breaks badly and we cannot fix it inside a reasonable time, we will refund the unused portion.",
    ],
  },
  {
    heading: "Service availability",
    body: [
      "Signal Studio is built and operated as a small team. We aim for high availability but we don't publish an uptime SLA. If a product is down for more than a few hours, we will post on the changelog at signalstudio.ie/dispatch.",
      "We may take a product offline briefly for upgrades. We try to do this outside Irish business hours.",
    ],
  },
  {
    heading: "Termination",
    body: [
      "You can close your account at any time. Data deletion follows the timeline in our privacy policy.",
      "We can terminate an account that violates these terms. We will tell you why.",
    ],
  },
  {
    heading: "Warranty disclaimer",
    body: [
      "Signal Studio products are provided as-is. We make no guarantees about fitness for a particular purpose, uninterrupted service, or compatibility with every browser and device. We test what we ship; we don't promise it survives every edge case.",
    ],
  },
  {
    heading: "Limitation of liability",
    body: [
      "To the maximum extent permitted by Irish law, Signal Studio's total liability to you for any claim arising from your use of the service is limited to the amount you paid us in the twelve months before the claim. If you did not pay us, our total liability is limited to one hundred euros.",
      "We are not liable for lost profits, lost business opportunities, lost data beyond our backup window, or indirect damages.",
      "Nothing in these terms excludes liability that cannot lawfully be excluded under Irish or EU consumer law.",
    ],
  },
  {
    heading: "Changes to these terms",
    body: [
      "If we change these terms, we will say so on the changelog at signalstudio.ie/dispatch and date the change here. Continued use of the service after the date means you accept the change.",
    ],
  },
  {
    heading: "Governing law",
    body: [
      "These terms are governed by Irish law. Disputes are subject to the exclusive jurisdiction of the Irish courts.",
    ],
  },
  {
    heading: "Contact",
    body: [
      "Questions about these terms: hello@signalstudio.ie. Signal Studio is operated by Ethan McNamara, Limerick, Ireland.",
    ],
  },
] as const;

export default function TermsPage() {
  return (
    <LegalDocument
      eyebrow="Terms"
      title={<>The agreement between you and Signal Studio.</>}
      intro={
        <>
          Plain language where the law lets us, careful language where it
          doesn&apos;t. Read this once. We have tried to make sure you only need
          to.
        </>
      }
      updated="2026-05-12"
      sections={SECTIONS}
    />
  );
}
