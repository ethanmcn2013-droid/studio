import { clerk, clerkSetup } from "@clerk/testing/playwright";

const EMAIL_ENV = "EXPERIENCE_CAPTURE_EMAIL";
const CLERK_SECRET_ENV = "CLERK_SECRET_KEY";
const CLERK_PUBLISHABLE_ENV = "CLERK_PUBLISHABLE_KEY";
const HQ_PASSWORD_ENV = "SIGNAL_HQ_PASSWORD";

export async function prepareClerkTestingSession(env = process.env, setup = clerkSetup) {
  const secretKey = env[CLERK_SECRET_ENV];
  const publishableKey = env[CLERK_PUBLISHABLE_ENV];
  if (!secretKey || !publishableKey) {
    throw new Error(`Clerk capture setup requires ${CLERK_SECRET_ENV} and ${CLERK_PUBLISHABLE_ENV}`);
  }
  await setup({
    secretKey,
    publishableKey,
    dotenv: false,
  });
}

export function captureAuthentication(item, env = process.env) {
  if (!item.authentication) return null;
  if (!["clerk-testing-session", "hq-password"].includes(item.authentication.kind)) {
    throw new Error(`${item.experienceId}: unsupported authentication kind ${item.authentication.kind}`);
  }
  if (!item.authentication.signInUrl || !item.authentication.fixture) {
    throw new Error(`${item.experienceId}: authenticated capture requires signInUrl and fixture`);
  }
  if (item.authentication.kind === "hq-password") {
    const password = env[HQ_PASSWORD_ENV];
    if (!password) {
      throw new Error(`${item.experienceId}: authenticated capture requires ${HQ_PASSWORD_ENV}`);
    }
    return {
      kind: item.authentication.kind,
      signInUrl: item.authentication.signInUrl,
      fixture: item.authentication.fixture,
      password,
    };
  }
  const email = env[EMAIL_ENV]?.trim();
  const secretKey = env[CLERK_SECRET_ENV];
  const publishableKey = env[CLERK_PUBLISHABLE_ENV];
  if (!email || !secretKey || !publishableKey) {
    throw new Error(
      `${item.experienceId}: authenticated capture requires ${EMAIL_ENV}, ${CLERK_SECRET_ENV}, and ${CLERK_PUBLISHABLE_ENV}`,
    );
  }
  return {
    kind: item.authentication.kind,
    signInUrl: item.authentication.signInUrl,
    fixture: item.authentication.fixture,
    email,
  };
}

export async function signInWithClerkTestingSession({ page, authentication, signInUrl }) {
  const response = await page.goto(signInUrl, {
    waitUntil: "domcontentloaded",
    timeout: 45_000,
  });
  if (!response?.ok()) {
    throw new Error(`fixture sign-in returned HTTP ${response?.status() ?? "unknown"}`);
  }
  await clerk.signIn({ page, emailAddress: authentication.email });
}

export async function signInWithHqPassword({ page, authentication, signInUrl }) {
  const response = await page.goto(signInUrl, {
    waitUntil: "domcontentloaded",
    timeout: 45_000,
  });
  if (!response?.ok()) {
    throw new Error(`HQ fixture sign-in returned HTTP ${response?.status() ?? "unknown"}`);
  }
  const password = page.locator('input[name="password"][type="password"]').first();
  await password.waitFor({ state: "visible", timeout: 30_000 });
  await password.fill(authentication.password);
  await page.getByRole("button", { name: "Open Signal HQ", exact: true }).click();
  await page.waitForURL((url) => !url.pathname.startsWith("/hq/access"), { timeout: 45_000 });
}

export async function signInForCapture(options) {
  if (options.authentication.kind === "clerk-testing-session") {
    return signInWithClerkTestingSession(options);
  }
  if (options.authentication.kind === "hq-password") {
    return signInWithHqPassword(options);
  }
  throw new Error(`unsupported authentication kind ${options.authentication.kind}`);
}
