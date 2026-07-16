import test from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import path from "node:path";
import { DIRECTION_IDS } from "./directions";
import { TEMPLATES } from "./registry";
import { blockImages, forceDark, renderEmail } from "./render";

/**
 * The email system's validation harness. Every template renders in every
 * direction with every fixture; each render is checked for the contract
 * the founder was promised: production-safe HTML, a plain-text twin,
 * accessible imagery, and copy that obeys the brand's absolutes.
 */

const BANNED_FRAGMENTS = [
  "—", // em dash · banned everywhere in front-facing copy
  "seamless",
  "world-class",
  "supercharge",
  "unlock",
  "revolution",
  "game-changing",
  "we're thrilled",
  "thrilled",
  "oops",
  "AI-powered",
  "cutting-edge",
  "best-in-class",
];

test("registry holds exactly the seventeen prototype templates with unique ids", () => {
  assert.equal(TEMPLATES.length, 17);
  const ids = TEMPLATES.map((t) => t.id);
  assert.equal(new Set(ids).size, ids.length);
  for (const t of TEMPLATES) {
    assert.ok(t.fixtures.default, `${t.id} needs a default fixture`);
    const file = path.resolve(process.cwd(), t.sourceFile);
    assert.ok(existsSync(file), `${t.id} sourceFile missing: ${t.sourceFile}`);
  }
});

test("all templates render in all directions with all fixtures", async () => {
  let renders = 0;
  for (const t of TEMPLATES) {
    for (const directionId of DIRECTION_IDS) {
      for (const fixtureId of Object.keys(t.fixtures)) {
        const r = await renderEmail(t.id, directionId, fixtureId);
        renders += 1;

        // Production-safe HTML.
        assert.ok(r.html.length > 2000, `${t.id}/${directionId} html too small`);
        assert.match(r.html, /<!DOCTYPE html/i);
        assert.ok(!/<script\b/i.test(r.html), `${t.id}/${directionId} contains a script tag`);
        assert.ok(!/position:\s*absolute/i.test(r.html), `${t.id}/${directionId} uses absolute positioning`);

        // Subject and hidden preheader.
        // The long-subject edge fixture deliberately stretches to ~130.
        assert.ok(r.subject.length > 4 && r.subject.length < 150, `${t.id} subject length`);
        assert.ok(r.preheader.length > 10, `${t.id} preheader`);
        assert.ok(!r.subject.includes("undefined"), `${t.id} subject has undefined`);
        assert.ok(!r.html.includes("undefined<"), `${t.id}/${directionId} leaked undefined`);

        // The plain-text twin carries the message.
        assert.ok(r.text.length > 120, `${t.id}/${directionId} plain text too small`);
        assert.ok(!r.text.includes("<"), `${t.id} plain text contains markup`);

        // Voice absolutes hold in what recipients read.
        const readable = `${r.subject}\n${r.preheader}\n${r.text}`;
        for (const banned of BANNED_FRAGMENTS) {
          assert.ok(
            !readable.toLowerCase().includes(banned.toLowerCase()),
            `${t.id}/${directionId}/${fixtureId} contains banned fragment: ${banned}`,
          );
        }
        assert.ok(!/!(?!\S)/.test(r.text), `${t.id}/${directionId} exclamation mark in copy`);

        // Every image needs real alt text and explicit dimensions.
        const imgs = r.html.match(/<img\b[^>]*>/gi) ?? [];
        for (const img of imgs) {
          assert.match(img, /alt="[^"]{10,}"/, `${t.id}/${directionId} image without alt: ${img.slice(0, 80)}`);
          assert.match(img, /width="\d+"/, `${t.id}/${directionId} image without width`);
          assert.match(img, /height="\d+"/, `${t.id}/${directionId} image without height`);
        }
      }
    }
  }
  // 17 templates × 3 directions with every fixture: at least the 51 canonical renders.
  assert.ok(renders >= 51, `expected at least 51 renders, got ${renders}`);
});

test("utility templates carry exact facts outside prose", async () => {
  const r = await renderEmail("billing.payment-failed", "hairline", "default");
  for (const fact of ["€12.00", "Visa ending 4921", "18 July 2026"]) {
    assert.ok(r.text.includes(fact), `plain text missing ${fact}`);
    assert.ok(r.html.includes(fact), `html missing ${fact}`);
  }
  const del = await renderEmail("account.deletion-scheduled", "broadsheet", "default");
  for (const fact of ["Saturday 15 August 2026", "90 days"]) {
    assert.ok(del.text.includes(fact), `deletion missing ${fact}`);
  }
});

test("the sign-in code survives plain text and never becomes an image", async () => {
  for (const directionId of DIRECTION_IDS) {
    const r = await renderEmail("auth.sign-in-code", directionId, "default");
    assert.ok(r.text.includes("482 916"), `${directionId} plain text lost the code`);
    assert.ok(r.html.includes("482 916"), `${directionId} html lost the code`);
  }
});

test("edge fixtures render without breaking layout assumptions", async () => {
  const longVenue = await renderEmail("outreach.venue-first", "letterhead", "long-venue-name");
  assert.ok(longVenue.text.includes("Ballyfarnon House and Walled Garden Estate"));
  const noName = await renderEmail("access.ready", "hairline", "no-first-name");
  assert.ok(!noName.text.includes("undefined"));
  assert.ok(noName.text.includes("Your place on the waitlist"));
  const manyWs = await renderEmail("account.deletion-scheduled", "letterhead", "many-workspaces");
  assert.ok(manyWs.text.includes("all 4 of your workspaces"));
});

test("review transforms: forced dark and blocked images", async () => {
  const r = await renderEmail("access.ready", "broadsheet", "default");
  const dark = forceDark(r.html);
  assert.ok(dark.includes("@media all"), "dark styles did not force on");
  const blocked = blockImages(r.html);
  assert.ok(!/<img[^>]*\ssrc="/i.test(blocked), "blocked images still carry src");
  assert.ok(/alt="[^"]+"/.test(blocked), "alt text lost in blocking transform");
});

test("founder outreach carries no button and no tracking furniture", async () => {
  for (const id of ["outreach.venue-first", "outreach.school-first"]) {
    for (const directionId of DIRECTION_IDS) {
      const r = await renderEmail(id, directionId, "default");
      assert.ok(!/Update your card|Join the waitlist/.test(r.html));
      assert.ok(r.text.toLowerCase().includes("reply"), `${id} must ask for a reply`);
      assert.ok(!r.html.includes("utm_"), `${id} carries tracking parameters`);
    }
  }
});
