export const readStates = ['empty', 'populated', 'partial-failure', 'error', 'restricted', 'dense', 'long-content', 'reduced-motion', 'keyboard-only'];
export const matrix = {
  'studio.surface.hq-shell-navigation': ['default', 'long-content', 'reduced-motion', 'keyboard-only'],
  'studio.page.hq': readStates,
  'studio.page.hq-reporting': readStates,
  'studio.page.hq-blueprint': ['default', 'empty', 'partial-failure', 'error', 'restricted', 'disabled', 'long-content', 'reduced-motion', 'keyboard-only'],
  'studio.page.hq-entitlements': ['default', 'long-content', 'reduced-motion', 'keyboard-only'],
  'studio.page.hq-financial-model': ['default', 'long-content', 'reduced-motion', 'keyboard-only'],
  'studio.page.hq-founders-circle': ['default', 'long-content', 'reduced-motion', 'keyboard-only'],
  'studio.page.students': ['default', 'long-content', 'reduced-motion', 'keyboard-only'],
};

export function scenarioFor(state) {
  if (['empty', 'partial-failure', 'error', 'dense'].includes(state)) return state;
  return state === 'long-content' ? 'dense' : 'populated';
}
