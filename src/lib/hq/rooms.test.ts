/**
 * HQ registry contract — the anti-entropy gate (docs/HQ_ARCHITECTURE.md §11).
 *
 * 1. Route ⇔ registry set-equality: every top-level directory under
 *    src/app/hq is either a registered room, a declared system route, or
 *    the [group] landing segment — and every registry entry has a route
 *    directory. This is the test that would have caught the palette's
 *    dead /hq/copy-review entry.
 * 2. Naming: slugs are kebab-case and routes derive from slugs.
 * 3. Status ratchet: frontmatter `status:` values across content/hq
 *    collections stay within the declared per-collection sets. Adding a
 *    new status is allowed — by editing DECLARED_STATUSES here, visibly.
 * 4. The /hq password gate lives in src/proxy.ts and stays narrow.
 */

import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync, existsSync } from "node:fs";
import path from "node:path";
import test from "node:test";

import {
  HQ_GROUPS,
  HQ_GROUP_SEGMENTS,
  HQ_ROOMS,
  HQ_SYSTEM_ROUTES,
} from "./rooms";

const REPO_ROOT = path.resolve(__dirname, "../../..");
const HQ_APP_DIR = path.join(REPO_ROOT, "src", "app", "hq");
const HQ_CONTENT_DIR = path.join(REPO_ROOT, "content", "hq");

/** Frozen per-collection status sets. Extending one is a reviewed act. */
const DECLARED_STATUSES: Record<string, string[]> = {
  "access-roles": ["Draft", "Needs design"],
  campaigns: ["Queued", "Ready for Ethan", "Selected"],
  "collaboration-loop": ["Built", "Idea", "In Progress"],
  "collaborator-first-view": ["Draft", "Needs design"],
  content: ["Idea", "Script"],
  decisions: ["Active", "Reversed", "decided", "Archived", "Superseded"],
  demos: [],
  "ecosystem-flows": ["Not started", "Partly working", "Planned"],
  features: ["Built", "Idea", "In Progress", "Shipping", "Shipped"],
  finance: [],
  "growth-workflow": ["Drafting", "Selected"],
  "launch-readiness": ["At risk", "Clear", "Needs attention"],
  "operator-todos": ["done", "open"],
  pilots: ["Queued", "Ready for Ethan"],
  products: ["Private preview"],
  risks: ["Monitoring", "Needs attention", "Resolved"],
  segments: ["Explore", "Later", "Validate"],
  "shareable-artifacts": ["Built", "Draft", "Needs design"],
  "shared-objects": ["Defined", "Partly working"],
  templates: ["Built", "Idea"],
};

function hqRouteSegments(): string[] {
  return readdirSync(HQ_APP_DIR).filter((entry) => {
    if (entry.startsWith("_")) return false; // component folders, not routes
    const full = path.join(HQ_APP_DIR, entry);
    return statSync(full).isDirectory();
  });
}

test("every /hq route directory is registered (and vice versa)", () => {
  const onDisk = new Set(hqRouteSegments());
  const registered = new Set<string>([
    ...HQ_ROOMS.map((room) => room.slug),
    ...HQ_SYSTEM_ROUTES,
    "[group]",
  ]);

  const unregistered = [...onDisk].filter((seg) => !registered.has(seg));
  assert.deepEqual(
    unregistered,
    [],
    `Route dirs without a registry entry (add to src/lib/hq/rooms.ts, with group/kind/lifecycle/summary — see docs/HQ_ARCHITECTURE.md §11): ${unregistered.join(", ")}`,
  );

  const phantom = [...registered].filter((seg) => !onDisk.has(seg));
  assert.deepEqual(
    phantom,
    [],
    `Registry entries without a route directory (dead rooms — remove or restore): ${phantom.join(", ")}`,
  );
});

test("room slugs are kebab-case and routes derive from slugs", () => {
  for (const room of HQ_ROOMS) {
    assert.match(
      room.slug,
      /^[a-z0-9]+(-[a-z0-9]+)*$/,
      `Slug not kebab-case: ${room.slug}`,
    );
    assert.equal(
      room.route,
      `/hq/${room.slug}`,
      `Route must be /hq/<slug> for ${room.slug} — URLs never diverge from slugs`,
    );
  }
});

