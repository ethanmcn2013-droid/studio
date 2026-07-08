#!/usr/bin/env node
import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import fs from "node:fs/promises";
import path from "node:path";
import ts from "typescript";

const root = process.cwd();
const reviewDir = path.join(root, "content", "hq", "copy-review");
const inventoryPath = path.join(reviewDir, "inventory.json");
const statePath = path.join(reviewDir, "founder-state.json");
const reportPath = path.join(reviewDir, "review-report.md");
const guidancePath = path.join(reviewDir, "founder-guidance.md");

const command = process.argv[2] ?? "scan";
const flags = new Set(process.argv.slice(3));

const skipDirs = new Set([
  ".git",
  ".next",
  ".vercel",
  "node_modules",
  "drizzle",
  "drizzle-entitlements",
]);

const scanRoots = [
  "src",
  "content/hq",
  "content/atlas",
  "signal-growth",
  "public/brand/collateral",
  "public/brand/press",
].map((entry) => path.join(root, entry));

const textExtensions = new Set([
  ".ts",
  ".tsx",
  ".md",
  ".mdx",
  ".json",
  ".html",
  ".txt",
]);

const relevantKeys = new Set([
  "alt",
  "aria-label",
  "body",
  "caption",
  "copy",
  "description",
  "detail",
  "eyebrow",
  "headline",
  "hint",
  "label",
  "name",
  "note",
  "placeholder",
  "promise",
  "question",
  "summary",
  "text",
  "title",
  "value",
]);

const ignoredKeys = new Set([
  "class",
  "classname",
  "href",
  "id",
  "key",
  "rel",
  "src",
  "style",
  "target",
  "type",
  "url",
]);

const statCache = new Map();

if (command === "scan" || command === "review") {
  await scan();
  if (command === "review" || flags.has("--report")) await report();
} else if (command === "report") {
  await report();
} else if (command === "guidance") {
  await guidance();
} else {
  console.error(`Unknown copy-review command: ${command}`);
  process.exit(1);
}

async function scan() {
  await fs.mkdir(reviewDir, { recursive: true });
  const previous = await readJson(inventoryPath, null);
  const previousById = new Map((previous?.items ?? []).map((item) => [item.id, item]));
  const files = [];
  for (const entry of scanRoots) {
    if (!existsSync(entry)) continue;
    const stat = await fs.stat(entry);
    if (stat.isDirectory()) {
      files.push(...(await walk(entry)));
    } else if (isTextFile(entry)) {
      files.push(entry);
    }
  }
  await primeStats(files);

  const items = [];
  for (const file of files.sort()) {
    const ext = path.extname(file).toLowerCase();
    const source = await fs.readFile(file, "utf8");
    if (ext === ".ts" || ext === ".tsx") {
      items.push(...extractTsLike(file, source, previousById));
    } else if (ext === ".md" || ext === ".mdx" || ext === ".txt") {
      items.push(...extractMarkdown(file, source, previousById));
    } else if (ext === ".json") {
      items.push(...extractJson(file, source, previousById));
    } else if (ext === ".html") {
      items.push(...extractHtml(file, source, previousById));
    }
  }

  const inventory = {
    schemaVersion: 1,
    generatedAt: new Date().toISOString(),
    sourceRoot: root,
    itemCount: items.length,
    items: items.sort((a, b) => a.location.localeCompare(b.location) || a.line - b.line),
  };

  await fs.writeFile(inventoryPath, `${JSON.stringify(inventory, null, 2)}\n`, "utf8");
  if (!existsSync(statePath)) {
    await fs.writeFile(
      statePath,
      `${JSON.stringify(
        {
          schemaVersion: 1,
          updatedAt: new Date().toISOString(),
          reviews: {},
          guidance: [],
        },
        null,
        2,
      )}\n`,
      "utf8",
    );
  }

  const changed = items.filter((item) => item.previousHash && item.previousHash !== item.hash).length;
  console.log(`copy-review: scanned ${items.length} items across ${files.length} files`);
  console.log(`copy-review: ${changed} changed since previous inventory`);
  console.log(`copy-review: wrote ${path.relative(root, inventoryPath)}`);
}

