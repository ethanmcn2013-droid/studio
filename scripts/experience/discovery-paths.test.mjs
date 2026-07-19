import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, rmSync, unlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import { discoverRegistry, hashFile, validateRegistry } from "./lib.mjs";

function writeSource(file, source) {
  mkdirSync(path.dirname(file), { recursive: true });
  writeFileSync(file, source);
}

test("Studio discovery uses the current checkout while preserving canonical source paths", () => {
  const workspaceRoot = mkdtempSync(path.join(tmpdir(), "signal-experience-worktree-"));
  const studioRoot = path.join(workspaceRoot, "studio-founder-evidence");
  const decoyStudioRoot = path.join(workspaceRoot, "studio");
  const tasksRoot = path.join(workspaceRoot, "tasks");
  const currentPage = path.join(studioRoot, "src", "app", "current", "page.tsx");
  const currentExplicit = path.join(studioRoot, "src", "components", "hq", "hq-shell.tsx");
  const decoyExplicit = path.join(decoyStudioRoot, "src", "components", "hq", "hq-shell.tsx");
  const tasksPage = path.join(tasksRoot, "src", "app", "page.tsx");

  try {
    writeSource(currentPage, "export default function Current(){return <main>current worktree</main>}\n");
    writeSource(currentExplicit, "export function HqShell(){return <nav>current worktree</nav>}\n");
    writeSource(
      path.join(decoyStudioRoot, "src", "app", "decoy", "page.tsx"),
      "export default function Decoy(){return <main>wrong sibling</main>}\n",
    );
    writeSource(decoyExplicit, "export function HqShell(){return <nav>wrong sibling</nav>}\n");
    writeSource(tasksPage, "export default function Tasks(){return <main>tasks sibling</main>}\n");

    const config = {
      products: [
        { id: "studio", directory: "studio", name: "Studio", baseUrl: "http://studio.test" },
        { id: "tasks", directory: "tasks", name: "Tasks", baseUrl: "http://tasks.test" },
      ],
      breakpoints: {
        mobile: { width: 390, height: 844 },
        tablet: { width: 768, height: 1024 },
        desktop: { width: 1280, height: 900 },
        wide: { width: 1440, height: 960 },
      },
    };
    const explicit = {
      surfaces: [
        {
          id: "studio.surface.hq-shell-navigation",
          product: "studio",
          surfaceType: "menu",
          trigger: "Use HQ navigation",
          source: "studio/src/components/hq/hq-shell.tsx",
        },
      ],
    };

    const registered = discoverRegistry({ studioRoot, config, explicit });
    const current = registered.experiences.find((entry) => entry.id === "studio.page.current");
    const decoy = registered.experiences.find((entry) => entry.id === "studio.page.decoy");
    const tasks = registered.experiences.find((entry) => entry.id === "tasks.page.root");
    const hqShell = registered.experiences.find(
      (entry) => entry.id === "studio.surface.hq-shell-navigation",
    );

    assert.equal(current?.source, "studio/src/app/current/page.tsx");
    assert.equal(current?.materialityHash, hashFile(currentPage));
    assert.equal(decoy, undefined, "the canonical sibling must not masquerade as the current checkout");
    assert.equal(tasks?.source, "tasks/src/app/page.tsx");
    assert.equal(tasks?.materialityHash, hashFile(tasksPage));
    assert.equal(hqShell?.materialityHash, hashFile(currentExplicit));
    assert.notEqual(hqShell?.materialityHash, hashFile(decoyExplicit));

    unlinkSync(currentExplicit);
    const changed = discoverRegistry({ studioRoot, config, explicit });
    const errors = validateRegistry({
      registry: registered,
      discovered: changed,
      findings: { findings: [] },
      exceptions: { exceptions: [] },
      studioRoot,
    });
    assert.ok(
      errors.includes(
        "studio.surface.hq-shell-navigation: broken source reference studio/src/components/hq/hq-shell.tsx",
      ),
      `Studio broken-source validation must inspect the current checkout, not the decoy sibling:\n${errors.join("\n")}`,
    );
  } finally {
    rmSync(workspaceRoot, { recursive: true, force: true });
  }
});
