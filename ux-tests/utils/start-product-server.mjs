import { existsSync } from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const studioRoot = path.resolve(__dirname, "..", "..");
const workspaceRoot = path.resolve(studioRoot, "..");

const PRODUCT_DIRS = {
  notes: "notes",
  tasks: "tasks",
  timeline: "roadmap",
  signal: "analytics",
};

const product = process.argv[2];
const port = process.argv[3];

if (!product || !port || !(product in PRODUCT_DIRS)) {
  console.error("Usage: node start-product-server.mjs <notes|tasks|timeline|signal> <port>");
  process.exit(1);
}

const productDir = path.join(workspaceRoot, PRODUCT_DIRS[product]);
const nextBin = path.join(
  productDir,
  "node_modules",
  ".bin",
  process.platform === "win32" ? "next.CMD" : "next",
);

if (!existsSync(nextBin)) {
  console.error(`Next.js binary not found for ${product}: ${nextBin}`);
  console.error("Install dependencies in the product repo before running UX tests.");
  process.exit(1);
}

const localUrls = {
  NEXT_PUBLIC_NOTES_URL: "http://localhost:4211",
  NEXT_PUBLIC_TASKS_URL: "http://localhost:4212",
  NEXT_PUBLIC_TIMELINE_URL: "http://localhost:4213",
  NEXT_PUBLIC_SIGNAL_URL: "http://localhost:4214",
  NEXT_PUBLIC_SITE_URL: `http://localhost:${port}`,
  TASKS_API_URL: "http://localhost:4212",
};

const childEnv = {
    ...process.env,
    ...localUrls,
    PORT: port,
    SIGNAL_ACCESS_MODE: "demo",
    NEXT_PUBLIC_SIGNAL_ACCESS_MODE: "demo",
    DEMO_MODE: "true",
    NEXT_PUBLIC_DEMO_MODE: "true",
    UX_ASSURANCE_MODE: "true",
    NEXT_PUBLIC_UX_ASSURANCE_MODE: "true",
    NOTES_TO_TASKS_SECRET: "ux-local-notes-to-tasks",
};

const child =
  process.platform === "win32"
    ? spawn("cmd.exe", ["/d", "/c", commandLineForCmd(nextBin, ["dev", "-p", port])], {
        cwd: productDir,
        env: childEnv,
        stdio: "inherit",
      })
    : spawn(nextBin, ["dev", "-p", port], {
        cwd: productDir,
        env: childEnv,
        stdio: "inherit",
      });

function stop() {
  if (!child.killed) child.kill("SIGTERM");
}

process.on("SIGINT", stop);
process.on("SIGTERM", stop);

child.on("exit", (code, signal) => {
  if (signal) process.exit(0);
  process.exit(code ?? 1);
});

function commandLineForCmd(bin, args) {
  return [bin, ...args].map(quoteCmdPart).join(" ");
}

function quoteCmdPart(part) {
  const value = String(part);
  return /[\s&()^|<>]/.test(value) ? `"${value}"` : value;
}
