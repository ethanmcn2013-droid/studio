import fs from "node:fs/promises";
import path from "node:path";

/**
 * Signal Atlas — repo-backed system documentation.
 *
 * Each entry lives at content/atlas/<slug>.md with frontmatter:
 *   title, slug, lens, owner, lastVerified (YYYY-MM-DD), links[], summary, status
 *
 * Body is plain markdown with fixed top-level sections in order:
 *   ## WHAT / ## WHO / ## WHERE / ## HOW / ## WHEN — current state / ## WHY
 *
 * Design intent: the atlas is a forcing function, not a snapshot. Entries
 * untouched for STALE_THRESHOLD_DAYS surface a stale flag. Fix the entry,
 * then the code — reverses the usual rot direction.
 */

export const STALE_THRESHOLD_DAYS = 60;

export type AtlasLens = "Products" | "Processes" | "Data Flows";

export type AtlasStatus = "stub" | "partial" | "complete";

export type AtlasFrontmatter = {
  title: string;
  slug: string;
  lens: AtlasLens;
  owner: string;
  lastVerified: string;
  links: string[];
  tags: string[];
  references: string[];
  summary: string;
  status: AtlasStatus;
  pinned: boolean;
  execWhat: string;
  execMatters: string;
  execRisk: string;
};

export type AtlasEntry = AtlasFrontmatter & {
  body: string;
  ageDays: number;
  isStale: boolean;
  isDrifted: boolean;
  driftedRefs: string[];
};

/**
 * Optional sidecar at content/atlas/_drift.json — written by the v2
 * drift-trigger when files referenced by an entry change in git.
 * Shape: { "<slug>": { "drifted": ["path", ...], "updatedAt": "ISO" } }
 * Missing file / missing slug = no drift detected.
 */
export type DriftSidecar = Record<
  string,
  { drifted: string[]; updatedAt?: string }
>;

const LENSES: AtlasLens[] = ["Products", "Processes", "Data Flows"];

