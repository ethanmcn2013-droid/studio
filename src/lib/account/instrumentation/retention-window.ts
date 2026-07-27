/**
 * How long raw sponsored-use events are kept.
 *
 * A contract value, not an implementation detail: the sweep deletes on it, and
 * the day-30 sealing job's cadence is derived from it. It lives in its own pure
 * module so both can share it without either importing server-only code.
 */
export const EVENT_RETENTION_DAYS = 35;
