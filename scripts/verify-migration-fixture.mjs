import { spawnSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync, unlinkSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const fixture = resolve(here, "../fixtures/express-wildcard-migration");
const appFile = resolve(fixture, "src/app.js");
const lockFile = resolve(fixture, "package-lock.json");
const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";
const appOriginal = readFileSync(appFile, "utf8");
const hadLock = existsSync(lockFile);

function runNpm(args) {
  const result = spawnSync(npmCommand, args, {
    cwd: fixture,
    encoding: "utf8",
    shell: process.platform === "win32",
    timeout: 180_000,
    maxBuffer: 4 * 1024 * 1024,
  });
  const output = (result.stdout || "") + (result.stderr || "");
  return { status: result.status, output, error: result.error };
}

function report(label, result) {
  console.log("\\n=== " + label + " ===");
  if (result.output.trim()) console.log(result.output.trim());
  if (result.error) console.error(result.error.message);
  console.log("Exit code: " + result.status);
}

try {
  console.log("ProofLoop migration fixture verification");
  console.log("Scope: known fixture only; the original file will be restored before exit.");

  const install = runNpm(["install", "--no-audit", "--no-fund"]);
  report("Install pinned fixture dependencies", install);
  if (install.status !== 0) {
    throw new Error("Fixture dependency installation failed.");
  }

  const baseline = runNpm(["test"]);
  report("Intentional Express 5 baseline", baseline);
  if (baseline.status === 0) {
    throw new Error("Expected the intentionally broken baseline to fail, but it passed.");
  }
  if (!/Missing parameter name|path-to-regexp/i.test(baseline.output)) {
    throw new Error("Baseline failed for an unexpected reason; inspect output before proceeding.");
  }

  const oldRoute = 'app.get("*", (_req, res) => {';
  const newRoute = 'app.get("/{*splat}", (_req, res) => {';
  if (!appOriginal.includes(oldRoute) || appOriginal.indexOf(oldRoute) !== appOriginal.lastIndexOf(oldRoute)) {
    throw new Error("Expected exactly one known wildcard route in the fixture.");
  }

  writeFileSync(appFile, appOriginal.replace(oldRoute, newRoute), "utf8");
  const patched = runNpm(["test"]);
  report("Expected migrated fixture", patched);
  if (patched.status !== 0) {
    throw new Error("The expected migration patch did not pass the regression tests.");
  }

  console.log("\\n[PASS] Baseline failure was reproduced.");
  console.log("[PASS] The minimal migration made all 3 regression tests pass.");
  console.log("[PASS] This validates the fixture, not the AI agent.");
} catch (error) {
  console.error("\\n[FAIL] " + (error instanceof Error ? error.message : String(error)));
  process.exitCode = 1;
} finally {
  writeFileSync(appFile, appOriginal, "utf8");
  if (!hadLock && existsSync(lockFile)) unlinkSync(lockFile);
  console.log("\\nRestored the intentionally broken fixture baseline.");
}
