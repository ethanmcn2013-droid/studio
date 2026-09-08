import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { performance } from "node:perf_hooks";
import { createRequire } from "node:module";
import { gzipSync } from "node:zlib";
import { evaluateClip } from "../../src/lib/dot/clips";
import { renderContents } from "../../src/lib/dot/render";
import { pngArchive } from "../../src/lib/dot/export-browser";
import { MOODS, PERFORMANCES, clipInfo } from "../../src/lib/dot/model";
async function main() {
  const out = path.resolve(process.argv[2] || "output/dot/verification");
  await mkdir(out, { recursive: true });
  for (let f = 0; f < 200; f++) renderContents(evaluateClip("film", f / 60));
  const times: number[] = [];
  for (let f = 0; f < 1845; f++) {
    const start = performance.now();
    renderContents(evaluateClip("film", f / 60));
    times.push(performance.now() - start);
  }
  times.sort((a, b) => a - b);
  const dotRequire = createRequire(__filename),
    esbuild = createRequire(dotRequire.resolve("tsx/package.json"))("esbuild");
  const bundle = await esbuild.build({
    entryPoints: ["src/lib/dot/player.ts", "src/lib/dot/render.ts"],
    bundle: true,
    minify: true,
    write: false,
    outdir: "unused",
    platform: "browser",
  });
  const report = {
    measuredAt: new Date().toISOString(),
    node: process.version,
    frames: times.length,
    allTimelineFrames: [
      ...MOODS,
      ...PERFORMANCES,
      clipInfo("film"),
      clipInfo("proof"),
    ].reduce((sum, c) => sum + Math.round(c.duration * 60), 0),
    p95EvaluatorAndSvgMs: times[Math.floor(times.length * 0.95)],
    maxMs: times[times.length - 1],
    independentCoreEntryGzipBytes: bundle.outputFiles.map(
      (f: { path: string; contents: Uint8Array }) => ({
        file: path.basename(f.path),
        bytes: gzipSync(f.contents).length,
      }),
    ),
    scope:
      "Node benchmark of pose evaluation plus SVG string generation. Excludes browser DOM, layout, paint, React, network and device throttling; not a browser frame-time or deployed bundle claim.",
  };
  await writeFile(
    path.join(out, "performance.json"),
    JSON.stringify(report, null, 2),
  );
  const zip = pngArchive([
    {
      name: "hello.txt",
      bytes: new TextEncoder().encode("Dot archive verification"),
    },
    { name: "empty.txt", bytes: new Uint8Array() },
  ]);
  await writeFile(
    path.join(out, "archive-test.zip"),
    Buffer.from(await zip.arrayBuffer()),
  );
  console.log(JSON.stringify(report, null, 2));
}
main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
