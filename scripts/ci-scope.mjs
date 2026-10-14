import { execFileSync } from 'node:child_process';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const instructionFiles = new Set(['AGENTS.md', 'CLAUDE.md', '.agents/product-marketing.md']);
const shaPattern = /^[a-f0-9]{40}$/;

/** Unknown ranges and every change outside existing regular instruction files run rendered checks. */
export function classifyScope({ repository, base, head, event }) {
  const full = reason => ({ renderedRequired: true, reason });
  if (!['pull_request', 'push'].includes(event)) return full('manual-or-unknown-event');
  if (!shaPattern.test(base ?? '') || !shaPattern.test(head ?? '') || /^0+$/.test(base) || /^0+$/.test(head)) return full('invalid-range');
  const git = args => execFileSync('git', ['--no-pager', '--no-replace-objects', '-C', repository, ...args], { maxBuffer: 1_000_000, windowsHide: true });
  try {
    git(['cat-file', '-e', `${base}^{commit}`]);
    git(['cat-file', '-e', `${head}^{commit}`]);
    const checkout = git(['rev-parse', '--verify', 'HEAD^{commit}']).toString('utf8').trim();
    if (!shaPattern.test(checkout)) return full('invalid-checkout');
    for (const target of new Set([head, checkout])) {
      const fields = git(['diff', '--no-ext-diff', '--no-textconv', '--no-renames', '--name-status', '-z', base, target]).toString('utf8').split('\0');
      if (fields.pop() !== '' || fields.length === 0 || fields.length % 2) return full('empty-or-unreadable-diff');
      for (let index = 0; index < fields.length; index += 2) {
        const [status, file] = fields.slice(index, index + 2);
        if (status !== 'M' || !instructionFiles.has(file)) return full('non-instruction-change');
        for (const revision of [base, target]) {
          const entry = git(['ls-tree', revision, '--', file]).toString('utf8');
          if (!entry.startsWith('100644 blob ') || !entry.endsWith(`\t${file}\n`)) return full('non-regular-instruction');
          const bytes = git(['show', `${revision}:${file}`]);
          if (bytes.includes(0)) return full('binary-instruction');
          new TextDecoder('utf-8', { fatal: true }).decode(bytes);
        }
      }
    }
    return { renderedRequired: false, reason: 'modified-existing-instructions-only' };
  } catch {
    return full('unavailable-or-invalid-source');
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const args = process.argv.slice(2);
  const read = name => args[args.indexOf(name) + 1];
  const result = classifyScope({ repository: read('--repository'), base: read('--base'), head: read('--head'), event: read('--event') });
  console.log(`rendered_required=${result.renderedRequired}`);
  console.log(`scope_reason=${result.reason}`);
}
