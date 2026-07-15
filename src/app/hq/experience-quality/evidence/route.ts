import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { HQ_ACCESS_COOKIE, verifyHqToken } from "@/lib/hq/auth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get(HQ_ACCESS_COOKIE)?.value ?? "";
  if (!token || !(await verifyHqToken(token))) return new NextResponse("Unauthorized", { status: 401 });

  const url = new URL(request.url);
  const kind = url.searchParams.get("kind");
  const file = url.searchParams.get("file") ?? "";
  if (!file || file.includes("..") || path.isAbsolute(file)) return new NextResponse("Invalid evidence path", { status: 400 });
  const root = process.cwd();
  const base = kind === "baseline" ? path.join(root, "experience") : path.join(root, "experience", "output");
  const target = path.resolve(base, file.replaceAll("/", path.sep));
  if (!target.startsWith(`${path.resolve(base)}${path.sep}`) || !existsSync(target) || path.extname(target) !== ".png") {
    return new NextResponse("Evidence not found", { status: 404 });
  }
  return new NextResponse(readFileSync(target), {
    headers: { "Content-Type": "image/png", "Cache-Control": "private, no-store" },
  });
}
