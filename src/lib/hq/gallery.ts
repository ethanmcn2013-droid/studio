import fs from "node:fs/promises";
import path from "node:path";

/**
 * The Gallery · every graphic asset Signal Studio has produced, in one place.
 *
 * Read from disk at request time rather than from a hand-kept list, so the
 * room cannot drift from `public/brand/collateral/`. Drop a file in a set
 * folder and it appears; delete one and it goes. The alt text each set ships
 * beside its files (`alt-text.txt`) is parsed and attached to the asset it
 * belongs to, so a caption can be copied straight into a post.
 *
 * Server-only: uses `node:fs`. Rooms that need this import it from a server
 * component (`/hq/gallery`), never from client code.
 */

export type GalleryAsset = {
  /** File name as it sits on disk, e.g. "a01-its-live-ig-square.png". */
  file: string;
  /** Public href, e.g. "/brand/collateral/launch/a01-…png". */
  href: string;
  /** Set folder key, e.g. "launch". */
  set: string;
  /** Short code parsed from the file name where the set uses one (A01, n01). */
  code: string | null;
  /** Platform/size label parsed from the file-name suffix. */
  size: string | null;
  /** "png" | "pdf" | "svg" | "jpg" */
  ext: string;
  bytes: number;
  /** Alt text from the set's alt-text.txt, when it carries one for this code. */
  alt: string | null;
};

export type GallerySet = {
  key: string;
  name: string;
  note: string;
  assets: GalleryAsset[];
};

export type Gallery = {
  sets: GallerySet[];
  total: number;
  bytes: number;
};

const ROOT = path.join(process.cwd(), "public", "brand", "collateral");
const IMAGE_EXT = new Set([".png", ".jpg", ".jpeg", ".svg", ".pdf"]);

/** Display order and gloss. A folder not listed here still shows, at the end. */
const SETS: Array<{ key: string; name: string; note: string }> = [
  {
    key: "launch",
    name: "Launch set",
    note: "The launch bank, drawn from the master-suite redesign: carousels, feature moments, objections, stories, link cards, the countdown, and the profile set.",
  },
  {
    key: "social",
    name: "Social system",
    note: "The first social system — numbers, beliefs, before-and-after, the founder note, and end cards. Sequenced for posting in the Posting Queue.",
  },
  {
    key: "venue",
    name: "Venue kit",
    note: "The founder-signed material a venue actually touches: one-pager, deck, pricing explainer, permission form.",
  },
  {
    key: "identity",
    name: "Identity",
    note: "Letterhead, founder and café cards, email signature, campaign poster.",
  },
  {
    key: "cards",
    name: "Cards",
    note: "Partner-card directions and the proof order trio, print and preview.",
  },
  {
    key: "ambassador",
    name: "Ambassador kit",
    note: "Welcome, onboarding, campaign, AGM, ball and trip pieces for society ambassadors.",
  },
  {
    key: "explorations",
    name: "Explorations",
    note: "Retained directions kept for reference. Not a posting set — the Asset curator marks which belong to the brand.",
  },
];

/** File-name suffix → the platform slot it was cut for. */
const SIZES: Array<[string, string]> = [
  ["ig-square", "Instagram square"],
  ["ig-portrait", "Instagram portrait"],
  ["ig-story", "Instagram story"],
  ["li-landscape", "LinkedIn landscape"],
  ["li-square", "LinkedIn square"],
  ["li-company-banner", "LinkedIn company banner"],
  ["li-personal-banner", "LinkedIn banner"],
  ["x-header", "X header"],
  ["avatar", "Avatar"],
  ["og", "Link card"],
  ["print", "Print"],
  ["screen", "Screen"],
  ["preview", "Preview"],
];

function sizeOf(stem: string): string | null {
  // Longest suffix wins, so "li-company-banner" is not read as "li-square".
  const ordered = [...SIZES].sort((a, b) => b[0].length - a[0].length);
  for (const [suffix, label] of ordered) {
    if (stem === suffix || stem.endsWith(`-${suffix}`)) return label;
  }
  return null;
}

/**
 * Parse a set's alt-text.txt into code → text.
 * Both sets use the same shape: an indented "[code] text" line per asset.
 */
function parseAltText(raw: string): Map<string, string> {
  const out = new Map<string, string>();
  for (const line of raw.split("\n")) {
    const m = line.match(/^\s*\[([^\]]+)\]\s*(.+)$/);
    if (m) out.set(m[1].trim().toLowerCase(), m[2].trim());
  }
  return out;
}

/** A code matches when it appears as a whole dash-delimited chunk of the stem. */
function codeIn(stem: string, codes: Iterable<string>): string | null {
  const parts = stem.toLowerCase().split("-");
  for (const code of codes) {
    const c = code.toLowerCase();
    if (parts.includes(c)) return code;
    // Launch files lead with their code: "a01-its-live-ig-square".
    if (parts[0] === c) return code;
  }
  return null;
}

async function readSet(key: string): Promise<GalleryAsset[]> {
  const dir = path.join(ROOT, key);
  let entries: string[];
  try {
    entries = await fs.readdir(dir);
  } catch {
    return [];
  }

  let alts = new Map<string, string>();
  if (entries.includes("alt-text.txt")) {
    try {
      alts = parseAltText(await fs.readFile(path.join(dir, "alt-text.txt"), "utf8"));
    } catch {
      /* a set without readable alt text still lists its files */
    }
  }
  const codes = [...alts.keys()];

  const assets: GalleryAsset[] = [];
  for (const file of entries.sort()) {
    const ext = path.extname(file).toLowerCase();
    if (!IMAGE_EXT.has(ext)) continue;
    let bytes = 0;
    try {
      bytes = (await fs.stat(path.join(dir, file))).size;
    } catch {
      continue;
    }
    const stem = path.basename(file, ext);
    const code = codeIn(stem, codes);
    assets.push({
      file,
      href: `/brand/collateral/${key}/${file}`,
      set: key,
      code: code ? code.toUpperCase() : null,
      size: sizeOf(stem),
      ext: ext.slice(1),
      bytes,
      alt: code ? (alts.get(code.toLowerCase()) ?? null) : null,
    });
  }
  return assets;
}

export async function readGallery(): Promise<Gallery> {
  let folders: string[] = [];
  try {
    const dirents = await fs.readdir(ROOT, { withFileTypes: true });
    folders = dirents.filter((d) => d.isDirectory()).map((d) => d.name);
  } catch {
    return { sets: [], total: 0, bytes: 0 };
  }

  const known = SETS.filter((s) => folders.includes(s.key));
  const extra = folders
    .filter((f) => !SETS.some((s) => s.key === f))
    .sort()
    .map((key) => ({ key, name: key, note: "Not yet described in the gallery index." }));

  const sets: GallerySet[] = [];
  for (const meta of [...known, ...extra]) {
    const assets = await readSet(meta.key);
    if (assets.length > 0) sets.push({ ...meta, assets });
  }

  const total = sets.reduce((n, s) => n + s.assets.length, 0);
  const bytes = sets.reduce(
    (n, s) => n + s.assets.reduce((m, a) => m + a.bytes, 0),
    0,
  );
  return { sets, total, bytes };
}

export function formatBytes(bytes: number): string {
  if (bytes >= 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  return `${Math.round(bytes / 1024)} KB`;
}
