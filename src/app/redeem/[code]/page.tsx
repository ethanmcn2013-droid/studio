import type { Metadata } from "next";
import { headers } from "next/headers";
import { SiteFooter } from "@/components/landing/site-footer";
import { lookupRedemption, type RedemptionLookup } from "@/lib/redeem/lookup";
import {
  checkRedeemRateLimit,
  ipFromForwardedFor,
} from "@/lib/redeem/rate-limit";
import { TASKS_URL } from "@/lib/product-urls";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Redeem your access — Signal Studio",
  robots: { index: false, follow: false },
};

type PreviewState =
  | "claimable_venue_edition"
  | "claimable_compliments"
  | "claimable_review_access"
  | "already_used"
  | "invalid"
  | "revoked"
  | "network_error";

const PREVIEW_STATES: ReadonlySet<PreviewState> = new Set([
  "claimable_venue_edition",
  "claimable_compliments",
  "claimable_review_access",
  "already_used",
  "invalid",
  "revoked",
  "network_error",
]);

function previewLookup(
  state: PreviewState,
  code: string,
): RedemptionLookup {
  switch (state) {
    case "claimable_venue_edition":
      return {
        state: "claimable",
        code,
        sponsor: { slug: "lambs-hill", name: "Lamb's Hill", brandMeta: null },
        sourceType: "venue_edition",
        tier: "wedding",
        durationDays: 365,
      };
    case "claimable_compliments":
      return {
        state: "claimable",
        code,
        sponsor: { slug: "studio", name: "Signal Studio", brandMeta: null },
        sourceType: "compliments",
        tier: "studio",
        durationDays: null,
      };
    case "claimable_review_access":
      return {
        state: "claimable",
        code,
        sponsor: { slug: "studio", name: "Signal Studio", brandMeta: null },
        sourceType: "review_access",
        tier: "studio",
        durationDays: 90,
      };
    case "already_used":
      return { state: "already_used", code, sponsorName: "Lamb's Hill" };
    case "revoked":
      return { state: "revoked", code, sponsorName: "Lamb's Hill" };
    case "invalid":
      return { state: "invalid", code };
    case "network_error":
      return { state: "network_error", code };
  }
}

export default async function RedeemPage({
  params,
  searchParams,
}: {
  params: Promise<{ code: string }>;
  searchParams: Promise<{ state?: string }>;
}) {
  const { code } = await params;
  const sp = await searchParams;

  const isPreview =
    !!sp.state && PREVIEW_STATES.has(sp.state as PreviewState);

  // Preview states are static and harmless (design QA) — never gated.
  // The real lookup is an enumeration oracle, so it is rate-limited per
  // IP and the DB call is skipped entirely once over budget.
  let limited = false;
  if (!isPreview) {
    const h = await headers();
    const ip = ipFromForwardedFor(h.get("x-forwarded-for"));
    limited = !checkRedeemRateLimit(ip);
  }

  const view = isPreview
    ? previewLookup(sp.state as PreviewState, code)
    : limited
      ? null
      : await lookupRedemption(code);

  return (
    <>
      <main className="flex flex-1 flex-col">
        <article className="mx-auto w-full max-w-[620px] px-6 pb-28 pt-20 md:pt-28">
          {view ? <RedeemView view={view} /> : <RateLimitedView />}
        </article>
      </main>
      <SiteFooter />
    </>
  );
}

function RateLimitedView() {
  return (
    <>
      <h1 className="h-section mb-5 text-balance text-ink">
        Too many attempts
      </h1>
      <p className="text-[17px] leading-[1.6] text-ink-soft">
        This link has been opened too many times from your connection.
        Wait a few minutes, then try it again. If you were sent this code
        and it keeps refusing, reply to the email it came in and a person
        will sort it.
      </p>
    </>
  );
}

function RedeemView({ view }: { view: RedemptionLookup }) {
  if (view.state === "claimable") return <ClaimableView view={view} />;
  if (view.state === "already_used") return <AlreadyUsedView view={view} />;
  if (view.state === "revoked") return <RevokedView view={view} />;
  if (view.state === "invalid") return <InvalidView />;
  return <NetworkErrorView />;
}

function ClaimableView({
  view,
}: {
  view: Extract<RedemptionLookup, { state: "claimable" }>;
}) {
  const copy = claimableCopy(view);

  return (
    <>
      {copy.eyebrow ? <Eyebrow>{copy.eyebrow}</Eyebrow> : null}
      <h1 className="h-section mb-5 text-balance text-ink">{copy.headline}</h1>
      <p className="mb-8 text-[17px] leading-[1.6] text-ink-soft">
        {copy.sub}
      </p>

      <div className="mb-10">
        <a
          href={`${TASKS_URL}/redeem/${encodeURIComponent(view.code)}`}
          className="flex w-full min-h-[52px] items-center justify-center rounded-md px-6 py-3.5 text-[17px] font-medium text-white transition-opacity hover:opacity-90 sm:inline-flex sm:w-auto sm:min-h-0 sm:py-3 sm:text-[15px]"
          style={{ background: "var(--accent)" }}
        >
          {copy.cta}
        </a>
      </div>

      <IncludedStack />

      <CodeFooter code={view.code} />
    </>
  );
}

