import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import AxeBuilder from '@axe-core/playwright';
import { chromium } from '@playwright/test';
import { hashFile, readJson } from '../lib.mjs';
import { sourceDigest, fileDigest, buildInputsDigest, toolingDigest } from './receipt.mjs';
import { baseURL, unconfiguredURL, evidence, fixtureEnvironment, fixturePassword, root } from './environment.mjs';
import { matrix, routeFor, scenarioFor, variantsFor } from './matrix.mjs';
import { prepareBrowserState, proveMaterialState, proveExperimentationGeometry } from './states.mjs';

const pilot = process.argv.includes('--pilot');
const option = name => process.argv.find(arg => arg.startsWith(`--${name}=`))?.slice(name.length + 3);
const config = readJson('experience/config.json'), registry = readJson('experience/registry.json');
const entries = registry.experiences.filter(e => Object.hasOwn(matrix, e.id) && (!option('experience') || option('experience') === e.id));
assert.ok(entries.length, 'No requested extension surface');
const build = readJson(path.join(evidence, 'build-receipt.json'));
assert.equal(build.sourceDigest, sourceDigest(), 'Stale build');
assert.equal(build.buildInputsDigest, buildInputsDigest(), 'Stale build inputs');
assert.equal(build.buildId, readFileSync('.next/BUILD_ID', 'utf8').trim(), 'Wrong Next artifact');
const runId = `${pilot ? 'pilot' : 'capture'}-${new Date().toISOString().replaceAll(/[:.]/g, '-')}`;
const directory = path.join(evidence, runId);
mkdirSync(directory, { recursive: true });
const manifest = {
  schemaVersion: 'signal-experience-capture/1', runId, pilot,
  commit: execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim(),
  buildId: build.buildId, sourceDigest: build.sourceDigest,
  buildInputsDigest: build.buildInputsDigest, toolingDigest: toolingDigest(), node: process.version,
  dirtyFiles: execFileSync('git', ['status', '--short'], {encoding:'utf8'}).trim().split(/\r?\n/),
  runnerHash: fileDigest('scripts/experience/january-extension/capture.mjs'),
  approvedBy: null, review: 'scripted only; no human usability or council acceptance', results: [],
};
const persist = () => writeFileSync(path.join(directory, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
const browser = await chromium.launch({ headless: true, args: ['--disable-extensions'] });
try {
  for (const entry of entries) {
    const states = pilot ? [matrix[entry.id].includes('default') ? 'default' : 'populated'] : matrix[entry.id];
    for (const state of states.filter(s => !option('state') || s === option('state'))) {
      const variants = variantsFor(entry.id,state);
      for (const variant of (pilot ? variants.slice(0,1) : variants).filter(v => !option('variant') || v === option('variant'))) {
      const origin = entry.id === 'studio.page.hq-access' && state === 'disabled' ? unconfiguredURL : baseURL;
      const routePath = routeFor(entry.id,state,entry.route);
      const seeded = spawnSync(process.execPath, ['--import', 'tsx', 'scripts/experience/january-extension/fixture.ts', scenarioFor(state,entry.id,variant)], { cwd: root, env: fixtureEnvironment(), encoding: 'utf8', windowsHide: true });
      assert.equal(seeded.status, 0, seeded.stderr || seeded.stdout);
      const fixture = JSON.parse(seeded.stdout.trim());
      const widths = Object.entries(config.breakpoints).filter(([name]) => (!pilot || ['mobile','desktop'].includes(name)) && (!option('breakpoint') || option('breakpoint') === name));
      // At most two independent contexts share this fixed read fixture. Never
      // reseed a database until both widths finish and close their contexts.
      for(let index=0;index<widths.length;index+=2) await Promise.all(widths.slice(index,index+2).map(async ([breakpoint, viewport]) => {
        const context = await browser.newContext({ viewport, reducedMotion: state === 'reduced-motion' ? 'reduce' : 'no-preference', locale: 'en-GB', timezoneId: 'Europe/Dublin', colorScheme: 'light', serviceWorkers: 'block' });
        if (entry.id !== 'studio.page.hq-access' && state !== 'restricted') await context.addCookies([{ name: 'signal_hq_access', value: createHash('sha256').update(`signal-hq-session:v1:${fixturePassword}`).digest('hex'), url: origin, httpOnly: true, sameSite: 'Lax' }]);
        await prepareBrowserState(context,entry.id,state);
        const blocked = [], failedRequests = [], httpErrors = [], consoleErrors = [], pageErrors = [];
        await context.route('**/*', async r => {
          if (new URL(r.request().url()).origin !== origin || !['GET', 'HEAD'].includes(r.request().method())) {
            blocked.push({ url: r.request().url(), method: r.request().method() }); return r.abort('blockedbyclient');
          }
          await r.continue();
        });
        const page = await context.newPage();
        page.on('response', r => { if (r.status() >= 400) httpErrors.push({ url: r.url(), status: r.status() }); });
        page.on('requestfailed', r => failedRequests.push({ url: r.url(), error: r.failure()?.errorText }));
        page.on('console', m => { if (['error', 'warning'].includes(m.type())) consoleErrors.push({ type: m.type(), text: m.text() }); });
        page.on('pageerror', e => pageErrors.push(e.message));
        const url = origin + routePath;
        const row = { experienceId: entry.id, product: 'studio', state, variant, breakpoint, viewport, url, sourceDigest: build.sourceDigest, buildId: build.buildId, buildInputsDigest: build.buildInputsDigest, toolingDigest: manifest.toolingDigest, materialityHash: hashFile(entry.source.replace(/^studio\//, '')), fixture, interactions: [], additionalScreenshots: [], navigationError: null };
        const shots = path.join(directory, 'screenshots', entry.id, state, variant);
        mkdirSync(shots, { recursive: true });
        const shot = async (suffix,target=page) => {
          const relative = `screenshots/${entry.id}/${state}/${variant}/${breakpoint}${suffix}.png`;
          await target.screenshot({ path: path.join(directory, relative), animations: 'disabled' });
          return { path: `${runId}/${relative}`, hash: fileDigest(path.join(directory, relative)) };
        };
        const tabTo = async target => {
          for (let i = 0; i < 180; i++) {
            if (await target.evaluate(el => el === document.activeElement)) {
              const proof = await target.evaluate(el => { const r = el.getBoundingClientRect(), s = getComputedStyle(el); return { text: el.textContent, tag: el.tagName, href: el.getAttribute('href'), visible: r.width > 0 && r.height > 0 && r.top >= 0 && r.bottom <= innerHeight && r.left >= 0 && r.right <= innerWidth, focus: { outline: s.outlineStyle, shadow: s.boxShadow, border: s.borderColor } }; });
              assert.ok(proof.visible, 'Keyboard target is in the viewport');
              assert.ok(proof.focus.outline !== 'none' || proof.focus.shadow !== 'none' || ['INPUT', 'SELECT', 'TEXTAREA'].includes(proof.tag), 'Focus has a visible indicator');
              row.interactions.push({ keyboard: proof }); return;
            }
            await page.keyboard.press('Tab');
          }
          throw new Error('Required target not reachable by Tab');
        };
        try {
          const response = await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
          row.status = response?.status() ?? null;
          const html = (await response.text()).replaceAll('\\"','"');
          row.servedBuildId = html.match(/"b":"([^"]+)"/)?.[1];
          assert.equal(row.servedBuildId,build.buildId,'Actual HTTP document belongs to this build');
          assert.equal(new URL(page.url()).pathname, state === 'restricted' ? '/hq/access' : new URL(url).pathname);
          await page.evaluate(() => document.fonts.ready); await page.waitForTimeout(400);
          const gate = state === 'restricted' || entry.id === 'studio.page.hq-access';
          await proveMaterialState({page,entry,state,variant,row,fixture,tabTo,shot});
          if (!['long-content','keyboard-only'].includes(state)) await page.evaluate(() => scrollTo(0,0));
          if (state === 'long-content') {
            if (gate) { await page.getByLabel('Password', { exact: true }).fill('synthetic-long-password-'.repeat(12)); row.interactions.push('Real password input retains 288 synthetic characters; no POST'); }
            const sections = await page.locator('#hq-content h2, #hq-content section[aria-label], #hq-content article').all();
            for (const section of sections) await section.scrollIntoViewIfNeeded();
            row.interactions.push({ authoredSectionsScrolled: sections.length, pageTextLength: (await page.locator('main').last().innerText()).length, fixtureScenario: fixture.scenario });
            for (const i of [...new Set([0, Math.floor(sections.length / 2), sections.length - 1])].filter(i => i >= 0 && i < sections.length)) {
              await sections[i].scrollIntoViewIfNeeded(); row.additionalScreenshots.push(await shot(`-section-${i}`));
            }
          }
          if (state === 'keyboard-only') {
            if (gate) { await tabTo(page.getByLabel('Password', { exact: true })); await page.keyboard.type('synthetic-input'); await page.keyboard.press('Tab'); await tabTo(page.getByRole('button', { name: 'Open Signal HQ', exact: true })); row.interactions.push('Keyboard edits password and reaches submit; form not submitted'); }
            else if (!['studio.page.hq-atlas','studio.page.hq-atlas-by-slug','studio.page.hq-entitlements-by-lookup','studio.page.hq-marketing'].includes(entry.id)) {
              const targets = page.locator('#hq-content a[href], #hq-content button:not(:disabled), #hq-content input, #hq-content select, #hq-content [tabindex="0"]');
              if (await targets.count()) await tabTo(targets.first());
              else { await tabTo(page.getByRole('button', { name: 'Search everything', exact: true })); row.interactions.push('Read-only page has no body controls; shared keyboard escape is reachable'); }
            }
          }
          if (entry.id === 'studio.page.hq-experimentation-room') {
            row.interactions.push({descriptionGeometry:await proveExperimentationGeometry(page)});
            if (state === 'long-content') {
              await page.evaluate(() => {document.documentElement.style.zoom='2';});
              row.interactions.push({cssZoomPercent:200,authoredDescriptionGeometry:await proveExperimentationGeometry(page)});
              row.additionalScreenshots.push(await shot('-zoom-200-current-row',page.locator('.experiment-row').first()));
              await page.evaluate(() => {document.documentElement.style.zoom='';});
              // Browser-only stress fixture, explicitly distinct from authored text.
              await page.locator('.experiment-description').first().evaluate(el => {
                el.prepend(document.createTextNode('Synthetic long description for wrapping and zoom. '.repeat(24)));
              });
              row.interactions.push({syntheticDescriptionStress:true,descriptionGeometry:await proveExperimentationGeometry(page)});
              row.additionalScreenshots.push(await shot('-synthetic-long-description'));
              await page.evaluate(() => {document.documentElement.style.zoom='2';scrollTo(0,0);});
              row.interactions.push({cssZoomPercent:200,descriptionGeometry:await proveExperimentationGeometry(page)});
              assert.equal(await page.evaluate(() => Math.max(0,document.documentElement.scrollWidth-document.documentElement.clientWidth)),0,'200% CSS zoom has no document overflow');
              row.additionalScreenshots.push(await shot('-zoom-200'));
              row.additionalScreenshots.push(await shot('-zoom-200-stress-row',page.locator('.experiment-row').first()));
              await page.evaluate(() => {document.documentElement.style.zoom='';});
            }
          }
          row.materialStateProved = true;
          if (!row.interactions.length) row.interactions.push({authoredRoute:new URL(url).pathname});
          if (state === 'reduced-motion') {
            assert.equal(await page.evaluate(() => matchMedia('(prefers-reduced-motion: reduce)').matches), true);
            assert.equal(await page.evaluate(() => document.getAnimations().filter(a => a.playState === 'running').length), 0);
            row.interactions.push('Reduced motion active; no continuing document animations');
          }
        } catch (error) { row.navigationError = String(error); }
        // Collect real accessibility/runtime/screenshot evidence even on failure.
        try {
          const axe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
          row.accessibility = { violations: axe.violations.length, blocking: axe.violations.filter(v => ['serious', 'critical'].includes(v.impact)).length, details: axe.violations.map(v => ({ id: v.id, impact: v.impact, help: v.help, nodes: v.nodes.map(n => ({ target: n.target, failureSummary: n.failureSummary })) })), incomplete: axe.incomplete.map(v => ({ id: v.id, targets: v.nodes.map(n => n.target) })) };
          row.runtime = await page.evaluate(() => ({ overflowPixels: Math.max(0, document.documentElement.scrollWidth - document.documentElement.clientWidth), heading: document.querySelector('h1')?.textContent ?? null, pageHeight: document.documentElement.scrollHeight, reducedMotion: matchMedia('(prefers-reduced-motion: reduce)').matches }));
          const capture = await shot(''); row.candidateScreenshot = capture.path; row.candidateHash = capture.hash;
        } catch (error) { row.navigationError = `${row.navigationError ?? ''} Evidence error: ${error}`; }
        row.finalUrl = page.url();
        row.runtime = { ...row.runtime, consoleErrors, pageErrors, failedRequests, httpErrors, blocked };
        const failedAssets = failedRequests.filter(r => r.error !== 'net::ERR_ABORTED' || new URL(r.url).origin !== origin || !new URL(r.url).searchParams.has('_rsc'));
        row.pass = !row.navigationError && row.status >= 200 && row.status < 300 && row.accessibility?.blocking === 0 && row.runtime.overflowPixels === 0 && ![consoleErrors, pageErrors, blocked, httpErrors, failedAssets].some(a => a.length);
        manifest.results.push(row); persist();
        console.log(`${entry.id} ${state}/${variant} ${breakpoint}: ${row.pass ? 'PASS' : 'FAIL'} axe=${row.accessibility?.blocking} overflow=${row.runtime.overflowPixels} console=${consoleErrors.length} ${row.navigationError ?? ''}`);
        await context.close();
      }));
    }
    }
  }
} finally {
  await browser.close();
  manifest.finishedSourceDigest=sourceDigest();manifest.finishedToolingDigest=toolingDigest();manifest.finishedBuildInputsDigest=buildInputsDigest();
  manifest.inputsUnchanged=manifest.finishedSourceDigest===manifest.sourceDigest && manifest.finishedToolingDigest===manifest.toolingDigest && manifest.finishedBuildInputsDigest===manifest.buildInputsDigest;
  persist();
}
if(!manifest.inputsUnchanged)process.exitCode=1;
if (manifest.results.some(row => !row.pass)) process.exitCode = 1;
assert.ok(manifest.results.length,'No matching capture cases');
console.log(`Manifest: ${path.relative(root, path.join(directory, 'manifest.json'))}`);
