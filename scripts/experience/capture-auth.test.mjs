import assert from "node:assert/strict";
import { test } from "node:test";
import { captureAuthentication } from "./capture-auth.mjs";

const item = {
  experienceId: "tasks.page.app",
  authentication: {
    kind: "clerk-testing-session",
    signInUrl: "https://tasks.signalstudio.ie/sign-in",
    fixture: "signal-experience-capture",
  },
};

test("public captures need no credentials", () => {
  assert.equal(captureAuthentication({ experienceId: "studio.page.root" }, {}), null);
});

test("authenticated captures fail closed without both protected credentials", () => {
  assert.throws(
    () => captureAuthentication(item, { EXPERIENCE_CAPTURE_EMAIL: "fixture@example.com" }),
    /EXPERIENCE_CAPTURE_EMAIL, CLERK_SECRET_KEY, and CLERK_PUBLISHABLE_KEY/,
  );
  assert.throws(
    () => captureAuthentication(item, { CLERK_SECRET_KEY: "sk_live_secret", CLERK_PUBLISHABLE_KEY: "pk_live_public" }),
    /EXPERIENCE_CAPTURE_EMAIL, CLERK_SECRET_KEY, and CLERK_PUBLISHABLE_KEY/,
  );
});

test("authenticated captures resolve the isolated fixture without exposing it to source data", () => {
  const authentication = captureAuthentication(item, {
    EXPERIENCE_CAPTURE_EMAIL: "fixture@example.com",
    CLERK_SECRET_KEY: "sk_live_secret",
    CLERK_PUBLISHABLE_KEY: "pk_live_public",
  });
  assert.deepEqual(authentication, {
    kind: "clerk-testing-session",
    signInUrl: "https://tasks.signalstudio.ie/sign-in",
    fixture: "signal-experience-capture",
    email: "fixture@example.com",
  });
});

test("unknown authentication kinds fail closed", () => {
  assert.throws(
    () => captureAuthentication({ ...item, authentication: { ...item.authentication, kind: "invented" } }, {}),
    /unsupported authentication kind invented/,
  );
});

test("HQ captures use only the protected HQ password", () => {
  const authentication = captureAuthentication({
    experienceId: "studio.page.hq-experience-quality",
    authentication: {
      kind: "hq-password",
      signInUrl: "https://signalstudio.ie/hq/access?from=/hq/experience-quality",
      fixture: "signal-hq-founder-operator",
    },
  }, { SIGNAL_HQ_PASSWORD: "secret" });
  assert.deepEqual(authentication, {
    kind: "hq-password",
    signInUrl: "https://signalstudio.ie/hq/access?from=/hq/experience-quality",
    fixture: "signal-hq-founder-operator",
    password: "secret",
  });
  assert.throws(
    () => captureAuthentication({
      experienceId: "studio.page.hq-experience-quality",
      authentication: {
        kind: "hq-password",
        signInUrl: "https://signalstudio.ie/hq/access",
        fixture: "signal-hq-founder-operator",
      },
    }, {}),
    /SIGNAL_HQ_PASSWORD/,
  );
});
