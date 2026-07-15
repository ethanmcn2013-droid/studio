import {
  createHash,
} from "node:crypto";
import {
  existsSync,
  readFileSync,
  readdirSync,
  statSync,
} from "node:fs";
import path from "node:path";

export const EXPERIENCE_SCHEMA_VERSION = "signal-experience/1";
export const REQUIRED_BREAKPOINTS = ["mobile", "tablet", "desktop", "wide"];
export const EXPERIENCE_CLASSES = ["customer-product", "company-public", "founder-operator"];
export const AUDIT_DIMENSIONS = [
  "purpose-and-task-clarity",
  "information-architecture",
  "visual-hierarchy",
  "typography-and-content",
  "layout-and-composition",
  "interaction-quality",
  "state-completeness",
  "accessibility",
  "responsive-behavior",
  "performance-and-perceived-speed",
  "design-system-coherence",
  "brand-distinction-and-craft",
  "implementation-fidelity",
];

const PAGE_EXTENSIONS = new Set([".tsx", ".ts", ".jsx", ".js"]);
const SPECIAL_FILES = new Map([
  ["page", "page"],
  ["loading", "loading"],
  ["error", "error"],
  ["not-found", "error"],
]);

export function readJson(file) {
  return JSON.parse(readFileSync(file, "utf8"));
}

export function writeStableJson(value) {
  return `${JSON.stringify(value, null, 2)}\n`;
}

export function hashText(text) {
  const normalized = text.replace(/\r\n?/g, "\n");
  return createHash("sha256").update(normalized).digest("hex").slice(0, 16);
}

export function hashFile(file) {
  return hashText(readFileSync(file, "utf8"));
}

function walk(dir) {
  if (!existsSync(dir)) return [];
  const files = [];
  for (const name of readdirSync(dir)) {
    const absolute = path.join(dir, name);
    const stat = statSync(absolute);
    if (stat.isDirectory()) {
      if (!["node_modules", ".next", ".git", "dist", "out", "coverage"].includes(name)) {
        files.push(...walk(absolute));
      }
    } else {
      files.push(absolute);
    }
  }
  return files;
}

function visibleRouteSegments(relativeDirectory) {
  if (!relativeDirectory || relativeDirectory === ".") return [];
  return relativeDirectory
    .split(path.sep)
    .filter(Boolean)
    .filter((segment) => !(segment.startsWith("(") && segment.endsWith(")")))
    .filter((segment) => !segment.startsWith("@"));
}

export function normalizeRoute(appRoot, sourceFile) {
  const relativeDirectory = path.relative(appRoot, path.dirname(sourceFile));
  const segments = visibleRouteSegments(relativeDirectory);
  return segments.length ? `/${segments.join("/")}` : "/";
}

function slugSegment(segment) {
  const optionalCatchAll = segment.match(/^\[\[\.\.\.(.+)\]\]$/);
  if (optionalCatchAll) return `by-${kebab(optionalCatchAll[1])}`;
  const catchAll = segment.match(/^\[\.\.\.(.+)\]$/);
  if (catchAll) return `by-${kebab(catchAll[1])}`;
  const dynamic = segment.match(/^\[(.+)\]$/);
  if (dynamic) return `by-${kebab(dynamic[1])}`;
  return kebab(segment);
}

export function routeSlug(route) {
  if (route === "/") return "root";
  return route.split("/").filter(Boolean).map(slugSegment).join("-");
}

function kebab(value) {
  return value
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();
}

function labelFromRoute(route) {
  if (route === "/") return "home";
  return route
    .split("/")
    .filter(Boolean)
    .map((segment) => {
      if (segment.startsWith("[")) return "selected record";
      return segment.replaceAll("-", " ");
    })
    .join(" · ");
}

function isPublicRoute(route) {
  return !(
    route === "/app" ||
    route.startsWith("/app/") ||
    route === "/hq" ||
    route.startsWith("/hq/") ||
    route.startsWith("/settings")
  );
}

