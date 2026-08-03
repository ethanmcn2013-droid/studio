import { chromium } from "@playwright/test";
const B="http://127.0.0.1:3462";
const browser=await chromium.launch();
for (const opts of [{},{locale:"en-GB",timezoneId:"Europe/London",colorScheme:"light",reducedMotion:"reduce"}]) {
  const ctx=await browser.newContext({viewport:{width:1280,height:800},...opts});
  const page=await ctx.newPage();
  const failed=[];
  page.on("requestfailed",r=>failed.push(r.url().slice(-60)+" "+r.failure()?.errorText));
  page.on("response",r=>{ if(r.url().includes(".css") && r.status()>=400) failed.push("CSS "+r.status()+" "+r.url().slice(-50)); });
  await page.goto(B+"/venues",{waitUntil:"networkidle"});
  const info=await page.evaluate(()=>{
    const h1=document.querySelector("h1");
    const cs=getComputedStyle(h1);
    return {
      sheets: document.styleSheets.length,
      cssLinks: [...document.querySelectorAll('link[rel=stylesheet]')].map(l=>l.href.slice(-40)),
      h1FontSize: cs.fontSize, h1Weight: cs.fontWeight,
      inkQuiet: getComputedStyle(document.documentElement).getPropertyValue("--ink-quiet"),
      bodyClass: document.body.className,
    };
  });
  console.log(JSON.stringify({opts:Object.keys(opts), failed, ...info},null,1));
  await ctx.close();
}
await browser.close();
