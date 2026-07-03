import "server-only";
import { cache } from "react";
import fs from "node:fs/promises";
import path from "node:path";

/**
 * Shared cached readers that Today and Inbox both depend on. Each is
 * wrapped in React's `cache()` so duplicate calls within a single
 * request collapse to one disk hit.
 *
 * Per-request cache: separate page loads always get fresh data. This
 * is not a server-side persistent cache.
 */

export type DriftSidecar = Record<
  string,
  { drifted?: string[]; updatedAt?: string }
>;

export const readDriftSidecarCached = cache(async (): Promise<DriftSidecar> => {
  const p = path.join(process.cwd(), "content", "atlas", "_drift.json");
  try {
    const raw = await fs.readFile(p, "utf-8");
    const parsed = JSON.parse(raw) as unknown;
    if (parsed && typeof parsed === "object") {
      return parsed as DriftSidecar;
    }
  } catch {
    // sidecar absent, no drift
  }
  return {};
});

/**
 * Read + parse `~/.claude/state/log.jsonl`. The file is JSONL but the
 * legacy format spans each JSON object across multiple lines, so the
 * parser tracks brace depth rather than splitting on newlines.
 */
export type LogRow = {
  ts?: string;
  ok?: boolean;
  project?: string;
  phase?: string;
};

export const readLogJsonlCached = cache(async (): Promise<LogRow[]> => {
  const home = process.env.HOME ?? "";
  if (!home) return [];
  const p = path.join(home, ".claude", "state", "log.jsonl");
  try {
    const raw = await fs.readFile(p, "utf-8");
    const rows: LogRow[] = [];
    let depth = 0;
    let buffer = "";
    for (const line of raw.split("\n")) {
      if (!line.trim() && depth === 0) continue;
      buffer += line + "\n";
      for (const ch of line) {
        if (ch === "{") depth += 1;
        else if (ch === "}") depth -= 1;
      }
      if (depth === 0 && buffer.trim()) {
        try {
          rows.push(JSON.parse(buffer) as LogRow);
        } catch {
          // tolerate malformed segments
        }
        buffer = "";
      }
    }
    return rows;
  } catch {
    return [];
  }
});
