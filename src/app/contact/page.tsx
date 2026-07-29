import type { Metadata } from "next";
import { SiteFooter } from "@/components/landing/site-footer";
import {
  formatTrackingRef,
  normalizeTrackingParams,
  type TrackingParamKey,
} from "@/lib/tracking";
import {
  buildMailtoHref,
  CONTACT_EMAILS,
  CONTACT_SUBJECTS,
  type ContactEmailKind,
} from "@/lib/contact";

export const metadata: Metadata = {
  title: "Contact · Signal Studio",
  description: `A real human reads everything sent to ${CONTACT_EMAILS.general}.`,
};

const SUBJECT_ROUTES: Record<
  string,
  { eyebrow: string; kind: ContactEmailKind; subject: string }
> = {
  weddings: {
    eyebrow: "Wedding planning enquiry",
    kind: "partnerships",
    subject: "Wedding partnership enquiry",
  },
  "founding-venue": {
    eyebrow: "Founding Venue Programme",
    kind: "partnerships",
    subject: "Wedding venue partnership enquiry",
  },
};

const CONTACT_DIRECTORY: readonly {
  kind: ContactEmailKind;
  label: string;
  use: string;
}[] = [
  { kind: "general", label: "General", use: "Company questions and press." },
  { kind: "support", label: "Support", use: "Product, access and onboarding help." },
  { kind: "billing", label: "Billing", use: "Payments, invoices, refunds and renewals." },
  { kind: "privacy", label: "Privacy", use: "Data rights, deletion and consent." },
  { kind: "security", label: "Security", use: "Vulnerabilities and suspected compromise." },
  {
    kind: "partnerships",
    label: "Partnerships",
    use: "Venues, schools, universities and organisations.",
  },
];

/**
 * /contact, one screen, three honest intents.
 *
 * Names what reaches a human, names what doesn't. No form. No CRM.
 * Same restraint as the rest of the umbrella. The one concession:
 * a known subject prefills the email so the next step is obvious
 * (a bare mailto is a soft dead-end on mobile/webmail), and any
 * inbound attribution from an outreach link rides into a quiet Ref
 * footer so the founder can attribute the reply and log it in the
 * /hq Outbound CRM. Still a person writing to a person, no form.
 */
