import "server-only";
import { and, eq, isNotNull, sql } from "drizzle-orm";
import { entitlementsDb } from "./client";
import { appendEvent } from "./audit";
import { requireActor, type MutationActor } from "./guard";
import { sponsors } from "./schema";
import {
  FOUNDING_PLACES,
  foundingNumberRefusal,
  foundingPlacesRemaining,
  formatFoundingNumber,
  nextFoundingNumber,
} from "@/lib/venue-founding-number";

/**
 * Founding Venue number assignment — E02.13, implementing E02.10 and D-009
 * point 6.
 *
 * The rules are in `@/lib/venue-founding-number` and in
 * `docs/strategy/FOUNDING_25_PROGRAMME_MECHANICS.md` §2. This is the only
 * sanctioned way to assign or withdraw one.
 *
 * The correctness that matters: **no two venues may ever hold the same
 * number.** Two founding venues both told they are 07/25 is unrecoverable with
 * exactly the people whose reference value is the reason they were recruited.
 * The guarantee is a partial UNIQUE index on `sponsors(founding_number)`, not
 * the arithmetic below — the read-compute-write here is a race, and the index
 * is what makes losing that race harmless rather than silent.
 */

export type AssignResult =
  | { state: "assigned"; sponsorId: string; number: number; label: string }
  | { state: "already_assigned"; sponsorId: string; number: number; label: string }
  | { state: "refused"; reason: string }
  | { state: "programme_full" };

/** How many attempts before we stop retrying a lost race. Each retry means
 *  another venue took the number between our read and our write, which cannot
 *  plausibly happen 25 times in one call. */
const MAX_CLAIM_ATTEMPTS = FOUNDING_PLACES;

async function takenNumbers(db: ReturnType<typeof entitlementsDb>): Promise<number[]> {
  const rows = await db
    .select({ n: sponsors.foundingNumber })
    .from(sponsors)
    .where(isNotNull(sponsors.foundingNumber));
  return rows.map((r) => r.n as number);
}

/**
 * Assign the lowest free place to a venue whose payment has cleared.
 *
 * Payment is the gate and nothing else is: a signed agreement with no cleared
 * payment gets a held place, not a number. That is not a technicality — it is
 * what makes 01/25 worth having, because payment is the only event that cannot
 * be walked back.
 *
 * Idempotent: a venue that already holds a number gets it back rather than a
 * second one.
 */
export async function assignFoundingNumber(input: {
  sponsorId: string;
  actor: MutationActor;
  origin?: string | null;
}): Promise<AssignResult> {
  const actor = requireActor(input.actor);
  const db = entitlementsDb();

  const [sponsor] = await db
    .select({
      id: sponsors.id,
      slug: sponsors.slug,
      venuePlan: sponsors.venuePlan,
      paidAt: sponsors.paidAt,
      foundingNumber: sponsors.foundingNumber,
    })
    .from(sponsors)
    .where(eq(sponsors.id, input.sponsorId))
    .limit(1);

  if (!sponsor) return { state: "refused", reason: `no sponsor '${input.sponsorId}'` };

  if (sponsor.foundingNumber != null) {
    return {
      state: "already_assigned",
      sponsorId: sponsor.id,
      number: sponsor.foundingNumber,
      label: formatFoundingNumber(sponsor.foundingNumber) as string,
    };
  }

  const refusal = foundingNumberRefusal({
    paidAt: sponsor.paidAt,
    existingNumber: sponsor.foundingNumber,
    venuePlan: sponsor.venuePlan,
  });
  if (refusal) return { state: "refused", reason: refusal };

  for (let attempt = 0; attempt < MAX_CLAIM_ATTEMPTS; attempt += 1) {
    const taken = await takenNumbers(db);
    const candidate = nextFoundingNumber(taken);
    if (candidate == null) return { state: "programme_full" };

    const now = Date.now();
    let claimed: Array<{ id: string }> = [];
    try {
      // The claim and its ledger line commit together. audit.ts requires it:
      // "appendEvent MUST run inside the same libSQL transaction as the state
      // mutation it records, so a state change can never commit without its
      // signed line."
      claimed = await db.transaction(async (tx) => {
        const rows = await tx
          .update(sponsors)
          .set({
            foundingNumber: candidate,
            foundingNumberAssignedAt: now,
            updatedAt: now,
          })
          .where(
            and(
              eq(sponsors.id, sponsor.id),
              // Re-checked in the statement, so a concurrent assignment to the
              // same venue cannot produce two numbers.
              sql`${sponsors.foundingNumber} IS NULL`,
            ),
          )
          .returning({ id: sponsors.id });
        if (rows.length > 0) {
          await appendEvent(tx, {
            action: "grant",
            sponsorId: sponsor.id,
            actorId: actor.actorId,
            actorName: actor.actorName,
            reason: `founding number ${formatFoundingNumber(candidate)} assigned on cleared payment`,
            before: { foundingNumber: null },
            after: { foundingNumber: candidate },
            origin: input.origin ?? "founding-number",
          });
        }
        return rows;
      });
    } catch (err) {
      // Two recoverable shapes, both meaning "try again":
      //   - the unique index refused the place, because another venue took it
      //     between our read and our write. Recompute and take the next one.
      //   - the database was momentarily locked by another writer.
      // Anything else is a real failure and is not swallowed.
      if (isRetryable(err)) {
        await backoff(attempt);
        continue;
      }
      throw err;
    }

    if (claimed.length === 0) {
      // Someone assigned a number to THIS venue while we were working. Return
      // what they assigned rather than assigning a second one.
      const [again] = await db
        .select({ n: sponsors.foundingNumber })
        .from(sponsors)
        .where(eq(sponsors.id, sponsor.id))
        .limit(1);
      if (again?.n != null) {
        return {
          state: "already_assigned",
          sponsorId: sponsor.id,
          number: again.n,
          label: formatFoundingNumber(again.n) as string,
        };
      }
      continue;
    }

    return {
      state: "assigned",
      sponsorId: sponsor.id,
      number: candidate,
      label: formatFoundingNumber(candidate) as string,
    };
  }

  return { state: "refused", reason: "could not claim a place after repeated contention" };
}