function parseFrontmatter(raw: string): { fm: Record<string, unknown>; body: string } {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) {
    throw new Error("Atlas entry is missing frontmatter block.");
  }
  const fmRaw = match[1];
  const body = match[2].trim();
  const fm: Record<string, unknown> = {};

  for (const line of fmRaw.split("\n")) {
    const kv = line.match(/^([a-zA-Z][a-zA-Z0-9_]*):\s*(.*)$/);
    if (!kv) continue;
    const key = kv[1];
    let value: unknown = kv[2].trim();
    if (typeof value === "string") {
      if (value.startsWith("[") && value.endsWith("]")) {
        const inner = value.slice(1, -1).trim();
        value = inner
          ? inner.split(",").map((s) => s.trim().replace(/^["']|["']$/g, ""))
          : [];
      } else if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
    }
    fm[key] = value;
  }
  return { fm, body };
}

function ageInDays(dateStr: string): number {
  const d = new Date(`${dateStr}T12:00:00Z`);
  if (Number.isNaN(d.getTime())) return Infinity;
  const ms = Date.now() - d.getTime();
  return Math.max(0, Math.floor(ms / (1000 * 60 * 60 * 24)));
}

const STATUSES: AtlasStatus[] = ["stub", "partial", "complete"];

function arrayField(fm: Record<string, unknown>, key: string): string[] {
  const raw = fm[key];
  return Array.isArray(raw) ? raw.map(String) : [];
}

async function readDriftSidecar(): Promise<DriftSidecar> {
  try {
    const raw = await fs.readFile(
      path.join(process.cwd(), "content", "atlas", "_drift.json"),
      "utf-8",
    );
    const parsed = JSON.parse(raw) as unknown;
    if (parsed && typeof parsed === "object") {
      return parsed as DriftSidecar;
    }
  } catch {
    // Sidecar is optional — absence means no drift detected.
  }
  return {};
}

function toEntry(fm: Record<string, unknown>, body: string, fileSlug: string): AtlasEntry {
  const title = String(fm.title ?? fileSlug);
  const slug = String(fm.slug ?? fileSlug);
  const lensValue = String(fm.lens ?? "Processes");
  const lens = (LENSES.includes(lensValue as AtlasLens) ? lensValue : "Processes") as AtlasLens;
  const owner = String(fm.owner ?? "Ethan");
  const lastVerified = String(fm.lastVerified ?? "");
  const links = arrayField(fm, "links");
  const tags = arrayField(fm, "tags");
  const references = arrayField(fm, "references");
  const summary = String(fm.summary ?? "");
  const statusValue = String(fm.status ?? "complete");
  const status = (STATUSES.includes(statusValue as AtlasStatus)
    ? (statusValue as AtlasStatus)
    : "complete") as AtlasStatus;
  const pinned = fm.pinned === true || fm.pinned === "true";
  const execWhat = String(fm.execWhat ?? "");
  const execMatters = String(fm.execMatters ?? "");
  const execRisk = String(fm.execRisk ?? "");
  const ageDays = lastVerified ? ageInDays(lastVerified) : Infinity;
  const isStale = ageDays > STALE_THRESHOLD_DAYS;

  return {
    title,
    slug,
    lens,
    owner,
    lastVerified,
    links,
    tags,
    references,
    summary,
    status,
    pinned,
    execWhat,
    execMatters,
    execRisk,
    body,
    ageDays,
    isStale,
    isDrifted: false,
    driftedRefs: [],
  };
}

export async function readAtlasEntries(): Promise<AtlasEntry[]> {
  const dir = path.join(process.cwd(), "content", "atlas");
  let files: string[];
  try {
    files = await fs.readdir(dir);
  } catch {
    return [];
  }
  const mdFiles = files.filter((f) => f.endsWith(".md") && f !== "README.md");
  const [drift, entries] = await Promise.all([
    readDriftSidecar(),
    Promise.all(
      mdFiles.map(async (file) => {
        const raw = await fs.readFile(path.join(dir, file), "utf-8");
        const { fm, body } = parseFrontmatter(raw);
        return toEntry(fm, body, file.replace(/\.md$/, ""));
      }),
    ),
  ]);
  for (const entry of entries) {
    const drifted = drift[entry.slug]?.drifted ?? [];
    if (drifted.length > 0) {
      entry.isDrifted = true;
      entry.driftedRefs = drifted;
    }
  }
  // Stable order: lens (canonical) → drifted entries float up (truth age
  // is the strongest signal — fix these first) → recency → title.
  return entries.sort((a, b) => {
    const la = LENSES.indexOf(a.lens);
    const lb = LENSES.indexOf(b.lens);
    if (la !== lb) return la - lb;
    if (a.isDrifted !== b.isDrifted) return a.isDrifted ? -1 : 1;
    if (a.ageDays !== b.ageDays) return a.ageDays - b.ageDays;
    return a.title.localeCompare(b.title);
  });
}

export function findPinned(entries: AtlasEntry[]): AtlasEntry | null {
  return entries.find((e) => e.pinned) ?? null;
}

export function findMostRecentlyVerified(entries: AtlasEntry[]): AtlasEntry | null {
  const dated = entries.filter((e) => Number.isFinite(e.ageDays));
  if (dated.length === 0) return null;
  return dated.reduce((a, b) => (a.ageDays <= b.ageDays ? a : b));
}

export async function readAtlasEntry(slug: string): Promise<AtlasEntry | null> {
  const all = await readAtlasEntries();
  return all.find((e) => e.slug === slug) ?? null;
}

export function groupByLens(entries: AtlasEntry[]): Record<AtlasLens, AtlasEntry[]> {
  const groups: Record<AtlasLens, AtlasEntry[]> = {
    Products: [],
    Processes: [],
    "Data Flows": [],
  };
  for (const entry of entries) {
    groups[entry.lens].push(entry);
  }
  return groups;
}

export const LENS_ORDER = LENSES;
