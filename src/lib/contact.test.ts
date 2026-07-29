import assert from "node:assert/strict";
import test from "node:test";
import {
  buildMailtoHref,
  CONTACT_EMAILS,
  CONTACT_SUBJECTS,
} from "./contact";

test("keeps the six verified aliases in one typed source", () => {
  assert.deepEqual(CONTACT_EMAILS, {
    general: "hello@signalstudio.ie",
    support: "support@signalstudio.ie",
    billing: "billing@signalstudio.ie",
    privacy: "privacy@signalstudio.ie",
    security: "security@signalstudio.ie",
    partnerships: "partnerships@signalstudio.ie",
  });
});

test("builds a bare general mail link without a trailing query", () => {
  assert.equal(buildMailtoHref("general"), "mailto:hello@signalstudio.ie");
});

test("encodes contextual subjects and bodies safely", () => {
  const href = buildMailtoHref("partnerships", {
    subject: "Wedding venue partnership enquiry, Adare & Co.",
    body: "Hi Ethan,\n\nRef: venue/adare manor",
  });
  const url = new URL(href);

  assert.equal(url.protocol, "mailto:");
  assert.equal(url.pathname, CONTACT_EMAILS.partnerships);
  assert.equal(url.searchParams.get("subject"), "Wedding venue partnership enquiry, Adare & Co.");
  assert.equal(url.searchParams.get("body"), "Hi Ethan,\n\nRef: venue/adare manor");
});

test("defines a useful default subject for every route", () => {
  assert.deepEqual(Object.keys(CONTACT_SUBJECTS), Object.keys(CONTACT_EMAILS));
});
