#!/usr/bin/env tsx
/**
 * Demonstration-imagery provenance check (E09.08).
 *
 * D-012 point 2 replaced licensed stock with generation, which deleted the
 * licence file and with it the only artifact that used to answer "where did
 * this picture come from". `src/lib/demonstration-imagery/register.json` is
 * the replacement. This script is what makes it a control rather than a
 * document: it fails the build when the register and the repository disagree.
 *
 * What it proves, in order:
 *
 *   1. The register validates against the schema, strictly. Unknown keys are
 *      failures, not warnings, because a typo'd `containsFaces` field would
 *      silently disable the R-011 rule.
 *   2. Every registered file exists at its declared path, in its declared
 *      repo, with the declared byte length and the declared sha256. A hash
 *      mismatch means the file on disk is not the file that was reviewed.
 *   3. No asset with `containsFaces: true` is permitted on a surface whose
 *      `facesPolicy` is `forbidden`. That is R-011's mitigation, expressed as
 *      an assertion instead of as advice.
 *   4. A generated face on a `founder-note-required` surface carries a written
 *      founder acceptance note. Creative gate criterion 11.
 *   5. Nothing whose review verdict is `pending` or `rejected` is referenced
 *      from any source file.
 *   6. Every raster reachable from a demonstration surface has a register
 *      entry. This is the criterion the data gate actually asks for, and it is
 *      the one that cannot be satisfied by writing a document.
 *   7. Alt text and captions carry no term from the E09.10 never-list, no em
 *      dash and no exclamation mark. E09.10 section 1 binds alt text
 *      explicitly, and the one alt-text file that exists in the workspace
 *      today already breaks it.
 *   8. Acknowledged non-demonstration rasters, which are real material and
 *      not generated, still hash to what was audited and appear on no
 *      demonstration surface.
 *
 * Usage:
 *   tsx scripts/check-demonstration-imagery.ts            report, exit 1 on failure
 *   tsx scripts/check-demonstration-imagery.ts --report   report, always exit 0
 *   tsx scripts/check-demonstration-imagery.ts --json     machine-readable
 *
 * Read-only. It never writes the register.
 */

import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  ALLOWED_MEDIA_TYPES,
  ASSET_DIRECTORIES,
  CAPTION_RULES,
  FACES_POLICIES,
  KNOWN_REPOS,
  REGISTER,
  REGISTER_SCHEMA_VERSION,
  REVIEW_VERDICTS,
  SHOT_STATUSES,
  SUBJECT_CLASSES,
  type ImageAsset,
  type KnownRepo,
} from "@/lib/demonstration-imagery/registry";

const STUDIO_ROOT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const WORKSPACE_ROOT = path.resolve(STUDIO_ROOT, "..");

const REPO_ROOTS: Record<KnownRepo, string> = {
  app: path.join(WORKSPACE_ROOT, "app"),
  studio: STUDIO_ROOT,
  "signal-motion": path.join(WORKSPACE_ROOT, "signal-motion"),
};

/**
 * Directories a demonstration image can be served from. Used by the coverage
 * sweep in step 6.
 */
const PUBLIC_ROOTS: ReadonlyArray<{ repo: KnownRepo; dir: string }> = [
  { repo: "app", dir: "public" },
  { repo: "studio", dir: "public" },
  { repo: "signal-motion", dir: "public" },
];

const RASTER = /\.(png|jpe?g|webp|avif|gif|tiff?|bmp|heic)$/i;

/**
 * Source trees whose files can cause an image to appear in front of a person.
 * A raster referenced from one of these AND living under a demonstration
 * directory must be registered.
 */
const SOURCE_TREES: ReadonlyArray<{ repo: KnownRepo; dir: string }> = [
  { repo: "app", dir: "src" },
  { repo: "studio", dir: "src" },
  { repo: "signal-motion", dir: "src" },
];

const SKIP_DIR =
  /(^|[\\/])(node_modules|\.next|\.git|out|dist|coverage|_wave1-backup[^\\/]*|_premerge-backup[^\\/]*|_wt-[^\\/]*)([\\/]|$)/;

/** E09.10 section 2 master never-list, plus the section 1 never columns that
 *  can plausibly reach an image caption or an alt string. */
