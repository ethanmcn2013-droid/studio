import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const studioRoot = path.resolve(__dirname, "..", "..");
const workspaceRoot = path.resolve(studioRoot, "..");
const reportDir = path.join(studioRoot, "ux-tests", "reports");
const requirementsPath = path.join(studioRoot, "ux-tests", "env", "requirements.json");

const PRODUCT_DIRS = {
  studio: "studio",
  notes: "notes",
  tasks: "tasks",
  timeline: "roadmap",
  signal: "analytics",
};

const ENV_FILE_NAMES = [
  ".env.local",
  ".env",
  ".env.development",
  ".env.production",
  ".env.test",
  ".env.example",
];

const args = process.argv.slice(2);
const profile = valueAfter("--profile") ?? "ux-demo";
const failOnMissing = args.includes("--fail-on-missing");
const jsonOnly = args.includes("--json");
const externalEnvFiles = externalEnvFileArgs();
const runId =
  process.env.UX_RUN_ID ?? new Date().toISOString().replace(/[:.]/g, "-");

const requirements = JSON.parse(fs.readFileSync(requirementsPath, "utf8"));
const profileConfig = requirements.profiles?.[profile];

if (!profileConfig) {
  console.error(`Unknown env readiness profile "${profile}".`);
  process.exit(2);
}

const envSources = loadEnvSources();
const productResults = Object.entries(profileConfig.products).map(
  ([product, config]) => checkProduct(product, config, envSources),
);
const missingRequired = productResults.flatMap((product) =>
  product.requiredEnv.filter((entry) => !entry.present),
);
const missingFiles = productResults.flatMap((product) =>
  product.requiredFiles.filter((entry) => !entry.present),
);
const summary = {
  runId,
  generatedAt: new Date().toISOString(),
  profile,
  status: missingRequired.length === 0 && missingFiles.length === 0 ? "passed" : "failed",
  missingRequiredEnv: missingRequired.length,
  missingRequiredFiles: missingFiles.length,
  products: productResults,
};

fs.mkdirSync(reportDir, { recursive: true });
const jsonPath = path.join(reportDir, `env-readiness-${runId}.json`);
const mdPath = path.join(reportDir, `env-readiness-${runId}.md`);
fs.writeFileSync(jsonPath, JSON.stringify(summary, null, 2), "utf8");
fs.writeFileSync(mdPath, renderMarkdown(summary, profileConfig.description), "utf8");

if (jsonOnly) {
  console.log(JSON.stringify(summary, null, 2));
} else {
  console.log(`Env readiness: ${mdPath}`);
  console.log(
    `${summary.status}: ${summary.missingRequiredFiles} missing required files, ${summary.missingRequiredEnv} missing required env keys`,
  );
}

if (failOnMissing && summary.status !== "passed") {
  process.exit(1);
}

function checkProduct(product, config, envSources) {
  const productDir = path.join(workspaceRoot, PRODUCT_DIRS[product]);
  const sourceMap = envSources[product] ?? new Map();

  return {
    product,
    root: productDir,
    requiredFiles: (config.requiredFiles ?? []).map((relativePath) => ({
      path: relativePath,
      present: fs.existsSync(path.join(productDir, platformPath(relativePath))),
    })),
    requiredEnv: (config.requiredEnv ?? []).map((key) => ({
      key,
      present: hasRealEnvValue(sourceMap, key),
      source: sourceFor(sourceMap, key),
      documentedBy: exampleSourceFor(sourceMap, key),
    })),
    recommendedEnv: (config.recommendedEnv ?? []).map((key) => ({
      key,
      present: hasRealEnvValue(sourceMap, key),
      source: sourceFor(sourceMap, key),
      documentedBy: exampleSourceFor(sourceMap, key),
    })),
  };
}

