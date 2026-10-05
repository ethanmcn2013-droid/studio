import { SHARE_CARD } from "@/lib/brand/share-card";
import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/landing/site-footer";
import { AboutShell } from "./about-shell";
import {
  formatTrackingRef,
  normalizeTrackingParams,
  type TrackingParamKey,
} from "@/lib/tracking";
import "@/components/home/home.css";
import "./about.css";

export const metadata: Metadata = {
  title: "About · Signal Studio",
  description:
    "Signal Studio builds Notes, Tasks and Timeline. Three products, one system, plain English. Why we exist, what we refuse, and who builds it.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About · Signal Studio",
    description:
      "Three products. One system. Plain English. For the other 80%.",
    url: "/about",
    type: "website",
    siteName: "Signal Studio",
    images: [SHARE_CARD],
  },
  twitter: {
    card: "summary_large_image",
    title: "About · Signal Studio",
    description:
      "Three products. One system. Plain English. For the other 80%.",
    images: [SHARE_CARD],
  },
};

const SUBJECT_EYEBROWS: Record<string, string> = {
  weddings: "Wedding planning enquiry",
  "founding-venue": "Founding Venue Programme",
  enterprise: "Enterprise enquiry",
};

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
      : subject === "enterprise"
        ? [
            "Hi Ethan,",
            "",
            "Organisation and working group:",
            "",
            "The work we want to manage:",
            "",
            "When we would like to begin:",
            "",
            "Pricing enquiry",
            ...(ref ? ["", "—", `Ref: ${ref}`] : []),
          ].join("\n")
      : ref
        ? ["Hi Ethan,", "", "", "—", `Ref: ${ref}`].join("\n")
        : "";

  const customerBody =
    subject === "enterprise"
      ? [
          "Hi Ethan,",
          "",
          "Organisation and working group:",
          "",
          "The work we want to manage:",
          "",
          "When we would like to begin:",
          "",
          "Pricing enquiry",
        ].join("\n")
      : body;
  const query = new URLSearchParams({ subject: subjectLine });
  if (customerBody) query.set("body", customerBody);
  return `${base}?${query.toString()}`;
}

/* No hrefs. The three product pages are archived until launch
   (archive/marketing-pages/), so these describe the system rather than
   linking to pages that would only bounce back to the home page. */
const PRODUCTS = [
  {
    id: "notes",
    name: "notes",
    label: "Notes",
    kind: "Capture clarity",
    desc: "Where ideas and decisions live while they take shape.",
  },
  {
    id: "tasks",
    name: "tasks",
    label: "Tasks",
    kind: "Execution clarity",
    desc: "What needs to happen next, clear enough to act on today.",
  },
  {
    id: "timeline",
    name: "timeline",
    label: "Timeline",
    kind: "Direction clarity",
    desc: "Where the work is going, written so a client can read it.",
  },
] as const;

const REFUSALS = [
  {
    term: "No setup before value.",
    why: "The first screen works before you touch a setting.",
  },
  {
    term: "No project-manager voice.",
    why: "The system says “this may need attention”, never “velocity is down”.",
  },
  {
    term: "No features because competitors have them.",
    why: "A comparison table is not a reason to build. Every addition answers to the 80% first.",
  },
  {
    term: "No “AI-powered” anything.",
    why: "If a feature works, it says so quietly. It does not wear a label.",
  },
  {
    term: "No exclamation marks.",
    why: "Anywhere. Confidence does not shout.",
  },
] as const;

const QUESTIONS = [
  "Where do ideas go while they take shape?",
  "What needs to happen next?",
  "Where is the work going?",
] as const;

const FACTS = [
  { label: "Founded", value: "2025" },
  { label: "Based in", value: "Limerick, Ireland" },
  { label: "Products", value: "Three" },
  { label: "Setup", value: "Zero" },
  { label: "Built by", value: "Ethan McNamara" },
] as const;

