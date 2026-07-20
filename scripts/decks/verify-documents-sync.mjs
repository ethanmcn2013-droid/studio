#!/usr/bin/env node
// Drift guard for the documents.signalstudio.ie deck mirrors.
//
//   node scripts/decks/verify-documents-sync.mjs          # asset-completeness (offline, PR-safe)
//   node scripts/decks/verify-documents-sync.mjs --live    # + live mirror == canonical
//
// Fails (exit 1) if a canonical deck references a missing asset, or if a live
// mirror has drifted from the canonical studio deck. The publish workflow runs
// --live after each deploy; PRs run the offline check.
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { execSync } from 'node:child_process';
import { TARGETS, hash, localAssetRefs } from './documents-targets.mjs';

const BRAND = process.env.SOURCE_BRAND || 'public/brand';
const LIVE = process.argv.includes('--live') || process.env.CHECK_LIVE === '1';
const sleep = ms => Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);

const errors = [];

// 1. every asset each canonical deck references must exist (offline, deterministic)
for (const t of TARGETS) {
  const deckPath = join(BRAND, t.deck);
  if (!existsSync(deckPath)) { errors.push(`${t.deck}: canonical deck missing at ${deckPath}`); continue; }
  const html = readFileSync(deckPath, 'utf8');
  for (const ref of localAssetRefs(html)) {
    if (!existsSync(join(BRAND, ref))) errors.push(`${t.deck}: references missing asset ${ref}`);
  }
}

// 2. live mirror must byte-match the canonical deck (opt-in; needs network)
if (LIVE && errors.length === 0) {
  for (const t of TARGETS) {
    const canonical = hash(readFileSync(join(BRAND, t.deck), 'utf8'));
    let live = '', match = false;
    for (let i = 0; i < 8; i++) {
      live = execSync(`curl -s -L "https://${t.domain}/?cachebust=${Date.now()}-${i}"`, { encoding: 'utf8' });
      match = hash(live) === canonical;
      if (match) break;
      sleep(5000);
    }
    console.log(`  ${match ? 'OK   ' : 'DRIFT'} ${t.domain}  live=${hash(live)}  canonical=${canonical}`);
    if (!match) errors.push(`${t.domain}: live mirror has drifted from ${t.deck} — run scripts/decks/publish-documents-decks.mjs`);
  }
}

if (errors.length) {
  console.error(`\ndocuments-decks: ${errors.length} problem(s):`);
  for (const e of errors) console.error(`  x ${e}`);
  process.exit(1);
}
console.log(`documents-decks: in sync (${TARGETS.length} mirrors${LIVE ? ', live-checked' : ', asset-checked'}).`);
