/**
 * One-time, HQ-gated waitlist migration.
 *
 * Creates the `waitlist_entries` table + indexes in the live Studio Turso
 * DB, run from inside the deployed app so no credential ever leaves Vercel.
 * Idempotent (IF NOT EXISTS) and safe to reload. REMOVE THIS ROUTE once the
 * table exists. Gated by HQ access.
 */

import type { Metadata } from "next";
import { createClient } from "@libsql/client";
import { requireHqAccess } from "@/lib/hq/access-guard";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Migrate waitlist | Signal HQ",
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
};

const STATEMENTS: { label: string; sql: string }[] = [
  {
    label: "waitlist_entries table",
    sql: `CREATE TABLE IF NOT EXISTS waitlist_entries (
      id text PRIMARY KEY NOT NULL,
      email text NOT NULL,
      name text,
      use_case text,
      note text,
      source text,
      campaign text,
      audience text,
      artifact text,
      touch text,
      referrer text,
      path text,
      user_agent text,
      status text DEFAULT 'waiting' NOT NULL,
      created_at integer DEFAULT (unixepoch() * 1000) NOT NULL,
      updated_at integer DEFAULT (unixepoch() * 1000) NOT NULL,
      last_submitted_at integer DEFAULT (unixepoch() * 1000) NOT NULL
    )`,
  },
  {
    label: "unique email index",
    sql: `CREATE UNIQUE INDEX IF NOT EXISTS waitlist_entries_email_unique ON waitlist_entries (email)`,
  },
  {
    label: "status/created index",
    sql: `CREATE INDEX IF NOT EXISTS waitlist_entries_status_created_at_idx ON waitlist_entries (status, created_at)`,
  },
  {
    label: "use_case index",
    sql: `CREATE INDEX IF NOT EXISTS waitlist_entries_use_case_idx ON waitlist_entries (use_case)`,
  },
  {
    label: "source index",
    sql: `CREATE INDEX IF NOT EXISTS waitlist_entries_source_idx ON waitlist_entries (source)`,
  },
];

export default async function MigrateWaitlistPage() {
  await requireHqAccess();

  const done: string[] = [];
  let ready = false;
  let error: string | null = null;

  try {
    const url = process.env.TURSO_STUDIO_DATABASE_URL;
    const authToken = process.env.TURSO_STUDIO_AUTH_TOKEN;
    if (!url) throw new Error("TURSO_STUDIO_DATABASE_URL is not set in the runtime environment.");

    const client = createClient({ url, authToken });
    for (const stmt of STATEMENTS) {
      await client.execute(stmt.sql);
      done.push(stmt.label);
    }
    const check = await client.execute(
      "SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'waitlist_entries'",
    );
    ready = check.rows.length === 1;
  } catch (err) {
    error = err instanceof Error ? err.message : String(err);
  }

  return (
    <main
      style={{
        minHeight: "60vh",
        display: "grid",
        placeItems: "center",
        padding: "48px 24px",
        background: "var(--bg)",
      }}
    >
      <div style={{ width: "min(560px, 100%)" }}>
        <p
          style={{
            margin: "0 0 14px",
            color: "var(--ink-quiet)",
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
          }}
        >
          Signal HQ · waitlist migration
        </p>

        {error ? (
          <>
            <h1 style={{ margin: 0, fontSize: 24, fontWeight: 600, color: "var(--ink)" }}>
              Something went wrong.
            </h1>
            <p style={{ marginTop: 12, color: "var(--ink-soft)", fontSize: 14, lineHeight: 1.6 }}>
              {error}
            </p>
            <p style={{ marginTop: 12, color: "var(--ink-quiet)", fontSize: 13 }}>
              Send this line to the team and they will sort it.
            </p>
          </>
        ) : (
          <>
            <h1 style={{ margin: 0, fontSize: 26, fontWeight: 600, color: "var(--ink)" }}>
              {ready ? "Done. The waitlist is live." : "Finished, but could not confirm."}
            </h1>
            <p style={{ marginTop: 12, color: "var(--ink-soft)", fontSize: 15, lineHeight: 1.6 }}>
              {ready
                ? "The waitlist table now exists in the live database. Signups from signalstudio.ie/waitlist will be saved and show up in the HQ waitlist list."
                : "The steps ran without an error but the table check did not confirm. Reload once, or tell the team."}
            </p>
            <ul
              style={{
                margin: "20px 0 0",
                padding: 0,
                listStyle: "none",
                display: "grid",
                gap: 8,
              }}
            >
              {done.map((label) => (
                <li
                  key={label}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    color: "var(--ink-soft)",
                    fontSize: 13.5,
                  }}
                >
                  <span
                    aria-hidden
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: "50%",
                      background: "var(--accent)",
                    }}
                  />
                  {label}
                </li>
              ))}
            </ul>
            <p style={{ marginTop: 24, color: "var(--ink-quiet)", fontSize: 13, lineHeight: 1.6 }}>
              You are finished. Tell the team it is done and this page will be removed.
            </p>
          </>
        )}
      </div>
    </main>
  );
}
