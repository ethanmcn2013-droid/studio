/**
 * The demonstration-imagery provenance register.
 *
 * D-012 point 2 replaced licensed stock photography with generation on a zero
 * budget. That removes the licence file, which was the artifact that used to
 * answer "where did this picture come from". This register is what replaces
 * it: every demonstration image records the model that made it, the prompt it
 * was made from, the date, the rights position, the surfaces it is allowed on,
 * whether it contains a face, and who looked at it and said yes.
 *
 * The data gate (evidence/gates/data.json, criterion 11) names this register
 * as required evidence. The creative gate (criterion 11) requires that every
 * shot containing a generated human face is listed. R-011's mitigation is that
 * generated imagery is a first-class QA item, not a background asset, so the
 * register is validated mechanically by
 * `studio/scripts/check-demonstration-imagery.ts` rather than being a document
 * somebody is trusted to have kept current.
 *
 * The register is deliberately declarative and has no imports. It is read by
 * the check script, and it may be read by a surface that needs to render the
 * P14 caption next to an image. It is never written by code.
 *
 * Adding an image is four steps and the check script fails if any is skipped:
 *   1. Write the shot into `shots` before generating anything.
 *   2. Generate. Record the model, version, prompt, seed and date.
 *   3. Add the `assets` entry with the real sha256 of the real file.
 *   4. Run `tsx scripts/check-demonstration-imagery.ts`. It must pass before
 *      the file may be referenced from any source file.
 */

import registerData from "./register.json";

export const REGISTER_SCHEMA_VERSION = "demonstration-imagery-register/v1";

/** Repos a demonstration asset may physically live in. */
export const KNOWN_REPOS = ["app", "studio", "signal-motion"] as const;
export type KnownRepo = (typeof KNOWN_REPOS)[number];

/** Where generated demonstration imagery is committed, per repo. */
export const ASSET_DIRECTORIES: Readonly<Record<KnownRepo, string>> = {
  app: "public/demonstration",
  studio: "public/brand/assets/demonstration",
  "signal-motion": "public/demonstration",
};

export const ALLOWED_MEDIA_TYPES = [
  "image/webp",
  "image/jpeg",
  "image/png",
  "image/avif",
] as const;
export type AllowedMediaType = (typeof ALLOWED_MEDIA_TYPES)[number];

/**
 * R-011's mitigation, expressed as a rule rather than as prose.
 *
 * `forbidden` — no generated human face may appear on this surface at any
 * size, and the check script fails on an asset that claims otherwise.
 * `founder-note-required` — a face is conceivable, and the creative gate
 * requires the founder to have looked at that specific shot and accepted it in
 * writing, so the asset must carry a non-empty `founderAcceptanceNote`.
 */
export const FACES_POLICIES = ["forbidden", "founder-note-required"] as const;
export type FacesPolicy = (typeof FACES_POLICIES)[number];

export const CAPTION_RULES = [
  "visible-caption-required",
  "alt-text-declaration",
  "end-card-declaration",
  "none-on-screen",
  "not-applicable",
] as const;
export type CaptionRule = (typeof CAPTION_RULES)[number];

export const REVIEW_VERDICTS = ["accepted", "rejected", "pending"] as const;
export type ReviewVerdict = (typeof REVIEW_VERDICTS)[number];

export const SHOT_STATUSES = [
  "not_generated",
  "generated",
  "accepted",
  "cut",
] as const;
export type ShotStatus = (typeof SHOT_STATUSES)[number];

/**
 * R-011: prefer environments, details, hands, tables, flowers and light over
 * faces. The subject class is recorded so the balance of the shot list can be
 * audited at a glance rather than argued about.
 */
export const SUBJECT_CLASSES = [
  "environment",
  "detail",
  "hands",
  "table",
  "flowers",
  "light",
  "couple-own-snapshot",
] as const;
export type SubjectClass = (typeof SUBJECT_CLASSES)[number];

export type Surface = Readonly<{
  id: string;
  label: string;
  repo: KnownRepo;
  locator: string;
  audience: string;
  facesPolicy: FacesPolicy;
  facesPolicyBasis: string;
  captionRule: CaptionRule;
  captionRuleBasis: string;
  imageryPermitted: boolean;
  imageryProhibitedBasis?: string;
  blockedBy?: string;
}>;

