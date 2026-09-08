/** Deterministic vector-to-film renderer. Requires local FFmpeg; no browser or network. */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { createRequire } from "node:module";
import { spawn } from "node:child_process";
import { createHash } from "node:crypto";
import { evaluateClip, gesture } from "../../src/lib/dot/clips";
import {
  MOODS,
  PERFORMANCES,
  GESTURES,
  DOT_VERSION,
  FPS,
  clipInfo,
  isClipId,
  type ClipId,
} from "../../src/lib/dot/model";
import { renderSvg, renderContents } from "../../src/lib/dot/render";

// Sharp ships with the pinned Next dependency. Resolve through its package boundary.
const dotRequire = createRequire(__filename);
const sharp = createRequire(dotRequire.resolve("next/package.json"))(
  "sharp",
) as (input: Buffer) => { png: () => { toBuffer: () => Promise<Buffer> } };
const args = process.argv.slice(2),
  opt = (name: string, fallback: string) =>
    args[args.indexOf(name) + 1] && args.includes(name)
      ? args[args.indexOf(name) + 1]
      : fallback;
const out = path.resolve(opt("--out", "output/dot")),
  size = Number(opt("--size", "1080"));
const target = opt("--clip", "film"),
  alpha = args.includes("--alpha"),
  pack = args.includes("--library");
if (!Number.isInteger(size) || size < 64 || size > 4096 || size % 2)
  throw new Error("Choose an even size between 64 and 4096.");