async function report() {
  const inventory = await readJson(inventoryPath, {
    generatedAt: new Date(0).toISOString(),
    items: [],
  });
  const state = await readJson(statePath, { reviews: {}, guidance: [] });
  const merged = inventory.items.map((item) => mergeStatus(item, state));
  const counts = countStatuses(merged);
  const highRisk = merged.filter((item) => item.riskLevel === "high");
  const needsReview = merged.filter((item) => item.status === "needs_review");
  const lines = [
    "# Founder Copy Review Report",
    "",
    `Generated: ${new Date().toISOString()}`,
    `Inventory: ${inventory.generatedAt}`,
    "",
    "## Coverage",
    "",
    `- Total copy items: ${merged.length}`,
    `- Founder approved: ${counts.approved}`,
    `- Needs review: ${counts.needs_review}`,
    `- Needs work: ${counts.needs_work}`,
    `- Rejected: ${counts.rejected}`,
    `- Deferred: ${counts.deferred}`,
    `- High-risk items: ${highRisk.length}`,
    "",
    "## Needs Founder Review",
    "",
    ...needsReview.slice(0, 80).map((item) => `- ${item.id} | ${item.copyType} | ${item.location}:${item.line} | ${item.text}`),
    needsReview.length > 80 ? `- ...${needsReview.length - 80} more` : "",
    "",
    "## High Risk",
    "",
    ...highRisk.slice(0, 80).map((item) => `- ${item.id} | ${item.riskScore} | ${item.location}:${item.line} | ${item.flags.join(", ")}`),
    highRisk.length > 80 ? `- ...${highRisk.length - 80} more` : "",
    "",
  ].filter(Boolean);
  await fs.mkdir(reviewDir, { recursive: true });
  await fs.writeFile(reportPath, `${lines.join("\n")}\n`, "utf8");
  console.log(`copy-review: wrote ${path.relative(root, reportPath)}`);
}

async function guidance() {
  const state = await readJson(statePath, { guidance: [] });
  const rules = state.guidance ?? [];
  const lines = [
    "# Founder Guidance",
    "",
    `Exported: ${new Date().toISOString()}`,
    "",
    ...rules.flatMap((rule) => [
      `## ${rule.sentiment} | ${rule.tags.join(", ")}`,
      "",
      rule.text,
      "",
      `Source: ${rule.sourceItemId ?? "manual"}${rule.sourceHash ? ` @ ${rule.sourceHash.slice(0, 12)}` : ""}`,
      "",
    ]),
  ];
  await fs.mkdir(reviewDir, { recursive: true });
  await fs.writeFile(guidancePath, `${lines.join("\n")}\n`, "utf8");
  console.log(`copy-review: wrote ${path.relative(root, guidancePath)}`);
}

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if (entry.name.startsWith(".") && entry.name !== ".well-known") continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (skipDirs.has(entry.name)) continue;
      files.push(...(await walk(full)));
    } else if (isTextFile(full) && !shouldSkipFile(full)) {
      files.push(full);
    }
  }
  return files;
}

