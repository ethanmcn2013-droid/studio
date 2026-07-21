import "server-only";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { HQ_ACCESS_COOKIE, verifyHqToken } from "@/lib/hq/auth";
import { getProspectsBySegment } from "@/lib/hq/crm-db";
import {
  type BookFilters,
  emailsOf,
  filterBook,
  normalizeCountry,
  toCsv,
} from "@/lib/hq/crm-utils";
import { PROSPECT_COUNTRIES } from "@/lib/db/schema";

/**
 * On-demand export for the schools book (2026-07-20).
 *
 * The bulk bar's "Copy emails" and "Export CSV" hit this route instead of
 * shipping the whole filtered set inside the page payload — so the schools
 * list stays light even at 3,000+ England rows. Auth is the same HQ cookie
 * that gates /hq; the route re-derives the filtered set from the querystring
 * (identical logic to the page) and returns either a de-duplicated email list
 * (text) or a mail-merge CSV (download).
 *
 *   /api/internal/prospects/export-schools?country=GB-ENG&county=Kent&format=csv
 */
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(req: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get(HQ_ACCESS_COOKIE)?.value ?? "";
  if (!token || !(await verifyHqToken(token))) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const url = new URL(req.url);
  const p = url.searchParams;
  const rawCountry = p.get("country") ?? "all";
  const country =
    rawCountry !== "all" &&
    (PROSPECT_COUNTRIES as readonly string[]).includes(rawCountry)
      ? normalizeCountry(rawCountry)
      : undefined;

  const filters: BookFilters = {
    country: (rawCountry as BookFilters["country"]) || "all",
    county: p.get("county")?.trim() || "all",
    category: p.get("category")?.trim() || "all",
    flag: p.get("flag")?.trim() || "all",
    stage: (p.get("stage")?.trim() as BookFilters["stage"]) || "all",
    search: p.get("q")?.trim() ?? "",
  };
  const format = p.get("format") === "emails" ? "emails" : "csv";

  const rows = filterBook(await getProspectsBySegment("school", country), filters);

  if (format === "emails") {
    return new NextResponse(emailsOf(rows).join(", "), {
      headers: { "content-type": "text/plain; charset=utf-8" },
    });
  }

  const stamp = (rawCountry === "all" ? "all" : rawCountry).toLowerCase();
  return new NextResponse(toCsv(rows), {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": `attachment; filename="signal-schools-${stamp}-${rows.length}.csv"`,
    },
  });
}
