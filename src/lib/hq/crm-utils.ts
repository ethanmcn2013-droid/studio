/**
 * CRM pure utilities, no server dependencies, safe for client import.
 *
 * Sync functions and constants that both server and client components need.
 * Server actions and DB reads live in crm-db.ts ("use server").
 *
 * The CRM is four lead books, one per outbound motion (market-entry deck
 * 2026–2028). A prospect belongs to exactly one book; each book carries its
 * own offer, buyer, playbook line, and stage vocabulary. Never merge the
 * books into one list — venues, students, schools, and small business are
 * targeted differently by design.
 */

import type {
  DbProspect,
  NewDbProspect,
  ProspectCountry,
  ProspectSegment,
  ProspectStage,
} from "@/lib/db/schema";
import {
  PROSPECT_COUNTRIES,
  PROSPECT_SEGMENTS,
  PROSPECT_STAGES,
} from "@/lib/db/schema";
import type { Prospect } from "@/lib/hq/data";

export type { ProspectCountry, ProspectSegment, ProspectStage };
export { PROSPECT_COUNTRIES, PROSPECT_SEGMENTS };

// ── Countries (the within-book nation axis) ──────────────────────────────────

export type CountryConfig = {
  /** short filter-tab label */
  label: string;
  /** full name for aria / headers */
  name: string;
  /** flag emoji for a light visual anchor */
  flag: string;
};

export const COUNTRY_CONFIG: Record<ProspectCountry, CountryConfig> = {
  IE: { label: "Ireland", name: "Republic of Ireland", flag: "🇮🇪" },
  "GB-ENG": { label: "England", name: "England", flag: "🏴\u{E0067}\u{E0062}\u{E0065}\u{E006E}\u{E0067}\u{E007F}" },
  "GB-SCT": { label: "Scotland", name: "Scotland", flag: "🏴\u{E0067}\u{E0062}\u{E0073}\u{E0063}\u{E0074}\u{E007F}" },
  "GB-WLS": { label: "Wales", name: "Wales", flag: "🏴\u{E0067}\u{E0062}\u{E0077}\u{E006C}\u{E0073}\u{E007F}" },
};

/** Legacy/blank rows resolve to Ireland, the default outreach nation. */
export function normalizeCountry(raw: string | undefined | null): ProspectCountry {
  return raw && (PROSPECT_COUNTRIES as readonly string[]).includes(raw)
    ? (raw as ProspectCountry)
    : "IE";
}

/**
 * Per-nation context for the schools book. Each nation's list comes from a
 * different official register with a different email reality, so each bucket
 * says plainly where it came from and what has to happen before a send.
 * `readiness`: send = official email, verify = email inferred, enrich = no email.
 */
export type Readiness = "send" | "verify" | "enrich";

export type CountryContext = {
  readiness: Readiness;
  readinessLabel: string;
  /** the register the list was built from */
  source: string;
  /** one plain line: what this bucket is and what to do before sending */
  line: string;
};

export const READINESS_LABEL: Record<Readiness, string> = {
  send: "send-ready",
  verify: "verify first",
  enrich: "enrich first",
};

export const COUNTRY_CONTEXT: Record<ProspectCountry, CountryContext> = {
  IE: {
    readiness: "send",
    readinessLabel: READINESS_LABEL.send,
    source: "Dept. of Education, Data on Individual Schools 2025/26",
    line: "Every school carries an official email. Send-ready.",
  },
  "GB-SCT": {
    readiness: "send",
    readinessLabel: READINESS_LABEL.send,
    source: "gov.scot School contact list, 31 January 2026",
    line: "Every school carries an official email. Send-ready.",
  },
  "GB-ENG": {
    readiness: "verify",
    readinessLabel: READINESS_LABEL.verify,
    source: "DfE Get Information About Schools (GIAS)",
    line: "GIAS carries no email, so each office address is inferred from the school's official website. Verify the email-inferred tag before a bulk send.",
  },
  "GB-WLS": {
    readiness: "enrich",
    readinessLabel: READINESS_LABEL.enrich,
    source: "Welsh Government address list of schools",
    line: "The register carries no email or website. Enrich the email-missing tag from local-authority sites before sending.",
  },
};

// ── Lead books ───────────────────────────────────────────────────────────────