function extractTsLike(file, source, previousById) {
  const rel = relative(file);
  const sourceFile = ts.createSourceFile(
    rel,
    source,
    ts.ScriptTarget.Latest,
    true,
    rel.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS,
  );
  const items = [];
  const seen = new Map();

  function add(text, node, hint = {}) {
    const normalized = normalizeText(text);
    if (!isMeaningful(normalized, hint.key)) return;
    const line = sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile)).line + 1;
    const context = nearestContext(node);
    const copyType = hint.copyType ?? inferCopyType({
      key: hint.key,
      tag: hint.tag,
      text: normalized,
      rel,
    });
    const basis = `${rel}:${line}:${context}:${copyType}`;
    const sequence = seen.get(basis) ?? 0;
    seen.set(basis, sequence + 1);
    items.push(makeItem({ file, line, text: normalized, context, copyType, previousById, sequence, key: hint.key }));
  }

  function visit(node) {
    if (ts.isJsxText(node)) {
      const parentTag = jsxParentTag(node);
      add(node.getText(sourceFile), node, { tag: parentTag });
    } else if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
      const parent = node.parent;
      if (ts.isImportDeclaration(parent) || ts.isExportDeclaration(parent)) return;
      if (ts.isJsxAttribute(parent)) {
        const key = parent.name.getText(sourceFile).toLowerCase();
        if (!ignoredKeys.has(key)) add(node.text, node, { key, tag: jsxParentTag(parent) });
      } else if (ts.isPropertyAssignment(parent)) {
        const key = propName(parent.name);
        if (key && !ignoredKeys.has(key.toLowerCase())) add(node.text, node, { key });
      } else if (ts.isArrayLiteralExpression(parent)) {
        const key = arrayContextKey(parent);
        if (key && !ignoredKeys.has(key.toLowerCase())) add(node.text, node, { key });
      } else if (ts.isVariableDeclaration(parent)) {
        const key = parent.name.getText(sourceFile);
        if (looksRelevantKey(key)) add(node.text, node, { key });
      } else if (ts.isCallExpression(parent)) {
        const key = parent.expression.getText(sourceFile);
        if (/^(title|description|label|note|copy|metadata)$/i.test(key)) add(node.text, node, { key });
      }
    } else if (ts.isTemplateExpression(node)) {
      const text = node.getText(sourceFile);
      if (!text.includes("${")) add(text.replace(/`/g, ""), node, {});
    }
    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
  return items;
}

function extractMarkdown(file, source, previousById) {
  const lines = source.replace(/\r\n/g, "\n").split("\n");
  const items = [];
  let inFence = false;
  let inFrontmatter = false;
  let paragraph = [];
  let paragraphStart = 0;

  const flush = () => {
    if (paragraph.length === 0) return;
    const text = normalizeText(paragraph.join(" "));
    if (isMeaningful(text)) {
      items.push(makeItem({ file, line: paragraphStart, text, context: "markdown", copyType: inferMarkdownType(text, file), previousById }));
    }
    paragraph = [];
    paragraphStart = 0;
  };

  lines.forEach((line, index) => {
    const n = index + 1;
    const trimmed = line.trim();
    if (n === 1 && trimmed === "---") {
      inFrontmatter = true;
      return;
    }
    if (inFrontmatter) {
      if (trimmed === "---") {
        inFrontmatter = false;
        return;
      }
      const match = trimmed.match(/^(title|description|summary|headline|label|status):\s*"?(.+?)"?$/i);
      if (match) {
        const text = normalizeText(match[2]);
        if (isMeaningful(text, match[1])) {
          items.push(makeItem({ file, line: n, text, context: `frontmatter:${match[1]}`, copyType: inferCopyType({ key: match[1], text, rel: relative(file) }), previousById }));
        }
      }
      return;
    }
    if (trimmed.startsWith("```")) {
      inFence = !inFence;
      flush();
      return;
    }
    if (inFence) return;
    if (!trimmed) {
      flush();
      return;
    }
    if (/^#{1,6}\s+/.test(trimmed)) {
      flush();
      const text = normalizeText(trimmed.replace(/^#{1,6}\s+/, ""));
      if (isMeaningful(text)) {
        items.push(makeItem({ file, line: n, text, context: "heading", copyType: trimmed.startsWith("# ") ? "headline" : "subheading", previousById }));
      }
      return;
    }
    if (/^[-*]\s+/.test(trimmed)) {
      flush();
      const text = normalizeText(trimmed.replace(/^[-*]\s+/, ""));
      if (isMeaningful(text)) {
        items.push(makeItem({ file, line: n, text, context: "list", copyType: inferMarkdownType(text, file), previousById }));
      }
      return;
    }
    if (paragraph.length === 0) paragraphStart = n;
    paragraph.push(trimmed);
  });
  flush();
  return items;
}

function extractJson(file, source, previousById) {
  if (relative(file).endsWith("package.json") || relative(file).endsWith("tsconfig.json")) return [];
  let parsed;
  try {
    parsed = JSON.parse(source);
  } catch {
    return [];
  }
  const items = [];
  const lines = source.split("\n");

  function visit(value, trail) {
    if (typeof value === "string") {
      const key = String(trail.at(-1) ?? "");
      const text = normalizeText(value);
      if (isMeaningful(text, key)) {
        const line = findLine(lines, value);
        items.push(makeItem({ file, line, text, context: trail.join("."), copyType: inferCopyType({ key, text, rel: relative(file) }), previousById }));
      }
    } else if (Array.isArray(value)) {
      value.forEach((entry, index) => visit(entry, [...trail, String(index)]));
    } else if (value && typeof value === "object") {
      Object.entries(value).forEach(([key, entry]) => visit(entry, [...trail, key]));
    }
  }

  visit(parsed, ["json"]);
  return items;
}

function extractHtml(file, source, previousById) {
  const cleaned = source
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "");
  const items = [];
  const pattern = />([^<]{2,})</g;
  let match;
  let sequence = 0;
  while ((match = pattern.exec(cleaned))) {
    const text = normalizeText(match[1]);
    if (!isMeaningful(text)) continue;
    const line = cleaned.slice(0, match.index).split("\n").length;
    items.push(makeItem({ file, line, text, context: "html", copyType: inferCopyType({ text, rel: relative(file) }), previousById, sequence }));
    sequence += 1;
  }
  return items;
}

