import { chromium } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { createHash } from "node:crypto";
const BASE="http://127.0.0.1:3462";
const hqToken=createHash("sha256").update("signal-hq-session:v1:wp13-verify").digest("hex");
const browser=await chromium.launch();
for (const [route,bp] of [["/venues",{width:1280,height:800}],["/hq/venue-proposal",{width:1280,height:800}],["/v/Tzzzzzzzzzzzzzzzzzzzzzz1",{width:375,height:812}]]) {
  const ctx=await browser.newContext({viewport:bp,colorScheme:"light"});
  await ctx.addCookies([{name:"signal_hq_access",value:hqToken,url:BASE}]);
  const page=await ctx.newPage();
  await page.goto(BASE+route,{waitUntil:"networkidle"});
  const r=await new AxeBuilder({page}).withTags(["wcag2a","wcag2aa","wcag21a","wcag21aa"]).analyze();
  console.log("=====",route,bp.width);
  for(const v of r.violations){
    console.log(" ",v.id,v.impact,v.nodes.length);
    for(const n of v.nodes.slice(0,6)) console.log("    ",JSON.stringify(n.target), "|", (n.failureSummary||"").replace(/\n/g," ").slice(0,220));
  }
  await ctx.close();
}
await browser.close();
