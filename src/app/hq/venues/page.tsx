import type { CSSProperties, ReactNode } from "react";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { HqPageHeader } from "@/components/hq/hq-page-header";
import { HQ_ACCESS_COOKIE, verifyHqToken } from "@/lib/hq/auth";
import {
  BATCH_A_EMAIL_DRAFTS,
  BATCH_BC_EMAIL_DRAFTS,
  VENUE_FAQ_OBJECTIONS,
  VENUE_FULFILMENT_REHEARSAL,
  VENUE_CREATIVE_PRODUCTION_CHECKLIST,
  WAVE_ONE_CONVERSION_LEDGER,
  WAVE_ONE_OUTREACH_GATES,
  WAVE_ONE_VENUES,
  type BatchAEmailDraft,
  type CreativeProductionItem,
  type OutreachGate,
  type VenueConversionLedgerRow,
  type VenueFaqObjection,
  type VenueFulfilmentRehearsalStep,
  type VenueBatch,
  type VenueTarget,
} from "@/lib/venues/wave-one";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Venues - Signal HQ",
  description: "Private venue outreach command page.",
  robots: { index: false, follow: false },
};

const batches: VenueBatch[] = ["A", "B", "C"];

export default async function VenuesPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(HQ_ACCESS_COOKIE)?.value ?? "";
  const valid = token ? await verifyHqToken(token) : false;
  if (!valid) redirect("/hq/access");

  const notReady = WAVE_ONE_VENUES.filter(
    (venue) => venue.status === "not-ready",
  ).length;
  const readyUnsent = WAVE_ONE_VENUES.filter(
    (venue) => venue.status === "ready-unsent",
  ).length;
  const sent = WAVE_ONE_VENUES.filter(
    (venue) => venue.status !== "not-ready" && venue.status !== "ready-unsent",
  ).length;
  const linksChecked = WAVE_ONE_VENUES.length * 3;
  const heldDrafts = [...BATCH_A_EMAIL_DRAFTS, ...BATCH_BC_EMAIL_DRAFTS];

  return (
    <main id="main" className="mx-auto w-full max-w-[1180px] px-6 pb-24">
      <HqPageHeader
        slug="venues"
        title="Wave 1 venue command"
        standfirst="The founding venue list as an operating surface: no emails sent, no contact data stored, every first line verified."
      />

      <div className="mt-10" style={statsGridStyle}>
        <Stat value={String(WAVE_ONE_VENUES.length)} label="Wave 1 targets" />
        <Stat value={String(batches.length)} label="review batches" />
        <Stat value={String(heldDrafts.length)} label="held drafts" />
        <Stat value={String(linksChecked)} label="links checked" />
        <Stat value={String(notReady)} label="asset gated" />
        <Stat value={String(readyUnsent)} label="ready unsent" />
        <Stat value={String(sent)} label="emails sent" />
      </div>

      <section className="mt-10" style={noticeStyle} aria-label="outreach boundary">
        <div style={eyebrowStyle}>boundary</div>
        <p className="mt-2 text-ink" style={{ fontSize: 18, lineHeight: 1.45 }}>
          This page is preparation only. It exists so the eventual venue outreach
          feels specific, premium, and restrained. Nothing here authorises a send
          until the founder assets, dry run, and read-aloud review are complete.
        </p>
      </section>

      <section className="mt-12">
        <SectionTitle
          kicker="batch plan"
          title="Open in this order"
          copy="Batch A is local proof density. Batch B is castle and country-house depth. Batch C is prestige and distance, held until the proof video is stronger."
        />
        <div style={batchGridStyle}>
          {batches.map((batch) => {
            const venues = WAVE_ONE_VENUES.filter(
              (venue) => venue.batch === batch,
            );

            return (
              <div key={batch} style={panelStyle}>
                <div className="flex items-center justify-between gap-4">
                  <h2 className="text-ink" style={{ fontSize: 22, fontWeight: 500 }}>
                    Batch {batch}
                  </h2>
                  <span style={smallMonoStyle}>{venues.length} venues</span>
                </div>
                <ol className="mt-6 space-y-3">
                  {venues.map((venue) => (
                    <li
                      key={venue.slug}
                      className="flex items-baseline justify-between gap-4 border-t border-border-soft pt-3"
                    >
                      <span className="text-ink-soft" style={{ fontSize: 14 }}>
                        {venue.rank}. {venue.name}
                      </span>
                      <span style={smallMonoStyle}>{venue.county}</span>
                    </li>
                  ))}
                </ol>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mt-14">
        <SectionTitle
          kicker="gates"
          title="No-send controls"
          copy="The tracked routes work. The venue motion layer still needs founder polish before any outbound email should exist."
        />
        <div style={gateGridStyle}>
          {WAVE_ONE_OUTREACH_GATES.map((gate) => (
            <GateRow key={gate.name} gate={gate} />
          ))}
        </div>
      </section>

      <section className="mt-14">
        <SectionTitle
          kicker="production"
          title="Founder proof work order"
          copy="The next constraint is visual proof: capture frames, 30 second video, PDF, and the read-aloud pass. This is the order to work through."
        />
        <div className="space-y-3">
          {VENUE_CREATIVE_PRODUCTION_CHECKLIST.map((item) => (
            <ProductionRow key={item.output} item={item} />
          ))}
        </div>
      </section>

      <section className="mt-14">
        <SectionTitle
          kicker="held drafts"
          title="Batch A-C email review"
          copy="All twelve Wave 1 first-touch drafts now exist, but they remain held until the proof video, PDF, contact path, and read-aloud gates clear."
        />
        <div style={draftGridStyle}>
          {heldDrafts.map((draft) => (
            <DraftCard key={draft.venueSlug} draft={draft} />
          ))}
        </div>
      </section>

      <section className="mt-14">
        <SectionTitle
          kicker="conversion"
          title="Empty ledger, ready to operate"
          copy="No outreach has happened, so every row is intentionally blank. The point is that status, follow-ups, replies, calls, signer, and price are already defined before the first send."
        />
        <div style={ledgerStyle}>
          {WAVE_ONE_CONVERSION_LEDGER.map((row) => (
            <LedgerRow key={row.venueSlug} row={row} />
          ))}
        </div>
      </section>

      <section className="mt-14">
        <SectionTitle
          kicker="fulfilment"
          title="If a venue says yes"
          copy="The post-sale path is rehearsed without mutating sponsors or issuing codes. Payment first, then sponsor setup, code issue, redemption smoke test, and partner digest."
        />
        <div className="space-y-3">
          {VENUE_FULFILMENT_REHEARSAL.map((step) => (
            <FulfilmentRow key={step.name} step={step} />
          ))}
        </div>
      </section>

      <section className="mt-14">
        <SectionTitle
          kicker="objections"
          title="Answers before they ask"
          copy="Keep these private for now. The standard is plain answers, not defensive sales copy."
        />
        <div style={draftGridStyle}>
          {VENUE_FAQ_OBJECTIONS.map((item) => (
            <FaqCard key={item.objection} item={item} />
          ))}
        </div>
      </section>

      <section className="mt-14">
        <SectionTitle
          kicker="dossiers"
          title="Venue-by-venue read"
          copy="Each venue gets one account hypothesis, one likely planning friction, one first line, and one proof asset. Keep it this spare."
        />
        <div className="space-y-5">
          {WAVE_ONE_VENUES.map((venue) => (
            <VenueCard key={venue.slug} venue={venue} />
          ))}
        </div>
      </section>

      <section className="mt-14" style={panelStyle}>
        <SectionTitle
          kicker="operator files"
          title="Where the system lives"
          copy="Use these files as the source of truth while founder design, motion, and video assets are being made."
        />
        <div style={fileGridStyle}>
          <FilePath file="docs/strategy/VENUE_GTM_EXECUTION_PLAN.md" note="course-correction plan" />
          <FilePath file="docs/strategy/VENUE_CREATIVE_PRODUCTION_PACK.md" note="video, PDF, and capture work order" />
          <FilePath file="docs/strategy/VENUE_BATCH_A_EMAIL_DRAFTS.md" note="held Batch A founder emails" />
          <FilePath file="docs/strategy/VENUE_BATCH_BC_EMAIL_DRAFTS.md" note="held Batch B and C founder emails" />
          <FilePath file="docs/strategy/VENUE_LINK_DRY_RUN_2026_05_27.md" note="36/36 live tracked links passed" />
          <FilePath file="docs/strategy/VENUE_ATTRIBUTION_CONTACT_LEDGER.md" note="tracking and contact route hardening" />
          <FilePath file="docs/strategy/VENUE_FULFILMENT_REHEARSAL_2026_05_27.md" note="post-sale path rehearsal" />
          <FilePath file="docs/strategy/VENUE_FAQ_OBJECTIONS.md" note="private objection and FAQ answers" />
          <FilePath file="docs/strategy/VENUE_PUBLIC_PAGE_QA_2026_05_27.md" note="public route QA" />
          <FilePath file="docs/strategy/VENUE_WAVE1_DOSSIERS.md" note="account intelligence" />
          <FilePath file="docs/strategy/VENUE_FOUNDER_REVIEW_PACK.md" note="creative gates" />
          <FilePath file="docs/strategy/VENUE_TARGET_LEDGER.md" note="status ledger and tracked links" />
          <FilePath file="docs/strategy/VENUE_SALES_PACK.md" note="founder-facing copy source" />
          <FilePath file="docs/strategy/VENUE_DEMO_SYSTEM.md" note="demo mechanics" />
          <FilePath file="docs/strategy/VENUE_TRACKING_AND_CONVERSION.md" note="measurement and conversion" />
          <FilePath file="docs/strategy/VENUE_FULFILMENT_RUNBOOK.md" note="post-sale delivery" />
        </div>
      </section>

      <div
        className="mt-16 border-t border-border-soft pt-6"
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 12,
          color: "var(--ink-quiet)",
        }}
      >
        <Link
          href="/hq"
          style={{ color: "var(--ink-soft)" }}
          className="hover:opacity-70"
        >
          back to Signal HQ
        </Link>
        <span className="ml-4">
          source - docs/strategy/VENUE_WAVE1_DOSSIERS.md
        </span>
      </div>
    </main>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div style={statStyle}>
      <span className="text-ink" style={{ fontSize: 28, lineHeight: 1, fontWeight: 500 }}>
        {value}
      </span>
      <span className="mt-2 block" style={smallMonoStyle}>
        {label}
      </span>
    </div>
  );
}

function SectionTitle({
  kicker,
  title,
  copy,
}: {
  kicker: string;
  title: string;
  copy: string;
}) {
  return (
    <div className="mb-6">
      <div style={eyebrowStyle}>{kicker}</div>
      <h2 className="mt-2 text-ink" style={{ fontSize: 28, lineHeight: 1.15, fontWeight: 500 }}>
        {title}
      </h2>
      <p className="mt-3 max-w-[72ch] text-ink-soft" style={{ fontSize: 15, lineHeight: 1.6 }}>
        {copy}
      </p>
    </div>
  );
}

function GateRow({ gate }: { gate: OutreachGate }) {
  return (
    <div style={panelStyle}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-ink" style={{ fontSize: 18, fontWeight: 500 }}>
            {gate.name}
          </h3>
          <p className="mt-3 text-ink-soft" style={{ fontSize: 14, lineHeight: 1.55 }}>
            {gate.detail}
          </p>
        </div>
        <Pill tone={gate.state}>{gate.state}</Pill>
      </div>
      <div className="mt-5" style={smallMonoStyle}>
        owner - {gate.owner}
      </div>
    </div>
  );
}

function ProductionRow({ item }: { item: CreativeProductionItem }) {
  return (
    <div
      className="grid gap-4 border border-border"
      style={{
        background: "var(--bg-elev)",
        gridTemplateColumns: "minmax(48px, 72px) minmax(0, 1fr) auto",
        padding: 18,
      }}
    >
      <div style={smallMonoStyle}>step {item.step}</div>
      <div>
        <h3 className="text-ink" style={{ fontSize: 17, fontWeight: 500 }}>
          {item.output}
        </h3>
        <p className="mt-2 text-ink-soft" style={{ fontSize: 14, lineHeight: 1.5 }}>
          {item.nextAction}
        </p>
        <div className="mt-3" style={smallMonoStyle}>
          {item.owner} - {item.source}
        </div>
      </div>
      <div>
        <Pill tone={item.state}>{item.state}</Pill>
      </div>
    </div>
  );
}

function DraftCard({ draft }: { draft: BatchAEmailDraft }) {
  return (
    <article style={panelStyle}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <div style={smallMonoStyle}>
            {draft.batch ? `Batch ${draft.batch} - ` : ""}
            {draft.venueSlug}
          </div>
          <h3 className="mt-2 text-ink" style={{ fontSize: 19, lineHeight: 1.25, fontWeight: 500 }}>
            {draft.venueName}
          </h3>
        </div>
        <Pill tone={draft.state === "held" ? "held" : "ready"}>
          {draft.state}
        </Pill>
      </div>
      <Detail label="subject">{draft.subject}</Detail>
      <Detail label="first line">{draft.firstLine}</Detail>
      <div className="mt-5 border-t border-border-soft pt-4" style={smallMonoStyle}>
        blocked by - {draft.proofDependency}
      </div>
    </article>
  );
}

function LedgerRow({ row }: { row: VenueConversionLedgerRow }) {
  return (
    <div
      className="grid gap-4 border-b border-border-soft px-5 py-4 last:border-b-0"
      style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}
    >
      <div>
        <div style={smallMonoStyle}>Batch {row.batch} - {row.venueSlug}</div>
        <div className="mt-1 text-ink" style={{ fontSize: 15, fontWeight: 500 }}>
          {row.venueName}
        </div>
      </div>
      <div className="grid gap-2 md:grid-cols-2">
        <MiniFact label="email 1" value={row.email1SentAt} />
        <MiniFact label="reply" value={row.replyState} />
        <MiniFact label="call" value={row.callDate} />
        <MiniFact label="price" value={row.priceDiscussed} />
      </div>
      <div>
        <Pill tone="status">{row.status}</Pill>
        <p className="mt-3 text-ink-quiet" style={{ fontSize: 12, lineHeight: 1.45 }}>
          {row.nextAction}
        </p>
      </div>
    </div>
  );
}

