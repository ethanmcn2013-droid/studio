import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/landing/site-footer";
import { ReadingProgress } from "@/components/reading-progress";
import { MarketingDelightController } from "@/components/marketing/delight/marketing-delight-controller";
import {
  formatTrackingRef,
  normalizeTrackingParams,
  type TrackingParamKey,
} from "@/lib/tracking";

export const metadata: Metadata = {
  title: "About · Signal Studio",
  description: "Signal Studio builds calm work software for people outside tech. Notes, Tasks and Timeline form one clear system. Write to a person at hello@signalstudio.ie.",
};

function waitlistHref(product: string): string {
  return `/waitlist?source=about&campaign=pre_access_waitlist&product=${product}&artifact=about_products_${product}&touch=site`;
}

const PRODUCTS = [
  ["01", "Notes", "Capture", "notes"],
  ["02", "Tasks", "Execute", "tasks"],
  ["03", "Timeline", "Direct", "timeline"],
] as const;

const SUBJECT_EYEBROWS: Record<string, string> = {
  weddings: "Wedding planning enquiry",
  "founding-venue": "Founding Venue Programme",
};

/**
 * The contact fold, anchored at #contact.
 *
 * Decision D5 of the 2026-08-12 estate consolidation: /contact folds into
 * /about and the standalone page 308s here. The machinery came with it
 * whole, because the Founding 25 conversion path runs through it. A known
 * subject prefills the email so the next step is obvious (a bare mailto is
 * a soft dead-end on mobile and webmail), and any inbound attribution from
 * an outreach link rides into a quiet Ref footer so the founder can
 * attribute the reply and log it in the /hq Outbound CRM.
 *
 * Still a person writing to a person. No form. No CRM.
 */
function buildMailto(
  subject: string | undefined,
  eyebrow: string | undefined,
  attr: Partial<Record<TrackingParamKey, string | undefined>>,
): string {
  const base = "mailto:hello@signalstudio.ie";
  const ref = formatTrackingRef(attr);
  if (!subject && !ref) return base;

  const venueName = attr.venue && attr.venue !== "unknown" ? attr.venue : undefined;
  const subjectLabel = eyebrow ?? "Signal Studio enquiry";
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

  const qs = new URLSearchParams({ subject: subjectLine });
  if (body) qs.set("body", body);
  return `${base}?${qs.toString()}`;
}