test("registry integrity: unique slugs, valid groups, resolvable parents", () => {
  const slugs = HQ_ROOMS.map((r) => r.slug);
  assert.equal(new Set(slugs).size, slugs.length, "Duplicate room slugs");

  const groupKeys = new Set(HQ_GROUPS.map((g) => g.key));
  for (const room of HQ_ROOMS) {
    assert.ok(groupKeys.has(room.group), `Unknown group for ${room.slug}`);
    if (room.parent) {
      assert.ok(
        slugs.includes(room.parent),
        `Parent "${room.parent}" of ${room.slug} is not a registered room`,
      );
    }
    assert.ok(
      room.summary.length > 0 && room.summary.length <= 120,
      `Summary for ${room.slug} must be one plain sentence (1–120 chars)`,
    );
  }

  const landingKeys = HQ_GROUPS.filter((g) => g.key !== "board").map(
    (g) => g.key,
  );
  assert.deepEqual(
    [...HQ_GROUP_SEGMENTS].sort(),
    landingKeys.sort(),
    "HQ_GROUP_SEGMENTS must match the non-board groups",
  );
});

test("content/hq status values stay inside the declared sets", () => {
  const collections = readdirSync(HQ_CONTENT_DIR).filter((entry) =>
    statSync(path.join(HQ_CONTENT_DIR, entry)).isDirectory(),
  );

  for (const collection of collections) {
    const declared = DECLARED_STATUSES[collection];
    assert.ok(
      declared !== undefined,
      `New content collection "${collection}" — declare its status set in rooms.test.ts and its source row in CLAUDE.md`,
    );

    const dir = path.join(HQ_CONTENT_DIR, collection);
    for (const file of readdirSync(dir)) {
      if (!file.endsWith(".md") || file === "README.md") continue;
      const body = readFileSync(path.join(dir, file), "utf8");
      const match = body.match(/^status:[ \t]*(.+?)[ \t]*\r?$/m);
      if (!match) continue;
      const value = match[1];
      assert.ok(
        declared.includes(value),
        `Undeclared status "${value}" in content/hq/${collection}/${file} — extend DECLARED_STATUSES deliberately or use an existing value`,
      );
    }
  }
});

test("the /hq password gate stays in place and narrow", () => {
  const proxyPath = path.join(REPO_ROOT, "src", "proxy.ts");
  assert.ok(existsSync(proxyPath), "src/proxy.ts (the /hq gate) is missing");
  const proxy = readFileSync(proxyPath, "utf8");
  assert.ok(
    proxy.includes('pathname.startsWith("/hq")'),
    "proxy.ts no longer gates /hq — the password gate is the only wall",
  );
  const publicPaths = proxy.match(/PUBLIC_HQ_PATHS = \[([^\]]*)\]/);
  assert.ok(publicPaths, "PUBLIC_HQ_PATHS missing from proxy.ts");
  const allowed = ["/hq/access", "/hq/logout"];
  const listed = [...publicPaths![1].matchAll(/"([^"]+)"/g)].map((m) => m[1]);
  assert.deepEqual(
    listed.filter((p) => !allowed.includes(p)),
    [],
    "PUBLIC_HQ_PATHS grew beyond the access/logout pair — new public HQ paths need a decision record",
  );
});

test("the retired public review hub redirects into private HQ", () => {
  const reviewPage = path.join(REPO_ROOT, "src", "app", "review", "page.tsx");
  assert.equal(
    existsSync(reviewPage),
    false,
    "src/app/review/page.tsx must not recreate a public Signal Review surface",
  );

  const nextConfig = readFileSync(path.join(REPO_ROOT, "next.config.ts"), "utf8");
  assert.match(
    nextConfig,
    /source:\s*["']\/review["'][\s\S]*?destination:\s*["']\/hq\/experience-quality["'][\s\S]*?permanent:\s*false/,
    "/review must remain a reversible redirect into the password-gated HQ quality room",
  );
});