function makeItem({ file, line, text, context, copyType, previousById, sequence = 0, key }) {
  const rel = relative(file);
  const route = routeFor(rel);
  const exposure = exposureFor(rel, copyType);
  const risk = assessCopyRisk(text, { location: rel, copyType, exposure });
  const id = `copy_${hash(`${rel}:${line}:${context}:${copyType}:${sequence}`).slice(0, 14)}`;
  const previous = previousById.get(id);
  const stat = statCache.get(file);
  return {
    id,
    text,
    previousText: previous && previous.hash !== hashText(text) ? previous.text : undefined,
    location: rel,
    line,
    route,
    productArea: productAreaFor(rel, text),
    audience: audienceFor(rel, text),
    component: context,
    copyType,
    exposure,
    hash: hashText(text),
    previousHash: previous?.hash,
    lastModified: stat?.mtime.toISOString() ?? new Date().toISOString(),
    changedAt: previous && previous.hash !== hashText(text) ? new Date().toISOString() : previous?.changedAt,
    whyChanged: previous && previous.hash !== hashText(text) ? `Changed since previous scan at ${previous.location}:${previous.line}` : undefined,
    riskScore: risk.riskScore,
    riskLevel: risk.riskLevel,
    aiNotes: risk.aiNotes,
    flags: risk.flags,
  };
}

async function primeStats(files) {
  await Promise.all(
    files.map(async (file) => {
      statCache.set(file, await fs.stat(file));
    }),
  );
}

async function readJson(file, fallback) {
  try {
    return JSON.parse(await fs.readFile(file, "utf8"));
  } catch (err) {
    if (err.code === "ENOENT") return fallback;
    throw err;
  }
}

function isTextFile(file) {
  return textExtensions.has(path.extname(file).toLowerCase());
}

function shouldSkipFile(file) {
  const rel = relative(file);
  if (rel.includes("content/hq/copy-review/")) return true;
  if (rel === "src/lib/hq/data.ts") return true;
  if (rel.endsWith("pnpm-lock.yaml")) return true;
  if (rel.endsWith(".map")) return true;
  if (/public\/brand\/collateral\/.*\.(svg|png|jpg|jpeg|webp|pdf|zip)$/i.test(rel)) return true;
  return false;
}

