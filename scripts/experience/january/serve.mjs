import { spawn } from 'node:child_process';
import { createWriteStream, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { baseURL, evidence, fixtureEnvironment, root } from './environment.mjs';
import { sourceDigest } from './receipt.mjs';

const mode = process.argv[2];
if (!['build', 'start'].includes(mode)) throw new Error('Use build or start');
const env = fixtureEnvironment();
const digest = sourceDigest();
mkdirSync(evidence, { recursive: true });
const log = createWriteStream(path.join(evidence, `${mode}.log`));
const args = [path.join(root, 'node_modules/next/dist/bin/next'), mode];
if (mode === 'start') args.push('-H', '127.0.0.1', '-p', new URL(baseURL).port);
const child = spawn(process.execPath, args, { cwd: root, env, windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'] });
for (const [stream, output] of [[child.stdout, process.stdout], [child.stderr, process.stderr]]) {
  stream.on('data', (data) => { log.write(data); output.write(data); });
}
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => child.kill());
child.on('exit', (code) => {
  if (mode === 'build' && code === 0) {
    if (sourceDigest() !== digest) throw new Error('Source changed during build; do not attest this artifact');
    writeFileSync(path.join(evidence, 'build-receipt.json'), JSON.stringify({ sourceDigest: digest, buildId: readFileSync('.next/BUILD_ID', 'utf8').trim(), builtAt: new Date().toISOString(), node: process.version, command: 'node scripts/experience/january/serve.mjs build', environment: 'allowlisted runtime plumbing, local disposable SQLite, synthetic HQ session; no env files or inherited provider configuration' }, null, 2) + '\n');
  }
  log.end(); process.exitCode = code ?? 1;
});