export function classifyArchetype(route, surfaceType) {
  if (["loading", "error", "empty", "success", "restricted", "notification"].includes(surfaceType)) {
    return "feedback-interruption-and-exception";
  }
  if (/sign-in|sign-up|welcome|onboarding|invite|redeem/.test(route)) {
    return "onboarding-and-authentication";
  }
  if (/settings|account|entitlements|access/.test(route)) {
    return "settings-and-administration";
  }
  if (/review|lab|design-rooms|loading-review/.test(route)) {
    return "review-and-approval-workspace";
  }
  if (/command|search|palette/.test(route)) {
    return "search-and-command-interface";
  }
  if (/board|blueprint|atlas-map|org|plan\//.test(route)) {
    return "editor-or-canvas";
  }
  if (/list|crm|reporting|waitlist/.test(route)) {
    return "list-and-data-table";
  }
  if (/contact|import|create|edit|plan\//.test(route)) {
    return "create-and-edit-form";
  }
  if (route === "/app" || route === "/hq" || /inbox|my-tasks|brief$/.test(route)) {
    return "dashboard-or-command-centre";
  }
  if (isPublicRoute(route) && !route.includes("[")) {
    return "public-information-and-proof";
  }
  return "detail-or-record-view";
}

function defaultStates(archetype, surfaceType) {
  if (surfaceType === "loading") return ["loading", "slow-loading", "reduced-motion"];
  if (surfaceType === "error") return ["error", "keyboard-only"];
  switch (archetype) {
    case "onboarding-and-authentication":
      return ["default", "loading", "error", "success", "disabled", "keyboard-only"];
    case "create-and-edit-form":
    case "editor-or-canvas":
      return [
        "default",
        "loading",
        "error",
        "success",
        "disabled",
        "saved",
        "unsaved",
        "long-content",
        "reduced-motion",
        "keyboard-only",
      ];
    case "dashboard-or-command-centre":
    case "list-and-data-table":
      return [
        "first-use",
        "empty",
        "populated",
        "loading",
        "partial-failure",
        "error",
        "restricted",
        "dense",
        "long-content",
        "reduced-motion",
        "keyboard-only",
      ];
    case "feedback-interruption-and-exception":
      return ["default", "error", "success", "restricted", "reduced-motion", "keyboard-only"];
    default:
      return ["default", "long-content", "reduced-motion", "keyboard-only"];
  }
}

function defaultRoles(route) {
  if (route === "/hq" || route.startsWith("/hq/")) return ["founder"];
  if (route.startsWith("/app") || route.startsWith("/settings")) return ["owner", "member"];
  if (/share|embed|\/p\/|\/u\/|update|wedding-planning/.test(route)) return ["owner", "guest", "viewer"];
  return ["public"];
}

function defaultReviewTier(route, archetype) {
  if (
    route === "/" ||
    route === "/app" ||
    route === "/hq" ||
    /sign-in|sign-up|invite|redeem|share|privacy|terms|security/.test(route)
  ) {
    return "critical";
  }
  if (["dashboard-or-command-centre", "create-and-edit-form", "editor-or-canvas"].includes(archetype)) {
    return "core";
  }
  return "supporting";
}

function parentJourney(route) {
  if (route === "/") return "suite-discovery";
  const first = route.split("/").filter(Boolean)[0] ?? "suite-discovery";
  if (first === "hq") return "founder-operations";
  if (first === "app" || first === "settings") return "signed-in-work";
  if (["sign-in", "sign-up", "welcome", "onboarding", "invite", "redeem"].includes(first)) {
    return "access-and-onboarding";
  }
  return "public-discovery-and-proof";
}

export function classifyExperienceClass({ product, route, source = "", parentJourney: journey = "" }) {
  if (product === "signal-review") return "founder-operator";
  if (product === "studio") {
    const isHqRoute = route === "/hq" || route?.startsWith("/hq/");
    const isHqSource = source.startsWith("studio/src/components/hq/");
    if (isHqRoute || isHqSource || journey === "founder-operations") return "founder-operator";
    return "company-public";
  }
  return "customer-product";
}