function FulfilmentRow({ step }: { step: VenueFulfilmentRehearsalStep }) {
  return (
    <div
      className="grid gap-4 border border-border"
      style={{
        background: "var(--bg-elev)",
        gridTemplateColumns: "minmax(48px, 72px) minmax(0, 1fr) auto",
        padding: 18,
      }}
    >
      <div style={smallMonoStyle}>step {step.step}</div>
      <div>
        <h3 className="text-ink" style={{ fontSize: 17, fontWeight: 500 }}>
          {step.name}
        </h3>
        <p className="mt-2 text-ink-soft" style={{ fontFamily: "var(--font-mono)", fontSize: 12, lineHeight: 1.55 }}>
          {step.command}
        </p>
        <p className="mt-2 text-ink-quiet" style={{ fontSize: 13, lineHeight: 1.5 }}>
          {step.proof}
        </p>
      </div>
      <div>
        <Pill tone={step.state}>{step.state}</Pill>
      </div>
    </div>
  );
}

function FaqCard({ item }: { item: VenueFaqObjection }) {
  return (
    <article style={panelStyle}>
      <h3 className="text-ink" style={{ fontSize: 18, lineHeight: 1.25, fontWeight: 500 }}>
        {item.objection}
      </h3>
      <p className="mt-4 text-ink-soft" style={{ fontSize: 14, lineHeight: 1.55 }}>
        {item.answer}
      </p>
      <div className="mt-5 border-t border-border-soft pt-4" style={smallMonoStyle}>
        use when - {item.useWhen}
      </div>
    </article>
  );
}

