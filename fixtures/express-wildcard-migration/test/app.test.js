import test from "node:test";
import assert from "node:assert/strict";
import { createApp } from "../src/app.js";

async function withServer(t, run) {
  const app = createApp();
  const server = app.listen(0, "127.0.0.1");
  await new Promise((resolve, reject) => {
    server.once("listening", resolve);
    server.once("error", reject);
  });
  t.after(() => new Promise((resolve, reject) => {
    server.close((error) => error ? reject(error) : resolve());
  }));
  const address = server.address();
  assert.ok(address && typeof address === "object");
  await run("http://127.0.0.1:" + address.port);
}

test("health route remains available", async (t) => {
  await withServer(t, async (baseUrl) => {
    const response = await fetch(baseUrl + "/health");
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { ok: true });
  });
});

test("root URL serves the SPA shell", async (t) => {
  await withServer(t, async (baseUrl) => {
    const response = await fetch(baseUrl + "/");
    assert.equal(response.status, 200);
    assert.match(response.headers.get("content-type") || "", /text\/html/);
    assert.equal(await response.text(), "app-shell");
  });
});

test("nested client-side route serves the SPA shell", async (t) => {
  await withServer(t, async (baseUrl) => {
    const response = await fetch(baseUrl + "/dashboard/settings");
    assert.equal(response.status, 200);
    assert.equal(await response.text(), "app-shell");
  });
});
