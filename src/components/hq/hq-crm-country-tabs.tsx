import Link from "next/link";
import {
  COUNTRY_CONFIG,
  PROSPECT_COUNTRIES,
  type Facet,
  type ProspectCountry,
} from "@/lib/hq/crm-utils";

/**
 * Country segmented control for the schools book.
 *
 * The schools book is one list that spans four nations; this is the axis that
 * scopes it. Switching nation resets the county/type/tag filters (they are
 * nation-specific) but keeps the search term, so "Coláiste" stays typed as you
 * hop borders. Ireland is first — it is the proof market.
 */
export function HqCrmCountryTabs({
  activeCountry,
  countries,
  totalAll,
  search,
}: {
  activeCountry: ProspectCountry | "all";
  countries: Facet[];
  totalAll: number;
  search: string;
}) {
  const counts = new Map(countries.map((c) => [c.value, c.count]));
  const q = search ? `&q=${encodeURIComponent(search)}` : "";

  const tabs: { value: ProspectCountry | "all"; label: string; flag: string; count: number }[] = [
    { value: "all", label: "All nations", flag: "🌍", count: totalAll },
    ...PROSPECT_COUNTRIES.map((c) => ({
      value: c,
      label: COUNTRY_CONFIG[c].label,
      flag: COUNTRY_CONFIG[c].flag,
      count: counts.get(c) ?? 0,
    })),
  ];

  return (
    <nav className="hq-crm-countries" aria-label="Nation">
      {tabs.map((t) => {
        const isActive = t.value === activeCountry;
        const href = `/hq/crm?book=school&country=${t.value}${q}`;
        return (
          <Link
            key={t.value}
            href={href}
            className="hq-crm-country-tab"
            data-active={isActive ? "true" : undefined}
            data-empty={t.count === 0 && t.value !== "all" ? "true" : undefined}
            aria-current={isActive ? "page" : undefined}
          >
            <span className="hq-crm-country-flag" aria-hidden="true">
              {t.flag}
            </span>
            <span className="hq-crm-country-label">{t.label}</span>
            <span className="hq-crm-country-count">{t.count.toLocaleString()}</span>
          </Link>
        );
      })}
    </nav>
  );
}
