import type { Metadata } from "next";
import { SiteFooter } from "@/components/landing/site-footer";
import { MarketingDelightController } from "@/components/marketing/delight/marketing-delight-controller";
import { ReadingProgress } from "@/components/reading-progress";
import {
  formatTrackingRef,
  normalizeTrackingParams,
  type TrackingParamKey,
} from "@/lib/tracking";
import { PRODUCT_MARKETING_URLS } from "@/lib/product-urls";
import styles from "./founders-note.module.css";

export const metadata: Metadata = {
  title: "Founder’s Note · Signal Studio",
  description:
    "Why Signal Studio made project work clearer through three products: Notes, Tasks, and Timeline.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "Founder’s Note · Signal Studio",
    description:
      "Why Signal Studio made project work clearer through Notes, Tasks, and Timeline.",
    url: "/about",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Founder’s Note · Signal Studio",
    description:
      "Why Signal Studio made project work clearer through Notes, Tasks, and Timeline.",
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
      <ReadingProgress />
      <MarketingDelightController />
      <main id="main" tabIndex={-1} className={styles.main}>
        <article className={styles.article} aria-labelledby="founder-note-title">
          <header className={styles.hero}>
            <div className={styles.heroInner}>
              <div className={styles.noteLabel}>
                <span className={styles.openingDot} aria-hidden />
                <span>A note from the founder</span>
              </div>
              <h1 id="founder-note-title" className={styles.title}>
                Project management software was built by tech companies, for tech companies.
              </h1>
              <p className={styles.qualifier}>
                Project management itself is older and broader than software. But many modern
                tools inherited the language and working habits of software teams. As those
                tools spread, that vocabulary travelled with them. Sprints, epics, backlogs,
                story points, stand-ups and retrospectives can all be useful when the work calls
                for them.
              </p>
              <p className={styles.heroTurn}>The mistake was assuming every project should work that way.</p>
              <div className={styles.heroThread} aria-hidden>
                <span />
              </div>
            </div>
          </header>

          <div
            className={`${styles.storyGrid} ${styles.preReveal}`}
            data-founders-note-pre-reveal
          >
            <div className={styles.thread} aria-hidden data-founder-thread />
            <div className={styles.prose} data-founders-note-prose>
              <section
                className={`${styles.section} ${styles.openingSection}`}
                data-delight="founders-note-turn"
                data-delight-once
              >
                <span className={styles.sectionMarker} aria-hidden />
                <p className={styles.lead}>
                  A wedding may be the largest project someone ever manages. The date is fixed.
                  There is a budget to protect, suppliers to coordinate, decisions that depend
                  on earlier decisions, things that can go wrong and hundreds of details that
                  still have to add up to one day.
                </p>
                <p>
                  The couple may never call any of this project management. That does not make
                  the work less serious. A teacher plans a school year across lessons, exams and
                  deadlines. The same kind of coordination appears in a family move or a
                  community fundraiser.
                </p>
                <p>
                  Most people manage projects long before they think of themselves as project
                  managers. They already understand the work. Too often, the software asks them
                  to learn its language before it will help.
                </p>
                <p className={styles.credentials}>
                  I came to this conclusion from inside the profession. I am a certified Project
                  Management Professional and a Lean Six Sigma Black Belt. I have spent years
                  managing projects, improving processes and working with enterprise systems.
                </p>
              </section>

              <section
                className={`${styles.section} ${styles.barriersSection}`}
                data-delight="founders-note-turn"
                data-delight-once
              >
                <span className={styles.sectionMarker} aria-hidden />
                <h2 className={styles.sectionHeading}>Two barriers</h2>
                <p>
                  The words matter because they tell people whether a tool was made with work
                  like theirs in mind. If every screen assumes a method they never chose, they
                  have to translate the work before they can act on it. That is the first barrier.
                </p>
                <p>
                  In many tools, the second appears as soon as someone signs in. Select a
                  methodology. Configure a workspace. Define fields and statuses. Build views.
                  Create workflows. Set permissions. Watch tutorials. Train everyone else.
                </p>
                <p>
                  Some of those choices are necessary in the right context, and some may be
                  necessary from the start. Requiring all of them by default means the person has
                  to design the tool before the tool has helped them. By the time the system is
                  ready, setting it up has become another project.
                </p>
              </section>

              <section
                className={styles.section}
                data-delight="founders-note-turn"
                data-delight-once
              >
                <span className={styles.sectionMarker} aria-hidden />
                <h2 className={styles.sectionHeading}>The workarounds</h2>
                <p>
                  This was not theoretical for me. I watched people build spreadsheets around
                  official trackers because the tracker did not show them what they needed. I sat
                  through meetings held to explain dashboards meant to make the work clear. I saw
                  messages asking for information the system already contained. Those workarounds
                  were not a rejection of discipline. They were people trying to recover enough
                  clarity to make the next decision.
                </p>
                <p>
                  Complex work may need reporting, permissions, dependencies and risk management.
                  Dates move, suppliers change plans and priorities collide. Good project
                  discipline protects dates, money, decisions and people. The software should put
                  that complexity in order so people can see what matters now and how one decision
                  affects another, without making the discipline another layer of work.
                </p>
                <p className={styles.decision}>
                  There was no good reason to keep accepting that. The work could be difficult
                  without the tool making it harder.
                </p>
                <p>
                  When I looked across all these projects, the same three needs kept returning.
                  Where do ideas and decisions go while they are still taking shape? What needs
                  to happen next? Where is the work going?
                </p>
                <p>
                  I chose to keep them as three products because each asks for a different kind of
                  attention: room to think, a place to act and a view of direction. Keeping those
                  jobs distinct reduces what has to compete on one screen. Designing them as one
                  system keeps the project connected.
                </p>
              </section>
            </div>
          </div>

          <section
            className={styles.productReveal}
            aria-labelledby="products-title"
          >
            <div className={styles.revealInner} data-founder-reveal-content>
              <span className={styles.revealDot} aria-hidden />
              <h2 id="products-title" className={styles.revealIntro}>
                That became three products.
              </h2>
              <p className={styles.productNames}>
                Notes. Tasks. Timeline.
              </p>
              <p className={styles.namingLine}>Named so you don’t have to ask what they do.</p>
              <dl
                className={styles.productList}
                data-delight="founders-note-products"
                data-delight-once
              >
                <div className={styles.productRow} data-founders-note-product>
                  <dt>
                    <span className={styles.productMark} aria-hidden>
                      <svg viewBox="0 0 120 52" focusable="false">
                        <path d="M1 8h90M1 25h116M1 42h70" />
                        <path className={styles.markAccent} d="M77 34v16" />
                      </svg>
                    </span>
                    <a className={styles.productLink} href={PRODUCT_MARKETING_URLS.notes}>
                      Notes
                    </a>
                  </dt>
                  <dd>Keeps ideas, decisions and context together while they take shape.</dd>
                </div>
                <div className={styles.productRow} data-founders-note-product>
                  <dt>
                    <span className={styles.productMark} aria-hidden>
                      <svg viewBox="0 0 120 52" focusable="false">
                        <circle className={styles.markAccentFill} cx="5" cy="8" r="4" />
                        <circle className={styles.markAccentFill} cx="5" cy="26" r="4" />
                        <circle className={styles.markAccentFill} cx="5" cy="44" r="4" />
                        <path d="M20 8h96M20 26h74M20 44h84" />
                      </svg>
                    </span>
                    <a className={styles.productLink} href={PRODUCT_MARKETING_URLS.tasks}>
                      Tasks
                    </a>
                  </dt>
                  <dd>Makes clear what needs to happen next.</dd>
                </div>
                <div className={styles.productRow} data-founders-note-product>
                  <dt>
                    <span className={styles.productMark} aria-hidden>
                      <svg viewBox="0 0 120 52" focusable="false">
                        <path d="M2 26h116M2 19v14M40 19v14M78 19v14M118 19v14" />
                        <circle className={styles.markAccentFill} cx="78" cy="26" r="5" />
                      </svg>
                    </span>
                    <a className={styles.productLink} href={PRODUCT_MARKETING_URLS.timeline}>
                      Timeline
                    </a>
                  </dt>
                  <dd>Shows how the work fits together and where it is going.</dd>
                </div>
              </dl>
            </div>
          </section>

          <div className={styles.storyGrid}>
            <div className={styles.threadContinuation} aria-hidden data-founder-thread />
            <div className={styles.prose} data-founders-note-prose>
              <section
                className={`${styles.section} ${styles.standardSection}`}
                data-delight="founders-note-turn"
                data-delight-once
              >
                <span className={styles.sectionMarker} aria-hidden />
                <h2 className={styles.sectionHeading}>The standard</h2>
                <p>
                  Projects rarely move in a straight line. Work may begin with a date, a task or an
                  unresolved decision, and it often moves backwards when circumstances change. The
                  point is not a fixed sequence. It is to keep the thread clear wherever the work
                  begins.
                </p>
                <p>
                  To me, that thread is the product: the reason behind a decision, the person
                  responsible for the next action and what that action changes in the wider plan.
                  If someone has to copy, translate or reconstruct that context between Notes,
                  Tasks and Timeline, I have not done the job.
                </p>
                <p>
                  People should not need a tutorial to understand the first screen. I want Notes,
                  Tasks and Timeline to use words they already know, then introduce dates, owners,
                  dependencies and risks when the project needs them. Deciding what belongs in
                  front of someone now, and what can wait, is part of making the product.
                </p>
                <p className={styles.calmLine}>
                  The product should feel calm even when the project is not.
                </p>
                <p>
                  Someone should be able to begin without feeling intimidated. Plain language
                  cannot become an excuse to limit someone with years of project experience. I
                  will not always get that balance right. When the software asks for configuration
                  before it has helped, or hides the next decision behind a dashboard, I need to
                  fix it.
                </p>
                <p>
                  Signal Studio exists today, and it is still early. The products will improve as
                  I learn more about the work people manage. The standard will not change: familiar
                  language, small demands on people’s time and attention left for the project
                  itself.
                </p>
                <p className={styles.finalLine}>If the software becomes the work, we have failed.</p>
              </section>

              <div
                className={styles.signature}
                role="group"
                aria-label="Author"
                data-delight="about-founder"
                data-delight-once
                data-founders-note-signature
              >
                <div className={styles.signatureRule} aria-hidden data-founder-rule />
                <div className={styles.signatureBody}>
                  <span className={styles.signatureDot} aria-hidden data-founder-dot />
                  <div className={styles.identity} data-founder-identity>
                    <p className={styles.founderName}>Ethan McNamara</p>
                    <p>Founder, Signal Studio</p>
                    <p>Limerick, Ireland</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </article>

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