if (!isClipId(target)) throw new Error("Unknown Dot clip.");
async function command(executable: string, arguments_: string[]) {
  await new Promise<void>((resolve, reject) => {
    const child = spawn(executable, arguments_, {
      windowsHide: true,
      stdio: ["ignore", "ignore", "pipe"],
    });
    let stderr = "";
    child.stderr.on("data", (b) => {
      stderr += b;
    });
    child.on("error", reject);
    child.on("close", (code) =>
      code === 0 ? resolve() : reject(new Error(stderr)),
    );
  });
}
async function exportClip(clip: ClipId) {
  const folder = path.join(out, alpha ? `${clip}-alpha` : `${clip}-frames`);
  await mkdir(folder, { recursive: true });
  const frames = Math.round(clipInfo(clip).duration * FPS),
    checksums: string[] = [];
  for (let base = 0; base < frames; base += 8) {
    await Promise.all(
      Array.from({ length: Math.min(8, frames - base) }, async (_, i) => {
        const f = base + i,
          svg = renderSvg(evaluateClip(clip, f / FPS, 7), {
            size,
            stage: alpha ? "transparent" : "paper",
          });
        const png = await sharp(Buffer.from(svg)).png().toBuffer();
        const filename = `frame-${String(f).padStart(5, "0")}.png`;
        await writeFile(path.join(folder, filename), png);
        checksums[f] =
          `${createHash("sha256").update(png).digest("hex")}  ${filename}`;
      }),
    );
    if (base % 240 === 0) console.log(`${clip}: ${base}/${frames}`);
  }
  await writeFile(
    path.join(folder, "SHA256SUMS.txt"),
    checksums.join("\n") + "\n",
  );
  if (!alpha)
    await command("ffmpeg", [
      "-y",
      "-framerate",
      String(FPS),
      "-i",
      path.join(folder, "frame-%05d.png"),
      "-c:v",
      "libx264",
      "-crf",
      "16",
      "-preset",
      "medium",
      "-pix_fmt",
      "yuv420p",
      "-movflags",
      "+faststart",
      "-an",
      path.join(out, `dot-${clip}-${size}.mp4`),
    ]);
  await writeFile(
    path.join(folder, "manifest.json"),
    JSON.stringify(
      {
        version: DOT_VERSION,
        clip,
        seed: 7,
        fps: FPS,
        frames,
        duration: frames / FPS,
        size,
        alpha,
        firstFrame: 0,
        lastFrame: frames - 1,
        background: alpha ? "transparent" : "#f9f9fb",
        checksum: "SHA256SUMS.txt",
        audio: false,
      },
      null,
      2,
    ),
  );
}
async function library() {
  const assets = path.join(out, "library");
  await mkdir(assets, { recursive: true });
  for (const m of [...MOODS, ...PERFORMANCES])
    for (const px of [32, 64, 102, 256, 512]) {
      const svg = renderSvg(evaluateClip(m.id, m.poster), {
        size: px,
        stage: "transparent",
      });
      await writeFile(path.join(assets, `dot-${m.id}-${px}.svg`), svg);
      await writeFile(
        path.join(assets, `dot-${m.id}-${px}.png`),
        await sharp(Buffer.from(svg)).png().toBuffer(),
      );
    }
  for (const color of ["ink", "paper"] as const)
    for (const m of MOODS)
      for (const px of [32, 64, 102, 256, 512]) {
        const svg = renderSvg(evaluateClip(m.id, m.poster), {
          size: px,
          color,
          stage: "transparent",
        });
        await writeFile(
          path.join(assets, `dot-${m.id}-${color}-${px}.svg`),
          svg,
        );
        await writeFile(
          path.join(assets, `dot-${m.id}-${color}-${px}.png`),
          await sharp(Buffer.from(svg)).png().toBuffer(),
        );
      }
  for (const m of MOODS) {
    const svg = renderSvg(evaluateClip(m.id, m.poster, 7, true), {
      size: 512,
      stage: "transparent",
    });
    await writeFile(path.join(assets, `dot-${m.id}-reduced.svg`), svg);
    await writeFile(
      path.join(assets, `dot-${m.id}-reduced.png`),
      await sharp(Buffer.from(svg)).png().toBuffer(),
    );
  }
  for (const color of ["indigo", "ink", "paper"] as const) {
    const svg = renderSvg(evaluateClip("idle", 0), {
      size: 512,
      color,
      face: false,
      stage: "transparent",
    });
    await writeFile(path.join(assets, `dot-mark-${color}.svg`), svg);
    await writeFile(
      path.join(assets, `dot-mark-${color}.png`),
      await sharp(Buffer.from(svg)).png().toBuffer(),
    );
  }
  for (const g of GESTURES)
    await writeFile(
      path.join(assets, `dot-gesture-${g}.svg`),
      renderSvg(gesture(evaluateClip("idle", 0), g, 0.2), {
        stage: "transparent",
      }),
    );
  const cells = [...MOODS, ...PERFORMANCES]
    .map(
      (m, i) =>
        `<g transform="translate(${(i % 4) * 300 + 150} ${Math.floor(i / 4) * 290 + 200})"><g transform="scale(1.4)">${renderContents(evaluateClip(m.id, m.poster), { stage: "transparent" })}</g><text x="0" y="112" text-anchor="middle" fill="#202029" font-size="17">${m.name}</text></g>`,
    )
    .join("");
  const sheet = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1340" viewBox="0 0 1200 1340"><rect width="1200" height="1340" fill="#f9f9fb"/><g font-family="Arial,sans-serif"><text x="56" y="62" font-size="32" fill="#202029">Dot. One circle, sixteen little worlds.</text><text x="56" y="94" font-size="14" fill="#666670">Signal Studio · Dot v${DOT_VERSION} · Character and performance model sheet</text>${cells}<text x="56" y="1290" font-size="13" fill="#666670">Body: #4f46e5 · Circular silhouette at every frame · Seed 7 · 60 fps</text></g></svg>`;
  await writeFile(path.join(out, "Dot-model-sheet.svg"), sheet);
  await writeFile(
    path.join(out, "Dot-model-sheet.png"),
    await sharp(Buffer.from(sheet)).png().toBuffer(),
  );
  await writeFile(
    path.join(assets, "manifest.json"),
    JSON.stringify(
      {
        version: DOT_VERSION,
        moods: MOODS,
        performances: PERFORMANCES,
        gestures: GESTURES,
        sizes: [32, 64, 102, 256, 512],
        moodColors: ["indigo", "ink", "paper"],
        reducedStills: true,
        facelessMarks: true,
        format: ["svg", "png"],
        background: "transparent",
        seed: 7,
      },
      null,
      2,
    ),
  );
}
async function main() {
  await mkdir(out, { recursive: true });
  if (pack) await library();
  else await exportClip(target as ClipId);
  console.log(`Saved to ${out}`);
}
main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
