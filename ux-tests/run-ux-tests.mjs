import { spawn } from "node:child_process";

function stamp() {
  return new Date().toISOString().replace(/[:.]/g, "-");
}

const args = process.argv.slice(2);
const passthrough = [];
const env = { ...process.env, UX_RUN_ID: process.env.UX_RUN_ID ?? stamp() };

for (let i = 0; i < args.length; i += 1) {
  const arg = args[i];
  if (arg === "--persona") {
    env.UX_PERSONA = args[++i] ?? "student";
  } else if (arg === "--journey") {
    env.UX_JOURNEY = args[++i] ?? "";
  } else if (arg === "--scenario") {
    env.UX_SCENARIO = args[++i] ?? "full-workflow.student";
    env.UX_JOURNEY = "scenario";
  } else if (arg === "--keyboard") {
    env.UX_JOURNEY = "keyboard";
  } else if (arg === "--mobile") {
    env.UX_PROJECT = "mobile-chromium";
  } else if (arg === "--project") {
    env.UX_PROJECT = args[++i] ?? "desktop-chromium";
  } else if (arg === "--all-projects") {
    env.UX_PROJECT = "all";
  } else if (arg === "--ai-change") {
    env.UX_AI_CHANGE = "1";
  } else if (arg === "--strict-console") {
    env.UX_CONSOLE_STRICT = "1";
  } else if (arg === "--headed") {
    passthrough.push("--headed");
  } else if (arg === "--debug") {
    passthrough.push("--debug");
  } else if (arg === "--ui") {
    passthrough.push("--ui");
  } else if (arg === "--") {
    passthrough.push(...args.slice(i + 1));
    break;
  } else {
    passthrough.push(arg);
  }
}

if (!env.UX_PERSONA) env.UX_PERSONA = "student";

const command = "corepack";
const commandArgs = ["pnpm", "exec", "playwright", "test", ...passthrough];
const child =
  process.platform === "win32"
    ? spawn("cmd.exe", ["/d", "/c", commandLineForCmd(command, commandArgs)], {
        cwd: process.cwd(),
        env,
        stdio: "inherit",
      })
    : spawn(command, commandArgs, {
        cwd: process.cwd(),
        env,
        stdio: "inherit",
      });

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }
  process.exit(code ?? 1);
});

function commandLineForCmd(bin, args) {
  return [bin, ...args].map(quoteCmdPart).join(" ");
}

function quoteCmdPart(part) {
  const value = String(part);
  return /[\s&()^|<>]/.test(value) ? `"${value}"` : value;
}
