import { captureRunFailures } from '../capture-approval.mjs';
import { matrix, routeFor, scenarioFor, variantsFor } from './matrix.mjs';
import { sourceDigest, fileDigest } from '../january/receipt.mjs';
import { execFileSync } from 'node:child_process';
import { readdirSync, readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
export { sourceDigest, fileDigest };
const digest = value => createHash('sha256').update(value).digest('hex');
export function toolingDigest() {
  const dir = 'scripts/experience/january-extension';
  return digest(readdirSync(dir).filter(f => /\.(mjs|ts)$/.test(f)).sort().map(f => `${f}:${digest(readFileSync(`${dir}/${f}`, 'utf8').replace(/\r\n?/g, '\n'))}`).join('\n'));
}
export function buildInputsDigest() {
  const files = execFileSync('git', ['ls-files', 'public/brand/collateral/cards', 'public/brand/collateral/social', 'docs/signal-studio-review/remediation-program.yaml'], {encoding:'utf8',windowsHide:true}).trim().split(/\r?\n/).filter(Boolean).sort();
  return digest(sourceDigest()+'\n'+files.map(file=>`${file}:${fileDigest(file)}`).join('\n'));
}

export function coverageErrors({ entries, breakpoints, results, digest, screenshotDigest, identity }) {
  const errors = [];
  for (const entry of entries) for (const state of matrix[entry.id]) for (const variant of variantsFor(entry.id, state)) for (const [breakpoint, viewport] of Object.entries(breakpoints)) {
    const key = `${entry.id}:${state}:${variant}:${breakpoint}`;
    const rows = results.filter(r => r.experienceId === entry.id && r.state === state && r.variant === variant && r.breakpoint === breakpoint);
    if (rows.length !== 1) { errors.push(`${key}: expected one receipt, found ${rows.length}`); continue; }
    const row = rows[0];
    errors.push(...captureRunFailures([row]));
    if (row.sourceDigest !== digest) errors.push(`${key}: stale runtime source`);
    if (!identity || !identity.buildId || !identity.buildInputsDigest || !identity.toolingDigest ||
      row.buildId !== identity.buildId || row.buildInputsDigest !== identity.buildInputsDigest || row.toolingDigest !== identity.toolingDigest || row.servedBuildId !== identity.buildId) errors.push(`${key}: wrong build, served artifact, asset or tooling identity`);
    if (row.viewport?.width !== viewport.width || row.viewport?.height !== viewport.height) errors.push(`${key}: wrong viewport`);
    if (row.fixture?.synthetic !== true || row.fixture?.providerCalls !== 0 || row.fixture?.scenario !== scenarioFor(state, entry.id, variant)) errors.push(`${key}: wrong or unsafe fixture`);
    const route = routeFor(entry.id,state,entry.route);
    const origin = entry.id === 'studio.page.hq-access' && state === 'disabled' ? 'http://127.0.0.1:4417' : 'http://127.0.0.1:4416';
    const expected = new URL(route,origin), original = new URL(row.url), final = new URL(row.finalUrl);
    if (original.href !== expected.href || final.origin !== origin || final.pathname !== (state === 'restricted' ? '/hq/access' : expected.pathname) ||
      (state !== 'restricted' && final.search !== expected.search)) errors.push(`${key}: wrong actual route or loopback origin`);
    if (!row.candidateScreenshot || screenshotDigest(row.candidateScreenshot) !== row.candidateHash) errors.push(`${key}: missing or changed screenshot`);
    for (const shot of row.additionalScreenshots ?? []) if (screenshotDigest(shot.path) !== shot.hash) errors.push(`${key}: changed section screenshot`);
    if (row.runtime?.httpErrors?.length || row.runtime?.blocked?.length) errors.push(`${key}: network fault or forbidden request`);
    for (const request of row.runtime?.failedRequests ?? []) {
      const url = new URL(request.url);
      if (request.error !== 'net::ERR_ABORTED' || url.origin !== new URL(row.url).origin || !url.searchParams.has('_rsc')) errors.push(`${key}: failed asset or non-prefetch request`);
    }
    if (!row.interactions?.length) errors.push(`${key}: no state proof`);
    if (!row.materialStateProved) errors.push(`${key}: material branch not proven`);
    if (state === 'reduced-motion' && row.runtime?.reducedMotion !== true) errors.push(`${key}: reduced motion inactive`);
    if (entry.id === 'studio.page.hq-waitlist' && state !== 'restricted') {
      const expected = state === 'error' ? null : state === 'empty' ? 0 : ['dense', 'long-content'].includes(state) ? 36 : 3;
      if (row.fixture.expectedWaitlistCount !== expected || !row.interactions?.some(x => typeof x === 'object' && x.realWaitlistRead === expected)) errors.push(`${key}: waitlist branch not proven`);
    }
  }
  return errors;
}
