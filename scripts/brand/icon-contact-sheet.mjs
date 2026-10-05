/**
 * Fetches every icon a running site serves and lays them on one sheet, so a
 * person can look at them before they ship.
 *
 *   node scripts/brand/icon-contact-sheet.mjs <out.png> <after-url> [<before-url>]
 *
 *   node scripts/brand/icon-contact-sheet.mjs sheet.png http://127.0.0.1:3111 https://signalstudio.ie
 *
 * Nothing is drawn from source: the icons are found the way a browser finds
 * them (the icon links in the page head, then the manifest), fetched from
 * the server, and the ICO is split into its frames. Each one is shown on a
 * white, a light grey and a dark tab strip at 16, 32, 48, 180, 192 and 512
 * pixels. With a second URL, each surface is shown before and after, one
 * above the other. The last rows show the install tiles under the masks a
 * phone applies, and the tab frames magnified with no smoothing.
 *
 * It also prints, for every icon, how much of it is transparent and how
 * much is dark, and exits 1 if the first URL serves a dark pixel anywhere.
 */
import { chromium } from "@playwright/test";
import { PNG } from "pngjs";

const [out, afterUrl, beforeUrl] = process.argv.slice(2);
if (!out || !afterUrl) throw new Error("Usage: icon-contact-sheet.mjs <out.png> <after-url> [<before-url>]");

const SIZES = [16, 32, 48, 180, 192, 512];
const GROUNDS = [
  { name: "white", colour: "#ffffff", dark: false },
  { name: "light grey", colour: "#f1f3f4", dark: false },
  { name: "dark", colour: "#202124", dark: true },
];

const get = async (base, path) => {
  const response = await fetch(new URL(path, base), { cache: "no-store" });
  if (!response.ok) throw new Error(`${base}${path} returned ${response.status}`);
  return Buffer.from(await response.arrayBuffer());
};
const dataUrl = (buffer, type) => `data:${type};base64,${buffer.toString("base64")}`;
const attribute = (tag, name) => tag.match(new RegExp(`\\b${name}=["']([^"']*)["']`, "i"))?.[1];

/** How much of a PNG is clear, and how much is a dark, drawn pixel. */
function measure(buffer) {
  const png = PNG.sync.read(buffer);
  let clear = 0;
  let dark = 0;
  for (let i = 0; i < png.data.length; i += 4) {
    if (png.data[i + 3] < 8) clear += 1;
    else if (png.data[i + 2] < 200) dark += 1;
  }
  const total = png.width * png.height;
  return {
    size: `${png.width}x${png.height}`,
    corner: `rgba(${[...png.data.subarray(0, 4)].join(",")})`,
    clear: `${((100 * clear) / total).toFixed(1)}%`,
    dark: `${((100 * dark) / total).toFixed(1)}%`,
    hasDark: dark > 0,
  };
}

function icoFrames(buffer) {
  return Array.from({ length: buffer.readUInt16LE(4) }, (_, index) => {
    const entry = 6 + index * 16;
    const length = buffer.readUInt32LE(entry + 8);
    const offset = buffer.readUInt32LE(entry + 12);
    return { size: buffer[entry] || 256, png: buffer.subarray(offset, offset + length) };
  });
}

/**
 * Every icon surface one site serves: { role, label, at(size, ground) → src,
 * notes[] }. Roles pair a surface before with the same surface after.
 */
