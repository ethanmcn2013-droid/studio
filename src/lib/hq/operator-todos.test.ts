import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

type Frontmatter = Record<string, string>;

function frontmatter(file: string): Frontmatter {
  const source = fs.readFileSync(file, "utf8");
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  assert.ok(match, `${path.basename(file)} has frontmatter`);
  return Object.fromEntries(
    match[1]
      .split(/\r?\n/)
      .map((line) => line.match(/^([a-z][a-z0-9_-]*):\s*(.*)$/i))
      .filter((entry): entry is RegExpMatchArray => Boolean(entry))
      .map((entry) => [entry[1], entry[2].replace(/^['"]|['"]$/g, "")]),
  );
}

test("the founder ledger has unique ids and typed open-item effort", () => {
  const directory = path.join(process.cwd(), "content", "hq", "operator-todos");
  const files = fs
    .readdirSync(directory)
    .filter((file) => file.endsWith(".md") && file !== "README.md")
    .map((file) => path.join(directory, file));

  const seen = new Set<string>();
  for (const file of files) {
    const fm = frontmatter(file);
    assert.ok(fm.id, `${path.basename(file)} has an id`);
    assert.ok(!seen.has(fm.id), `${fm.id} is unique`);
    seen.add(fm.id);
    assert.match(fm.status ?? "", /^(open|done)$/, `${fm.id} has a valid status`);
    if (fm.status === "open") {
      assert.match(fm.priority ?? "", /^P[0-2]$/, `${fm.id} has a valid priority`);
      assert.match(fm.blocking ?? "", /^(true|false)$/, `${fm.id} has a valid blocking flag`);
      assert.match(fm.effort ?? "", /^(quick|involved)$/, `${fm.id} classifies founder effort`);
    }
  }
});
