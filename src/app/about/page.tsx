import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Link from "next/link";
import { SiteFooter } from "@/components/landing/site-footer";
import { MarketingDelightController } from "@/components/marketing/delight/marketing-delight-controller";
import { ReadingProgress } from "@/components/reading-progress";
import { APP_ORIGIN } from "@/lib/product-urls";
import {
  formatTrackingRef,
  normalizeTrackingParams,
  type TrackingParamKey,
} from "@/lib/tracking";
import { TranslationSection } from "./translation";
import styles from "./about.module.css";

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
  },
  twitter: {
    card: "summary_large_image",
    title: "About · Signal Studio",
    description:
      "Three products. One system. Plain English. For the other 80%.",
  },
};

const rd = (ms: number) => ({ "--rd": `${ms}ms` }) as CSSProperties;

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

const PRODUCTS = [
  {
    id: "notes",
    name: "notes",
    mark: ".",
    gesture: styles.gNotes,
    kind: "Capture clarity",
    desc: "Where ideas and decisions live while they take shape.",
    href: "/notes",
  },
  {
    id: "tasks",
    name: "tasks",
    mark: "·",
    gesture: styles.gTasks,
    kind: "Execution clarity",
    desc: "What needs to happen next, clear enough to act on today.",
    href: "/tasks",
  },
  {
    id: "timeline",
    name: "timeline",
    mark: "·",
    gesture: styles.gTimeline,
    kind: "Direction clarity",
    desc: "Where the work is going, written so a client can read it.",
    href: "/timeline",
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

const FACTS: {
  label: string;
  value: string;
  href?: string;
  links?: { label: string; href: string }[];
}[] = [
  { label: "Founded", value: "2025" },
  { label: "Based in", value: "Limerick, Ireland" },
  {
    label: "Products",
    value: "",
    links: [
      { label: "Notes", href: "/notes" },
      { label: "Tasks", href: "/tasks" },
      { label: "Timeline", href: "/timeline" },
    ],
  },
  { label: "Built by", value: "Ethan McNamara" },
  { label: "Voice", value: "Plain English, no exceptions" },
];

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
    <>
      <noscript>
        <style>{`.about-r{opacity:1!important;transform:none!important}.titleInner,.closingInner{transform:none!important}.closingDot{transform:scale(1)!important}.creedFail::after,.sigRule::after{transform:scaleX(1)!important}`}</style>
      </noscript>
      <ReadingProgress />
      <MarketingDelightController />
      <main id="main" tabIndex={-1} className={styles.main}>
        <div className={styles.canvasDark}>
          <div className={styles.frame}>
            <article className={styles.content}>
              <header
                id="claim"
                className={`${styles.hero} ${styles.rv}`}
                data-delight-once
              >
                <div className={`${styles.heroTop} about-r`} style={rd(0)}>
                  <p className={styles.heroEyebrow}>
                    <span className={styles.heroDot} aria-hidden />
                    <span className={styles.eyebrowNum}>01</span>
                    About · Signal Studio
                  </p>
                </div>
                <h1 className={styles.title}>
                  <span className={styles.titleMask}>
                    <span className={styles.titleInner}>
                      Most productivity tools were built for the people who
                      build them.
                    </span>
                  </span>
                </h1>
                <p className={`${styles.turn} about-r`} style={rd(430)}>
                  Signal Studio builds for{" "}
                  <span className={styles.turnEm}>the other 80%</span>.
                </p>
                <div className={`${styles.heroBody} about-r`} style={rd(560)}>
                  <p>
                    Weddings, building sites, classrooms, client rosters, shop
                    floors. Real work with real deadlines and real money
                    attached. The people who run it never asked to become
                    project managers.
                  </p>
                  <p>
                    The software asks anyway. Learn the vocabulary. Configure
                    the workspace. Sit the tutorial. Most people close the tab
                    and keep the notebook.
                  </p>
                </div>
                <div className={`${styles.heroFacts} about-r`} style={rd(700)}>
                  <span className={styles.factInline}>
                    EST. <b>2025</b>
                  </span>
                  <span className={styles.factInline}>
                    LIMERICK <b>IRELAND</b>
                  </span>
                  <span className={styles.factInline}>
                    SHIPPED <b>3 PRODUCTS</b>
                  </span>
                  <span className={styles.factInline}>
                    SETUP <b>ZERO</b>
                  </span>
                </div>
                <div className={styles.heroScroll} aria-hidden>
                  <span>SCROLL</span>
                </div>
              </header>

              <section id="translation" className={styles.section}>
                <div className={styles.rv} data-delight-once>
                  <div className={`${styles.eyebrow} about-r`} style={rd(0)}>
                    <span className={styles.eyebrowNum}>02</span>
                    <span className={styles.eyebrowName}>The translation</span>
                  </div>
                  <h2 className={`${styles.h2} about-r`} style={rd(90)}>
                    The industry has a dialect.
                  </h2>
                  <p className={`${styles.lead} about-r`} style={rd(190)}>
                    Same project. Two languages. Only one of them asks you to
                    become a project manager first.
                  </p>
                </div>
                <div className={styles.rv} data-delight-once>
                  <div className="about-r">
                    <TranslationSection />
                  </div>
                  <p className={`${styles.tCaption} about-r`} style={rd(260)}>
                    Real phrases from real tools. Toggle between the two.
                  </p>
                </div>
              </section>
            </article>
          </div>
        </div>

        <div className={styles.canvasLight}>
          <div className={styles.frame}>
            <div className={styles.content}>
              <section id="system" className={`${styles.section} ${styles.lightStart}`}>
                <div className={styles.rv} data-delight-once>
                  <div className={`${styles.eyebrow} about-r`} style={rd(0)}>
                    <span className={styles.eyebrowNum}>03</span>
                    <span className={styles.eyebrowName}>The system</span>
                  </div>
                  <h2 className={`${styles.h2} about-r`} style={rd(90)}>
                    Three products. Each owns one kind of clarity.
                  </h2>
                </div>
                <div className={`${styles.rv} about-r`} style={rd(120)} data-delight-once>
                  <ul className={styles.sysList}>
                  {PRODUCTS.map((product) => (
                    <li key={product.id} className={styles.sysRow}>
                      <Link href={product.href} className={styles.sysName}>
                        {product.name}
                        <span
                          className={`${styles.dotChar} ${product.gesture}`}
                          aria-hidden
                        >
                          {product.mark}
                        </span>
                      </Link>
                      <span className={styles.sysKind}>{product.kind}</span>
                      <p className={styles.sysDesc}>{product.desc}</p>
                      <span className={styles.sysExit} aria-hidden>
                        OPEN ↗
                      </span>
                      <Link
                        href={product.href}
                        className={styles.sysHit}
                        tabIndex={-1}
                        aria-hidden="true"
                      />
                    </li>
                  ))}
                </ul>
                </div>
                <div className={`${styles.rv} about-r`} style={rd(120)} data-delight-once>
                  <p className={styles.sysClose}>
                    Named so you don’t have to ask what they do.
                  </p>
                </div>
              </section>

              <section id="founder" className={styles.section}>
                <div className={styles.rv} data-delight-once>
                  <div className={`${styles.eyebrow} about-r`} style={rd(0)}>
                    <span className={styles.eyebrowNum}>04</span>
                    <span className={styles.eyebrowName}>The founder</span>
                  </div>
                  <h2 className={`${styles.h2} about-r`} style={rd(90)}>
                    Built by one person.
                  </h2>
                </div>
                <div className={`${styles.rv} about-r`} style={rd(0)} data-delight-once>
                  <div className={styles.letter}>
                    <p>
                      I came to this from inside the profession. Years spent
                      managing projects, improving processes and sitting inside
                      systems that were supposed to make the work clearer.
                    </p>
                    <p>
                      I watched careful people build spreadsheets around official
                      trackers, because the trackers hid what they needed. I sat
                      in meetings called to explain dashboards that were meant
                      to make things clear. The workarounds were never a
                      rejection of discipline. They were people recovering
                      enough clarity to make the next decision.
                    </p>
                    <p>Across every project, three questions kept returning.</p>
                  </div>
                </div>
                <div className={`${styles.rv} about-r`} style={rd(60)} data-delight-once>
                  <div className={styles.qLedger}>
                    {QUESTIONS.map((question, index) => (
                      <div key={question} className={styles.qRow}>
                        <span className={styles.qNum}>
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <p className={styles.qText}>{question}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className={`${styles.rv} about-r`} style={rd(60)} data-delight-once>
                  <div className={styles.letter}>
                    <p>
                      Signal Studio is my answer. Notes holds the thinking.
                      Tasks runs the day. Timeline shows the direction. One
                      person, building slowly, refusing anything that turns the
                      customer into an operator of software.
                    </p>
                  </div>
                </div>
                <blockquote
                  className={`${styles.pullquote} ${styles.rv}`}
                  data-delight-once
                >
                  <span className="about-r">
                    The product should feel calm even when the project is not.
                  </span>
                </blockquote>
                <div
                  className={styles.signature}
                  role="group"
                  aria-label="Author"
                  data-delight-once
                >
                  <div className={styles.sigRule} aria-hidden />
                  <div className={styles.sigBody}>
                    <span className={styles.sigDot} aria-hidden />
                    <div className={styles.identity}>
                      <p className={styles.founderName}>Ethan McNamara</p>
                      <p>Founder, Signal Studio</p>
                      <p>Limerick, Ireland</p>
                    </div>
                  </div>
                </div>
              </section>

              <section id="refusals" className={styles.section}>
                <div className={styles.rv} data-delight-once>
                  <div className={`${styles.eyebrow} about-r`} style={rd(0)}>
                    <span className={styles.eyebrowNum}>05</span>
                    <span className={styles.eyebrowName}>The refusals</span>
                  </div>
                  <h2 className={`${styles.h2} about-r`} style={rd(90)}>
                    You can measure a company by what it refuses.
                  </h2>
                </div>
                <div className={`${styles.rv} about-r`} style={rd(0)} data-delight-once>
                  <ul className={styles.refList}>
                    {REFUSALS.map((refusal) => (
                      <li key={refusal.term} className={styles.refItem}>
                        <p className={styles.refTerm}>{refusal.term}</p>
                        <p className={styles.refWhy}>{refusal.why}</p>
                      </li>
                    ))}
                  </ul>
                  <div className={styles.refFoot}>
                    <span>Five more run the whole suite.</span>
                    <Link href="/principles" className={styles.endlink}>
                      Read the principles
                    </Link>
                  </div>
                </div>
                <p className={`${styles.creed} ${styles.rv}`} data-delight-once>
                  <span className="about-r">
                    If the software becomes the work, we have{" "}
                    <span className={styles.creedFail}>failed</span>.
                  </span>
                </p>
              </section>
            </div>
          </div>
        </div>

        <div className={styles.canvasDark}>
          <div className={styles.frame}>
            <article className={`${styles.finale} ${styles.content}`}>
              <section id="record" className={styles.section}>
                <div className={styles.rv} data-delight-once>
                  <div className={`${styles.eyebrow} about-r`} style={rd(0)}>
                    <span className={styles.eyebrowNum}>06</span>
                    <span className={styles.eyebrowName}>The record</span>
                  </div>
                  <h2 className={`${styles.h2} about-r`} style={rd(90)}>
                    Small, on purpose.
                  </h2>
                </div>
                <div className={`${styles.rv} about-r`} style={rd(0)} data-delight-once>
                  <dl className={styles.factsGrid}>
                  {FACTS.map((fact) => (
                    <div key={fact.label} className={styles.fact}>
                      <dt className={styles.factLabel}>{fact.label}</dt>
                      <dd className={styles.factValue}>
                        {fact.links ? (
                          fact.links.map((link, index) => (
                            <span key={link.href}>
                              {index > 0 && (
                                <span className={styles.factSep}> · </span>
                              )}
                              <Link href={link.href} className={styles.factLink}>
                                {link.label}
                              </Link>
                            </span>
                          ))
                        ) : fact.href ? (
                          fact.href.startsWith("mailto:") ? (
                            <a href={fact.href} className={styles.factLink}>
                              {fact.value}
                            </a>
                          ) : (
                            <Link href={fact.href} className={styles.factLink}>
                              {fact.value}
                            </Link>
                          )
                        ) : (
                          fact.value
                        )}
                      </dd>
                    </div>
                  ))}
                  <div className={styles.fact}>
                    <dt className={styles.factLabel}>
                      <span className={styles.factHead}>
                        <span className={styles.swatch} aria-hidden />
                        Accent
                      </span>
                    </dt>
                    <dd className={styles.factValue}>One colour. Indigo.</dd>
                  </div>
                  </dl>
                </div>
                <div className={`${styles.rv} about-r`} style={rd(0)} data-delight-once>
                  <div className={styles.recordBody}>
                  <p>
                    Signal Studio is still early. Three products are live today,
                    and they improve as I learn more about the work people
                    manage. The standard will not change. Plain words, small
                    demands on attention, and software that never becomes the
                    work.
                  </p>
                  <p>
                    Everything shipped is written down in public, in plain
                    English. The record is the receipt.
                  </p>
                  </div>
                </div>
                <div className={`${styles.rv} about-r`} style={rd(0)} data-delight-once>
                  <div className={styles.endlinks}>
                  <a
                    href={APP_ORIGIN}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.endlink}
                  >
                    Open Signal Studio
                    <span className={styles.endlinkGlyph} aria-hidden>↗</span>
                  </a>
                  <Link href="/dispatch" className={styles.endlink}>
                    Read the record
                  </Link>
                  <a
                    href="mailto:hello@signalstudio.ie"
                    className={styles.endlink}
                  >
                    Say hello
                    <span className={styles.endlinkGlyph} aria-hidden>↗</span>
                  </a>
                </div>
                </div>
                <p className={`${styles.closingLine} ${styles.rv}`} data-delight-once>
                  <span className={styles.closingMask}>
                    <span className={styles.closingInner}>
                      Clarity, not configuration
                      <span className={styles.closingDot} aria-hidden />
                      <span className="sr-only">.</span>
                    </span>
                  </span>
                </p>
                <div className={`${styles.signoff} ${styles.rv}`} data-delight-once>
                  <span className="about-r">
                    <span>SIGNAL STUDIO · LIMERICK, IRELAND</span>
                    <span className={styles.signoffRight}>
                      <a href="mailto:hello@signalstudio.ie" className={styles.signoffLink}>
                        hello@signalstudio.ie
                      </a>
                      <a href="#claim" className={styles.signoffLink}>
                        TOP ↑
                      </a>
                    </span>
                  </span>
                </div>
              </section>
            </article>
          </div>
        </div>

        <section
          id="contact"
          className="scroll-mt-4 border-t border-border-soft bg-[var(--paper-soft)]"
          aria-labelledby="about-contact-heading"
        >
          <div className="mx-auto w-full max-w-[980px] px-6 py-14 md:py-20">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-accent">
              Contact
            </p>
            {contactEyebrow ? (
              <p
                className="mt-3 text-[13px] font-medium text-ink-quiet"
                style={{ letterSpacing: "0.01em" }}
              >
                {contactEyebrow}
              </p>
            ) : null}
            <h2
              id="about-contact-heading"
              className="mt-3 max-w-[18ch] text-balance text-[clamp(1.8rem,1.5rem+1.1vw,2.8rem)] font-semibold tracking-[-0.045em] text-ink"
            >
              Write to a person, not a form.
            </h2>
            <p className="mt-6 max-w-[58ch] text-[clamp(.98rem,.92rem+.25vw,1.08rem)] leading-[1.75] text-ink-soft">
              Everything sent here is read by me, usually within a day or two. No form, no CRM,
              no autoresponder pretending to be a person.
            </p>
            {isEnterpriseContact ? (
              <a
                href={mailtoHref}
                className="mt-8 inline-flex min-h-12 items-center justify-center rounded-md bg-accent px-5 text-[14px] font-semibold text-white no-underline transition-colors hover:bg-[var(--accent-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                Email Ethan about Enterprise
              </a>
            ) : null}
            <div className="mt-9 grid border-y border-border-soft sm:grid-cols-2">
              <div className="border-b border-border-soft py-6 sm:border-b-0 sm:border-r sm:pr-5">
                <div
                  className="mb-3 font-mono text-[10.5px] font-semibold uppercase text-ink-quiet"
                  style={{ letterSpacing: "var(--tracking-eyebrow)" }}
                >
                  {isEnterpriseContact ? "Helpful to include" : "Best for"}
                </div>
                <ul className="space-y-2 text-[14.5px] leading-[1.6] text-ink-soft">
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
              <div className="py-6 sm:pl-5">
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
            <p className="mt-10 text-[clamp(.98rem,.92rem+.25vw,1.08rem)] leading-[1.75] text-ink-soft">
              <a
                href={mailtoHref}
                className="inline-flex min-h-11 items-center text-ink underline decoration-border-soft underline-offset-[3px] transition-colors hover:text-accent hover:decoration-accent"
              >
                hello@signalstudio.ie
              </a>
            </p>
            {trackingRef && !isEnterpriseContact ? (
              <p className="mt-5 max-w-[62ch] font-mono text-[11px] leading-[1.8] text-ink-faint">
                Ref preserved: {trackingRef}
              </p>
            ) : null}
          </div>
        </section>
      </main>
      <SiteFooter compact />
    </>
  );
}
