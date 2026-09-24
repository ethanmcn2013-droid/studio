import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { HqPageHeader } from "@/components/hq/hq-page-header";
import { HQ_ACCESS_COOKIE, verifyHqToken } from "@/lib/hq/auth";
import { getCronHealth, type CronHealth } from "@/lib/cron/runs";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Health · Signal HQ",
  description: "Cron + scheduled-job health for the suite.",
  robots: { index: false, follow: false },
};

export default async function HealthPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(HQ_ACCESS_COOKIE)?.value ?? "";
  const valid = token ? await verifyHqToken(token) : false;
  if (!valid) redirect("/hq/access");

  let analyticsDaily: CronHealth | null = null;
  let loadError: string | null = null;
  try {
    analyticsDaily = await getCronHealth("analytics_daily");
  } catch (err) {
    loadError = err instanceof Error ? err.message : "Unknown error";
  }

  return (
    <main id="main" className="mx-auto w-full max-w-[900px] px-6 pb-24">
      <HqPageHeader
        slug="health"
        title="Scheduled jobs"
        standfirst="Each cron in the suite reports its last run here: ok inside 12 hours, watch to 26, act after that or on failure."
      />

      <div className="mt-10" />

      {loadError ? (
        <ErrorPanel message={loadError} />
      ) : analyticsDaily ? (
        <div className="grid gap-4">
          <CronRow
            label="Signal · daily briefings"
            schedule="06:00 UTC daily"
            health={analyticsDaily}
          />
        </div>
      ) : (
        <EmptyState />
      )}
    </main>
  );
}

function CronRow({
  label,
  schedule,
  health,
}: {
  label: string;
  schedule: string;
  health: CronHealth;
}) {
  const { status, lastRun, hoursSinceLastRun } = health;
  const lastRunText = lastRun
    ? new Date(lastRun.ranAt).toISOString().replace("T", " ").slice(0, 16) + "Z"
    : "never run";
  const sinceText =
    hoursSinceLastRun === null
      ? null
      : hoursSinceLastRun < 1
        ? `${Math.round(hoursSinceLastRun * 60)}m ago`
        : `${hoursSinceLastRun.toFixed(1)}h ago`;

  return (
    <div
      className="border border-border-soft p-5"
      style={{ background: "var(--surface)" }}
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="text-ink" style={{ fontSize: 15, fontWeight: 600 }}>
            {label}
          </div>
          <div
            className="mt-1 text-ink-quiet"
            style={{ fontSize: 13, lineHeight: 1.5 }}
          >
            {schedule}
          </div>
        </div>
        <StatusPill status={status} />
      </div>

      <dl
        className="mt-5 grid grid-cols-2 gap-x-6 gap-y-2 md:grid-cols-4"
        style={{ fontSize: 13 }}
      >
        <Field label="Last run" value={lastRunText} />
        <Field label="When" value={sinceText ?? "—"} />
        <Field label="Result" value={lastRun ? (lastRun.ok ? "ok" : "failed") : "—"} />
        <Field
          label="Sent / failed"
          value={
            lastRun
              ? `${lastRun.sent ?? 0} / ${lastRun.failed ?? 0}`
              : "—"
          }
        />
      </dl>

      {lastRun?.notes ? (
        <div
          className="mt-4 text-ink-quiet"
          style={{ fontSize: 12, lineHeight: 1.5 }}
        >
          {lastRun.notes}
        </div>
      ) : null}
    </div>
  );
}

function StatusPill({ status }: { status: CronHealth["status"] }) {
  const map: Record<CronHealth["status"], { bg: string; ink: string; label: string }> = {
    green: { bg: "#e8f4ec", ink: "#1f5132", label: "Green" },
    amber: { bg: "#fdf3e1", ink: "#7a4e0a", label: "Amber" },
    red: { bg: "#fce8e8", ink: "#7a1818", label: "Red" },
    never: { bg: "#f1f1f1", ink: "#555", label: "Never run" },
  };
  const tone = map[status];
  return (
    <span
      className="inline-flex items-center"
      style={{
        background: tone.bg,
        color: tone.ink,
        fontSize: 12,
        fontWeight: 600,
        padding: "4px 10px",
        borderRadius: 2,
        letterSpacing: "0.04em",
        textTransform: "uppercase",
      }}
    >
      {tone.label}
    </span>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt
        className="text-ink-faint"
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 10,
          letterSpacing: "var(--tracking-eyebrow)",
          textTransform: "uppercase",
          fontWeight: 600,
        }}
      >
        {label}
      </dt>
      <dd className="text-ink" style={{ fontSize: 13 }}>
        {value}
      </dd>
    </div>
  );
}

function EmptyState() {
  return (
    <div
      className="border border-border-soft p-5 text-ink-quiet"
      style={{ background: "var(--surface)", fontSize: 14 }}
    >
      No cron sources reporting yet. Signal Studio is quiet.
    </div>
  );
}

function ErrorPanel({ message }: { message: string }) {
  return (
    <div
      className="border p-5"
      style={{
        background: "#fce8e8",
        color: "#7a1818",
        borderColor: "#e4baba",
        fontSize: 13,
        lineHeight: 1.6,
      }}
    >
      <div style={{ fontWeight: 600, marginBottom: 4 }}>Could not load health</div>
      <code style={{ fontSize: 12 }}>{message}</code>
    </div>
  );
}