export type SegmentConfig = {
  /** book-switcher pill label */
  label: string;
  /** page title when the book is open */
  title: string;
  /** who the record must resolve to before outreach counts as ready */
  buyer: string;
  /** ratified offer name, also the compose subject */
  offer: string;
  price: string;
  /** the channel truth from the deck, one line */
  playbook: string;
  /** stage-label overrides where the funnel vocabulary differs */
  stageLabels: Partial<Record<ProspectStage, string>>;
  /** empty-book line, honest about why the book is empty */
  emptyBookLine: string;
};

export const SEGMENT_CONFIG: Record<ProspectSegment, SegmentConfig> = {
  venue: {
    label: "venues",
    title: "Venue book",
    buyer: "owner-operators and weddings/events managers",
    offer: "Founding Venue Programme",
    price: "€1,500 / venue / year, prepaid",
    playbook:
      "phone-first founder outreach · hand-picked, one at a time, no sequences",
    stageLabels: {},
    emptyBookLine: "no venue leads yet — the Top-50 seed fills this book",
  },
  student: {
    label: "students",
    title: "Student book",
    buyer: "committee leads, treasurers, society organisers",
    offer: "Signal Student Edition",
    price: "€9.99 / year · committee workspace €49",
    playbook:
      "campus cells · UL, TUS and MIC first · cell leaders carry the motion",
    stageLabels: { demo_booked: "meeting booked", pilot_active: "cell active" },
    emptyBookLine:
      "no student leads yet — the lock-down plan seeds the Limerick campuses first",
  },
  school: {
    label: "schools",
    title: "School book",
    buyer: "principals and heads of operations · staff only, zero pupil data",
    offer: "Signal School Edition",
    price: "€1,500 / school / year · 60 staff accounts",
    playbook: "teacher discovery kit · direct school outreach, no resellers",
    stageLabels: {
      demo_booked: "proposal sent",
      pilot_active: "school signed",
    },
    emptyBookLine:
      "no school leads yet — the lock-down plan seeds Limerick secondary schools first",
  },
  smb: {
    label: "small business",
    title: "Small business book",
    buyer: "freelancers, tradespeople, small teams",
    offer: "Signal Workspace",
    price: "€12 / month · event €79 one-time",
    playbook:
      "inbound wedge · no outbound list by design until the Phase 5 call (Jan 2027)",
    stageLabels: {
      demo_booked: "call booked",
      pilot_active: "customer active",
    },
    emptyBookLine:
      "empty by design — this book opens on inbound proof, not an outbound list",
  },
};

/**
 * Legacy seed rows carry display strings ("Hotels / wedding & events",
 * "All", "Weddings and events") — all of them were the venue motion.
 */
export function normalizeSegment(raw: string): ProspectSegment {
  return (PROSPECT_SEGMENTS as readonly string[]).includes(raw)
    ? (raw as ProspectSegment)
    : "venue";
}

export function getStageLabel(
  segment: ProspectSegment,
  stage: ProspectStage,
): string {
  return SEGMENT_CONFIG[segment].stageLabels[stage] ?? STAGE_LABELS[stage];
}

// ── Stage display labels ────────────────────────────────────────────────────

export const STAGE_LABELS: Record<ProspectStage, string> = {
  to_contact: "to contact",
  contacted: "contacted",
  replied: "replied",
  demo_booked: "demo booked",
  pilot_active: "pilot active",
  not_interested: "not interested",
  later: "later",
};

/** Stages shown in the pipeline rail (active funnel only). */
export const PIPELINE_STAGES: ProspectStage[] = [
  "to_contact",
  "contacted",
  "replied",
  "demo_booked",
  "pilot_active",
];

/** Stages considered "parked", shown separately. */
export const PARKED_STAGES: ProspectStage[] = ["not_interested", "later"];

// ── Stage colours ────────────────────────────────────────────────────────────

export const STAGE_COLORS: Record<ProspectStage, { bg: string; text: string }> = {
  to_contact:     { bg: "var(--paper-deep)", text: "var(--ink-quiet)" },
  contacted:      { bg: "var(--accent-soft)", text: "var(--accent-deep)" },
  replied:        { bg: "#fef3c7", text: "#92400e" },
  demo_booked:    { bg: "#fef3c7", text: "#92400e" },
  pilot_active:   { bg: "#d1fae5", text: "#065f46" },
  not_interested: { bg: "var(--paper-deep)", text: "var(--ink-ghost)" },
  later:          { bg: "var(--paper-deep)", text: "var(--ink-ghost)" },
};

