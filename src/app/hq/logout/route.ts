import { NextResponse } from "next/server";
import { HQ_ACCESS_COOKIE } from "@/lib/hq/auth";

export function POST(request: Request) {
  const response = NextResponse.redirect(new URL("/hq/access", request.url), {
    status: 303,
  });

  response.cookies.set({
    name: HQ_ACCESS_COOKIE,
    value: "",
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/hq",
    maxAge: 0,
  });

  return response;
}
