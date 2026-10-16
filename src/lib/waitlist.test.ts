import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { createClient, type Client } from "@libsql/client";

test("waitlist saves and updates one normalized address in isolated SQLite", async () => {
  const folder = await mkdtemp(join(tmpdir(), "studio-waitlist-test-"));
  const previousUrl = process.env.STUDIO_DATABASE_URL;
  const previousToken = process.env.STUDIO_AUTH_TOKEN;
  process.env.STUDIO_DATABASE_URL = `file:${join(folder, "waitlist.db")}`;
  delete process.env.STUDIO_AUTH_TOKEN;
  const client = createClient({ url: process.env.STUDIO_DATABASE_URL });
  let appClient: Client | undefined;
  try {
    const migration = await readFile(new URL("../../drizzle/0000_init.sql", import.meta.url), "utf8");
    await client.executeMultiple(migration);
    const { joinWaitlist } = await import("./waitlist");
    const { db } = await import("./db");
    appClient = db.$client;
    const first = await joinWaitlist({ email: "  Test@Example.invalid  ", source: "home_hero", path: "/" });
    assert.equal(first.created, true);
    assert.equal(first.email, "test@example.invalid");
    const repeat = await joinWaitlist({ email: "test@example.invalid", source: "home_close", note: "Test update", path: "/" });
    assert.equal(repeat.created, false);
    assert.equal(repeat.id, first.id);
    const rows = await client.execute("SELECT email, source, note, path, status FROM waitlist_entries");
    assert.equal(rows.rows.length, 1);
    assert.deepEqual({ ...rows.rows[0] }, { email: "test@example.invalid", source: "home_close", note: "Test update", path: "/", status: "waiting" });
    await assert.rejects(joinWaitlist({ email: "not-an-email" }), /Enter a real email address/);
  } finally {
    appClient?.close();
    client.close();
    if (previousUrl === undefined) delete process.env.STUDIO_DATABASE_URL; else process.env.STUDIO_DATABASE_URL = previousUrl;
    if (previousToken === undefined) delete process.env.STUDIO_AUTH_TOKEN; else process.env.STUDIO_AUTH_TOKEN = previousToken;
    await rm(folder, { recursive: true, force: true });
  }
});
