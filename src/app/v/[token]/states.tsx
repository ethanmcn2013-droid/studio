import {
  CLICK_DISCLOSURE,
  COMMERCIAL_SUMMARY_ROWS,
  COUPLE_TERM_SENTENCE,
  ENTITLEMENT_SENTENCE,
  FOUNDING_MEANING,
  HOLD_SENTENCE,
  KEEPSAKE_VENUE_FACING,
  OFFER_PARAGRAPH,
  PRICE_FORMS,
  PRIVACY_BLOCK,
  REPLACED_PAGE,
  SCALE_SENTENCE,
  STANDARD_RATE_SENTENCE,
  SURVIVAL_SENTENCE,
  TEAM_ASK_SENTENCE,
  VENUE_CONTACT_EMAIL,
  whoseItIsSentence,
} from "@/lib/venue-invitation/copy";
import type { VenueInvitationLink } from "@/lib/venue-invitation/links";

/**
 * The two states of `/v/<token>`, plus the replacement page.
 *
 * `E13.16-link-and-destination-contract.md` section 3: one page, two states on
 * one URL. Invitation first, proposal after a conversation. The venue never
 * gets a second link.
 *
 * Every visible sentence comes from `@/lib/venue-invitation/copy`, which quotes
 * the approved sources. Nothing is reworded at the render site.
 */

const PAGE = "mx-auto w-full max-w-[720px] px-6";

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="text-[11px] font-semibold uppercase text-ink-quiet"
      style={{ letterSpacing: "var(--tracking-eyebrow)" }}
    >
      {children}
    </p>
  );
}

function Block({
  heading,
  children,
}: {
  heading: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-border-soft py-7">
      <h2 className="text-[15px] font-semibold tracking-[-0.01em] text-ink">
        {heading}
      </h2>
      <div className="mt-3 space-y-3 text-[16px] leading-[1.65] text-ink-soft">
        {children}
      </div>
    </section>
  );
}

/**
 * The privacy block, all three parts. A surface that takes it takes all three
 * (E09.11 section 5.1a, D-032 R4). The launch-scope part is not optional and
 * is not paraphrased.
 */
function PrivacyBlock() {
  return (
    <section className="border-t border-border-soft py-7">
      <div className="grid gap-7 sm:grid-cols-2">
        <div>
          <h2 className="text-[15px] font-semibold tracking-[-0.01em] text-ink">
            {PRIVACY_BLOCK.seeHeading}
          </h2>
          <p className="mt-3 text-[16px] leading-[1.65] text-ink-soft">
            {PRIVACY_BLOCK.see}
          </p>
        </div>
        <div>
          <h2 className="text-[15px] font-semibold tracking-[-0.01em] text-ink">
            {PRIVACY_BLOCK.neverHeading}
          </h2>
          <p className="mt-3 text-[16px] leading-[1.65] text-ink-soft">
            {PRIVACY_BLOCK.never}
          </p>
        </div>
      </div>
      <div className="mt-7 border-t border-border-soft pt-6">
        <h3 className="text-[15px] font-semibold tracking-[-0.01em] text-ink">
          {PRIVACY_BLOCK.launchHeading}
        </h3>
        <p className="mt-3 text-[16px] leading-[1.65] text-ink-soft">
          {PRIVACY_BLOCK.launch}
        </p>
      </div>
    </section>
  );
}

/**
 * The film, when there is one.
 *
 * `filmUrl` is null on all twenty-five links today (E13.16 section 11), and the
 * offer stands in text without it: "The page must work with video blocked by a
 * corporate policy. The film is not the destination." No autoplay, a poster
 * frame, click to play, and captions as a `.vtt` track because most first views
 * are muted.
 */
function Film({
  film,
}: {
  film: NonNullable<VenueInvitationLink["film"]>;
}) {
  return (
    <div className="mt-9 overflow-hidden rounded-[10px] border border-border-soft bg-bg-elev">
      <video
        className="block h-auto w-full"
        controls
        preload="none"
        playsInline
        poster={film.posterUrl}
      >
        <source src={film.url} type="video/mp4" />
        <track
          kind="captions"
          src={film.captionsUrl}
          srcLang="en"
          label="English"
          default
        />
      </video>
    </div>
  );
}

function Disclosure() {
  return (
    <p className="mt-10 border-t border-border-soft pt-6 text-[13px] leading-[1.6] text-ink-quiet">
      {CLICK_DISCLOSURE}
    </p>
  );
}

