import {createHash} from 'node:crypto';
import {mkdirSync,readFileSync,writeFileSync} from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {chromium} from '@playwright/test';
import {baseURL,evidence,fixturePassword} from './environment.mjs';
import {sourceDigest,buildInputsDigest,toolingDigest,fileDigest} from './receipt.mjs';

const build=JSON.parse(readFileSync(path.join(evidence,'build-receipt.json'),'utf8'));
assert.equal(build.sourceDigest,sourceDigest());assert.equal(build.buildInputsDigest,buildInputsDigest());
const runId=`chrome-${new Date().toISOString().replaceAll(/[:.]/g,'-')}`,dir=path.join(evidence,runId);
mkdirSync(dir,{recursive:true});
const receipt={runId,...build,toolingDigest:toolingDigest(),nativeZoomVerified:false,results:[]};
const browser=await chromium.launch({headless:true});
try{for(const width of [320,390,640,1280])for(const route of ['/hq/experimentation-room','/hq/product-hero-design-motion']){
  const context=await browser.newContext({viewport:{width,height:900},reducedMotion:'reduce',serviceWorkers:'block'});
  await context.addCookies([{name:'signal_hq_access',value:createHash('sha256').update(`signal-hq-session:v1:${fixturePassword}`).digest('hex'),url:baseURL,httpOnly:true,sameSite:'Lax'}]);
  const blocked=[];await context.route('**/*',r=>{if(new URL(r.request().url()).origin!==baseURL||!['GET','HEAD'].includes(r.request().method())){blocked.push(r.request().url());return r.abort();}return r.continue();});
  const page=await context.newPage();await page.goto(baseURL+route,{waitUntil:'networkidle'});await page.evaluate(()=>document.fonts.ready);
  const geometry=await page.evaluate(()=>({overflow:Math.max(0,document.documentElement.scrollWidth-document.documentElement.clientWidth),items:[...document.querySelectorAll('.hqx-crumb-group,.hqx-crumb-page,.signal-devbanner__text')].map(el=>{
    const b=el.getBoundingClientRect(),range=document.createRange();range.selectNodeContents(el);const rects=[...range.getClientRects()];
    return{selector:'.'+el.className,text:el.textContent,width:b.width,height:b.height,clipped:rects.some(r=>r.left<b.left-1||r.right>b.right+1||r.top<b.top-1||r.bottom>b.bottom+1),outsideViewport:b.left<0||b.right>innerWidth};
  })}));
  const name=`${route.split('/').at(-1)}-${width}.png`;await page.screenshot({path:path.join(dir,name),animations:'disabled'});
  const row={width,route,effectiveCssWidth:width,zoom:'none; 640 CSS px is the reflow equivalent of 1280 desktop at200%',...geometry,blocked,screenshot:name,hash:fileDigest(path.join(dir,name))};
  row.keyboard=[];
  for(const label of [...(width<=860?['Open navigation']:[]),'Search everything','Hide development notice']){
    const target=page.getByRole('button',{name:label,exact:true});let reached=false;
    for(let i=0;i<220;i++){await page.keyboard.press('Tab');if(await target.evaluate(el=>el===document.activeElement)){reached=true;break;}}
    assert.ok(reached,`${label} reachable by keyboard`);
    const focus=await target.evaluate(el=>{const r=el.getBoundingClientRect(),s=getComputedStyle(el);return{visible:r.left>=0&&r.right<=innerWidth&&r.top>=0&&r.bottom<=innerHeight,outline:s.outlineStyle,shadow:s.boxShadow};});
    assert.ok(focus.visible&&(focus.outline!=='none'||focus.shadow!=='none'));row.keyboard.push({label,...focus});
  }
  await page.keyboard.press('Enter');assert.equal(await page.locator('.signal-devbanner').count(),0);
  assert.equal(await page.evaluate(()=>sessionStorage.getItem('signal_devbanner_dismissed')),'1');row.noticeDismissedLocally=true;
  row.pass=geometry.overflow===0&&blocked.length===0&&geometry.items.every(x=>!x.clipped&&!x.outsideViewport);
  receipt.results.push(row);console.log(`${route} ${width}: ${row.pass?'PASS':'FAIL'} ${JSON.stringify(geometry.items.filter(x=>x.clipped||x.outsideViewport))}`);
  writeFileSync(path.join(dir,'manifest.json'),JSON.stringify(receipt,null,2)+'\n');await context.close();
}}finally{await browser.close();}
if(receipt.results.some(r=>!r.pass))process.exitCode=1;
