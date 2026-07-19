import assert from "node:assert/strict";
import test from "node:test";

import {
  RetryableWebhookError,
  runRetryableWebhook,
} from "./webhook-lifecycle";

test("a failed privacy operation is not marked complete and can retry", async () => {
  let completed = false;
  let attempts = 0;
  const invoke = () =>
    runRetryableWebhook({
      alreadyCompleted: async () => completed,
      perform: async () => {
        attempts += 1;
        if (attempts === 1) throw new Error("transient");
        return "shredded";
      },
      markCompleted: async () => {
        completed = true;
      },
    });

  await assert.rejects(invoke, (error) => {
    assert.equal(error instanceof RetryableWebhookError, true);
    assert.equal((error as RetryableWebhookError).stage, "perform");
    return true;
  });
  assert.equal(completed, false);
  assert.deepEqual(await invoke(), { deduped: false, value: "shredded" });
  assert.deepEqual(await invoke(), { deduped: true });
});

test("a completion-write failure returns retryable state", async () => {
  let performed = 0;
  await assert.rejects(
    runRetryableWebhook({
      alreadyCompleted: async () => false,
      perform: async () => {
        performed += 1;
        return "done";
      },
      markCompleted: async () => {
        throw new Error("database unavailable");
      },
    }),
    (error) => {
      assert.equal((error as RetryableWebhookError).stage, "complete");
      return true;
    },
  );
  assert.equal(performed, 1);
});
