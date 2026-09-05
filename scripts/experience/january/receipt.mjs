import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { captureRunFailures } from '../capture-approval.mjs';
import { hashFile } from '../lib.mjs';
import { matrix, scenarioFor } from './matrix.mjs';

export const fileDigest = file => createHash('sha256').update(readFileSync(file)).digest('hex');
export function sourceDigest() {
  const paths = execFileSync('git', ['ls-files', 'src', 'content', 'contracts', 'package.json', 'pnpm-lock.yaml', 'pnpm-workspace.yaml', 'next.config.ts'], { encoding: 'utf8' }).trim().split('\n').sort();
  return createHash('sha256').update(paths.map(file => `${file}:${hashFile(file)}`).join('\n')).digest('hex');
}

export function coverageErrors({ entries, breakpoints, results, digest, screenshotDigest, requiredMatrix = matrix }) {
  const errors = [];
  for (const entry of entries) {
    for (const state of requiredMatrix[entry.id]) {
      for (const [breakpoint, viewport] of Object.entries(breakpoints)) {
        const key = `${entry.id}:${state}:${breakpoint}`;
        const rows = results.filter(row => row.experienceId === entry.id && row.state === state && row.breakpoint === breakpoint);
        if (rows.length !== 1) { errors.push(`${key}: expected exactly one receipt, found ${rows.length}`); continue; }
        const row = rows[0];
        errors.push(...captureRunFailures([row]));
        if (row.sourceDigest !== digest) errors.push(`${key}: source changed since build/capture`);
        if (row.viewport.width !== viewport.width || row.viewport.height !== viewport.height) errors.push(`${key}: wrong viewport`);
        if (row.fixture?.scenario !== scenarioFor(state) || row.fixture?.synthetic !== true || row.fixture?.providerCalls !== 0) errors.push(`${key}: wrong or unsafe fixture`);
        if ((row.runtime?.blocked?.length ?? 0) || (row.runtime?.httpErrors?.length ?? 0)) errors.push(`${key}: network fault or forbidden request`);
        for (const request of row.runtime?.failedRequests ?? []) {
          const url = new URL(request.url);
          // Next cancels local RSC prefetches while links leave the viewport or
          // navigation/context ends. Retain these receipts; reject other faults.
          if (request.error !== 'net::ERR_ABORTED' || url.origin !== new URL(row.url).origin || !url.searchParams.has('_rsc')) errors.push(`${key}: failed asset or non-prefetch request`);
        }
        if (!row.candidateScreenshot || screenshotDigest(row.candidateScreenshot) !== row.candidateHash) errors.push(`${key}: missing or changed screenshot`);
        for (const image of row.additionalScreenshots ?? []) if (screenshotDigest(image.path) !== image.hash) errors.push(`${key}: changed section screenshot`);
        if (['keyboard-only', 'restricted', 'disabled', 'long-content', 'reduced-motion'].includes(state) && !row.interactions?.length) errors.push(`${key}: no interaction evidence`);
        if (state === 'reduced-motion' && row.runtime?.reducedMotion !== true) errors.push(`${key}: reduced motion not active`);
      }
    }
  }
  return errors;
}
