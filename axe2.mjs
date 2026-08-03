import { chromium } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { createHash } from "node:crypto";
const B="http://127.0.0.1:3462";
const hq=createHash("sha256").update("signal-hq-session:v1:wp13-verify").digest("hex");
const browser=await chromium.launch();
for (const route of ["/venues","/hq/venue-proposal","/venues/privacy"]) {
  const ctx=await browser.newContext({viewport:{width:1280,height:800},locale:"en-GB",timezoneId:"Europe/London",colorScheme:"light",reducedMotion:"reduce"});
  await ctx.addCookies([{name:"signal_hq_access",value:hq,url:B}]);
  const page=await ctx.newPage();
  await page.goto(B+route,{waitUntil:"networkidle"});
  const r=await new AxeBuilder({page}).withTags(["wcag2a","wcag2aa","wcag21a","wcag21aa"]).analyze();
  console.log("=====",route, "violations:", r.violations.length);
  for (const v of r.violations) {
    console.log("  RULE", v.id, v.impact, "nodes:", v.nodes.length);
    for (const n of v.nodes.slice(0,3)) {
      console.log("   target:", JSON.stringify(n.target));
      console.log("   why:", String(n.failureSummary||"").split("\n").join(" | "));
    }
  }
  await ctx.close();
}
await browser.close();
