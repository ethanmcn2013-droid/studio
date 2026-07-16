import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { HQ_ACCESS_COOKIE, verifyHqToken } from "@/lib/hq/auth";
import { DIRECTION_IDS, type DirectionId } from "@/emails/directions";
import { blockImages, forceDark, renderEmail } from "@/emails/render";

export const dynamic = "force-dynamic";

/**
 * GET /hq/email-lab/render
 *   ?template=auth.sign-in-code
 *   &direction=hairline|broadsheet|letterhead
 *   &fixture=default
 *   &rev=v2|v1     v2 renders live code; v1 serves the frozen archive in
 *                  docs/email-system/renders (default fixture only)
 *   &dark=1        force the dark-scheme styles on (review simulation)
 *   &images=0      strip img sources so alt text carries the message
 *   &view=text     serve the plain-text alternative instead of HTML
 *
 * Internal review surface behind the HQ cookie. Never a send path.
 */
export async function GET(request: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get(HQ_ACCESS_COOKIE)?.value ?? "";
  const valid = token ? await verifyHqToken(token) : false;
  if (!valid) {
    return new NextResponse("Signal HQ access required. Sign in at /hq/access.", {
      status: 403,
      headers: { "content-type": "text/plain; charset=utf-8" },
    });
  }

  const params = request.nextUrl.searchParams;
  const templateId = params.get("template") ?? "auth.sign-in-code";
  const directionParam = params.get("direction") ?? "hairline";
  const fixtureId = params.get("fixture") ?? "default";
  const rev = params.get("rev") === "v1" ? "v1" : "v2";

  if (!DIRECTION_IDS.includes(directionParam as DirectionId)) {
    return new NextResponse(`Unknown direction: ${directionParam}`, { status: 400 });
  }

  let html: string;
  let text: string;
  let subject = "";
  let preheader = "";

  if (rev === "v1") {
    // The frozen v1 archive: committed evidence, default fixture only.
    const stem = `${templateId.replace(/\./g, "_")}--${directionParam}`;
    const base = path.join(process.cwd(), "docs", "email-system", "renders");
    try {
      [html, text] = await Promise.all([
        readFile(path.join(base, "html", `${stem}.html`), "utf8"),
        readFile(path.join(base, "text", `${stem}.txt`), "utf8"),
      ]);
    } catch {
      return new NextResponse(
        `No v1 archive for ${templateId} in ${directionParam}.`,
        { status: 404 },
      );
    }
  } else {
    let rendered;
    try {
      rendered = await renderEmail(templateId, directionParam as DirectionId, fixtureId);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Render failed";
      return new NextResponse(message, { status: 400 });
    }
    html = rendered.html;
    text = rendered.text;
    subject = rendered.subject;
    preheader = rendered.preheader;
  }

  if (params.get("view") === "text") {
    const body =
      rev === "v1" || !subject
        ? text
        : `Subject: ${subject}\nPreheader: ${preheader}\n\n${text}`;
    return new NextResponse(body, {
      headers: {
        "content-type": "text/plain; charset=utf-8",
        "x-robots-tag": "noindex",
      },
    });
  }

  if (params.get("dark") === "1") html = forceDark(html);
  if (params.get("images") === "0") html = blockImages(html);

  return new NextResponse(html, {
    headers: {
      "content-type": "text/html; charset=utf-8",
      "x-robots-tag": "noindex",
    },
  });
}
