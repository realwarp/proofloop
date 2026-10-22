import "dotenv/config";

const baseUrl = (process.env.LLM_BASE_URL || "").replace(/\/+$/, "");
const apiKey = process.env.LLM_API_KEY || "";
const model = process.env.LLM_MODEL || "";

function fail(message) {
  console.error("\n[BLOCKED] " + message);
  process.exit(1);
}

console.log("ProofLoop AI Cloud endpoint preflight");
console.log("This sends one small inference request to the configured endpoint.");
console.log("Only run it after reviewing endpoint cost and approving use.");

if (!baseUrl || !apiKey || !model) {
  fail("Set LLM_BASE_URL, LLM_API_KEY, and LLM_MODEL in local .env.");
}
if (!baseUrl.startsWith("https://")) {
  fail("LLM_BASE_URL must be the HTTPS public endpoint URL plus /v1.");
}

async function requestJson(path, options = {}) {
  const response = await fetch(baseUrl + path, {
    ...options,
    signal: AbortSignal.timeout(30_000),
    headers: {
      Authorization: "Bearer " + apiKey,
      ...(options.headers || {}),
    },
  });
  const raw = await response.text();
  let data;
  try { data = JSON.parse(raw); } catch { data = { excerpt: raw.slice(0, 250) }; }
  if (!response.ok) {
    const hint = response.status === 401 || response.status === 403
      ? "Check the endpoint bearer token and endpoint authentication settings."
      : response.status === 404
      ? "Check that LLM_BASE_URL is the public endpoint URL with /v1, not the UI URL."
      : "Check endpoint status, model startup logs, network and current service limits.";
    fail("HTTP " + response.status + " for " + path + ". " + hint + "\nResponse excerpt: " + JSON.stringify(data).slice(0, 400));
  }
  return data;
}

console.log("\nGate 1/2: listing models served by the endpoint");
const catalogue = await requestJson("/models");
const ids = Array.isArray(catalogue?.data)
  ? catalogue.data.map((entry) => entry?.id).filter((id) => typeof id === "string")
  : [];
if (!ids.length) fail("Endpoint returned no model IDs. Check that vLLM finished loading the model.");
ids.forEach((id) => console.log("  - " + id));
if (!ids.includes(model)) {
  fail("LLM_MODEL does not exactly match a model ID from /models. Update LLM_MODEL to one of the IDs above.");
}

console.log("\nGate 2/2: making one small chat-completion request");
const completion = await requestJson("/chat/completions", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    model,
    messages: [
      { role: "system", content: "You are a concise connectivity check." },
      { role: "user", content: "Reply exactly: PROOFLOOP_AI_CLOUD_OK" },
    ],
    temperature: 0,
    max_tokens: 32,
  }),
});

const answer = completion?.choices?.[0]?.message?.content;
if (typeof answer !== "string" || !answer.trim()) {
  fail("The endpoint accepted the request but returned no message content.");
}
console.log("\n[PASS] Endpoint catalogue is accessible.");
console.log("[PASS] Real inference request returned text.");
console.log("Model: " + (completion.model || model));
console.log("Response: " + answer.trim().slice(0, 200));
if (completion.usage) console.log("Usage: " + JSON.stringify(completion.usage));
console.log("\nThis verifies inference only. Code execution and regression tests need separate evidence.");