function MiniFact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div style={eyebrowStyle}>{label}</div>
      <div className="mt-1 text-ink-soft" style={{ fontFamily: "var(--font-mono)", fontSize: 12 }}>
        {value}
      </div>
    </div>
  );
}

function VenueCard({ venue }: { venue: VenueTarget }) {
  return (
    <article style={panelStyle}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div style={smallMonoStyle}>
            #{venue.rank} - Batch {venue.batch} - {venue.county}
          </div>
          <h3 className="mt-2 text-ink" style={{ fontSize: 24, lineHeight: 1.2, fontWeight: 500 }}>
            {venue.name}
          </h3>
          <div className="mt-3 flex flex-wrap gap-2">
            <Pill tone="status">{venue.status}</Pill>
            <Pill tone="readiness">{venue.readiness}</Pill>
          </div>
        </div>
        <div className="flex flex-wrap gap-3" style={smallMonoStyle}>
          <a href={venue.links.source} target="_blank" rel="noreferrer" style={linkStyle}>
            official source
          </a>
          <a href={venue.links.venuePage} target="_blank" rel="noreferrer" style={linkStyle}>
            tracked page
          </a>
          <a href={venue.links.demo} target="_blank" rel="noreferrer" style={linkStyle}>
            demo
          </a>
          <a href={venue.links.contact} target="_blank" rel="noreferrer" style={linkStyle}>
            contact path
          </a>
        </div>
      </div>

      <div className="mt-7" style={venueDetailGridStyle}>
        <Detail label="fit">{venue.fit}</Detail>
        <Detail label="likely friction">{venue.friction}</Detail>
        <Detail label="contact path">{venue.contactPath}</Detail>
        <Detail label="proof asset">{venue.proofAsset}</Detail>
      </div>

      <div className="mt-7 border-t border-border-soft pt-5" style={quoteStyle}>
        <Detail label="opening observation">{venue.openingObservation}</Detail>
        <Detail label="first line">{venue.firstLine}</Detail>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <Detail label="risk">{venue.risk}</Detail>
        <Detail label="next action">{venue.nextAction}</Detail>
      </div>
    </article>
  );
}