/** About shares the current landing page palette, header and typography. */
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
  const isEnterpriseContact = params.subject === "enterprise";

  return (
    <AboutShell>
      <main id="main" tabIndex={-1} className="about-main">
        <section className="ab-hero" id="claim" aria-labelledby="about-title">
          <div className="wrap">
            <span className="ab-label">About · Signal Studio</span>
            <h1 id="about-title" className="display">
              Most productivity tools were built for the people who build them.
            </h1>
            <p className="ab-turn">
              Signal Studio builds for <span className="ab-accent">the other 80%</span>.
            </p>
            <div className="ab-actions">
              <Link href="/#join" className="btn btn-primary">Join the waitlist</Link>
              <a href="#contact" className="btn btn-ghost">Write to Ethan <span aria-hidden="true">→</span></a>
            </div>
            <div className="ab-body">
              <p>
                Weddings, building sites, classrooms, client rosters, shop
                floors. Real work with real deadlines and real money attached.
                The people who run it never asked to become project managers.
              </p>
              <p>
                The software asks anyway. Learn the vocabulary. Configure the
                workspace. Sit the tutorial. Most people close the tab and
                keep the notebook.
              </p>
            </div>
            <dl className="ab-facts" aria-label="Company facts">
              {FACTS.map((fact) => (
                <div key={fact.label}>
                  <dt>{fact.label}</dt>
                  <dd>{fact.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <div className="ab-system" id="system">
          <div className="wrap">
            <div className="ab-band">
              <h2 id="system-title">Three products. Each owns one kind of clarity.</h2>
              <p>
                Named so you don’t have to ask what they do. A note stays
                private. The line you approve becomes a task with an owner.
                The date the owner confirms is what the timeline shows.
              </p>
            </div>
            <ul className="ab-products" aria-labelledby="system-title">
              {PRODUCTS.map((product) => (
                <li key={product.id}>
                  <div className="ab-product">
                    <span className="ab-product-wm">
                      {product.name}
                      <i aria-hidden="true" />
                    </span>
                    <span className="ab-label">{product.kind}</span>
                    <p>{product.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <section className="ab-founder" id="founder" aria-labelledby="founder-title">

          <div className="wrap">
            <div className="ab-founder-top">
              <span className="ab-label">A note from the founder</span>
              <span className="ab-label">Limerick, Ireland</span>
            </div>
            <h2 id="founder-title" className="title">Built by one person.</h2>
          </div>
          <div className="ab-ruled">
            <div className="wrap">
              <div className="ab-letter">
                <p>
                  I came to this from inside the profession. Years spent
                  managing projects, improving processes and sitting inside
                  systems that were supposed to make the work clearer.
                </p>
                <p>
                  I watched careful people build spreadsheets around official
                  trackers, because the trackers hid what they needed. I sat
                  in meetings called to explain dashboards that were meant to
                  make things clear. The workarounds were never a rejection of
                  discipline. They were people recovering enough clarity to
                  make the next decision.
                </p>
                <p>Across every project, three questions kept returning.</p>
                <ol className="ab-questions">
                  {QUESTIONS.map((question, index) => (
                    <li key={question}>
                      <span className="mono" aria-hidden="true">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      {question}
                    </li>
                  ))}
                </ol>
                <p>
                  Signal Studio is my answer. Notes holds the thinking. Tasks
                  runs the day. Timeline shows the direction. One person,
                  building slowly, refusing anything that turns the customer
                  into an operator of software.
                </p>
                <p className="ab-pull">
                  <span className="ab-pull-text">
                    The product should feel calm even when the project is not.
                  </span>
                </p>
                <div className="ab-sig" role="group" aria-label="Author">
                  <span className="ab-sig-dot" aria-hidden="true" />
                  <p>
                    <b>Ethan McNamara</b>
                    <br />
                    Founder, Signal Studio
                    <br />
                    Limerick, Ireland
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="ab-refusal-section" id="refusals">
          <div className="wrap ab-refusals">
            <div>
              <span className="ab-label">The refusals</span>
              <h2 className="section">You can measure a company by what it refuses.</h2>
            </div>
            <ul className="ab-ref-list">
              {REFUSALS.map((refusal) => (
                <li key={refusal.term}>
                  <p className="ab-ref-term">{refusal.term}</p>
                  <p className="ab-ref-why">{refusal.why}</p>
                </li>
              ))}
            </ul>
            <p className="ab-ref-foot">
              Five more run the whole suite.{" "}
              <Link href="/principles">
                Read the principles <span aria-hidden="true">→</span>
              </Link>
            </p>
            <p className="ab-creed">
              If the software becomes the work, we have{" "}
              <span className="ab-creed-fail">failed</span>.
            </p>
          </div>
        </div>

        <section
          className="ab-contact"
          id="contact"
          aria-labelledby="about-contact-heading"
        >
          <div className="wrap">
            <span className="ab-label">Contact</span>
            {contactEyebrow ? (
              <p className="ab-contact-subject">{contactEyebrow}</p>
            ) : null}
            <h2 id="about-contact-heading" className="title">
              Write to a person, not a form.
            </h2>
            <p className="lede">
              Everything sent here is read by me, usually within a day or two.
              No form, no CRM, no autoresponder pretending to be a person.
            </p>
            {isEnterpriseContact ? (
              <a href={mailtoHref} className="btn btn-primary ab-contact-cta">
                Email Ethan about Enterprise
              </a>
            ) : null}
            <div className="ab-contact-grid">
              <div>
                <span className="ab-label">
                  {isEnterpriseContact ? "Helpful to include" : "Best for"}
                </span>
                <ul>
                  {isEnterpriseContact ? (
                    <>
                      <li>Your working group.</li>
                      <li>The work you want to manage.</li>
                      <li>When you would like to begin.</li>
                    </>
                  ) : (
                    <>
                      <li>Product questions.</li>
                      <li>Private-preview access.</li>
                      <li>Thoughtful critique.</li>
                      <li>Partnership conversations.</li>
                    </>
                  )}
                </ul>
              </div>
              <div>
                <span className="ab-label">Probably not for</span>
                <ul>
                  <li>Press and analyst outreach.</li>
                  <li>Sales and vendor pitches.</li>
                  <li>Recruiting.</li>
                  <li>Anything routed through a CRM.</li>
                </ul>
              </div>
            </div>
            <p className="ab-contact-mail">
              <a href={mailtoHref}>hello@signalstudio.ie</a>
            </p>
            {trackingRef && !isEnterpriseContact ? (
              <p className="ab-contact-ref mono">Ref preserved: {trackingRef}</p>
            ) : null}
          </div>
        </section>
      </main>
      <div className="lp-footer">
        <SiteFooter />
      </div>
    </AboutShell>
  );
}