// ── Date helpers ─────────────────────────────────────────────────────────────

export function isOverdue(
  nextFollowUpAt: string | null,
  stage: ProspectStage,
): boolean {
  if (!nextFollowUpAt) return false;
  if (PARKED_STAGES.includes(stage)) return false;
  const today = new Date().toISOString().slice(0, 10);
  return nextFollowUpAt < today;
}

export function isDueToday(nextFollowUpAt: string | null): boolean {
  if (!nextFollowUpAt) return false;
  const today = new Date().toISOString().slice(0, 10);
  return nextFollowUpAt === today;
}

// ── Stage count helpers ───────────────────────────────────────────────────────

export type StageCounts = Record<ProspectStage, number>;

export function computeStageCounts(prospects: DbProspect[]): StageCounts {
  const counts = Object.fromEntries(
    PROSPECT_STAGES.map((s) => [s, 0]),
  ) as StageCounts;
  for (const p of prospects) {
    if (p.stage in counts) counts[p.stage]++;
  }
  return counts;
}

export function getDueToday(prospects: DbProspect[]): DbProspect[] {
  const today = new Date().toISOString().slice(0, 10);
  return prospects.filter(
    (p) =>
      p.nextFollowUpAt &&
      p.nextFollowUpAt <= today &&
      !PARKED_STAGES.includes(p.stage) &&
      p.stage !== "pilot_active",
  );
}

// ── Lock-down intelligence ────────────────────────────────────────────────────
//
// A lead is "locked down" when outreach can start without another research
// pass: a human name, an email that opens the buying door, a phone number
// (the venue motion is phone-first), and a postal address.

export type EmailQuality = "none" | "generic" | "right_door" | "named";

/** inbox_type values that open the buying door directly */
const RIGHT_DOOR_INBOXES = new Set(["weddings", "events", "direct"]);
const RIGHT_DOOR_LOCALPARTS = ["weddings", "wedding", "events", "event"];
const GENERIC_LOCALPARTS = [
  "info",
  "reservations",
  "sales",
  "hello",
  "enquiries",
  "inquiries",
  "admin",
  "office",
  "contact",
  "reception",
  "groups",
  "mail",
  "frontdesk",
];

export function getEmailQuality(p: {
  email: string;
  contactName: string;
  inboxType: string;
}): EmailQuality {
  if (!p.email.trim()) return "none";
  const local = p.email.split("@")[0]?.toLowerCase() ?? "";
  const generic = GENERIC_LOCALPARTS.some(
    (g) => local === g || local.startsWith(`${g}.`) || local.startsWith(`${g}-`),
  );
  if (p.contactName.trim() && !generic) return "named";
  if (
    RIGHT_DOOR_INBOXES.has(p.inboxType) ||
    RIGHT_DOOR_LOCALPARTS.some((g) => local.startsWith(g))
  ) {
    return "right_door";
  }
  // an unrecognised, non-generic localpart is a specific office, not a lobby
  return generic ? "generic" : "right_door";
}

export const EMAIL_QUALITY_LABELS: Record<EmailQuality, string> = {
  none: "no email",
  generic: "generic inbox",
  right_door: "right door",
  named: "named inbox",
};

export type Lockdown = {
  /** a human name on the record */
  named: boolean;
  /** email opens the buying door or better */
  rightDoor: boolean;
  phone: boolean;
  address: boolean;
  /** 0–4, count of the four facts above */
  score: number;
};

export function computeLockdown(p: DbProspect): Lockdown {
  const quality = getEmailQuality(p);
  const named = p.contactName.trim().length > 0;
  const rightDoor = quality === "named" || quality === "right_door";
  const phone = p.phone.trim().length > 0;
  const address = p.address.trim().length > 0;
  return {
    named,
    rightDoor,
    phone,
    address,
    score: [named, rightDoor, phone, address].filter(Boolean).length,
  };
}

export type LockdownSummary = {
  total: number;
  named: number;
  rightDoor: number;
  phone: number;
  address: number;
  /** all four facts present */
  locked: number;
};

