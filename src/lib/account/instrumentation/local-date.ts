/**
 * Local-date derivation for the sponsored-use rollup.
 *
 * A day is the unit the venue is told about ("21 days with sponsored use"), so
 * the boundary has to be the venue's midnight, not UTC's. Ireland runs UTC in
 * winter and UTC+1 in summer, which means a naive `toISOString().slice(0,10)`
 * silently files late-evening summer activity under the previous day.
 *
 * `sponsors` carries no timezone column, so Europe/Dublin is the default for
 * every account until one exists. The zone is a parameter rather than a
 * constant so adding that column later is a caller change, not a rewrite.
 *
 * Uses `Intl.DateTimeFormat`, which is in the platform, rather than pulling a
 * date library in for one function.
 */

export const DEFAULT_ACCOUNT_TIME_ZONE = "Europe/Dublin";

const formatterCache = new Map<string, Intl.DateTimeFormat>();

function formatterFor(timeZone: string): Intl.DateTimeFormat {
  const cached = formatterCache.get(timeZone);
  if (cached) return cached;
  const created = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  formatterCache.set(timeZone, created);
  return created;
}

/** `YYYY-MM-DD` in the account's zone. */
export function toLocalDate(
  occurredAt: number,
  timeZone: string = DEFAULT_ACCOUNT_TIME_ZONE,
): string {
  if (!Number.isFinite(occurredAt)) {
    throw new Error("occurredAt must be a finite timestamp");
  }
  // en-CA yields YYYY-MM-DD directly, so there is no part reassembly to get wrong.
  return formatterFor(timeZone).format(new Date(occurredAt));
}

/** Inclusive list of local dates spanning a window, oldest first. */
export function localDatesBetween(
  startMs: number,
  endMs: number,
  timeZone: string = DEFAULT_ACCOUNT_TIME_ZONE,
): string[] {
  if (endMs < startMs) return [];
  const dates: string[] = [];
  const seen = new Set<string>();
  // Step in half-days so a 23-hour spring-forward day cannot be skipped.
  const STEP = 43_200_000;
  for (let cursor = startMs; cursor <= endMs; cursor += STEP) {
    const date = toLocalDate(cursor, timeZone);
    if (!seen.has(date)) {
      seen.add(date);
      dates.push(date);
    }
  }
  const last = toLocalDate(endMs, timeZone);
  if (!seen.has(last)) dates.push(last);
  return dates;
}

/**
 * A local day is closed once the venue's next midnight has passed, plus a grace
 * hour for late writes. The rollup only ever aggregates closed days, so a
 * partial day cannot be reported as a complete one.
 */
export function isLocalDayClosed(
  localDate: string,
  nowMs: number,
  timeZone: string = DEFAULT_ACCOUNT_TIME_ZONE,
  graceHours = 6,
): boolean {
  const nowLocal = toLocalDate(nowMs, timeZone);
  if (localDate > nowLocal) return false;
  if (localDate < nowLocal) {
    // Yesterday is only closed once the grace window has elapsed locally.
    const hour = Number(
      new Intl.DateTimeFormat("en-GB", {
        timeZone,
        hour: "2-digit",
        hour12: false,
      }).format(new Date(nowMs)),
    );
    const yesterday = previousLocalDate(nowLocal);
    return localDate < yesterday || hour >= graceHours;
  }
  return false;
}

function previousLocalDate(localDate: string): string {
  const [y, m, d] = localDate.split("-").map(Number);
  // Midday UTC keeps the arithmetic clear of any offset edge.
  const prior = new Date(Date.UTC(y, m - 1, d, 12) - 86_400_000);
  return prior.toISOString().slice(0, 10);
}