export default async function AboutPage({
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
  const contactEyebrow = params.subject ? SUBJECT_EYEBROWS[params.subject] : undefined;
  const tracking = normalizeTrackingParams({
    source: params.source,
    campaign: params.campaign,
    audience: params.audience,
    artifact: params.artifact,
    touch: params.touch,
    venue: params.venue,
  });
  const trackingRef = formatTrackingRef(tracking);
  const mailtoHref = buildMailto(params.subject, contactEyebrow, tracking);

  return (
    <>
      <ReadingProgress />
      <main id="main" tabIndex={-1} className="flex flex-1 flex-col">
        <MarketingDelightController />

        <section className="mx-auto w-full max-w-[980px] px-6 pb-20 pt-16 md:pt-24">
          <p className="text-[11px] font-semibold uppercase tracking-[0.13em] text-accent">About</p>
          <h1 className="h-section mt-6 max-w-[720px] text-balance text-ink">Built for people who run the work.</h1>

          <nav aria-label="About next steps" className="mt-10 grid border-y border-border-soft sm:grid-cols-2">
            <Link href="/#system" className="group grid min-h-[78px] grid-cols-[2rem_1fr_auto] items-center gap-3 border-b border-border-soft px-1 text-ink no-underline transition-colors hover:bg-[var(--paper-soft)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent sm:border-b-0 sm:border-r sm:px-4">
              <span className="font-mono text-[11px] text-accent">01</span>
              <span className="text-[14px] font-semibold">See the system at work</span>
              <span aria-hidden className="text-[18px] transition-transform group-hover:translate-x-1">→</span>
            </Link>
            <Link href="/waitlist?source=about&campaign=pre_access_waitlist&artifact=about_primary&touch=site" className="group grid min-h-[78px] grid-cols-[2rem_1fr_auto] items-center gap-3 px-1 text-ink no-underline transition-colors hover:bg-[var(--paper-soft)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent sm:px-4">
              <span className="font-mono text-[11px] text-accent">02</span>
              <span className="text-[14px] font-semibold">Join the waitlist</span>
              <span aria-hidden className="text-[18px] transition-transform group-hover:translate-x-1">→</span>
            </Link>
          </nav>

          <div className="mt-14 grid gap-14 md:grid-cols-[1.2fr_0.8fr] md:gap-20">
            <div className="max-w-[58ch] space-y-5 text-[clamp(.98rem,.92rem+.25vw,1.08rem)] leading-[1.75] text-ink-soft">
              <p>Signal Studio makes work software for people who don&rsquo;t work in software. Wedding planners. Tradespeople. Students. Small businesses. People with real deadlines who shouldn&rsquo;t have to learn project management to meet them.</p>
              <p>Three products, one system. Notes catches ideas before they get lost. Tasks keeps the work moving. Timeline lets you publish a reviewed view of the plan. The handoff stays legible from the original thought to the published direction.</p>
              <p>No sprints. No dashboards to babysit. Start with the words you already use for the work. If software needs a training course, it has already failed you.</p>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-faint">The suite</p>
              <ol className="mt-3 list-none p-0">
                {PRODUCTS.map(([number, name, role, product]) => (
                  <li key={product}>
                    <a href={waitlistHref(product)} className="about-product-link group grid min-h-[68px] grid-cols-[2rem_1fr_auto] items-center gap-3 border-b border-border-soft no-underline">
                      <span className="font-mono text-[11px] text-ink-faint">{number}</span>
                      <span className="text-[14px] font-medium text-ink">{name}<small className="ml-2 font-normal text-ink-faint">{role}</small></span>
                      <span aria-hidden className="about-product-arrow text-ink-faint">→</span>
                    </a>
                  </li>
                ))}
              </ol>
              <p className="mt-9 text-[12.5px] leading-6 text-ink-faint">Built slowly in Limerick. Quiet by default, precise when it matters.</p>
            </div>
          </div>
        </section>

        <section className="border-y border-border-soft bg-[var(--paper-soft)]" aria-labelledby="about-evidence-heading">
          <div className="mx-auto w-full max-w-[980px] px-6 py-14 md:py-20">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-accent">The operating proof</p>
            <h2 id="about-evidence-heading" className="mt-3 max-w-[18ch] text-balance text-[clamp(1.8rem,1.5rem+1.1vw,2.8rem)] font-semibold tracking-[-0.045em] text-ink">The boundary is part of the product.</h2>
            <div className="mt-9 grid border-y border-border-soft sm:grid-cols-3">
              {[
                ["01", "Private capture", "A note stays private until you choose the exact wording that becomes a task."],
                ["02", "Traceable handoff", "Notes and Tasks keep reciprocal provenance, so the source and action never drift apart."],
                ["03", "Reviewed sharing", "Timeline publishes a frozen link-only copy after you review what viewers can see."],
              ].map(([number, title, body], index) => (
                <article className={`py-6 sm:px-5 ${index < 2 ? "border-b border-border-soft sm:border-b-0 sm:border-r" : ""}`} key={title}>
                  <span className="font-mono text-[11px] text-accent">{number}</span>
                  <h3 className="mt-7 text-[15px] font-semibold text-ink">{title}</h3>
                  <p className="mt-2 text-[13px] leading-6 text-ink-soft">{body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-[1120px] px-6 py-24 md:py-32" data-delight="about-founder" data-delight-once aria-labelledby="founder-note-heading">
          <div className="border-t-2 border-ink pt-6">
            <div className="grid gap-12 md:grid-cols-[0.72fr_1.28fr] md:gap-20">
              <aside className="about-founder-signature md:sticky md:top-24 md:self-start">
                <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-accent">Founder note · 01</p>
                <blockquote className="mt-8 max-w-[11ch] text-balance text-[clamp(2rem,1.5rem+2vw,3.8rem)] font-semibold leading-[0.98] tracking-[-0.06em] text-ink">
                  “Real work should not need translating.”
                </blockquote>
                <div className="mt-10 flex items-center gap-3 border-t border-border-soft pt-5">
                  <span aria-hidden className="about-founder-dot h-2 w-2 rounded-full bg-accent" />
                  <div className="about-founder-identity">
                    <p className="text-[14px] font-medium text-ink">Ethan McNamara</p>
                    <p className="text-[12px] text-ink-faint">Founder, Signal Studio · Limerick</p>
                  </div>
                </div>
              </aside>

              <article className="max-w-[62ch]">
                <h2 id="founder-note-heading" className="text-balance text-[clamp(1.7rem,1.4rem+1vw,2.5rem)] font-semibold tracking-[-0.04em] text-ink">Built for the work people actually manage.</h2>
                <p className="mt-8 text-[clamp(1.08rem,1rem+.35vw,1.25rem)] leading-[1.65] text-ink">Project management software was built by tech companies, for tech companies.</p>
                <div className="mt-6 space-y-5 text-[15px] leading-7 text-ink-soft">
                  <p>That explains why so many tools arrive with a vocabulary of their own: sprints, epics, backlogs, tickets, workflows and dependencies. Useful words in the right rooms. Heavy everywhere else.</p>
                  <p>Most people begin with something that needs to happen: a wedding to plan, a college year to keep on top of, a venue team trying to stay aligned, a small business keeping customers and deadlines moving.</p>
                  <p>You open a tool looking for clarity, then spend your energy translating real work into someone else&rsquo;s system. We built Signal Studio to remove that translation layer.</p>
                </div>
                <div className="my-9 grid grid-cols-[auto_1fr] items-center gap-4" aria-hidden>
                  <span className="h-2 w-2 rounded-full bg-accent" />
                  <span className="h-px bg-border-soft" />
                </div>
                <p className="text-[17px] leading-8 text-ink">Notes are where the work starts. Tasks are what needs doing. Timeline shows what is next. Three products, one system, built so people can organise the work in front of them without learning a new language first.</p>
              </article>
            </div>
          </div>
        </section>

        <section
          id="contact"
          className="scroll-mt-[72px] border-t border-border-soft bg-[var(--paper-soft)]"
          aria-labelledby="about-contact-heading"
        >
          <div className="mx-auto w-full max-w-[980px] px-6 py-14 md:py-20">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-accent">Contact</p>

            {contactEyebrow ? (
              <p className="mt-3 text-[13px] font-medium text-ink-quiet" style={{ letterSpacing: "0.01em" }}>
                {contactEyebrow}
              </p>
            ) : null}

            <h2 id="about-contact-heading" className="mt-3 max-w-[18ch] text-balance text-[clamp(1.8rem,1.5rem+1.1vw,2.8rem)] font-semibold tracking-[-0.045em] text-ink">Write to a person, not a form.</h2>

            <p className="mt-6 max-w-[58ch] text-[clamp(.98rem,.92rem+.25vw,1.08rem)] leading-[1.75] text-ink-soft">Everything sent here is read by me, usually within a day or two. No form, no CRM, no autoresponder pretending to be a person.</p>

            <div className="mt-9 grid border-y border-border-soft sm:grid-cols-2">
              <div className="border-b border-border-soft py-6 sm:border-b-0 sm:border-r sm:pr-5">
                <div className="mb-3 font-mono text-[10.5px] font-semibold uppercase text-ink-quiet" style={{ letterSpacing: "var(--tracking-eyebrow)" }}>
                  Best for
                </div>
                <ul className="space-y-2 text-[14.5px] leading-[1.6] text-ink-soft">
                  <li>Product questions.</li>
                  <li>Private-preview access.</li>
                  <li>Thoughtful critique.</li>
                  <li>Partnership conversations.</li>
                </ul>
              </div>
              <div className="py-6 sm:pl-5">
                <div className="mb-3 font-mono text-[10.5px] font-semibold uppercase text-ink-quiet" style={{ letterSpacing: "var(--tracking-eyebrow)" }}>
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

            <p className="mt-10 text-[clamp(.98rem,.92rem+.25vw,1.08rem)] leading-[1.75] text-ink-soft">
              <a
                href={mailtoHref}
                className="text-ink underline decoration-border-soft underline-offset-[3px] transition-colors hover:text-accent hover:decoration-accent"
              >
                hello@signalstudio.ie
              </a>
            </p>

            {trackingRef ? (
              <p className="mt-5 max-w-[62ch] font-mono text-[11px] leading-[1.8] text-ink-faint">
                Ref preserved: {trackingRef}
              </p>
            ) : null}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