export function computeLockdownSummary(
  prospects: DbProspect[],
): LockdownSummary {
  const summary: LockdownSummary = {
    total: prospects.length,
    named: 0,
    rightDoor: 0,
    phone: 0,
    address: 0,
    locked: 0,
  };
  for (const p of prospects) {
    const l = computeLockdown(p);
    if (l.named) summary.named++;
    if (l.rightDoor) summary.rightDoor++;
    if (l.phone) summary.phone++;
    if (l.address) summary.address++;
    if (l.score === 4) summary.locked++;
  }
  return summary;
}

// ── Book counts (the switcher strip) ─────────────────────────────────────────

export type BookCount = { total: number; locked: number; due: number };

export function computeBookCounts(
  prospects: DbProspect[],
): Record<ProspectSegment, BookCount> {
  const books = Object.fromEntries(
    PROSPECT_SEGMENTS.map((s) => [s, { total: 0, locked: 0, due: 0 }]),
  ) as Record<ProspectSegment, BookCount>;
  const dueIds = new Set(getDueToday(prospects).map((p) => p.id));
  for (const p of prospects) {
    const book = books[normalizeSegment(p.segment)];
    book.total++;
    if (computeLockdown(p).score === 4) book.locked++;
    if (dueIds.has(p.id)) book.due++;
  }
  return books;
}

// ── Next best actions ─────────────────────────────────────────────────────────

/**
 * The book's working order: due/stale follow-ups first (oldest date first),
 * then untouched leads with the most complete records — best-locked leads
 * are the cheapest next sends.
 */
export function getNextActions(
  prospects: DbProspect[],
  limit = 3,
): DbProspect[] {
  const due = getDueToday(prospects).sort((a, b) =>
    (a.nextFollowUpAt ?? "").localeCompare(b.nextFollowUpAt ?? ""),
  );
  const dueIds = new Set(due.map((p) => p.id));
  const fresh = prospects
    .filter(
      (p) => p.stage === "to_contact" && !p.lastContactedAt && !dueIds.has(p.id),
    )
    .sort(
      (a, b) =>
        computeLockdown(b).score - computeLockdown(a).score ||
        a.organisation.localeCompare(b.organisation),
    );
  return [...due, ...fresh].slice(0, limit);
}

// ── Proof-gate summary ────────────────────────────────────────────────────────

export type OutreachSummary = {
  sent: number;
  firstSendDay: string | null;
  qualifiedReplies: number;
  bookedCalls: number;
};

const REPLIED_STAGES = new Set<ProspectStage>(["replied", "demo_booked", "pilot_active"]);
const BOOKED_STAGES = new Set<ProspectStage>(["demo_booked", "pilot_active"]);

/**
 * Outreach counts, optionally scoped to one book. The HQ proof gate reads
 * the venue book only — student, school, and smb sends must never inflate
 * the paid-venue funnel.
 */
export function computeOutreachSummary(
  prospects: DbProspect[],
  segment?: ProspectSegment,
): OutreachSummary {
  let sent = 0;
  let qualifiedReplies = 0;
  let bookedCalls = 0;
  const sendDays: string[] = [];

  for (const p of prospects) {
    if (segment && normalizeSegment(p.segment) !== segment) continue;
    if (p.lastContactedAt) {
      sent++;
      sendDays.push(p.lastContactedAt);
    }
    if (REPLIED_STAGES.has(p.stage)) qualifiedReplies++;
    if (BOOKED_STAGES.has(p.stage)) bookedCalls++;
  }

  const firstSendDay = sendDays.length ? sendDays.sort()[0] : null;
  return { sent, firstSendDay, qualifiedReplies, bookedCalls };
}

// ── Seed conversion ───────────────────────────────────────────────────────────
//
// The Top-50 venue seed carried its intelligence as prose:
//   notes:               "5★ · Red Carnation · Reservations inbox · …"
//   personalisationNote: "Red Carnation group; Reservations inbox."
// These parsers lift those facts into queryable fields at seed time, so
// legacy records join the lock-down model without rewriting fifty rows.
// Newer seed records set the structured fields directly and skip the parse.

function parseTier(notes: string): string {
  const m = notes.match(/([45]★)/);
  return m ? m[1] : "";
}

