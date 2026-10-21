import test from "node:test";
import assert from "node:assert/strict";

test("typecheck and model smoke-test scripts are configured", async () => {
  const fs = await import("node:fs/promises");
  const pkg = JSON.parse(
    await fs.readFile(new URL("../../package.json", import.meta.url), "utf8"),
  ) as { scripts?: Record<string, string> };

  assert.equal(pkg.scripts?.typecheck, "tsc --noEmit");
  assert.equal(pkg.scripts?.["test:model"], "tsx src/smoke-test.ts");
});

test("gitignore excludes real environment credentials", async () => {
  const fs = await import("node:fs/promises");
  const gitignore = await fs.readFile(
    new URL("../../.gitignore", import.meta.url),
    "utf8",
  );

  assert.match(gitignore, /^\.env$/m);
  assert.match(gitignore, /^\.env\.\*$/m);
  assert.match(gitignore, /^!\.env\.example$/m);
});