async function surfaces(base) {
  const html = (await get(base, "/")).toString();
  const links = html.match(/<link\b[^>]*>/gi) ?? [];
  const found = [];
  const report = [];

  for (const tag of links) {
    const rel = attribute(tag, "rel")?.toLowerCase();
    const href = attribute(tag, "href");
    if (!href || !["icon", "shortcut icon", "apple-touch-icon", "apple-touch-icon-precomposed", "mask-icon"].includes(rel)) continue;
    const type = attribute(tag, "type") ?? "";
    const path = href.replace(/\?.*$/, "");
    const body = await get(base, href);

    if (type.includes("x-icon") || path.endsWith(".ico")) {
      const frames = icoFrames(body);
      for (const frame of frames) report.push({ icon: `${path} ${frame.size}px frame`, ...measure(frame.png) });
      // A browser takes the smallest frame that covers the size it is drawing.
      const pick = (size) => (frames.find((frame) => frame.size >= size) ?? frames.at(-1)).png;
      found.push({ role: "tab-ico", label: `${href} · link rel="${rel}" · frames ${frames.map((frame) => frame.size).join(", ")}`, at: (size) => dataUrl(pick(size), "image/png") });
      found.push({ role: "zoom", frames });
    } else if (type.includes("svg") || path.endsWith(".svg")) {
      const svg = body.toString();
      // What a browser in a dark colour scheme draws: the dark rule, applied.
      const darkRule = svg.match(/@media \(prefers-color-scheme: dark\) \{ (\.mark \{ color: [^;]+; \}) \}/)?.[1];
      const svgDark = darkRule ? svg.replace(/\.mark \{ color: [^;]+; \}/, darkRule) : svg;
      report.push({ icon: path, size: "vector", corner: "none", clear: /<rect|background/i.test(svg) ? "has a background" : "no background", dark: "0.0%", hasDark: false });
      found.push({
        role: "tab-svg",
        label: `${href} · link rel="${rel}" · the dark strip shows its dark-scheme rule`,
        at: (size, ground) => dataUrl(Buffer.from(ground.dark ? svgDark : svg), "image/svg+xml"),
      });
    } else {
      report.push({ icon: path, ...measure(body) });
      const apple = rel.startsWith("apple");
      found.push({ role: apple ? "apple" : "tab-png", label: `${href} · link rel="${rel}"`, at: () => dataUrl(body, "image/png"), tile: apple ? body : undefined });
    }
  }

  const manifestHref = links.map((tag) => (attribute(tag, "rel") === "manifest" ? attribute(tag, "href") : undefined)).find(Boolean);
  const manifest = manifestHref ? JSON.parse((await get(base, manifestHref)).toString()) : { icons: [] };
  for (const icon of manifest.icons ?? []) {
    const body = await get(base, icon.src);
    report.push({ icon: `manifest ${icon.src} (${icon.purpose})`, ...measure(body) });
    found.push({
      role: `manifest-${icon.purpose}-${icon.sizes}`,
      label: `manifest ${icon.src} · ${icon.sizes} · purpose ${icon.purpose}`,
      at: () => dataUrl(body, "image/png"),
      tile: icon.purpose === "maskable" ? body : undefined,
      maskable: icon.purpose === "maskable",
    });
  }
  return { base, found, report, splash: manifest.background_color, themeColor: manifest.theme_color };
}

const after = await surfaces(afterUrl);
const before = beforeUrl ? await surfaces(beforeUrl) : undefined;

for (const site of [before, after].filter(Boolean)) {
  console.log(`\n${site.base} · manifest background_color ${site.splash}, theme_color ${site.themeColor}`);
  console.table(site.report.map(({ hasDark, ...row }) => row));
}

const ROLE_ORDER = ["tab-ico", "tab-svg", "tab-png", "apple", "manifest-any-180x180", "manifest-any-192x192", "manifest-any-512x512", "manifest-maskable-192x192", "manifest-maskable-512x512"];
const roles = [...new Set([...ROLE_ORDER, ...[before, after].filter(Boolean).flatMap((site) => site.found.map((surface) => surface.role))])].filter((role) => role !== "zoom");

const cell = (src, size) => `<figure><img src="${src}" width="${size}" height="${size}" alt=""><figcaption>${size}</figcaption></figure>`;
const strip = (surface, ground) => `<div class="strip" style="background:${ground.colour}">${SIZES.map((size) => cell(surface.at(size, ground), size)).join("")}</div>`;
const row = (site, surface, tag) => `<h3><b class="${tag}">${tag}</b> ${new URL(site.base).host} · ${surface.label}</h3><div class="grounds">${GROUNDS.map((ground) => strip(surface, ground)).join("")}</div>`;

const blocks = roles.map((role) => {
  const rows = [];
  for (const [site, tag] of [[before, "before"], [after, "after"]]) {
    if (!site) continue;
    const surface = site.found.find((candidate) => candidate.role === role);
    if (surface) rows.push(row(site, surface, tag));
    else rows.push(`<h3><b class="${tag}">${tag}</b> ${new URL(site.base).host} · not served</h3>`);
  }
  return `<section>${rows.join("")}</section>`;
});