function parseOrgGroup(personalisationNote: string): string {
  const m = personalisationNote.match(/^(.+?) group;/i);
  return m ? m[1].trim() : "";
}

function parseInboxType(personalisationNote: string): string {
  const m = personalisationNote.match(/;\s*([^;.]+?)\s+inbox\.?/i);
  if (!m) return "";
  const raw = m[1].toLowerCase();
  if (raw.includes("wedding")) return "weddings";
  if (raw.includes("event")) return "events";
  if (raw.includes("reservation")) return "reservations";
  if (raw.includes("group")) return "groups";
  if (raw.includes("sales")) return "sales";
  if (raw.includes("general")) return "general";
  return "";
}

function parseCounty(location: string): string {
  const last = location.split(",").pop()?.trim() ?? "";
  return last.replace(/^Co\.\s*/i, "").replace(/\s*\d+$/, "").trim();
}

export function seedStatusToStage(status: Prospect["status"]): ProspectStage {
  const map: Record<Prospect["status"], ProspectStage> = {
    "To Contact":     "to_contact",
    "Contacted":      "contacted",
    "Replied":        "replied",
    "Demo Booked":    "demo_booked",
    "Pilot Active":   "pilot_active",
    "Not Interested": "not_interested",
    "Later":          "later",
  };
  return map[status] ?? "to_contact";
}

export function seedToDb(p: Prospect): NewDbProspect {
  return {
    id: p.id,
    organisation: p.organisation,
    segment: normalizeSegment(p.segment),
    country: normalizeCountry(p.country),
    category: p.category ?? "",
    flags: p.flags ?? "",
    contactName: p.contactName,
    role: p.role,
    email: p.email,
    phone: p.phone ?? "",
    website: p.website,
    location: p.location,
    address: p.address ?? "",
    county: p.county ?? parseCounty(p.location),
    orgGroup: p.orgGroup ?? parseOrgGroup(p.personalisationNote),
    inboxType: p.inboxType ?? parseInboxType(p.personalisationNote),
    tier: p.tier ?? parseTier(p.notes),
    source: p.source,
    stage: seedStatusToStage(p.status),
    lastContactedAt: p.lastContacted || null,
    nextFollowUpAt: p.nextFollowUp || null,
    personalisationNote: p.personalisationNote,
    offerSent: p.offerSent,
    outcome: p.outcome,
    notes: p.notes,
  };
}

/**
 * The research fields a sync may refresh from the committed seed.
 * Operator-owned state (stage, lastContactedAt, nextFollowUpAt, outcome)
 * is never in this list — the seed must not overwrite worked pipeline.
 */
export const SEED_RESEARCH_FIELDS = [
  "organisation",
  "segment",
  "country",
  "category",
  "flags",
  "contactName",
  "role",
  "email",
  "phone",
  "website",
  "location",
  "address",
  "county",
  "orgGroup",
  "inboxType",
  "tier",
  "source",
  "personalisationNote",
  "offerSent",
  "notes",
] as const satisfies readonly (keyof NewDbProspect)[];

// ── Mailto builder ────────────────────────────────────────────────────────────

export function buildMailtoHref(
  email: string,
  segment: ProspectSegment = "venue",
): string {
  const subject = encodeURIComponent(SEGMENT_CONFIG[segment].offer);
  return `mailto:${email}?subject=${subject}`;
}

// ── Scale-aware book filtering (schools book, national volume) ────────────────
//
// The schools book runs to hundreds of rows per nation and thousands across
// all four. These pure helpers power the country tabs, search, county/type/tag
// filters, pagination and bulk export — the server component reads URL params,
// calls these, and renders. No client state, fully shareable URLs.

export type BookFilters = {
  country: ProspectCountry | "all";
  county: string | "all";
  category: string | "all";
  flag: string | "all";
  stage: ProspectStage | "all";
  search: string;
};

export const EMPTY_FILTERS: BookFilters = {
  country: "all",
  county: "all",
  category: "all",
  flag: "all",
  stage: "all",
  search: "",
};

/** Split the semicolon-joined flags string into trimmed, non-empty tags. */
export function parseFlags(flags: string): string[] {
  return flags
    .split(";")
    .map((f) => f.trim())
    .filter(Boolean);
}

