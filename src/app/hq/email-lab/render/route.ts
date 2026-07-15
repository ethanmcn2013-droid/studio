import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { HQ_ACCESS_COOKIE, verifyHqToken } from "@/lib/hq/auth";
import { DIRECTION_IDS, type DirectionId } from "@/emails/directions";
import { blockImages, forceDark, renderEmail } from "@/emails/render";

export const dynamic = "force-dynamic";

/**
 * GET /hq/email-lab/render
 *   ?template=auth.sign-in-code
 *   &direction=hairline|broadsheet|letterhead
 *   &fixture=default
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

  if (!DIRECTION_IDS.includes(directionParam as DirectionId)) {
    return new NextResponse(`Unknown direction: ${directionParam}`, { status: 400 });
  }

  let rendered;
  try {
    rendered = await renderEmail(templateId, directionParam as DirectionId, fixtureId);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Render failed";
    return new NextResponse(message, { status: 400 });
  }

  if (params.get("view") === "text") {
    return new NextResponse(rendered.text, {
      headers: {
        "content-type": "text/plain; charset=utf-8",
        "x-robots-tag": "noindex",
      },
    });
  }

  let html = rendered.html;
  if (params.get("dark") === "1") html = forceDark(html);
  if (params.get("images") === "0") html = blockImages(html);

  return new NextResponse(html, {
    headers: {
      "content-type": "text/html; charset=utf-8",
      "x-robots-tag": "noindex",
    },
  });
}
