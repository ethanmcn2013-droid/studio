import "server-only";

import { randomUUID } from "node:crypto";
import { desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  WAITLIST_USE_CASES,
  waitlistEntries,
  type WaitlistEntry,
  type WaitlistUseCase,
} from "@/lib/db/schema";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type WaitlistInput = {
  email: string;
  name?: string | null;
  useCase?: string | null;
  note?: string | null;
  source?: string | null;
  campaign?: string | null;
  audience?: string | null;
  artifact?: string | null;
  touch?: string | null;
  referrer?: string | null;
  path?: string | null;
  userAgent?: string | null;
};

export type WaitlistWriteResult = {
  id: string;
  email: string;
  created: boolean;
};

export function normalizeEmail(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const email = raw.trim().toLowerCase();
  if (!email || email.length > 254 || !EMAIL_RE.test(email)) return null;
  return email;
}

export function normalizeWaitlistUseCase(raw: unknown): WaitlistUseCase | null {
  if (typeof raw !== "string") return null;
  const value = raw.trim();
  if (!WAITLIST_USE_CASES.includes(value as WaitlistUseCase)) return null;
  return value as WaitlistUseCase;
}

export function cleanText(raw: unknown, max = 240): string | null {
  if (typeof raw !== "string") return null;
  const value = raw.trim().replace(/\s+/g, " ");
  if (!value) return null;
  return value.slice(0, max);
}

export async function joinWaitlist(
  input: WaitlistInput,
): Promise<WaitlistWriteResult> {
  const email = normalizeEmail(input.email);
  if (!email) {
    throw new Error("Enter a real email address.");
  }

  const now = Date.now();
  const existing = await db
    .select({ id: waitlistEntries.id })
    .from(waitlistEntries)
    .where(eq(waitlistEntries.email, email))
    .limit(1);
  const id = existing[0]?.id ?? `wl-${randomUUID().replace(/-/g, "").slice(0, 18)}`;

  await db
    .insert(waitlistEntries)
    .values({
      id,
      email,
      name: cleanText(input.name, 120),
      useCase: normalizeWaitlistUseCase(input.useCase),
      note: cleanText(input.note, 1000),
      source: cleanText(input.source, 80) ?? "waitlist",
      campaign: cleanText(input.campaign, 80),
      audience: cleanText(input.audience, 80),
      artifact: cleanText(input.artifact, 120),
      touch: cleanText(input.touch, 80),
      referrer: cleanText(input.referrer, 500),
      path: cleanText(input.path, 500),
      userAgent: cleanText(input.userAgent, 500),
      status: "waiting",
      createdAt: now,
      updatedAt: now,
      lastSubmittedAt: now,
    })
    .onConflictDoUpdate({
      target: waitlistEntries.email,
      set: {
        name: cleanText(input.name, 120),
        useCase: normalizeWaitlistUseCase(input.useCase),
        note: cleanText(input.note, 1000),
        source: cleanText(input.source, 80) ?? "waitlist",
        campaign: cleanText(input.campaign, 80),
        audience: cleanText(input.audience, 80),
        artifact: cleanText(input.artifact, 120),
        touch: cleanText(input.touch, 80),
        referrer: cleanText(input.referrer, 500),
        path: cleanText(input.path, 500),
        userAgent: cleanText(input.userAgent, 500),
        updatedAt: now,
        lastSubmittedAt: now,
      },
    });

  return { id, email, created: !existing[0] };
}

export async function getWaitlistEntries(limit = 200): Promise<WaitlistEntry[]> {
  return db
    .select()
    .from(waitlistEntries)
    .orderBy(desc(waitlistEntries.lastSubmittedAt))
    .limit(limit);
}