function baseEntry({ product, surfaceType, route, trigger, source, sourceFile, overrides = {} }) {
  const archetype = overrides.archetype ?? classifyArchetype(route ?? trigger ?? "/", surfaceType);
  const label = labelFromRoute(route ?? trigger ?? source);
  const journey = overrides.parentJourney ?? parentJourney(route ?? "/");
  return {
    id: overrides.id,
    product,
    experienceClass: classifyExperienceClass({ product, route, source, parentJourney: journey }),
    surfaceType,
    ...(route ? { route } : {}),
    ...(trigger ? { trigger } : {}),
    source,
    parentJourney: journey,
    archetype,
    primaryJob: overrides.primaryJob ?? `Understand and use ${label}.`,
    primaryAction: overrides.primaryAction ?? `Complete the primary action on ${label}.`,
    roles: overrides.roles ?? defaultRoles(route ?? "/"),
    requiredStates: overrides.requiredStates ?? defaultStates(archetype, surfaceType),
    requiredBreakpoints: overrides.requiredBreakpoints ?? REQUIRED_BREAKPOINTS,
    componentDependencies: overrides.componentDependencies ?? [],
    patternDependencies: overrides.patternDependencies ?? [],
    reviewTier: overrides.reviewTier ?? defaultReviewTier(route ?? "/", archetype),
    designOwner: overrides.designOwner ?? "product-taste-design-integrity",
    engineeringOwner: overrides.engineeringOwner ?? "engineering-systems-architecture",
    implementationStatus: overrides.implementationStatus ?? "legacy",
    auditStatus: overrides.auditStatus ?? "registered",
    auditScore: overrides.auditScore ?? null,
    openFindingIds: overrides.openFindingIds ?? [],
    automatedTestCoverage: overrides.automatedTestCoverage ?? "none",
    screenshotCoverage: overrides.screenshotCoverage ?? "none",
    accessibilityCoverage: overrides.accessibilityCoverage ?? "none",
    fixtureCoverage: overrides.fixtureCoverage ?? "none",
    lastReviewedAt: overrides.lastReviewedAt ?? null,
    approvedBaselineReference: overrides.approvedBaselineReference ?? null,
    intentionalExceptions: overrides.intentionalExceptions ?? [],
    discoveryContext: overrides.discoveryContext,
    materialityHash: sourceFile && existsSync(sourceFile) ? hashFile(sourceFile) : hashText(JSON.stringify(overrides)),
  };
}

function sourceRelative(workspaceRoot, sourceFile) {
  return path.relative(workspaceRoot, sourceFile).split(path.sep).join("/");
}

export function discoverProduct({ workspaceRoot, product }) {
  const repoRoot = path.join(workspaceRoot, product.directory);
  const appRoot = path.join(repoRoot, "src", "app");
  if (!existsSync(appRoot)) return [];
  const entries = [];
  for (const file of walk(appRoot)) {
    const ext = path.extname(file);
    if (!PAGE_EXTENSIONS.has(ext)) continue;
    const basename = path.basename(file, ext);
    if (!SPECIAL_FILES.has(basename)) continue;
    const route = normalizeRoute(appRoot, file);
    const surfaceType = SPECIAL_FILES.get(basename);
    const kind = basename === "page" ? "page" : "state";
    const suffix = basename === "page" ? routeSlug(route) : `${routeSlug(route)}-${basename}`;
    const routingContext = path
      .relative(appRoot, path.dirname(file))
      .split(path.sep)
      .filter((segment) =>
        (segment.startsWith("(") && segment.endsWith(")")) || segment.startsWith("@"),
      )
      .map((segment) => kebab(segment.replace(/^[@(]+|[)]+$/g, "")))
      .filter(Boolean)
      .join("-");
    entries.push(
      baseEntry({
        product: product.id,
        surfaceType,
        route,
        source: sourceRelative(workspaceRoot, file),
        sourceFile: file,
        overrides: {
          id: `${product.id}.${kind}.${suffix}`,
          discoveryContext: routingContext || "default",
        },
      }),
    );
  }

  if (product.id === "studio") {
    const publicRoot = path.join(repoRoot, "public");
    for (const file of walk(publicRoot).filter((candidate) => candidate.endsWith(".html"))) {
      const relative = path.relative(publicRoot, file).split(path.sep).join("/");
      const route = `/${relative.replace(/(?:\/index)?\.html$/, "")}`.replace(/\/$/, "") || "/";
      entries.push(
        baseEntry({
          product: product.id,
          surfaceType: "page",
          route,
          source: sourceRelative(workspaceRoot, file),
          sourceFile: file,
          overrides: {
            id: `${product.id}.artifact.${routeSlug(route)}`,
            parentJourney: "brand-assets-and-proof",
            archetype: "public-information-and-proof",
          },
        }),
      );
    }
  }
  const idCounts = new Map();
  for (const entry of entries) idCounts.set(entry.id, (idCounts.get(entry.id) ?? 0) + 1);
  for (const entry of entries) {
    if ((idCounts.get(entry.id) ?? 0) > 1) entry.id = `${entry.id}-${entry.discoveryContext}`;
    delete entry.discoveryContext;
  }
  return entries.sort((a, b) => a.id.localeCompare(b.id));
}