export type WithdrawResult =
  | { state: "withdrawn"; sponsorId: string; number: number; label: string }
  | { state: "no_number"; sponsorId: string }
  | { state: "refused"; reason: string };

/**
 * Withdraw a number and return the place to the pool.
 *
 * **This exists for exactly one situation: a payment that reverses after the
 * number was assigned.** It is not for a lapse. A venue that lapses in year
 * three keeps 07/25 historically and its place shows as closed rather than
 * open — calling this on a lapse would hand their number to somebody else,
 * which the programme mechanics forbid.
 *
 * A reason is required and is written to the audit ledger, because the venue is
 * told in the same message that tells them the payment failed.
 */
export async function withdrawFoundingNumber(input: {
  sponsorId: string;
  reason: string;
  actor: MutationActor;
  origin?: string | null;
}): Promise<WithdrawResult> {
  const actor = requireActor(input.actor);
  const reason = input.reason?.trim();
  if (!reason) {
    return {
      state: "refused",
      reason: "a reason is required — the withdrawal is recorded and the venue is told",
    };
  }
  const db = entitlementsDb();

  const [sponsor] = await db
    .select({ id: sponsors.id, foundingNumber: sponsors.foundingNumber })
    .from(sponsors)
    .where(eq(sponsors.id, input.sponsorId))
    .limit(1);
  if (!sponsor) return { state: "refused", reason: `no sponsor '${input.sponsorId}'` };
  if (sponsor.foundingNumber == null) return { state: "no_number", sponsorId: sponsor.id };

  const withdrawn = sponsor.foundingNumber;
  const now = Date.now();
  // Same rule as assignment: the state change and its signed ledger line
  // commit together or not at all.
  await db.transaction(async (tx) => {
    await tx
      .update(sponsors)
      .set({ foundingNumber: null, foundingNumberAssignedAt: null, updatedAt: now })
      .where(eq(sponsors.id, sponsor.id));
    await appendEvent(tx, {
      action: "revoke",
      sponsorId: sponsor.id,
      actorId: actor.actorId,
      actorName: actor.actorName,
      reason: `founding number ${formatFoundingNumber(withdrawn)} withdrawn: ${reason}`,
      before: { foundingNumber: withdrawn },
      after: { foundingNumber: null },
      origin: input.origin ?? "founding-number",
    });
  });

  return {
    state: "withdrawn",
    sponsorId: sponsor.id,
    number: withdrawn,
    label: formatFoundingNumber(withdrawn) as string,
  };
}

/**
 * Programme state, for scarcity claims. The mechanics doc requires every
 * published statement about places to be true when it is sent, so this is the
 * only number any surface should quote.
 */
export async function foundingProgrammeStatus(): Promise<{
  taken: number[];
  remaining: number;
  closed: boolean;
}> {
  const db = entitlementsDb();
  const taken = (await takenNumbers(db)).sort((a, b) => a - b);
  const remaining = foundingPlacesRemaining(taken);
  return { taken, remaining, closed: remaining === 0 };
}

/**
 * Is this failure worth another attempt?
 *
 * Two shapes are recoverable, and both mean "recompute and try again":
 *
 *   UNIQUE constraint failed  another venue took the place between our read
 *                             and our write. The next free number is now
 *                             different.
 *   SQLITE_BUSY               another writer held the database for a moment.
 *
 * **The cause chain matters.** Drizzle wraps the driver error as
 * `Failed query: update "sponsors" set …`, so the real code and message only
 * appear on `error.cause`. Matching the top-level message alone silently turns
 * a recoverable race into a thrown request — which is what this function did
 * when it was first written, and what the concurrency test caught.
 */
export function isRetryable(err: unknown): boolean {
  const seen = new Set<unknown>();
  let current: unknown = err;
  while (current && !seen.has(current)) {
    seen.add(current);
    if (typeof current === "string") {
      return /UNIQUE constraint failed|SQLITE_BUSY|database is locked/i.test(current);
    }
    if (!(current instanceof Error)) return false;
    if (/UNIQUE constraint failed|SQLITE_BUSY|database is locked/i.test(current.message)) {
      return true;
    }
    const code = (current as { code?: unknown }).code;
    if (typeof code === "string" && (code.startsWith("SQLITE_CONSTRAINT") || code === "SQLITE_BUSY")) {
      return true;
    }
    current = current.cause;
  }
  return false;
}

/** Short, growing pause between attempts. Retrying a lock instantly just
 *  burns the contention window it is waiting for. */
function backoff(attempt: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 5 * (attempt + 1)));
}
