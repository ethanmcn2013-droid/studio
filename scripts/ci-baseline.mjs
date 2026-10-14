import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

/** Require the newest exact-base, native GitHub Actions quality result; unknown data runs rendering. */
export function baselineAvailable(payload, base) {
  if (!/^[a-f0-9]{40}$/.test(base ?? '') || /^0+$/.test(base)) return false;
  if (!Array.isArray(payload?.check_runs) || !Number.isSafeInteger(payload.total_count) || payload.total_count !== payload.check_runs.length || payload.total_count > 100) return false;
  const checks = payload.check_runs.filter(check => check?.name === 'design quality' && check.head_sha === base && check.app?.id === 15368 && check.app?.slug === 'github-actions');
  if (!checks.length || checks.some(check => !Number.isSafeInteger(check.id) || check.id <= 0) || new Set(checks.map(check => check.id)).size !== checks.length) return false;
  const latest = checks.sort((a, b) => b.id - a.id)[0];
  return latest.status === 'completed' && latest.conclusion === 'success';
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  let available = false;
  try {
    const bytes = readFileSync(0);
    if (bytes.length <= 1_000_000) available = baselineAvailable(JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(bytes)), process.argv[2]);
  } catch { /* Unknown response keeps the full rendered gate. */ }
  console.log(`available=${available}`);
}
