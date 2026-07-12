/**
 * The one status pill (docs/HQ_ARCHITECTURE.md §5.9).
 *
 * Status is a closed six-value vocabulary. Domains keep their own words
 * in content frontmatter (the contract test ratchets those), and map to
 * these six at the presentation layer via `mapToStatus`. Indigo is
 * reserved for `review` — the "needs the founder" colour; everything
 * else stays in the ink/paper register so a page of pills reads calm.
 *
 * Health (ok / watch / act) is a different axis — a gauge, not a
 * lifecycle — and CRM stages are sequences; neither renders as this pill.
 */

export type HqStatus =
  | "draft"
  | "review"
  | "ready"
  | "blocked"
  | "parked"
  | "done";

const DOMAIN_MAP: Record<string, HqStatus> = {
  // decisions
  active: "ready",
  decided: "done",
  reversed: "parked",
  superseded: "parked",
  archived: "parked",
  // features / build states
  idea: "draft",
  planned: "draft",
  "in progress": "review",
  built: "ready",
  shipping: "review",
  shipped: "done",
  // review rooms
  approved: "ready",
  shortlist: "review",
  // readiness / risks
  clear: "ready",
  "needs attention": "review",
  "at risk": "blocked",
  monitoring: "ready",
  resolved: "done",
  // operator todos
  open: "review",
  // generic
  "needs design": "draft",
  queued: "draft",
  "ready for ethan": "review",
  selected: "done",
  held: "parked",
};

/** Map a domain status word onto the six-value vocabulary. */
export function mapToStatus(domainValue: string): HqStatus {
  return DOMAIN_MAP[domainValue.trim().toLowerCase()] ?? "draft";
}

export function HqStatusPill({
  status,
  label,
}: {
  status: HqStatus;
  /** Optional domain word to display; the pill colour stays canonical. */
  label?: string;
}) {
  return (
    <span className="hq-pill" data-status={status}>
      {label ?? status}
    </span>
  );
}
