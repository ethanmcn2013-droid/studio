import { mkdir, rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const renders = [
  { base: "timeline", sizes: [128, 256, 512] },
  { base: "signal", sizes: [128, 256, 512] },
];

const svgDir = path.join(root, "public", "brand", "kit", "svg", "product-wordmarks");
const pngDir = path.join(root, "public", "brand", "kit", "png", "product-wordmarks");
const zipPath = path.join(root, "public", "brand", "signal-studio-brand-kit.zip");
const kitPath = path.join(root, "public", "brand", "kit", "*");

await mkdir(pngDir, { recursive: true });

for (const { base, sizes } of renders) {
  const source = path.join(svgDir, `${base}.svg`);
  for (const size of sizes) {
    const output = path.join(pngDir, `${base}-${size}.png`);
    await execFileAsync("magick", [
      source,
      "-background",
      "none",
      "-resize",
      `x${size}`,
      output,
    ]);
    console.log(`rendered ${path.relative(root, output)}`);
  }
}

await rm(zipPath, { force: true });
await execFileAsync("powershell.exe", [
  "-NoProfile",
  "-Command",
  `Compress-Archive -Path '${kitPath}' -DestinationPath '${zipPath}' -Force`,
]);

console.log(`rebuilt ${path.relative(root, zipPath)}`);
