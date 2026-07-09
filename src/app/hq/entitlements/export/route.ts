import "server-only";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { HQ_ACCESS_COOKIE, verifyHqToken } from "@/lib/hq/auth";
import { resolveHqOperatorActor } from "@/lib/hq/operator-identity";
import { getRoster, type RosterFilters } from "@/lib/hq/access";
import { recordExport } from "@/lib/entitlements-db/writes";

/**
 * Export the current (filtered) roster as CSV or JSON. Auth: HQ cookie.
 * The export is an accountable act — it writes an `export` ledger event
 * (row count + filter, never PII) under the named operator before returning
 * the file.
 */
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const FIELDS = ["tier", "source", "status", "billingState", "batchId"] as const;

function csvCell(v: unknown): string {
  const s = v == null ? "" : String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export async function GET(req: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get(HQ_ACCESS_COOKIE)?.value ?? "";
  const valid = token ? await verifyHqToken(token) : false;
  if (!valid) return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });

  const url = new URL(req.url);
  const format = url.searchParams.get("format") === "json" ? "json" : "csv";
  const filters: RosterFilters = { limit: 5000 };
  for (const f of FIELDS) {
    const v = url.searchParams.get(f);
    if (v) (filters as Record<string, string>)[f] = v;
  }

  const roster = await getRoster(filters);
  if (!roster.ok) {
    return NextResponse.json({ ok: false, error: roster.error }, { status: 503 });
  }
  const rows = roster.data;
  const filterSummary =
    FIELDS.filter((f) => (filters as Record<string, string>)[f])
      .map((f) => `${f}=${(filters as Record<string, string>)[f]}`)
      .join(" ") || "all";

  // Audit the export under the named operator. If identity can't be resolved,
  // refuse the export rather than emit an unattributed data pull.
  try {
    const actor = await resolveHqOperatorActor();
    await recordExport({ actor, rowCount: rows.length, format, filterSummary, origin: "hq" });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "no operator" },
      { status: 403 },
    );
  }

  const stamp = new Date().toISOString().slice(0, 10);
  if (format === "json") {
    return new NextResponse(JSON.stringify(rows, null, 2), {
      headers: {
        "content-type": "application/json",
        "content-disposition": `attachment; filename="roster-${stamp}.json"`,
      },
    });
  }

  const header = [
    "userClerkId",
    "tier",
    "source",
    "status",
    "billingState",
    "paid",
    "expiresAt",
    "batchId",
    "grantedAt",
  ];
  const lines = [header.join(",")];
  for (const r of rows) {
    lines.push(
      [
        r.userClerkId,
        r.tierLabel,
        r.source,
        r.status,
        r.billingState ?? "",
        r.paid ? "paid" : "comp",
        r.expiresAt ? new Date(r.expiresAt).toISOString() : "",
        r.batchId ?? "",
        new Date(r.grantedAt).toISOString(),
      ]
        .map(csvCell)
        .join(","),
    );
  }
  return new NextResponse(lines.join("\n"), {
    headers: {
      "content-type": "text/csv",
      "content-disposition": `attachment; filename="roster-${stamp}.csv"`,
    },
  });
}
