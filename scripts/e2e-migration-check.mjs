import { spawnSync } from "node:child_process";
import {
  cpSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, "..");
const fixtureSource = resolve(repoRoot, "fixtures/express-wildcard-migration");
const outputDir = resolve(repoRoot, "artifacts/e2e");
const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";
const tempRoot = mkdtempSync(join(tmpdir(), "proofloop-e2e-"));
const tempFixture = join(tempRoot, "fixtures", "express-wildcard-migration");

mkdirSync(outputDir, { recursive: true });

const report = {
  schemaVersion: 1,
  project: "ProofLoop",
  scenario: "Express 5 SPA wildcard migration",
  startedAt: new Date().toISOString(),
  status: "running",
  environment: {
    node: process.version,
    platform: process.platform,
    runner: process.env.GITHUB_ACTIONS === "true"
      ? "GitHub Actions hosted runner"
      : "Local runtime (not Nebius cloud)",
    isolation: "Tests run in a fresh temporary copy of the fixture; the tracked repository fixture is not modified.",
  },
  research: {
    source: "https://expressjs.com/en/guide/migrating-5/",
    finding: "Express 5 requires named wildcard parameters. The documented /{*splat} form also matches the root URL.",
  },
  patch: {
    status: "not-generated",
    sourcePath: "fixtures/express-wildcard-migration/src/app.js",
    oldRoute: 'app.get("*", (_req, res) => {',
    newRoute: 'app.get("/{*splat}", (_req, res) => {',
    generatedBy: "Deterministic, source-grounded migration rule; this is not an AI-generated patch.",
    appliedTo: "temporary fixture copy only",
  },
  stages: {},
};

function run(command, args, cwd, timeout = 180_000) {
  const started = Date.now();
  const result = spawnSync(command, args, {
    cwd,
    encoding: "utf8",
    shell: process.platform === "win32",
    timeout,
    maxBuffer: 8 * 1024 * 1024,
    env: { ...process.env, CI: "true" },
  });
  const output = (result.stdout || "") + (result.stderr || "");
  return {
    command: [command, ...args].join(" "),
    exitCode: result.status,
    signal: result.signal || null,
    durationMs: Date.now() - started,
    output,
    error: result.error ? result.error.message : null,
  };
}

function recordStage(name, result) {
  report.stages[name] = {
    command: result.command,
    exitCode: result.exitCode,
    signal: result.signal,
    durationMs: result.durationMs,
    error: result.error,
    outputFile: name + ".log",
    output: result.output,
  };
  writeFileSync(join(outputDir, name + ".log"), result.output, "utf8");
  console.log("\n=== " + name + " ===");
  if (result.output.trim()) console.log(result.output.trim());
  if (result.error) console.error(result.error);
  console.log("Exit code: " + result.exitCode);
}

