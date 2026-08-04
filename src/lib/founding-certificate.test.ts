import test from "node:test";
import assert from "node:assert/strict";
import {
  buildFoundingCertificate,
  EMPTY_CERTIFICATE_INPUT,
  foundingCertificateProse,
  type FoundingCertificateInput,
} from "./founding-certificate";
import { sweepVenueCopy } from "./venue-copy-refusals";

const PAID: FoundingCertificateInput = {
  venueName: "Glenmara House",
  foundingNumber: 4,
  paymentClearedOn: "14 September 2026",
  venuePlan: "founding",
};

function issued(input: FoundingCertificateInput = PAID) {
  const certificate = buildFoundingCertificate(input);
  assert.equal(certificate.state, "issued", "expected an issued certificate");
  if (certificate.state !== "issued") throw new Error("unreachable");
  return certificate;
}

/* ── The rule that shapes the module: no payment, no certificate ───────── */

test("an empty input produces no certificate", () => {
  const c = buildFoundingCertificate(EMPTY_CERTIFICATE_INPUT);
  assert.equal(c.state, "refused");
});

test("a signed venue whose payment has not cleared gets no certificate", () => {
  const c = buildFoundingCertificate({ ...PAID, paymentClearedOn: "" });
  assert.equal(c.state, "refused");
  if (c.state !== "refused") throw new Error("unreachable");
  assert.match(c.reason, /never on signature/);
});

test("a venue with no number gets no certificate, even having paid", () => {
  const c = buildFoundingCertificate({ ...PAID, foundingNumber: null });
  assert.equal(c.state, "refused");
});

test("a venue not on the founding plan gets no certificate", () => {
  const c = buildFoundingCertificate({ ...PAID, venuePlan: "standard" });
  assert.equal(c.state, "refused");
  if (c.state !== "refused") throw new Error("unreachable");
  assert.match(c.reason, /only founding venues receive a number/);
});

test("a number outside 01 to 25 is refused in both directions", () => {
  for (const n of [0, -1, 26, 100, 1.5]) {
    const c = buildFoundingCertificate({ ...PAID, foundingNumber: n });
    assert.equal(c.state, "refused", `number ${n} was accepted`);
  }
});

test("there is no code path that renders a blank number", () => {
  const prose = foundingCertificateProse(
    buildFoundingCertificate({ ...PAID, foundingNumber: null }),
  );
  assert.ok(!prose.join(" ").includes("__"), "no blank to write into");
  assert.ok(!prose.join(" ").includes("/25"), "no number shape at all");
});

/* ── The number ────────────────────────────────────────────────────────── */

test("the number is zero padded NN/25", () => {
  assert.equal(issued().number, "04/25");
  assert.equal(issued({ ...PAID, foundingNumber: 1 }).number, "01/25");
  assert.equal(issued({ ...PAID, foundingNumber: 25 }).number, "25/25");
});

test("the statement names the venue and the place, and says payment cleared", () => {
  const c = issued();
  assert.equal(
    c.statement,
    "Glenmara House holds place 04/25 in the Founding 25, assigned when the first payment cleared.",
  );
});

test("the record carries the date the payment cleared, not a signature date", () => {
  const c = issued();
  const labels = c.record.map((line) => line.label);
  assert.ok(labels.includes("Payment cleared"));
  assert.ok(!labels.some((l) => /sign/i.test(l)), "no signature field");
  const cleared = c.record.find((l) => l.label === "Payment cleared");
  assert.equal(cleared?.value, "14 September 2026");
});

/* ── The price never travels without its conditions ────────────────────── */

test("the rate appears with the VAT wording and the lock condition", () => {
  const terms = issued().terms.join(" ");
  assert.match(terms, /€1,000 a year, prepaid, including VAT at the prevailing rate/);
  assert.match(terms, /€1,500/);
  assert.match(terms, /renews continuously without lapse/);
  assert.match(terms, /follows the property/);
});

test("no bare price appears anywhere on the certificate", () => {
  for (const line of foundingCertificateProse(issued())) {
    if (!/€1,000|€1,500/.test(line)) continue;
    assert.match(
      line,
      /including VAT at the prevailing rate/,
      `a price travelled without its VAT wording: ${line}`,
    );
  }
});

/* ── Permanence: the thing a wall-hung object is most likely to imply ──── */

test("the certificate implies no permanence", () => {
  const text = foundingCertificateProse(issued()).join("\n");
  for (const banned of [
    /\bfor life\b/i,
    /\bforever\b/i,
    /\bin perpetuity\b/i,
    /\bperpetual\b/i,
    /\blifetime\b/i,
    /\bpermanent\b/i,
    /\bnever expires?\b/i,
    /\bguaranteed\b/i,
    /\balways\b/i,
  ]) {
    assert.doesNotMatch(text, banned);
  }
});

test("the certificate says plainly that it is not the agreement", () => {
  assert.match(
    issued().terms.join(" "),
    /It is not the agreement, and it does not grant access on its own\./,
  );
});

/* ── The retired term (D-033) and the whole refusal set ────────────────── */

test("no prohibited claim, banned term or banned punctuation reaches the certificate", () => {
  const found = sweepVenueCopy(foundingCertificateProse(issued()));
  assert.deepEqual(
    found,
    [],
    found.map((f) => `${f.rule}: ${f.line}`).join("\n"),
  );
});

test("every refusal reason is swept too", () => {
  const refusals = [
    EMPTY_CERTIFICATE_INPUT,
    { ...PAID, paymentClearedOn: "" },
    { ...PAID, foundingNumber: null },
    { ...PAID, venuePlan: "standard" },
  ].map((input) => buildFoundingCertificate(input));
  for (const certificate of refusals) {
    const found = sweepVenueCopy(foundingCertificateProse(certificate));
    assert.deepEqual(
      found,
      [],
      found.map((f) => `${f.rule}: ${f.line}`).join("\n"),
    );
  }
});

test("the programme is named Founding 25 and the venue is not called anything else", () => {
  const text = foundingCertificateProse(issued()).join("\n");
  assert.match(text, /Founding 25/);
  assert.doesNotMatch(text, /founding partner/i);
});

/* ── No implied legal or professional review (D-016) ───────────────────── */

test("the certificate claims no review, award, accreditation or standard", () => {
  const text = foundingCertificateProse(issued()).join("\n");
  for (const banned of [
    /\bcertified\b/i,
    /\baccredited\b/i,
    /\bapproved\b/i,
    /\baward/i,
    /\bverified\b/i,
    /\bendorsed\b/i,
  ]) {
    assert.doesNotMatch(text, banned);
  }
});

test("the signature names one person and no title beyond the company", () => {
  assert.equal(
    issued().signature,
    "Ethan McNamara · Signal Studio · signalstudio.ie",
  );
});

/* ── Whitespace is not a value ─────────────────────────────────────────── */

test("whitespace is not a venue name and not a cleared payment", () => {
  assert.equal(buildFoundingCertificate({ ...PAID, venueName: "  " }).state, "refused");
  assert.equal(
    buildFoundingCertificate({ ...PAID, paymentClearedOn: "  " }).state,
    "refused",
  );
});
