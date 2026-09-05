import { readFile } from "node:fs/promises";
import { NextResponse } from "next/server";
import { csvFilename, pdfFilename, snapshotToCsv } from "@/lib/account/csv";
import { getVenueFixture } from "@/lib/account/fixtures";
import { loadVenueUsageSnapshot as loadVenueAccessSnapshot } from "@/lib/account/live/load-venue-usage";
import { snapshotToReportHtml } from "@/lib/account/pdf-html";
import {
  accountSamplePath,
  isAccountSampleFixture,
  isAccountSampleFormat,
} from "@/lib/account/samples";
import { requireHqAccess } from "@/lib/hq/access-guard";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  await requireHqAccess();

  const url = new URL(request.url);
  const source = url.searchParams.get("source") ?? "fixture";
  const format = url.searchParams.get("format") ?? "";

  if (source === "live") {
    const venue = (url.searchParams.get("venue") ?? "").trim().toLowerCase();
    if (!venue) {
      return new NextResponse("Missing venue.", { status: 400 });
    }
    if (format !== "csv" && format !== "html") {
      return new NextResponse("Unknown live format.", { status: 404 });
    }

    const loaded = await loadVenueAccessSnapshot(venue);
    if (!loaded.ok) {
      return new NextResponse(loaded.error, { status: 404 });
    }

    const snapshot = loaded.snapshot;
    if (format === "csv") {
      const body = snapshotToCsv(snapshot);
      return new NextResponse(body, {
        status: 200,
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="${csvFilename(snapshot)}"`,
          "Cache-Control": "no-store",
          "X-Content-Type-Options": "nosniff",
        },
      });
    }

    const html = snapshotToReportHtml(snapshot);
    const stem = snapshot.reports[0]?.filenameStem ?? "account-access-preview";
    return new NextResponse(html, {
      status: 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Content-Disposition": `attachment; filename="${stem}.html"`,
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  }

  const fixture = url.searchParams.get("fixture") ?? "";
  if (!isAccountSampleFixture(fixture) || !isAccountSampleFormat(format)) {
    return new NextResponse("Unknown sample.", { status: 404 });
  }

  const snapshot = getVenueFixture(fixture);
  const filePath = accountSamplePath(fixture, format);
  let body: Buffer;
  try {
    body = await readFile(filePath);
  } catch {
    return new NextResponse(
      "Sample not generated. Run npm run account:samples.",
      { status: 404 },
    );
  }

  const filename =
    format === "pdf" ? pdfFilename(snapshot) : csvFilename(snapshot);
  const contentType =
    format === "pdf" ? "application/pdf" : "text/csv; charset=utf-8";

  return new NextResponse(new Uint8Array(body), {
    status: 200,
    headers: {
      "Content-Type": contentType,
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