try {
  if (!existsSync(join(fixtureSource, "src/app.js"))) {
    throw new Error("Expected fixture source file was not found in the repository.");
  }

  mkdirSync(dirname(tempFixture), { recursive: true });
  cpSync(fixtureSource, tempFixture, { recursive: true });

  const install = run(npmCommand, ["install", "--no-audit", "--no-fund"], tempFixture);
  recordStage("install", install);
  if (install.exitCode !== 0) {
    throw new Error("Dependency installation failed; no test verdict can be made.");
  }

  const baseline = run(npmCommand, ["test"], tempFixture);
  recordStage("baseline", baseline);
  if (baseline.exitCode === 0) {
    throw new Error("The baseline unexpectedly passed; the intended defect was not reproduced.");
  }
  if (!/Missing parameter name|path-to-regexp/i.test(baseline.output)) {
    throw new Error("The baseline failed for an unexpected reason, not the documented Express 5 wildcard incompatibility.");
  }
  report.stages.baseline.expectedFailureConfirmed = true;

  const appPath = join(tempFixture, "src/app.js");
  const original = readFileSync(appPath, "utf8");
  const oldRoute = 'app.get("*", (_req, res) => {';
  const newRoute = 'app.get("/{*splat}", (_req, res) => {';
  if (!original.includes(oldRoute) || original.indexOf(oldRoute) !== original.lastIndexOf(oldRoute)) {
    throw new Error("Expected exactly one known wildcard route; refusing an ambiguous patch.");
  }

  const lines = original.split("\n");
  const routeIndex = lines.findIndex((line) => line.includes(oldRoute));
  if (routeIndex < 0) throw new Error("Could not locate the route line for the patch.");

  const contextStart = Math.max(0, routeIndex - 3);
  const contextEnd = Math.min(lines.length, routeIndex + 3);
  const contextBefore = lines.slice(contextStart, routeIndex);
  const contextAfter = lines.slice(routeIndex + 1, contextEnd);
  const startLine = contextStart + 1;
  const lineCount = contextBefore.length + 1 + contextAfter.length;
  const routeLine = lines[routeIndex];
  const patchedRouteLine = routeLine.replace(oldRoute, newRoute);
  const patch = [
    "diff --git a/fixtures/express-wildcard-migration/src/app.js b/fixtures/express-wildcard-migration/src/app.js",
    "--- a/fixtures/express-wildcard-migration/src/app.js",
    "+++ b/fixtures/express-wildcard-migration/src/app.js",
    "@@ -" + startLine + "," + lineCount + " +" + startLine + "," + lineCount + " @@",
    ...contextBefore.map((line) => " " + line),
    "-" + routeLine,
    "+" + patchedRouteLine,
    ...contextAfter.map((line) => " " + line),
  ].join("\n") + "\n";
  const patchPath = join(outputDir, "express-wildcard-migration.patch");
  writeFileSync(patchPath, patch, "utf8");

  const patchCheck = run("git", ["apply", "--check", patchPath], tempRoot);
  recordStage("patch-check", patchCheck);
  if (patchCheck.exitCode !== 0) throw new Error("The generated patch failed git apply --check.");

  const applyPatch = run("git", ["apply", patchPath], tempRoot);
  recordStage("apply-patch", applyPatch);
  if (applyPatch.exitCode !== 0) throw new Error("git apply failed to apply the generated patch.");

  const patchedSource = readFileSync(appPath, "utf8");
  if (!patchedSource.includes(newRoute) || patchedSource.includes(oldRoute)) {
    throw new Error("Applied file content does not match the intended migration.");
  }
  report.patch.status = "generated-validated-and-applied-to-temporary-copy";
  report.patch.appliedBy = "git apply";
  report.patch.diffFile = "express-wildcard-migration.patch";

  const patched = run(npmCommand, ["test"], tempFixture);
  recordStage("patched", patched);
  if (patched.exitCode !== 0) {
    throw new Error("The patched fixture failed its regression suite.");
  }
  if (!/# tests\s+3/.test(patched.output) || !/# pass\s+3/.test(patched.output) || !/# fail\s+0/.test(patched.output)) {
    throw new Error("The command exited successfully, but the captured output did not prove that all 3 tests passed.");
  }

  report.stages.patched.allThreeRegressionTestsPassed = true;
  report.status = "passed";
  report.summary = "Expected baseline failure reproduced; source-grounded patch applied to temporary copy; all 3 HTTP regression tests passed.";
  console.log("\n[PASS] Expected Express 5 baseline failure reproduced.");
  console.log("[PASS] Minimal source-grounded patch generated.");
  console.log("[PASS] All 3 HTTP regression tests passed.");
  console.log("[SCOPE] This verifies the migration fixture and patch/test harness, not the unfinished AI agent or Nebius cloud execution.");
} catch (error) {
  report.status = "failed";
  report.error = error instanceof Error ? error.message : String(error);
  console.error("\n[FAIL] " + report.error);
  process.exitCode = 1;
} finally {
  report.completedAt = new Date().toISOString();
  writeFileSync(join(outputDir, "report.json"), JSON.stringify(report, null, 2) + "\n", "utf8");
  console.log("\nMachine-readable report: artifacts/e2e/report.json");
  console.log("Patch artifact: artifacts/e2e/express-wildcard-migration.patch");
  rmSync(tempRoot, { recursive: true, force: true });
}