export type Facet = { value: string; count: number };

export type BookFacets = {
  countries: Facet[];
  counties: Facet[];
  categories: Facet[];
  flags: Facet[];
};

function tally(map: Map<string, number>, key: string) {
  if (!key) return;
  map.set(key, (map.get(key) ?? 0) + 1);
}

function facetList(map: Map<string, number>, sortByCount = true): Facet[] {
  const list = [...map.entries()].map(([value, count]) => ({ value, count }));
  list.sort((a, b) =>
    sortByCount
      ? b.count - a.count || a.value.localeCompare(b.value)
      : a.value.localeCompare(b.value),
  );
  return list;
}

/** Build the filter facets (with counts) over a book's full row set. */
export function computeBookFacets(rows: DbProspect[]): BookFacets {
  const countries = new Map<string, number>();
  const counties = new Map<string, number>();
  const categories = new Map<string, number>();
  const flags = new Map<string, number>();
  for (const r of rows) {
    tally(countries, r.country ?? "IE");
    tally(counties, r.county);
    tally(categories, r.category);
    for (const f of parseFlags(r.flags ?? "")) tally(flags, f);
  }
  return {
    countries: facetList(countries),
    counties: facetList(counties, false),
    categories: facetList(categories),
    flags: facetList(flags),
  };
}

/** Apply the active filters to a book's rows (country handled at query time). */
export function filterBook(
  rows: DbProspect[],
  filters: BookFilters,
): DbProspect[] {
  const q = filters.search.trim().toLowerCase();
  return rows.filter((r) => {
    if (filters.county !== "all" && r.county !== filters.county) return false;
    if (filters.category !== "all" && r.category !== filters.category)
      return false;
    if (filters.flag !== "all" && !parseFlags(r.flags ?? "").includes(filters.flag))
      return false;
    if (filters.stage !== "all" && r.stage !== filters.stage) return false;
    if (q) {
      const hay = `${r.organisation} ${r.county} ${r.location} ${r.email} ${r.contactName} ${r.orgGroup}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
}

export type Paged<T> = {
  rows: T[];
  page: number;
  pageCount: number;
  total: number;
  pageSize: number;
  from: number;
  to: number;
};

export function paginate<T>(rows: T[], page: number, pageSize: number): Paged<T> {
  const total = rows.length;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const clamped = Math.min(Math.max(1, page), pageCount);
  const start = (clamped - 1) * pageSize;
  const slice = rows.slice(start, start + pageSize);
  return {
    rows: slice,
    page: clamped,
    pageCount,
    total,
    pageSize,
    from: total === 0 ? 0 : start + 1,
    to: Math.min(start + pageSize, total),
  };
}

/** De-duplicated, lower-cased email list for a bulk copy. */
export function emailsOf(rows: DbProspect[]): string[] {
  const seen = new Set<string>();
  for (const r of rows) {
    const e = r.email.trim().toLowerCase();
    if (e && e.includes("@")) seen.add(e);
  }
  return [...seen];
}

const CSV_COLUMNS: { header: string; get: (r: DbProspect) => string }[] = [
  { header: "Email", get: (r) => r.email },
  { header: "School", get: (r) => r.organisation },
  { header: "Contact", get: (r) => r.contactName },
  { header: "Role", get: (r) => r.role },
  { header: "Country", get: (r) => r.country ?? "IE" },
  { header: "County", get: (r) => r.county },
  { header: "Location", get: (r) => r.location },
  { header: "Type", get: (r) => r.category },
  { header: "Tags", get: (r) => r.flags },
  { header: "Enrolment", get: (r) => r.tier },
  { header: "Patron", get: (r) => r.orgGroup },
  { header: "Phone", get: (r) => r.phone },
  { header: "Website", get: (r) => r.website },
  { header: "Stage", get: (r) => r.stage },
];

function csvCell(value: string): string {
  const v = value ?? "";
  return /[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v;
}

/** Build a mail-merge-ready CSV for the current filtered set. */
export function toCsv(rows: DbProspect[]): string {
  const head = CSV_COLUMNS.map((c) => c.header).join(",");
  const body = rows
    .map((r) => CSV_COLUMNS.map((c) => csvCell(c.get(r))).join(","))
    .join("\n");
  return `${head}\n${body}`;
}
