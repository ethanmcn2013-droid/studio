import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import {
  createHqAccessToken,
  getHqPassword,
  HQ_ACCESS_COOKIE,
} from "@/lib/hq/auth";

const PUBLIC_HQ_PATHS = ["/hq/access", "/hq/logout"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (PUBLIC_HQ_PATHS.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  const password = getHqPassword();
  const accessCookie = request.cookies.get(HQ_ACCESS_COOKIE)?.value;

  if (password && accessCookie === (await createHqAccessToken(password))) {
    return NextResponse.next();
  }

  const accessUrl = request.nextUrl.clone();
  accessUrl.pathname = "/hq/access";
  accessUrl.searchParams.set("from", pathname);

  return NextResponse.redirect(accessUrl);
}

export const config = {
  matcher: ["/hq/:path*"],
};