function explicitEntries({ workspaceRoot, explicit }) {
  return explicit.surfaces.map((surface) => {
    const sourceFile = path.join(workspaceRoot, surface.source.replaceAll("/", path.sep));
    return baseEntry({
      product: surface.product,
      surfaceType: surface.surfaceType,
      route: surface.route,
      trigger: surface.trigger,
      source: surface.source,
      sourceFile,
      overrides: surface,
    });
  });
}

const OVERRIDABLE_FIELDS = new Set([
  "parentJourney",
  "archetype",
  "primaryJob",
  "primaryAction",
  "roles",
  "requiredStates",
  "requiredBreakpoints",
  "componentDependencies",
  "patternDependencies",
  "reviewTier",
  "designOwner",
  "engineeringOwner",
  "implementationStatus",
  "auditStatus",
  "auditScore",
  "openFindingIds",
  "automatedTestCoverage",
  "screenshotCoverage",
  "accessibilityCoverage",
  "fixtureCoverage",
  "lastReviewedAt",
  "approvedBaselineReference",
  "intentionalExceptions",
]);

export function discoverRegistry({ studioRoot, config, explicit, overrides = { experiences: {} } }) {
  const workspaceRoot = path.resolve(studioRoot, "..");
  const discovered = [
    ...config.products.flatMap((product) => discoverProduct({ workspaceRoot, product })),
    ...explicitEntries({ workspaceRoot, explicit }),
  ].sort((a, b) => a.id.localeCompare(b.id));
  const experiences = discovered.map((entry) => {
    const candidate = overrides.experiences?.[entry.id] ?? {};
    const safeOverrides = Object.fromEntries(
      Object.entries(candidate).filter(([field]) => OVERRIDABLE_FIELDS.has(field)),
    );
    return { ...entry, ...safeOverrides };
  });
  return {
    schemaVersion: EXPERIENCE_SCHEMA_VERSION,
    generatedAt: new Date().toISOString().slice(0, 10),
    breakpoints: config.breakpoints,
    experiences,
  };
}

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

