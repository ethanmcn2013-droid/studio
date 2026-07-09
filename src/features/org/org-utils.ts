/**
 * Client-safe helpers for the AI org chart. Pure, no fs, no server-only.
 */

import type { Cluster } from "@/lib/hq/elt";

/** The prominent, role-forward title: drop the "Director of " prefix. */
export function roleTitle(name: string): string {
  return name.replace(/^Director of\s+/i, "");
}

/** Monogram initials from a persona name, e.g. "Steve Jobs" → "SJ", "Pixar" → "Px". */
export function personaInitials(persona: string, shortName: string): string {
  const clean = persona.replace(/\(.*?\)/g, "").trim();
  const words = clean.split(/\s+/).filter(Boolean);
  if (words.length >= 2) {
    return (words[0][0] + words[words.length - 1][0]).toUpperCase();
  }
  const one = words[0] ?? shortName;
  return (one[0]?.toUpperCase() ?? "") + (one[1]?.toLowerCase() ?? "");
}

export function autonomyLabel(layer: 2 | 3): string {
  return layer === 3 ? "Layer 3 · decide, then log" : "Layer 2 · recommend";
}

/** The clusters that hold directors (excludes the apex/founder band). */
export function directorClusters(
  clusters: { id: Cluster; label: string; subtitle: string }[],
): { id: Cluster; label: string; subtitle: string }[] {
  return clusters.filter((c) => c.id !== "apex");
}
