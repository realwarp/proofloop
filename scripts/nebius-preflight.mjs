import "dotenv/config";

const baseUrl = (process.env.NEBIUS_BASE_URL || "https://api.tokenfactory.nebius.com/v1").replace(/\\/+$/, "");
const apiKey = process.env.NEBIUS_API_KEY || "";

function fail(message) {
  console.error("\\n[BLOCKED] " + message);
  process.exit(1);
}

if (!apiKey) {
  fail("NEBIUS_API_KEY is missing. Add a Token Factory API key to the local .env. Never commit it.");
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
  const text = await response.text();
  let body;
  try { body = JSON.parse(text); } catch { body = { excerpt: text.slice(0, 250) }; }
  if (!response.ok) {
    const hint = response.status === 401
      ? "Token Factory rejected the key. Confirm this is a Token Factory API key, not an NVIDIA Catalog key."
      : response.status === 403
      ? "The key was accepted but this project may lack permission for the requested resource."
      : response.status === 404
      ? "Verify the base URL and endpoint path."
      : "Check the response, account limits, and Token Factory status.";
    fail("HTTP " + response.status + " for " + path + ". " + hint + "\\nResponse excerpt: " + JSON.stringify(body).slice(0, 500));
  }
  return body;
}

console.log("ProofLoop / Nebius Token Factory preflight");
console.log("Base URL: " + baseUrl);
console.log("Gate 1/2: read model catalogue");

const catalogue = await requestJson("/models");
const models = Array.isArray(catalogue?.data) ? catalogue.data : [];
const ids = models.map((item) => item?.id).filter((id) => typeof id === "string");
const nemotrons = ids.filter((id) => /nemotron/i.test(id) && /nvidia/i.test(id));

if (!nemotrons.length) {
  console.error("The catalogue returned " + ids.length + " model IDs, but none matched NVIDIA Nemotron.");
  console.error("Inspect the selected Token Factory project and current model access.");
  process.exit(2);
}

console.log("Nemotron models visible to this API key:");
nemotrons.forEach((id) => console.log("  - " + id));

const preferred = process.env.NEBIUS_MODEL || "nvidia/nemotron-3-super-120b-a12b";
const selected =
  ids.find((id) => id.toLowerCase() === preferred.toLowerCase()) ||
  nemotrons.find((id) => /nemotron-3.*lightning/i.test(id)) ||
  nemotrons.find((id) => /nemotron-3.*super/i.test(id)) ||
  nemotrons[0];

console.log("\\nGate 2/2: real inference request with " + selected);
const completion = await requestJson("/chat/completions", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    model: selected,
    messages: [
      { role: "system", content: "You are a brief API connectivity check." },
      { role: "user", content: "Reply exactly: PROOFLOOP_NEBIUS_OK" },
    ],
    temperature: 0,
    max_tokens: 32,
  }),
});

const answer = completion?.choices?.[0]?.message?.content;
if (typeof answer !== "string" || !answer.trim()) {
  fail("The inference endpoint returned no text content. Try a different Nemotron ID shown in the catalogue.");
}

console.log("\\n[PASS] Token Factory model catalogue is accessible.");
console.log("[PASS] A real inference request returned text.");
console.log("Selected model: " + (completion.model || selected));
console.log("Response: " + answer.trim().slice(0, 200));
if (completion.usage) console.log("Usage: " + JSON.stringify(completion.usage));
console.log("\\nNote: this does not prove Sandboxes access. Run python scripts/sandbox-smoke.py separately.");
