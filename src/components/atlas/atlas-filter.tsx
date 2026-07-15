"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type EntrySummary = {
  slug: string;
  title: string;
  summary: string;
  lens: "Products" | "Processes" | "Data Flows";
  status: "stub" | "partial" | "complete";
  isStale: boolean;
  isDrifted: boolean;
  ageDays: number | null;
  lastVerified: string;
  tags: string[];
};

type Group = { lens: EntrySummary["lens"]; entries: EntrySummary[] };

function stateNote(e: EntrySummary): string | null {
  if (e.isDrifted) return "drifted";
  if (e.isStale) return "stale";
  if (e.status === "stub") return "stub";
  if (e.status === "partial") return "partial";
  return null;
}

function ageNote(ageDays: number | null): string | null {
  if (ageDays === null) return null;
  if (ageDays === 0) return "today";
  if (ageDays === 1) return "1 day";
  return `${ageDays} days`;
}

export function AtlasFilter({ groups }: { groups: Group[] }) {
  const [query, setQuery] = useState("");
  const [lensFilter, setLensFilter] = useState<"All" | EntrySummary["lens"]>("All");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return groups.map((g) => {
      const lensMatches = lensFilter === "All" || lensFilter === g.lens;
      if (!lensMatches) return { ...g, entries: [] };
      if (!q) return g;
      return {
        ...g,
        entries: g.entries.filter((e) => {
          const hay = [
            e.title,
            e.summary,
            ...e.tags,
          ]
            .join(" \n ")
            .toLowerCase();
          return hay.includes(q);
        }),
      };
    });
  }, [groups, query, lensFilter]);

  const totalShown = filtered.reduce((n, g) => n + g.entries.length, 0);

  // Sequential index across all visible entries, stable across groups.
  const visibleIndexBySlug = new Map(
    filtered
      .flatMap((group) => group.entries)
      .map((entry, index) => [entry.slug, index + 1]),
  );

  return (
    <div>
      <div className="mb-12 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="search title, summary, tags…"
          className="w-full max-w-[320px] border-b border-border-soft bg-transparent py-2 font-mono text-[12px] tracking-tight text-ink outline-none placeholder:text-ink-quiet focus:border-accent"
        />
        <div className="flex gap-4 font-mono text-[11px] uppercase tracking-wider">
          {(["All", "Products", "Processes", "Data Flows"] as const).map((l) => {
            const active = lensFilter === l;
            return (
              <button
                key={l}
                onClick={() => setLensFilter(l)}
                className={
                  "transition-colors " +
                  (active
                    ? "text-ink underline decoration-accent underline-offset-[6px]"
                    : "text-ink-quiet hover:text-ink")
                }
              >
                {l === "Data Flows" ? "data" : l.toLowerCase()}
              </button>
            );
          })}
        </div>
      </div>

      {totalShown === 0 && (
        <p className="py-12 font-mono text-[12px] text-ink-quiet">
         , no entries match. clear the filter.
        </p>
      )}

      <div className="space-y-14">
        {filtered.map((g) =>
          g.entries.length === 0 ? null : (
            <section key={g.lens}>
              <h2
                className="mb-2 text-[10.5px] font-semibold uppercase text-ink-quiet"
                style={{ letterSpacing: "var(--tracking-eyebrow)" }}
              >
                {g.lens}
              </h2>
              <ul className="divide-y divide-border-soft">
                {g.entries.map((e) => {
                  const idx = String(visibleIndexBySlug.get(e.slug) ?? 0).padStart(2, "0");
                  const note = stateNote(e);
                  const age = ageNote(e.ageDays);
                  return (
                    <li key={e.slug}>
                      <Link
                        href={`/hq/atlas/${e.slug}`}
                        className="atlas-row group flex items-baseline gap-5 py-5"
                      >
                        <span className="atlas-row-index">{idx}</span>
                        <span className="min-w-0 flex-1">
                          <span className="atlas-row-title group-hover:text-accent">
                            {e.title}
                            {note && (
                              <span className="atlas-row-state">, {note}</span>
                            )}
                          </span>
                          <span className="atlas-row-summary block">
                            {e.summary}
                          </span>
                        </span>
                        <span className="atlas-row-age hidden sm:inline">
                          {age ?? "—"}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </section>
          ),
        )}
      </div>
    </div>
  );
}