const NEVER_TERMS = [
  "forever",
  "for life",
  "lifetime",
  "permanent",
  "perpetual",
  "guaranteed",
  "never expires",
  "in perpetuity",
  "gdpr compliant",
  "fully compliant",
  "legally approved",
  "solicitor-approved",
  "bank-grade",
  "military-grade",
  "100% secure",
  "seats",
  "seat count",
  "allotment",
  "codes remaining",
  "licences allotted",
  "leaderboard",
  "top couples",
  "most active couple",
  "powered by signal studio",
  "white label",
  "turnkey",
  "act now",
  "limited time",
  "exclusive",
  "revolutionise",
  "revolutionize",
  "transform",
  "seamless",
  "effortless",
  "launch partner",
  "founding partner",
  "charter member",
  "early adopter",
  "beta",
  "pilot venue",
];

type Finding = {
  severity: "fail" | "warn";
  rule: string;
  where: string;
  detail: string;
};

const findings: Finding[] = [];
const fail = (rule: string, where: string, detail: string) =>
  findings.push({ severity: "fail", rule, where, detail });
const warn = (rule: string, where: string, detail: string) =>
  findings.push({ severity: "warn", rule, where, detail });

// ── 1. schema ────────────────────────────────────────────────────────────────

function assertKeys(
  where: string,
  value: Record<string, unknown>,
  required: readonly string[],
  optional: readonly string[] = [],
) {
  for (const key of required) {
    if (!(key in value)) fail("schema", where, `missing required key "${key}"`);
  }
  const allowed = new Set([...required, ...optional]);
  for (const key of Object.keys(value)) {
    if (!allowed.has(key)) {
      fail(
        "schema",
        where,
        `unknown key "${key}". Unknown keys are failures: a typo in a rule field silently disables the rule.`,
      );
    }
  }
}

const SHA256 = /^[a-f0-9]{64}$/;
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