export function validateRegistry({ registry, discovered, findings, exceptions, studioRoot }) {
  const errors = [];
  const ids = new Set();
  const sourceKeys = new Set();
  const findingIds = new Set(findings.findings.map((finding) => finding.id));
  const exceptionIds = new Set(exceptions.exceptions.map((item) => item.id));
  const today = new Date().toISOString().slice(0, 10);
  const required = [
    "id",
    "product",
    "experienceClass",
    "surfaceType",
    "source",
    "parentJourney",
    "archetype",
    "primaryJob",
    "primaryAction",
    "reviewTier",
    "designOwner",
    "engineeringOwner",
    "implementationStatus",
    "auditStatus",
    "materialityHash",
  ];

  if (registry.schemaVersion !== EXPERIENCE_SCHEMA_VERSION) {
    errors.push(`registry schema must be ${EXPERIENCE_SCHEMA_VERSION}`);
  }
  for (const entry of registry.experiences) {
    for (const field of required) {
      if (!isNonEmptyString(entry[field])) errors.push(`${entry.id || "<missing-id>"}: missing ${field}`);
    }
    if (!/^[a-z0-9]+(?:[.-][a-z0-9]+)*$/.test(entry.id)) errors.push(`${entry.id}: unstable ID format`);
    if (ids.has(entry.id)) errors.push(`${entry.id}: duplicate experience ID`);
    ids.add(entry.id);
    const sourceKey = `${entry.product}|${entry.source}|${entry.surfaceType}`;
    if (sourceKeys.has(sourceKey)) errors.push(`${entry.id}: duplicate registered source ${entry.source}`);
    sourceKeys.add(sourceKey);
    if (!entry.route && !entry.trigger) errors.push(`${entry.id}: route or trigger is required`);
    if (!Array.isArray(entry.roles) || !entry.roles.length) errors.push(`${entry.id}: roles are required`);
    if (!EXPERIENCE_CLASSES.includes(entry.experienceClass)) {
      errors.push(`${entry.id}: unknown experience class ${entry.experienceClass}`);
    }
    const expectedClass = classifyExperienceClass(entry);
    if (entry.experienceClass !== expectedClass) {
      errors.push(`${entry.id}: experience class must be ${expectedClass}`);
    }
    if (!Array.isArray(entry.requiredStates) || !entry.requiredStates.length) errors.push(`${entry.id}: required states are missing`);
    if (!Array.isArray(entry.requiredBreakpoints) || !entry.requiredBreakpoints.length) errors.push(`${entry.id}: required breakpoints are missing`);
    for (const breakpoint of REQUIRED_BREAKPOINTS) {
      if (!entry.requiredBreakpoints.includes(breakpoint)) errors.push(`${entry.id}: missing breakpoint ${breakpoint}`);
    }
    for (const findingId of entry.openFindingIds ?? []) {
      if (!findingIds.has(findingId)) errors.push(`${entry.id}: unknown finding ${findingId}`);
    }
    for (const exception of entry.intentionalExceptions ?? []) {
      if (!exceptionIds.has(exception.id)) errors.push(`${entry.id}: unknown exception ${exception.id}`);
      if (!exception.expiresAt || exception.expiresAt < today) errors.push(`${entry.id}: expired exception ${exception.id}`);
    }
  }

  const registeredById = new Map(registry.experiences.map((entry) => [entry.id, entry]));
  const discoveredById = new Map(discovered.experiences.map((entry) => [entry.id, entry]));
  for (const [id, entry] of discoveredById) {
    const registered = registeredById.get(id);
    if (!registered) {
      errors.push(`${id}: discovered experience is not registered (${entry.source})`);
      continue;
    }
    if (registered.source !== entry.source) errors.push(`${id}: obsolete source reference ${registered.source}`);
    if (registered.materialityHash !== entry.materialityHash) {
      const complete = [
        registered.fixtureCoverage,
        registered.screenshotCoverage,
        registered.accessibilityCoverage,
      ].every((coverage) => coverage === "complete");
      if (!complete) errors.push(`${id}: changed experience lacks complete fixture, screenshot, and accessibility coverage`);
    }
  }
  for (const [id, entry] of registeredById) {
    if (!discoveredById.has(id)) errors.push(`${id}: registered experience is obsolete (${entry.source})`);
    const absolute = path.join(path.resolve(studioRoot, ".."), entry.source.replaceAll("/", path.sep));
    if (!existsSync(absolute)) errors.push(`${id}: broken source reference ${entry.source}`);
  }
  return errors;
}

export function registryMetrics(registry) {
  const experiences = registry.experiences;
  const stateVariants = experiences.reduce((sum, entry) => sum + entry.requiredStates.length, 0);
  const breakpointVariants = experiences.reduce((sum, entry) => sum + entry.requiredBreakpoints.length, 0);
  const countComplete = (field) => experiences.filter((entry) => entry[field] === "complete").length;
  return {
    experiences: experiences.length,
    stateVariants,
    breakpointVariants,
    products: Object.fromEntries(
      [...new Set(experiences.map((entry) => entry.product))].sort().map((product) => [
        product,
        experiences.filter((entry) => entry.product === product).length,
      ]),
    ),
    experienceClasses: Object.fromEntries(
      EXPERIENCE_CLASSES.map((experienceClass) => [
        experienceClass,
        experiences.filter((entry) => entry.experienceClass === experienceClass).length,
      ]),
    ),
    archetypes: Object.fromEntries(
      [...new Set(experiences.map((entry) => entry.archetype))].sort().map((archetype) => [
        archetype,
        experiences.filter((entry) => entry.archetype === archetype).length,
      ]),
    ),
    fixtureCoverage: countComplete("fixtureCoverage"),
    screenshotCoverage: countComplete("screenshotCoverage"),
    accessibilityCoverage: countComplete("accessibilityCoverage"),
    passing: experiences.filter((entry) => entry.auditStatus === "passing").length,
    underRemediation: experiences.filter((entry) => entry.auditStatus === "under-remediation").length,
  };
}
