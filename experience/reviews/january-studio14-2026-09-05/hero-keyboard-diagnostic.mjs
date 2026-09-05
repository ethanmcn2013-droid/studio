import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdirSync, writeFileSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { baseURL, fixturePassword, evidence } from '../../../scripts/experience/january-extension/environment.mjs';
import { sourceDigest, buildInputsDigest, toolingDigest, fileDigest } from '../../../scripts/experience/january-extension/receipt.mjs';
const build=JSON.parse(readFileSync(path.join(evidence,'build-receipt.json'),'utf8'));
const identity={...build,toolingDigest:toolingDigest()};
if(process.argv.includes('--expect-clear')){
  assert.equal(build.sourceDigest,sourceDigest());assert.equal(build.buildInputsDigest,buildInputsDigest());
  assert.equal(build.buildId,readFileSync('.next/BUILD_ID','utf8').trim());
}
const directory=path.join(evidence,`hero-focus-${new Date().toISOString().replaceAll(/[:.]/g,'-')}`);
mkdirSync(directory,{recursive:true});
const browser=await chromium.launch({headless:true});
const results=[];
try {
  for(const viewport of [{width:390,height:844},{width:768,height:1024},{width:1280,height:900},{width:1440,height:960}]) {
    const context=await browser.newContext({viewport});
    await context.addCookies([{name:'signal_hq_access',value:createHash('sha256').update(`signal-hq-session:v1:${fixturePassword}`).digest('hex'),url:baseURL,httpOnly:true,sameSite:'Lax'}]);
    await context.route('**/*',r=>new URL(r.request().url()).origin===baseURL&&['GET','HEAD'].includes(r.request().method())?r.continue():r.abort('blockedbyclient'));
    const page=await context.newPage();
    const response=await page.goto(`${baseURL}/hq/product-hero-design-motion`,{waitUntil:'networkidle'});
    const servedBuildId=(await response.text()).replaceAll('\\"','"').match(/"b":"([^"]+)"/)?.[1];
    assert.equal(servedBuildId,build.buildId);
    await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(400);
    if(process.argv.includes('--scroll-margin-probe')) await page.addStyleTag({content:'.hero-room-direction { scroll-margin-block-end: 80px; }'});
    const target=page.locator('#hq-content a[href]').first();
    for(let i=0;i<180;i++) {if(await target.evaluate(el=>document.activeElement===el))break;await page.keyboard.press('Tab');}
    const row={viewport,servedBuildId,scrollMarginProbe:process.argv.includes('--scroll-margin-probe'),samples:[],screenshots:[]};
    row.occlusion=await target.evaluate(el=>{
      const banner=document.querySelector('.signal-devbanner'),box=banner?.getBoundingClientRect();
      const walker=document.createTreeWalker(el,NodeFilter.SHOW_TEXT),intersections=[];
      let node;while(node=walker.nextNode()){
        if(!node.textContent.trim())continue;
        const range=document.createRange();range.selectNodeContents(node);
        for(const rect of range.getClientRects())if(box&&rect.left<box.right&&rect.right>box.left&&rect.top<box.bottom&&rect.bottom>box.top){
          const x=(Math.max(rect.left,box.left)+Math.min(rect.right,box.right))/2,y=(Math.max(rect.top,box.top)+Math.min(rect.bottom,box.bottom))/2;
          intersections.push({text:node.textContent,rect:rect.toJSON(),topElement:document.elementFromPoint(x,y)?.className,bannerIsTop:!!document.elementFromPoint(x,y)?.closest('.signal-devbanner')});
        }
      }
      return{banner:box?.toJSON(),intersections};
    });
    for(const delay of [0,100,500,1000]) {
      if(delay)await page.waitForTimeout(delay);
      row.samples.push(await target.evaluate((el,delay)=>({delay,focused:document.activeElement===el,tag:el.tagName,text:el.textContent,rect:el.getBoundingClientRect().toJSON(),scrollY,innerHeight,innerWidth,scrollBehavior:getComputedStyle(document.documentElement).scrollBehavior,outline:getComputedStyle(el).outline}),delay));
      await page.screenshot({path:path.join(directory,`${viewport.width}-${delay}.png`)});
      row.screenshots.push({path:`${viewport.width}-${delay}.png`,hash:fileDigest(path.join(directory,`${viewport.width}-${delay}.png`))});
    }
    results.push(row);await context.close();
  }
} finally {await browser.close();writeFileSync(path.join(directory,'geometry.json'),JSON.stringify({identity,results},null,2)+'\n');}
console.log(JSON.stringify({directory,identity,results},null,2));
if(process.argv.includes('--expect-clear'))for(const row of results){
  assert.equal(row.scrollMarginProbe,false,'Final proof must use compiled source, not injected CSS');
  assert.equal(row.occlusion.intersections.length,0,'Focused row text clears the actual notice');
  for(const sample of row.samples){
    assert.ok(sample.focused&&sample.rect.top>=0&&sample.rect.bottom<=sample.innerHeight&&sample.rect.left>=0&&sample.rect.right<=sample.innerWidth,'Native Tab focus is fully in the viewport');
    assert.ok(sample.outline.includes('solid 2px'),'Native focus outline remains visible');
  }
}
