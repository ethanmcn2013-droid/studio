export const baseStates = ['default', 'long-content', 'reduced-motion', 'keyboard-only'];
export const ids = ['hq-access', 'hq-atlas', 'hq-atlas-by-slug', 'hq-cards', 'hq-entitlements-by-lookup', 'hq-experimentation-room', 'hq-health', 'hq-marketing', 'hq-org-by-slug', 'hq-platform-readiness', 'hq-product-hero-design-motion', 'hq-socials', 'hq-venues', 'hq-waitlist'];
export const matrix = Object.fromEntries(ids.map(id => [`studio.page.${id}`, [...baseStates]]));
matrix['studio.page.hq-org-by-slug'] = [...baseStates, 'restricted'];
matrix['studio.page.hq-waitlist'] = ['empty', 'populated', 'error', 'restricted', 'dense', 'long-content', 'reduced-motion', 'keyboard-only'];
matrix['studio.page.hq-access'] = [...baseStates, 'error', 'disabled'];
matrix['studio.page.hq-atlas'] = [...baseStates, 'empty'];
matrix['studio.page.hq-entitlements-by-lookup'] = [...baseStates, 'empty', 'error', 'read-only', 'disabled', 'restricted'];
matrix['studio.page.hq-health'] = [...baseStates, 'empty'];
matrix['studio.page.hq-marketing'] = [...baseStates, 'empty', 'error', 'populated'];
export const routes = {
  'studio.page.hq-atlas-by-slug': '/hq/atlas/brand-enforcement',
  'studio.page.hq-entitlements-by-lookup': '/hq/entitlements/synthetic-extension-person',
  'studio.page.hq-org-by-slug': '/hq/org/product-strategy',
};
export function variantsFor(id, state) {
  if (id === 'studio.page.hq-health' && state === 'default') return ['green', 'amber', 'red-stale', 'red-failed', 'unread'];
  if (id === 'studio.page.hq-marketing' && state === 'default') return ['ideas', 'week-empty', 'timeline', 'engine', 'ledger-empty'];
  if (id === 'studio.page.hq-marketing' && state === 'populated') return ['queue', 'ledger'];
  return ['default'];
}
export function scenarioFor(state, id, variant = 'default') {
  if (id === 'studio.page.hq-health' && state === 'default') return `health-${variant}`;
  if (id === 'studio.page.hq-entitlements-by-lookup' && state === 'error') return 'person-unavailable';
  if (id === 'studio.page.hq-entitlements-by-lookup' && state === 'disabled') return 'person-revoked';
  if (id === 'studio.page.hq-marketing' && state === 'error') return 'partner-unavailable';
  if (['empty', 'error', 'dense'].includes(state)) return state;
  return state === 'long-content' ? 'dense' : 'populated';
}
export function routeFor(id, state, entryRoute) {
  const route = routes[id] ?? entryRoute;
  if (id === 'studio.page.hq-access' && state === 'error') return route + '?error=1&from=/hq/waitlist';
  if (id === 'studio.page.hq-entitlements-by-lookup' && state === 'read-only') return route + '?viewAs=1';
  if (id === 'studio.page.hq-org-by-slug' && state === 'long-content') return '/hq/org/engineering-systems-architecture';
  return route;
}
