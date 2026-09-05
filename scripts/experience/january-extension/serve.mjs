import { spawn } from 'node:child_process';
import { createWriteStream, existsSync, mkdirSync, readFileSync, writeFileSync, copyFileSync } from 'node:fs';
import path from 'node:path';
import { baseURL, unconfiguredURL, evidence, fixtureEnvironment, root } from './environment.mjs';
import { sourceDigest, buildInputsDigest } from './receipt.mjs';
import assert from 'node:assert/strict';

const mode = process.argv[2];
if (!['build', 'start'].includes(mode)) throw new Error('Use build or start');
const env = fixtureEnvironment();
const unconfigured = process.argv.includes('--unconfigured');
assert.ok(!unconfigured || mode === 'start', 'Unconfigured gate uses the same compiled build');
if (unconfigured) delete env.SIGNAL_HQ_PASSWORD;
const digest = sourceDigest();
const inputs = buildInputsDigest();
const runId = `${mode}-${unconfigured?'unconfigured-':''}${new Date().toISOString().replaceAll(/[:.]/g,'-')}`;
mkdirSync(evidence, { recursive: true });
const receiptPath = path.join(evidence,'build-receipt.json');
if (mode === 'build' && existsSync(receiptPath)) copyFileSync(receiptPath,path.join(evidence,`${runId}-previous-build-receipt.json`));
if (mode === 'start') {
  const built = JSON.parse(readFileSync(receiptPath,'utf8'));
  assert.equal(built.sourceDigest,digest); assert.equal(built.buildInputsDigest,inputs);
  assert.equal(built.buildId,readFileSync('.next/BUILD_ID','utf8').trim());
}
const log = createWriteStream(path.join(evidence, `${runId}.log`),{flags:'wx'});
const args = [path.join(root, 'node_modules/next/dist/bin/next'), mode];
if (mode === 'start') args.push('-H', '127.0.0.1', '-p', new URL(unconfigured?unconfiguredURL:baseURL).port);
const child = spawn(process.execPath, args, { cwd: root, env, windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'] });
writeFileSync(path.join(evidence,`${runId}-process.json`),JSON.stringify({pid:child.pid,cwd:root,node:process.version,sourceDigest:digest,buildInputsDigest:inputs,mode,url:mode==='start'?(unconfigured?unconfiguredURL:baseURL):null,startedAt:new Date().toISOString()},null,2)+'\n');
for (const [stream, output] of [[child.stdout, process.stdout], [child.stderr, process.stderr]]) {
  stream.on('data', (data) => { log.write(data); output.write(data); });
}
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => child.kill());
child.on('exit', (code) => {
  writeFileSync(path.join(evidence,`${runId}-exit.json`),JSON.stringify({code,endedAt:new Date().toISOString()},null,2)+'\n');
  if (mode === 'build' && code === 0) {
    if (sourceDigest() !== digest || buildInputsDigest() !== inputs) throw new Error('Source or assets changed during build; do not attest this artifact');
    writeFileSync(receiptPath, JSON.stringify({ sourceDigest: digest, buildInputsDigest:inputs, buildId: readFileSync('.next/BUILD_ID', 'utf8').trim(), builtAt: new Date().toISOString(), node: process.version, command: 'node scripts/experience/january-extension/serve.mjs build', log:`${runId}.log`, environment: 'allowlisted runtime plumbing, local disposable SQLite, synthetic HQ session; no env files or inherited provider configuration' }, null, 2) + '\n');
  }
  log.end(); process.exitCode = code ?? 1;
});

