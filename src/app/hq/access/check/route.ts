import { NextResponse } from "next/server";
import {
  createHqAccessToken,
  HQ_ACCESS_COOKIE,
  HQ_ACCESS_MAX_AGE,
  verifyHqPassword,
} from "@/lib/hq/auth";

export async function POST(request: Request) {
  const formData = await request.formData();
  const password = String(formData.get("password") ?? "");
  const from = String(formData.get("from") ?? "/hq");
  const isValid = await verifyHqPassword(password);
  const redirectUrl = new URL(isValid ? from : "/hq/access?error=1", request.url);

  if (!redirectUrl.pathname.startsWith("/hq")) {
    redirectUrl.pathname = "/hq";
    redirectUrl.search = "";
  }

  const response = NextResponse.redirect(redirectUrl, { status: 303 });

  if (isValid) {
    response.cookies.set({
      name: HQ_ACCESS_COOKIE,
      value: await createHqAccessToken(),
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      path: "/hq",
      maxAge: HQ_ACCESS_MAX_AGE,
    });
  }

  return response;
}
