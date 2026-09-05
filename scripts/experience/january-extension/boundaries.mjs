import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {mkdirSync,readFileSync,writeFileSync} from 'node:fs';
import path from 'node:path';
import {chromium} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {baseURL,evidence,fixturePassword} from './environment.mjs';
import {sourceDigest,buildInputsDigest,toolingDigest,fileDigest} from './receipt.mjs';

// Separate expected-404 contract: no waiver of the page-success capture gate.
const build=JSON.parse(readFileSync(path.join(evidence,'build-receipt.json'),'utf8'));
assert.equal(build.sourceDigest,sourceDigest());assert.equal(build.buildInputsDigest,buildInputsDigest());
const runId=`boundaries-${new Date().toISOString().replaceAll(/[:.]/g,'-')}`;
const dir=path.join(evidence,runId);mkdirSync(dir,{recursive:true});
const receipt={runId,sourceDigest:build.sourceDigest,buildId:build.buildId,buildInputsDigest:build.buildInputsDigest,toolingDigest:toolingDigest(),scriptedOnly:true,results:[]};
const persist=()=>writeFileSync(path.join(dir,'manifest.json'),JSON.stringify(receipt,null,2)+'\n');
const browser=await chromium.launch({headless:true});
try {
  for(const route of ['/hq/atlas/__fixture-missing__','/hq/org/__fixture-missing__'])for(const [breakpoint,viewport]of Object.entries(JSON.parse(readFileSync('experience/config.json','utf8')).breakpoints)){
    const context=await browser.newContext({viewport,serviceWorkers:'block',colorScheme:'light'});
    await context.addCookies([{name:'signal_hq_access',value:createHash('sha256').update(`signal-hq-session:v1:${fixturePassword}`).digest('hex'),url:baseURL,httpOnly:true,sameSite:'Lax'}]);
    const row={route,breakpoint,viewport,pass:false,blocked:[],consoleErrors:[],pageErrors:[]};
    await context.route('**/*',r=>{if(new URL(r.request().url()).origin!==baseURL||!['GET','HEAD'].includes(r.request().method())){row.blocked.push(r.request().url());return r.abort();}return r.continue();});
    const page=await context.newPage();
    page.on('console',m=>{if(['error','warning'].includes(m.type()))row.consoleErrors.push(m.text());});
    page.on('pageerror',e=>row.pageErrors.push(e.message));
    try {
      const response=await page.goto(baseURL+route,{waitUntil:'networkidle'});
      row.status=response.status();assert.equal(row.status,404);
      const html=(await response.text()).replaceAll('\\"','"');
      row.servedBuildId=html.match(/"b":"([^"]+)"/)?.[1];assert.equal(row.servedBuildId,build.buildId);
      assert.match(await page.locator('body').innerText(),/404|not found|could not be found/i);
      row.overflowPixels=await page.evaluate(()=>Math.max(0,document.documentElement.scrollWidth-document.documentElement.clientWidth));assert.equal(row.overflowPixels,0);
      const axe=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
      row.violations=axe.violations;assert.equal(axe.violations.filter(v=>['serious','critical'].includes(v.impact)).length,0);
      assert.equal(row.blocked.length,0);assert.equal(row.pageErrors.length,0);
      // Retain Chromium's expected document-404 console message; nothing else.
      assert.ok(row.consoleErrors.every(t=>/^Failed to load resource: the server responded with a status of 404 /.test(t)));
      row.pass=true;
    }catch(error){row.error=String(error);}
    const filename=`${route.includes('/atlas/')?'atlas':'org'}-${breakpoint}.png`;
    await page.screenshot({path:path.join(dir,filename),animations:'disabled'});
    row.screenshot=filename;row.hash=fileDigest(path.join(dir,filename));receipt.results.push(row);persist();
    console.log(`${route} ${breakpoint}: ${row.pass?'PASS':'FAIL'} ${row.error??''}`);await context.close();
  }
}finally{await browser.close();persist();}
if(receipt.results.some(r=>!r.pass))process.exitCode=1;
