import fs from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);
const runPrefix = valueAfter("--run");
const root = process.cwd();
const screenshotRoot = path.join(root, "ux-tests", "screenshots");
const reportDir = path.join(root, "ux-tests", "reports");

if (!fs.existsSync(screenshotRoot)) {
  console.error("No UX screenshots directory exists yet.");
  process.exit(1);
}

const runDirs = fs
  .readdirSync(screenshotRoot, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .filter((name) => !runPrefix || name.startsWith(runPrefix))
  .sort();

if (runDirs.length === 0) {
  console.error(
    runPrefix
      ? `No screenshot runs matched ${runPrefix}.`
      : "No screenshot runs found.",
  );
  process.exit(1);
}

const images = runDirs.flatMap((runDir) => {
  const dir = path.join(screenshotRoot, runDir);
  return fs
    .readdirSync(dir)
    .filter((name) => name.endsWith(".png"))
    .sort()
    .map((name) => ({
      runDir,
      name,
      relativePath: `../screenshots/${runDir}/${name}`,
      label: labelFromName(name),
    }));
});

fs.mkdirSync(reportDir, { recursive: true });
const galleryName = runPrefix
  ? `screenshot-gallery-${runPrefix}.html`
  : "screenshot-gallery-latest.html";
const galleryPath = path.join(reportDir, galleryName);
fs.writeFileSync(galleryPath, renderGallery(runPrefix ?? "latest", images), "utf8");
fs.writeFileSync(
  path.join(reportDir, "screenshot-gallery-latest.html"),
  renderGallery(runPrefix ?? "latest", images),
  "utf8",
);

console.log(`Screenshot gallery: ${galleryPath}`);
console.log(`Screenshot gallery: ${path.join(reportDir, "screenshot-gallery-latest.html")}`);

function renderGallery(runId, entries) {
  const cards = entries
    .map(
      (entry) => `<figure>
  <a href="${escapeAttr(entry.relativePath)}"><img src="${escapeAttr(entry.relativePath)}" alt="${escapeAttr(entry.label)}"></a>
  <figcaption><strong>${escapeHtml(entry.label)}</strong><span>${escapeHtml(entry.runDir)}</span></figcaption>
</figure>`,
    )
    .join("\n");

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Signal Studio UX Screenshot Gallery</title>
  <style>
    body { margin: 0; font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; color: #171717; background: #f7f6f2; }
    header { position: sticky; top: 0; z-index: 1; border-bottom: 1px solid #ded8ca; background: rgba(247,246,242,0.92); backdrop-filter: blur(12px); padding: 18px 24px; }
    h1 { margin: 0; font-size: 20px; letter-spacing: -0.02em; }
    p { margin: 4px 0 0; color: #666; font-size: 13px; }
    main { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 18px; padding: 24px; }
    figure { margin: 0; overflow: hidden; border: 1px solid #ded8ca; background: #fff; }
    img { display: block; width: 100%; height: 280px; object-fit: cover; object-position: top left; background: #eee; }
    figcaption { display: flex; flex-direction: column; gap: 2px; padding: 10px 12px; font-size: 12px; line-height: 1.35; }
    figcaption span { color: #777; font-family: ui-monospace, SFMono-Regular, Consolas, monospace; font-size: 11px; }
  </style>
</head>
<body>
  <header>
    <h1>Signal Studio UX Screenshot Gallery</h1>
    <p>Run: ${escapeHtml(runId)} - ${entries.length} screenshots - generated ${escapeHtml(new Date().toISOString())}</p>
  </header>
  <main>${cards}</main>
</body>
</html>
`;
}

function labelFromName(name) {
  return name
    .replace(/\.png$/, "")
    .replace(/-/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function valueAfter(flag) {
  const index = args.indexOf(flag);
  return index === -1 ? null : args[index + 1] ?? null;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function escapeAttr(value) {
  return escapeHtml(value);
}
