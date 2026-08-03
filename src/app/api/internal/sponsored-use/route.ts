import "server-only";
import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";

import {
  drizzleEventInsert,
  loadRedemptionLinks,
} from "@/lib/account/instrumentation/ingest-db";
import { ingestMeaningfulAction } from "@/lib/account/instrumentation/ingest";
import type { RedemptionLink } from "@/lib/account/instrumentation/attribution";

/**
 * Ingest for `venue-meaningful-action.v1`.
 *
 * The app posts one committed meaningful action here. This is the only route
 * into `sponsor_usage_events`, and it is the point where the privacy contract
 * is actually enforced rather than merely intended.
 *
 *   curl -X POST https://signalstudio.ie/api/internal/sponsored-use \
 *        -H "Authorization: Bearer $SPONSOR_USAGE_INGEST_SECRET" \
 *        -H "Content-Type: application/json" \
 *        -d '{"eventId":"...","instrumentationVersion":"instrumentation.v1",...}'
 *
 * ## Three decisions worth stating
 *
 * **A dedicated secret, not `STUDIO_OPS_SECRET`.** The neighbouring internal
 * routes authenticate with a bearer token compared in constant time and refuse
 * when the variable is unset, and this route does the same. It does not reuse
 * their secret. `STUDIO_OPS_SECRET` grants and expires entitlements; handing
 * that credential to the product deployment so it can post usage events would
 * mean a leak from the product could mint access. The mechanism is shared, the
 * credential is not.
 *
 * **The body is passed to validation untouched.** No destructuring, no
 * rebuild, no allowlist filter applied here. `validateMeaningfulAction`
 * rejects a forbidden field at any nesting depth rather than stripping it, and
 * that property only holds if the object it sees is the object that arrived. A
 * convenience reshape at this boundary would silently restore the trimming
 * behaviour the contract exists to prevent.
 *
 * **A missing salt stores nothing.** Hashes are salted in the app and the
 * attribution join re-hashes `redemptions.user_clerk_id` here, so the two
 * deployments must hold the same `SPONSOR_USAGE_HASH_SALT`. If they do not,
 * every event attributes to nobody and a venue's report reads as couples who
 * stopped working. Refusing with 503 makes that a visible outage instead.
 */
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const MAX_BODY_BYTES = 4_096;

/** Same shape as the neighbouring internal routes: bearer, constant time. */
function authOk(req: Request): boolean {
  const expected = process.env.SPONSOR_USAGE_INGEST_SECRET;
  if (!expected) return false;
  const presented = (req.headers.get("authorization") ?? "").replace(
    /^Bearer\s+/i,
    "",
  );
  const a = Buffer.from(presented);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

function resolveSalt(): string | null {
  const salt = process.env.SPONSOR_USAGE_HASH_SALT;
  return typeof salt === "string" && salt.length >= 16 ? salt : null;
}

/**
 * The redemption chain, cached briefly.
 *
 * Attribution needs every redemption to hash-match one subject, and reading the
 * whole chain per event would turn one note into a table scan. A redemption
 * that lands inside the cache window makes its event `unattributed` with reason
 * `no-redemption`, which the nightly `repairUnattributed` pass is built to fix:
 * that path exists for exactly this race and retries only that reason.
 */
const LINK_CACHE_MS = 60_000;
let cachedLinks: { epochSalt: string; at: number; links: RedemptionLink[] } | null = null;

async function redemptionLinks(salt: string): Promise<RedemptionLink[]> {
  const now = Date.now();
  if (cachedLinks && cachedLinks.epochSalt === salt && now - cachedLinks.at < LINK_CACHE_MS) {
    return cachedLinks.links;
  }
  const links = await loadRedemptionLinks(salt);
  cachedLinks = { epochSalt: salt, at: now, links };
  return links;
}

/** Exported for tests: a stale cache must never survive a salt rotation. */
export function resetRedemptionLinkCache(): void {
  cachedLinks = null;
}

export async function POST(req: Request) {
  if (!process.env.SPONSOR_USAGE_INGEST_SECRET) {
    return NextResponse.json(
      { ok: false, error: "sponsored-use-ingest-secret-not-configured" },
      { status: 500 },
    );
  }
  if (!authOk(req)) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }
  if (!process.env.ENTITLEMENTS_DATABASE_URL) {
    return NextResponse.json(
      { ok: false, error: "entitlements-not-configured" },
      { status: 503 },
    );
  }

  const salt = resolveSalt();
  if (!salt) {
    // Never fill the unattributed bucket because of a configuration fault. A
    // salt gap is a coverage break and must read as an outage, not as silence.
    return NextResponse.json(
      { ok: false, error: "salt-unavailable" },
      { status: 503 },
    );
  }

  const raw = await req.text();
  if (raw.length > MAX_BODY_BYTES) {
    return NextResponse.json({ ok: false, error: "payload-too-large" }, { status: 413 });
  }

  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return NextResponse.json({ ok: false, error: "invalid-json" }, { status: 400 });
  }

  try {
    const outcome = await ingestMeaningfulAction(body, {
      insert: drizzleEventInsert(),
      links: await redemptionLinks(salt),
      salt,
    });

    if (!outcome.stored) {
      // A refusal is the contract working. 400 so the sink counts it as
      // `rejected` rather than retrying a payload that will never be accepted.
      return NextResponse.json(
        { ok: false, error: outcome.reason },
        { status: outcome.reason === "salt-unavailable" ? 503 : 400 },
      );
    }

    return NextResponse.json({
      ok: true,
      attribution: outcome.attribution,
      // The sponsor id is a commercial identifier, not a couple's. It is the
      // one thing the caller needs to know the join closed.
      sponsorId: outcome.sponsorId,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "sponsored-use-ingest-failed",
      },
      { status: 500 },
    );
  }
}