function normalizeText(text) {
  return text
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function isMeaningful(text, key = "") {
  if (!text || text.length < 2) return false;
  if (!/[A-Za-z]/.test(text)) return false;
  if (/^[./#?=&:_a-z0-9-]+$/i.test(text) && !looksRelevantKey(key)) return false;
  if (/^(use client|use server|server-only)$/i.test(text)) return false;
  if (/^https?:\/\//i.test(text) || text.startsWith("/")) return false;
  if (/\.(tsx?|jsx?|css|png|jpg|svg|pdf|zip|json|md)$/i.test(text)) return false;
  if (text.includes("className") || text.includes("var(")) return false;
  if (text.length > 600) return false;
  if (text.length < 10 && !looksRelevantKey(key)) return false;
  return true;
}

function looksRelevantKey(key = "") {
  const clean = key.toLowerCase().replace(/['"]/g, "");
  return relevantKeys.has(clean) || /(title|label|copy|headline|body|note|caption|description|cta|error|empty|tooltip|placeholder|alt|question|answer|summary)/i.test(clean);
}

function inferCopyType({ key = "", tag = "", text = "", rel = "" }) {
  const k = key.toLowerCase();
  const t = tag.toLowerCase();
  const lowerText = text.toLowerCase();
  const lowerRel = rel.toLowerCase();
  if (lowerRel.includes("/pricing") || k.includes("price") || lowerText.includes("eur ") || /[€$£]\s?\d/.test(text)) return "pricing";
  if (lowerRel.includes("/terms") || lowerRel.includes("/privacy") || lowerRel.includes("/legal") || k.includes("legal")) return "legal";
  if (k.includes("alt")) return "alt_text";
  if (k.includes("tooltip") || k.includes("hint") || (k === "title" && tag)) return "tooltip";
  if (k.includes("placeholder")) return "empty_state";
  if (k.includes("error")) return "error";
  if (k.includes("onboarding") || lowerRel.includes("onboarding")) return "onboarding";
  if (k.includes("cta") || t === "button" || t === "a") return "cta";
  if (k.includes("headline") || k === "title" || t === "h1") return "headline";
  if (k.includes("subhead") || t === "h2" || t === "h3") return "subheading";
  if (k.includes("nav") || lowerRel.includes("nav")) return "navigation";
  if (lowerRel.includes("marketing") || lowerRel.includes("press") || lowerRel.includes("growth")) return "marketing";
  if (k.includes("description") || k.includes("summary")) return "body";
  return "body";
}

function inferMarkdownType(text, file) {
  const rel = relative(file).toLowerCase();
  if (rel.includes("pricing") || /[€$£]\s?\d/.test(text)) return "pricing";
  if (rel.includes("privacy") || rel.includes("terms") || rel.includes("legal")) return "legal";
  if (rel.includes("operator-todos")) return "body";
  if (rel.includes("campaign") || rel.includes("content/hq/content") || rel.includes("signal-growth")) return "marketing";
  return "body";
}

function exposureFor(rel, copyType) {
  const lower = rel.toLowerCase();
  if (copyType === "legal" || lower.includes("/terms") || lower.includes("/privacy")) return "legal";
  if (lower.includes("src/app/hq") || lower.includes("content/hq")) return "internal";
  if (lower.includes("pricing") || lower.includes("press") || lower.includes("marketing") || lower.includes("signal-growth")) return "marketing";
  if (lower.includes("src/app") || lower.includes("public/brand")) return "public";
  return "product";
}

function productAreaFor(rel, text) {
  const hay = `${rel} ${text}`.toLowerCase();
  if (hay.includes("copy-review")) return "Founder Copy Review";
  if (hay.includes("/hq") || hay.includes("signal hq")) return "Signal HQ";
  if (hay.includes("pricing")) return "Pricing";
  if (hay.includes("venue")) return "Venues";
  if (hay.includes("wedding")) return "Weddings";
  if (hay.includes("student")) return "Students";
  if (hay.includes("notes")) return "Signal Notes";
  if (hay.includes("tasks")) return "Signal Tasks";
  if (hay.includes("timeline") || hay.includes("roadmap")) return "Signal Timeline";
  if (hay.includes("briefing") || hay.includes("signal.")) return "Signal";
  if (hay.includes("press") || hay.includes("campaign") || hay.includes("growth")) return "Marketing";
  if (hay.includes("terms") || hay.includes("privacy") || hay.includes("security")) return "Legal";
  return "Website";
}

function audienceFor(rel, text) {
  const hay = `${rel} ${text}`.toLowerCase();
  if (hay.includes("student")) return "student";
  if (hay.includes("wedding")) return "wedding";
  if (hay.includes("venue")) return "venue";
  if (hay.includes("trades")) return "trades";
  if (hay.includes("freelance")) return "freelancer";
  if (hay.includes("community")) return "community";
  if (hay.includes("small-business") || hay.includes("business owner")) return "small-business";
  if (hay.includes("shareholder") || hay.includes("founders circle")) return "shareholder";
  if (hay.includes("founder")) return "founder";
  return undefined;
}

function routeFor(rel) {
  if (!rel.startsWith("src/app/")) return undefined;
  const parts = rel.replace(/\\/g, "/").split("/");
  const appIndex = parts.indexOf("app");
  const routeParts = [];
  for (let i = appIndex + 1; i < parts.length - 1; i += 1) {
    const part = parts[i];
    if (part.startsWith("(") && part.endsWith(")")) continue;
    if (part.startsWith("_")) continue;
    routeParts.push(part.replace(/\[|\]/g, ""));
  }
  const file = parts.at(-1);
  if (!["page.tsx", "layout.tsx", "not-found.tsx", "error.tsx", "loading.tsx"].includes(file)) return undefined;
  return `/${routeParts.join("/")}`.replace(/\/$/, "") || "/";
}

function nearestContext(node) {
  let cur = node;
  while (cur) {
    if (ts.isFunctionDeclaration(cur) && cur.name) return cur.name.text;
    if (ts.isFunctionExpression(cur) || ts.isArrowFunction(cur)) {
      const parent = cur.parent;
      if (ts.isVariableDeclaration(parent)) return parent.name.getText();
      if (ts.isPropertyAssignment(parent)) return propName(parent.name) ?? "object";
    }
    if (ts.isPropertyAssignment(cur)) return propName(cur.name) ?? "object";
    cur = cur.parent;
  }
  return "module";
}

function jsxParentTag(node) {
  let cur = node.parent;
  while (cur) {
    if (ts.isJsxElement(cur)) return cur.openingElement.tagName.getText();
    if (ts.isJsxSelfClosingElement(cur)) return cur.tagName.getText();
    cur = cur.parent;
  }
  return "";
}

function propName(name) {
  if (ts.isIdentifier(name) || ts.isStringLiteral(name) || ts.isNumericLiteral(name)) return name.text;
  return name.getText();
}

function arrayContextKey(node) {
  let cur = node.parent;
  while (cur) {
    if (ts.isPropertyAssignment(cur)) return propName(cur.name);
    if (ts.isVariableDeclaration(cur)) return cur.name.getText();
    cur = cur.parent;
  }
  return "";
}

function findLine(lines, value) {
  const needle = String(value).slice(0, 40);
  const index = lines.findIndex((line) => line.includes(needle));
  return index >= 0 ? index + 1 : 1;
}

function hash(input) {
  return createHash("sha1").update(input).digest("hex");
}

function hashText(input) {
  return hash(normalizeText(input));
}

function relative(file) {
  return path.relative(root, file).replace(/\\/g, "/");
}

function mergeStatus(item, state) {
  const review = state.reviews?.[item.id];
  const status = review?.approvedHash === item.hash ? "approved" : review?.reviewedHash === item.hash ? review.currentStatus : "needs_review";
  return { ...item, status };
}

function countStatuses(items) {
  return items.reduce(
    (acc, item) => {
      acc[item.status] += 1;
      return acc;
    },
    { approved: 0, needs_review: 0, rejected: 0, needs_work: 0, deferred: 0 },
  );
}

function assessCopyRisk(text, context = {}) {
  const notes = [];
  const flags = [];
  const lower = text.toLowerCase();
  let score = 12;
  const banned = [
    "ai-powered",
    "all-in-one",
    "autonomous",
    "copilot",
    "cutting-edge",
    "delight",
    "enterprise-grade",
    "game-changer",
    "intelligent",
    "leverage",
    "powerful",
    "revolutionary",
    "seamless",
    "stakeholder",
    "streamline",
    "supercharge",
    "transform",
    "unleash",
    "world-class",
  ];
  const bannedHits = banned.filter((word) => lower.includes(word));
  if (bannedHits.length) {
    score += Math.min(34, bannedHits.length * 10);
    flags.push("off-brand-language");
    notes.push(`Contains banned or risky language: ${bannedHits.join(", ")}.`);
  }
  if (/\b(api|webhook|endpoint|oauth|repo|pull request|kanban|scrum|sprint|mvp)\b/i.test(text)) {
    score += 14;
    flags.push("jargon");
    notes.push("Contains technical or project-management jargon. Confirm the surface is exempt.");
  }
  if (/\b(best|only|guarantee|guaranteed|never fails|always|everyone)\b/i.test(text)) {
    score += 12;
    flags.push("claim-risk");
    notes.push("Makes a broad claim. Check proof before shipping.");
  }
  if (/[€$£]\s?\d|\bpricing\b|\bprice\b|\btrial\b|\bcontract\b|\blegal\b|\bterms\b/i.test(text)) {
    score += 18;
    flags.push("pricing-legal-risk");
    notes.push("Touches money, legal, or commitment language. Founder review should be explicit.");
  }
  if (text.length > 180) {
    score += 8;
    flags.push("too-long");
    notes.push("Long copy. Consider tightening before approval.");
  }
  if (context.exposure === "public" || context.exposure === "marketing") score += 8;
  if (context.exposure === "legal") score += 18;
  if (context.copyType === "pricing" || context.copyType === "legal") score += 18;
  if (context.copyType === "cta" && /learn more|click here|get started/i.test(text)) {
    score += 8;
    flags.push("weak-cta");
    notes.push("CTA may be generic. Prefer the concrete next action.");
  }
  const riskLevel = score >= 70 ? "high" : score >= 40 ? "medium" : "low";
  if (notes.length === 0) notes.push("No obvious brand, length, claim, or pricing risk found.");
  return { riskScore: Math.min(100, score), riskLevel, aiNotes: notes, flags };
}
