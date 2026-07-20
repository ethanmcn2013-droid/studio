#!/usr/bin/env node
// Publish the canonical studio decks to the documents.signalstudio.ie Vercel
// projects as EXACT copies, then verify live == canonical.
//
// Single source of truth = studio/public/brand/*.html. The growth. and plan.
// mirrors must never be hand-edited — edit the studio deck and this republishes.
//
// Local:  `vercel login`, then `node scripts/decks/publish-documents-decks.mjs`
// CI:      set VERCEL_TOKEN in the environment (GitHub Actions secret).
import { readFileSync, writeFileSync, mkdirSync, rmSync, cpSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { execSync } from 'node:child_process';
import { TARGETS, ORG, hash, localAssetRefs } from './documents-targets.mjs';

const BRAND = process.env.SOURCE_BRAND || 'public/brand';
const STAGE_ROOT = process.env.STAGE_ROOT || join(process.env.RUNNER_TEMP || '.', '_documents-stage');
const TOKEN = process.env.VERCEL_TOKEN ? ` --token ${process.env.VERCEL_TOKEN}` : '';
const sleep = ms => Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);

function stageDeck(t) {
  const html = readFileSync(join(BRAND, t.deck), 'utf8');
  const stage = join(STAGE_ROOT, t.name);
  rmSync(stage, { recursive: true, force: true });
  mkdirSync(stage, { recursive: true });
  writeFileSync(join(stage, 'index.html'), html);

  const missing = [];
  for (const ref of localAssetRefs(html)) {
    const src = join(BRAND, ref);
    if (!existsSync(src)) { missing.push(ref); continue; }
    const dst = join(stage, ref);
    mkdirSync(dirname(dst), { recursive: true });
    cpSync(src, dst);
  }
  if (missing.length) throw new Error(`${t.deck} references ${missing.length} missing asset(s): ${missing.join(', ')}`);

  writeFileSync(join(stage, 'vercel.json'), JSON.stringify({
    headers: [{ source: '/(.*)', headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }] }],
  }, null, 2));
  mkdirSync(join(stage, '.vercel'), { recursive: true });
  writeFileSync(join(stage, '.vercel/project.json'), JSON.stringify({ projectId: t.projectId, orgId: ORG, projectName: t.name }));
  return { stage, canonicalHash: hash(html) };
}

const done = [];
for (const t of TARGETS) {
  const { canonicalHash } = stageDeck(t);
  console.log(`[${t.name}] deploying → ${t.domain}`);
  execSync(`vercel deploy --prod --yes${TOKEN}`, { cwd: join(STAGE_ROOT, t.name), stdio: 'inherit' });
  done.push({ ...t, canonicalHash });
}

console.log('\n=== verify live == canonical ===');
let ok = true;
for (const r of done) {
  let live = '';
  for (let i = 0; i < 8; i++) {
    live = execSync(`curl -s -L "https://${r.domain}/?cachebust=${Date.now()}-${i}"`, { encoding: 'utf8' });
    if (hash(live) === r.canonicalHash) break;
    sleep(5000);
  }
  const match = hash(live) === r.canonicalHash;
  ok = ok && match;
  console.log(`  ${match ? 'OK   ' : 'DRIFT'} ${r.domain}  live=${hash(live)}  canonical=${r.canonicalHash}`);
}
console.log(ok ? '\nALL IN SYNC' : '\nDRIFT DETECTED');
if (!ok) process.exitCode = 1;
