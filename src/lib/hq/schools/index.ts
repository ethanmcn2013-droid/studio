/**
 * Bulk schools datasets for the CRM schools book.
 *
 * The curated seed (`src/lib/hq/data.ts`) carries the hand-worked venue and
 * student books. National school lists are far too large to live as TS
 * literals, so each nation is a JSON file built from its official register
 * and loaded here. These flow into production through the dedicated import
 * route (`/api/internal/prospects/import-schools`), never the curated seed —
 * so a schools refresh never rewrites the 2,000-line seed file.
 *
 * Sources, per nation:
 *   IE      — Dept. of Education "Data on Individual Schools", post-primary
 *             2025/26 (gov.ie), email domains live-checked.
 *   GB-ENG  — DfE "Get Information About Schools" (GIAS) register.
 *   GB-SCT  — Scottish Government "School contact details" dataset.
 *   GB-WLS  — Welsh Government "Address list of schools".
 *
 * Every row already matches the `Prospect` seed shape, so `seedToDb` maps it
 * without special-casing.
 */

import type { Prospect } from "@/lib/hq/data";
import type { ProspectCountry } from "@/lib/db/schema";
import irelandRaw from "./ireland.json";

export type SchoolsManifestEntry = {
  country: ProspectCountry;
  /** provenance line shown in the operator import summary */
  source: string;
  leads: Prospect[];
};

const ireland = irelandRaw as unknown as Prospect[];

/**
 * Per-nation manifest. Add a nation by dropping its JSON in this folder and
 * appending an entry here — the import route iterates the manifest.
 */
export const SCHOOLS_MANIFEST: SchoolsManifestEntry[] = [
  {
    country: "IE",
    source:
      "Dept. of Education — Data on Individual Schools, post-primary 2025/26 (gov.ie)",
    leads: ireland,
  },
];

/** All school leads across every nation, flattened. */
export const schoolLeads: Prospect[] = SCHOOLS_MANIFEST.flatMap((m) => m.leads);

/** Count of school leads per nation, for the import summary and UI counts. */
export function schoolCountsByCountry(): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const m of SCHOOLS_MANIFEST) counts[m.country] = m.leads.length;
  return counts;
}