function AlreadyUsedView({
  view,
}: {
  view: Extract<RedemptionLookup, { state: "already_used" }>;
}) {
  return (
    <>
      <h1 className="h-section mb-5 text-balance text-ink">
        This code was already used.
      </h1>
      <p className="mb-8 text-[17px] leading-[1.6] text-ink-soft">
        {view.sponsorName ? (
          <>
            Ask {view.sponsorName} for a new one — they can issue another from
            their pool any time.
          </>
        ) : (
          <>
            Ask the venue you booked through for a new one — they can issue
            another any time.
          </>
        )}
      </p>
      <ContactFooter />
      <CodeFooter code={view.code} />
    </>
  );
}

function RevokedView({
  view,
}: {
  view: Extract<RedemptionLookup, { state: "revoked" }>;
}) {
  return (
    <>
      <h1 className="h-section mb-5 text-balance text-ink">
        This offer has ended.
      </h1>
      <p className="mb-8 text-[17px] leading-[1.6] text-ink-soft">
        {view.sponsorName ? (
          <>{view.sponsorName} can issue a fresh code if you reach out.</>
        ) : (
          <>The venue you booked through can issue a fresh code if you reach out.</>
        )}
      </p>
      <ContactFooter />
      <CodeFooter code={view.code} />
    </>
  );
}

function InvalidView() {
  return (
    <>
      <h1 className="h-section mb-5 text-balance text-ink">
        That code doesn&rsquo;t match anything.
      </h1>
      <p className="mb-8 text-[17px] leading-[1.6] text-ink-soft">
        Double-check the link from your venue. Codes are case-insensitive and
        the hyphen matters.
      </p>
      <ContactFooter />
    </>
  );
}

function NetworkErrorView() {
  return (
    <>
      <h1 className="h-section mb-5 text-balance text-ink">
        Something went sideways on our end.
      </h1>
      <p className="mb-8 text-[17px] leading-[1.6] text-ink-soft">
        Try again in a minute, or email{" "}
        <a
          href="mailto:hello@signalstudio.ie"
          className="text-ink underline decoration-1 underline-offset-2 transition-opacity hover:opacity-70"
        >
          hello@signalstudio.ie
        </a>{" "}
        and we&rsquo;ll sort it.
      </p>
    </>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="mb-5 text-[11px] font-semibold uppercase text-ink-quiet"
      style={{
        letterSpacing: "var(--tracking-eyebrow)",
        fontFamily: "var(--font-mono-stack)",
      }}
    >
      {children}
    </div>
  );
}

function IncludedStack() {
  return (
    <div className="mb-10 rounded-xl border border-border-soft p-5">
      <div
        className="mb-3 text-[10px] font-semibold uppercase text-ink-faint"
        style={{ letterSpacing: "var(--tracking-eyebrow)" }}
      >
        What&rsquo;s included
      </div>
      <ul className="space-y-1.5 text-[14px] text-ink">
        <li>
          <span className="text-ink">Signal Tasks</span>{" "}
          <span className="text-ink-quiet">— a live workspace for the work.</span>
        </li>
        <li>
          <span className="text-ink">Signal Notes</span>{" "}
          <span className="text-ink-quiet">— private capture, promotes to Tasks.</span>
        </li>
        <li>
          <span className="text-ink">Signal Roadmap</span>{" "}
          <span className="text-ink-quiet">— share what&rsquo;s coming.</span>
        </li>
        <li>
          <span className="text-ink">Signal Analytics</span>{" "}
          <span className="text-ink-quiet">— a daily briefing on what needs attention.</span>
        </li>
      </ul>
    </div>
  );
}

function ContactFooter() {
  return (
    <p className="mb-8 text-[14px] text-ink-quiet">
      Stuck? Email{" "}
      <a
        href="mailto:hello@signalstudio.ie"
        className="text-ink underline decoration-1 underline-offset-2 transition-opacity hover:opacity-70"
      >
        hello@signalstudio.ie
      </a>
      .
    </p>
  );
}

function CodeFooter({ code }: { code: string }) {
  return (
    <div className="mt-12 border-t border-border-soft pt-4">
      <div
        className="font-mono text-[10px] font-semibold uppercase text-ink-faint"
        style={{ letterSpacing: "0.14em" }}
      >
        Code
      </div>
      <div
        className="mt-1 font-mono text-[14px] uppercase text-ink-quiet"
        style={{ letterSpacing: "0.08em", fontVariantNumeric: "tabular-nums" }}
      >
        {code}
      </div>
    </div>
  );
}

function claimableCopy(
  view: Extract<RedemptionLookup, { state: "claimable" }>,
): { eyebrow: string | null; headline: string; sub: string; cta: string } {
  if (view.sourceType === "venue_edition") {
    return {
      eyebrow: view.sponsor.name,
      headline: `${view.sponsor.name} is sponsoring your access to Signal Studio.`,
      sub: "Plan your wedding without the noise. Four small tools, free to you for the next year.",
      cta: "Claim your seat",
    };
  }
  if (view.sourceType === "review_access") {
    return {
      eyebrow: "Review access",
      headline: "Ninety days of Signal Studio.",
      sub: "All four products, the same as the paying surface. Beat the system or break it — that’s the point.",
      cta: "Open the review account",
    };
  }
  // compliments — personal gift register, no eyebrow.
  return {
    eyebrow: null,
    headline: "Welcome to Signal Studio.",
    sub: "A complimentary account, on us. Four small tools — Tasks, Roadmap, Analytics, Notes.",
    cta: "Open your account",
  };
}
