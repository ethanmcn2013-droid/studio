import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  PRODUCT_IDS,
  PRODUCT_REGISTRY,
  SUITE_CONTRACT_VERSION,
  createSuiteObjectRef,
  isSuiteContext,
  isSuiteObjectRef,
  productUrl,
} from "./contracts";

describe("suite contracts", () => {
  it("keeps the five independently deployed surfaces in one registry", () => {
    assert.deepEqual(PRODUCT_IDS, ["studio", "tasks", "timeline", "signal", "notes"]);
    assert.equal(PRODUCT_REGISTRY.tasks.canonicalUrl, "https://tasks.signalstudio.ie");
    assert.equal(PRODUCT_REGISTRY.notes.access, "private-first");
    assert.equal(productUrl("timeline", "/workspaces/demo"),
      "https://timeline.signalstudio.ie/workspaces/demo",
    );
  });

  it("creates and validates a versioned object reference", () => {
    const ref = createSuiteObjectRef({
      product: "tasks",
      type: "task",
      id: "task-123",
      workspaceId: "workspace-1",
      canonicalUrl: "https://tasks.signalstudio.ie/app/tasks/task-123",
    });

    assert.equal(ref.version, SUITE_CONTRACT_VERSION);
    assert.equal(isSuiteObjectRef(ref), true);
    assert.equal(isSuiteObjectRef({ ...ref, version: 2 }), false);
    assert.equal(isSuiteObjectRef({ ...ref, product: "studio" }), false);
    assert.equal(isSuiteObjectRef({ ...ref, product: "unknown" }), false);
    assert.equal(isSuiteObjectRef({ ...ref, canonicalUrl: "javascript:alert(1)" }), false);
  });

  it("accepts context with a return path and rejects malformed context", () => {
    const ref = createSuiteObjectRef({
      product: "notes",
      type: "note",
      id: "note-7",
      canonicalUrl: "https://notes.signalstudio.ie/app/note/note-7",
    });

    assert.equal(
      isSuiteContext({
        sourceProduct: "studio",
        workspaceId: "workspace-1",
        objectRef: ref,
        returnUrl: "https://signalstudio.ie/hq",
      }),
      true,
    );
    assert.equal(isSuiteContext({ sourceProduct: "unknown" }), false);
    assert.equal(isSuiteContext({ sourceProduct: "tasks", returnUrl: "/relative" }), false);
  });
});