function checkSchema() {
  if (REGISTER.schemaVersion !== REGISTER_SCHEMA_VERSION) {
    fail(
      "schema",
      "register.json",
      `schemaVersion is "${REGISTER.schemaVersion}", expected "${REGISTER_SCHEMA_VERSION}"`,
    );
  }
  if (!ISO_DATE.test(REGISTER.updatedAt)) {
    fail("schema", "register.json", `updatedAt "${REGISTER.updatedAt}" is not YYYY-MM-DD`);
  }

  const surfaceIds = new Set<string>();
  for (const surface of REGISTER.surfaces) {
    const where = `surfaces[${surface.id}]`;
    assertKeys(
      where,
      surface as unknown as Record<string, unknown>,
      [
        "id",
        "label",
        "repo",
        "locator",
        "audience",
        "facesPolicy",
        "facesPolicyBasis",
        "captionRule",
        "captionRuleBasis",
        "imageryPermitted",
      ],
      ["imageryProhibitedBasis", "blockedBy"],
    );
    if (surfaceIds.has(surface.id)) fail("schema", where, "duplicate surface id");
    surfaceIds.add(surface.id);
    if (!KNOWN_REPOS.includes(surface.repo)) {
      fail("schema", where, `repo "${surface.repo}" is not one of ${KNOWN_REPOS.join(", ")}`);
    }
    if (!FACES_POLICIES.includes(surface.facesPolicy)) {
      fail("schema", where, `facesPolicy "${surface.facesPolicy}" is not a known policy`);
    }
    if (!CAPTION_RULES.includes(surface.captionRule)) {
      fail("schema", where, `captionRule "${surface.captionRule}" is not a known rule`);
    }
    if (!surface.imageryPermitted && !surface.imageryProhibitedBasis?.trim()) {
      fail(
        "schema",
        where,
        "imageryPermitted is false with no imageryProhibitedBasis. A prohibition without a stated reason is not reviewable.",
      );
    }
  }

  const shotIds = new Set<string>();
  for (const shot of REGISTER.shots) {
    const where = `shots[${shot.id}]`;
    assertKeys(
      where,
      shot as unknown as Record<string, unknown>,
      [
        "id",
        "surfaceIds",
        "title",
        "whyItExists",
        "subjectClass",
        "containsFaces",
        "aspect",
        "minLongEdgePx",
        "prompt",
        "negativePrompt",
        "acceptanceTests",
        "status",
      ],
      ["blockedBy", "founderCall", "compositeNote", "prohibitionNote", "reuseOf"],
    );
    if (shotIds.has(shot.id)) fail("schema", where, "duplicate shot id");
    shotIds.add(shot.id);
    if (!SUBJECT_CLASSES.includes(shot.subjectClass)) {
      fail("schema", where, `subjectClass "${shot.subjectClass}" is not a known class`);
    }
    if (!SHOT_STATUSES.includes(shot.status)) {
      fail("schema", where, `status "${shot.status}" is not a known status`);
    }
    if (!shot.prompt.trim()) {
      fail("prompt", where, "empty prompt. D-012 replaced the licence with the prompt, so the prompt is the provenance.");
    }
    if (!shot.whyItExists.trim()) {
      fail("shot-list", where, "empty whyItExists. A shot with no stated reason is a shot nobody can cut.");
    }
    for (const sid of shot.surfaceIds) {
      if (!surfaceIds.has(sid)) fail("schema", where, `references unknown surface "${sid}"`);
    }
    // R-011 expressed at shot level, before anything is generated.
    for (const sid of shot.surfaceIds) {
      const surface = REGISTER.surfaces.find((s) => s.id === sid);
      if (!surface) continue;
      if (shot.containsFaces && surface.facesPolicy === "forbidden") {
        fail(
          "R-011",
          where,
          `shot declares a face and targets "${sid}", whose facesPolicy is forbidden. ${surface.facesPolicyBasis}`,
        );
      }
      if (!surface.imageryPermitted) {
        fail(
          "surface-policy",
          where,
          `targets "${sid}", which permits no imagery: ${surface.imageryProhibitedBasis ?? ""}`,
        );
      }
    }
    if (shot.reuseOf && !REGISTER.shots.some((s) => s.id === shot.reuseOf)) {
      fail("schema", where, `reuseOf "${shot.reuseOf}" is not a known shot`);
    }
  }

  const assetIds = new Set<string>();
  const assetPaths = new Set<string>();
  for (const asset of REGISTER.assets) {
    const where = `assets[${asset.id}]`;
    assertKeys(
      where,
      asset as unknown as Record<string, unknown>,
      [
        "id",
        "shotId",
        "repo",
        "path",
        "sha256",
        "mediaType",
        "dimensions",
        "bytes",
        "generator",
        "prompt",
        "negativePrompt",
        "generatedOn",
        "rightsPosition",
        "permittedSurfaces",
        "containsFaces",
        "altText",
        "caption",
        "reviewedBy",
        "reviewedOn",
        "reviewVerdict",
        "acceptanceTestsPassed",
      ],
      ["founderAcceptanceNote"],
    );
    if (assetIds.has(asset.id)) fail("schema", where, "duplicate asset id");
    assetIds.add(asset.id);
    const key = `${asset.repo}:${asset.path}`;
    if (assetPaths.has(key)) fail("schema", where, `duplicate path ${key}`);
    assetPaths.add(key);

    if (!shotIds.has(asset.shotId)) fail("schema", where, `references unknown shot "${asset.shotId}"`);
    if (!KNOWN_REPOS.includes(asset.repo)) fail("schema", where, `unknown repo "${asset.repo}"`);
    if (!SHA256.test(asset.sha256)) fail("schema", where, `sha256 "${asset.sha256}" is not 64 lowercase hex`);
    if (!ALLOWED_MEDIA_TYPES.includes(asset.mediaType)) {
      fail("schema", where, `mediaType "${asset.mediaType}" is not allowed`);
    }
    if (!ISO_DATE.test(asset.generatedOn)) fail("schema", where, `generatedOn "${asset.generatedOn}" is not YYYY-MM-DD`);
    if (!ISO_DATE.test(asset.reviewedOn)) fail("schema", where, `reviewedOn "${asset.reviewedOn}" is not YYYY-MM-DD`);
    if (!REVIEW_VERDICTS.includes(asset.reviewVerdict)) {
      fail("schema", where, `reviewVerdict "${asset.reviewVerdict}" is not a known verdict`);
    }
    if (!asset.reviewedBy.trim()) {
      fail(
        "data-gate",
        where,
        "empty reviewedBy. The data gate requires a NAMED reviewer, not a review.",
      );
    }
    if (!asset.generator?.model?.trim()) {
      fail("data-gate", where, "empty generator.model. The gate requires the model to be recorded.");
    }
    if (!asset.prompt.trim()) {
      fail("data-gate", where, "empty prompt. The gate requires the prompt or source to be recorded.");
    }
    if (!asset.rightsPosition.trim()) {
      fail("data-gate", where, "empty rightsPosition.");
    }
    if (!asset.path.startsWith(`${ASSET_DIRECTORIES[asset.repo]}/`)) {
      fail(
        "layout",
        where,
        `path "${asset.path}" is outside the declared demonstration directory for ${asset.repo} (${ASSET_DIRECTORIES[asset.repo]}/). Demonstration imagery lives in one place per repo so the coverage sweep can be exhaustive.`,
      );
    }
    for (const sid of asset.permittedSurfaces) {
      if (!surfaceIds.has(sid)) fail("schema", where, `permittedSurfaces references unknown surface "${sid}"`);
    }
  }
}

