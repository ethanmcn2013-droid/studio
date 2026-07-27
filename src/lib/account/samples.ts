import path from "node:path";
import type { VenueFixtureKey } from "./fixtures";

export const ACCOUNT_SAMPLE_FIXTURES: VenueFixtureKey[] = [
  "complete",
  "partial",
  "suppressed",
  "unavailable",
];

export const ACCOUNT_SAMPLE_FORMATS = ["pdf", "csv"] as const;

export type AccountSampleFormat = (typeof ACCOUNT_SAMPLE_FORMATS)[number];

export function isAccountSampleFixture(
  value: string,
): value is VenueFixtureKey {
  return ACCOUNT_SAMPLE_FIXTURES.includes(value as VenueFixtureKey);
}

export function isAccountSampleFormat(
  value: string,
): value is AccountSampleFormat {
  return (ACCOUNT_SAMPLE_FORMATS as readonly string[]).includes(value);
}

/** Samples live outside public/ and are served only via HQ download route. */
export function accountSamplesDir(repoRoot = process.cwd()) {
  return path.join(repoRoot, "private", "account-samples");
}

export function accountSamplePath(
  fixture: VenueFixtureKey,
  format: AccountSampleFormat,
  repoRoot = process.cwd(),
) {
  return path.join(accountSamplesDir(repoRoot), `${fixture}.${format}`);
}
