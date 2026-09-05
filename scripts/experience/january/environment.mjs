import { existsSync, mkdirSync } from 'node:fs';
import path from 'node:path';

export const root = process.cwd();
export const scratch = path.join(root, 'experience/output/playwright-results/january-commercial-final');
export const evidence = path.join(root, process.argv.includes('--venue-kit')
  ? 'experience/reviews/january-venue-kit-layout-composition-2026-09-05'
  : process.argv.includes('--atlas')
  ? 'experience/reviews/january-atlas-render-final-2026-09-05'
  : 'experience/reviews/january-layout-composition-attempt2-2026-09-05');
export const baseURL = 'http://127.0.0.1:4493';
// This password is public, synthetic fixture data, never an operator credential.
export const fixturePassword = 'january-disposable-experience-fixture';

export function localDatabase(name) {
  if (!['studio', 'shared'].includes(name)) throw new Error('Unknown fixture database');
  mkdirSync(scratch, { recursive: true });
  return `file:${path.join(scratch, `${name}.db`).replaceAll('\\', '/')}`;
}

export function fixtureEnvironment(inherited = process.env) {
  for (const name of ['.env', '.env.local', '.env.production', '.env.production.local', '.env.development', '.env.development.local']) {
    if (existsSync(path.join(root, name))) throw new Error(`Refusing fixture server with ${name} present`);
  }
  // Allowlist runtime plumbing. No inherited provider, mail, operator, product DB,
  // HOME-based personal repository reads, or authentication configuration.
  const allowed = new Set(['path', 'systemroot', 'windir', 'temp', 'tmp', 'comspec', 'pathext']);
  const env = Object.fromEntries(Object.entries(inherited).filter(([key]) => allowed.has(key.toLowerCase())));
  return {
    ...env,
    NODE_ENV: 'production', NEXT_TELEMETRY_DISABLED: '1',
    SIGNAL_ACCESS_MODE: 'review', NEXT_PUBLIC_SIGNAL_ACCESS_MODE: 'review',
    SIGNAL_HQ_PASSWORD: fixturePassword,
    SIGNAL_HQ_OPERATORS: 'test-operator:Synthetic Operator',
    ENTITLEMENTS_DATABASE_URL: localDatabase('shared'), ENTITLEMENTS_AUTH_TOKEN: '',
    STUDIO_DATABASE_URL: localDatabase('studio'), STUDIO_AUTH_TOKEN: '',
  };
}
