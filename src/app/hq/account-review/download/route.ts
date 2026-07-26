import { readFile } from "node:fs/promises";
import { NextResponse } from "next/server";
import {
  csvFilename,
  pdfFilename,
} from "@/lib/account/csv";
import { getVenueFixture } from "@/lib/account/fixtures";
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
  const fixture = url.searchParams.get("fixture") ?? "";
  const format = url.searchParams.get("format") ?? "";

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
      "Sample not generated. Run pnpm account:samples.",
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