// ── 2 and 3. files, hashes, faces ────────────────────────────────────────────

function absoluteFor(repo: KnownRepo, relative: string): string {
  return path.join(REPO_ROOTS[repo], relative.split("/").join(path.sep));
}

function checkAssetFiles() {
  for (const asset of REGISTER.assets) {
    const where = `assets[${asset.id}]`;
    const absolute = absoluteFor(asset.repo, asset.path);
    if (!fs.existsSync(absolute)) {
      fail("file", where, `declared file does not exist: ${asset.repo}/${asset.path}`);
      continue;
    }
    const bytes = fs.readFileSync(absolute);
    const digest = createHash("sha256").update(bytes).digest("hex");
    if (digest !== asset.sha256) {
      fail(
        "hash",
        where,
        `sha256 mismatch. Register says ${asset.sha256}, file is ${digest}. The file on disk is not the file that was reviewed.`,
      );
    }
    if (bytes.length !== asset.bytes) {
      fail("hash", where, `byte length mismatch. Register says ${asset.bytes}, file is ${bytes.length}.`);
    }
    const dims = readDimensions(bytes, asset.path);
    if (dims) {
      if (dims.width !== asset.dimensions.width || dims.height !== asset.dimensions.height) {
        fail(
          "dimensions",
          where,
          `register says ${asset.dimensions.width}x${asset.dimensions.height}, file is ${dims.width}x${dims.height}`,
        );
      }
      const shot = REGISTER.shots.find((s) => s.id === asset.shotId);
      if (shot && Math.max(dims.width, dims.height) < shot.minLongEdgePx) {
        fail(
          "resolution",
          where,
          `long edge ${Math.max(dims.width, dims.height)}px is below the shot's declared minimum ${shot.minLongEdgePx}px`,
        );
      }
    } else {
      warn("dimensions", where, "could not read dimensions from the file header");
    }
  }
}

function checkFacesPolicy() {
  for (const asset of REGISTER.assets) {
    const where = `assets[${asset.id}]`;
    for (const sid of asset.permittedSurfaces) {
      const surface = REGISTER.surfaces.find((s) => s.id === sid);
      if (!surface) continue;
      if (!surface.imageryPermitted) {
        fail("surface-policy", where, `permitted on "${sid}", which permits no imagery`);
      }
      if (asset.containsFaces && surface.facesPolicy === "forbidden") {
        fail(
          "R-011",
          where,
          `contains a generated face and is permitted on "${sid}", whose facesPolicy is forbidden. ${surface.facesPolicyBasis}`,
        );
      }
      if (
        asset.containsFaces &&
        surface.facesPolicy === "founder-note-required" &&
        !asset.founderAcceptanceNote?.trim()
      ) {
        fail(
          "creative-gate",
          where,
          `contains a generated face on "${sid}" with no founderAcceptanceNote. Creative gate criterion 11 requires the founder to have looked at that specific shot and accepted it in writing.`,
        );
      }
    }
  }
}

// ── 4. copy rules on alt text and captions ───────────────────────────────────

function checkCopy() {
  for (const asset of REGISTER.assets) {
    const where = `assets[${asset.id}]`;
    for (const [field, value] of [
      ["altText", asset.altText],
      ["caption", asset.caption],
    ] as const) {
      if (!value.trim()) {
        fail("E09.10", where, `empty ${field}. E09.10 section 1 binds alt text as front-facing copy.`);
        continue;
      }
      const lower = value.toLowerCase();
      for (const term of NEVER_TERMS) {
        if (lower.includes(term)) {
          fail("E09.10", where, `${field} contains never-list term "${term}": ${value}`);
        }
      }
      if (value.includes("—")) {
        fail("E09.10", where, `${field} contains an em dash. Front-facing copy uses a comma, colon or full stop.`);
      }
      if (value.includes("!")) {
        fail("E09.10", where, `${field} contains an exclamation mark, which is banned everywhere front-facing.`);
      }
    }
    const surfaces = asset.permittedSurfaces
      .map((sid) => REGISTER.surfaces.find((s) => s.id === sid))
      .filter((s): s is NonNullable<typeof s> => Boolean(s));
    const needsVisible = surfaces.some((s) => s.captionRule === "visible-caption-required");
    if (needsVisible && !/example venue and couple/i.test(asset.caption)) {
      fail(
        "E09.10-P14",
        where,
        `is permitted on a surface that requires a visible caption, but the caption does not carry the P14 substitute "Example venue and couple." Caption is: ${asset.caption}`,
      );
    }
  }
}