export type Shot = Readonly<{
  id: string;
  surfaceIds: readonly string[];
  title: string;
  whyItExists: string;
  subjectClass: SubjectClass;
  containsFaces: boolean;
  aspect: string;
  minLongEdgePx: number;
  prompt: string;
  negativePrompt: string;
  acceptanceTests: readonly string[];
  status: ShotStatus;
  blockedBy?: string;
  founderCall?: string;
  compositeNote?: string;
  prohibitionNote?: string;
  reuseOf?: string;
}>;

/**
 * One committed demonstration image. Every field is required because every
 * field is the answer to a question somebody will ask after the fact, and a
 * register with optional provenance is not a register.
 */
export type ImageAsset = Readonly<{
  id: string;
  shotId: string;
  repo: KnownRepo;
  /** Repo-relative, forward slashes. */
  path: string;
  sha256: string;
  mediaType: AllowedMediaType;
  dimensions: Readonly<{ width: number; height: number }>;
  bytes: number;
  generator: Readonly<{
    /** The model that produced the pixels, named exactly. */
    model: string;
    /** The model version or build, or "unversioned" if the tool exposes none. */
    version: string;
    /** The tool or interface the model was driven through. */
    tool: string;
    /** The seed, if the tool exposes one. "none" if it does not. */
    seed: string;
  }>;
  prompt: string;
  negativePrompt: string;
  generatedOn: string;
  rightsPosition: string;
  permittedSurfaces: readonly string[];
  containsFaces: boolean;
  /** Required when `containsFaces` is true on a founder-note-required surface. */
  founderAcceptanceNote?: string;
  altText: string;
  caption: string;
  reviewedBy: string;
  reviewedOn: string;
  reviewVerdict: ReviewVerdict;
  /** Acceptance-test ids that were applied and passed. */
  acceptanceTestsPassed: readonly string[];
}>;

export type AcknowledgedRaster = Readonly<{
  id: string;
  repo: KnownRepo;
  paths: readonly string[];
  sha256?: string;
  kind: string;
  subject: string;
  rightsPosition: string;
  embeddedMetadata?: string;
  permittedSurfaces: readonly string[];
  prohibitedOn: readonly string[];
  note: string;
}>;

export type DemonstrationImageryRegister = Readonly<{
  schemaVersion: string;
  updatedAt: string;
  basis: Readonly<Record<string, string>>;
  storyConstants: Readonly<{
    venueName: string;
    coupleNames: readonly string[];
    venueNameSource: string;
    note: string;
  }>;
  surfaces: readonly Surface[];
  shots: readonly Shot[];
  assets: readonly ImageAsset[];
  acknowledgedNonDemonstrationRasters: readonly AcknowledgedRaster[];
}>;

export const REGISTER = registerData as unknown as DemonstrationImageryRegister;

export function surfaceById(id: string): Surface | undefined {
  return REGISTER.surfaces.find((s) => s.id === id);
}

export function shotById(id: string): Shot | undefined {
  return REGISTER.shots.find((s) => s.id === id);
}

/** Every asset that may currently be referenced from a source file. */
export function usableAssets(): readonly ImageAsset[] {
  return REGISTER.assets.filter((a) => a.reviewVerdict === "accepted");
}

/**
 * The one question the register exists to answer at runtime: may this image
 * appear here. Returns null when it may, or the reason it may not.
 */
export function refusalFor(
  asset: ImageAsset,
  surfaceId: string,
): string | null {
  const surface = surfaceById(surfaceId);
  if (!surface) return `unknown surface "${surfaceId}"`;
  if (!surface.imageryPermitted) {
    return `${surface.label} permits no imagery: ${surface.imageryProhibitedBasis ?? "declared imageryPermitted false"}`;
  }
  if (asset.reviewVerdict !== "accepted") {
    return `review verdict is "${asset.reviewVerdict}", not "accepted"`;
  }
  if (!asset.permittedSurfaces.includes(surfaceId)) {
    return `asset does not list "${surfaceId}" in permittedSurfaces`;
  }
  if (asset.containsFaces && surface.facesPolicy === "forbidden") {
    return `R-011: ${surface.label} forbids generated faces. ${surface.facesPolicyBasis}`;
  }
  if (
    asset.containsFaces &&
    surface.facesPolicy === "founder-note-required" &&
    !asset.founderAcceptanceNote?.trim()
  ) {
    return "generated face with no recorded founder acceptance note";
  }
  return null;
}
