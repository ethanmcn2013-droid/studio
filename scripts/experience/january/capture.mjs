import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { spawnSync, execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import AxeBuilder from '@axe-core/playwright';
import { chromium } from '@playwright/test';
import { captureRunFailures } from '../capture-approval.mjs';
import { hashFile, readJson } from '../lib.mjs';
import { baseURL, evidence, fixtureEnvironment, fixturePassword, root } from './environment.mjs';
import { matrix, scenarioFor } from './matrix.mjs';
import { sourceDigest } from './receipt.mjs';

const pilot = process.argv.includes('--pilot');
const config = readJson(path.join(root, 'experience/config.json'));
const registry = readJson(path.join(root, 'experience/registry.json'));
const ids = ['hq', 'hq-blueprint', 'hq-entitlements', 'hq-financial-model', 'hq-founders-circle', 'hq-reporting', 'students'];
const entries = ids.map(id => registry.experiences.find(e => e.id === `studio.page.${id}`));
entries.push({ ...registry.experiences.find(e => e.id === 'studio.surface.hq-shell-navigation'), route: '/hq' });
const selectedId = process.argv.find(arg => arg.startsWith('--experience='))?.slice('--experience='.length);
const selectedState = process.argv.find(arg => arg.startsWith('--state='))?.slice('--state='.length);
const selectedWidth = process.argv.find(arg => arg.startsWith('--breakpoint='))?.slice('--breakpoint='.length);
const atlas = process.argv.includes('--atlas');
const selected = atlas ? [{ ...registry.experiences.find(e => e.source === 'studio/src/app/hq/atlas/[slug]/page.tsx'), route: '/hq/atlas/brand-enforcement' }] : entries.filter(e => !selectedId || e.id === selectedId);
const runName = atlas ? 'atlas' : pilot ? 'pilot' : 'capture';
const manifestFile = path.join(evidence, `${runName}-manifest.json`);
const build = readJson(path.join(evidence, 'build-receipt.json'));
assert.equal(build.sourceDigest, sourceDigest(), 'Build must match current source');
assert.equal(build.buildId, readFileSync('.next/BUILD_ID', 'utf8').trim(), 'Build receipt must match Next artifact');
const results = existsSync(manifestFile) ? readJson(manifestFile).results.filter(row => row.sourceDigest === build.sourceDigest && !selected.some(entry => entry.id === row.experienceId && (!selectedState || row.state === selectedState) && (!selectedWidth || row.breakpoint === selectedWidth))) : [];
mkdirSync(evidence, { recursive: true });
const seed = (scenario) => {
  const result = spawnSync(process.execPath, ['--import', 'tsx', 'scripts/experience/january/fixture.ts', scenario], { cwd: root, env: fixtureEnvironment(), encoding: 'utf8', windowsHide: true });
  assert.equal(result.status, 0, result.stderr || result.stdout);
  return JSON.parse(result.stdout.trim());
};
seed('populated');
const browser = await chromium.launch({ headless: true, args: ['--disable-extensions'] });
const commit = execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
const persist = () => writeFileSync(path.join(evidence, `${runName}-manifest.json`), `${JSON.stringify({ schemaVersion: 'signal-experience-capture/1', capturedAt: new Date().toISOString(), commit, buildId: readFileSync('.next/BUILD_ID', 'utf8').trim(), approvedBy: null, review: 'scripted only; human usability and council not performed', results }, null, 2)}\n`);
try {
  for (const entry of selected) {
    for (const state of (pilot || atlas ? ['default'] : matrix[entry.id]).filter(s => !selectedState || s === selectedState)) {
      const scenario = scenarioFor(state);
      const fixture = seed(scenario);
      const widths = Object.entries(config.breakpoints);
      // Two independent browser contexts read the same immutable scenario.
      // Await both before changing the disposable databases for the next state.
      for (let offset = 0; offset < widths.length; offset += 2) {
      await Promise.all(widths.slice(offset, offset + 2).map(async ([breakpoint, viewport]) => {
        if (selectedWidth && breakpoint !== selectedWidth) return;
        if (pilot && !['mobile', 'desktop'].includes(breakpoint)) return;
        const context = await browser.newContext({ viewport, hasTouch: atlas && viewport.width === 390, locale: 'en-GB', timezoneId: 'Europe/Dublin', colorScheme: 'light', reducedMotion: state === 'reduced-motion' ? 'reduce' : 'no-preference', serviceWorkers: 'block' });
        // Explicit synthetic session exercises the production guard, but is not
        // a login/password acceptance claim. Restricted cases omit the cookie.
        if (entry.route.startsWith('/hq') && state !== 'restricted') {
          await context.addCookies([{ name: 'signal_hq_access', value: createHash('sha256').update(`signal-hq-session:v1:${fixturePassword}`).digest('hex'), url: baseURL, httpOnly: true, sameSite: 'Lax' }]);
        }
        const blocked = [];
        await context.route('**/*', async route => {
          const request = route.request();
          const url = new URL(request.url());
          if (url.origin !== baseURL || !['GET', 'HEAD'].includes(request.method())) {
            blocked.push({ url: request.url(), method: request.method() });
            return route.abort('blockedbyclient');
          }
          await route.continue();
        });
        const page = await context.newPage();
        const consoleErrors = [], pageErrors = [], failedRequests = [], httpErrors = [];
        page.on('response', response => { if (response.status() >= 400) httpErrors.push({ url: response.url(), status: response.status() }); });
        page.on('console', message => { if (['error', 'warning'].includes(message.type())) consoleErrors.push({ type: message.type(), text: message.text() }); });
        page.on('pageerror', error => pageErrors.push(error.message));
        page.on('requestfailed', request => failedRequests.push({ url: request.url(), error: request.failure()?.errorText }));
        let response, navigationError = null, accessibility = null, runtime = null, candidateScreenshot = null;
        const interactions = [], additionalScreenshots = [];
        try {
          const query = entry.route === '/hq/entitlements' && state === 'long-content' ? '?tab=venues' : '';
          response = await page.goto(`${baseURL}${entry.route}${query}`, { waitUntil: 'networkidle', timeout: 60000 });
          const expectedPath = state === 'restricted' ? '/hq/access' : entry.route;
          assert.equal(new URL(page.url()).pathname, expectedPath);
          await page.evaluate(() => document.fonts.ready);
          await page.waitForTimeout(600);
          if (state === 'restricted') {
            assert.equal(await page.getByLabel('Password', { exact: true }).count(), 1);
            assert.equal(await page.locator('#hq-content').count(), 0, 'Restricted route must not expose HQ content');
            interactions.push('Production guard redirected to password gate; no HQ content');
          } else {
            assert.ok(await page.locator('h1').count(), 'Real route heading must render');
          }
          if (atlas) {
            await page.locator('.atlas-mermaid[data-rendered="true"] svg').first().waitFor({ state: 'visible' });
            assert.equal(await page.locator('.atlas-mermaid[data-render-error]').count(), 0);
            assert.equal(await page.locator('.atlas-mermaid-fallback').count(), 0);
            const labels = await page.locator('.atlas-mermaid svg .nodeLabel').allTextContents();
            assert.deepEqual(labels.map(label => label.trim()).sort(), [
              'cycle opens — copy work', 'read BRAND.md §', 'draft against rules',
              'catch-net second read', 'stage + commit', 'fix in place',
            ].sort(), 'SVG labels must faithfully match the actual authored Mermaid nodes');
            const invalidLists = await page.locator('.atlas-prose ul, .atlas-prose ol').evaluateAll(lists => lists.flatMap(list => Array.from(list.children).filter(child => child.tagName !== 'LI').map(child => child.outerHTML)));
            assert.deepEqual(invalidLists, [], 'Every rendered list has only list-item children');
            assert.ok(await page.locator('.atlas-prose li > ul').count(), 'Authored nested sections retain their list hierarchy');
            await page.locator('.atlas-mermaid').first().scrollIntoViewIfNeeded();
            interactions.push(`Actual checked-in Atlas Mermaid labels matched exactly: ${JSON.stringify(labels)}`, 'Real nested list hierarchy; no non-LI direct children', 'SVG rendered without fallback/error');
          }
          if (entry.route.startsWith('/hq') && state !== 'restricted' && !atlas) {
            assert.equal(await page.locator('form[action="/hq/logout"][method="post"] button').count(), 1);
            assert.equal(await page.locator('a[href="/hq/logout"]').count(), 0);
            if (['/hq', '/hq/reporting', '/hq/founders-circle', '/hq/financial-model'].includes(entry.route)) {
              const content = await page.locator('#hq-content').innerText();
              assert.ok(fixture.expectedCash === null ? /unread|unavailable/i.test(content) : content.includes(fixture.expectedCash === 0 ? '€0' : '€2,500'), 'Production renderer must show verified cash or explicit unread state');
              interactions.push(`Server-rendered payment evidence: ${fixture.expectedCash ?? 'unread'}`);
            }
          }
          const tabTo = async (locator) => {
            for (let index = 0; index < 180; index++) {
              await page.keyboard.press('Tab');
              if (await locator.evaluate(el => el === document.activeElement)) {
                const focus = await locator.evaluate(el => { const r = el.getBoundingClientRect(); const s = getComputedStyle(el); return { visible: r.width > 0 && r.height > 0 && r.bottom > 0 && r.top < innerHeight && r.right > 0 && r.left < innerWidth, outline: s.outlineStyle, shadow: s.boxShadow }; });
                assert.equal(focus.visible, true, 'Keyboard focus must be visible');
                assert.ok(focus.outline !== 'none' || focus.shadow !== 'none', 'Keyboard focus must have a visible indicator');
                return;
              }
            }
            throw new Error('Keyboard target not reachable in 180 Tab presses');
          };
          if (atlas) {
            const diagram = page.getByRole('region', { name: 'Diagram', exact: true }).first();
            const geometry = await diagram.evaluate(el => {
              const svg = el.querySelector('svg');
              const label = svg.querySelector('.nodeLabel');
              const bounds = svg.getBoundingClientRect();
              return { containerWidth: el.clientWidth, contentWidth: el.scrollWidth, renderedLabelPx: parseFloat(getComputedStyle(label).fontSize) * bounds.width / svg.viewBox.baseVal.width };
            });
            assert.ok(geometry.renderedLabelPx >= 13.9, 'Diagram labels must not shrink below their authored 14px size');
            assert.ok(geometry.contentWidth > geometry.containerWidth, 'This wide authored diagram should scroll inside its region');
            await tabTo(diagram);
            const before = await diagram.evaluate(el => el.scrollLeft);
            await page.keyboard.press('ArrowRight');
            await page.waitForTimeout(250);
            assert.ok(await diagram.evaluate(el => el.scrollLeft) > before, 'ArrowRight must move the focused native scroll region');
            interactions.push(`Readable native diagram geometry: ${JSON.stringify(geometry)}`, 'Tab reaches the labelled region with visible focus; ArrowRight scrolls horizontally');
            if (viewport.width === 390) {
              const box = await diagram.boundingBox();
              const touchBefore = await diagram.evaluate(el => el.scrollLeft);
              const cdp = await context.newCDPSession(page);
              const x = box.x + box.width * 0.8, y = box.y + Math.min(box.height / 2, 120);
              await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y }] });
              for (let step = 1; step <= 9; step++) {
                await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: x - step * 20, y }] });
                await page.waitForTimeout(30);
              }
              await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
              await page.waitForTimeout(250);
              const touchAfter = await diagram.evaluate(el => el.scrollLeft);
              interactions.push(`Touch gesture geometry: ${JSON.stringify({ box, touchBefore, touchAfter })}`);
              assert.ok(touchAfter > touchBefore, 'A native touch swipe must scroll the contained diagram');
              await cdp.detach();
              interactions.push('Native Chromium touch swipe scrolls the diagram without page overflow');
            }
          }
          if (entry.route === '/hq/blueprint' && state !== 'restricted') {
            const camera = page.getByRole('group', { name: 'Zoom controls' });
            const clear = await camera.evaluate(el => {
              const box = el.getBoundingClientRect();
              const notice = document.querySelector('.signal-devbanner')?.getBoundingClientRect();
              return { noticeVisible: Boolean(notice), overlapsNotice: Boolean(notice && box.left < notice.right && box.right > notice.left && box.top < notice.bottom && box.bottom > notice.top), buttonsReachable: [...el.querySelectorAll('button')].every(button => { const r = button.getBoundingClientRect(); return button.contains(document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2)); }) };
            });
            assert.equal(clear.noticeVisible, true, 'Notice must remain visible during the camera check');
            assert.equal(clear.overlapsNotice, false, 'Preview notice must not overlap the camera');
            assert.equal(clear.buttonsReachable, true, 'Every camera button must receive pointer input');
            interactions.push('Preview notice stays visible; all camera buttons are unobstructed');
          }
          if (entry.route === '/hq/entitlements') {
            const expiry = page.getByRole('spinbutton', { name: 'Expires in (days)' });
            const fits = await expiry.evaluate(input => {
              const r = input.getBoundingClientRect(), label = input.closest('label').getBoundingClientRect(), form = input.closest('form').getBoundingClientRect();
              return { inputWidth: r.width, columnWidth: label.width, fitsColumn: r.left >= label.left - 1 && r.right <= label.right + 1, fitsForm: r.left >= form.left && r.right <= form.right };
            });
            assert.equal(fits.fitsColumn, true, 'Expiry input must fit its own grid column');
            assert.equal(fits.fitsForm, true, 'Expiry input must fit inside the form');
            interactions.push(`Expiry field geometry: ${JSON.stringify(fits)}`);
          }
          if (entry.id === 'studio.surface.hq-shell-navigation') {
            const open = page.getByRole('button', { name: 'Open navigation', exact: true });
            if (await open.isVisible()) {
              if (state === 'keyboard-only') { await tabTo(open); await page.keyboard.press('Enter'); }
              else await open.click();
              assert.equal(await page.locator('.hqx-rail').getAttribute('data-open'), 'true');
            }
            const navigation = page.getByRole('navigation', { name: 'Signal HQ navigation' });
            assert.equal(await navigation.isVisible(), true);
            const access = navigation.getByRole('link', { name: 'Access', exact: true });
            if (state === 'keyboard-only') await tabTo(access);
            if (state === 'long-content') await access.scrollIntoViewIfNeeded();
            interactions.push('Real HQ navigation visible; final Access room reachable in long navigation');
          }
          if (state === 'keyboard-only' && entry.id !== 'studio.surface.hq-shell-navigation') {
            if (entry.route === '/students') {
              const disclosure = page.getByRole('button', { name: /committee/i });
              await tabTo(disclosure);
              await page.keyboard.press('Enter');
              assert.equal(await disclosure.getAttribute('aria-expanded'), 'true');
              await page.keyboard.press('Space');
              assert.equal(await disclosure.getAttribute('aria-expanded'), 'false');
              await page.keyboard.press('Enter');
              interactions.push('Tab to committee disclosure; Enter opens; Space closes; Enter reopens');
            } else if (entry.route === '/hq/blueprint') {
              await tabTo(page.getByRole('button', { name: 'Zoom in', exact: true }));
              await page.keyboard.press('Enter');
              assert.equal(await page.getByRole('button', { name: 'Reset zoom' }).innerText(), '110%');
              await page.keyboard.press('0');
              assert.equal(await page.getByRole('button', { name: 'Reset zoom' }).innerText(), '100%');
              interactions.push('Tab + Enter zoom in; keyboard 0 restores camera');
            } else if (entry.route === '/hq/entitlements') {
              const expiry = page.getByRole('spinbutton', { name: 'Expires in (days)' });
              await tabTo(expiry);
              await page.keyboard.press('ArrowUp');
              assert.equal(await expiry.inputValue(), '366');
              await page.keyboard.press('ArrowDown');
              assert.equal(await expiry.inputValue(), '365');
              interactions.push('Keyboard reaches the expiry field and changes its native number value; no form submission');
              await tabTo(page.getByRole('link', { name: 'Roster', exact: true }));
              await page.keyboard.press('Enter');
              await page.waitForURL('**/hq/entitlements?tab=roster');
              assert.ok(await page.getByRole('heading', { name: /Roster \(3\)/ }).count());
              interactions.push('Keyboard activates Roster GET tab and renders synthetic records');
            } else if (entry.route === '/hq/financial-model') {
              const table = page.getByRole('region', { name: 'Monthly projection table' });
              await tabTo(table);
              const before = await table.evaluate(el => el.scrollLeft);
              await page.keyboard.press('ArrowRight');
              await page.waitForTimeout(180);
              if (viewport.width === 390) assert.ok(await table.evaluate(el => el.scrollLeft) > before);
              interactions.push('Table is keyboard reachable; ArrowRight scrolls when overflowing');
            } else {
              const target = page.locator('#hq-content a[href="/hq/financial-model"], #hq-content a[href="/hq/reporting"]').first();
              await tabTo(target);
              interactions.push(`Keyboard reaches source link ${await target.getAttribute('href')} with visible focus`);
            }
          }
          if (state === 'disabled') {
            const button = page.getByRole('button', { name: 'Zoom out', exact: true });
            for (let index = 0; index < 5; index++) await button.click();
            assert.equal(await button.isDisabled(), true);
            assert.equal(await page.getByRole('button', { name: 'Reset zoom' }).innerText(), '50%');
            interactions.push('Real minimum camera zoom disables Zoom out');
          }
          if (state === 'reduced-motion') {
            assert.equal(await page.evaluate(() => matchMedia('(prefers-reduced-motion: reduce)').matches), true);
            const animations = await page.evaluate(() => document.getAnimations().filter(a => a.playState === 'running').map(a => ({ duration: a.effect?.getTiming().duration, iterations: a.effect?.getTiming().iterations })));
            assert.equal(animations.length, 0, 'No continuing animation with reduced motion');
            interactions.push('Browser reduced-motion preference active; no running animations');
          }
          // Long-content proof uses the actual authored page, with every reveal
          // scrolled into view. No injected prose or substitute screenshots.
          if (state === 'long-content' && entry.id !== 'studio.surface.hq-shell-navigation') {
            for (const heading of await page.locator('h2, section[aria-label]').all()) await heading.scrollIntoViewIfNeeded();
            if (entry.route === '/students') {
              const disclosure = page.getByRole('button', { name: /committee/i });
              await disclosure.click();
              assert.equal(await disclosure.getAttribute('aria-expanded'), 'true');
            }
            interactions.push('Scrolled every actual heading or labelled section into view; authored long content retained');
          }
          const axe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
          accessibility = { violations: axe.violations.length, blocking: axe.violations.filter(v => ['serious', 'critical'].includes(v.impact)).length, details: axe.violations.map(v => ({ id: v.id, impact: v.impact, help: v.help, nodes: v.nodes.map(n => ({ target: n.target, failureSummary: n.failureSummary })) })), incomplete: axe.incomplete.map(v => ({ id: v.id, targets: v.nodes.map(n => n.target) })) };
          runtime = await page.evaluate(() => ({ overflowPixels: Math.max(0, document.documentElement.scrollWidth - document.documentElement.clientWidth), heading: document.querySelector('h1')?.textContent, pageHeight: document.documentElement.scrollHeight, reducedMotion: matchMedia('(prefers-reduced-motion: reduce)').matches }));
          const filename = `${entry.id}/${state}/${breakpoint}.png`;
          candidateScreenshot = `screenshots/${filename}`;
          mkdirSync(path.join(evidence, 'screenshots', entry.id, state), { recursive: true });
          await page.screenshot({ path: path.join(evidence, candidateScreenshot), fullPage: false, animations: 'disabled' });
          if (state === 'long-content' && entry.id !== 'studio.surface.hq-shell-navigation') {
            const headings = await page.locator('h2, section[aria-label]').all();
            assert.ok(headings.length, 'Long content needs actual sections to inspect');
            for (const index of [...new Set([0, Math.floor(headings.length / 2), headings.length - 1])]) {
              await headings[index].scrollIntoViewIfNeeded();
              const relative = `screenshots/${entry.id}/${state}/${breakpoint}-section-${index}.png`;
              await page.screenshot({ path: path.join(evidence, relative), animations: 'disabled' });
              additionalScreenshots.push({ path: relative, hash: createHash('sha256').update(readFileSync(path.join(evidence, relative))).digest('hex'), heading: await headings[index].getAttribute('aria-label') ?? await headings[index].innerText() });
            }
          }
        } catch (error) { navigationError = String(error); }
        const result = { experienceId: entry.id, product: 'studio', state, breakpoint, viewport, url: `${baseURL}${entry.route}`, finalUrl: page.url(), status: response?.status() ?? null, materialityHash: hashFile(entry.source.replace(/^studio\//, '')), fixture, navigationError, candidateScreenshot, candidateHash: candidateScreenshot ? createHash('sha256').update(readFileSync(path.join(evidence, candidateScreenshot))).digest('hex') : null, accessibility, runtime: { ...runtime, consoleErrors, pageErrors, failedRequests, httpErrors, blocked }, pass: !navigationError && response?.ok() && accessibility?.blocking === 0 && runtime?.overflowPixels === 0 && pageErrors.length === 0 && consoleErrors.length === 0 && blocked.length === 0 && httpErrors.length === 0 };
        result.interactions = interactions;
        result.additionalScreenshots = additionalScreenshots;
        result.sourceDigest = build.sourceDigest;
        results.push(result);
        persist();
        console.log(`${entry.id} ${state} ${breakpoint}: ${result.pass ? 'pass' : 'review'} ${navigationError ?? ''} axe=${accessibility?.blocking} overflow=${runtime?.overflowPixels} console=${consoleErrors.length}`);
        await context.close();
      }));
      }
    }
  }
} finally { await browser.close(); persist(); }
const failures = captureRunFailures(results);
if (failures.length) { console.error(failures.join('\n')); process.exitCode = 1; }
