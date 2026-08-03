import { licenseCodes } from "@/lib/entitlements-db/schema";

/**
 * The columns the live access projection actually reads.
 *
 * This is a constant rather than an inline object in the loader because the
 * failure it guards against is invisible: a projector that branches on
 * `deliveredAt` cannot tell the difference between "this code was never
 * delivered" and "the query did not ask". Both arrive as undefined, so the
 * `issued` and `expired` states silently collapsed to `available` on every
 * live venue while the fixtures showed them working.
 *
 * Both delivery columns are deliberately un-backfilled
 * (`entitlements-db/schema.ts`), so selecting them changes nothing for a venue
 * that has no delivery data: null stays null and the row stays available. What
 * changes is that a venue which *does* have the data is no longer told an
 * expired code is safe to send.
 *
 * No `server-only` import here on purpose, so the column set is assertable in
 * a unit test without a database.
 */
export const LIVE_ACCESS_CODE_COLUMNS = {
  id: licenseCodes.id,
  code: licenseCodes.code,
  status: licenseCodes.status,
  createdAt: licenseCodes.createdAt,
  redeemedAt: licenseCodes.redeemedAt,
  deliveredAt: licenseCodes.deliveredAt,
  expiresAt: licenseCodes.expiresAt,
} as const;

/** Every field the projector branches on, by the name the projector uses. */
export const LIVE_ACCESS_CODE_FIELDS = [
  "id",
  "code",
  "status",
  "createdAt",
  "redeemedAt",
  "deliveredAt",
  "expiresAt",
] as const;