function loadEnvSources() {
  const out = {};
  const externalKeys = loadExternalEnvKeys();
  for (const [product, dirName] of Object.entries(PRODUCT_DIRS)) {
    const productDir = path.join(workspaceRoot, dirName);
    const keys = new Map();
    for (const fileName of ENV_FILE_NAMES) {
      const file = path.join(productDir, fileName);
      if (!fs.existsSync(file)) continue;
      const parsed = parseEnvFile(file);
      for (const key of parsed) {
        const existing = keys.get(key) ?? { realSource: null, exampleSource: null };
        if (fileName === ".env.example") {
          existing.exampleSource ??= `${product}/${fileName}`;
        } else {
          existing.realSource ??= `${product}/${fileName}`;
        }
        keys.set(key, existing);
      }
    }
    for (const [key, source] of externalKeys) {
      const existing = keys.get(key) ?? { realSource: null, exampleSource: null };
      existing.realSource ??= source;
      keys.set(key, existing);
    }
    out[product] = keys;
  }
  return out;
}

function loadExternalEnvKeys() {
  const keys = new Map();
  for (const file of externalEnvFiles) {
    if (!fs.existsSync(file)) continue;
    for (const key of parseEnvFile(file)) {
      if (!keys.has(key)) keys.set(key, `external/${path.basename(file)}`);
    }
  }
  return keys;
}

function parseEnvFile(file) {
  const keys = [];
  const source = fs.readFileSync(file, "utf8");
  for (const line of source.split(/\r?\n/)) {
    const match = /^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=/.exec(line);
    if (match) keys.push(match[1]);
  }
  return keys;
}

function renderMarkdown(summary, description) {
  const lines = [
    "# Signal Studio Env Readiness",
    "",
    `- Generated: ${summary.generatedAt}`,
    `- Profile: ${summary.profile}`,
    `- Status: ${summary.status}`,
    `- Missing required files: ${summary.missingRequiredFiles}`,
    `- Missing required env keys: ${summary.missingRequiredEnv}`,
    "",
    description,
    "",
    "Secret values are intentionally never printed. This report only shows key presence and source file labels.",
    "",
    "## Products",
    "",
  ];

  for (const product of summary.products) {
    lines.push(`### ${product.product}`, "");
    lines.push("| Required File | Present |", "| --- | --- |");
    for (const file of product.requiredFiles) {
      lines.push(`| ${file.path} | ${file.present ? "yes" : "no"} |`);
    }
    if (product.requiredFiles.length === 0) lines.push("| None | yes |");
    lines.push("");
    lines.push("| Required Env Key | Present | Source |", "| --- | --- | --- |");
    for (const env of product.requiredEnv) {
      lines.push(
        `| ${env.key} | ${env.present ? "yes" : "no"} | ${env.source ?? ""}${env.documentedBy ? ` (documented by ${env.documentedBy})` : ""} |`,
      );
    }
    if (product.requiredEnv.length === 0) lines.push("| None | yes |  |");
    lines.push("");
    if (product.recommendedEnv.length > 0) {
      lines.push("| Recommended Env Key | Present | Source |", "| --- | --- | --- |");
      for (const env of product.recommendedEnv) {
        lines.push(
          `| ${env.key} | ${env.present ? "yes" : "no"} | ${env.source ?? ""}${env.documentedBy ? ` (documented by ${env.documentedBy})` : ""} |`,
        );
      }
      lines.push("");
    }
  }

  return `${lines.join("\n")}\n`;
}

function valueAfter(flag) {
  const index = args.indexOf(flag);
  return index === -1 ? null : args[index + 1] ?? null;
}

function valuesAfter(flag) {
  const values = [];
  for (let index = 0; index < args.length; index += 1) {
    if (args[index] === flag && args[index + 1]) values.push(args[index + 1]);
  }
  return values;
}

function externalEnvFileArgs() {
  const fromArgs = valuesAfter("--env-file");
  const fromEnv = (process.env.UX_ENV_FILES ?? "")
    .split(path.delimiter)
    .map((value) => value.trim())
    .filter(Boolean);
  return [...fromArgs, ...fromEnv].map((file) => path.resolve(file));
}

function platformPath(relativePath) {
  return relativePath.replace(/\//g, path.sep);
}

function hasRealEnvValue(sourceMap, key) {
  return Boolean(process.env[key]) || Boolean(sourceMap.get(key)?.realSource);
}

function sourceFor(sourceMap, key) {
  if (process.env[key]) return "process.env";
  return sourceMap.get(key)?.realSource ?? null;
}

function exampleSourceFor(sourceMap, key) {
  return sourceMap.get(key)?.exampleSource ?? null;
}