function Detail({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <div style={eyebrowStyle}>{label}</div>
      <p className="mt-2 text-ink-soft" style={{ fontSize: 14, lineHeight: 1.55 }}>
        {children}
      </p>
    </div>
  );
}

function FilePath({ file, note }: { file: string; note: string }) {
  return (
    <div className="border-t border-border-soft pt-3">
      <div className="text-ink" style={{ fontFamily: "var(--font-mono)", fontSize: 12 }}>
        {file}
      </div>
      <div className="mt-1 text-ink-quiet" style={{ fontSize: 13, lineHeight: 1.45 }}>
        {note}
      </div>
    </div>
  );
}

function Pill({
  tone,
  children,
}: {
  tone: "blocked" | "open" | "ready" | "manual" | "held" | "status" | "readiness";
  children: ReactNode;
}) {
  const palette: Record<typeof tone, CSSProperties> = {
    blocked: {
      color: "#7f1d1d",
      background: "color-mix(in srgb, #dc2626 9%, var(--bg-elev))",
      borderColor: "color-mix(in srgb, #dc2626 28%, var(--border))",
    },
    open: {
      color: "var(--ink-soft)",
      background: "var(--bg-deep)",
      borderColor: "var(--border)",
    },
    ready: {
      color: "#14532d",
      background: "color-mix(in srgb, #16a34a 10%, var(--bg-elev))",
      borderColor: "color-mix(in srgb, #16a34a 30%, var(--border))",
    },
    manual: {
      color: "var(--ink-soft)",
      background: "color-mix(in srgb, var(--ink) 5%, var(--bg-elev))",
      borderColor: "var(--border)",
    },
    held: {
      color: "var(--ink-soft)",
      background: "color-mix(in srgb, #f59e0b 10%, var(--bg-elev))",
      borderColor: "color-mix(in srgb, #f59e0b 28%, var(--border))",
    },
    status: {
      color: "var(--ink-soft)",
      background: "var(--bg-deep)",
      borderColor: "var(--border)",
    },
    readiness: {
      color: "var(--ink-soft)",
      background: "color-mix(in srgb, var(--accent-soft) 45%, var(--bg-elev))",
      borderColor: "var(--border)",
    },
  };

  return (
    <span
      style={{
        ...palette[tone],
        borderWidth: 1,
        borderStyle: "solid",
        borderRadius: 999,
        display: "inline-flex",
        alignItems: "center",
        minHeight: 28,
        padding: "0 10px",
        fontFamily: "var(--font-mono)",
        fontSize: 11,
        letterSpacing: "0.02em",
        textTransform: "uppercase",
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </span>
  );
}

const statsGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
  gap: 12,
};

const batchGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
  gap: 16,
};

const gateGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
  gap: 16,
};

const fileGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
  gap: 18,
};

const draftGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
  gap: 16,
};

const ledgerStyle: CSSProperties = {
  border: "1px solid var(--border)",
  background: "var(--bg-elev)",
};

const venueDetailGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: 20,
};

const statStyle: CSSProperties = {
  border: "1px solid var(--border)",
  background: "var(--bg-elev)",
  padding: "18px 18px 16px",
};

const panelStyle: CSSProperties = {
  border: "1px solid var(--border)",
  background: "var(--bg-elev)",
  padding: 24,
};

const noticeStyle: CSSProperties = {
  border: "1px solid var(--border)",
  background:
    "linear-gradient(135deg, color-mix(in srgb, var(--accent-soft) 36%, var(--bg-elev)), var(--bg-elev))",
  padding: 24,
};

const quoteStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
  gap: 20,
};

const eyebrowStyle: CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: 11,
  color: "var(--ink-quiet)",
  letterSpacing: "var(--tracking-eyebrow)",
  textTransform: "uppercase",
  fontWeight: 600,
};

const smallMonoStyle: CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: 12,
  color: "var(--ink-quiet)",
  letterSpacing: "0.01em",
};

const linkStyle: CSSProperties = {
  color: "var(--ink-soft)",
  textDecoration: "underline",
  textUnderlineOffset: 3,
};
