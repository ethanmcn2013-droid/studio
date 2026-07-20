// Single source of truth for the documents.signalstudio.ie deck mirrors.
// domain <- deck <- Vercel project. Imported by publish + verify so they can
// never disagree. The studio /brand/ deck IS the canonical; these are mirrors.
import { createHash } from 'node:crypto';

export const ORG = 'team_veMY72ml10cAawsR0CjN9k5y';

export const TARGETS = [
  { name: 'signal-growth-plan',   projectId: 'prj_f4RxS3x7qShRC6DDRq7bfdFg37bH', deck: 'market-entry-deck-2026.html', domain: 'growth.signalstudio.ie' },
  { name: 'signal-business-plan', projectId: 'prj_dp0GPygsYilxquTk6Inrcz6ypkij', deck: 'business-loan-pack-2026.html', domain: 'plan.signalstudio.ie' },
];

export const norm = s => s.replace(/\r\n?/g, '\n');
export const hash = s => createHash('sha256').update(norm(s)).digest('hex').slice(0, 16);

export function localAssetRefs(html) {
  const refs = new Set();
  const re = /(?:src|href)="((?:assets|_ds)\/[^"]+)"/g;
  let m;
  while ((m = re.exec(html)) !== null) refs.add(m[1]);
  return [...refs];
}
