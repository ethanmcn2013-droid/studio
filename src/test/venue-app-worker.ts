import { spawn } from "node:child_process";
import { createInterface } from "node:readline";
import { resolve } from "node:path";
import { existsSync } from "node:fs";
import { createVenueRuntime } from "@/lib/venue-fulfilment/transport";

/** Explicit paired worktree only; no remote endpoint or ambient database. */
export async function venueAppWorker(withUsage = false) {
  const root = process.env.VENUE_APP_FIXTURE_ROOT;
  if (!root || !existsSync(resolve(root, "src/server/venue-issuance/fixture-worker.cjs"))) throw new Error("Set VENUE_APP_FIXTURE_ROOT to the paired App worktree containing the committed fixture.");
  const child = spawn(process.execPath, ["--import", "tsx", "--import", "./src/test/register-server-only.mjs",
    "src/server/venue-issuance/fixture-worker.cjs", ...(withUsage ? ["--with-usage"] : [])], {
    cwd: root, windowsHide: true, stdio: ["pipe", "pipe", "pipe"],
    env: { NODE_ENV: "test", PATH: process.env.PATH, SystemRoot: process.env.SystemRoot, TEMP: process.env.TEMP, TMP: process.env.TMP,
      NEXT_PUBLIC_SIGNAL_ACCESS_MODE: "review", NEXT_PUBLIC_SIGNAL_DEPLOYMENT_ENV: "preview" },
  });
  let nextId = 1;
  const waiting = new Map<number, { resolve: (value: unknown) => void; reject: (error: Error) => void }>();
  const lines = createInterface({ input: child.stdout });
  const ready = new Promise<void>((ok, fail) => {
    const timer = setTimeout(() => { child.kill(); fail(new Error("App fixture startup timed out")); }, 30_000);
    lines.on("line", line => {
      try {
        const message = JSON.parse(line);
        if (message.ready) { clearTimeout(timer); ok(); return; }
        const pending = waiting.get(message.id); waiting.delete(message.id);
        if (message.error) pending?.reject(new Error("App fixture operation failed")); else pending?.resolve(message.result);
      } catch { /* Never forward arbitrary worker output containing private data. */ }
    });
    child.on("error", () => { clearTimeout(timer); fail(new Error("App fixture failed to start")); });
    child.on("exit", () => { clearTimeout(timer); fail(new Error("App fixture exited"));
      for (const pending of waiting.values()) pending.reject(new Error("App fixture exited")); });
  });
  child.stderr.resume();
  await ready;
  async function call<T = unknown>(input: Record<string, unknown>): Promise<T> {
    const id = nextId++;
    return new Promise<T>((ok, fail) => {
      const timer = setTimeout(() => { waiting.delete(id); fail(new Error("App fixture operation timed out")); }, 20_000);
      waiting.set(id, { resolve: value => { clearTimeout(timer); ok(value as T); }, reject: error => { clearTimeout(timer); fail(error); } });
      child.stdin.write(JSON.stringify({ ...input, id }) + "\n");
    });
  }
  const fetcher: typeof fetch = async (url, init) => {
    const result = await call<{ status: number; body: unknown }>({ operation: "http", url: String(url), headers: init?.headers, body: init?.body });
    return Response.json(result.body, { status: result.status });
  };
  const runtime = createVenueRuntime({ origin: "http://localhost", allowLocalTest: true, fetcher,
    auth: { secret: "synthetic-issuance-only-".repeat(3), usageSecret: "synthetic-usage-only-".repeat(3), keyEpoch: "fixture-1" } });
  return { call, runtime, fetcher, async close() { child.stdin.end(); await new Promise<void>(ok => { child.once("exit", () => ok()); setTimeout(() => { child.kill(); ok(); }, 2_000).unref(); }); } };
}