// ── 5 and 6. reference sweep and coverage ────────────────────────────────────

function walk(dir: string, out: string[] = []): string[] {
  let entries: fs.Dirent[];
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (SKIP_DIR.test(full)) continue;
    if (entry.isDirectory()) walk(full, out);
    else out.push(full);
  }
  return out;
}

function sourceBlobs(): Array<{ label: string; text: string }> {
  const blobs: Array<{ label: string; text: string }> = [];
  for (const { repo, dir } of SOURCE_TREES) {
    const root = path.join(REPO_ROOTS[repo], dir);
    for (const file of walk(root)) {
      if (!/\.(tsx?|jsx?|mjs|mts|css|json|html)$/i.test(file)) continue;
      if (RASTER.test(file)) continue;
      // The register names every path it governs. Scanning it would make every
      // acknowledged raster look like it is referenced from a surface.
      if (file.includes(`${path.sep}demonstration-imagery${path.sep}`)) continue;
      let text = "";
      try {
        text = fs.readFileSync(file, "utf8");
      } catch {
        continue;
      }
      blobs.push({ label: `${repo}/${path.relative(REPO_ROOTS[repo], file).split(path.sep).join("/")}`, text });
    }
  }
  return blobs;
}

function checkReferences(blobs: ReturnType<typeof sourceBlobs>) {
  // 5. nothing unaccepted is referenced.
  for (const asset of REGISTER.assets) {
    if (asset.reviewVerdict === "accepted") continue;
    const base = path.posix.basename(asset.path);
    const referrers = blobs.filter((b) => b.text.includes(base)).map((b) => b.label);
    if (referrers.length) {
      fail(
        "review",
        `assets[${asset.id}]`,
        `review verdict is "${asset.reviewVerdict}" but the file is referenced from ${referrers.join(", ")}`,
      );
    }
  }

  // 6. coverage: every raster under a demonstration directory is registered,
  //    and every raster referenced from source that lives under one is too.
  const registered = new Set(REGISTER.assets.map((a) => `${a.repo}:${a.path}`));
  for (const { repo } of PUBLIC_ROOTS) {
    const demoDir = path.join(REPO_ROOTS[repo], ASSET_DIRECTORIES[repo].split("/").join(path.sep));
    if (!fs.existsSync(demoDir)) continue;
    for (const file of walk(demoDir)) {
      if (!RASTER.test(file)) continue;
      const relative = path.relative(REPO_ROOTS[repo], file).split(path.sep).join("/");
      if (!registered.has(`${repo}:${relative}`)) {
        fail(
          "coverage",
          `${repo}/${relative}`,
          "raster sits in the demonstration directory with no register entry. Every demonstration image records model, prompt, source and date, per the data gate.",
        );
      }
    }
  }
}

function checkAcknowledged(blobs: ReturnType<typeof sourceBlobs>) {
  const demoSurfaceIds = new Set(REGISTER.surfaces.map((s) => s.id));
  for (const entry of REGISTER.acknowledgedNonDemonstrationRasters) {
    const where = `acknowledged[${entry.id}]`;
    for (const sid of entry.prohibitedOn) {
      if (!demoSurfaceIds.has(sid)) fail("schema", where, `prohibitedOn references unknown surface "${sid}"`);
    }
    for (const relative of entry.paths) {
      const absolute = absoluteFor(entry.repo, relative);
      if (!fs.existsSync(absolute)) {
        warn("file", where, `declared file no longer exists: ${entry.repo}/${relative}. Remove the entry or restore the file.`);
        continue;
      }
      if (entry.sha256) {
        const digest = createHash("sha256").update(fs.readFileSync(absolute)).digest("hex");
        if (digest !== entry.sha256) {
          fail(
            "hash",
            where,
            `${relative} no longer hashes to the audited value. Register says ${entry.sha256}, file is ${digest}.`,
          );
        }
      }
      // Real material must not reach a demonstration surface.
      const base = path.posix.basename(relative);
      const referrers = blobs
        .filter((b) => b.text.includes(base))
        .map((b) => b.label)
        .filter((label) => !entry.permittedSurfaces.some((p) => label.endsWith(p)));
      if (referrers.length) {
        fail(
          "A-007",
          where,
          `real, non-generated material is referenced from ${referrers.join(", ")}, which is not in its permittedSurfaces. E09.08 confirms that no unapproved real venue or couple material is used on a demonstration surface.`,
        );
      }
    }
  }
}

