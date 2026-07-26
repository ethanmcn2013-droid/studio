import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { ACCOUNT_SAMPLE_FIXTURES, accountSamplePath } from "./samples";
import { scanTextForPrivacyLeaks } from "./privacy";

describe("Generated account samples", () => {
  for (const fixture of ACCOUNT_SAMPLE_FIXTURES) {
    it(`${fixture} PDF/CSV artifacts exist with sample labelling`, () => {
      const csvPath = accountSamplePath(fixture, "csv");
      const pdfPath = accountSamplePath(fixture, "pdf");
      const textPath = pdfPath + ".txt";
      assert.equal(existsSync(csvPath), true);
      assert.equal(existsSync(pdfPath), true);
      assert.equal(existsSync(textPath), true);

      const csv = readFileSync(csvPath, "utf8");
      const text = readFileSync(textPath, "utf8");
      assert.match(csv, /SAMPLE · DETERMINISTIC REVIEW DATA/);
      assert.match(text, /SAMPLE · DETERMINISTIC REVIEW DATA/);
      assert.deepEqual(scanTextForPrivacyLeaks(csv), []);
      assert.deepEqual(scanTextForPrivacyLeaks(text), []);
    });
  }
});
