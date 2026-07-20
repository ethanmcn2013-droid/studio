import {
  COUNTRY_CONFIG,
  COUNTRY_CONTEXT,
  type ProspectCountry,
} from "@/lib/hq/crm-utils";

/**
 * Per-nation context strip for the schools book.
 *
 * Each nation's list comes from a different official register with a different
 * email reality, so this says plainly, per bucket: where the list came from,
 * whether it is send-ready, and what has to happen first. On the all-nations
 * view it summarises the readiness split.
 */
export function HqCrmNationContext({
  activeCountry,
  countryCounts,
}: {
  activeCountry: ProspectCountry | "all";
  countryCounts: { value: string; count: number }[];
}) {
  const counts = new Map(countryCounts.map((c) => [c.value, c.count]));

  if (activeCountry === "all") {
    const sendReady = (counts.get("IE") ?? 0) + (counts.get("GB-SCT") ?? 0);
    const verify = counts.get("GB-ENG") ?? 0;
    const enrich = counts.get("GB-WLS") ?? 0;
    return (
      <div className="hq-crm-nation-ctx" data-ready="send">
        <span className="hq-crm-nation-ctx-tag">four nations</span>
        <p className="hq-crm-nation-ctx-line">
          Ireland and Scotland are send-ready ({sendReady.toLocaleString()} schools
          with official email). England ({verify.toLocaleString()}) needs an email
          check. Wales ({enrich.toLocaleString()}) needs enrichment. Pick a nation
          to work one list at a time.
        </p>
      </div>
    );
  }

  const ctx = COUNTRY_CONTEXT[activeCountry];
  return (
    <div className="hq-crm-nation-ctx" data-ready={ctx.readiness}>
      <span className="hq-crm-nation-ctx-tag">{ctx.readinessLabel}</span>
      <p className="hq-crm-nation-ctx-line">
        {ctx.line}
        <span className="hq-crm-nation-ctx-src">
          {" "}
          {COUNTRY_CONFIG[activeCountry].name} · {ctx.source}.
        </span>
      </p>
    </div>
  );
}