/**
 * A signature, not a second call to action. E09.11 section 8: one ask per
 * surface, and a second is a defect rather than an option. The address is set
 * as text so the only actionable thing on the page is the one ask above it.
 */
function Signature() {
  return (
    <p className="mt-8 text-[14px] leading-[1.6] text-ink-soft">
      Ethan McNamara
      <br />
      Signal Studio
      <br />
      {VENUE_CONTACT_EMAIL}
    </p>
  );
}

/* ── State one · the invitation ───────────────────────────────────────── */

export function InvitationState({ link }: { link: VenueInvitationLink }) {
  return (
    <main id="main" tabIndex={-1} className="flex flex-1 flex-col py-14 md:py-20">
      <div className={PAGE}>
        <Eyebrow>Venue Edition · prepared for {link.venueName}</Eyebrow>
        <h1 className="mt-5 text-[clamp(1.75rem,1.3rem+2vw,3rem)] font-semibold leading-[1.05] tracking-[-0.035em] text-ink">
          Stand behind every couple who plans with you.
        </h1>
        <p className="mt-6 text-[17px] leading-[1.65] text-ink-soft">
          {OFFER_PARAGRAPH}
        </p>

        {link.film ? <Film film={link.film} /> : null}

        <div className="mt-10">
          <Block heading="What your couples get">
            <p>{ENTITLEMENT_SENTENCE}</p>
            <p>{COUPLE_TERM_SENTENCE}</p>
          </Block>

          <Block heading="Whose it is">
            <p>{whoseItIsSentence(link.venueName)}</p>
          </Block>

          <PrivacyBlock />

          <Block heading="What it asks of your team">
            <p>{TEAM_ASK_SENTENCE}</p>
          </Block>

          <Block heading="What it costs">
            <p>{PRICE_FORMS.founding}</p>
            <p>
              {STANDARD_RATE_SENTENCE} {PRICE_FORMS.difference}{" "}
              {PRICE_FORMS.lock} {PRICE_FORMS.property}
            </p>
            <p>{SCALE_SENTENCE}</p>
          </Block>

          <Block heading="What happens at the end">
            <p>{KEEPSAKE_VENUE_FACING}</p>
            <p>{SURVIVAL_SENTENCE}</p>
          </Block>

          <Block heading="What being one of the 25 means">
            <p>{FOUNDING_MEANING}</p>
          </Block>

          <Block heading="What happens next">
            <p>
              If it reads like something worth twenty minutes, say so and I will
              send a time.
            </p>
            <p>
              <a
                href={`mailto:${VENUE_CONTACT_EMAIL}`}
                className="text-ink underline decoration-border-soft underline-offset-[3px] transition-colors hover:decoration-accent"
              >
                Reply to {VENUE_CONTACT_EMAIL}
              </a>
            </p>
          </Block>
        </div>

        <Signature />
        <Disclosure />
      </div>
    </main>
  );
}

/* ── State two · the proposal ─────────────────────────────────────────── */

function formatIrishDate(iso: string): string {
  const ms = Date.parse(`${iso}T00:00:00.000Z`);
  if (!Number.isFinite(ms)) return iso;
  return new Intl.DateTimeFormat("en-IE", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(ms));
}

