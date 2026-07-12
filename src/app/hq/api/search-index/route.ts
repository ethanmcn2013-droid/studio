import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { readAtlasEntries } from "@/lib/atlas/loader";
import { HQ_ACCESS_COOKIE, verifyHqToken } from "@/lib/hq/auth";
import { readHqSection } from "@/lib/hq/markdown";
import { VAULT } from "@/lib/hq/vault";

export const dynamic = "force-dynamic";

/**
 * The record index behind the command palette (docs/HQ_ARCHITECTURE.md
 * §5.8). Rooms live client-side in the registry; this endpoint serves the
 * searchable records — decisions, operator to-dos, vault documents, atlas
 * entries — so ⌘K reaches content, not just destinations.
 *
 * Guarded: vault titles are confidential, so this never ships in a public
 * asset. Markdown-as-source means content changes redeploy; reads are
 * request-cached upstream (readHqSection uses React cache), and the
 * payload is ~100 small rows.
 */

type IndexRecord = {
  label: string;
  hint: string;
  href: string;
  keywords?: string;
};

export async function GET() {
  const token = (await cookies()).get(HQ_ACCESS_COOKIE)?.value ?? "";
  if (!token || !(await verifyHqToken(token))) {
    return NextResponse.json({ error: "locked" }, { status: 401 });
  }

  const [decisions, todos, atlas] = await Promise.all([
    readHqSection("decisions"),
    readHqSection("operator-todos"),
    readAtlasEntries(),
  ]);

  const records: IndexRecord[] = [
    ...decisions.map((entry) => ({
      label: String(entry.fm.title ?? entry.fm.id),
      hint: `decision · ${String(entry.fm.status ?? "logged").toLowerCase()}`,
      href: `/hq/decisions/${entry.filename.replace(/\.md$/, "")}`,
      keywords: `decision ${String(entry.fm.category ?? "")}`,
    })),
    ...todos
      .filter((entry) => String(entry.fm.status) === "open")
      .map((entry) => ({
        label: String(entry.fm.title ?? entry.fm.id),
        hint: `operator to-do · ${String(entry.fm.priority ?? "open").toLowerCase()}`,
        href: typeof entry.fm.href === "string" && entry.fm.href ? entry.fm.href : "/hq",
        keywords: "todo gate blocked operator founder",
      })),
    ...VAULT.flatMap((domain) =>
      domain.items
        .filter((item) => item.slug || item.href)
        .map((item) => ({
          label: item.title,
          hint: `vault · ${domain.label.toLowerCase()}`,
          href: item.slug ? `/hq/vault/${item.slug}` : (item.href as string),
          keywords: `document ${domain.label}`,
        })),
    ),
    ...atlas.map((entry) => ({
      label: entry.title,
      hint: `atlas · ${entry.lens.toLowerCase()}`,
      href: `/hq/atlas/${entry.slug}`,
      keywords: "system atlas infrastructure",
    })),
  ];

  return NextResponse.json({ records });
}
