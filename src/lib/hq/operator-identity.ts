import "server-only";
import { cookies } from "next/headers";
import { operatorActor, type MutationActor } from "@/lib/entitlements-db/guard";

/**
 * Resolve the named HQ operator for the current request into a MutationActor.
 *
 * Interim identity (see the hq-per-operator-identity operator-todo — the
 * launch gate). Today HQ auth is one shared password, so the ledger cannot
 * attribute a mutation to a person on its own. Until per-operator auth lands
 * this reads, in order:
 *   1. the `signal_hq_operator` cookie ("id|Name"), set by the Access console
 *      named-operator prompt (Phase 5);
 *   2. the SIGNAL_HQ_OPERATOR env ("id:Name"), a single configured operator
 *      for the solo-founder interim.
 * If neither resolves a named operator it throws — mutations fail closed
 * rather than record an anonymous actor. operatorActor additionally enforces
 * the SIGNAL_HQ_OPERATORS roster once it is configured.
 */

export const HQ_OPERATOR_COOKIE = "signal_hq_operator";

function fromEnv(): { id: string; name: string } | null {
  const raw = process.env.SIGNAL_HQ_OPERATOR?.trim();
  if (!raw) return null;
  const i = raw.indexOf(":");
  if (i === -1) return { id: raw, name: raw };
  return { id: raw.slice(0, i).trim(), name: raw.slice(i + 1).trim() };
}

function parseCookie(value: string | undefined): { id: string; name: string } | null {
  if (!value) return null;
  const i = value.indexOf("|");
  if (i === -1) return value.trim() ? { id: value.trim(), name: value.trim() } : null;
  const id = value.slice(0, i).trim();
  const name = value.slice(i + 1).trim();
  return id ? { id, name: name || id } : null;
}

export async function resolveHqOperatorActor(): Promise<MutationActor> {
  const cookieStore = await cookies();
  const fromCookie = parseCookie(cookieStore.get(HQ_OPERATOR_COOKIE)?.value);
  const chosen = fromCookie ?? fromEnv();
  if (!chosen) {
    throw new Error(
      "no named HQ operator: set the operator for this session (or SIGNAL_HQ_OPERATOR). The access ledger will not record an anonymous mutation.",
    );
  }
  return operatorActor(chosen);
}