export function ProposalState({ link }: { link: VenueInvitationLink }) {
  const proposal = link.proposal;
  if (!proposal) return <InvitationState link={link} />;

  return (
    <main id="main" tabIndex={-1} className="flex flex-1 flex-col py-14 md:py-20">
      <div className={PAGE}>
        <Eyebrow>Venue Edition · the proposal</Eyebrow>
        <h1 className="mt-5 text-[clamp(1.75rem,1.3rem+2vw,3rem)] font-semibold leading-[1.05] tracking-[-0.035em] text-ink">
          Venue Edition for {link.venueName}
        </h1>
        <p className="mt-4 text-[15px] leading-[1.6] text-ink-quiet">
          Prepared for {proposal.firstName},{" "}
          {formatIrishDate(proposal.walkthroughDate)}.
        </p>

        <div className="mt-10">
          <Block heading="What your couples get">
            <p>{OFFER_PARAGRAPH}</p>
            <p>{COUPLE_TERM_SENTENCE}</p>
          </Block>

          <Block heading="Whose it is">
            <p>{whoseItIsSentence(link.venueName)}</p>
          </Block>

          <PrivacyBlock />

          <Block heading="What it asks of your team">
            <p>{TEAM_ASK_SENTENCE}</p>
          </Block>

          <Block heading="What it costs">
            <p className="text-[22px] font-semibold tracking-[-0.02em] text-ink">
              {PRICE_FORMS.founding}
            </p>
            <p>
              {STANDARD_RATE_SENTENCE} {PRICE_FORMS.difference}{" "}
              {PRICE_FORMS.lock} {PRICE_FORMS.property}
            </p>
            <p>{SCALE_SENTENCE}</p>
          </Block>

          <Block heading="What happens at the end">
            <p>{KEEPSAKE_VENUE_FACING}</p>
            <p>{SURVIVAL_SENTENCE}</p>
          </Block>

          <Block heading="What being one of the 25 means">
            <p>{FOUNDING_MEANING}</p>
          </Block>

          <Block heading="The number">
            <p>
              {proposal.paidCount === 0
                ? "No places are taken yet."
                : proposal.paidCount === 1
                  ? "One place is taken."
                  : `${proposal.paidCount} places are taken.`}{" "}
              The next free number is {proposal.nextFreeNumber}. Numbers follow
              cleared payment, and other venues have proposals open at the same
              time, so I cannot hold a specific number for you.
            </p>
          </Block>

          <Block heading="Your place">
            <p>{HOLD_SENTENCE}</p>
            <p>Held until {formatIrishDate(proposal.holdEndsOn)}.</p>
          </Block>

          {/* The commercial summary. A price never travels without its
              conditions (E11.11 section 3). */}
          <section className="border-t border-border-soft py-7">
            <h2 className="text-[15px] font-semibold tracking-[-0.01em] text-ink">
              Venue Edition · commercial summary
            </h2>
            {/*
              E12.14. axe `scrollable-region-focusable` (serious) fired here at
              375px: the table is wider than the viewport, so this container
              scrolls, and a container that scrolls with no focusable content
              inside it cannot be reached by keyboard at all. WCAG 2.1 SC 2.1.1.
              tabindex makes the region itself the focus target, and it needs an
              accessible name and a role once it is focusable, or a screen
              reader announces an unnamed group.
            */}
            <div
              className="mt-4 overflow-x-auto"
              tabIndex={0}
              role="region"
              aria-label="Venue Edition commercial summary"
            >
              <table className="w-full min-w-[420px] border-collapse text-left">
                <tbody>
                  {COMMERCIAL_SUMMARY_ROWS.map(([term, detail]) => (
                    <tr key={term} className="border-b border-border-soft">
                      <th
                        scope="row"
                        className="w-[38%] py-3 pr-5 align-top text-[14px] font-medium text-ink"
                      >
                        {term}
                      </th>
                      <td className="py-3 align-top text-[14px] leading-[1.55] text-ink-soft">
                        {detail}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <Block heading="To take it">
            <p>
              Complete the order form and send it back. I will invoice you, and
              the place stays yours while the invoice is with you.
            </p>
            <p>
              <a
                href={`mailto:${VENUE_CONTACT_EMAIL}`}
                className="text-ink underline decoration-border-soft underline-offset-[3px] transition-colors hover:decoration-accent"
              >
                Return the order form to {VENUE_CONTACT_EMAIL}
              </a>
            </p>
          </Block>
        </div>

        <Signature />
        <Disclosure />
      </div>
    </main>
  );
}

/* ── The replacement page (E13.16 section 12.4) ───────────────────────── */

export function ReplacedState() {
  return (
    <main id="main" tabIndex={-1} className="flex flex-1 flex-col py-20">
      <div className={PAGE}>
        <h1 className="text-[clamp(1.5rem,1.2rem+1.4vw,2.25rem)] font-semibold leading-[1.1] tracking-[-0.03em] text-ink">
          {REPLACED_PAGE.heading}
        </h1>
        <p className="mt-5 text-[16px] leading-[1.65] text-ink-soft">
          {REPLACED_PAGE.body}
        </p>
        <p className="mt-8 border-t border-border-soft pt-6 text-[13px] leading-[1.6] text-ink-quiet">
          {REPLACED_PAGE.disclosure}
        </p>
        <p className="mt-6 text-[13px] text-ink-quiet">
          {REPLACED_PAGE.signature}
        </p>
      </div>
    </main>
  );
}
