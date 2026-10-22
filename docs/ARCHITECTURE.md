# ProofLoop Architecture

## Current scaffold

~~~text
Client / curl
    |
    v
Node.js HTTP API
    |-- GET /api/health
    |-- POST /api/agent/plan
    |
    v
Provider-neutral model adapter
    |
    v
Configured OpenAI-compatible inference API
~~~

## Primary Nebius AI Cloud plan

- Serve the open NVIDIA model nvidia/NVIDIA-Nemotron-Nano-9B-v2 through vLLM on a Nebius AI Cloud Serverless AI endpoint, only after the account-access and cost gate has passed.
- Keep the app's existing model adapter provider-neutral. Configure it using the endpoint's public HTTPS URL plus /v1, its generated bearer token, and the exact model ID served by vLLM.
- Execute the first real agent coding task and regression tests on an allowed Nebius AI Cloud compute path and capture process evidence.
- Do not represent local fixture runs as cloud execution.
- The official Coding and Agentic Engineering track wording calls out Token Factory. Confirm this route's track fit with organizers if Token Factory remains inaccessible.

Official endpoint tutorial: https://docs.nebius.com/serverless/tutorials/deploy-model

## Cost and access boundaries

- Do not add a payment card, make a payment, create a serverless endpoint, or allocate a GPU unless the user explicitly approves the displayed cost.
- The current official FAQ says Builder Program credits are Token Factory credits and it does not publish a separate AI Cloud credit grant.
- If the account's country/billing onboarding is blocked, use the official support route rather than altering billing country or address.
- The endpoint and underlying compute are chargeable; see https://nebius.com/prices and the current console estimate.

## Target workflow

1. Receive a task and an explicitly selected repository path.
2. Validate path and repository size; make an isolated temporary working copy.
3. Inspect files and tests without executing repository code.
4. Ask the configured model for a structured plan and proposed changes.
5. Validate every requested file path and patch format.
6. Apply the patch only inside the temporary working copy.
7. Execute a strict allowlist of test/build commands using isolated cloud execution with no secrets and restricted networking.
8. Capture stdout/stderr, exit code, duration, and timeout status.
9. On failure, provide limited test output to the model and allow a bounded repair attempt.
10. Produce an evidence-backed verdict: passed, failed, or unverified.
11. Keep a run record and compare iterative execution against a single-pass baseline.

## Safety boundaries

- Do not run arbitrary model-generated shell commands.
- Never mount the host home directory or Docker socket into task containers.
- Never pass provider credentials to the tested code.
- Enforce time, memory, output-size, and retry limits.
- Require user consent before exporting or applying patches outside the isolated workspace.
- Treat source files, test output, and web search results as untrusted input.
- A model's self-report must never determine test status; use process exit codes and captured outputs.
- Delete or stop chargeable endpoints when they are not needed, then verify their status in the console.

## Alternate development path

NVIDIA API Catalog can still be used temporarily for development, but inference through a different provider does not satisfy the final hackathon requirement. Token Factory scripts remain as an optional alternate if support unblocks that service. See docs/INFRASTRUCTURE_GATE.md.