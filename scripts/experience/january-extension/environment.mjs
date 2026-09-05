import { existsSync, mkdirSync } from 'node:fs';
import path from 'node:path';

export const root = process.cwd();
export const scratch = path.join(root, 'experience/output/playwright-results/january-studio14-final');
export const evidence = path.join(root, 'experience/reviews/january-studio14-final-2026-09-05');
export const baseURL = 'http://127.0.0.1:4416';
export const unconfiguredURL = 'http://127.0.0.1:4417';
export const fixturePassword = 'january-extension-disposable-fixture';
export const fixturePerson = 'synthetic-extension-person';

export function localDatabase(name) {
  if (!['studio', 'shared'].includes(name)) throw new Error('Unknown fixture database');
  mkdirSync(scratch, { recursive: true });
  return `file:${path.join(scratch, `${name}.db`).replaceAll('\\', '/')}`;
}

export function fixtureEnvironment(inherited = process.env) {
  for (const name of ['.env', '.env.local', '.env.production', '.env.production.local', '.env.development', '.env.development.local']) {
    if (existsSync(path.join(root, name))) throw new Error(`Refusing fixture with ${name} present`);
  }
  const allowed = new Set(['path', 'systemroot', 'windir', 'temp', 'tmp', 'comspec', 'pathext']);
  return {
    ...Object.fromEntries(Object.entries(inherited).filter(([key]) => allowed.has(key.toLowerCase()))),
    NODE_ENV: 'production', NEXT_TELEMETRY_DISABLED: '1',
    SIGNAL_ACCESS_MODE: 'review', NEXT_PUBLIC_SIGNAL_ACCESS_MODE: 'review',
    SIGNAL_HQ_PASSWORD: fixturePassword,
    SIGNAL_HQ_OPERATORS: 'test-operator:Synthetic Operator',
    ENTITLEMENTS_DATABASE_URL: localDatabase('shared'), ENTITLEMENTS_AUTH_TOKEN: '',
    STUDIO_DATABASE_URL: localDatabase('studio'), STUDIO_AUTH_TOKEN: '',
  };
}