function buildMailto(
  subject: string | undefined,
  route: (typeof SUBJECT_ROUTES)[string] | undefined,
  attr: Partial<Record<TrackingParamKey, string | undefined>>,
): string {
  const ref = formatTrackingRef(attr);
  if (!subject && !ref) return buildMailtoHref("general");

  const venueName = attr.venue && attr.venue !== "unknown" ? attr.venue : undefined;
  const subjectLabel = route?.subject ?? CONTACT_SUBJECTS.general;
  const subjectLine = venueName ? `${subjectLabel}, ${venueName}` : subjectLabel;

  const body =
    subject === "founding-venue"
      ? [
          "Hi Ethan,",
          "",
          "[A line about your venue and what made you write.]",
          "",
          "A good time to talk would be:",
          ...(ref ? ["", "—", `Ref: ${ref}`] : []),
        ].join("\n")
      : ref
        ? ["Hi Ethan,", "", "", "—", `Ref: ${ref}`].join("\n")
      : "";

  return buildMailtoHref(route?.kind ?? "general", {
    subject: subjectLine,
    body: body || undefined,
  });
}

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{
    subject?: string;
    source?: string;
    campaign?: string;
    audience?: string;
    artifact?: string;
    touch?: string;
    venue?: string;
  }>;
}) {
  const params = await searchParams;
  const contextualRoute = params.subject ? SUBJECT_ROUTES[params.subject] : undefined;
  const tracking = normalizeTrackingParams({
    source: params.source,
    campaign: params.campaign,
    audience: params.audience,
    artifact: params.artifact,
    touch: params.touch,
    venue: params.venue,
  });
  const trackingRef = formatTrackingRef(tracking);
  const mailtoHref = buildMailto(params.subject, contextualRoute, tracking);
  const routedEmail = CONTACT_EMAILS[contextualRoute?.kind ?? "general"];

  return (
    <>
      <main id="main" tabIndex={-1} className="flex flex-1 flex-col">
        <section className="mx-auto w-full max-w-[760px] px-6 pb-28 pt-16 md:pt-24">
          <div
            className="mb-6 text-[11px] font-semibold uppercase"
            style={{ color: "var(--accent)", letterSpacing: "var(--tracking-eyebrow)" }}
          >
            Contact
          </div>

          {contextualRoute ? (
            <p
              className="mb-4 text-[13px] font-medium text-ink-quiet"
              style={{ letterSpacing: "0.01em" }}
            >
              {contextualRoute.eyebrow}
            </p>
          ) : null}

          <h1 className="h-section mb-8 max-w-[620px] text-balance text-ink">
            Write to a person, not a form.
          </h1>

          <p
            className="leading-[1.7] text-ink-soft"
            style={{ fontSize: "clamp(0.9375rem, 0.875rem + 0.3vw, 1.0625rem)" }}
          >
            Everything sent here is read by me, usually within a day or two. No
            form, no CRM, no autoresponder pretending to be a person.
          </p>

          <div className="mt-10 grid gap-8 md:grid-cols-2">
            <div>
              <div
                className="mb-3 font-mono text-[10.5px] font-semibold uppercase text-ink-quiet"
                style={{ letterSpacing: "var(--tracking-eyebrow)" }}
              >
                Best for
              </div>
              <ul className="space-y-2 text-[14.5px] leading-[1.6] text-ink-soft">
                <li>General company questions.</li>
                <li>Private-preview access.</li>
                <li>Thoughtful critique.</li>
                <li>Press and media enquiries.</li>
              </ul>
            </div>
            <div>
              <div
                className="mb-3 font-mono text-[10.5px] font-semibold uppercase text-ink-quiet"
                style={{ letterSpacing: "var(--tracking-eyebrow)" }}
              >
                Probably not for
              </div>
              <ul className="space-y-2 text-[14.5px] leading-[1.6] text-ink-faint">
                <li>Sales and vendor pitches.</li>
                <li>Recruiting.</li>
                <li>Anything routed through a CRM.</li>
              </ul>
            </div>
          </div>

          <p
            className="mt-12 leading-[1.7] text-ink-soft"
            style={{ fontSize: "clamp(0.9375rem, 0.875rem + 0.3vw, 1.0625rem)" }}
          >
            <a
              href={mailtoHref}
              className="text-ink underline decoration-border-soft underline-offset-[3px] transition-colors hover:text-accent hover:decoration-accent"
            >
              {routedEmail}
            </a>
          </p>

          {trackingRef ? (
            <p className="mt-5 max-w-[62ch] font-mono text-[11px] leading-[1.8] text-ink-faint">
              Ref preserved: {trackingRef}
            </p>
          ) : null}

          <section className="mt-16 border-t border-border-soft pt-10" aria-labelledby="contact-routes">
            <h2 id="contact-routes" className="text-[18px] font-semibold tracking-[-0.015em] text-ink">
              Send it to the right place.
            </h2>
            <dl className="mt-6 divide-y divide-border-soft border-y border-border-soft">
              {CONTACT_DIRECTORY.map(({ kind, label, use }) => (
                <div
                  key={kind}
                  className="grid gap-2 py-4 sm:grid-cols-[120px_minmax(0,1fr)] sm:gap-5"
                >
                  <dt className="font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-quiet">
                    {label}
                  </dt>
                  <dd className="min-w-0">
                    <a
                      href={buildMailtoHref(kind, { subject: CONTACT_SUBJECTS[kind] })}
                      className="break-words text-[14.5px] text-ink underline decoration-border-soft underline-offset-[3px] transition-colors hover:text-accent hover:decoration-accent"
                    >
                      {CONTACT_EMAILS[kind]}
                    </a>
                    <span className="mt-1 block text-[13px] leading-[1.6] text-ink-quiet">
                      {use}
                    </span>
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