// As a phone shows them: iOS rounds the Apple tile; Android cuts a circle
// out of the maskable icon's inner 80%.
const installed = (site, tag) => {
  const tiles = site.found.filter((surface) => surface.tile);
  const shapes = tiles.map((surface) => {
    const src = dataUrl(surface.tile, "image/png");
    const shape = surface.maskable
      ? `<span class="mask circle"><img src="${src}" width="225" height="225" alt=""></span>`
      : `<span class="mask squircle"><img src="${src}" width="180" height="180" alt=""></span>`;
    return `<figure>${shape}<figcaption>${surface.label.split(" · ")[0]}</figcaption></figure>`;
  }).join("");
  return `<h3><b class="${tag}">${tag}</b> ${new URL(site.base).host} · splash ${site.splash}</h3><div class="grounds">${GROUNDS.map((ground) => `<div class="strip" style="background:${ground.colour}">${shapes}</div>`).join("")}</div>`;
};

const zoomed = (site, tag) => {
  const frames = site.found.find((surface) => surface.role === "zoom")?.frames ?? [];
  const figures = [16, 32].flatMap((size) => {
    const frame = frames.find((candidate) => candidate.size === size);
    if (!frame) return [];
    const src = dataUrl(frame.png, "image/png");
    return GROUNDS.map((ground) => `<figure class="pad" style="background:${ground.colour}"><img class="zoom" src="${src}" width="${size * 10}" height="${size * 10}" alt=""><figcaption>${size}px, ten times</figcaption></figure>`);
  }).join("");
  return `<h3><b class="${tag}">${tag}</b> ${new URL(site.base).host} · favicon.ico frames</h3><div class="zooms">${figures}</div>`;
};

const sites = [[before, "before"], [after, "after"]].filter(([site]) => site);
const html = `<!doctype html><meta charset="utf-8"><style>
  body { margin: 0; padding: 28px; font: 14px/1.4 system-ui, sans-serif; background: #d9d9de; color: #1c1c1f; width: 3640px; }
  h1 { font-size: 22px; margin: 0 0 4px; }
  h2 { font-size: 16px; margin: 36px 0 0; }
  h3 { font-size: 14px; font-weight: 500; margin: 14px 0 8px; }
  p { margin: 0; color: #55555c; }
  b { display: inline-block; min-width: 54px; padding: 1px 8px; margin-right: 6px; border-radius: 4px; font-weight: 600; text-align: center; color: #fff; }
  b.before { background: #8a8a92; } b.after { background: #6860ff; }
  section { margin-top: 26px; padding-top: 6px; border-top: 2px solid #b9b9c2; }
  .grounds { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
  .strip { display: flex; align-items: flex-end; gap: 26px; padding: 20px; border-radius: 8px; }
  figure { margin: 0; display: grid; justify-items: center; gap: 8px; }
  figcaption { font-size: 11px; color: #8a8a8f; }
  .mask { display: block; overflow: hidden; width: 180px; height: 180px; }
  .mask.squircle { border-radius: 40px; }
  .mask.circle { border-radius: 50%; }
  .mask.circle img { margin: -22.5px; display: block; }
  .zooms { display: flex; gap: 12px; flex-wrap: wrap; }
  .pad { padding: 20px; border-radius: 8px; }
  .zoom { image-rendering: pixelated; }
</style>
<h1>Signal Studio icons, as served</h1>
<p>Every icon the page head and the manifest name, fetched from the running site. Three tab strips: white, light grey (#f1f3f4), dark (#202124). Sizes 16, 32, 48, 180, 192, 512.</p>
${blocks.join("")}
<h2>As a phone shows the tiles: iOS rounds the Apple touch icon, Android cuts a circle from the maskable icon</h2>
${sites.map(([site, tag]) => installed(site, tag)).join("")}
<h2>The tab frames, magnified with no smoothing</h2>
${sites.map(([site, tag]) => zoomed(site, tag)).join("")}`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 3696, height: 1200 }, deviceScaleFactor: 1 });
await page.setContent(html);
await page.screenshot({ path: out, fullPage: true });
await browser.close();
console.log(`Icon contact sheet written: ${out}`);

if (after.report.some((entry) => entry.hasDark)) {
  console.error(`${afterUrl} serves an icon with dark pixels. No icon may have a dark background.`);
  process.exit(1);
}
