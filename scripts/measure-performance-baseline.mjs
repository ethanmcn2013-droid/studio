import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";

const root = path.resolve(process.cwd(), "..");
const apps = [
  ["studio", "studio"],
  ["notes", "notes"],
  ["tasks", "tasks"],
  ["timeline", "roadmap"],
  ["signal", "analytics"],
];

function files(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) files(file, out);
    else out.push(file);
  }
  return out;
}

const results = {};
for (const [label, repo] of apps) {
  const chunkDir = path.join(root, repo, ".next", "static", "chunks");
  const chunks = files(chunkDir).filter((file) => file.endsWith(".js"));
  const measurements = chunks.map((file) => {
    const data = fs.readFileSync(file);
    return { file: path.relative(chunkDir, file), raw: data.length, gzip: zlib.gzipSync(data, { level: 9 }).length };
  });
  results[label] = {
    built: fs.existsSync(chunkDir),
    jsFiles: measurements.length,
    rawBytes: measurements.reduce((sum, value) => sum + value.raw, 0),
    gzipBytes: measurements.reduce((sum, value) => sum + value.gzip, 0),
    largestGzip: measurements.sort((a, b) => b.gzip - a.gzip).slice(0, 5),
  };
}
console.log(JSON.stringify({ measuredAt: new Date().toISOString(), results }, null, 2));