// ── image header dimensions, no dependencies ─────────────────────────────────

function readDimensions(b: Buffer, name: string): { width: number; height: number } | null {
  const ext = path.posix.extname(name).toLowerCase();
  try {
    if (ext === ".png") {
      if (b.length < 24 || b.readUInt32BE(0) !== 0x89504e47) return null;
      return { width: b.readUInt32BE(16), height: b.readUInt32BE(20) };
    }
    if (ext === ".jpg" || ext === ".jpeg") {
      let o = 2;
      while (o < b.length - 9) {
        if (b[o] !== 0xff) {
          o += 1;
          continue;
        }
        const marker = b[o + 1];
        if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) {
          return { height: b.readUInt16BE(o + 5), width: b.readUInt16BE(o + 7) };
        }
        o += 2 + b.readUInt16BE(o + 2);
      }
      return null;
    }
    if (ext === ".webp") {
      if (b.subarray(0, 4).toString("ascii") !== "RIFF") return null;
      const fmt = b.subarray(12, 16).toString("ascii");
      if (fmt === "VP8X") {
        return { width: (b.readUIntLE(24, 3) & 0xffffff) + 1, height: (b.readUIntLE(27, 3) & 0xffffff) + 1 };
      }
      if (fmt === "VP8 ") return { width: b.readUInt16LE(26) & 0x3fff, height: b.readUInt16LE(28) & 0x3fff };
      if (fmt === "VP8L") {
        const bits = b.readUInt32LE(21);
        return { width: (bits & 0x3fff) + 1, height: ((bits >> 14) & 0x3fff) + 1 };
      }
      return null;
    }
  } catch {
    return null;
  }
  return null;
}

// ── run ──────────────────────────────────────────────────────────────────────

const args = new Set(process.argv.slice(2));
const jsonOut = args.has("--json");
const reportOnly = args.has("--report");

checkSchema();
checkAssetFiles();
checkFacesPolicy();
checkCopy();
const blobs = sourceBlobs();
checkReferences(blobs);
checkAcknowledged(blobs);

const fails = findings.filter((f) => f.severity === "fail");
const warns = findings.filter((f) => f.severity === "warn");

const summary = {
  surfaces: REGISTER.surfaces.length,
  surfacesPermittingImagery: REGISTER.surfaces.filter((s) => s.imageryPermitted).length,
  shots: REGISTER.shots.length,
  shotsWithFaces: REGISTER.shots.filter((s) => s.containsFaces).length,
  shotsGenerated: REGISTER.shots.filter((s) => s.status !== "not_generated").length,
  assets: REGISTER.assets.length,
  assetsAccepted: REGISTER.assets.filter((a: ImageAsset) => a.reviewVerdict === "accepted").length,
  acknowledgedNonDemonstration: REGISTER.acknowledgedNonDemonstrationRasters.length,
  failures: fails.length,
  warnings: warns.length,
};

if (jsonOut) {
  console.log(JSON.stringify({ summary, findings }, null, 2));
} else {
  console.log("Demonstration-imagery provenance check (E09.08)");
  console.log("");
  console.log(`  surfaces declared            ${summary.surfaces} (${summary.surfacesPermittingImagery} permit imagery)`);
  console.log(`  shots declared               ${summary.shots} (${summary.shotsWithFaces} declare a face)`);
  console.log(`  shots generated              ${summary.shotsGenerated}`);
  console.log(`  registered assets            ${summary.assets} (${summary.assetsAccepted} accepted)`);
  console.log(`  acknowledged real rasters    ${summary.acknowledgedNonDemonstration}`);
  console.log("");
  if (!findings.length) {
    console.log("  no findings.");
  }
  for (const f of findings) {
    console.log(`  ${f.severity.toUpperCase()}  [${f.rule}] ${f.where}`);
    console.log(`        ${f.detail}`);
  }
  console.log("");
  console.log(`  ${fails.length} failure(s), ${warns.length} warning(s)`);
  if (summary.assets === 0) {
    console.log("");
    console.log("  Note: no demonstration imagery has been generated yet, so the register");
    console.log("  is a specification and not yet a record. The shot list and the surface");
    console.log("  policy are enforceable now; the asset checks begin the moment the first");
    console.log("  image is committed.");
  }
}

process.exit(reportOnly || fails.length === 0 ? 0 : 1);
