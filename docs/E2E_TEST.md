# End-to-End Migration Verification

## Purpose

This is the deliberately narrow first end-to-end check for ProofLoop. It uses the official Express migration guide, reproduces the known broken fixture, creates a minimal repository-specific patch, and runs the HTTP regression tests in a fresh temporary copy.

Official source: https://expressjs.com/en/guide/migrating-5/

The source states that Express 5 wildcard paths need a name and that /{*splat} includes the root URL. The fixture has an Express 5.1.0 unnamed-wildcard route and three HTTP checks: /health, /, and /dashboard/settings.

## Run

~~~powershell
npm install
npm run test:e2e:migration
~~~

The command installs the fixture's pinned Express dependency in a temporary directory, then:

1. Runs the baseline and confirms that it fails specifically with the Express 5 wildcard/path-to-regexp error.
2. Applies the one-line migration patch to the temporary copy only.
3. Runs the same tests and requires all three to pass.
4. Captures command output, exit codes, durations, environment, and patch in artifacts/e2e/.
5. Removes the temporary workspace. The intentionally broken tracked fixture remains unchanged.

## Evidence files

- artifacts/e2e/report.json — structured run summary and captured output.
- artifacts/e2e/install.log — dependency installation output.
- artifacts/e2e/baseline.log — actual expected-failure output and exit code, summarized in the report.
- artifacts/e2e/patch-check.log — output and exit code from `git apply --check`.
- artifacts/e2e/apply-patch.log — output and exit code from applying the generated patch to the temporary copy.
- artifacts/e2e/patched.log — actual regression test output and exit code, summarized in the report.
- artifacts/e2e/express-wildcard-migration.patch — one-line unified patch.

GitHub Actions runs this check on the hosted runner and uploads those files as a workflow artifact. That is an isolated GitHub Actions execution, **not** Nebius Token Factory Sandboxes or Nebius AI Cloud execution.

## Honest scope boundary

This proves only that the documented migration rule produces a patch that fixes this known fixture. The patch is deterministic and source-grounded, not model-generated. ProofLoop's current /api/agent/plan endpoint still only produces a plan; it does not inspect a repository, apply patches, invoke tests, or implement the full agent loop. A successful run must not be presented as proof that autonomous repair works.

## Pass criteria

- Baseline command exits non-zero for the expected wildcard error.
- Patched command exits zero.
- Captured output explicitly reports 3 tests, 3 passes, and 0 failures.
- Patch artifact changes only the wildcard route from * to /{*splat}.
- The tracked fixture remains intentionally broken after the check.