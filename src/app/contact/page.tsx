import type { Metadata } from "next";
import { SiteFooter } from "@/components/landing/site-footer";

export const metadata: Metadata = {
  title: "Contact — Signal Studio",
  description: "A real human reads everything sent to hello@signalstudio.ie.",
};

const SUBJECT_EYEBROWS: Record<string, string> = {
  weddings: "Wedding planning enquiry",
  "founding-venue": "Founding Venue Programme",
};

/**
 * /contact — one screen, three honest intents.
 *
 * Names what reaches a human, names what doesn't. No form. No CRM.
 * Same restraint as the rest of the umbrella. The one concession:
 * a known subject prefills the email so the next step is obvious
 * (a bare mailto is a soft dead-end on mobile/webmail), and any
 * inbound attribution from an outreach link rides into a quiet Ref
 * footer so the founder can attribute the reply and log it in the
 * /hq Outbound CRM. Still a person writing to a person — no form.
 */
function buildMailto(
  subject: string | undefined,
  eyebrow: string | undefined,
  attr: { source?: string; campaign?: string; touch?: string; venue?: string },
): string {
  const base = "mailto:hello@signalstudio.ie";
  if (!subject || !eyebrow) return base;

  const venueName = attr.venue && attr.venue !== "unknown" ? attr.venue : undefined;
  const subjectLine = venueName ? `${eyebrow} — ${venueName}` : eyebrow;

  const ref = [
    attr.source && `source=${attr.source}`,
    attr.campaign && `campaign=${attr.campaign}`,
    attr.touch && `touch=${attr.touch}`,
    venueName && `venue=${venueName}`,
  ]
    .filter(Boolean)
    .join(" · ");

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
      : "";

  const qs = new URLSearchParams({ subject: subjectLine });
  if (body) qs.set("body", body);
  return `${base}?${qs.toString()}`;
}

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{
    subject?: string;
    source?: string;
    campaign?: string;
    touch?: string;
    venue?: string;
  }>;
}) {
  const params = await searchParams;
  const contextualEyebrow = params.subject ? SUBJECT_EYEBROWS[params.subject] : undefined;
  const mailtoHref = buildMailto(params.subject, contextualEyebrow, {
    source: params.source,
    campaign: params.campaign,
    touch: params.touch,
    venue: params.venue,
  });

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

          {contextualEyebrow ? (
            <p
              className="mb-4 text-[13px] font-medium text-ink-quiet"
              style={{ letterSpacing: "0.01em" }}
            >
              {contextualEyebrow}
            </p>
          ) : null}

          <h1 className="h-section mb-8 max-w-[620px] text-balance text-ink">
            A real human, on the other end.
          </h1>

          <p
            className="leading-[1.7] text-ink-soft"
            style={{ fontSize: "clamp(0.9375rem, 0.875rem + 0.3vw, 1.0625rem)" }}
          >
            Everything sent to this address is read. Usually within 48 hours,
            sometimes faster, occasionally slower if I&apos;m shipping.
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
                <li>Product questions.</li>
                <li>Private-preview access.</li>
                <li>Thoughtful critique.</li>
                <li>Partnership conversations.</li>
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
                <li>Press and analyst outreach.</li>
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
              hello@signalstudio.ie
            </a>
          </p>

          <p className="mt-6 text-[13px] leading-[1.6] text-ink-faint">
            Designed and operated by Ethan McNamara. Dublin &middot; Ireland.
          </p>

          <p
            className="mt-12 font-mono text-[11px] leading-[1.8] text-ink-faint"
          >
            Set in Geist &middot; Geist Mono &middot; 2026
          </p>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
